const Product = require("../../model/Product/Product");
const { appError, notFound } = require("../../Middlewares/appError");

//@desc Register Product
//@route POST /api/v1/Products/register
//@access Private/Admin

const addProductCtrl = async (req, res, next) => {
  //check Product exits
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
      message: "Product create successfully",
      data: product,
    });
  } else {
    return next(appError("Bạn cần nhập đầy đủ thông tin sản phẩm"));
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

    //await query
    const products = await productQuery;
    if (products) {
      res.json({
        status: "success",
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
  res.json({
    msg: "Get Product By ID",
  });
};

//@desc Update Product
//@route PUT /api/v1/Products/:id
//@access Private/Admin

const updateProductCtrl = async (req, res, next) => {
  res.json({
    msg: "Update Product",
  });
};

//@desc Delete Product
//@route delete /api/v1/Products/:id
//@access Private/Admin

const deleteProductCtrl = async (req, res, next) => {
  res.json({
    msg: "Delete Product",
  });
};

module.exports = {
  addProductCtrl,

  getAllProductCtrl,
  getProductByIdCtrl,
  updateProductCtrl,
  deleteProductCtrl,
};
