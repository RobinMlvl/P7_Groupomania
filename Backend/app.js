const express = require("express");
const cors = require("cors");
const app = express();

const userRoute = require('./routes/userRoute');

app.use(cors());
app.use(express.json());
app.use('/auth', userRoute);



module.exports = app;
