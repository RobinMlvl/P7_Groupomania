const mysql = require("mysql")

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '6mlyhtrdot',
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