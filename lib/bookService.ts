import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

import { Book, catalog } from '@/constants/books';

type SupabaseEnv = {
  EXPO_PUBLIC_SUPABASE_URL?: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
};

function resolveSupabaseEnv(): { url?: string; key?: string } {
  const extra = (Constants?.expoConfig?.extra ?? {}) as SupabaseEnv;
  return {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.EXPO_PUBLIC_SUPABASE_URL,
    key: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
}

const { url: supabaseUrl, key: supabaseKey } = resolveSupabaseEnv();
const table = 'books';

let cachedClient: SupabaseClient | null = null;
const memoryStore: Book[] = [...catalog];

function getClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return cachedClient;
}

type BookRow = {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  pages: number;
  category: string;
  accent?: string;
  featured?: boolean;
  description?: string;
  cover?: string;
  audioPreview?: string;
  fileUrl?: string;
  progress?: number;
};

export type NewBookInput = {
  id?: string;
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
};

function mapRow(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    price: row.price,
    rating: row.rating,
    pages: row.pages,
    category: row.category,
    accent: row.accent ?? '#2563eb',
    featured: row.featured,
    description: row.description ?? 'No description yet.',
    cover: row.cover,
    audioPreview: row.audioPreview,
    fileUrl: row.fileUrl,
    progress: row.progress,
  };
}

export async function fetchBooks() {
  const client = getClient();
  if (!client) {
    return { data: memoryStore, source: 'local' as const };
  }

  const { data, error } = await client
    .from(table)
    .select('id,title,author,price,rating,pages,category,accent,featured,description,cover,audioPreview,fileUrl,progress')
    .order('title', { ascending: true });

  if (error || !data) {
    console.warn('Falling back to local catalog because Supabase failed', error?.message);
    return { data: memoryStore, source: 'local' as const };
  }

  return { data: data.map(mapRow), source: 'remote' as const };
}

export async function addBook(input: NewBookInput) {
  const client = getClient();
  if (!client) {
    const newBook: Book = { ...input, id: `local-${Date.now()}`, progress: 0 };
    memoryStore.unshift(newBook);
    return { data: newBook, source: 'local' as const };
  }

  const payload = { ...input, id: input.id ?? `book-${Date.now()}` };
  const { data, error } = await client.from(table).insert(payload).select().single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not add book');
  }

  return { data: mapRow(data), source: 'remote' as const };
}

export async function uploadBookFile(fileUri: string, fileName: string) {
  const client = getClient();
  if (!client) throw new Error('Supabase is not configured.');

  // Fetch the file as a blob; works in Expo RN & web.
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const path = `${fileName}`;
  const { error } = await client.storage.from('books').upload(path, blob, { upsert: true });
  if (error) throw new Error(error.message);

  const { data } = client.storage.from('books').getPublicUrl(path);
  return data.publicUrl;
}
