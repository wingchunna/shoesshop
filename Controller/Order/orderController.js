const Order = require("../../Model/Order/Order");
const { appError, notFound } = require("../../Middlewares/appError");
const User = require("../../Model/User/User");
const Product = require("../../Model/Product/Product");
const Coupon = require("../../Model/Coupon/Coupon");
const sortObject = require("../../Utils/sortObject");
const moment = require("moment");
const crypto = require("crypto");
const querystring = require("qs");
const axios = require("axios");
const dateFormat = require("date-format");
const https = require("https");
const fs = require("fs");
const getTokenFromHeader = require("../../Utils/getTokenFromHeader");
// const socket = require("../../server");
require("dotenv").config();

//@desc Register Order
//@route POST /api/v1/Orders/register
//@access Private/Admin

const addOrderCtrl = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    //check payload
    const { orderItems, shippingAddress, totalPrice } = req.body;
    const { coupon } = req?.query;

    const userToken = getTokenFromHeader(req);
    //find user
    const user = await User.findById(req.userAuth);

    if (!user) {
      return next(appError("Bạn cần đăng nhập để đặt hàng", 403));
    }
    //check if order is not empty
    if (orderItems?.length <= 0) {
      return next(appError("Không có sản phẩm trong giỏ hàng", 403));
    }
    if (Object.keys(shippingAddress).length === 0) {
      return next(appError("Bạn cần nhập thông tin địa chỉ", 403));
    }
    //check if user has shipping address
    if (!user?.hasShippingAddress) {
      return next(appError("Bạn chưa có địa chỉ nhận hàng", 403));
    }
    let order = null;
    let couponFound = null;
    let discount = null;
    if (coupon != "") {
      // kiểm tra coupon
      couponFound = await Coupon.findOne({
        code: coupon?.toUpperCase(),
      });
      if (couponFound?.isExpired) {
        return next(appError("Coupon đã hết hạn sử dụng", 403));
      }
      if (!couponFound) {
        return next(appError("Coupon không tồn tại", 403));
      }

      // get discount
      discount = couponFound?.discount / 100;

      //place/create order
      order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        totalPrice: couponFound
          ? totalPrice - totalPrice * discount
          : totalPrice,
      });
    } else {
      //place/create order
      order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        totalPrice: totalPrice,
      });
    }

    // push order into user
    user?.orders.push(order?._id);
    await user.save();
    //update product quantity

    // const products = await Product.findById({ _id: { $in: orderItems } });
    // lọc ra các đối tượng order item để lấy được productId của từng item. Dùng productId để tìm kiếm product tương ứng
    // nếu product tồn tại thì gán các giá trị tương ứng của order item vào product
    await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.productId.toString());

        if (product) {
          product.totalSold += item.itemBuy;
          await product.save();
        } else {
          return next(appError("Không tìm thấy sản phẩm !", 403));
        }
      })
    );

    //make payment
    const createPaymentUrl = process.env.CREATE_PAYMENT_URL;
    const getIpnUrl = process.env.GET_IPN_URL;
    const data = {
      amount: couponFound ? totalPrice - totalPrice * discount : totalPrice,
      bankCode: "NCB",
      // dùng để xác thực và tìm kiếm mã đơn hàng
      myOrderId: order?._id,
    };
    // const httpsAgent = new https.Agent({
    //   rejectUnauthorized: false, // (NOTE: this will disable client verification)
    //   cert: fs.readFileSync("./cert.pem"),
    //   key: fs.readFileSync("./key.pem"),
    // });
    // gửi tham số đến hàm create Payment để nhận về UrL điền thẻ ngân hàng của Vnpay
    axios({
      method: "post",
      url: createPaymentUrl,

      data: data,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ` + userToken,
      },
    })
      .then(function (response) {
        // console.log(response.data.vnpUrl);

        res.status(201).json({
          url: response.data.vnpUrl,
        });
      })
      .catch(function (error) {
        console.log(error.message);
      });

    // payment webhook
    //update user order
    // res.json({
    //   status: "success",
    //   message: "Đặt hàng thành công !",
    //   order,
    //   user,
    // });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Get Order by name
//@route GET /api/v1/Orders/
//@access Private/Admin

const getAllOrderCtrl = async (req, res, next) => {
  try {
    const orders = await Order.find();
    if (orders) {
      res.status(201).json({
        orders,
        status: "success",
        message: "Tìm kiếm đơn hàng thành công !",
      });
    } else {
      return next(appError("Không tìm thấy danh sách đơn hàng !", 403));
    }
  } catch (error) {
    next(appError(error.message));
  }
};

//@desc Get Order By Id
//@route GET /api/v1/Orders/:id
//@access Private/Admin

const getOrderByIdCtrl = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      next(appError("Không tìm thấy đơn hàng !", 403));
    }
    res.status(201).json({
      order,
      status: "success",
      message: "Tìm kiếm đơn hàng thành công !",
    });
  } catch (error) {
    next(appError("Không tìm thấy đơn hàng !", 500));
  }
};

//@desc Get Order By Id
//@route GET /api/v1/Orders/:id
//@access Private/Admin

const getOrderByUserCtrl = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(appError("Bạn cần đăng nhập", 401));
    }

    const orders = await Order.find({ user: req.userAuth });
    if (!orders) {
      next(appError("Không tìm thấy đơn hàng !", 403));
    }
    res.status(201).json({
      orders,
      status: "success",
      message: "Tìm kiếm đơn hàng thành công !",
    });
  } catch (error) {
    next(appError("Không tìm thấy đơn hàng !", 500));
  }
};

//@desc Update Order
//@route PUT /api/v1/Orders/:id
//@access Private/Admin

// dành riêng cho admin
const updateOrderCtrl = async (req, res, next) => {
  const status = req.body.status;
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json({
      order,
      message: "Cập nhật trạng thái đơn hàng thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Delete Order
//@route delete /api/v1/Orders/:id
//@access Private/Admin

const deleteOrderCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    const order = await Order.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "Xóa đơn hàng thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Create payment Url
//@route GET /api/v1/Orders/create_payment_url
//@access Private/Admin
const createPaymentUrlCtrl = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    let myOrderId = req.body.myOrderId;
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let vnpUrl = process.env.VNP_URL;
    let vnpReturnUrl = process.env.VNP_RETURNURL;
    let vnpVersion = process.env.VNP_VERSION;
    let vnpCommand = process.env.VNP_COMMAND;
    let secretKey = process.env.VNP_HASHSECRET;
    let vnpTmnCode = process.env.VNP_TMNCODE;
    let vnpCurrCode = process.env.CURRCODE;
    let orderId = moment(date).format("DDHHmmss");
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    let locale = req.body.language;
    if (locale === null || locale === "" || locale === undefined) {
      locale = process.env.LOCALE;
    }

    let vnp_params = {
      vnp_Version: vnpVersion,
      vnp_Command: vnpCommand,
      vnp_TmnCode: vnpTmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: vnpCurrCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: "Thanh toan cho ma GD:" + orderId,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: vnpReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode !== null && bankCode !== "") {
      vnp_params["vnp_BankCode"] = bankCode;
    }
    vnp_params = sortObject(vnp_params);
    let signData = querystring.stringify(vnp_params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
    vnp_params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_params, { encode: false });
    // update myVnpayOrderId

    const order = await Order.findByIdAndUpdate(
      myOrderId,
      {
        myVnpayOrderId: orderId,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    // console.log(order);
    await order.save();

    // gửi thông báo
    res.status(201).json({
      vnpUrl,
      message:
        "Tạo link thanh toán thành công, mời quý khách nhập số tài khoản để thanh toán",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc querydr
//@route GET /api/v1/Orders/querydr
//@access Private/Admin
const querydrCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let vnp_TmnCode = process.env.VNP_TMNCODE;
    let secretKey = process.env.VNP_HASHSECRET;
    let vnp_Api = process.env.VNP_API;

    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;

    let vnp_Version = process.env.VNP_VERSION;
    let vnp_Command = "querydr";
    let vnp_OrderInfo = "Truy van GD ma:" + vnp_TxnRef;

    let vnp_IpAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let date = new Date();
    let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");
    let vnp_RequestId = dateFormat(date, "HHmmss");
    let data =
      vnp_RequestId +
      "|" +
      vnp_Version +
      "|" +
      vnp_Command +
      "|" +
      vnp_TmnCode +
      "|" +
      vnp_TxnRef +
      "|" +
      vnp_TransactionDate +
      "|" +
      vnp_CreateDate +
      "|" +
      vnp_IpAddr +
      "|" +
      vnp_OrderInfo;

    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac
      .update(new Buffer.from(data, "utf-8"))
      .digest("hex");

    let dataObj = {
      vnp_RequestId: vnp_RequestId,
      vnp_Version: vnp_Version,
      vnp_Command: vnp_Command,
      vnp_TmnCode: vnp_TmnCode,
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate: vnp_CreateDate,
      vnp_IpAddr: vnp_IpAddr,
      vnp_SecureHash: vnp_SecureHash,
    };

    // /merchant_webapi/api/transaction

    axios({
      method: "post",
      url: vnp_Api,
      data: dataObj,
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        res.status(201).json({
          data: response.data,
          message: "Query DR thành công !",
          status: "success",
        });
      })
      .catch(function (error) {
        return next(appError(error.message, 500));
      });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc refund
//@route GET /api/v1/Orders/refund
//@access Private/Admin
const refundCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    let secretKey = process.env.VNP_HASHSECRET;

    let vnp_TmnCode = process.env.VNP_TMNCODE;
    let vnp_Api = process.env.VNP_API;
    let date = new Date();
    let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");
    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;
    let vnp_Amount = req.body.amount * 100;
    let vnp_TransactionType = req.body.transType;
    let vnp_CreateBy = req.body.user;
    let vnp_CurrCode = process.env.CURRCODE;
    let vnp_RequestId = dateFormat(date, "HHmmss");
    let vnp_Version = process.env.VNP_VERSION;
    let vnp_Command = "refund";
    let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;
    let vnp_IpAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let vnp_TransactionNo = "0";

    let data =
      vnp_RequestId +
      "|" +
      vnp_Version +
      "|" +
      vnp_Command +
      "|" +
      vnp_TmnCode +
      "|" +
      vnp_TransactionType +
      "|" +
      vnp_TxnRef +
      "|" +
      vnp_Amount +
      "|" +
      vnp_TransactionNo +
      "|" +
      vnp_TransactionDate +
      "|" +
      vnp_CreateBy +
      "|" +
      vnp_CreateDate +
      "|" +
      vnp_IpAddr +
      "|" +
      vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac
      .update(new Buffer.from(data, "utf-8"))
      .digest("hex");

    let dataObj = {
      vnp_RequestId: vnp_RequestId,
      vnp_Version: vnp_Version,
      vnp_Command: vnp_Command,
      vnp_TmnCode: vnp_TmnCode,
      vnp_TransactionType: vnp_TransactionType,
      vnp_TxnRef: vnp_TxnRef,
      vnp_Amount: vnp_Amount,
      vnp_TransactionNo: vnp_TransactionNo,
      vnp_CreateBy: vnp_CreateBy,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate: vnp_CreateDate,
      vnp_IpAddr: vnp_IpAddr,
      vnp_SecureHash: vnp_SecureHash,
    };

    axios({
      method: "post",
      url: vnp_Api,
      data: dataObj,
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        res.status(201).json({
          data: response.data,
          message: "Refund",
          status: "success",
        });
      })
      .catch(function (error) {
        return next(appError(error.message, 500));
      });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc refund
//@route GET /api/v1/Orders/refund
//@access Private/Admin
const getVNPayIpnCtrl = async (req, res, next) => {
  try {
    let vnp_params = req.query;
    let secureHash = vnp_params["vnp_SecureHash"];

    let orderId = vnp_params["vnp_TxnRef"];
    let rspCode = vnp_params["vnp_ResponseCode"];
    let secretKey = process.env.VNP_HASHSECRET;

    delete vnp_params["vnp_SecureHash"];
    // delete vnp_params["vnp_SecureHashType"];
    vnp_params = sortObject(vnp_params);

    let signData = querystring.stringify(vnp_params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    let paymentStatus = "0"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true;
    console.log("IPN");
    // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if (secureHash === signed) {
      //kiểm tra checksum
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus == "0") {
            //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
            if (rspCode == "00") {
              //thanh cong
              //paymentStatus = '1'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
              // tìm order trong database để update trạng thái và thông báo thanh toán thành công
              let order = await Order.findOneAndUpdate(
                { myVnpayOrderId: orderId },
                {
                  paymentStatus: "Paid",
                  paymentMethod: vnp_params["vnp_CardType"],
                  currency: "VND",
                  status: "processing",
                },
                {
                  new: true,
                  runValidators: true,
                }
              );
              console.log("paid");
              res.status(201).json({
                RspCode: "00",
                Message: "Bạn đã thanh toán thành công !",
                status: "success",
              });
            } else {
              //that bai
              //paymentStatus = '2'
              // Ở đây cập nhật trạng thái /giao dịch thanh toán thất bại vào CSDL của bạn
              console.log("1-paid");
              res.status(201).json({
                RspCode: "00",
                Message: "Cập nhật đơn hàng vào CSDL thất bại",
                status: "success",
              });
            }
          } else {
            res.status(201).json({
              RspCode: "02",
              Message: "Cập nhật đơn hàng thành công",
              status: "success",
            });
          }
        } else {
          console.log("unpaid");
          res.status(201).json({
            RspCode: "04",
            Message: "Số tiền không hợp lệ",
            status: "success",
          });
        }
      } else {
        console.log("không thấy đơn hàng");
        res.status(201).json({
          RspCode: "01",
          Message: "Không tìm thấy đơn hàng",
          status: "success",
        });
      }
    } else {
      console.log("mã lỗi 97");
      res
        .status(201)
        .json({ RspCode: "97", Message: "Mã xác thực lỗi", status: "success" });
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc return
//@route GET /api/v1/Orders/return
//@access Private/Admin
const getVNPayReturnCtrl = async (req, res, next) => {
  try {
    let vnp_params = req.query;
    let secureHash = vnp_params["vnp_SecureHash"];

    delete vnp_params["vnp_SecureHash"];
    delete vnp_params["vnp_SecureHashType"];
    let secretKey = process.env.VNP_HASHSECRET;
    // let vnpTmnCode = process.env.VNP_TMNCODE;

    vnp_params = sortObject(vnp_params);
    let signData = querystring.stringify(vnp_params, { encode: false });

    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
      // socket.ioObject.emit("Server-sent-data", vnp_params["vnp_ResponseCode"]);
      res.status(201).json({
        status: "success",
        code: vnp_params["vnp_ResponseCode"],
      });
      // res.redirect("https://shoesshop-frontend.vercel.app/order-success");
      //Gửi mail xác nhận đặt hàng thành công
      //server lắng nghe dữ liệu từ client
    } else {
      // socket.ioObject.emit("Server-sent-data", "97");
      res.status(201).json({
        status: "success",
        code: "97",
      });
      // res.redirect("https://shoesshop-frontend.vercel.app/order-failed");
      //server lắng nghe dữ liệu từ client

      //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc return
//@route GET /api/v1/Orders/summary
//@access Private/Admin
const getOrderStatsCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    const sumOfTotalSales = await Order.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalPrice",
          },
          minimumSale: {
            $min: "$totalPrice",
          },
          maximumSale: {
            $max: "$totalPrice",
          },
          avgSale: {
            $avg: "$totalPrice",
          },
        },
      },
    ]);
    //get the date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const saleToday = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);
    res.status(201).json({
      sumOfTotalSales,
      saleToday,
      status: "success",
      message: "Sale Dashboard !",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

module.exports = {
  addOrderCtrl,
  getAllOrderCtrl,
  getOrderByIdCtrl,
  updateOrderCtrl,
  deleteOrderCtrl,
  createPaymentUrlCtrl,
  querydrCtrl,
  refundCtrl,
  getVNPayIpnCtrl,
  getVNPayReturnCtrl,
  getOrderStatsCtrl,
  getOrderByUserCtrl,
};
