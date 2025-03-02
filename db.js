require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;


async function connectToMongoDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit the application if connection fails
    }
}

let db;
async function connect() {
  try {
    await startServer(); // Connect to MongoDB first
    db = client.db('moraslov'); // Replace with your database name
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err);
  }
}

function getDb() {
  return db;
}

// Start the server
async function startServer() {
    await connectToMongoDB(); // Connect to MongoDB first
    
}

startServer().catch(console.error);
module.exports = { connect, getDb };