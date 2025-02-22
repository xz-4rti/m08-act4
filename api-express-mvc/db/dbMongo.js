const { MongoClient } = require("mongodb");

async function run() {
    const uri = "mongodb://localhost:27017";  // MongoDB URI
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("books");  // Use or create the "books" database
        const collection = database.collection("books");  // Use or create the "books" collection
        const counterCollection = database.collection("counters");  // Create the "counters" collection

        // Function to get the next auto-increment ID
        const getNextSequenceValue = async () => {
            const result = await counterCollection.findOneAndUpdate(
                { _id: "bookid" },  // You can use "bookid" to identify the counter
                { $inc: { sequence_value: 1 } },  // Increment the value by 1
                { upsert: true, returnDocument: "after" }  // If no document, create one with initial value 1
            );
            return result.value.sequence_value;
        };

        // Insert data into the books collection with auto-incrementing ID
        const books = [
            { title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', year: 1605 },
            { title: 'Moby Dick', author: 'Herman Melville', year: 1851 },
            { title: 'Orgullo y Prejuicio', author: 'Jane Austen', year: 1813 },
            { title: 'Crimen y Castigo', author: 'Fyodor Dostoevsky', year: 1866 },
            { title: 'La Odisea', author: 'Homero', year: -800 }
        ];

        // Add auto-incrementing ID to each book
        for (let book of books) {
            const nextId = await getNextSequenceValue();
            book.id = nextId;  // Add the auto-incrementing ID
        }

        const result = await collection.insertMany(books);
        console.log(`${result.insertedCount} books were inserted`);
    } finally {
        await client.close();
    }
}

run().catch(console.error);
