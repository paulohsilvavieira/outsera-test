
import connection from "./connection.js"
export async function createTables() {
  const db = await connection.connection()

  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      year INTEGER NOT NULL,
      winner BOOLEAN NOT NULL,
      UNIQUE(title)
    );
  `)

  await db.exec(`
    CREATE TABLE  IF NOT EXISTS producers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `)

  await db.exec(`
    CREATE TABLE  IF NOT EXISTS studios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies_producers (
      movie_id INTEGER,
      producer_id INTEGER,
      PRIMARY KEY (movie_id, producer_id),
      FOREIGN KEY (movie_id) REFERENCES movies (id),
      FOREIGN KEY (producer_id) REFERENCES producers (id)
    );
  `)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies_studios (
      movie_id INTEGER,
      studio_id INTEGER,
      PRIMARY KEY (movie_id, studio_id),
      FOREIGN KEY (movie_id) REFERENCES movies (id),
      FOREIGN KEY (studio_id) REFERENCES studios (id)
    );
  `)

}