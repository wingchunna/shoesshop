const User = require("../../model/User/User");
const { hashPassword, comparePassword } = require("../../Utils/hashPassword");
const { appError, notFound } = require("../../Middlewares/appError");
const generateToken = require("../../Utils/generateToken");

//@desc Register User
//@route POST /api/v1/users/register
//@access Private/Admin

const userRegisterCtrl = async (req, res, next) => {
  //check user exits
  const { email, fullname, password } = req.body;
  if (email && fullname && password) {
    const userExits = await User.findOne({ email });
    if (userExits) {
      return next(appError("Account Exists !"));
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    // create user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      msg: "User registered",
      data: user,
    });
  } else {
    return next(appError("You must fill data input"));
  }
};

//@desc Login User
//@route POST /api/v1/users/login
//@access Private/Admin

const userLoginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    try {
      //find the user in db
      const userFound = await User.findOne({ email });
      if (!userFound) {
        return next(appError("Invalid login details"));
      }
      // verify password
      const isPassMatched = await comparePassword(
        password,
        userFound?.password
      );
      if (!isPassMatched) {
        return next(appError("Invalid login details"));
      }
      res.json({
        msg: "Login successfully",
        data: userFound,
        token: generateToken(userFound?._id),
      });
    } catch (error) {
      return next(appError(error.message));
    }
  }
};

//@desc Get User Profile
//@route GET /api/v1/users/profile
//@access Private/Admin

const getUserProfileCtrl = async (req, res, next) => {
  res.json({
    msg: "Get All User",
  });
};

//@desc Get All User
//@route GET /api/v1/users/
//@access Private/Admin

const getAllUserCtrl = async (req, res, next) => {
  res.json({
    msg: "Get All User",
  });
};

//@desc Get User By Id
//@route GET /api/v1/users/:id
//@access Private/Admin

const getUserByIdCtrl = async (req, res, next) => {
  res.json({
    msg: "Get User By ID",
  });
};

//@desc Update User
//@route PUT /api/v1/users/:id
//@access Private/Admin

const updateUserCtrl = async (req, res, next) => {
  res.json({
    msg: "Update User",
  });
};

//@desc Delete User
//@route delete /api/v1/users/:id
//@access Private/Admin

const deleteUserCtrl = async (req, res, next) => {
  res.json({
    msg: "Delete User",
  });
};

module.exports = {
  userRegisterCtrl,
  userLoginCtrl,
  getAllUserCtrl,
  getUserByIdCtrl,
  updateUserCtrl,
  deleteUserCtrl,
  getUserProfileCtrl,
};
