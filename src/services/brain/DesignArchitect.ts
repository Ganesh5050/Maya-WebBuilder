
import { IntentManifest } from './IntentEngine';

export interface DesignSystem {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        surface: string;
    };
    typography: {
        headingFont: string;
        bodyFont: string;
        scaleRatio: number; // e.g. 1.25 for Major Third
    };
    layout: {
        containerWidth: string;
        gridCols: number;
        spacing: {
            xs: string; // 0.5rem
            sm: string; // 1rem
            md: string; // 2rem
            lg: string; // 4rem
            xl: string; // 8rem
        };
        borderRadius: string; // '0px' | '4px' | '12px' | '999px'
    };
    components: {
        buttonStyle: 'rounded' | 'sharp' | 'pill';
        cardStyle: 'flat' | 'elevated' | 'bordered';
    };
}

export class DesignArchitect {

    /**
     * Generates a comprehensive Design System based on the Deep Intent
     */
    generateDesignSystem(manifest: IntentManifest): DesignSystem {
        console.log('🎨 Brain: Architecting Design System...');

        const vibe = manifest.brand.personality.toLowerCase() + ' ' + manifest.contentStrategy.tone.toLowerCase();

        return {
            colors: this.generatePalette(vibe, manifest.brand.colorPsychology),
            typography: this.selectTypography(vibe),
            layout: this.defineLayout(vibe, manifest.strategy.layoutStyle),
            components: this.defineComponentStyles(vibe)
        };
    }

    private generatePalette(vibe: string, psychology: string): DesignSystem['colors'] {
        // Heuristic Color Generation based on keywords
        if (vibe.includes('luxury') || vibe.includes('elegant')) {
            return {
                primary: '#1A1A1A', // Black
                secondary: '#D4AF37', // Gold
                accent: '#F5F5F5', // Off-white
                background: '#FFFFFF',
                text: '#000000',
                surface: '#F9F9F9'
            };
        } else if (vibe.includes('tech') || vibe.includes('modern')) {
            return {
                primary: '#2563EB', // Blue 600
                secondary: '#1E293B', // Slate 800
                accent: '#3B82F6',
                background: '#0F172A', // Dark mode default for tech? Or Light? Let's go Clean Light for now
                text: '#1E293B',
                surface: '#F1F5F9'
            };
        } else if (vibe.includes('energetic') || vibe.includes('playful')) {
            return {
                primary: '#FF5722', // Deep Orange
                secondary: '#FFC107', // Amber
                accent: '#8BC34A',
                background: '#FFFFFF',
                text: '#212121',
                surface: '#FFF3E0'
            };
        } else if (vibe.includes('nature') || vibe.includes('growth')) {
            return {
                primary: '#2E7D32', // Green
                secondary: '#FDD835', // Yellow
                accent: '#81C784',
                background: '#FAFAFA',
                text: '#1B5E20',
                surface: '#E8F5E9'
            };
        }

        // Default Professional Blue
        return {
            primary: '#0F172A', // Slate 900
            secondary: '#64748B', // Slate 500
            accent: '#3B82F6', // Blue 500
            background: '#FFFFFF',
            text: '#334155',
            surface: '#F8FAFC'
        };
    }

    private selectTypography(vibe: string): DesignSystem['typography'] {
        if (vibe.includes('luxury')) {
            return { headingFont: 'Playfair Display', bodyFont: 'Lato', scaleRatio: 1.414 };
        } else if (vibe.includes('tech')) {
            return { headingFont: 'Inter', bodyFont: 'Roboto', scaleRatio: 1.25 };
        } else if (vibe.includes('playful')) {
            return { headingFont: 'Fredoka One', bodyFont: 'Nunito', scaleRatio: 1.2 };
        }
        return { headingFont: 'Inter', bodyFont: 'Inter', scaleRatio: 1.25 };
    }

    private defineLayout(vibe: string, style: string): DesignSystem['layout'] {
        const isMinimal = vibe.includes('minimal');

        return {
            containerWidth: '1280px',
            gridCols: 12,
            spacing: {
                xs: isMinimal ? '1rem' : '0.5rem',
                sm: isMinimal ? '2rem' : '1rem',
                md: isMinimal ? '4rem' : '2rem',
                lg: isMinimal ? '8rem' : '4rem',
                xl: isMinimal ? '12rem' : '8rem',
            },
            borderRadius: vibe.includes('friendly') || vibe.includes('playful') ? '16px' : (vibe.includes('sharp') ? '0px' : '8px')
        };
    }

    private defineComponentStyles(vibe: string): DesignSystem['components'] {
        return {
            buttonStyle: (vibe.includes('round') || vibe.includes('friendly')) ? 'pill' : 'rounded',
            cardStyle: vibe.includes('minimal') ? 'flat' : 'elevated'
        };
    }
}

export const designArchitect = new DesignArchitect();
