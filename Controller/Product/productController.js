const Product = require("../../model/Product/Product");
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
      user,
      brand,
      price,
      totalQuality,
    } = req.body;
    if (name && description && sizes && colors && price && totalQuality) {
      const productFound = await Product.findOne({ name });
      if (productFound) {
        return next(appError("Sản phẩm đã tồn tại"));
      }
      //create product
      const product = await Product.create({
        name,
        description,

        sizes,
        colors,
        user,
        brand,
        price,
        totalQuality,
        user: req.userAuth,
      });
      // push product to category
      // send response
      res.json({
        status: "success",
        message: "Thêm mới sản phẩm thành công !",
        data: product,
      });
    } else {
      return next(appError("Bạn cần nhập đầy đủ thông tin sản phẩm"));
    }
  } catch (error) {
    return next(appError(error.message));
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
    const products = await productQuery;
    if (products) {
      res.json({
        status: "success",
        total,
        result: products.length,
        pagination,
        message: "Tìm kiếm sản phẩm thành công !",
        products: products,
      });
    }
  } catch (error) {
    next(appError(error.message));
  }
};

//@desc Get Product By Id
//@route GET /api/v1/Products/:id
//@access Private/Admin

const getProductByIdCtrl = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      next(appError("Không tìm thấy sản phẩm !"));
    }
    res.json({
      product,
      status: "success",
      message: "Tìm kiếm sản phẩm thành công !",
    });
  } catch (error) {
    next(appError("Không tìm thấy sản phẩm !"));
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
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json({
      message: "Cập nhật sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {}
};

//@desc Delete Product
//@route delete /api/v1/Products/:id
//@access Private/Admin

const deleteProductCtrl = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({
      message: "Xóa sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message));
  }
};

module.exports = {
  addProductCtrl,

  getAllProductCtrl,
  getProductByIdCtrl,
  updateProductCtrl,
  deleteProductCtrl,
};
