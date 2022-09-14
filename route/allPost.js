const express = require("express");
const { allPost } = require("../controllers/allPost");
const router = express.Router();

router.get("/", allPost);

module.exports = router;
