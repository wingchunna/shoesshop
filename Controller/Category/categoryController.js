const Category = require("../../Model/Category/Category");
const { appError, notFound } = require("../../Middlewares/appError");

//@desc Register Category
//@route POST /api/v1/Categorys/register
//@access Private/Admin

const addCategoryCtrl = async (req, res, next) => {
  //check Category exits
  const { name, user, product } = req.body;
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 403));
    }

    if (name) {
      const categoryFound = await Category.findOne({ name });
      if (categoryFound) {
        return next(appError("Danh mục sản phẩm đã tồn tại !", 403));
      }
      if (!req.file) {
        return next(appError("Bạn cần upload hình ảnh !", 403));
      }
      //create Category
      const category = await Category.create({
        name,
        user: req.userAuth,
        image: req?.file?.path,
      });
      // push Product to Category
      // send response
      res.status(201).json({
        data: category,
        status: "success",
        message: "Thêm mới danh mục sản phẩm thành công !",
      });
    } else {
      return next(appError("Bạn cần nhập đầy đủ thông tin !", 403));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Get Category by name
//@route GET /api/v1/Categorys/
//@access Private/Admin

const getAllCategoryCtrl = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return next(appError("Không tìm thấy danh sách danh mục", 403));
    }
    res.status(201).json({
      categories,
      status: "success",
      message: "Tìm kiếm danh mục sản phẩm thành công !",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Get Category By Id
//@route GET /api/v1/Categorys/:id
//@access Private/Admin

const getCategoryByIdCtrl = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      next(appError("Không tìm thấy danh mục !", 403));
    }
    res.status(201).json({
      category,
      status: "success",
      message: "Tìm kiếm danh mục thành công !",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Update Category
//@route PUT /api/v1/Categorys/:id
//@access Private/Admin

const updateCategoryCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 403));
    }
    const { name } = req.body;
    if (!req.file) {
      return next(appError("Bạn cần upload hình ảnh !", 403));
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        image: req.file?.path,
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
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Delete Category
//@route delete /api/v1/Categorys/:id
//@access Private/Admin

const deleteCategoryCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 403));
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "Xóa danh mục sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Upload Category Image
//@route Upload /api/v1/Categorys/category-photo-upload/:id
//@access Private/Admin

// const uploadPhotoCategoryCtrl = async (req, res, next) => {
//   try { if (!req.session.authorized) {
//   return next(appError("Bạn cần đăng nhập", 403));
// }
//     const category = await Category.findById(req.params.id);
//     // check if product is found
//     if (!category) {
//       return next(appError("Danh mục sản phẩm không tồn tại !", 403));
//     }
//     // check if category is updating their photo
//     if (req.file) {
//       // update profile photo
//       await Category.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: {
//             images: req.file.path,
//           },
//         },
//         {
//           new: true,
//           runValidators: true,
//         }
//       );

//       res.status(201).json({
//         message: "Upload ảnh danh mục sản phẩm thành công !",
//         status: "success",
//       });
//     } else {
//       return next(appError("file không tồn tại", 403));
//     }
//   } catch (error) {
//     return next(appError(error.message, 500));
//   }
// };

module.exports = {
  addCategoryCtrl,
  getAllCategoryCtrl,
  getCategoryByIdCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
};
