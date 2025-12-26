// API Key Tester - Tests which AI providers are working
// Helps identify which APIs have valid keys and are not rate limited

import { AI_PROVIDERS, formatRequest, parseResponse } from '../config/aiProviders';

export interface APITestResult {
  provider: string;
  name: string;
  status: 'success' | 'error' | 'rate_limited' | 'unauthorized';
  message: string;
  responseTime?: number;
}

export class APITester {
  
  /**
   * Test a single AI provider
   */
  static async testProvider(providerKey: string): Promise<APITestResult> {
    const provider = AI_PROVIDERS[providerKey];
    
    if (!provider || !provider.apiKey || provider.apiKey === '' || provider.apiKey === 'YOUR_API_KEY_HERE') {
      return {
        provider: providerKey,
        name: provider?.name || 'Unknown',
        status: 'error',
        message: 'No API key configured'
      };
    }
    
    const startTime = Date.now();
    
    try {
      const testPrompt = 'Say "Hello" in one word only.';
      const requestData = formatRequest(providerKey, testPrompt);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      let url = provider.endpoint;
      
      if (providerKey === 'google') {
        url = `${provider.endpoint}?key=${provider.apiKey}`;
      } else if (providerKey === 'anthropic') {
        headers['x-api-key'] = provider.apiKey;
        headers['anthropic-version'] = '2023-06-01';
      } else {
        headers['Authorization'] = `Bearer ${provider.apiKey}`;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
      });
      
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 401) {
          return {
            provider: providerKey,
            name: provider.name,
            status: 'unauthorized',
            message: 'Invalid API key',
            responseTime
          };
        }
        
        if (response.status === 429) {
          return {
            provider: providerKey,
            name: provider.name,
            status: 'rate_limited',
            message: 'Rate limit exceeded',
            responseTime
          };
        }
        
        return {
          provider: providerKey,
          name: provider.name,
          status: 'error',
          message: `HTTP ${response.status}: ${errorText.substring(0, 100)}`,
          responseTime
        };
      }
      
      const data = await response.json();
      const result = parseResponse(providerKey, data);
      
      return {
        provider: providerKey,
        name: provider.name,
        status: 'success',
        message: `Response: ${result.content.substring(0, 50)}`,
        responseTime
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        provider: providerKey,
        name: provider.name,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        responseTime
      };
    }
  }
  
  /**
   * Test all configured AI providers
   */
  static async testAllProviders(): Promise<APITestResult[]> {
    const results: APITestResult[] = [];
    const providerKeys = Object.keys(AI_PROVIDERS);
    
    console.log('🧪 Testing all AI providers...');
    
    // Test providers in parallel for speed
    const promises = providerKeys.map(key => this.testProvider(key));
    const testResults = await Promise.all(promises);
    
    results.push(...testResults);
    
    // Sort by status (success first, then by response time)
    results.sort((a, b) => {
      if (a.status === 'success' && b.status !== 'success') return -1;
      if (a.status !== 'success' && b.status === 'success') return 1;
      if (a.responseTime && b.responseTime) return a.responseTime - b.responseTime;
      return 0;
    });
    
    console.log('🧪 API Test Results:');
    results.forEach(result => {
      const emoji = result.status === 'success' ? '✅' : 
                   result.status === 'rate_limited' ? '⏳' :
                   result.status === 'unauthorized' ? '🔑' : '❌';
      console.log(`${emoji} ${result.name}: ${result.message} (${result.responseTime}ms)`);
    });
    
    return results;
  }
  
  /**
   * Get working providers in order of preference
   */
  static async getWorkingProviders(): Promise<string[]> {
    const results = await this.testAllProviders();
    return results
      .filter(r => r.status === 'success')
      .map(r => r.provider);
  }
}