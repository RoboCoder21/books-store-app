export type Book = {
  id: string;
  title: string;
  author: string;
  authorImage?: string;
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

// Empty seed catalog; books will come from Supabase or user input.
export const catalog: Book[] = [];

export const featuredPicks = catalog.filter((book) => book.featured);
export const staffPicks = catalog.slice(3, 8);
export const quickReads = catalog.filter((book) => book.pages <= 320);
