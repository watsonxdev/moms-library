import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function StarRating({ rating }) {
  return (
    <Text style={styles.rating} accessibilityLabel={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </Text>
  );
}

export default function BookDetailScreen({ book, onBack, onDelete }) {
  const confirmDelete = () => {
    Alert.alert('Delete book?', `Remove "${book.title}" from the library?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.toolbar}>
        <Pressable style={({ pressed }) => [styles.textButton, pressed && styles.pressed]} onPress={onBack}>
          <Text style={styles.textButtonLabel}>Back</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]} onPress={confirmDelete}>
          <Text style={styles.deleteButtonLabel}>Delete</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {book.coverUri ? (
          <Image source={{ uri: book.coverUri }} style={styles.cover} />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.coverInitial}>{book.title.charAt(0).toUpperCase()}</Text>
          </View>
        )}

        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author || 'Unknown author'}</Text>
        <StarRating rating={book.rating || 0} />

        <View style={styles.metaRow}>
          <Text style={styles.status}>{book.status}</Text>
          <Text style={styles.shelf}>{book.shelf || 'Favorites'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{book.notes || 'No notes saved for this book yet.'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5ead9',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d9bd93',
    backgroundColor: '#efe0c8',
  },
  textButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textButtonLabel: {
    color: '#754b2d',
    fontSize: 16,
    fontWeight: '800',
  },
  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#7d2d2b',
  },
  deleteButtonLabel: {
    color: '#fff7ea',
    fontSize: 15,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.72,
  },
  content: {
    alignItems: 'center',
    padding: 22,
    paddingBottom: 40,
  },
  cover: {
    width: 148,
    height: 222,
    borderRadius: 8,
    backgroundColor: '#d8cec0',
  },
  coverPlaceholder: {
    width: 148,
    height: 222,
    borderRadius: 8,
    backgroundColor: '#6f4b31',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverInitial: {
    color: '#fff7ea',
    fontSize: 58,
    fontWeight: '800',
  },
  title: {
    color: '#2f2118',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    marginTop: 22,
    textAlign: 'center',
  },
  author: {
    color: '#746050',
    fontSize: 18,
    marginTop: 8,
    textAlign: 'center',
  },
  rating: {
    color: '#c38324',
    fontSize: 24,
    marginTop: 14,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  status: {
    color: '#34533f',
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#dce8d8',
    overflow: 'hidden',
  },
  shelf: {
    color: '#754b2d',
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f1ddbd',
    overflow: 'hidden',
  },
  section: {
    alignSelf: 'stretch',
    marginTop: 28,
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#fffaf3',
    borderWidth: 1,
    borderColor: '#d7b98b',
  },
  sectionTitle: {
    color: '#2f2118',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  notes: {
    color: '#4b3527',
    fontSize: 16,
    lineHeight: 24,
  },
});
