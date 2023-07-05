const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://abhinav:Abhi123@cluster0.4t5bjxi.mongodb.net/";

const databaseconnect = () => {
    mongoose
        .connect(MONGO_URL)
        .then((conn) => console.log(`Connected to DB: ${conn.connection.host}`));
        // .catch((err) => console.log(err.message));
}

module.exports = databaseconnect;