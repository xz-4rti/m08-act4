const express = require('express');
const books = require('../controllers/books.js');
const { verifyToken, generateToken } = require('../mw/auth');
const bcrypt = require("bcryptjs");
const pool = require("../db/database");

const router = express.Router();

// Open to all users
router.get('/api/books', books.getBooks);

// Protected routes
router.post('/api/books', verifyToken, books.createBook);
router.put('/api/books', verifyToken, books.updateBook);
router.delete('/api/books', verifyToken, books.deleteBook);

// Login and registration routes
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
        if (users.length === 0) return res.status(401).json({ message: "Invalid Credentials" });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });

        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
});

module.exports = router;