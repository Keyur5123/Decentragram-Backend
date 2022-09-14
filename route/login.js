const express = require("express");
const route = express.Router();
const { Login } = require("../controllers/registerANDlogin");
route.post("/", Login);
module.exports = route;
