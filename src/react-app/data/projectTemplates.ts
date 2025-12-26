// Project Templates for Quick Start
export interface ProjectTemplate {
    id: string;
    name: string;
    description: string;
    category: 'landing' | 'saas' | 'ecommerce' | 'portfolio' | 'blog';
    icon: string;
    prompt: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const projectTemplates: ProjectTemplate[] = [
    {
        id: 'modern-landing',
        name: 'Modern Landing Page',
        description: 'A sleek, conversion-focused landing page with hero section, features, testimonials, and CTA',
        category: 'landing',
        icon: '🚀',
        difficulty: 'beginner',
        tags: ['marketing', 'startup', 'product-launch'],
        prompt: `Create a modern, professional landing page with:
- Hero section with gradient background and compelling headline
- Features section with icon cards (3-4 key features)
- Testimonials carousel with customer quotes
- Pricing section with 3 tiers
- FAQ accordion
- Newsletter signup form
- Smooth scroll animations
- Mobile-responsive design
- Dark mode toggle
Use a vibrant color scheme (blue/purple gradient) and modern typography.`
    },
    {
        id: 'saas-dashboard',
        name: 'SaaS Dashboard',
        description: 'Complete admin dashboard with charts, tables, and data visualization',
        category: 'saas',
        icon: '📊',
        difficulty: 'advanced',
        tags: ['admin', 'analytics', 'business'],
        prompt: `Create a comprehensive SaaS dashboard application with:
- Sidebar navigation with collapsible menu
- Top header with user profile and notifications
- Dashboard overview with key metrics cards
- Interactive charts (line, bar, pie) using recharts
- Data tables with sorting and filtering
- User management section
- Settings page with tabs
- Dark/light theme support
- Responsive layout for mobile
Use a professional color scheme (indigo/gray) with clean, modern design.`
    },
    {
        id: 'ecommerce-store',
        name: 'E-Commerce Store',
        description: 'Full-featured online store with product catalog, cart, and checkout',
        category: 'ecommerce',
        icon: '🛒',
        difficulty: 'advanced',
        tags: ['shopping', 'retail', 'products'],
        prompt: `Create a modern e-commerce website with:
- Product grid with filters (category, price, rating)
- Product detail pages with image gallery
- Shopping cart with add/remove functionality
- Checkout flow (multi-step form)
- User account/login pages
- Order history
- Product search with autocomplete
- Wishlist functionality
- Mobile-responsive design
- Product reviews and ratings
Use a clean, minimal design with focus on product imagery.`
    },
    {
        id: 'portfolio-creative',
        name: 'Creative Portfolio',
        description: 'Stunning portfolio site for designers, developers, and creatives',
        category: 'portfolio',
        icon: '🎨',
        difficulty: 'intermediate',
        tags: ['personal', 'showcase', 'creative'],
        prompt: `Create a beautiful portfolio website with:
- Full-screen hero with animated background
- About section with profile image and bio
- Project showcase grid with hover effects
- Individual project case study pages
- Skills section with progress bars
- Contact form with validation
- Social media links
- Smooth page transitions
- Dark theme with accent colors
- Mobile-responsive layout
Use bold typography and creative animations to stand out.`
    },
    {
        id: 'blog-platform',
        name: 'Blog Platform',
        description: 'Feature-rich blog with article listings, categories, and search',
        category: 'blog',
        icon: '📝',
        difficulty: 'intermediate',
        tags: ['content', 'writing', 'publishing'],
        prompt: `Create a modern blog platform with:
- Homepage with featured posts and latest articles
- Article listing page with pagination
- Individual blog post pages with rich formatting
- Category and tag filtering
- Search functionality
- Author profiles
- Comments section
- Related posts suggestions
- Newsletter subscription
- Reading time estimates
- Social sharing buttons
- Mobile-responsive design
Use a clean, readable design focused on typography and content.`
    },
    {
        id: 'startup-mvp',
        name: 'Startup MVP',
        description: 'Quick MVP template for validating your startup idea',
        category: 'landing',
        icon: '💡',
        difficulty: 'beginner',
        tags: ['startup', 'mvp', 'validation'],
        prompt: `Create a startup MVP landing page with:
- Compelling value proposition headline
- Problem/solution sections
- Product demo video or screenshot
- Early access signup form with email collection
- Social proof (logos, testimonials)
- Simple pricing or waitlist
- FAQ section
- Footer with social links
- Mobile-responsive
- Fast loading and optimized
Use bold colors and clear CTAs to drive conversions.`
    },
    {
        id: 'restaurant-menu',
        name: 'Restaurant Website',
        description: 'Beautiful restaurant site with menu, reservations, and gallery',
        category: 'landing',
        icon: '🍽️',
        difficulty: 'intermediate',
        tags: ['food', 'hospitality', 'local-business'],
        prompt: `Create an elegant restaurant website with:
- Hero section with food photography
- About the restaurant section
- Interactive menu with categories (appetizers, mains, desserts)
- Photo gallery of dishes and ambiance
- Reservation form with date/time picker
- Location map and contact info
- Opening hours
- Special events section
- Mobile-responsive design
- Warm, inviting color scheme
Use high-quality imagery and elegant typography.`
    },
    {
        id: 'fitness-app',
        name: 'Fitness Tracker',
        description: 'Workout tracking app with exercises, progress charts, and goals',
        category: 'saas',
        icon: '💪',
        difficulty: 'advanced',
        tags: ['health', 'fitness', 'tracking'],
        prompt: `Create a fitness tracking application with:
- Dashboard with workout stats and progress charts
- Exercise library with categories
- Workout planner/calendar
- Progress tracking with before/after photos
- Goal setting and achievement badges
- Nutrition tracker
- Personal records and milestones
- Social features (share workouts)
- Mobile-first responsive design
- Motivational UI with energetic colors
Use vibrant gradients and dynamic animations.`
    }
];

export const getTemplatesByCategory = (category: ProjectTemplate['category']) => {
    return projectTemplates.filter(t => t.category === category);
};

export const getTemplateById = (id: string) => {
    return projectTemplates.find(t => t.id === id);
};
