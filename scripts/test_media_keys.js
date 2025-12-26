/**
 * Media API Keys Tester
 * Tests all image and video generation API keys
 */

import fs from 'fs';
import https from 'https';
import http from 'http';

const TESTS = [
    // Stability AI
    {
        name: 'Stability AI Key 1',
        envVar: 'VITE_STABILITY_API_KEY_1',
        url: 'https://api.stability.ai/v1/engines/list',
        authType: 'bearer'
    },
    {
        name: 'Stability AI Key 2',
        envVar: 'VITE_STABILITY_API_KEY_2',
        url: 'https://api.stability.ai/v1/engines/list',
        authType: 'bearer'
    },
    {
        name: 'Stability AI Key 3',
        envVar: 'VITE_STABILITY_API_KEY_3',
        url: 'https://api.stability.ai/v1/engines/list',
        authType: 'bearer'
    },

    // Replicate
    {
        name: 'Replicate Key 1',
        envVar: 'VITE_REPLICATE_API_KEY_1',
        url: 'https://api.replicate.com/v1/models',
        authType: 'token'
    },
    {
        name: 'Replicate Key 2',
        envVar: 'VITE_REPLICATE_API_KEY_2',
        url: 'https://api.replicate.com/v1/models',
        authType: 'token'
    },

    // Fal AI - requires special handling
    {
        name: 'Fal AI Key 1',
        envVar: 'VITE_FAL_API_KEY_1',
        url: 'https://fal.run/fal-ai/flux/schnell',
        authType: 'fal'
    },
    {
        name: 'Fal AI Key 2',
        envVar: 'VITE_FAL_API_KEY_2',
        url: 'https://fal.run/fal-ai/flux/schnell',
        authType: 'fal'
    },

    // Unsplash
    {
        name: 'Unsplash',
        envVar: 'VITE_UNSPLASH_ACCESS_KEY',
        url: 'https://api.unsplash.com/photos/random',
        authType: 'client-id'
    },

    // Pixabay (uses URL param)
    {
        name: 'Pixabay',
        envVar: 'VITE_PIXABAY_API_KEY',
        url: 'https://pixabay.com/api/?q=test&per_page=1',
        authType: 'url-param',
        paramName: 'key'
    },

    // Freepik
    {
        name: 'Freepik',
        envVar: 'VITE_FREEPIK_API_KEY',
        url: 'https://api.freepik.com/v1/resources',
        authType: 'x-freepik'
    },

    // Photoroom
    {
        name: 'Photoroom Live',
        envVar: 'VITE_PHOTOROOM_LIVE_KEY',
        url: 'https://sdk.photoroom.com/v1',
        authType: 'x-api-key'
    },
    {
        name: 'Photoroom WebBuilder',
        envVar: 'VITE_PHOTOROOM_WEBBUILDER_LIVE_KEY',
        url: 'https://sdk.photoroom.com/v1',
        authType: 'x-api-key'
    },

    // Runway
    {
        name: 'Runway Key 1',
        envVar: 'VITE_RUNWAY_API_KEY_1',
        url: 'https://api.runwayml.com/v1',
        authType: 'bearer'
    },
    {
        name: 'Runway Key 2',
        envVar: 'VITE_RUNWAY_API_KEY_2',
        url: 'https://api.runwayml.com/v1',
        authType: 'bearer'
    },

    // ImgBB - requires POST
    {
        name: 'ImgBB Key 1',
        envVar: 'VITE_IMGBB_API_KEY_1',
        url: 'https://api.imgbb.com/1/upload',
        authType: 'skip', // POST-only API
        skipTest: true
    }
];

// Read .env file
function loadEnv() {
    const envPath = '.env';
    const envVars = {};

    try {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split(/\r?\n/).forEach(line => {
            const clean = line.trim();
            if (!clean || clean.startsWith('#')) return;
            const match = clean.match(/^([A-Z0-9_]+)=(.*)$/);
            if (match) {
                envVars[match[1]] = match[2].trim();
            }
        });
    } catch (e) {
        console.error('Failed to read .env');
    }

    return envVars;
}

async function testKey(test, envVars) {
    const key = envVars[test.envVar];

    if (!key) {
        return { name: test.name, status: '⬛ NO KEY', code: 'N/A' };
    }

    if (test.skipTest) {
        return { name: test.name, status: '🔵 SKIPPED (POST-only)', code: 'N/A' };
    }

    return new Promise(resolve => {
        let url = test.url;
        const headers = {};

        // Set auth header
        switch (test.authType) {
            case 'bearer':
                headers['Authorization'] = `Bearer ${key}`;
                break;
            case 'token':
                headers['Authorization'] = `Token ${key}`;
                break;
            case 'fal':
                headers['Authorization'] = `Key ${key}`;
                break;
            case 'client-id':
                headers['Authorization'] = `Client-ID ${key}`;
                break;
            case 'x-freepik':
                headers['x-freepik-api-key'] = key;
                break;
            case 'x-api-key':
                headers['x-api-key'] = key;
                break;
            case 'url-param':
                url = `${url}&${test.paramName}=${key}`;
                break;
        }

        const urlObj = new URL(url);
        const httpModule = urlObj.protocol === 'https:' ? https : http;

        const req = httpModule.request(url, { method: 'GET', headers, timeout: 10000 }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ name: test.name, status: '✅ VALID', code: 200 });
                } else if (res.statusCode === 401 || res.statusCode === 403) {
                    resolve({ name: test.name, status: '❌ INVALID/EXPIRED', code: res.statusCode });
                } else if (res.statusCode === 429) {
                    resolve({ name: test.name, status: '⚠️ RATE LIMITED', code: 429 });
                } else {
                    resolve({ name: test.name, status: `❓ HTTP ${res.statusCode}`, code: res.statusCode });
                }
            });
        });

        req.on('error', e => {
            resolve({ name: test.name, status: '❌ NETWORK ERROR', code: e.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ name: test.name, status: '❌ TIMEOUT', code: 'TIMEOUT' });
        });

        req.end();
    });
}

async function main() {
    console.log('🔍 Loading .env...');
    const envVars = loadEnv();
    console.log(`📋 Found ${Object.keys(envVars).length} environment variables\n`);

    console.log('🧪 Testing Media API Keys...\n');

    const results = [];

    for (const test of TESTS) {
        process.stdout.write(`Testing ${test.name}... `);
        const result = await testKey(test, envVars);
        console.log(result.status);
        results.push(result);
    }

    // Write report
    let report = 'MEDIA API KEY REPORT\n====================\n\n';
    report += 'VALID KEYS (Use First):\n';
    results.filter(r => r.status.includes('VALID')).forEach(r => {
        report += `  ✅ ${r.name}\n`;
    });

    report += '\nINVALID/EXPIRED KEYS:\n';
    results.filter(r => r.status.includes('INVALID') || r.status.includes('EXPIRED')).forEach(r => {
        report += `  ❌ ${r.name}\n`;
    });

    report += '\nOTHER:\n';
    results.filter(r => !r.status.includes('VALID') && !r.status.includes('INVALID') && !r.status.includes('EXPIRED')).forEach(r => {
        report += `  ${r.status} ${r.name}\n`;
    });

    fs.writeFileSync('media_key_report.txt', report);
    console.log('\n📄 Report saved to media_key_report.txt');
}

main();
