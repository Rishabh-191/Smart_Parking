const dotenv = require('dotenv')

const mongoose = require('mongoose');
const reconnectTimeout = 5000; // ms

dotenv.config({ path: '.env' })
const mongoUrl = process.env.MONGODB_URL;

function connect() {

    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,

        useUnifiedTopology: true,

    });
}
const db = mongoose.connection;

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

db.on('error', (error) => {
    console.error(`MongoDB connection error: ${error}`);
    mongoose.disconnect();
});


db.on('reconnected', () => {
    console.info('MongoDB reconnected!');
});

db.on('disconnected', () => {
    console.error(`MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`);
    setTimeout(() => connect(), reconnectTimeout);
});
connect();
module.exports = db;