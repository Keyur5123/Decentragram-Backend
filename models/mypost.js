const mongoose = require("mongoose");
const connection = require("../connection/connection");
var mypostSchema = mongoose.Schema({
  id: {
    type: String,
    require: true,
  },
  userData: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "userData",
    default: null,
  },
  postImg: {
    type: String,
    default: null,
  },
  postTitle: {
    type: String,
    default: null,
  },
  postLike: [
    {
      postLikeUserId: {
        type: String,
        require: true,
      },
      postLikeUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData",
        default: null,
      },
      like: {
        type: Boolean,
        default: false,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("mypost", mypostSchema);
