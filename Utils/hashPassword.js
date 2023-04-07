const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (loginPass, userPass) => {
  const isPassMatched = await bcrypt.compare(loginPass, userPass);
  return isPassMatched;
};

module.exports = {
  hashPassword,
  comparePassword,
};
