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
      rating INTEGER NOT NULL DEFAULT 0,
      shelf TEXT NOT NULL DEFAULT 'Favorites',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await ensureColumn(db, 'rating', 'INTEGER NOT NULL DEFAULT 0');
  await ensureColumn(db, 'shelf', "TEXT NOT NULL DEFAULT 'Favorites'");
}

async function ensureColumn(db, columnName, definition) {
  const columns = await db.getAllAsync('PRAGMA table_info(books);');
  const exists = columns.some((column) => column.name === columnName);

  if (!exists) {
    await db.execAsync(`ALTER TABLE books ADD COLUMN ${columnName} ${definition};`);
  }
}

export async function getBooks() {
  const db = await getDatabase();

  return db.getAllAsync(`
    SELECT id, title, author, notes, coverUri, status, rating, shelf, createdAt
    FROM books
    ORDER BY datetime(createdAt) DESC, id DESC;
  `);
}

export async function addBook(book) {
  const db = await getDatabase();

  const result = await db.runAsync(
    `
      INSERT INTO books (title, author, notes, coverUri, status, rating, shelf, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `,
    book.title.trim(),
    book.author.trim(),
    book.notes.trim(),
    book.coverUri || null,
    book.status,
    book.rating || 0,
    book.shelf.trim() || 'Favorites',
    new Date().toISOString()
  );

  return result.lastInsertRowId;
}

export async function deleteBook(id) {
  const db = await getDatabase();

  await db.runAsync('DELETE FROM books WHERE id = ?;', id);
}
