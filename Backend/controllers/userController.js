const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const db = require("../sqlConnection");

exports.signup = (req, res) => {
  let query = `INSERT INTO user 
        (username, email, password, photo) VALUES (?, ?, ?, ?);`;

  // Value to be inserted

  let userName = req.body.username;
  let userEmail = req.body.email;
  let userPassword = req.body.password;
  let userPhoto = req.body.photo;

  // Check data of user

  db.query("SELECT * FROM user", function (err, result, fields) {
    if (err) res.status(401).json(err);

    let emailIndex = () => {
      let res = result.findIndex((el) => el.email === userEmail);
      return res;
    };

    let userIndex = () => {
      let res = result.findIndex((el) => el.username === userName);
      return res;
    };

    // send differents res if not unique email or username

    if (emailIndex() !== -1) {
      res.status(201).json(2);
    } else if (userIndex() !== -1) {
      res.status(201).json(1);
    } else {
      bcrypt.hash(userPassword, 10).then((hash) => {
        db.query(query, [userName, userEmail, hash, userPhoto], (err, rows) => {
          if (err) throw err;
          res.status(201).json(0);
        });
      });
    }
  });
};

exports.login = (req, res) => {
  let userEmail = req.body.email;
  let userPassword = req.body.password;

  db.query("SELECT * FROM user", function (err, result, fields) {
    if (err) res.status(401).json(err);

    let emailIndex = () => {
      let res = result.findIndex((el) => el.email === userEmail);
      return res;
    };

    // send differents res if not unique email or username

    if (emailIndex() === -1) {
      res.status(201).json(2);
    } else {
      let dbUser = result[emailIndex()];
      bcrypt
        .compare(req.body.password, dbUser.password)
        .then((valid) => {
          if (!valid) {
            return res.status(201).json(5);
          } else {
            res.status(200).json({
              user: dbUser,
              token: jwt.sign({ userId: dbUser.id }, "RANDOM_TOKEN_SECRET"),
            });
          }
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    }
  });
};

exports.allUser = (req, res) => {
  let query = `SELECT * FROM user;`;
  db.query(query, function (err, result, fields) {
    if (err) res.status(401).json(err);
    let test = result.map((el) => {
      return { id: el.id, username: el.username, photo: el.photo };
    });
    res.status(200).json(test);
  });
};

exports.oneUser = (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    let query = `SELECT * FROM user WHERE id=?;`;
    db.query(query, userId, function (err, result, fields) {
      if (err) throw err;
      res.status(201).json(result);
    });
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};

exports.deleteUser = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;

  let query = `DELETE FROM post WHERE userId = ?`;
  let query2 = `DELETE FROM user WHERE id = ?`;

  db.query(query, userId, (error, results, fields) => {
    if (error) return console.error(error.message);
    console.log("Deleted Row(s):", results.affectedRows);
    db.query(query2, userId, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
  res.status(201).json({ message: "delete" });
};

exports.updateUser = (req, res) => {
  let query = `UPDATE user
  SET photo = ?
  WHERE id = ?`;

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;

  let postImage = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;

  let queryPost = "SELECT * FROM user WHERE id=?";

  db.query(queryPost, userId, (error, results, fields) => {
    if (error) return console.error(error.message);
    const filename = results[0].photo.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      db.query(query, [postImage, userId], function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.status(201).json(result);
      });
    });
  });

};
