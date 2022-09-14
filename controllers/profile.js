var jwt = require("jsonwebtoken");
const registerModel = require("../models/register");
var fs = require("fs");
const { jwtVerify } = require("./factory_function/jetVerify");

exports.profileGET = async (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];
  try {
    let decoded = jwtVerify(token);
    let dbData = registerModel.findById(decoded.id);
    dbData
      .exec()
      .then((data) => {
        console.log("profile pic :- ",data);
        res.json({
          data: data,
        });
      })
      .catch((err) => {
        res.json({
          error: err,
        });
      });
  } catch (error) {
    res.json({
      error: error,
    });
    // console.log("error   vgreafvnsef", error);
  }
};

exports.profilePOST = (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];
  let fUsername = req.body.name;
  let fEmail = req.body.email;
  // console.log("postprofile", token, fUsername, fEmail, req.file);
  if (!req.file) {
    console.log("if");
    // console.log("only UN & E");
    try {
      let decoded = jwtVerify(token);
      let registerDataUpdate = registerModel.findByIdAndUpdate(decoded.id, {
        userName: fUsername,
        email: fEmail,
      });
      registerDataUpdate
        .then((data) => {
          res.json({
            message: "updated",
            data: data,
          });
        })
        .catch((err) => {
          console.log("try error", err);
          res.json({
            error: err,
          });
        });
    } catch (error) {
      console.log("catch error", error);
      res.json({
        error: error,
      });
    }
  } else {
    try {
      let imageName = req.file.filename;
      let decoded = jwtVerify(token);
      let deletOddProImg = registerModel.findById(decoded.id);

      deletOddProImg
        .then((data) => {
          // console.log("userdata", data);
          let oddimgname = data.image;
          if (fs.existsSync(`public/${oddimgname}`)) {
            fs.unlinkSync(`public/${oddimgname}`, (err) => {
              if (err) {
                res.json({
                  error: err,
                });
              } else {
                // console.log("Successfully deleted the file.");
              }
            });
          }
          let registerDataUpdate = registerModel.findByIdAndUpdate(
            { _id: decoded.id },
            {
              userName: fUsername,
              email: fEmail,
              image: "profileImg/" + imageName,
            }
          );
          registerDataUpdate
            .then((data) => {
              res.json({
                message: "updated",
                data: data,
              });
            })
            .catch((err) => {
              res.json({
                error:
                  err.code === 11000
                    ? "Email already in used"
                    : "Databse error!",
              });
            });
        })
        .catch((err) => {
          // console.log("else pRt", err);
          res.json({
            error: err,
            Message: "pid error",
          });
        });
    } catch (error) {
      // console.log("end error", error);
      res.json({
        error: error,
      });
    }
  }
};
