export interface App {
  id: number;
  name: string;
  url: string;
  status: 'Draft' | 'Published' | 'Archived';
  visibility: 'Public' | 'Private';
  starred: boolean;
  lastAccessed: Date;
  createdAt: Date;
}

// Initial apps data
export const initialApps: App[] = [
  {
    id: 1,
    name: 'Orb AI - AI Agency Solutions',
    url: 'https://ykaim7yqzhmzq.mocha.app',
    status: 'Draft',
    visibility: 'Public',
    starred: false,
    lastAccessed: new Date('2024-01-15'),
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 2,
    name: 'E-commerce Store - Modern Shop',
    url: 'https://modernshop.mocha.app',
    status: 'Published',
    visibility: 'Public',
    starred: true,
    lastAccessed: new Date('2024-01-20'),
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 3,
    name: 'Portfolio Website - Creative Designer',
    url: 'https://creative.mocha.app',
    status: 'Published',
    visibility: 'Public',
    starred: false,
    lastAccessed: new Date('2024-01-18'),
    createdAt: new Date('2024-01-08'),
  },
  {
    id: 4,
    name: 'Restaurant Booking System',
    url: 'https://restaurant.mocha.app',
    status: 'Draft',
    visibility: 'Private',
    starred: true,
    lastAccessed: new Date('2024-01-22'),
    createdAt: new Date('2024-01-12'),
  },
  {
    id: 5,
    name: 'SaaS Dashboard - Analytics Platform',
    url: 'https://analytics.mocha.app',
    status: 'Published',
    visibility: 'Private',
    starred: false,
    lastAccessed: new Date('2024-01-19'),
    createdAt: new Date('2024-01-03'),
  },
];

// In a real app, this would be managed by a state management system
// For now, we'll use a simple mutable array with localStorage persistence
let apps = [...initialApps];

// Load apps from localStorage on initialization
const loadAppsFromStorage = () => {
  try {
    const storedApps = localStorage.getItem('appsData');
    if (storedApps) {
      const parsedApps = JSON.parse(storedApps);
      // Convert date strings back to Date objects
      apps = parsedApps.map((app: any) => ({
        ...app,
        lastAccessed: new Date(app.lastAccessed),
        createdAt: new Date(app.createdAt)
      }));
    }
  } catch (error) {
    console.error('Error loading apps from localStorage:', error);
    apps = [...initialApps];
  }
};

// Save apps to localStorage
const saveAppsToStorage = () => {
  try {
    localStorage.setItem('appsData', JSON.stringify(apps));
  } catch (error) {
    console.error('Error saving apps to localStorage:', error);
  }
};

// Initialize by loading from storage
loadAppsFromStorage();

export const getApps = () => apps;

export const toggleStar = (appId: number) => {
  const app = apps.find(a => a.id === appId);
  if (app) {
    app.starred = !app.starred;
    saveAppsToStorage(); // Save to localStorage after change
  }
  return app;
};

export const updateLastAccessed = (appId: number) => {
  const app = apps.find(a => a.id === appId);
  if (app) {
    app.lastAccessed = new Date();
    saveAppsToStorage(); // Save to localStorage after change
  }
  return app;
};

export const getRecentApps = () => {
  return [...apps]
    .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
    .slice(0, 5); // Show last 5 recently accessed apps
};

export const getStarredApps = () => {
  return apps.filter(app => app.starred);
};
