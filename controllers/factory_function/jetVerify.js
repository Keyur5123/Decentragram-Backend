var jwt = require("jsonwebtoken");

exports.jwtVerify = (token) => {
  //   console.log("token")

  return jwt.verify(token, "Keyur5123", function (err, decoded) {
    if (err) {
      // console.log("jet");
      throw err;
    }
    if (decoded) {
      return decoded;
    }
  });
};
