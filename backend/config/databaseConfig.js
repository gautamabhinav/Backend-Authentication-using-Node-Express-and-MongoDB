const mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL 

const connectDatabase = () => {
    try {
        mongoose
        .connect(MONGODB_URL)
        .then((conn) => console.log(`Connected to DB: ${conn.connection.host}`));
    } catch (error) {
        console.log(err.message);
    }
}

module.exports = connectDatabase;