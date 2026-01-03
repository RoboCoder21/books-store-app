import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ImageBackground, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { signInWithEmail, signUpWithEmail } from '@/lib/authService';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [email, setEmail] = useState('reader@email.com');
  const [password, setPassword] = useState('••••••••');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const action = mode === 'login' ? signInWithEmail : signUpWithEmail;
      const { user, error: authError } = await action(email.trim(), password.trim());
      if (authError) {
        setError(authError);
      } else if (user) {
        setMessage(mode === 'login' ? 'Welcome back! You are logged in.' : 'Account created. Redirecting…');
        router.replace('/');
      } else {
        setError('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80' }}
        style={styles.backdrop}
        imageStyle={{ borderRadius: 24 }}>
        <View style={styles.overlay} />
        <View style={styles.card}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <FontAwesome name="book" size={20} color="#0f172a" />
            </View>
            <Text style={styles.brand}>My Bookstore</Text>
          </View>

          <Text style={styles.title}>{mode === 'login' ? 'Login to continue' : 'Create your account'}</Text>
          <Text style={styles.subtitle}>Access your saved titles and audiobooks.</Text>

          <View style={[styles.input, { borderColor: '#e2e8f0' }]}>
            <FontAwesome name="envelope" size={16} color="#475569" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.inputField}
              placeholder="Email"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={[styles.input, { borderColor: '#e2e8f0' }]}>
            <FontAwesome name="lock" size={16} color="#475569" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.inputField}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
          {message && <Text style={styles.successText}>{message}</Text>}

          <Pressable style={[styles.primaryButton, loading && { opacity: 0.7 }]} accessibilityRole="button" onPress={handleSubmit} disabled={loading}>
            <Text style={styles.primaryText}>{loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Sign up'}</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            accessibilityRole="button"
            onPress={() => {
              setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
              setMessage(null);
              setError(null);
            }}>
            <Text style={styles.secondaryText}>
              {mode === 'login' ? "New here? Create an account" : 'Have an account? Login'}
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  card: {
    padding: 22,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    marginTop: '40%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#facc15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brand: {
    fontWeight: '800',
    fontSize: 18,
    color: '#0f172a',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  subtitle: {
    color: '#334155',
    marginTop: 4,
    marginBottom: 14,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  inputField: {
    marginLeft: 8,
    flex: 1,
    color: '#0f172a',
  },
  primaryButton: {
    marginTop: 6,
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: '#f8fafc',
    fontWeight: '800',
  },
  errorText: {
    color: '#b91c1c',
    marginTop: 6,
    marginBottom: 4,
    fontWeight: '700',
  },
  successText: {
    color: '#15803d',
    marginTop: 6,
    marginBottom: 4,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  secondaryText: {
    color: '#0f172a',
    fontWeight: '700',
  },
});
