const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE cafes (id INTEGER PRIMARY KEY, name TEXT, lat REAL, lng REAL, description TEXT)");

  const stmt = db.prepare("INSERT INTO cafes (name, lat, lng, description) VALUES (?, ?, ?, ?)");
  stmt.run("카페1", 36.6448, 127.4880, "와이파이 좋고 조용한 카페");
  stmt.run("카페2", 36.6430, 127.4890, "전원 콘센트가 많은 카페");
  stmt.finalize();
});

module.exports = db;
