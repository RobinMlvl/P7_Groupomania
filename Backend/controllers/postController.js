const db = require("../sqlConnection");
const jwt = require("jsonwebtoken");
const fs = require("fs");

require("dotenv").config();

exports.send = (req, res) => {
  let query = `INSERT INTO post (userId, text, image, date, liked, disliked, userLiked, userDisliked, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let userId = res.locals.userId;
  let dateBrut = new Date();
  let dateMonth = dateBrut.getMonth() + 1;
  let date = dateBrut.getDay() + " " + monthNames[dateMonth];
  let postText = req.body.text;
  let postImage = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : "";

  let array = JSON.stringify([]);

  db.query(
    query,
    [userId, postText, postImage, date, 0, 0, array, array, array],
    (err, rows) => {
      if (err) throw err;
      res.status(201).json(10);
    }
  );
};

exports.allFeed = (req, res) => {
  db.query("SELECT * FROM post", function (err, result, fields) {
    if (err) res.status(401).json(err);
    res.status(200).json(result);
  });
};

exports.commentPost = (req, res) => {
  let postId = req.body.id;
  db.query(
    "SELECT * FROM post WHERE id=?",
    postId,
    function (err, result, fields) {
      if (err) res.status(401).json(err);

      let comment = req.body.comment;

      let userId = res.locals.userId;

      let commentObject = {
        userId: userId,
        comment: comment,
      };

      let userComment = JSON.parse(result[0].comment);
      let addComment = JSON.stringify([...userComment, commentObject]);

      let queryUser = `UPDATE post SET comment = ? WHERE id = ?`;

      db.query(queryUser, [addComment, postId], function (err, result, fields) {
        if (err) throw err;
      });

      res.status(200).json(result[0].comment);
    }
  );
};

exports.deleteComment = (req, res) => {
  let postId = req.body.postId;
  db.query(
    "SELECT * FROM post WHERE id=?",
    postId,
    function (err, result, fields) {
      if (err) res.status(401).json(err);

      let addComment = JSON.stringify(req.body.comment);

      let queryUser = `UPDATE post SET comment = ? WHERE id = ?`;

      db.query(queryUser, [addComment, postId], function (err, result, fields) {
        if (err) throw err;
      });

      res.status(200).json(result[0].comment);
    }
  );
};

exports.updatePost = (req, res) => {
  let id = req.params.id;
  let text = req.body.text;

  let queryPost = "SELECT * FROM post WHERE id=?";
  let queryUser = `SELECT * FROM user WHERE id=?;`;

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_PASSWORD);
  const userId = decodedToken.userId;

  db.query(queryPost, id, (error, results, fields) => {
    if (error) return console.error(error.message);
    db.query(queryUser, userId, function (err, userData, fields) {
      if (err) throw err;
      let admin = userData[0].admin;
      let userId = userData[0].id;
      let postId = results[0].userId;

      if (admin === 1 || userId === postId) {
        if (req.file) {
          let image = `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`;
          let query = `UPDATE post SET text = ?, image = ? WHERE id = ?`;

          const filename = results[0].image.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            db.query(query, [text, image, id], (error, results, fields) => {
              if (error) return console.error(error.message);
            });
          });
        } else {
          let query = `UPDATE post SET text = ? WHERE id = ?`;
          db.query(query, [text, id], (error, results, fields) => {
            if (error) return console.error(error.message);
          });
        }

        res.status(201).json({ message: "delete" });
      } else {
        res.status(201).json({ message: "No permission to update this post" });
      }
    });
  });
};

exports.deletePost = (req, res) => {
  let el = req.params.id;

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_PASSWORD);
  const userId = decodedToken.userId;

  let query = `DELETE FROM post WHERE id = ?`;

  let queryPost = "SELECT * FROM post WHERE id=?";

  let queryUser = `SELECT * FROM user WHERE id=?;`;

  db.query(queryPost, el, (error, results, fields) => {
    if (error) return console.error(error.message);
    db.query(queryUser, userId, function (err, userData, fields) {
      if (err) throw err;
      let admin = userData[0].admin;
      let userId = userData[0].id;
      let postId = results[0].userId;

      if (admin === 1 || userId === postId) {
        const filename = results[0].image.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          db.query(query, el, (error, results, fields) => {
            if (error) return console.error(error.message);
            console.log("Deleted Row(s):", results.affectedRows);
          });
        });
        res.status(201).json({ message: "delete" });
      } else {
        res.status(201).json({ message: "No permission to delete this post" });
      }
    });
  });
};

exports.likePost = (req, res) => {
  let number = req.body.number;
  let postId = req.body.id;
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_PASSWORD);
  const userId = decodedToken.userId;

  db.query(
    "SELECT * FROM post WHERE id=?",
    postId,
    function (err, result, fields) {
      if (err) res.status(401).json(err);

      if (number === 1) {
        let totalLiked = result[0].liked + 1;

        let userLiked = JSON.parse(result[0].userLiked);
        let addLiked = JSON.stringify([...userLiked, userId]);

        let query = `UPDATE post SET liked = ? WHERE id = ?`;

        db.query(query, [totalLiked, postId], function (err, result, fields) {
          if (err) throw err;
        });

        let queryUser = `UPDATE post SET userLiked = ? WHERE id = ?`;

        db.query(queryUser, [addLiked, postId], function (err, result, fields) {
          if (err) throw err;
        });

        res.status(201).json({ message: "user & like added" });
      } else if (number === 2) {
        let totalLiked = result[0].disliked + 1;

        let userDisliked = JSON.parse(result[0].userDisliked);
        let addLiked = JSON.stringify([...userDisliked, userId]);

        let query = `UPDATE post SET disliked = ? WHERE id = ?`;

        db.query(query, [totalLiked, postId], function (err, result, fields) {
          if (err) throw err;
        });

        let queryUser = `UPDATE post SET userDisliked = ? WHERE id = ?`;

        db.query(queryUser, [addLiked, postId], function (err, result, fields) {
          if (err) throw err;
        });

        res.status(201).json({ message: "user & dislike added" });
      } else if (number === 3) {
        let totalLiked = result[0].liked + 1;

        let userLiked = JSON.parse(result[0].userLiked);
        let addLiked = JSON.stringify([...userLiked, userId]);

        let query = `UPDATE post SET liked = ? WHERE id = ?`;

        db.query(query, [totalLiked, postId], function (err, result, fields) {
          if (err) throw err;
        });

        let queryUser = `UPDATE post SET userLiked = ? WHERE id = ?`;

        db.query(queryUser, [addLiked, postId], function (err, result, fields) {
          if (err) throw err;
        });

        let totalDisliked = result[0].disliked - 1;

        let userDisliked = JSON.parse(result[0].userDisliked);
        let arrayDisliked = userDisliked.filter(
          (element) => element !== userId
        );
        let addDisliked = JSON.stringify([...arrayDisliked]);

        let queryUser2 = `UPDATE post SET userDisliked = ? WHERE id = ?`;

        db.query(
          queryUser2,
          [addDisliked, postId],
          function (err, result, fields) {
            if (err) throw err;
          }
        );

        let query2 = `UPDATE post SET disliked = ? WHERE id = ?`;
        db.query(
          query2,
          [totalDisliked, postId],
          function (err, result, fields) {
            if (err) throw err;
          }
        );
        res.status(201).json(result);
      } else if (number === 4) {
        let totalLiked = result[0].liked - 1;

        let query = `UPDATE post SET liked = ? WHERE id = ?`;
        db.query(query, [totalLiked, postId], function (err, result, fields) {
          if (err) throw err;
        });

        let userLiked = JSON.parse(result[0].userLiked);
        let arrayLiked = userLiked.filter((element) => element !== userId);
        let addLiked = JSON.stringify([...arrayLiked]);

        let queryUser = `UPDATE post SET userLiked = ? WHERE id = ?`;

        db.query(queryUser, [addLiked, postId], function (err, result, fields) {
          if (err) throw err;
        });

        let totalDisliked = result[0].disliked + 1;
        let query2 = `UPDATE post
      SET disliked = ?
      WHERE id = ?`;
        db.query(
          query2,
          [totalDisliked, postId],
          function (err, result, fields) {
            if (err) throw err;
          }
        );

        let userDisliked = JSON.parse(result[0].userDisliked);
        let userDisliked2 = JSON.stringify([...userDisliked, userId]);

        let queryUserDisliked = `UPDATE post SET userDisliked = ? WHERE id = ?`;

        db.query(
          queryUserDisliked,
          [userDisliked2, postId],
          function (err, result, fields) {
            if (err) throw err;
          }
        );

        res.status(201).json(result);
      } else if (number === 5) {
        let totalLiked = result[0].liked - 1;
        let query = `UPDATE post
      SET liked = ?
      WHERE id = ?`;
        db.query(query, [totalLiked, postId], function (err, result, fields) {
          if (err) throw err;
        });

        let userLiked = JSON.parse(result[0].userLiked);
        let arrayLiked = userLiked.filter((element) => element !== userId);
        let addLiked = JSON.stringify([...arrayLiked]);

        let queryUser = `UPDATE post SET userLiked = ? WHERE id = ?`;

        db.query(queryUser, [addLiked, postId], function (err, result, fields) {
          if (err) throw err;
        });

        res.status(201).json(result);
      } else if (number === 6) {
        let totalDisliked = result[0].disliked - 1;
        let query = `UPDATE post
      SET disliked = ?
      WHERE id = ?`;
        db.query(
          query,
          [totalDisliked, postId],
          function (err, result, fields) {
            if (err) throw err;
          }
        );

        let userDisliked = JSON.parse(result[0].userDisliked);
        let arrayDisliked = userDisliked.filter(
          (element) => element !== userId
        );
        let addDisliked = JSON.stringify([...arrayDisliked]);

        let queryUser2 = `UPDATE post SET userDisliked = ? WHERE id = ?`;

        db.query(
          queryUser2,
          [addDisliked, postId],
          function (err, result, fields) {
            if (err) throw err;
          }
        );

        res.status(201).json(result);
      }
    }
  );
};
