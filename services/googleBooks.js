export async function searchBooks(query) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}`
  );

  const data = await response.json();

  return data.items || [];
}
const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(query) {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return [];
  }

  const response = await fetch(
    `${GOOGLE_BOOKS_URL}?q=${encodeURIComponent(searchTerm)}&maxResults=10`
  );

  if (!response.ok) {
    throw new Error('Could not search books right now.');
  }

  const data = await response.json();

  return (data.items || []).map((item) => {
    const info = item.volumeInfo || {};

    return {
      id: item.id,
      title: info.title || 'Untitled book',
      author: (info.authors || []).join(', '),
      coverUri: info.imageLinks?.thumbnail?.replace('http://', 'https://') || null,
      notes: info.description || '',
    };
  });
}
