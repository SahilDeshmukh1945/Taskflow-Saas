const express = require('express');
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { registerUser, loginUser } = require("../controllers/authController");

//register route
router.post("/register",registerUser);
//login route
router.post("/login",loginUser);
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});
module.exports = router;