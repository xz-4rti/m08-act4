// // Importamos el modelo de datos
// const Library = require('../models/LibraryMongo');

// // Declaración de controladores 
// const getBooks = (async (req, res) => {
//     try {
//         // Instanciamos un modelo Library
//         let library = new Library({});
//         // Lo usamos para listar libros
//         let books = await library.listAll();
//         res.json(books);
//         library.close();
//     } catch {
//         res.json("Error getting books...");
//     }
// });

// const createBook = (async (req, res) => {
//     try {
//         // Instanciamos un modelo Library
//         let library = new Library({});
//         await library.connect();

//         // Creamos un libro nuevo
//         const newBook = {
//             title: req.body.title,
//             author: req.body.author,
//             year: req.body.year
//         };

//         const id = await library.getnextID();
//         newBook.id = id;
//         // Usamos el modelo Library para crear libro
//         let created = await library.create(newBook);

//         if (created) {
//             console.log("Product created successfully");
//             res.json("Product created successfully");
//         } else {
//             console.log("Error creating new book...");
//             res.json("Error creating new book...");
//         }
//         library.close();
//     } catch {
//         console.log("Error creating new book...");
//         res.json("Error creating new book...");
//     }
// });

// const updateBook = (async (req, res) => {
//     try {
//         // Instanciamos un modelo Library
//         let library = new Library({});
        
//         // Obtenemos el ID del libro a actualizar
//         let bookID = String(req.body._id)
        
//         // Datos del libro actualizado
//         const updatedBook = {
//             title: req.body.title,
//             author: req.body.author,
//             year: req.body.year
//         };

//         // Usamos el modelo Library para actualizar el libro
//         let updated = await library.update(bookID, updatedBook);

//         if (updated) {
//             console.log("Book updated successfully");
//             res.json("Book updated successfully");
//         } else {
//             console.log("Error updating book...");
//             res.json("Error updating book...");
//         }
//         library.close();
//     } catch {
//         console.log("Error updating book...");
//         res.json("Error updating book...");
//     }
// });

// const deleteBook = (async (req, res) => {
//     try {
//         // Instanciamos un modelo Library
//         let library = new Library({});
        
//         // Obtenemos el ID del libro a eliminar
//         let bookID = String(req.body._id)
        
//         // Usamos el modelo Library para eliminar el libro
//         let deleted = await library.delete(bookID);

//         if (deleted) {
//             console.log("Book deleted successfully");
//             res.json("Book deleted successfully");
//         } else {
//             console.log("Error deleting book...");
//             res.json("Error deleting book...");
//         }
//         library.close();
//     } catch {
//         console.log("Error deleting book...");
//         res.json("Error deleting book...");
//     }
// });

// module.exports = {
//     getBooks: getBooks,
//     createBook: createBook,
//     updateBook: updateBook,
//     deleteBook: deleteBook
// };
