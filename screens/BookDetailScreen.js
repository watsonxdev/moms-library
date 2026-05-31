import {
  View,
  Text,
  Image
} from 'react-native';

export default function BookDetailScreen({
  route
}) {
  const { book } = route.params;

  return (
    <View
      style={{
        padding: 20
      }}
    >
      {book.coverUrl ? (
        <Image
          source={{
            uri: book.coverUrl
          }}
          style={{
            width: 150,
            height: 220
          }}
        />
      ) : null}

      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold'
        }}
      >
        {book.title}
      </Text>

      <Text>{book.author}</Text>

      <Text>{book.genre}</Text>

      <Text>{book.status}</Text>

      <Text>{book.notes}</Text>
    </View>
  );
}
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <Text style={styles.status}>{book.status}</Text>

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
    backgroundColor: '#f7f1e8',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1d6c8',
  },
  textButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textButtonLabel: {
    color: '#3d5b47',
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
    color: '#ffffff',
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
    backgroundColor: '#6d5f52',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverInitial: {
    color: '#fffaf3',
    fontSize: 58,
    fontWeight: '800',
  },
  title: {
    color: '#251f1a',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    marginTop: 22,
    textAlign: 'center',
  },
  author: {
    color: '#665a50',
    fontSize: 18,
    marginTop: 8,
    textAlign: 'center',
  },
  status: {
    color: '#3d5b47',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#dce8d8',
    overflow: 'hidden',
  },
  section: {
    alignSelf: 'stretch',
    marginTop: 28,
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ded6cc',
  },
  sectionTitle: {
    color: '#251f1a',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  notes: {
    color: '#51473f',
    fontSize: 16,
    lineHeight: 24,
  },
});
