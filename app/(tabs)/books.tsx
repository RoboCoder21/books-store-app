import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { BookCard } from '@/components/BookCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Book, catalog } from '@/constants/books';
import { fetchBooks } from '@/lib/bookService';
import { useI18n } from '@/lib/i18n';

type Pillar = 'Fiction' | 'Nonfiction' | 'Spiritual';

const pillars: Record<Pillar, string[]> = {
  Fiction: ['All', 'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Literary', 'Historical', 'Thriller', 'Adventure'],
  Nonfiction: ['All', 'Biography', 'History', 'Self-Help', 'Cookbooks', 'Cooking', 'Science', 'True Crime', 'Business', 'Nonfiction'],
  Spiritual: ['All', 'Spiritual', 'Christian', 'Islamic', 'Devotional', 'Interfaith', 'Faith'],
};

export default function BooksScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { t } = useI18n();
  const [books, setBooks] = useState<Book[]>(catalog);
  const [pillar, setPillar] = useState<Pillar>('Fiction');
  const [genre, setGenre] = useState<string>('All');
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isWide = width >= 1024;

  useEffect(() => {
    fetchBooks()
      .then((result) => setBooks(result.data))
      .catch(() => setBooks(catalog));
  }, []);

  useEffect(() => {
    setGenre('All');
  }, [pillar]);

  const pillarLabel = (value: Pillar) => t(`pillar_${value.toLowerCase()}`);

  const filtered = useMemo(() => {
    const normalizedCategories = pillars[pillar].filter((c) => c !== 'All').map((c) => c.toLowerCase());

    const belongsToPillar = (category: string) => {
      const c = category?.toLowerCase() ?? '';
      if (pillar === 'Fiction') return normalizedCategories.includes(c) || c === 'fiction';
      if (pillar === 'Nonfiction') return normalizedCategories.includes(c) || c === 'nonfiction' || c === 'business';
      return (
        normalizedCategories.includes(c) ||
        c === 'spiritual' ||
        c === 'spirituality' ||
        c === 'christian' ||
        c === 'islamic'
      );
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
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingHorizontal: isWide ? 28 : 20,
          maxWidth: 1200,
          alignSelf: 'center',
          width: '100%',
        },
      ]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{t('booksTitle')}</Text>
        <Text style={styles.title}>{t('browseByCategory')}</Text>
        <Text style={styles.subtitle}>{t('allTitlesFree')}</Text>
      </View>

      <View style={styles.chipsRow}>
        {(Object.keys(pillars) as Array<keyof typeof pillars>).map((item) => {
          const active = pillar === item;
          return (
            <Pressable
              key={item}
              onPress={() => setPillar(item)}
              style={[styles.pill, active && { backgroundColor: theme.tint }]}> 
              <Text style={[styles.pillText, active && { color: '#ffffff' }]}>{pillarLabel(item)}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.chipsRow}>
        {pillars[pillar].map((item) => {
          const active = genre === item;
          const display = item === 'All' ? t('all') : item;
          return (
            <Pressable
              key={item}
              onPress={() => setGenre(item)}
              style={[styles.genrePill, { borderColor: theme.tint }, active && { backgroundColor: theme.tint }]}> 
              <Text style={[styles.genreText, active && { color: '#ffffff' }]}>{display}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionHeading title={`${pillarLabel(pillar)} ${t('picks')}`} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bookItem, isTablet && styles.bookItemTablet]}>
            <BookCard book={item} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        numColumns={isTablet ? 2 : 1}
        columnWrapperStyle={isTablet ? styles.gridColumns : undefined}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
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
  bookItem: {
    flex: 1,
  },
  bookItemTablet: {
    maxWidth: '48%',
  },
  gridColumns: {
    justifyContent: 'space-between',
    columnGap: 12,
    rowGap: 12,
  },
});
