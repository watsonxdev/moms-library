import { useState } from 'react';

import {
  View,
  TextInput,
  Button
} from 'react-native';

import { addBook } from '../database/database';

export default function AddBookScreen({
  navigation
}) {
  const [title, setTitle] =
    useState('');

  const [author, setAuthor] =
    useState('');

  const saveBook = () => {
    addBook({
      title,
      author,
      genre: '',
      status: 'Want To Read',
      coverUrl: '',
      rating: 0,
      notes: ''
    });

    navigation.goBack();
  };

  return (
    <View
      style={{
        padding: 16
      }}
    >
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10
        }}
      />

      <Button
        title="Save"
        onPress={saveBook}
      />
    </View>
  );
}
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { addBook } from '../database/database';
import { searchBooks } from '../services/googleBooks';

const statuses = ['Want to read', 'Reading', 'Finished'];

export default function AddBookScreen({ onCancel, onSaved }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [notes, setNotes] = useState('');
  const [coverUri, setCoverUri] = useState(null);
  const [status, setStatus] = useState(statuses[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);

    try {
      setResults(await searchBooks(searchTerm));
    } catch (error) {
      Alert.alert('Search failed', error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const pickCover = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to choose a cover image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
    }
  };

  const chooseResult = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setNotes(book.notes);
    setCoverUri(book.coverUri);
    setResults([]);
    setSearchTerm('');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Add a title before saving this book.');
      return;
    }

    setIsSaving(true);

    try {
      await addBook({ title, author, notes, coverUri, status });
      await onSaved();
    } catch (error) {
      Alert.alert('Save failed', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.toolbar}>
          <Pressable style={({ pressed }) => [styles.textButton, pressed && styles.pressed]} onPress={onCancel}>
            <Text style={styles.textButtonLabel}>Cancel</Text>
          </Pressable>
          <Text style={styles.toolbarTitle}>Add Book</Text>
          <Pressable
            style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonLabel}>{isSaving ? 'Saving' : 'Save'}</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search Google Books"
              placeholderTextColor="#8d8177"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <Pressable style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]} onPress={handleSearch}>
              {isSearching ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.searchButtonText}>Search</Text>}
            </Pressable>
          </View>

          {results.length > 0 && (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.results}
              renderItem={({ item }) => (
                <Pressable style={({ pressed }) => [styles.resultRow, pressed && styles.pressed]} onPress={() => chooseResult(item)}>
                  {item.coverUri ? <Image source={{ uri: item.coverUri }} style={styles.resultCover} /> : <View style={styles.resultCover} />}
                  <View style={styles.resultText}>
                    <Text style={styles.resultTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.resultAuthor} numberOfLines={1}>{item.author || 'Unknown author'}</Text>
                  </View>
                </Pressable>
              )}
            />
          )}

          <Pressable style={({ pressed }) => [styles.coverPicker, pressed && styles.pressed]} onPress={pickCover}>
            {coverUri ? (
              <Image source={{ uri: coverUri }} style={styles.coverPreview} />
            ) : (
              <Text style={styles.coverPickerText}>Choose Cover</Text>
            )}
          </Pressable>

          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Book title" placeholderTextColor="#8d8177" />

          <Text style={styles.label}>Author</Text>
          <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Author" placeholderTextColor="#8d8177" />

          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            {statuses.map((option) => (
              <Pressable
                key={option}
                style={[styles.statusButton, status === option && styles.statusButtonActive]}
                onPress={() => setStatus(option)}
              >
                <Text style={[styles.statusButtonText, status === option && styles.statusButtonTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes, favorite quote, who recommended it..."
            placeholderTextColor="#8d8177"
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f1e8',
  },
  keyboardView: {
    flex: 1,
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
  toolbarTitle: {
    color: '#251f1a',
    fontSize: 18,
    fontWeight: '800',
  },
  textButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textButtonLabel: {
    color: '#3d5b47',
    fontSize: 16,
    fontWeight: '800',
  },
  saveButton: {
    minWidth: 72,
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#3d5b47',
  },
  saveButtonLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.72,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  searchBox: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6cabc',
    backgroundColor: '#ffffff',
    color: '#251f1a',
    fontSize: 16,
  },
  searchButton: {
    width: 92,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#6d5f52',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  results: {
    marginBottom: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ded6cc',
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee5da',
  },
  resultCover: {
    width: 42,
    height: 62,
    borderRadius: 4,
    backgroundColor: '#d8cec0',
  },
  resultText: {
    flex: 1,
    justifyContent: 'center',
  },
  resultTitle: {
    color: '#251f1a',
    fontSize: 15,
    fontWeight: '800',
  },
  resultAuthor: {
    color: '#665a50',
    fontSize: 13,
    marginTop: 4,
  },
  coverPicker: {
    alignSelf: 'center',
    width: 122,
    height: 176,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9e8d7c',
    backgroundColor: '#efe4d6',
  },
  coverPreview: {
    width: 122,
    height: 176,
    borderRadius: 8,
  },
  coverPickerText: {
    color: '#6d5f52',
    fontSize: 15,
    fontWeight: '800',
  },
  label: {
    color: '#51473f',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 7,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6cabc',
    backgroundColor: '#ffffff',
    color: '#251f1a',
    fontSize: 16,
  },
  notesInput: {
    minHeight: 118,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d6cabc',
  },
  statusButtonActive: {
    backgroundColor: '#3d5b47',
    borderColor: '#3d5b47',
  },
  statusButtonText: {
    color: '#51473f',
    fontWeight: '800',
  },
  statusButtonTextActive: {
    color: '#ffffff',
  },
});
