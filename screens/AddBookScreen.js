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
const shelfSuggestions = ['Favorites', 'Book Club', 'Cozy Reads', 'To Gift'];

function StarPicker({ rating, onChange }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange(star)} hitSlop={8}>
          <Text style={[styles.star, star <= rating && styles.starSelected]}>
            {star <= rating ? '★' : '☆'}
          </Text>
        </Pressable>
      ))}
      {rating > 0 && (
        <Pressable onPress={() => onChange(0)}>
          <Text style={styles.clearRating}>Clear</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function AddBookScreen({ onCancel, onSaved }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [notes, setNotes] = useState('');
  const [coverUri, setCoverUri] = useState(null);
  const [status, setStatus] = useState(statuses[0]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [shelf, setShelf] = useState('Favorites');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      Alert.alert('Search needed', 'Enter a title, author, or ISBN to search Google Books.');
      return;
    }

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
      await addBook({ title, author, notes, coverUri, status, rating, shelf });
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
          <Text style={styles.sectionTitle}>Google Books Autofill</Text>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search title, author, or ISBN"
              placeholderTextColor="#9b8068"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <Pressable style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]} onPress={handleSearch}>
              {isSearching ? <ActivityIndicator color="#fff7ea" /> : <Text style={styles.searchButtonText}>Search</Text>}
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
                    <Text style={styles.autofillHint}>Tap to autofill</Text>
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
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Book title" placeholderTextColor="#9b8068" />

          <Text style={styles.label}>Author</Text>
          <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Author" placeholderTextColor="#9b8068" />

          <Text style={styles.label}>Status</Text>
          <Pressable style={styles.dropdownButton} onPress={() => setIsStatusOpen((open) => !open)}>
            <Text style={styles.dropdownText}>{status}</Text>
            <Text style={styles.dropdownIcon}>{isStatusOpen ? '▲' : '▼'}</Text>
          </Pressable>
          {isStatusOpen && (
            <View style={styles.dropdownMenu}>
              {statuses.map((option) => (
                <Pressable
                  key={option}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setStatus(option);
                    setIsStatusOpen(false);
                  }}
                >
                  <Text style={[styles.dropdownOptionText, status === option && styles.dropdownOptionSelected]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <Text style={styles.label}>Rating</Text>
          <StarPicker rating={rating} onChange={setRating} />

          <Text style={styles.label}>Shelf</Text>
          <View style={styles.shelfSuggestions}>
            {shelfSuggestions.map((option) => (
              <Pressable
                key={option}
                style={[styles.shelfChip, shelf === option && styles.shelfChipSelected]}
                onPress={() => setShelf(option)}
              >
                <Text style={[styles.shelfChipText, shelf === option && styles.shelfChipTextSelected]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput style={styles.input} value={shelf} onChangeText={setShelf} placeholder="Custom shelf name" placeholderTextColor="#9b8068" />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes, favorite quote, who recommended it..."
            placeholderTextColor="#9b8068"
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
    backgroundColor: '#f5ead9',
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
    borderBottomColor: '#d9bd93',
    backgroundColor: '#efe0c8',
  },
  toolbarTitle: {
    color: '#2f2118',
    fontSize: 18,
    fontWeight: '800',
  },
  textButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textButtonLabel: {
    color: '#754b2d',
    fontSize: 16,
    fontWeight: '800',
  },
  saveButton: {
    minWidth: 72,
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#754b2d',
  },
  saveButtonLabel: {
    color: '#fff7ea',
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
  sectionTitle: {
    color: '#2f2118',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
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
    borderColor: '#c9a77a',
    backgroundColor: '#fffaf3',
    color: '#2f2118',
    fontSize: 16,
  },
  searchButton: {
    width: 92,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#754b2d',
  },
  searchButtonText: {
    color: '#fff7ea',
    fontSize: 15,
    fontWeight: '800',
  },
  results: {
    marginBottom: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d7b98b',
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#fffaf3',
    borderBottomWidth: 1,
    borderBottomColor: '#ead7b9',
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
    color: '#2f2118',
    fontSize: 15,
    fontWeight: '800',
  },
  resultAuthor: {
    color: '#746050',
    fontSize: 13,
    marginTop: 4,
  },
  autofillHint: {
    color: '#8a5d38',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 5,
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
    borderColor: '#a97d53',
    backgroundColor: '#efe0c8',
  },
  coverPreview: {
    width: 122,
    height: 176,
    borderRadius: 8,
  },
  coverPickerText: {
    color: '#754b2d',
    fontSize: 15,
    fontWeight: '800',
  },
  label: {
    color: '#4b3527',
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
    borderColor: '#c9a77a',
    backgroundColor: '#fffaf3',
    color: '#2f2118',
    fontSize: 16,
  },
  notesInput: {
    minHeight: 118,
  },
  dropdownButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c9a77a',
    backgroundColor: '#fffaf3',
  },
  dropdownText: {
    color: '#2f2118',
    fontSize: 16,
    fontWeight: '700',
  },
  dropdownIcon: {
    color: '#754b2d',
    fontSize: 12,
    fontWeight: '800',
  },
  dropdownMenu: {
    marginTop: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c9a77a',
    backgroundColor: '#fffaf3',
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ead7b9',
  },
  dropdownOptionText: {
    color: '#4b3527',
    fontSize: 15,
    fontWeight: '700',
  },
  dropdownOptionSelected: {
    color: '#754b2d',
  },
  starRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  star: {
    color: '#bba083',
    fontSize: 29,
  },
  starSelected: {
    color: '#c38324',
  },
  clearRating: {
    color: '#754b2d',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 4,
  },
  shelfSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  shelfChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#fffaf3',
    borderWidth: 1,
    borderColor: '#c9a77a',
  },
  shelfChipSelected: {
    backgroundColor: '#754b2d',
    borderColor: '#754b2d',
  },
  shelfChipText: {
    color: '#754b2d',
    fontWeight: '800',
  },
  shelfChipTextSelected: {
    color: '#fff7ea',
  },
});
