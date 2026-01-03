import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import Constants from 'expo-constants';

type SupabaseEnv = {
  EXPO_PUBLIC_SUPABASE_URL?: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
};

type AuthResult = { user: User | null; error?: string };
type VoidResult = { error?: string };

let cachedClient: SupabaseClient | null = null;

function resolveSupabaseEnv(): { url?: string; key?: string } {
  const extra = (Constants?.expoConfig?.extra ?? {}) as SupabaseEnv;
  return {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.EXPO_PUBLIC_SUPABASE_URL,
    key: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
}

function getClient() {
  const { url, key } = resolveSupabaseEnv();
  if (!url || !key) return null;
  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return cachedClient;
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult > {
  const client = getClient();
  if (!client) return { user: null, error: 'Supabase is not configured.' };
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };
  return { user: data.user ?? null };
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  const client = getClient();
  if (!client) return { user: null, error: 'Supabase is not configured.' };
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) return { user: null, error: error.message };
  return { user: data.user ?? null };
}

export async function signOut(): Promise<VoidResult> {
  const client = getClient();
  if (!client) return { error: 'Supabase is not configured.' };
  const { error } = await client.auth.signOut();
  if (error) return { error: error.message };
  return {};
}
