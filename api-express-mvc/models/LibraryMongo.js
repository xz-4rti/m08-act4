// const { MongoClient, ObjectId } = require("mongodb");
// const dbConfig = require("../config/mongodb.config.js");

// class Library {
//   constructor() {
//     this.client = new MongoClient(dbConfig.URL, { useNewUrlParser: true, useUnifiedTopology: true });
//     this.database = "books";
//     this.collection = "books";
//   }

//   connect = async () => {
//     try {
//       await this.client.connect();
//       this.database = this.client.db(dbConfig.DB);
//       this.collection = this.database.collection("books");
//       console.log("Successfully connected to MongoDB.");
//     } catch (error) {
//       console.error("MongoDB connection error:", error);
//       throw error;
//     }
//   };

//   close = async () => {
//     await this.client.close();
//   };

//   listAll = async () => {
//     await this.connect();
//     const books = await this.collection.find({}).toArray();
//     console.log("Fetched books:", books);
//     await this.close();
//     return books;
//   };

//   async getnextID() {
//     await this.connect();
//     const lastBook = await this.collection.find().sort({ _id: -1 }).limit(1).next();
//     return lastBook ? lastBook.id + 1 : 1;
//   }

//   create = async (newBook) => {
//     try {
//       await this.connect();
//       const result = await this.collection.insertOne(newBook);
//       await this.close();
//       return result.insertedId;
//     } catch (error) {
//       console.error("Error creating new book:", error);
//     } finally {
//       await this.close();
//     }
//   }

//   update = async (bookID, updatedBook) => {
//     await this.connect();
//     let query = {};
//     if (isNaN(bookID)) {
//       query = { _id: new ObjectId(String(bookID)) };
//     } else {
//       query = { _id: parseInt(bookID) };
//     }
//     const result = await this.collection.updateOne(
//       query,
//       { $set: updatedBook }
//     );
//     await this.close();
//     return result.modifiedCount;
//   }

//   delete = async (bookID) => {
//     try {
//       await this.connect();
//       let query = {};
//       if (isNaN(bookID)) {
//         query = { _id: new ObjectId(String(bookID)) };
//       } else {
//         query = { _id: parseInt(bookID) };
//       }
//       const result = await this.collection.deleteOne(query);
//       await this.close();
//       return result.deletedCount;
//     } catch (error) {
//       return error;
//     }
//   }
// }

// module.exports = Library;
