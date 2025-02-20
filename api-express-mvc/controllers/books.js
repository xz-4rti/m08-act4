const Library = require('../models/Library');

const getBooks = async (req, res) => {
    try {
        let library = new Library();
        let books = await library.listAll();
        res.json(books);
        library.close();
    } catch (error) {
        res.status(500).json("Error getting books...");
    }
};

const createBook = async (req, res) => {
    try {
        let library = new Library();

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            year: req.body.year
        };

        // const id = await library.getnextID();
        // newBook.id = id;

        let created = await library.create(newBook);

        if (created) {
            console.log("Book created successfully");
            res.json("Book created successfully");
        } else {
            console.log("Error creating new book...");
            res.status(500).json("Error creating new book...");
        }
        library.close();
    } catch (error) {
        console.log("Error creating new book...", error);
        res.status(500).json("Error creating new book...");
    }
};

const updateBook = async (req, res) => {
    try {
        let library = new Library();

        let bookID = req.params.id; // Use req.body.id instead of req.body._id

        const updatedBook = {
            title: req.body.title,
            author: req.body.author,
            year: req.body.year
        };

        let updated = await library.update(bookID, updatedBook);

        if (updated) {
            console.log("Book updated successfully");
            res.json("Book updated successfully");
        } else {
            console.log("Error updating book...");
            res.status(500).json("Error updating book...");
        }
        library.close();
    } catch (error) {
        console.log("Error updating book...", error);
        res.status(500).json("Error updating book...");
    }
};

const deleteBook = async (req, res) => {
    try {
        let library = new Library();

        let bookID = req.body.id; // Use req.body.id instead of req.body._id

        let deleted = await library.delete(bookID);

        if (deleted) {
            console.log("Book deleted successfully");
            res.json("Book deleted successfully");
        } else {
            console.log("Error deleting book...");
            res.status(500).json("Error deleting book...");
        }
        library.close();
    } catch (error) {
        console.log("Error deleting book...", error);
        res.status(500).json("Error deleting book...");
    }
};

module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook
};