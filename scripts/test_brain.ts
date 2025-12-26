
import dotenv from 'dotenv';
dotenv.config();
import { intentEngine } from '../src/services/brain/IntentEngine';
import { layoutStrategist } from '../src/services/brain/LayoutStrategist';
import { designArchitect } from '../src/services/brain/DesignArchitect';

async function testBrain() {
    const prompt = "I want a dark mode crypto trading portfolio website that looks futuristic";
    console.log(`🧠 Testing Brain with: "${prompt}"`);

    try {
        // 1. Intent Analysis
        const manifest = await intentEngine.analyzeIntent(prompt);
        console.log('\n✅ Intent Manifest:', JSON.stringify(manifest, null, 2));

        // 2. Layout Strategy
        const layouts = layoutStrategist.recommendLayouts(manifest);
        console.log('\n✅ Layout Strategy:', JSON.stringify(layouts, null, 2));

        // 3. Design System
        const design = designArchitect.generateDesignSystem(manifest);
        console.log('\n✅ Design System:', JSON.stringify(design.colors, null, 2));

    } catch (error) {
        console.error('❌ Brain Failed:', error);
    }
}

testBrain();
