const Category = require("../../model/Category/Category");
const { appError, notFound } = require("../../Middlewares/appError");

//@desc Register Category
//@route POST /api/v1/Categorys/register
//@access Private/Admin

const addCategoryCtrl = async (req, res, next) => {
  //check Category exits
  try {
    const { name, user, product } = req.body;
    if (name) {
      const categoryFound = await Category.findOne({ name });
      if (categoryFound) {
        return next(appError("Danh mục sản phẩm đã tồn tại"));
      }
      //create Category
      const category = await Category.create({
        name,
        user: req.userAuth,
      });
      // push Product to Category
      // send response
      res.json({
        data: category,
        status: "success",
        message: "Thêm mới danh mục sản phẩm thành công !",
      });
    } else {
      return next(appError("Bạn cần nhập đầy đủ thông tin sản phẩm"));
    }
  } catch (error) {
    return next(appError(error.message));
  }
};

//@desc Get Category by name
//@route GET /api/v1/Categorys/
//@access Private/Admin

const getAllCategoryCtrl = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.json({
      categories,
      status: "success",
      message: "Tìm kiếm danh mục sản phẩm thành công !",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

//@desc Get Category By Id
//@route GET /api/v1/Categorys/:id
//@access Private/Admin

const getCategoryByIdCtrl = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      next(appError("Không tìm thấy sản phẩm !"));
    }
    res.json({
      category,
      status: "success",
      message: "Tìm kiếm sản phẩm thành công !",
    });
  } catch (error) {
    next(appError("Không tìm thấy sản phẩm !"));
  }
};

//@desc Update Category
//@route PUT /api/v1/Categorys/:id
//@access Private/Admin

const updateCategoryCtrl = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
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
      message: "Cập nhật danh mục sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message));
  }
};

//@desc Delete Category
//@route delete /api/v1/Categorys/:id
//@access Private/Admin

const deleteCategoryCtrl = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    res.json({
      message: "Xóa danh mục sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message));
  }
};

module.exports = {
  addCategoryCtrl,
  getAllCategoryCtrl,
  getCategoryByIdCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
};
