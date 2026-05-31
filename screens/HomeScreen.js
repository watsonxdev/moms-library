import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BookCard from '../components/BookCard';

const allShelvesLabel = 'All shelves';

function StatTile({ label, value }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen({ books, isLoading, onAddBook, onSelectBook }) {
  const [selectedShelf, setSelectedShelf] = useState(allShelvesLabel);

  const shelves = useMemo(() => {
    const shelfNames = books.map((book) => book.shelf || 'Favorites');
    return [allShelvesLabel, ...Array.from(new Set(shelfNames))];
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (selectedShelf === allShelvesLabel) {
      return books;
    }

    return books.filter((book) => (book.shelf || 'Favorites') === selectedShelf);
  }, [books, selectedShelf]);

  const stats = useMemo(() => {
    const finished = books.filter((book) => book.status === 'Finished').length;
    const reading = books.filter((book) => book.status === 'Reading').length;
    const ratedBooks = books.filter((book) => book.rating > 0);
    const averageRating = ratedBooks.length
      ? (ratedBooks.reduce((sum, book) => sum + book.rating, 0) / ratedBooks.length).toFixed(1)
      : '0.0';

    return {
      total: books.length,
      reading,
      finished,
      averageRating,
    };
  }, [books]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Mom's Library</Text>
          <Text style={styles.title}>Cozy Bookshelf</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.addButton, pressed && styles.pressed]} onPress={onAddBook}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <View style={styles.dashboard}>
        <StatTile label="Books" value={stats.total} />
        <StatTile label="Reading" value={stats.reading} />
        <StatTile label="Finished" value={stats.finished} />
        <StatTile label="Avg rating" value={stats.averageRating} />
      </View>

      <View style={styles.shelfRail}>
        <FlatList
          horizontal
          data={shelves}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shelfList}
          renderItem={({ item }) => {
            const isSelected = selectedShelf === item;

            return (
              <Pressable
                style={[styles.shelfChip, isSelected && styles.shelfChipSelected]}
                onPress={() => setSelectedShelf(item)}
              >
                <Text style={[styles.shelfChipText, isSelected && styles.shelfChipTextSelected]}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color="#754b2d" />
          <Text style={styles.centerText}>Loading books...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={filteredBooks.length ? styles.list : styles.emptyList}
          renderItem={({ item }) => (
            <BookCard book={item} onPress={() => onSelectBook(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Text style={styles.emptyTitle}>No books here yet</Text>
              <Text style={styles.centerText}>Add a favorite, a wish-list title, or a book club pick.</Text>
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
    backgroundColor: '#f5ead9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#d9bd93',
    backgroundColor: '#efe0c8',
  },
  eyebrow: {
    color: '#8a5d38',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#2f2118',
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
    backgroundColor: '#754b2d',
  },
  addButtonText: {
    color: '#fff7ea',
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.72,
  },
  dashboard: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statTile: {
    flex: 1,
    minHeight: 76,
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d7b98b',
    backgroundColor: '#fffaf3',
  },
  statValue: {
    color: '#3b291e',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  statLabel: {
    color: '#746050',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
    textAlign: 'center',
  },
  shelfRail: {
    paddingTop: 14,
  },
  shelfList: {
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  shelfChip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#c9a77a',
    backgroundColor: '#fffaf3',
  },
  shelfChipSelected: {
    backgroundColor: '#754b2d',
    borderColor: '#754b2d',
  },
  shelfChipText: {
    color: '#754b2d',
    fontSize: 13,
    fontWeight: '800',
  },
  shelfChipTextSelected: {
    color: '#fff7ea',
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
    color: '#2f2118',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  centerText: {
    color: '#746050',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
    textAlign: 'center',
  },
});
