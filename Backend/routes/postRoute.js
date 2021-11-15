const express = require("express");
const { send } = require("../controllers/postController");
const auth = require("../middlewares/auth");

const mutler = require("../middlewares/multer-config");


const router = express.Router();

router.post("/send",auth, mutler, send);

module.exports = router;
