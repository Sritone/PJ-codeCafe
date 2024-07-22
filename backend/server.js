const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// 모든 카페 목록 가져오기
app.get('/cafes', (req, res) => {
  db.all("SELECT * FROM cafes", (err, rows) => {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    }
    res.json({cafes: rows});
  });
});

// 새 카페 추가
app.post('/cafes', (req, res) => {
  const { name, lat, lng, description } = req.body;
  const stmt = db.prepare("INSERT INTO cafes (name, lat, lng, description) VALUES (?, ?, ?, ?)");
  stmt.run(name, lat, lng, description, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
  stmt.finalize();
});

// 카페 삭제
app.delete('/cafes/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM cafes WHERE id = ?");
  stmt.run(id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
  stmt.finalize();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
