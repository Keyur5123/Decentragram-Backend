const registerModel = require("../models/register");
const chatModel = require("../models/chat");
const { jwtVerify } = require("./factory_function/jetVerify");
// console.log("registerModel", registerModel);
console.log("chatModel");

exports.allUserGET = async (req, res, next) => {
  var token = req.headers.authorization.split(" ")[1];
  try {
    let decode = jwtVerify(token);
    console.log("id", decode.id);
    var allUseData = registerModel.find({});
    allUseData
      .exec()
      .then((data) => {
        res.json({
          data: data,
          loginUserId: decode.id,
          message: "[chat.js]",
        });
      })
      .catch((err) => {
        console.log("error", err);
        res.json({
          error: err,
          message: "chatcecfeded allUserData error",
        });
      });
    // console.log(allUseData);
  } catch (error) {
    console.log("dwdwwsws", error);
    res.json({
      error: error,
      message: "jwt error",
    });
  }
};

exports.messageGET = async (req, res, next) => {
  var token = req.headers.authorization.split(" ")[1];
  var sender = req.headers.authorization.split(" ")[2];
  var recever = req.headers.authorization.split(" ")[3];
  console.log('sender',sender);
  console.log('recever',recever);
  try {
    let decode = jwtVerify(token);
    console.log("id", decode.id);
    var chatsenderuser = chatModel.find({
      senderId: decode.id,
      receverId: recever,
    });
    chatsenderuser
      .exec()
      .then((senderdata) => {
        var chatreceveruser = chatModel.find({
          senderId: recever,
          receverId: decode.id,
        });
        chatreceveruser
          .exec()
          .then((recevrdata) => {
            let data = senderdata.concat(recevrdata);
            data = data.sort((a, b) =>
              a.date > b.date ? 1 : b.date > a.date ? -1 : 0
            );
            // let messageData = [];
            // for (const i of data) {
            //   messageData.push(i); // logs 0, 1, 2, "foo", "arrCustom", "objCustom"
            // }
            // console.log("messageData", messageData);
            res.json({
              // senderdata: senderdata,
              // recevrdata: recevrdata,
              data: data,
              loginUserId: decode.id,
              message: "[chat.js]",
            });
          })
          .catch((err) => {
            console.log("error", err);
            res.json({
              error: err,
              message: "chatcecfeded chatModel error",
            });
          });
      })
      .catch((err) => {
        console.log("error", err);
        res.json({
          error: err,
          message: "chatcecfeded chatModel error",
        });
      });
    // console.log(allUseData);
  } catch (error) {
    console.log("dwdwwsws", error);
    res.json({
      error: error,
      message: "jwt error",
    });
  }
};

exports.messagePOST = async (req, res, next) => {
  var sendObj = req.body;
  console.log("sendObj", sendObj);
  var dbMypostobj = new chatModel({
    senderId: sendObj.senderId,
    receverId: sendObj.receverId,
    text: sendObj.Text,
  });
  dbMypostobj
    .save()
    .then((data) => {
      res.json({
        data: data,
        message: "post upload",
      });
    })
    .catch((err) => {
      console.log("picError", err);
      res.json({
        error: err,
        message: "message post error",
      });
    });
};

exports.unsendMessagePOST = async (req, res, next) => {
  var id = req.body.id;
  var dbMypostobj =chatModel.findByIdAndDelete(id)
  dbMypostobj
    .then((data) => {
      res.json({
        data: data,
        message: "post upload",
      });
    })
    .catch((err) => {
      console.log("unsend message", err);
      res.json({
        error: err,
        message: "unsend message error",
      });
    });
};
