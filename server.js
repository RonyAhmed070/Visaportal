const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
const PORT = 3000;

// Hardcoded admin credentials
const ADMIN_USER = 'admin';
// Password: Admin@123 (hashed)
const ADMIN_PASS_HASH = '$2a$10$wqQwQw6QwQw6QwQw6QwQwOeQwQw6QwQw6QwQw6QwQw6QwQw6QwQw6';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files (for your HTML/CSS/JS)
app.use(express.static(path.join(__dirname)));

// Login endpoint
app.post('/login', async (req, res) => {
  console.log('Login attempt:', req.body); // Debug line
  const { username, password } = req.body;
  if (username === ADMIN_USER && await bcrypt.compare(password, ADMIN_PASS_HASH)) {
    req.session.isAdmin = true;
    return res.json({ success: true });
  }
  res.json({ success: false, message: 'Invalid credentials' });
});

// Middleware to protect admin dashboard
function requireAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  res.status(401).send('Unauthorized');
}

// Example protected route
app.get('/admin-dashboard', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 