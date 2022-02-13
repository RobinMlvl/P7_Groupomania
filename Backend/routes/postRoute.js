const express = require("express");
const { send, allFeed, likePost, commentPost, deletePost, updatePost, deleteComment } = require("../controllers/postController");
const auth = require("../middlewares/auth");

const mutler = require("../middlewares/multer-config");


const router = express.Router();

router.post("/send", auth, mutler, send);
router.get('/allFeed', auth, allFeed);
router.put('/like', auth, likePost);
router.put('/comment', auth, commentPost);
router.put('/deletecomment', auth, deleteComment);
router.delete('/deletepost/:id', auth, deletePost);
router.put('/update/:id', auth, mutler, updatePost);

module.exports = router;
