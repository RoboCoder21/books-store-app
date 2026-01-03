import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AudioMiniPlayer } from '@/components/AudioMiniPlayer';
import { BookCard } from '@/components/BookCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Book, catalog } from '@/constants/books';
import { fetchBooks } from '@/lib/bookService';

export default function AudioScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [books, setBooks] = useState<Book[]>(catalog);

  useEffect(() => {
    fetchBooks()
      .then((result) => setBooks(result.data))
      .catch(() => setBooks(catalog));
  }, []);

  const audioBooks = useMemo(() => books.filter((b) => !!b.audioPreview), [books]);
  const featured = audioBooks[0];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}> 
        {featured?.cover ? (
          <ImageBackground source={{ uri: featured.cover }} style={styles.heroBg} imageStyle={{ borderRadius: 18 }}>
            <View style={styles.overlay} />
          </ImageBackground>
        ) : (
          <View style={[styles.heroBg, { backgroundColor: theme.tint }]} />
        )}
        <View style={styles.heroContent}> 
          <Text style={styles.eyebrow}>Audio originals</Text>
          <Text style={styles.title}>{featured?.title ?? 'Free audio shelf'}</Text>
          <Text style={styles.subtitle}>Stream chapters or download for offline listening.</Text>
          <Pressable style={[styles.cta, { backgroundColor: '#ffffff' }]}> 
            <Text style={[styles.ctaText, { color: '#0f172a' }]}>Download playlist</Text>
          </Pressable>
        </View>
      </View>

      {featured && (
        <View style={styles.section}>
          <SectionHeading title="Now playing" />
          <AudioMiniPlayer
            track={{
              title: featured.title,
              author: featured.author,
              cover: featured.cover,
              accent: featured.accent,
              audioUrl: featured.audioPreview!,
            }}
          />
        </View>
      )}

      <View style={styles.section}>
        <SectionHeading title="New audio drops" />
        <FlatList
          data={audioBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookCard book={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  hero: {
    marginBottom: 20,
  },
  heroBg: {
    height: 180,
    borderRadius: 18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 18,
  },
  heroContent: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  eyebrow: {
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  cta: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  ctaText: {
    fontWeight: '800',
  },
  section: {
    marginTop: 12,
  },
});
