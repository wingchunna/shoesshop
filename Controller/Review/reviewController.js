const Review = require("../../Model/Review/Review");
const Product = require("../../Model/Product/Product");
const { appError, notFound } = require("../../Middlewares/appError");

//@desc Register Review
//@route POST /api/v1/Reviews/register
//@access Private/Admin

const addReviewCtrl = async (req, res, next) => {
  const { message, rating } = req.body;
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }

    //check Id format
    const productId = req.params.productId;
    if (productId.length !== 24) {
      return next(appError("Mã Id sản phẩm không đúng", 403));
    }

    //find product with ID
    const product = await Product.findById(productId).populate("reviews");
    if (!product) {
      return next(appError("Không tìm thấy sản phẩm", 403));
    }
    // check user reviewed

    const isReviewed = await product.reviews.find((review) => {
      return review.user.toString() === req.userAuth.toString();
    });

    if (isReviewed) {
      return next(appError("Bạn đã đánh giá sản phẩm này", 403));
    }
    // create review
    const review = await Review.create({
      message,
      rating,
      product: product?._id,
      user: req.userAuth,
    });
    // push review into product
    product.reviews.push(review._id);
    //save
    await product.save();
    res.status(201).json({
      review,
      status: "success",
      message: "Bạn đã đánh giá sản phẩm thành công",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Get Review by name
//@route GET /api/v1/Reviews/
//@access Private/Admin

const getAllReviewCtrl = async (req, res, next) => {
  try {
    const Reviews = await Review.find();

    res.status(201).json({
      Reviews,
      status: "success",
      message: "Tìm kiếm màu sắc sản phẩm thành công !",
    });
  } catch (error) {
    next(appError(error.message, 500));
  }
};

//@desc Get Review By Id
//@route GET /api/v1/Reviews/:id
//@access Private/Admin

const getReviewByIdCtrl = async (req, res, next) => {
  try {
    const Review = await Review.findById(req.params.id);
    if (!Review) {
      next(appError("Không tìm thấy màu sắc sản phẩm !", 403));
    }
    res.status(201).json({
      Review,
      status: "success",
      message: "Tìm kiếm màu sắc sản phẩm thành công !",
    });
  } catch (error) {
    next(appError("Không tìm thấy màu sắc sản phẩm !", 500));
  }
};

//@desc Update Review
//@route PUT /api/v1/Reviews/:id
//@access Private/Admin

const updateReviewCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    const { name } = req.body;
    const Review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json({
      message: "Cập nhật màu sắc sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Delete Review
//@route delete /api/v1/Reviews/:id
//@access Private/Admin

const deleteReviewCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 401));
    }
    const Review = await Review.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "Xóa màu sắc sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

module.exports = {
  addReviewCtrl,
  getAllReviewCtrl,
  getReviewByIdCtrl,
  updateReviewCtrl,
  deleteReviewCtrl,
};
