
import { IntentManifest } from './IntentEngine';

export class LayoutStrategist {

    /**
     * DECIDE the optimal layout strategy based on user intent.
     * Replaces random selection with logical deduction.
     */
    recommendLayouts(manifest: IntentManifest) {
        console.log('📐 Brain: Strategizing Layouts...');

        return {
            hero: this.decideHeroLayout(manifest),
            features: this.decideFeatureLayout(manifest),
            products: this.decideProductLayout(manifest),
            footer: this.decideFooterType(manifest)
        };
    }

    private decideHeroLayout(manifest: IntentManifest) {
        const goal = manifest.core.primaryGoal.toLowerCase();
        const industry = manifest.strategy.industry.toLowerCase();

        // Conversion Focus -> Split Screen with Form/CTA
        if (goal.includes('lead') || goal.includes('conversion') || goal.includes('sell')) {
            return {
                name: 'split-screen-conversion',
                structure: 'grid-cols-2',
                imagePosition: 'right',
                textAlign: 'left',
                verticalAlign: 'center',
                uniqueElement: 'floating-card-form'
            };
        }

        // Portfolio/Creative -> Stacked or Big Type
        if (industry.includes('portfolio') || industry.includes('creative')) {
            return {
                name: 'typography-led',
                structure: 'text-dominant',
                imagePosition: 'background',
                textAlign: 'center',
                verticalAlign: 'center',
                uniqueElement: 'kinetic-type'
            };
        }

        // SaaS/Tech -> Screenshot Heavy
        if (industry.includes('saas') || industry.includes('tech')) {
            return {
                name: 'dashboard-preview',
                structure: 'flex-col',
                imagePosition: 'bottom-overlap',
                textAlign: 'center',
                verticalAlign: 'bottom',
                uniqueElement: 'glowing-gradient'
            };
        }

        // Default -> Classic Hero
        return {
            name: 'balanced-classic',
            structure: 'grid-cols-2',
            imagePosition: 'right',
            textAlign: 'left',
            verticalAlign: 'center',
            uniqueElement: 'blob-shape'
        };
    }

    private decideFeatureLayout(manifest: IntentManifest) {
        const sectionCount = manifest.strategy.suggestedSections.length;

        if (sectionCount > 6) return { type: 'bento-grid', style: 'compact' };
        if (manifest.brand.personality.includes('Playful')) return { type: 'alternating-zigzag', style: 'offset' };

        return { type: 'grid-3', style: 'clean' };
    }

    private decideProductLayout(manifest: IntentManifest) {
        if (manifest.brand.personality.includes('Luxury')) return { type: 'carousel-large', columns: 1 };
        return { type: 'grid', columns: 3 };
    }

    private decideFooterType(manifest: IntentManifest) {
        if (manifest.core.primaryGoal.includes('Inform')) return { style: 'mega-menu' };
        return { style: 'minimal-centered' };
    }
}

export const layoutStrategist = new LayoutStrategist();
