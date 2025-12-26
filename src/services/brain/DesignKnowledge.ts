/**
 * THE MEMORY BANK: Design Heuristics & Golden Rules
 * 
 * This file acts as the "Long Term Memory" for the AI Builder.
 * It contains static knowledge about design principles, UX best practices,
 * and conversion optimization strategies that are injected into the context.
 */

export const DesignHeuristics = {
    // 1. Visual Hierarchy Rules
    hierarchy: [
        "The H1 headline must be the most dominant text element (size/weight) above the fold.",
        "Call-to-Action (CTA) buttons must use a color that contrasts significantly with the background (complementary or triad).",
        "Section headings (H2) must have 2x more whitespace above them than below them to group content effectively.",
        "Text line length should not exceed 75 characters for optimal readability on desktop."
    ],

    // 2. Color Theory & Psychology
    colors: {
        trust: "Use Blue/Navy palettes. Best for: Banks, Tech, Medical.",
        energy: "Use Red/Orange accents. Best for: Fitness, Food, Startups.",
        luxury: "Use Black/Gold/White or Deep Purple. Best for: Fashion, Jewelry, High-end Real Estate.",
        growth: "Use Green/Earthy tones. Best for: Eco, Finance, Wellness.",
        playful: "Use Pink/Yellow/Bright Purple. Best for: Kids, Creative Agencies, Apps."
    },

    // 3. User Experience (UX) Laws
    uxLaws: {
        fittsLaw: "Touch targets (buttons) must be at least 44px height for mobile tappability.",
        hicksLaw: "Limit navigation menu items to maximum 7 to reduce decision time.",
        jacobsLaw: "Users prefer interfaces that work like other sites they know. Use standard patterns for header/footer.",
        millerLaw: "Chunk content into groups of 5-9 items for better memory retention."
    },

    // 4. Accessibility Standards (WCAG)
    accessibility: [
        "Ensure contrast ratio of at least 4.5:1 for normal text.",
        "All images must have descriptive 'alt' tags for screen readers.",
        "Focus states must be visible for keyboard navigation."
    ],

    // 5. Conversion Optimization (CRO)
    cro: [
        "Place the primary CTA visible above the fold without scrolling.",
        "Social proof (Testimonials/Logos) should appear immediately after the Hero or Benefits section.",
        "Forms should have as few fields as possible.",
        "Use 'power words' in buttons (e.g., 'Get Started Free' vs 'Submit')."
    ]
};

export const IndustryBlueprints = {
    "ecommerce": {
        requiredSections: ["Hero with Product", "Featured Collection", "Social Proof", "Benefits Bar", "Newsletter"],
        vibe: "Clean, Product-focused, Trustworthy",
        layout: "Grid-heavy, large imagery"
    },
    "saas": {
        requiredSections: ["Hero with Dashboard Preview", "Logo Wall", "Feature Grid", "How it Works", "Pricing Tables", "FAQ"],
        vibe: "Modern, Tech-forward, Clean",
        layout: "Alternating feature blocks, extensive whitespace"
    },
    "portfolio": {
        requiredSections: ["Personal Intro Hero", "Project Gallery", "Services List", "About Me", "Contact"],
        vibe: "Minimalist, Expressive, Unique",
        layout: "Masonry grids, creative typography"
    },
    "restaurant": {
        requiredSections: ["Hero with Food Porn", "Menu Preview", "Reservation CTA", "Location/Hours", "Chef's Story"],
        vibe: "Appetizing, Warm, Textural",
        layout: "Image-backgrounds, centered text"
    },
    "agency": {
        requiredSections: ["Bold Statement Hero", "Case Studies", "Client Logos", "Service Breakdown", "Let's Talk"],
        vibe: "Bold, Professional, Creative",
        layout: "Big type, asymmetric layouts"
    }
};
