import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('books.db');

export function initializeDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      genre TEXT,
      status TEXT,
      coverUrl TEXT,
      rating INTEGER,
      notes TEXT
    );
  `);
}

export function getBooks() {
  return db.getAllSync(
    'SELECT * FROM books ORDER BY title ASC'
  );
}

export function addBook(book) {
  db.runSync(
    `
      INSERT INTO books
      (
        title,
        author,
        genre,
        status,
        coverUrl,
        rating,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      book.title,
      book.author,
      book.genre,
      book.status,
      book.coverUrl,
      book.rating,
      book.notes
    ]
  );
}
import * as SQLite from 'expo-sqlite';

let dbPromise;

function getDatabase() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('moms-library.db');
  }

  return dbPromise;
}

export async function initDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      coverUri TEXT,
      status TEXT NOT NULL DEFAULT 'Want to read',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function getBooks() {
  const db = await getDatabase();

  return db.getAllAsync(`
    SELECT id, title, author, notes, coverUri, status, createdAt
    FROM books
    ORDER BY datetime(createdAt) DESC, id DESC;
  `);
}

export async function addBook(book) {
  const db = await getDatabase();

  const result = await db.runAsync(
    `
      INSERT INTO books (title, author, notes, coverUri, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
    book.title.trim(),
    book.author.trim(),
    book.notes.trim(),
    book.coverUri || null,
    book.status,
    new Date().toISOString()
  );

  return result.lastInsertRowId;
}

export async function deleteBook(id) {
  const db = await getDatabase();

  await db.runAsync('DELETE FROM books WHERE id = ?;', id);
}
