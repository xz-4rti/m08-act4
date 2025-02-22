const express = require('express');
const books = require('../controllers/books.js');
const booksMongo = require('../controllers/books.js');

// Instancia del servidor
const router = express.Router();

// Configuracion de las rutas
router.get('/api/books', books.getBooks);
router.post('/api/books', books.createBook);
router.put('/api/books', books.updateBook);
router.delete('/api/books', books.deleteBook);

module.exports = router;


