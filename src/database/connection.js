import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export class SqliteConnection {
  static instance = null


  constructor() {
    if (!SqliteConnection.instance) {
      this.db = open({
        filename: ':memory:',
        driver: sqlite3.Database
      })
      SqliteConnection.instance = this;
    }

    return SqliteConnection.instance;
  }
  connection() {
    return this.db
  }
}

const connection = new SqliteConnection();
Object.freeze(connection);

export default connection;

