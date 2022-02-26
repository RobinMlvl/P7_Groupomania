const mysql = require("mysql")

require('dotenv').config()


const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: process.env.SQL_PASSWORD,
    database: 'groupomania',
});

db.connect((err) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
    } else {
      console.log("connected to Database");
    }
  });

  module.exports = db;