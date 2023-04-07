// app Error
const appError = (message, statusCode) => {
  let err = new Error(message);
  err.statusCode = statusCode ? statusCode : 500;
  err.stack = err.stack;
  return err;
};

const notFound = (req, res, next) => {
  let err = new Error(`Route ${req.originalUrl} not found`);
  next(err);
};
module.exports = {
  appError,
  notFound,
};
