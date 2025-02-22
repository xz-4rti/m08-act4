const Library = require("../models/Library"); // Import the singleton instance

const getBooks = async (req, res) => {
    try {
        let books = await Library.listAll();
        res.json(books);
    } catch (error) {
        console.error("❌ Error getting books:", error);
        res.status(500).json({ message: "Error getting books" });
    }
};

const createBook = async (req, res) => {
    try {
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
        };

        let newBookId = await Library.create(newBook);

        if (newBookId) {
            console.log("✅ Book created successfully with ID:", newBookId);
            res.json({ message: "Book created successfully", id: newBookId });
        } else {
            console.error("❌ Error creating new book...");
            res.status(500).json({ message: "Error creating new book" });
        }
    } catch (error) {
        console.error("❌ Error creating new book:", error);
        res.status(500).json({ message: "Error creating new book" });
    }
};

const updateBook = async (req, res) => {
    try {
        let bookID = req.body.id;
        const updatedBook = {
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
        };
        // Log to check the received data
        console.log("Updating book with ID:", bookID);
        console.log("Updated Book Data:", updatedBook);

        let updated = await Library.update(bookID, updatedBook);

        if (updated) {
            console.log("✅ Book updated successfully");
            res.json({ message: "Book updated successfully" });
        } else {
            console.error("❌ Error updating book...");
            res.status(500).json({ message: "Error updating book" });
        }
    } catch (error) {
        console.error("❌ Error updating book:", error);
        res.status(500).json({ message: "Error updating book" });
    }
};

const deleteBook = async (req, res) => {
    try {
        let bookID = req.body.id;

        let deleted = await Library.delete(bookID);

        if (deleted) {
            console.log("✅ Book deleted successfully");
            res.json({ message: "Book deleted successfully" });
        } else {
            console.error("❌ Error deleting book...");
            res.status(500).json({ message: "Error deleting book" });
        }
    } catch (error) {
        console.error("❌ Error deleting book:", error);
        res.status(500).json({ message: "Error deleting book" });
    }
};

module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook,
};
