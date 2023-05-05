const Coupon = require("../../Model/Coupon/Coupon");
const { appError, notFound } = require("../../Middlewares/appError");
const moment = require("moment");
//@desc Register Coupon
//@route POST /api/v1/Coupons/register
//@access Private/Admin

const addCouponCtrl = async (req, res, next) => {
  //check Coupon exits
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    let { code, startDate, endDate, discount } = req.body;
    if (code && discount && startDate && endDate) {
      const couponFound = await Coupon.findOne({ code });
      if (couponFound) {
        return next(appError("Coupon đã tồn tại", 403));
      }
      if (isNaN(discount)) {
        return next(appError("Discount phải là số", 403));
      }
      const currentDate = moment(getDateNow(), "DD/MM/YYYY");
      startDate = moment(startDate, "DD/MM/YYYY");
      endDate = moment(endDate, "DD/MM/YYYY");
      console.log(currentDate);
      console.log(startDate);
      if (startDate < currentDate) {
        return next(
          appError("Bạn phải nhập thời gian bắt đầu muộn hơn hiện tại", 403)
        );
      }
      if (startDate >= endDate) {
        return next(
          appError("Bạn phải nhập thời gian bắt đầu sớm hơn kết thúc", 403)
        );
      }
      if (discount <= 0 || discount > 100) {
        return next(
          appError("Bạn phải nhập giá trị discount trong khoảng từ 1-100", 403)
        );
      }

      //create Coupon
      startDate = moment(startDate, "DD/MM/YYYY");
      endDate = moment(endDate, "DD/MM/YYYY");

      const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discount,
        startDate,
        endDate,
        user: req.userAuth,
      });
      // push Product to Coupon
      // send response
      res.status(201).json({
        data: coupon,
        status: "success",
        message: "Thêm mới coupon thành công !",
      });
    } else {
      return next(appError("Bạn cần nhập đầy đủ thông tin sản phẩm", 403));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

const getDateNow = () => {
  let date_time = new Date();

  // get current date
  // adjust 0 before single digit date
  let date = ("0" + date_time.getDate()).slice(-2);

  // get current month
  let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

  // get current year
  let year = date_time.getFullYear();

  // get current hours
  let hours = date_time.getHours();

  // get current minutes
  let minutes = date_time.getMinutes();

  // get current seconds
  let seconds = date_time.getSeconds();
  let dateTime =
    date +
    "/" +
    month +
    "/" +
    year +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return dateTime;
};

//@desc Get Coupon by name
//@route GET /api/v1/Coupons/
//@access Private/Admin

const getAllCouponCtrl = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    if (!coupons) {
      return next(appError("Không tìm thấy danh sách Coupon", 403));
    }
    res.status(201).json({
      coupons,
      status: "success",
      message: "Tìm kiếm danh sách Coupon thành công !",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Get Coupon By Id
//@route GET /api/v1/Coupons/:id
//@access Private/Admin

const getCouponByIdCtrl = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      next(appError("Không tìm thấy Coupon !", 403));
    }
    res.status(201).json({
      coupon,
      status: "success",
      message: "Tìm kiếm Coupon thành công !",
    });
  } catch (error) {
    next(appError("Không tìm thấy Coupon !", 500));
  }
};

//@desc Get Coupon By Name
//@route GET /api/v1/Coupons/?name
//@access Private/Admin

const getCouponByNameCtrl = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code });
    if (!coupon) {
      res.status(403).json({
        coupon,
        status: "failed",
        message: "Mã giảm giá không hợp lệ !",
      });
    }
    res.status(201).json({
      coupon,
      status: "success",
      message: "Tìm kiếm Coupon thành công !",
    });
  } catch (error) {
    next(appError(error.message, 500));
  }
};

//@desc Update Coupon
//@route PUT /api/v1/Coupons/:id
//@access Private/Admin

const updateCouponCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    let { code, discount, endDate, startDate } = req.body;
    if (code && discount && startDate && endDate) {
      const couponFound = await Coupon.findOne({ code });
      if (!couponFound) {
        return next(appError("Coupon không tồn tại", 403));
      }
      if (isNaN(discount)) {
        return next(appError("Discount phải là số", 403));
      }
      const currentDate = getDateNow();

      if (startDate < currentDate) {
        return next(
          appError("Bạn phải nhập thời gian bắt đầu muộn hơn hiện tại", 403)
        );
      }
      if (startDate >= endDate) {
        return next(
          appError("Bạn phải nhập thời gian bắt đầu sớm hơn kết thúc", 403)
        );
      }
      if (discount <= 0 || discount > 100) {
        return next(
          appError("Bạn phải nhập giá trị discount trong khoảng từ 1-100", 403)
        );
      }

      //create Coupon
      startDate = moment(startDate, "DD/MM/YYYY");
      endDate = moment(endDate, "DD/MM/YYYY");
      const coupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        {
          code: code?.toUpperCase(),
          discount,
          startDate,
          endDate,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(201).json({
        message: "Cập nhật danh mục sản phẩm thành công !",
        status: "success",
      });
    } else {
      return next(appError("Bạn cần nhập đầy đủ thông tin sản phẩm", 403));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Delete Coupon
//@route delete /api/v1/Coupons/:id
//@access Private/Admin

const deleteCouponCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "Xóa danh mục sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

module.exports = {
  addCouponCtrl,
  getAllCouponCtrl,
  getCouponByIdCtrl,
  updateCouponCtrl,
  deleteCouponCtrl,
  getCouponByNameCtrl,
};
