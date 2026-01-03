import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Alert, Image, Linking, Pressable, StyleSheet, View } from 'react-native';

import Colors from '@/constants/Colors';
import { Book } from '@/constants/books';
import { Text } from './Themed';
import { useColorScheme } from './useColorScheme';

export type BookCardProps = {
  book: Book;
  onPress?: (book: Book) => void;
};

export function BookCard({ book, onPress }: BookCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const muted = colorScheme === 'dark' ? 'rgba(226,232,240,0.7)' : 'rgba(15,23,42,0.6)';
  const surface = colorScheme === 'dark' ? '#111827' : '#ffffff';
  const border = colorScheme === 'dark' ? '#1f2937' : '#e2e8f0';
  const categoryColor = colorScheme === 'dark' ? 'rgba(226,232,240,0.7)' : 'rgba(15,23,42,0.6)';
  const fileSizeMb = Math.max(3, Math.round(((book.pages ?? 240) * 0.015) * 10) / 10);
  const fileLabel = `PDF · ${fileSizeMb.toFixed(1)} MB`;

  const handleOpenFile = async () => {
    if (!book.fileUrl) {
      Alert.alert('No file available', 'This book does not have a download link yet.');
      return;
    }
    try {
      await Linking.openURL(book.fileUrl);
    } catch (error) {
      Alert.alert('Unable to open file', 'Please check the link and try again.');
    }
  };

  return (
    <Pressable
      onPress={() => onPress?.(book)}
      style={({ pressed }) => [
        styles.card,
        {
          opacity: pressed ? 0.85 : 1,
          backgroundColor: surface,
          borderColor: border,
          shadowColor: colorScheme === 'dark' ? '#000000' : '#94a3b8',
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${book.title} by ${book.author}`}>
      {book.cover ? (
        <Image source={{ uri: book.cover }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, { backgroundColor: book.accent }]} />
      )}
      <View style={styles.meta}>
        <View style={styles.headerRow}>
          <Text style={[styles.category, { color: categoryColor }]}>{book.category}</Text>
          <View style={[styles.downloadPill, { borderColor: book.accent }]}> 
            <FontAwesome name="download" size={12} color={book.accent} />
            <Text style={[styles.fileText, { color: book.accent }]}>{fileLabel}</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={[styles.subtitle, { color: muted }]} numberOfLines={1}>
          {book.author}
        </Text>
        <View style={styles.row}>
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={14} color="#f59e0b" />
            <Text style={styles.rating}>{book.rating.toFixed(1)}</Text>
          </View>
          <Text style={[styles.dot, { color: muted }]}>|</Text>
          <Text style={[styles.pages, { color: muted }]}>{book.pages} pages</Text>
        </View>
        <View style={styles.footerRow}>
          <View style={[styles.tag, { borderColor: book.accent }]}> 
            <Text style={[styles.tagText, { color: book.accent }]}>{book.featured ? 'Popular pick' : 'Available offline'}</Text>
          </View>
          <Pressable
            style={[styles.cta, { backgroundColor: theme.tint, opacity: book.fileUrl ? 1 : 0.6 }]}
            onPress={handleOpenFile}
            accessibilityLabel={book.fileUrl ? `Open ${book.title}` : 'Download unavailable'}>
            <FontAwesome name="arrow-circle-o-down" size={14} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.ctaText}>{book.fileUrl ? 'Download now' : 'No file yet'}</Text>
          </Pressable>
          {book.fileUrl && (
            <Pressable
              style={[styles.ctaGhost, { borderColor: theme.tint }]}
              onPress={() => Linking.openURL(book.fileUrl!)}
              accessibilityLabel={`Open ${book.title}`}>
              <FontAwesome name="external-link" size={14} color={theme.tint} style={{ marginRight: 6 }} />
              <Text style={[styles.ctaGhostText, { color: theme.tint }]}>Open file</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cover: {
    width: 72,
    height: 96,
    borderRadius: 12,
    marginRight: 12,
  },
  meta: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category: {
    fontWeight: '700',
  },
  downloadPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  fileText: {
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
  },
  pages: {
    fontSize: 14,
  },
  dot: {
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tagText: {
    fontWeight: '700',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  ctaText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  ctaGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginLeft: 8,
    backgroundColor: '#ffffff',
  },
  ctaGhostText: {
    fontWeight: '800',
  },
});
