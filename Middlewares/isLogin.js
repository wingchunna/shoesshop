const getTokenFromHeader = require("../Utils/getTokenFromHeader");
const verifyToken = require("../Utils/verifyToken");
const { appError } = require("./appError");
const isLogin = (req, res, next) => {
  // get token from header

  const token = getTokenFromHeader(req);
  // verify token
  if (token) {
    const decodedUser = verifyToken(token);
    //save the user in to req obj
    req.userAuth = decodedUser.id;
    if (!decodedUser) {
      return next(appError("Token Invalid or Expired, please Login Back !"));
    } else {
      next();
    }
  } else {
    return next(appError("Token Invalid or Expired, please Login Back !"));
  }
};

module.exports = isLogin;
