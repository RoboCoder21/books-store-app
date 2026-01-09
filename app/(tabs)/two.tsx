import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BookCard } from '@/components/BookCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Book, catalog } from '@/constants/books';
import { addBook, deleteBook, fetchBooks, uploadBookFile } from '@/lib/bookService';

export default function ListsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const cardSurface = colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const cardBorder = colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const progressTrack = colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const isAdmin =
    process.env.EXPO_PUBLIC_ADMIN_MODE === 'true' ||
    ((Constants?.expoConfig?.extra as Record<string, any> | undefined)?.EXPO_PUBLIC_ADMIN_MODE === 'true');
  const [books, setBooks] = useState<Book[]>(catalog);

  const readingList = useMemo(
    () =>
      books.slice(0, 4).map((book, index) => ({
        ...book,
        progress: book.progress ?? 0.25 + index * 0.15,
      })),
    [books]
  );

  const wishList = useMemo(() => books.filter((b) => b.featured).slice(0, 5), [books]);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Custom');
  const [saving, setSaving] = useState(false);
  const [pickedFile, setPickedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await fetchBooks();
      setBooks(result.data);
    } catch (error) {
      setBooks(catalog);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refreshFromRemote = async () => {
    try {
      const result = await fetchBooks();
      setBooks(result.data);
    } catch (error) {
      setBooks(catalog);
    }
  };

  const handleAddSample = async () => {
    try {
      await addBook({
        title: 'New Arrival',
        author: 'You',
        price: 12.0,
        rating: 4.5,
        pages: 220,
        category: 'Custom',
        accent: '#2563eb',
        description: 'Created from the app to demo writes to the database.',
        cover: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=640&q=80',
        featured: true,
      });
      await refreshFromRemote();
    } catch (error) {
      console.warn('Unable to add book', error);
    }
  };

  const handleAddExternal = async () => {
    if (!newTitle.trim() || !newAuthor.trim()) return;
    setSaving(true);
    try {
      let fileUrl: string | undefined;
      if (pickedFile) {
        const uploadName = `book-${Date.now()}-${pickedFile.name ?? 'file'}`;
        fileUrl = await uploadBookFile(pickedFile.uri, uploadName);
      }
      await addBook({
        title: newTitle.trim(),
        author: newAuthor.trim(),
        price: 0,
        rating: 4.5,
        pages: 240,
        category: newCategory.trim() || 'Custom',
        accent: '#2563eb',
        description: 'Added by user',
        fileUrl,
        featured: false,
      });
      await refreshFromRemote();
      setNewTitle('');
      setNewAuthor('');
      setNewCategory('Custom');
      setPickedFile(null);
    } catch (error) {
      console.warn('Unable to add external book', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
    if (result.type === 'success') {
      setPickedFile(result);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteBook(id);
      await refreshFromRemote();
    } catch (error) {
      console.warn('Unable to delete book', error);
      Alert.alert('Delete failed', 'You might not have permission. Ensure admin mode and Supabase delete policy are enabled.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Your shelf</Text>
        <Text style={styles.headline}>Reading lists & saved picks</Text>
        <Text style={styles.subhead}>Track progress or queue up what is next.</Text>
      </View>

      <View style={styles.sectionHeaderRow}>
        <SectionHeading title="In progress" />
        <Pressable style={[styles.addButton, { borderColor: cardBorder }]} onPress={handleAddSample}>
          <Text style={styles.addButtonText}>Add sample book</Text>
        </Pressable>
      </View>
      <View style={[styles.formCard, { borderColor: cardBorder, backgroundColor: cardSurface }]}>
        <Text style={styles.formTitle}>Add your own book</Text>
        <TextInput
          style={[styles.input, { borderColor: cardBorder }]}
          placeholder="Title"
          placeholderTextColor="rgba(15,23,42,0.5)"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={[styles.input, { borderColor: cardBorder }]}
          placeholder="Author"
          placeholderTextColor="rgba(15,23,42,0.5)"
          value={newAuthor}
          onChangeText={setNewAuthor}
        />
        <TextInput
          style={[styles.input, { borderColor: cardBorder }]}
          placeholder="Category (e.g., Fantasy, Business)"
          placeholderTextColor="rgba(15,23,42,0.5)"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <Pressable style={[styles.fileButton, { borderColor: cardBorder }]} onPress={handlePickFile}>
          <Text style={styles.addButtonText}>{pickedFile ? pickedFile.name : 'Attach book file (PDF/EPUB)'}</Text>
        </Pressable>
        <Pressable
          style={[styles.addButton, { borderColor: cardBorder, opacity: saving ? 0.7 : 1 }]}
          onPress={handleAddExternal}
          disabled={saving}>
          <Text style={styles.addButtonText}>{saving ? 'Adding...' : 'Add to library'}</Text>
        </Pressable>
      </View>
      <FlatList
        data={readingList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.listCard, { backgroundColor: cardSurface, borderColor: cardBorder }]}>
            <BookCard book={item} />
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Progress</Text>
              <View style={[styles.progressTrack, { backgroundColor: progressTrack }]}>
                <View style={[styles.progressFill, { width: `${Math.min(1, item.progress ?? 0) * 100}%`, backgroundColor: item.accent }]} />
              </View>
              <Text style={styles.progressPercent}>{Math.round((item.progress ?? 0) * 100)}%</Text>
            </View>
            {isAdmin && (
              <Pressable style={[styles.removeButton, { borderColor: cardBorder }]} onPress={() => handleDelete(item.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            )}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        scrollEnabled={false}
      />

      <SectionHeading title="Saved for later" />
      <FlatList
        data={wishList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.listCard, { backgroundColor: cardSurface, borderColor: cardBorder }]}>
            <BookCard book={item} />
            {isAdmin && (
              <Pressable style={[styles.removeButton, { borderColor: cardBorder }]} onPress={() => handleDelete(item.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            )}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 18 }}
      />
      <View style={{ height: 18 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    backgroundColor: '#facc15',
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eyebrow: {
    color: '#0f172a',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headline: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
  },
  subhead: {
    color: 'rgba(15,23,42,0.7)',
    marginTop: 4,
  },
  listCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#ffffff',
  },
  fileButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#ffffff',
  },
  addButtonText: {
    fontWeight: '700',
    color: '#0f172a',
  },
  removeButton: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#fff1f2',
  },
  removeText: {
    fontWeight: '800',
    color: '#b91c1c',
  },
  formCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 14,
    gap: 10,
  },
  formTitle: {
    fontWeight: '800',
    fontSize: 16,
    color: '#0f172a',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f172a',
  },
  progressRow: {
    marginTop: 12,
  },
  progressLabel: {
    fontWeight: '700',
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressPercent: {
    marginTop: 6,
    fontWeight: '700',
  },
});
