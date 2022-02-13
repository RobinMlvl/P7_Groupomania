const express = require("express");
const { login, signup, oneUser, allUser, deleteUser, updateUser} = require("../controllers/userController");

const auth = require("../middlewares/auth");

const mutler = require("../middlewares/multer-config");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/alluser', allUser);
router.get("/oneuser", oneUser);
router.delete('/deleteuser', deleteUser);
router.put('/updateuser', auth, mutler, updateUser)

module.exports = router;
