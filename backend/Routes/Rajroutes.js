const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Notes routes (protected)
router.post('/notes', authenticateToken, notesController.createNote);
router.get('/notes', authenticateToken, notesController.getNotes);
router.get('/note/:id', authenticateToken, notesController.getNoteById);
router.put('/note/:id', authenticateToken, notesController.updateNote);
router.delete('/note/:id', authenticateToken, notesController.deleteNote);

module.exports = router;
