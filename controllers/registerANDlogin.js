const registerModel = require("../models/register");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerGET = (req, res, next) => {
  var data = registerModel.find({});
  data
    .exec()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json("data not found");
    });
};

exports.registerPOST = async (req, res, next) => {
  var username = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  // if (!username) {
  //   res.json({
  //     error: "plese enter username(sr)",
  //   });
  // }
  // if (!email) {
  //   res.json({
  //     error: "plese enter email(sr)",
  //   });
  // }
  // if (!password) {
  //   res.json({
  //     error: "plese enter password(sr)",
  //   });
  // }

  await registerModel.findOne({ email })
    .then(old_user => {

      if (old_user) {
        res.json({
          error: "Email already in used",
        });
      }

      bcrypt.hash(password, 10, (err, pass) => {
        // console.log("err", err);
        // console.log("pass", pass);
        if (err) {
          res.json({
            error: "form error",
          });
        }
        else {
          var userdata = new registerModel({
            userName: username,
            email: email,
            password: pass,
          });

          userdata
            .save()
            .then((data) => {
              res.json({
                message: "data inserted successfuly",
                record: data,
              });
            })
            .catch((err) => {
              res.json({
                error: "Databse error!",
              });
            });
        }
      });

    })



};

exports.Login = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var registerDb = registerModel.find({ email: email });
  registerDb
    .exec()
    .then((data) => {
      if (data.length < 1) {
        res.json({
          error: "Auth failed 1",
        });
      } else {
        bcrypt.compare(password, data[0].password, (err, result) => {
          // error part
          if (err) {
            res.json({
              error: "Entered Password Is Wrong!...",
            });
          }
          //  result = true
          if (result) {
            var token = jwt.sign({ id: data[0]._id }, "Keyur5123");
            res.status(200).json({
              Messege: "success",
              Token: token,
            });
          } else {
            res.json({
              error: "auth failed 3",
            });
          }
        });
      }
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
};
