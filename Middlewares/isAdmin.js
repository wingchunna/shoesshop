const getTokenFromHeader = require("../Utils/getTokenFromHeader");
const verifyToken = require("../Utils/verifyToken");
const globalErrHandler = require("../Middlewares/globalErrHandler");
const User = require("../Model/User/User");
const { appError } = require("../Middlewares/appError");

const isAdmin = async (req, res, next) => {
  // get token from header
  const token = getTokenFromHeader(req);
  // verify token
  const decodedUser = verifyToken(token);
  //save the user in to req obj
  req.userAuth = decodedUser.id;
  // find User in DB
  const user = await User.findById(decodedUser.id);
  // check user is Admin
  if (user.isAdmin) {
    return next();
  } else {
    return next(
      appError(
        "Bạn không có quyền thao tác. Chỉ có Admin mới có quyền thực hiện điều này",
        403
      )
    );
  }
};

module.exports = isAdmin;
