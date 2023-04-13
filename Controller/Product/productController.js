const Product = require("../../model/Product/Product");
const Category = require("../../model/Category/Category");
const Brand = require("../../model/Brand/Brand");
const { appError, notFound } = require("../../Middlewares/appError");

//@desc Register Product
//@route POST /api/v1/Products/register
//@access Private/Admin

const addProductCtrl = async (req, res, next) => {
  //check Product exits
  try {
    const {
      name,
      description,
      category,
      sizes,
      colors,
      images,
      user,
      brand,
      price,
      totalQuantity,
    } = req.body;
    if (
      name &&
      description &&
      category &&
      sizes &&
      colors &&
      price &&
      totalQuantity &&
      brand &&
      images
    ) {
      // find Product
      const productFound = await Product.findOne({ name });
      if (productFound) {
        return next(appError("Sản phẩm đã tồn tại", 403));
      }
      // find Category
      const categoryFound = await Category.findOne({
        name: category,
      });
      if (!categoryFound) {
        return next(appError("Không tìm thấy danh mục sản phẩm", 403));
      }
      // find Brand
      const brandFound = await Brand.findOne({
        name: brand,
      });
      if (!brandFound) {
        return next(appError("Không tìm thấy nhãn hàng", 403));
      }
      //find Color

      //create product
      const product = await Product.create({
        name,
        description,
        category: categoryFound._id,
        sizes,
        colors,
        brand: brandFound._id,
        price,
        totalQuantity,
        user: req.userAuth,
        images: images?.path,
      });

      // push product  to brand
      brandFound.products.push(product._id);

      // push product to category
      categoryFound.products.push(product._id);
      // resave
      await brandFound.save();
      await categoryFound.save();

      // send response
      res.status(201).json({
        product,
        status: "success",
        message: "Thêm mới sản phẩm thành công !",
      });
    } else {
      return next(appError("Bạn cần nhập đầy đủ thông tin sản phẩm", 403));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Get product by name
//@route GET /api/v1/Products/
//@access Private/Admin

const getAllProductCtrl = async (req, res, next) => {
  try {
    let productQuery = Product.find();

    if (req.query.name) {
      productQuery = productQuery.find({
        name: { $regex: req.query.name, $options: "i" },
      });
    }
    if (req.query.brand) {
      productQuery = productQuery.find({
        brand: { $regex: req.query.brand, $options: "i" },
      });
    }
    if (req.query.colors) {
      productQuery = productQuery.find({
        colors: { $regex: req.query.colors, $options: "i" },
      });
    }

    if (req.query.category) {
      productQuery = productQuery.find({
        category: { $regex: req.query.category, $options: "i" },
      });
    }
    if (req.query.price) {
      const priceRange = req.query.price.split("-");
      productQuery = productQuery.find({
        price: { $gte: priceRange[0], $lte: priceRange[1] },
      });
    }

    //paging
    //page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    //limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    //startIndex
    const startIndex = (page - 1) * limit;
    //endIndex
    const endIndex = page * limit;
    //total
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit);

    //pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    //await query
    const products = await productQuery
      .populate("brand")
      .populate("reviews")
      .populate("category");

    if (products) {
      res.status(201).json({
        products: products,
        result: products?.length,
        pagination,
        total,
        message: "Tìm kiếm sản phẩm thành công !",
        status: "success",
      });
    }
  } catch (error) {
    next(appError(error.message, 500));
  }
};

//@desc Get Product By Id
//@route GET /api/v1/Products/:id
//@access Private/Admin

const getProductByIdCtrl = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      next(appError("Không tìm thấy sản phẩm !", 403));
    }
    res.status(201).json({
      product,
      status: "success",
      message: "Tìm kiếm sản phẩm thành công !",
    });
  } catch (error) {
    next(appError("Không tìm thấy sản phẩm !", 500));
  }
};

//@desc Update Product
//@route PUT /api/v1/Products/:id
//@access Private/Admin

const updateProductCtrl = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      brand,
      price,
      totalQuality,
      images,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        sizes,
        colors,
        user,
        brand,
        price,
        totalQuality,
        images: images?.path,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json({
      message: "Cập nhật sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Delete Product
//@route delete /api/v1/Products/:id
//@access Private/Admin

const deleteProductCtrl = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(appError("Sản phẩm không tồn tại", 403));
    }
    res.status(201).json({
      message: "Xóa sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Update Product Image
//@route PUT /api/v1/Products/:id
//@access Private/Admin

// //upload Photo
// const uploadPhotoProductCtrl = async (req, res, next) => {
//   try {
//     //find the product to be update
//     const product = await Product.findById(req.params.id);
//     // check if product is found
//     if (!product) {
//       return next(appError("Sản phẩm không tồn tại !", 403));
//     }

//     // check if product is updating their photo
//     if (req.files) {
//       // update profile photo
//       await Product.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: {
//             images: req.files?.path,
//           },
//         },
//         {
//           new: true,
//           runValidators: true,
//         }
//       );
//       await res.status(201).json({
//         status: "success",
//         message: "Cập nhật avatar thành công !",
//       });
//     } else {
//       return next(appError("file không tồn tại", 403));
//     }
//   } catch (error) {
//     next(appError(error.message, 500));
//   }
// };

module.exports = {
  addProductCtrl,
  getAllProductCtrl,
  getProductByIdCtrl,
  updateProductCtrl,
  deleteProductCtrl,
};
