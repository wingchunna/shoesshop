const User = require("../../Model/User/User");
const { hashPassword, comparePassword } = require("../../Utils/hashPassword");
const { appError, notFound } = require("../../Middlewares/appError");
const generateToken = require("../../Utils/generateToken");
const bcrypt = require("bcryptjs");
const mailer = require("../../Utils/mailer");

//@desc Register User
//@route POST /api/v1/users/register
//@access Private/Admin

const userRegisterCtrl = async (req, res, next) => {
  //check user exits
  const { email, fullname, password } = req.body;

  if (email && fullname && password) {
    const userExits = await User.findOne({ email });
    if (userExits) {
      return next(appError("Tài khoản đã tồn tại !", 403));
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
      user,
      message: "Đăng ký tài khoản thành công !",
      status: "success",
    });
  } else {
    return next(appError("Bạn cần nhập đầy đủ thông tin !", 500));
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
        return next(
          appError(
            "Tài khoản hoặc mật khẩu không đúng, vui lòng thử lại !",
            403
          )
        );
      }
      // verify password
      const isPassMatched = await comparePassword(
        password,
        userFound?.password
      );
      if (!isPassMatched) {
        return next(
          appError(
            "Tài khoản hoặc mật khẩu không đúng, vui lòng thử lại !",
            403
          )
        );
      }
      if (userFound.isBlocked) {
        return next(
          appError(
            "Tài khoản đang bị tạm khóa do vi phạm chính sách, vui lòng liên hệ admin để được hỗ trợ !",
            403
          )
        );
      }
      const userToken = generateToken(userFound?._id);
      req.session.user = userToken;
      req.session.authorized = true;

      res.status(201).json({
        user: userFound,
        token: userToken,
        message: "Đăng nhập thành công",
        status: "success",
      });
    } catch (error) {
      return next(appError(error.message, 500));
    }
  }
};

//@desc Logout User
//@route POST /api/v1/users/login
//@access Private/Admin

const userLogoutCtrl = async (req, res, next) => {
  try {
    if (req.session.authorized) {
      res.clearCookie("connect.sid", {
        path: "/",
      });
      req.session.destroy(function (err) {
        res.json({
          message: "Đăng xuất thành công !",
          status: "success",
        });
      });
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Get User Profile
//@route GET /api/v1/users/profile
//@access Private/Admin

const getUserProfileCtrl = async (req, res, next) => {
  try {
    if (req.session.authorized) {
      const user = await User.findById(req.userAuth).populate("orders");

      if (!user) {
        return next(appError("Không tìm thấy user", 403));
      }
      res.status(201).json({
        user,
        message: "Truy vấn profile thành công",
        status: "success",
      });
    } else {
      return next(appError("Bạn cần đăng nhập", 401));
    }
  } catch (error) {
    next(appError("Không thể xem user profile", 500));
  }
};

//@desc Get All User
//@route GET /api/v1/users/
//@access Private/Admin

const getAllUserCtrl = async (req, res, next) => {
  try {
    if (req.session.authorized) {
      const users = await User.find();

      if (!users) {
        return next(appError("Không tìm thấy user", 403));
      }
      res.status(201).json({
        users,
        message: "Truy vấn danh sách users thành công",
        status: "success",
      });
    } else {
      return next(appError("Bạn cần đăng nhập", 401));
    }
  } catch (error) {
    next(appError(error.message, 500));
  }
};

//@desc Get User By Id
//@route GET /api/v1/users/:id
//@access Private/Admin

const getUserByIdCtrl = async (req, res, next) => {
  try {
    if (req.session.authorized) {
      const user = await User.findById(req.params.id).populate("orders");
      if (!user) {
        return next(appError("Không tìm thấy user", 403));
      }
      res.status(201).json({
        user,
        message: "Truy vấn user thành công",
        status: "success",
      });
    } else {
      return next(appError("Bạn cần đăng nhập", 401));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Update User
//@route PUT /api/v1/users/:id
//@access Private/Admin

const updateUserCtrl = async (req, res, next) => {
  try {
    if (req.session.authorized) {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          fullname: req?.body?.fullname,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(201).json({
        user,
        message: "Cập nhật thông tin User thành công !",
        status: "success",
      });
    } else {
      return next(appError("Bạn cần đăng nhập", 401));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Delete User
//@route delete /api/v1/users/:id
//@access Private/Admin

const deleteUserCtrl = async (req, res, next) => {
  try {
    if (req.session.authorized) {
      const user = await User.findByIdAndDelete(req.userAuth);

      res.status(201).json({
        message: "Xóa user thành công !",
        status: "success",
      });
    } else {
      return next(appError("Bạn cần đăng nhập", 401));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Update Shipping Address
//@route delete /api/v1/users/:id
//@access Private/Admin

const updateShippingAddressCtrl = async (req, res, next) => {
  try {
    if (req.session.authorized) {
      const {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
        country,
      } = req.body;

      const user = await User.findByIdAndUpdate(
        req.userAuth,
        {
          shippingAddress: {
            firstName,
            lastName,
            address,
            city,
            postalCode,
            province,
            phone,
            country,
          },
          hasShippingAddress: true,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(201).json({
        user,
        message: "Cập nhật địa chỉ nhận hàng thành công !",
        status: "success",
      });
    } else {
      return next(appError("Bạn cần đăng nhập", 401));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Update profile User
//@route PUT /api/v1/users/:id
//@access Private/Admin

//upload Photo
const uploadPhotoProfileCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    //find the user to be update
    const user = await User.findById(req.userAuth);
    // check if user is found
    if (!user) {
      return next(appError("Không tìm thấy user", 403));
    }

    // check if user is updating their photo
    if (req.file) {
      console.log(req.profile);
      // update profile photo
      await User.findByIdAndUpdate(
        req.userAuth,
        {
          $set: {
            profilePhoto: req.file.path,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(201).json({
        status: "success",
        data: "Cập nhật avatar thành công !",
      });
    } else {
      next(appError("file không tồn tại", 403));
    }
  } catch (error) {
    next(appError(error.message, 500));
  }
};

//update Password user
const updatePasswordUserCtrl = async (req, res, next) => {
  const { password, retypePassword } = req.body;
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }

    // check if user is updating the password
    if (password && retypePassword && password === retypePassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //update user
      const user = await User.findByIdAndUpdate(
        req.userAuth,
        {
          password: hashedPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(201).json({
        status: "success",
        data: "Mật khẩu đã được cập nhật thành công !",
      });
    } else {
      return next(
        appError(
          "Mật khẩu và mật khẩu nhắc lại không khớp, vui lòng kiểm tra lại",
          403
        )
      );
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

const resetPasswordUserCtrl = async (req, res, next) => {
  const { email, password, retypePassword } = req.body;
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    if (email && password && retypePassword) {
      if (password !== retypePassword) {
        return next(
          appError("Mật khẩu không khớp, vui lòng kiểm tra lại !", 403)
        );
      }
      const hashedPassword = await hashPassword(password);
      // tìm kiếm user bằng email
      const user = await User.findOneAndUpdate(
        { email },
        {
          password: hashedPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(201).json({
        user,
        message: "Reset mật khẩu thành công !",
        status: "success",
      });
    } else {
      return next(appError("Bạn cần nhập đầy đủ thông tin !", 403));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

// request reset password
const reqResetPasswordCtrl = async (req, res, next) => {
  const email = req.query.email;
  console.log(email);
  // check email in DB
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(appError("Email không tồn tại, vui lòng kiểm tra lại", 403));
    }

    mailer.sendMail(
      email,
      "Reset password",
      `<span>Đây là email từ hệ thống Shoes Shop. Bạn vừa yêu cầu reset mật khẩu.Để thực hiện thay đổi mật khẩu, vui lòng bấm vào link bên dưới</span></br><a href="${process.env.APP_URL}/api/v1/users/password/reset/${email}"> Reset Password</a>`
    );
    res.status(201).json({
      message: "Gửi email reset password thành công. Vui lòng check email !",
      status: "success",
    });

    // Gửi mail reset pass
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

// Admin block user
const blockUserCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    const userFound = await User.findById(req.params.id);
    if (!userFound) {
      return next(appError("User không tồn tại", 403));
    }
    if (userFound.isAdmin) {
      return next(appError("Không thể khóa tài khoản admin", 403));
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isBlocked: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json({
      user,
      status: "success",
      message: "Khóa tài khoản user thành công",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

// Admin unblock user
const unblockUserCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    const userFound = await User.findById(req.params.id);
    if (!userFound) {
      return next(appError("User không tồn tại", 403));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isBlocked: false,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json({
      user,
      status: "success",
      message: "Mở khóa tài khoản user thành công",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

// Admin Dashboard
const adminDashboardCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

module.exports = {
  userRegisterCtrl,
  userLoginCtrl,
  getAllUserCtrl,
  getUserByIdCtrl,
  updateUserCtrl,
  deleteUserCtrl,
  getUserProfileCtrl,
  updateShippingAddressCtrl,
  uploadPhotoProfileCtrl,
  updatePasswordUserCtrl,
  resetPasswordUserCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  adminDashboardCtrl,
  reqResetPasswordCtrl,
  userLogoutCtrl,
};
