import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

function StarRating({ rating }) {
  return (
    <Text style={styles.rating} accessibilityLabel={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </Text>
  );
}

export default function BookCard({ book, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      {book.coverUri ? (
        <Image source={{ uri: book.coverUri }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.coverInitial}>{book.title.charAt(0).toUpperCase()}</Text>
        </View>
      )}

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author || 'Unknown author'}
        </Text>
        <StarRating rating={book.rating || 0} />
        <View style={styles.metaRow}>
          <Text style={styles.status}>{book.status}</Text>
          <Text style={styles.shelf} numberOfLines={1}>
            {book.shelf || 'Favorites'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fffaf3',
    borderWidth: 1,
    borderColor: '#d7b98b',
    shadowColor: '#3a2416',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.76,
  },
  cover: {
    width: 58,
    height: 86,
    borderRadius: 4,
    backgroundColor: '#d8cec0',
  },
  coverPlaceholder: {
    width: 58,
    height: 86,
    borderRadius: 4,
    backgroundColor: '#6f4b31',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverInitial: {
    color: '#fff7ea',
    fontSize: 28,
    fontWeight: '700',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#2f2118',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  author: {
    color: '#746050',
    fontSize: 14,
    marginTop: 4,
  },
  rating: {
    color: '#c38324',
    fontSize: 15,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  status: {
    color: '#34533f',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#dce8d8',
    overflow: 'hidden',
  },
  shelf: {
    flexShrink: 1,
    color: '#754b2d',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#f1ddbd',
    overflow: 'hidden',
  },
});
