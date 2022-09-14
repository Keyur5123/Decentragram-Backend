const mongoose = require("mongoose");
const connection = require("../connection/connection");
var chatSchema = mongoose.Schema({
  senderId: {
    type: String,
    require: true,
  },
  receverId: {
    type: String,
    require: true,
  },
  text: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("chat", chatSchema);
