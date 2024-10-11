const dotenv = require('dotenv');
const mongoose = require('mongoose');

const reconnectTimeout = 5000; // ms

// Load environment variables from .env file
dotenv.config({ path: '.env' });

// Get the MongoDB URL from environment variables
const mongoUrl = process.env.MONGODB_URL;

// Function to connect to MongoDB
function connect() {
    console.log("MongoDB URL:", mongoUrl);  // Check if this prints the correct URL

    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

const db = mongoose.connection;

// Connection event handlers
db.on('connecting', () => {
    console.info('Connecting to MongoDB...');
});

db.on('error', (error) => {
    console.error(`MongoDB connection error: ${error}`);
    mongoose.disconnect();
});

db.on('connected', () => {
    console.info('Connected to MongoDB!');
});

db.on('reconnected', () => {
    console.info('MongoDB reconnected!');
});

db.on('disconnected', () => {
    console.error(`MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`);
    setTimeout(() => connect(), reconnectTimeout);
});

// Initial connection attempt
connect();

module.exports = db;
