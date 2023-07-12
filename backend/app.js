const express = require('express');
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require('./router/authRoute.js');
const connectDatabase = require('./config/databaseConfig.js');

connectDatabase();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true})) // Third party middleware

app.use('/api/auth', authRouter);

app.use('/', (req, res) => {
  res.status(200).json({ data: 'JWT auth server' });
});

module.exports = app;