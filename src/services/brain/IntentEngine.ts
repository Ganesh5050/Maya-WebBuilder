
import { llmManager, TaskType } from '../LLMManager';
import { DesignHeuristics, IndustryBlueprints } from './DesignKnowledge';

/**
 * Manifest created by the Intuition Engine
 * This guides the entire generation process.
 */
export interface IntentManifest {
    core: {
        purpose: string;
        targetAudience: {
            description: string;
            ageRange: string;
            incomeLevel: string;
            values: string[];
        };
        primaryGoal: string;
    };
    brand: {
        name: string;
        tagline: string;
        personality: string;
        colorPsychology: string;
        keywords: string[];
    };
    strategy: {
        industry: string;
        subCategory: string;
        suggestedSections: string[];
        layoutStyle: string;
        competitors: string[];
    };
    contentStrategy: {
        tone: string;
        keyDifferentiators: string[];
    };
}

export class IntentEngine {

    /**
     * THE DEEP THOUGHT PROCESS
     * Analyzes the user's raw prompt to understand deep intent using Chain-of-Thought.
     */
    async analyzeIntent(userPrompt: string): Promise<IntentManifest> {
        console.log('🧠 Brain: Analyzing User Intent...');

        // 1. Consult Knowledge Base
        // We inject relevant heuristics into the prompt context
        const blueprintKeys = Object.keys(IndustryBlueprints).join(', ');

        // 2. Construct Chain-of-Thought Prompt
        const systemInstruction = `
      You are an Elite Digital Strategist & UX Researcher.
      Your goal is to psychoanalyze the client's request and build a strategic website manifest.
      
      # KNOWLEDGE BASE ACCESS:
      - Known Industry Blueprints: ${blueprintKeys}
      - UX Laws: ${JSON.stringify(DesignHeuristics.uxLaws)}
      - Color Logic: ${JSON.stringify(DesignHeuristics.colors)}
      
      # YOUR TASK:
      Analyze the PROMPT: "${userPrompt}"
      
      1. Identify the explicit vs implicit Industry.
      2. Deduce the Target Audience and their pain points.
      3. Determine the Brand Personality based on the request (or infer the optimal one).
      4. Select the best Industry Blueprint to apply.
      
      Return STRICT JSON matching the IntentManifest interface.
    `;

        try {
            // 3. Inference Layer
            const response = await llmManager.generateResponse(
                `Generate the IntentManifest JSON for: "${userPrompt}"`,
                TaskType.ANALYSIS,
                systemInstruction,
                'openai' // Use the smartest model for intent analysis
            );

            // 4. Parse & Validate
            const manifest = this.parseManifest(response);
            console.log('🧠 Brain: Intent Manifest Created:', manifest.core.purpose);
            return manifest;

        } catch (error) {
            console.error('🧠 Brain: Intent Analysis Failed, falling back to heuristic logic.', error);
            return this.heuristicFallback(userPrompt);
        }
    }

    /**
     * Robust JSON Parser for AI Responses
     */
    private parseManifest(response: string): IntentManifest {
        try {
            let clean = response.trim();
            const match = clean.match(/\{[\s\S]*\}/);
            if (match) clean = match[0];
            return JSON.parse(clean);
        } catch (e) {
            throw new Error("Failed to parse AI intent JSON");
        }
    }

    /**
     * Heuristic Fallback (Logic without AI)
     * Used if the LLM is down or fails.
     */
    private heuristicFallback(prompt: string): IntentManifest {
        const p = prompt.toLowerCase();
        let industry: any = 'generic';

        // Simple keyword matching
        if (p.includes('shop') || p.includes('store') || p.includes('sell')) industry = 'ecommerce';
        else if (p.includes('food') || p.includes('restaurant') || p.includes('cafe')) industry = 'restaurant';
        else if (p.includes('app') || p.includes('saas') || p.includes('software')) industry = 'saas';
        else if (p.includes('portfolio') || p.includes('me') || p.includes('resume')) industry = 'portfolio';

        const blueprint = IndustryBlueprints[industry as keyof typeof IndustryBlueprints] || IndustryBlueprints.agency;

        return {
            core: {
                purpose: "Create a professional online presence",
                targetAudience: {
                    description: "General customers interested in quality services",
                    ageRange: "25-45",
                    incomeLevel: "Middle to High Income",
                    values: ["Quality", "Reliability", "Trust"]
                },
                primaryGoal: "Conversion and Information"
            },
            brand: {
                name: "My Brand",
                tagline: "Excellence in every detail",
                personality: "Professional",
                colorPsychology: "Standard Blue for Trust",
                keywords: ["Quality", "Professional", "Service"]
            },
            strategy: {
                industry: industry,
                subCategory: "General Service",
                suggestedSections: blueprint.requiredSections,
                layoutStyle: blueprint.layout,
                competitors: ["competitor.com"]
            },
            contentStrategy: {
                tone: "Professional",
                keyDifferentiators: ["Quality", "Service"]
            }
        };
    }
}

export const intentEngine = new IntentEngine();
