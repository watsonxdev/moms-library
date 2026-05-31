import { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Button
} from 'react-native';

import {
  initializeDatabase,
  getBooks
} from '../database/database';

import BookCard from '../components/BookCard';

export default function HomeScreen({
  navigation
}) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  function loadBooks() {
    const data = getBooks();
    setBooks(data);
  }

  useEffect(() => {
    initializeDatabase();
    loadBooks();

    const unsubscribe =
      navigation.addListener(
        'focus',
        loadBooks
      );

    return unsubscribe;
  }, []);

  const filteredBooks = books.filter(
    book =>
      book.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      book.author
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <View
      style={{
        flex: 1,
        padding: 16
      }}
    >
      <TextInput
        placeholder="Search books..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 8
        }}
      />

      <Button
        title="Add Book"
        onPress={() =>
          navigation.navigate('Add Book')
        }
      />

      <FlatList
        data={filteredBooks}
        keyExtractor={item =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() =>
              navigation.navigate(
                'Book Details',
                { book: item }
              )
            }
          />
        )}
      />
    </View>
  );
}
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BookCard from '../components/BookCard';

export default function HomeScreen({ books, isLoading, onAddBook, onSelectBook }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Mom's Library</Text>
          <Text style={styles.title}>Book Shelf</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.addButton, pressed && styles.pressed]} onPress={onAddBook}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color="#6d5f52" />
          <Text style={styles.centerText}>Loading books...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={books.length ? styles.list : styles.emptyList}
          renderItem={({ item }) => (
            <BookCard book={item} onPress={() => onSelectBook(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Text style={styles.emptyTitle}>No books yet</Text>
              <Text style={styles.centerText}>Add a favorite, a wish-list title, or the next book club pick.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f1e8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e1d6c8',
  },
  eyebrow: {
    color: '#846f5d',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#251f1a',
    fontSize: 31,
    fontWeight: '800',
    marginTop: 2,
  },
  addButton: {
    minWidth: 76,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: '#3d5b47',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.72,
  },
  list: {
    padding: 16,
    paddingBottom: 30,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: '#251f1a',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  centerText: {
    color: '#665a50',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
    textAlign: 'center',
  },
});
