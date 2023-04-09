const Review = require("../../model/Review/Review");
const Product = require("../../model/Product/Product");
const { appError, notFound } = require("../../Middlewares/appError");

//@desc Register Review
//@route POST /api/v1/Reviews/register
//@access Private/Admin

const addReviewCtrl = async (req, res, next) => {
  const { message, rating } = req.body;
  try {
    //check Id format
    const productId = req.params.productId;
    if (productId.length !== 24) {
      return next(appError("Mã Id sản phẩm không đúng"));
    }

    //find product with ID
    const product = await Product.findById(productId).populate("reviews");
    if (!product) {
      return next(appError("Không tìm thấy sản phẩm"));
    }
    // check user reviewed

    const isReviewed = await product.reviews.find((review) => {
      return review.user.toString() === req.userAuth.toString();
    });

    if (isReviewed) {
      return next(appError("Bạn đã đánh giá sản phẩm này"));
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
    return next(appError(error.message));
  }
};

//@desc Get Review by name
//@route GET /api/v1/Reviews/
//@access Private/Admin

const getAllReviewCtrl = async (req, res, next) => {
  try {
    const Reviews = await Review.find();

    res.json({
      Reviews,
      status: "success",
      message: "Tìm kiếm màu sắc sản phẩm thành công !",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

//@desc Get Review By Id
//@route GET /api/v1/Reviews/:id
//@access Private/Admin

const getReviewByIdCtrl = async (req, res, next) => {
  try {
    const Review = await Review.findById(req.params.id);
    if (!Review) {
      next(appError("Không tìm thấy màu sắc sản phẩm !"));
    }
    res.json({
      Review,
      status: "success",
      message: "Tìm kiếm màu sắc sản phẩm thành công !",
    });
  } catch (error) {
    next(appError("Không tìm thấy màu sắc sản phẩm !"));
  }
};

//@desc Update Review
//@route PUT /api/v1/Reviews/:id
//@access Private/Admin

const updateReviewCtrl = async (req, res, next) => {
  try {
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
    res.json({
      message: "Cập nhật màu sắc sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message));
  }
};

//@desc Delete Review
//@route delete /api/v1/Reviews/:id
//@access Private/Admin

const deleteReviewCtrl = async (req, res, next) => {
  try {
    const Review = await Review.findByIdAndDelete(req.params.id);
    res.json({
      message: "Xóa màu sắc sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message));
  }
};

module.exports = {
  addReviewCtrl,
  getAllReviewCtrl,
  getReviewByIdCtrl,
  updateReviewCtrl,
  deleteReviewCtrl,
};
