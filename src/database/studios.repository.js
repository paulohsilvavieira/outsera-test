import connection from "./connection.js"



export async function saveStudio(name) {
  const db = await connection.connection()
  const insert = await db.prepare(`INSERT OR IGNORE INTO studios (name) values (?)`)
  await insert.run(name)
  const studio = await db.all('SELECT id FROM studios WHERE name=?', name);
  return studio[0].id

}



export async function getStudioById(id) {
  const db = await connection.connection()
  const studio = await db.all(`SELECT * FROM studios WHERE id=? LIMIT 1`, [id])
  return studio[0]

}


export async function getStudios() {
  const db = await connection.connection()
  return await db.all(`SELECT * FROM studios`)
}


export async function deleteStudio(id) {
  const db = await connection.connection()
  const deleteStudio = await db.prepare(`DELETE FROM studios WHERE id=?`)
  const deleteMovieStudio = await db.prepare(`DELETE FROM movies_studios WHERE studio_id=?`)

  await deleteStudio.run([id])
  await deleteMovieStudio.run([id])


}


export async function updateStudio(id, name) {
  const db = await connection.connection()
  const update = await db.prepare(`UPDATE studios SET name=? WHERE id=?`)
  await update.run([name, id])
}
