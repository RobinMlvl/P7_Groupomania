const express = require("express");
const cors = require("cors");
const app = express();
const path = require('path');

const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/auth', userRoute);
app.use('/feed', postRoute);



module.exports = app;
