import connection from "./connection.js"


export async function saveProducer(name) {
  const db = await connection.connection()
  const insert = await db.prepare(`INSERT OR IGNORE INTO producers (name) values (?)`)
  await insert.run(name)
  const producer = await db.all('SELECT id FROM producers WHERE name=? LIMIT 1', name);
  return producer[0].id

}

export async function saveMovieProducer(movie_id, producer_id) {
  const db = await connection.connection()
  const insert = await db.prepare(`INSERT OR IGNORE INTO movies_producers (movie_id, producer_id) values (?, ?);`)
  await insert.run(movie_id, producer_id)

}

export async function getProducerById(id) {
  const db = await connection.connection()
  const producer = await db.all(`SELECT * FROM producers WHERE id=? LIMIT 1`, [id])
  return producer[0]
}


export async function getproducers() {
  const db = await connection.connection()
  return await db.all(`SELECT * FROM producers`)
}


export async function deleteProducer(id) {
  const db = await connection.connection()
  const deleteProducer = await db.prepare(`DELETE FROM producers WHERE id=?`)
  const deleteMovieProducer = await db.prepare(`DELETE FROM movies_producers WHERE producer_id=?`)

  await deleteProducer.run(id)
}


export async function updateProducer(id, name) {
  const db = await connection.connection()
  const update = await db.prepare(`UPDATE producers SET name=? WHERE id=?`)
  await update.run([name, id])
}


export async function getIntervalAward() {
  const db = await connection.connection()
  return await db.all(`SELECT *
                FROM (
                  SELECT
                    p.name AS producer,
                    m.year - LAG(m.year) OVER (
                      PARTITION BY p.id
                      ORDER BY m.year
                    ) AS interval,
                    LAG(m.year) OVER (
                      PARTITION BY p.id
                      ORDER BY m.year
                    ) AS previousWin,
                    m.year AS followingWin
                   
                  FROM
                    producers p
                    JOIN movies_producers pm ON pm.producer_id = p.id
                    JOIN movies m ON pm.movie_id = m.id
                  WHERE
                    m.winner = TRUE
                ) AS win_intervals
                WHERE interval IS NOT NULL
                ORDER BY interval, producer`)
}