export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  pages: number;
  category: string;
  accent: string;
  featured?: boolean;
  description: string;
  cover?: string;
  audioPreview?: string;
  fileUrl?: string;
  progress?: number;
};

export const catalog: Book[] = [
  {
    id: 'atlas-01',
    title: 'The Atlas Paradox',
    author: 'Olivia Blake',
    price: 17.99,
    rating: 4.8,
    pages: 432,
    category: 'Sci-Fi',
    accent: '#4f46e5',
    featured: true,
    description: 'Six magicians scramble for power as alliances fracture in the secretive Alexandrian Society.',
    cover: 'https://images.unsplash.com/photo-1544933231-28287c2938d9?auto=format&fit=crop&w=640&q=80',
    audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'paper-02',
    title: 'Paper Planets',
    author: 'Maya Chen',
    price: 14.0,
    rating: 4.6,
    pages: 288,
    category: 'Literary',
    accent: '#f59e0b',
    description: 'A coming-of-age road trip that winds through deserts, diners, and found family.',
    cover: 'https://images.unsplash.com/photo-1471109880861-75cec67f8b68?auto=format&fit=crop&w=640&q=80',
    audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'coast-03',
    title: 'Salt & Coastlines',
    author: 'Rafael Soto',
    price: 19.5,
    rating: 4.9,
    pages: 504,
    category: 'Historical',
    accent: '#10b981',
    featured: true,
    description: 'An epic dual-timeline story of cartographers and sailors pushing past the edge of old maps.',
    cover: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=640&q=80',
    audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'north-04',
    title: 'North Wind Sleep',
    author: 'Ivy Serrano',
    price: 12.75,
    rating: 4.3,
    pages: 256,
    category: 'Mystery',
    accent: '#ec4899',
    description: "A glassblower unravels a frozen town's secrets after a midnight knock on her studio door.",
    cover: 'https://images.unsplash.com/photo-1455884981818-54cb785db6fc?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'gleam-05',
    title: 'Gleam Theory',
    author: 'Noah Rahman',
    price: 21.0,
    rating: 4.7,
    pages: 384,
    category: 'Nonfiction',
    accent: '#06b6d4',
    description: 'A hopeful roadmap for building luminous, equitable cities through public imagination.',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'garden-06',
    title: 'Midnight Gardeners',
    author: 'Aisha Patel',
    price: 15.5,
    rating: 4.5,
    pages: 320,
    category: 'Fantasy',
    accent: '#22c55e',
    description: 'Botanists who coax plants to sing must stop a kingdom from silencing their forests.',
    cover: 'https://images.unsplash.com/photo-1455884981818-54cb785db6fc?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'hollow-07',
    title: 'Hollow Signal',
    author: 'Jonas Reed',
    price: 13.99,
    rating: 4.1,
    pages: 298,
    category: 'Thriller',
    accent: '#f97316',
    description: 'A coastal radio operator picks up distress calls from a ship that sank twenty years ago.',
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'tidal-08',
    title: 'Tidal Notation',
    author: 'Celeste Mora',
    price: 18.25,
    rating: 4.4,
    pages: 360,
    category: 'Romance',
    accent: '#6366f1',
    description: 'Two composers fall for each other while scoring a documentary about bioluminescent bays.',
    cover: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'river-09',
    title: 'River of Small Fires',
    author: 'Emilio Vargas',
    price: 16.0,
    rating: 4.2,
    pages: 274,
    category: 'Adventure',
    accent: '#8b5cf6',
    description: 'An archivist hikes upriver to find a vanished mentor, mapping old rebellions along the way.',
    cover: 'https://images.unsplash.com/photo-1522202757859-7472a4fc1f5f?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'ember-10',
    title: 'Ember Almanac',
    author: 'Suri Park',
    price: 22.0,
    rating: 4.9,
    pages: 448,
    category: 'Cooking',
    accent: '#ef4444',
    description: 'Fire-forward recipes that weave smoke, spice, and story from Seoul to Seattle.',
    cover: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'ledger-11',
    title: 'The Modern Ledger',
    author: 'Priya Iyer',
    price: 18.5,
    rating: 4.4,
    pages: 312,
    category: 'Business',
    accent: '#0ea5e9',
    description: 'Playbooks for building resilient teams and products in shifting markets.',
    cover: 'https://images.unsplash.com/photo-1473181488821-2d23949a045a?auto=format&fit=crop&w=640&q=80',
    audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
];

export const featuredPicks = catalog.filter((book) => book.featured);
export const staffPicks = catalog.slice(3, 8);
export const quickReads = catalog.filter((book) => book.pages <= 320);
