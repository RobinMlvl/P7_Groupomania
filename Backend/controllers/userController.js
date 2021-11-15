const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
