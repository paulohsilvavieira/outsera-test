import { getConnection } from "./connection.js";


export async function saveMovie(title, year, winner) {
  const db = await getConnection()
  const insert = await db.prepare(`INSERT OR IGNORE INTO movies (title, year, winner) values (?,?,?);`)
  await insert.run(title, year, winner)
  await insert.finalize()

  const movie = await db.get('SELECT id FROM movies WHERE title=?;', [title]);

  return movie.id

}

export async function saveMovieStudio(movie_id, studio_id) {
  const db = await getConnection()

  const exists = await db.get('SELECT * FROM movies_studios WHERE movie_id=? AND studio_id=?;', [movie_id, studio_id]);
  if (exists) return
  const insert = await db.prepare(`INSERT OR IGNORE INTO movies_studios (movie_id, studio_id) values (?, ?);`)
  await insert.run(movie_id, studio_id)
  await insert.finalize()


}
export async function saveMovieProducer(movie_id, producer_id) {
  const db = await getConnection()

  const exists = await db.get('SELECT * FROM movies_producers WHERE movie_id=? AND producer_id=?;', [movie_id, producer_id]);
  if (exists) return
  const insert = await db.prepare(`INSERT OR IGNORE INTO movies_producers (movie_id, producer_id) values (?, ?);`)
  await insert.run(movie_id, producer_id)
  await insert.finalize()
}

export async function getMovieById(id) {
  const db = await getConnection()
  const result = await db.get(`
    SELECT
    m.id AS movie_id,
      m.title AS title, 
      (
          SELECT GROUP_CONCAT( p.name, ',')
          FROM producers p
          JOIN movies_producers mp ON p.id = mp.producer_id
          WHERE mp.movie_id = m.id
           ORDER BY p.name
      ) AS producers,
      (
          SELECT GROUP_CONCAT(s.name, ',')
          FROM studios s
          JOIN movies_studios ms ON s.id = ms.studio_id
          WHERE ms.movie_id = m.id
          ORDER BY s.name
      ) AS studios,
      m.year, as year,
      m.winner as winner
    FROM
        movies AS m
    WHERE
      m.id=?
    GROUP BY
      m.id;`, [id])

  return result
}


export async function getMovies() {
  const db = await getConnection()
  return await db.all(`SELECT
    m.id as movie_id,
    m.title AS title, 
    (
        SELECT GROUP_CONCAT(p.name)
        FROM producers p
        JOIN movies_producers mp ON p.id = mp.producer_id
        WHERE mp.movie_id = m.id
    ) AS producers,
    (
        SELECT GROUP_CONCAT(s.name)
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
  const db = await getConnection()
  const deleteMovieStudio = await db.prepare(`DELETE FROM movies_studios WHERE movie_id=?;`)
  const deleteMovieProducers = await db.prepare(`DELETE FROM movies_producers WHERE movie_id=?;`)
  const deleteMovie = await db.prepare(`DELETE FROM movies WHERE id=?;`)

  await deleteMovieProducers.run([id])
  await deleteMovieProducers.finalize()

  await deleteMovieStudio.run([id])
  await deleteMovieStudio.finalize()

  await deleteMovie.run([id])
  await deleteMovie.finalize();



}


export async function updateMovie(id, title, year, winner) {
  const db = await getConnection()
  const update = await db.prepare(`UPDATE movies SET title=?, year=?, winner=? WHERE id=?`)
  await update.run([title, year, winner, id])
  await update.finalize();
}
