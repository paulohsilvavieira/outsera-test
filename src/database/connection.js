import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createTables } from './create-tables.js';
let connection;
async function startConnection() {
  connection = await open({
    filename: ':memory:', // Banco em memória
    driver: sqlite3.Database,
  });
  await createTables()
  return connection;
}

export async function getConnection() {
  if (!connection) {
    await startConnection()
  }

  return connection;
}


// export class SqliteConnection {
//   static instance = null


//   constructor() {
//     if (!SqliteConnection.instance) {
//       this.db = open({
//         filename: ':memory:',
//         driver: sqlite3.Database
//       })
//       SqliteConnection.instance = this;
//     }

//     return SqliteConnection.instance;
//   }
//   connection() {
//     return this.db
//   }
// }

// const connection = new SqliteConnection();
// Object.freeze(connection);

// export default connection;

