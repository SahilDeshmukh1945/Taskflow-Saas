const express = require('express');
const {createWorkspace,getWorkspace,addMember} = require("../controllers/workspaceController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/create",protect,createWorkspace);
router.get("/",protect,getWorkspace);
router.post("/add-member",protect,addMember);
module.exports= router;

