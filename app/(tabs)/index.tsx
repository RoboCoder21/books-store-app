import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { AudioMiniPlayer } from '@/components/AudioMiniPlayer';
import { BookCard } from '@/components/BookCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Book, catalog } from '@/constants/books';
import { signOut } from '@/lib/authService';
import { fetchBooks } from '@/lib/bookService';

const sampleTrack = {
  title: 'Sample Audio Chapter',
  author: 'Unknown',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};

type AuthorChip = {
  name: string;
  image?: string;
};

export default function BrowseScreen() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>(catalog);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const inputBackground = colorScheme === 'dark' ? '#0b1020' : '#ffffff';
  const inputBorder = colorScheme === 'dark' ? '#1f2937' : '#e2e8f0';
  const placeholder = colorScheme === 'dark' ? 'rgba(226,232,240,0.6)' : 'rgba(15,23,42,0.5)';
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isWide = width >= 1024;

  const heroBook = useMemo(() => books.find((b) => b.featured) ?? books[0], [books]);
  const filtered = useMemo(() => {
    if (!query.trim()) return books;
    const value = query.toLowerCase();
    return books.filter(
      (book) => book.title.toLowerCase().includes(value) || book.author.toLowerCase().includes(value)
    );
  }, [books, query]);
  const newArrivals = useMemo(() => books.slice(0, 6), [books]);
  const trending = useMemo(() => [...books].sort((a, b) => b.rating - a.rating).slice(0, 6), [books]);
  const popularAuthors = useMemo<AuthorChip[]>(() => {
    const seen = new Set<string>();
    const unique: AuthorChip[] = [];
    books.forEach((book) => {
      if (seen.has(book.author)) return;
      seen.add(book.author);
      unique.push({ name: book.author, image: book.authorImage });
    });
    return unique.slice(0, 8);
  }, [books]);

  const loadBooks = useCallback(async () => {
    setRefreshing(true);
    try {
      const result = await fetchBooks();
      setBooks(result.data);
    } catch (error) {
      console.warn('Using fallback catalog', error);
      setBooks(catalog);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const renderBook = ({ item }: { item: Book }) => (
    <View style={[styles.bookItem, isTablet && styles.bookItemTablet]}>
      <BookCard book={item} />
    </View>
  );
  const topAudio = heroBook?.audioPreview
    ? {
        title: heroBook.title,
        author: heroBook.author,
        cover: heroBook.cover,
        accent: heroBook.accent,
        audioUrl: heroBook.audioPreview,
      }
    : sampleTrack;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        {
          backgroundColor: theme.background,
          paddingHorizontal: isWide ? 28 : 20,
          maxWidth: 1200,
          alignSelf: 'center',
          width: '100%',
        },
      ]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadBooks} tintColor={theme.tint} />}
      showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.brand, { color: theme.text }]}>My Bookstore</Text>
          <Text
            style={[
              styles.brandSub,
              { color: colorScheme === 'dark' ? 'rgba(226,232,240,0.7)' : 'rgba(15,23,42,0.6)' },
            ]}>
            Discover, listen, enjoy.
          </Text>
        </View>
        <Pressable
          style={[styles.iconButton, { borderColor: inputBorder }]}
          onPress={async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Sign out failed', error);
              return;
            }
            router.replace('/modal');
          }}
          accessibilityLabel="Sign out">
          <FontAwesome name="sign-out" size={18} color={theme.text} />
        </Pressable>
      </View>

      <View style={[styles.searchBar, { backgroundColor: inputBackground, borderColor: inputBorder }]}> 
        <FontAwesome name="search" size={16} color={placeholder} />
        <TextInput
          placeholder="Search books or authors"
          placeholderTextColor={placeholder}
          style={[styles.searchInput, { color: theme.text }]}
          value={query}
          onChangeText={setQuery}
        />
        <FontAwesome name="sliders" size={16} color={placeholder} />
      </View>

      <View style={[styles.heroContainer, isTablet && styles.heroRow]}>
        <View style={[styles.heroContent, isTablet && { flex: 1 }]}> 
          <Text style={styles.eyebrow}>Daily reading</Text>
          <Text style={styles.headline}>A quick bookstore with audiobooks.</Text>
          <Text style={styles.subhead}>New releases and curated shelves every week.</Text>
          <View style={styles.heroActions}>
            <View style={styles.heroAvatarRow}>
              {[1, 2, 3].map((id) => (
                <View key={id} style={[styles.avatar, id !== 1 && { marginLeft: -10 }]} />
              ))}
            </View>
            <View style={styles.heroCta}>
              <Text style={styles.heroCtaText}>Browse now</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeading title="New arrivals" actionLabel="See all" />
        <FlatList
          horizontal
          data={newArrivals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.featuredCard, { borderColor: inputBorder }]}>
              {item.cover ? (
                <View style={styles.featuredImageWrap}>
                  <Text style={styles.featuredBadge}>Featured</Text>
                  <ImageBackground source={{ uri: item.cover }} style={styles.featuredImage} imageStyle={{ borderRadius: 12 }} />
                </View>
              ) : (
                <View style={[styles.featuredImage, { backgroundColor: item.accent }]} />
              )}
              <Text style={styles.featuredTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.featuredAuthor} numberOfLines={1}>
                {item.author}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <SectionHeading title="Audiobooks" actionLabel="Listen" />
        <AudioMiniPlayer track={topAudio} />
      </View>

      <View style={styles.section}>
        <SectionHeading title="Trending books" actionLabel="View all" />
        <FlatList
          data={trending}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={({ item }) => (
            <View style={{ width: 220 }}>
              <BookCard book={item} hideDownloadBadge />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <SectionHeading title="Popular authors" />
        <FlatList
          data={popularAuthors}
          horizontal
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View
              style={[
                styles.authorChip,
                { borderColor: inputBorder, backgroundColor: colorScheme === 'dark' ? '#111827' : '#ffffff' },
              ]}>
              <View style={[styles.avatar, { backgroundColor: theme.tint }]}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.authorImage} />
                ) : (
                  <Text style={[styles.avatarInitial, { color: theme.text }]}>{item.name.charAt(0).toUpperCase()}</Text>
                )}
              </View>
              <Text style={[styles.authorName, { color: theme.text }]}>{item.name}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <SectionHeading title="All books" />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          numColumns={isTablet ? 2 : 1}
          columnWrapperStyle={isTablet ? styles.gridColumns : undefined}
          renderItem={renderBook}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </View>

      <View style={{ height: 36 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 20,
    backgroundColor: Colors.light.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  brandSub: {
    color: 'rgba(255,255,255,0.6)',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontWeight: '600',
  },
  heroContainer: {
    backgroundColor: '#facc15',
    borderRadius: 18,
    padding: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  heroContent: {
    marginTop: 4,
  },
  eyebrow: {
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 12,
    color: '#0f172a',
  },
  headline: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  subhead: {
    color: 'rgba(15,23,42,0.7)',
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  heroAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0ea5e9',
    borderWidth: 2,
    borderColor: '#facc15',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  authorImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  avatarInitial: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 14,
  },
  heroCta: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  heroCtaText: {
    color: '#f8fafc',
    fontWeight: '800',
  },
  section: {
    marginTop: 18,
  },
  gridColumns: {
    justifyContent: 'space-between',
    columnGap: 12,
    rowGap: 12,
  },
  bookItem: {
    flex: 1,
  },
  bookItemTablet: {
    maxWidth: '48%',
  },
  featuredCard: {
    width: 160,
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: StyleSheet.hairlineWidth,
  },
  featuredImageWrap: {
    marginBottom: 10,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
    backgroundColor: '#2563eb',
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: '700',
  },
  featuredImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  featuredTitle: {
    fontWeight: '800',
    fontSize: 14,
    color: '#0f172a',
  },
  featuredAuthor: {
    color: 'rgba(15,23,42,0.6)',
    marginTop: 2,
  },
  authorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  authorName: {
    fontWeight: '700',
  },
});
