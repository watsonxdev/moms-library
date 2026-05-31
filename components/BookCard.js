import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

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
        <Text style={styles.status}>{book.status}</Text>
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ded6cc',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
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
    backgroundColor: '#6d5f52',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverInitial: {
    color: '#fffaf3',
    fontSize: 28,
    fontWeight: '700',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#251f1a',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  author: {
    color: '#665a50',
    fontSize: 14,
    marginTop: 4,
  },
  status: {
    alignSelf: 'flex-start',
    color: '#3d5b47',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#dce8d8',
    overflow: 'hidden',
  },
});
