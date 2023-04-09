const Order = require("../../model/Order/Order");
const { appError, notFound } = require("../../Middlewares/appError");
const User = require("../../model/User/User");
const Product = require("../../model/Product/Product");
//@desc Register Order
//@route POST /api/v1/Orders/register
//@access Private/Admin

const addOrderCtrl = async (req, res, next) => {
  try {
    //check payload
    const { orderItems, shippingAddress, totalPrice } = req.body;

    //find user
    const user = await User.findById(req.userAuth);

    //check if order is not empty
    if (orderItems?.length <= 0) {
      return next(appError("Không có sản phẩm trong giỏ hàng"));
    }
    if (Object.keys(shippingAddress).length === 0) {
      return next(appError("Bạn cần nhập thông tin địa chỉ"));
    }
    //place/create order
    const order = await Order.create({
      user: user?._id,
      orderItems,
      shippingAddress,
      totalPrice,
    });
    // push order into user
    user.orders.push(order?._id);
    await user.save();
    //update product quantity

    // let productIds = await Promise.all(
    //   orderItems.map(async (item) => await item.productId.toString())
    // );
    // let products = await Promise.all(
    //   productIds.map(async (id) => await Product.findById(id))
    // );
    // console.log(products);
    // const products = await Product.findById({ _id: { $in: orderItems } });
    // lọc ra các đối tượng order item để lấy được productId của từng item. Dùng productId để tìm kiếm product tương ứng
    // nếu product tồn tại thì gán các giá trị tương ứng của order item vào product
    await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.productId.toString());

        if (product) {
          product.totalSold += item.itemBuy;
          await product.save();
        }
      })
    );

    // await Promise.all(
    //   orderItems?.map(async (order) => {
    //     const product = await products.find((productID) => {
    //       console.log(productID._id + "   aaaaaaaaaaa");
    //       // return productID?._id === order.productId;
    //     });
    //     //   console.log(order.productId);
    //   })
    // );

    //make payment
    // payment webhook
    //update user order
  } catch (error) {
    return next(appError(error.message));
  }
};

//@desc Get Order by name
//@route GET /api/v1/Orders/
//@access Private/Admin

const getAllOrderCtrl = async (req, res, next) => {
  try {
    const orders = await Order.find();

    res.json({
      orders,
      status: "success",
      message: "Tìm kiếm màu sắc sản phẩm thành công !",
    });
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
      next(appError("Không tìm thấy màu sắc sản phẩm !"));
    }
    res.json({
      order,
      status: "success",
      message: "Tìm kiếm màu sắc sản phẩm thành công !",
    });
  } catch (error) {
    next(appError("Không tìm thấy màu sắc sản phẩm !"));
  }
};

//@desc Update Order
//@route PUT /api/v1/Orders/:id
//@access Private/Admin

const updateOrderCtrl = async (req, res, next) => {
  try {
    const { name } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json({
      message: "Cập nhật màu sắc sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message));
  }
};

//@desc Delete Order
//@route delete /api/v1/Orders/:id
//@access Private/Admin

const deleteOrderCtrl = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    res.json({
      message: "Xóa màu sắc sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message));
  }
};

module.exports = {
  addOrderCtrl,
  getAllOrderCtrl,
  getOrderByIdCtrl,
  updateOrderCtrl,
  deleteOrderCtrl,
};
