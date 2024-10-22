import connection from "./connection.js"


export async function saveMovie(title, year, winner) {
  const db = await connection.connection()
  const insert = await db.prepare(`INSERT OR IGNORE INTO movies (title, year, winner) values (?,?,?)`)
  await insert.run(title, year, winner)
  const movie = await db.all('SELECT id FROM movies WHERE title=?', title);
  return movie[0].id

}

export async function saveMovieStudio(movie_id, studio_id) {
  const db = await connection.connection()
  const exists = await db.all('SELECT * FROM movies_studios WHERE movie_id=? AND studio_id=?;', [movie_id, studio_id]);
  if (exists.length > 0) return
  const insert = await db.prepare(`INSERT INTO movies_studios (movie_id, studio_id) values (?, ?);`)
  await insert.run(movie_id, studio_id)

}
export async function saveMovieProducer(movie_id, producer_id) {
  const db = await connection.connection()
  const exists = await db.all('SELECT * FROM movies_producers WHERE movie_id=? AND producer_id=?', movie_id, producer_id);
  if (exists.length > 0) return
  const insert = await db.prepare(`INSERT OR IGNORE INTO movies_producers (movie_id, producer_id) values (?, ?);`)
  await insert.run(movie_id, producer_id)
}

export async function getMovieById(id) {
  const db = await connection.connection()
  const result = await db.all(`
    SELECT
    m.id AS movie_id,
      m.title AS title, 
      (
          SELECT GROUP_CONCAT( p.name, ', ')
          FROM producers p
          JOIN movies_producers mp ON p.id = mp.producer_id
          WHERE mp.movie_id = m.id
           ORDER BY p.name
      ) AS producers,
      (
          SELECT GROUP_CONCAT( s.name, ', ')
          FROM studios s
          JOIN movies_studios ms ON s.id = ms.studio_id
          WHERE ms.movie_id = m.id
          ORDER BY s.name
      ) AS studios,
      m.year,
      CASE m.winner
          WHEN 0 THEN 'false'
          ELSE 'true'
      END AS winner
    FROM
        movies AS m
    WHERE
      m.id=?
    GROUP BY
      m.id;`, [id])

  return result[0]
}


export async function getMovies() {
  const db = await connection.connection()
  return await db.all(`SELECT
    m.id as movie_id,
    m.title AS title, 
    (
        SELECT GROUP_CONCAT( p.name, ', ')
        FROM producers p
        JOIN movies_producers mp ON p.id = mp.producer_id
        WHERE mp.movie_id = m.id
    ) AS producers,
    (
        SELECT GROUP_CONCAT( s.name, ', ')
        FROM studios s
        JOIN movies_studios ms ON s.id = ms.studio_id
        WHERE ms.movie_id = m.id
    ) AS studios,
    m.year,
    CASE m.winner
        WHEN 0 THEN 'false'
        ELSE 'true'
    END AS winner
FROM
    movies AS m
GROUP BY
    m.id;`)
}


export async function deleteMovie(id) {
  const db = await connection.connection()
  const deleteMovieStudio = await db.prepare(`DELETE FROM movies_studios WHERE movie_id=?;`)
  const deleteMovieProducers = await db.prepare(`DELETE FROM movies_producers WHERE movie_id=?;`)
  const deleteMovie = await db.prepare(`DELETE FROM movies WHERE id=?;`)

  await deleteMovieProducers.run([id])
  await deleteMovieStudio.run([id])
  await deleteMovie.run([id])


}


export async function updateMovie(id, title, year, winner) {
  const db = await connection.connection()
  const update = await db.prepare(`UPDATE movies SET title=?, year=?, winner=? WHERE id=?`)
  await update.run([title, year, winner, id])
}
