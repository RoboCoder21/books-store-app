import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { BookCard } from '@/components/BookCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Book, catalog } from '@/constants/books';
import { fetchBooks } from '@/lib/bookService';

type Pillar = 'Fiction' | 'Nonfiction';

const pillars: Record<Pillar, string[]> = {
  Fiction: ['All', 'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Literary', 'Historical', 'Thriller', 'Adventure'],
  Nonfiction: ['All', 'Biography', 'History', 'Self-Help', 'Cookbooks', 'Cooking', 'Science', 'True Crime', 'Business', 'Nonfiction'],
};

export default function BooksScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [books, setBooks] = useState<Book[]>(catalog);
  const [pillar, setPillar] = useState<Pillar>('Fiction');
  const [genre, setGenre] = useState<string>('All');

  useEffect(() => {
    fetchBooks()
      .then((result) => setBooks(result.data))
      .catch(() => setBooks(catalog));
  }, []);

  useEffect(() => {
    setGenre('All');
  }, [pillar]);

  const filtered = useMemo(() => {
    const categories = pillars[pillar].filter((c) => c !== 'All').map((c) => c.toLowerCase());

    const belongsToPillar = (category: string) => {
      const c = category.toLowerCase();
      if (pillar === 'Fiction') return categories.includes(c) || c === 'fiction';
      return categories.includes(c) || c === 'nonfiction' || c === 'business';
    };

    return books.filter((book) => {
      const inPillar = belongsToPillar(book.category);
      if (!inPillar) return false;
      if (genre === 'All') return true;
      return book.category.toLowerCase() === genre.toLowerCase();
    });
  }, [books, pillar, genre]);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Books</Text>
        <Text style={styles.title}>Browse by category</Text>
        <Text style={styles.subtitle}>All titles are free to download and read offline.</Text>
      </View>

      <View style={styles.chipsRow}>
        {(Object.keys(pillars) as Array<keyof typeof pillars>).map((item) => {
          const active = pillar === item;
          return (
            <Pressable
              key={item}
              onPress={() => setPillar(item)}
              style={[styles.pill, active && { backgroundColor: theme.tint }]}> 
              <Text style={[styles.pillText, active && { color: '#ffffff' }]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.chipsRow}>
        {pillars[pillar].map((item) => {
          const active = genre === item;
          return (
            <Pressable
              key={item}
              onPress={() => setGenre(item)}
              style={[styles.genrePill, { borderColor: theme.tint }, active && { backgroundColor: theme.tint }]}> 
              <Text style={[styles.genreText, active && { color: '#ffffff' }]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionHeading title={`${pillar} picks`} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookCard book={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    color: '#2563eb',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    marginTop: 6,
    color: 'rgba(15,23,42,0.6)',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e2e8f0',
  },
  pillText: {
    fontWeight: '700',
  },
  genrePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#ffffff',
  },
  genreText: {
    fontWeight: '700',
  },
});
