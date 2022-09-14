const mypostModel = require("../models/mypost");
const jwt = require("jsonwebtoken");
var fs = require("fs");
const { jwtVerify } = require("./factory_function/jetVerify");

exports.mypostGET = (req, res, next) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    let decode = jwtVerify(token);
    var dbdata = mypostModel.find({ id: decode.id }).populate("userData");

    dbdata
      .exec()
      .then((data) => {
        res.json({
          data: data,
        });
      })
      .catch((err) => {
        res.json({
          error: err,
          message: "gdbmypost error",
        });
      });
  } catch (error) {
    res.json({
      error: error,
      message: "Gmypost kwt error",
    });
  }
};

exports.mypostPOST = (req, res, next) => {
  var token = req.headers.authorization.split(" ")[1];
  var postImgname = req.file.filename;
  var mypostTitle = req.body.mptitle;
  try {
    let decode = jwtVerify(token);
    var userid = decode.id;
    var dbMypostobj = new mypostModel({
      id: userid,
      userData: userid,
      postImg: `addpost/` + postImgname,
      postTitle: mypostTitle,
    });
    dbMypostobj
      .save()
      .then((data) => {
        console.log("data uploaded");
        res.json({
          data: data,
          message: "Post Upload Successfully",
        });
      })
      .catch((err) => {
        console.log("picError", err);
        res.json({
          error: err,
          message: "Post Is not Uploaded Successfully...",
        });
      });
  } catch (error) {
    res.json({
      error: error,
      message: "jwt decode error",
    });
  }
  //   jwd decode
};

exports.mypostDELET = (req, res, next) => {
  // console.log("delet post");
  var postid = req.body.id;
  var dbData = mypostModel.findById(postid);
  dbData
    .exec()
    .then((data) => {
      // console.log("data", data.postImg);
      var imgpath = data.postImg;
      if (fs.existsSync(`public/${imgpath}`)) {
        fs.unlinkSync(`public/${imgpath}`, (err) => {
          console.log(err);
        });
      }
      var deletePost = mypostModel.findByIdAndDelete({ _id: postid });
      deletePost
        .then((data) => {
          // console.log(data);
          res.json({
            message: "post deleted",
          });
        })
        .catch((err) => {
          res.json({
            error: err,
          });
        });
    })
    .catch((err) => {
      console.log("err", err);
      res.json({
        error: err,
        message: "error from deletpost",
      });
    });
};
exports.mypostlikeGET = (req, res, next) => {
  var postL_UserToken = req.headers.authorization.split(" ")[1];
  var postid = req.query.postid;
  try {
    let decode = jwtVerify(postL_UserToken);
    var dbData = mypostModel.findById(postid);
    dbData
      .exec()
      .then(async (data) => {
        // console.log("data", data.postImg);
        res.json({
          likeUserId: decode.id,
          data: data,
        });
      })
      .catch((err) => {
        console.log("like get backenderr", err);
        res.json({
          error: err,
          message: "error from likePost",
        });
      });
  } catch (error) {
    // console.log("err", err);
    res.json({
      error: error,
      message: "Gmypost kwt error likepost",
    });
  }
};
exports.mypostlikePOST = async (req, res, next) => {
  var postid = req.body.id;
  var newClicklike = req.body.like;
  // console.log(newClicklike);
  var postL_UserToken = req.headers.authorization.split(" ")[1];
  // console.log("token user Q=====>", postL_UserToken);
  try {
    let decode = jwtVerify(postL_UserToken);
    var likePost = await mypostModel.findById(postid);
    let ArratUserIndex = likePost.postLike.findIndex((item) => {
      return item.postLikeUserId === decode.id;
    });
    let ArratUserData = likePost.postLike.filter((item) => {
      // console.log("filter_item", item.postLikeUser);
      return item.postLikeUserId === decode.id;
    });
    if (ArratUserData.length > 0) {
      // console.log("newClicklikeIn=>", newClicklike);
      // console.log("dupData", likePost.postLike[ArratUserIndex]);
      likePost.postLike[ArratUserIndex].like = newClicklike;
      // console.log("test......");
      likePost
        .save()
        .then((data) => {
          res.json({
            message: "post likeed",
            data: data,
          });
        })
        .catch((err) => {
          console.log("post mrthod like error=>", err);
          res.json({
            error: err,
          });
        });
    } else {
      console.log("else part");
      likePost.postLike.push({
        postLikeUserId: decode.id,
        postLikeUser: decode.id,
        like: newClicklike,
      });
      likePost
        .save()
        .then((data) => {
          res.json({
            message: "post likeed",
            data: data,
          });
        })
        .catch((err) => {
          console.log("post mrthod like error=>", err);
          res.json({
            error: err,
          });
        });
    }
  } catch (error) {
    console.log("err", err);
    res.json({
      error: err,
      message: "Gmypost kwt error likepost",
    });
  }
};
