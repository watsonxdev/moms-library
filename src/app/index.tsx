import { useCallback, useEffect, useState } from 'react';

import AddBookScreen from '../../screens/AddBookScreen';
import BookDetailScreen from '../../screens/BookDetailScreen';
import HomeScreen from '../../screens/HomeScreen';
import { deleteBook, getBooks, initDatabase } from '../../database/database';

export type Book = {
  id: number;
  title: string;
  author: string;
  notes: string;
  coverUri: string | null;
  status: string;
  rating: number;
  shelf: string;
  createdAt: string;
};

type Screen = 'home' | 'add' | 'detail';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    const nextBooks = await getBooks();
    setBooks(nextBooks);
  }, []);

  useEffect(() => {
    async function prepareLibrary() {
      try {
        await initDatabase();
        await loadBooks();
      } finally {
        setIsLoading(false);
      }
    }

    prepareLibrary();
  }, [loadBooks]);

  const handleSaved = async () => {
    await loadBooks();
    setScreen('home');
  };

  const handleDelete = async (book: Book) => {
    await deleteBook(book.id);
    await loadBooks();
    setSelectedBook(null);
    setScreen('home');
  };

  if (screen === 'add') {
    return <AddBookScreen onCancel={() => setScreen('home')} onSaved={handleSaved} />;
  }

  if (screen === 'detail' && selectedBook) {
    return (
      <BookDetailScreen
        book={selectedBook}
        onBack={() => setScreen('home')}
        onDelete={() => handleDelete(selectedBook)}
      />
    );
  }

  return (
    <HomeScreen
      books={books}
      isLoading={isLoading}
      onAddBook={() => setScreen('add')}
      onSelectBook={(book: Book) => {
        setSelectedBook(book);
        setScreen('detail');
      }}
    />
  );
}
