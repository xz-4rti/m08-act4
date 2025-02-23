const mysql = require("mysql2/promise");
const dbConfig = require("../config/mysql.config"); // Import the MySQL configuration

class Library {
    constructor() {
        if (!Library.instance) {
            this.pool = mysql.createPool({
                host: dbConfig.HOST,
                user: dbConfig.USER,
                password: dbConfig.PASSWORD,
                database: dbConfig.DB,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });

            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error("❌ Error connecting to the database:", err);
                } else {
                    console.log("✅ Successfully connected to the database.");
                    connection.release();
                }
            });
            
            Library.instance = this; // Store instance to reuse it
        }

        return Library.instance; // Always return the same instance
    }

    async close() {
        await this.pool.end();
        console.log("✅ Database connection pool closed.");
    }

    async listAll() {
        try {
            const [results] = await this.pool.query("SELECT * FROM books");
            return results;
        } catch (error) {
            console.error("❌ Error in listAll():", error);
            throw error;
        }
    }

    async create(newBook) {
        try {
            const [result] = await this.pool.query(
                "INSERT INTO books SET ?",
                newBook
            );
            return result.insertId; // Return the newly generated ID
        } catch (error) {
            console.error("❌ Error in create():", error);
            throw error;
        }
    }

    async update(id, updateBook) {
        try {
            const { title, author, year } = updateBook;
            const [result] = await this.pool.query(
                "UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?",
                [title, author, year, id]
            );
            return result.affectedRows;
        } catch (error) {
            console.error("❌ Error in update():", error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const [result] = await this.pool.query("DELETE FROM books WHERE id = ?", [
                id,
            ]);
            return result.affectedRows;
        } catch (error) {
            console.error("❌ Error in delete():", error);
            throw error;
        }
    }
}

// ✅ Export a SINGLE instance
module.exports = new Library();
