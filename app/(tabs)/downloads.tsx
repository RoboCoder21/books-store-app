import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { BookCard } from '@/components/BookCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Book, catalog } from '@/constants/books';
import { fetchBooks } from '@/lib/bookService';

type DownloadState = 'Downloaded' | 'Downloading' | 'Queued';

type DownloadItem = Book & {
  status: DownloadState;
  progress: number;
  sizeMb: number;
};

export default function DownloadsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [items, setItems] = useState<DownloadItem[]>([]);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isWide = width >= 1024;

  useEffect(() => {
    fetchBooks()
      .then((result) => seedDownloads(result.data))
      .catch(() => seedDownloads(catalog));
  }, []);

  const seedDownloads = (books: Book[]) => {
    const sample = books.slice(0, 6).map((book, index) => {
      const sizeMb = Math.max(3, Math.round(((book.pages ?? 240) * 0.015) * 10) / 10);
      const preset: DownloadState = index < 2 ? 'Downloaded' : index < 4 ? 'Downloading' : 'Queued';
      const progress = preset === 'Downloaded' ? 1 : preset === 'Downloading' ? 0.55 : 0;
      return { ...book, status: preset, progress, sizeMb };
    });
    setItems(sample);
  };

  const downloaded = useMemo(() => items.filter((i) => i.status === 'Downloaded'), [items]);

  const renderDownload = ({ item }: { item: DownloadItem }) => {
    const statusColor = item.status === 'Downloaded' ? '#16a34a' : item.status === 'Downloading' ? '#f59e0b' : '#94a3b8';
    return (
      <View style={[styles.card, { borderColor: theme.tint }]}> 
        <BookCard book={item} />
        <View style={styles.progressRow}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>{item.status}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.statusText}>{item.sizeMb.toFixed(1)} MB</Text>
          {item.status !== 'Downloaded' && (
            <Text style={[styles.statusText, { marginLeft: 8 }]}>{Math.round(item.progress * 100)}%</Text>
          )}
          <Pressable style={[styles.readButton, { borderColor: theme.tint }]}>
            <Text style={[styles.readText, { color: theme.tint }]}>{item.status === 'Downloaded' ? 'Read offline' : 'Prioritize'}</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <FlatList
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
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={[styles.downloadItem, isTablet && styles.downloadItemTablet]}>{renderDownload({ item })}</View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      numColumns={isTablet ? 2 : 1}
      columnWrapperStyle={isTablet ? styles.gridColumns : undefined}
      ListHeaderComponent={
        <View style={styles.header}> 
          <Text style={styles.eyebrow}>Downloads</Text>
          <Text style={styles.title}>Your offline library</Text>
          <Text style={styles.subtitle}>
            Everything here is free. You can re-download anytime.
          </Text>
          <SectionHeading title={`Available offline (${downloaded.length})`} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    marginBottom: 12,
    gap: 6,
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
  },
  subtitle: {
    color: 'rgba(15,23,42,0.6)',
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontWeight: '700',
  },
  dot: {
    fontWeight: '800',
  },
  readButton: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#ffffff',
  },
  readText: {
    fontWeight: '800',
  },
  downloadItem: {
    flex: 1,
  },
  downloadItemTablet: {
    maxWidth: '48%',
  },
  gridColumns: {
    justifyContent: 'space-between',
    columnGap: 12,
    rowGap: 12,
  },
});
