require('dotenv').config();
  connectionLimit: 10
});

// ---- USERS (simple login persistence) ----
app.post('/api/login', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  res.json({ name }); // demo login
});

// ---- CATEGORIES ----
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, r) => {
    if (err) return res.status(500).json(err);
    res.json({ id: r.insertId, name });
  });
});

// ---- EXPENSES ----
app.get('/api/expenses', (req, res) => {
  const sql = `SELECT e.id, e.title, e.amount, c.name as category
               FROM expenses e
               JOIN categories c ON e.category_id = c.id`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post('/api/expenses', (req, res) => {
  const { title, amount, category_id } = req.body;
  if (!title || !amount || !category_id) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  db.query(
    'INSERT INTO expenses (title, amount, category_id) VALUES (?,?,?)',
    [title, amount, category_id],
    (err, r) => {
      if (err) return res.status(500).json(err);
      res.json({ id: r.insertId });
    }
  );
});

app.delete('/api/expenses/:id', (req, res) => {
  db.query('DELETE FROM expenses WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Deleted' });
  });
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));
