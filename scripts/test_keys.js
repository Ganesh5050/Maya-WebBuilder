
import fs from 'fs';
import https from 'https';

// Provider configurations
const PROVIDERS = {
    openai: { url: 'https://api.openai.com/v1/models', headers: (k) => ({ 'Authorization': `Bearer ${k}` }) },
    openrouter: { url: 'https://openrouter.ai/api/v1/models', headers: (k) => ({ 'Authorization': `Bearer ${k}` }) },
    anthropic: {
        url: 'https://api.anthropic.com/v1/messages',
        method: 'POST',
        headers: (k) => ({ 'x-api-key': k, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }),
        body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 1, messages: [{ role: 'user', content: 'Hi' }] })
    },
    google: {
        url: (k) => `https://generativelanguage.googleapis.com/v1beta/models?key=${k}`,
        headers: () => ({})
    },
    groq: { url: 'https://api.groq.com/openai/v1/models', headers: (k) => ({ 'Authorization': `Bearer ${k}` }) },
    // Add generic handler for others assuming OpenAI compat if unknown
};

async function checkKey(name, key) {
    if (!key || key.length < 10) return { name, status: 'EMPTY' };

    let provider = 'openai'; // Default
    if (name.includes('OPENROUTER')) provider = 'openrouter';
    else if (name.includes('ANTHROPIC')) provider = 'anthropic';
    else if (name.includes('GOOGLE') || name.includes('GEMINI')) provider = 'google';
    else if (name.includes('GROQ')) provider = 'groq';

    const config = PROVIDERS[provider] || PROVIDERS.openai;
    const url = typeof config.url === 'function' ? config.url(key) : config.url;
    const method = config.method || 'GET';
    const headers = config.headers(key);

    return new Promise(resolve => {
        const req = https.request(url, { method, headers, timeout: 5000 }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ name, status: '✅ VALID', code: 200, provider });
                } else {
                    resolve({ name, status: `❌ FAILED (${res.statusCode})`, code: res.statusCode, provider });
                }
            });
        });

        req.on('error', (e) => resolve({ name, status: '❌ ERROR (Net)', code: 0, provider }));

        if (config.body) req.write(config.body);
        req.end();
    });
}

const envContent = fs.readFileSync('.env', 'utf8').replace(/^\uFEFF/, ''); // Remove BOM
const lines = envContent.split(/\r?\n/); // Handle Windows newlines

console.log('🔍 Scanning .env for keys...');
const checks = [];

for (const line of lines) {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith('#')) continue;

    const match = cleanLine.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) {
        let [_, name, key] = match;
        key = key.trim();
        // Remove quotes if present
        if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);

        if (name.includes('API_KEY') || name.includes('SECRET')) {
            checks.push(checkKey(name, key));
        }
    }
}

Promise.all(checks).then(results => {
    let report = 'API KEY REPORT:\n';
    results.forEach(r => {
        report += `${r.status}|${r.name}|${r.provider}\n`;
    });
    fs.writeFileSync('key_report.txt', report);
    console.log('Report saved to key_report.txt');
});
