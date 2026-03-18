const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./game.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      score INTEGER DEFAULT 0
    )
  `);
});

module.exports = db;
