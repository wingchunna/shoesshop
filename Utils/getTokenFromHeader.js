const appError = require("../Middlewares/appError");

const getTokenFromHeader = (req) => {
  const headerObj = req.headers;

  if (headerObj["authorization"] !== undefined) {
    const token = headerObj["authorization"].split(" ")[1];
    // const token = headerObj.authorization;

    if (token !== undefined) {
      return token;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

module.exports = getTokenFromHeader;
