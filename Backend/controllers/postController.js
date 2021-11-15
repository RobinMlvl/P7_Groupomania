const db = require("../sqlConnection");

exports.send = (req, res) => {
  let query = `INSERT INTO post (userId, text, image) VALUES (?, ?, ?);`;

  let userId = res.locals.userId;
   let postText = req.body.text;
 let postImage = `${req.protocol}://${req.get("host")}/images/${
  req.file.filename
}`;

  db.query(query, [userId, postText, postImage], (err, rows) => {
    if (err) throw err;
    res.status(201).json(10);
  });
};
