const Brand = require("../../Model/Brand/Brand");
const { appError, notFound } = require("../../Middlewares/appError");

//@desc Register Brand
//@route POST /api/v1/Brands/register
//@access Private/Admin

const addBrandCtrl = async (req, res, next) => {
  //check Brand exits
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 403));
    }
    const { name, user, product, image } = req.body;
    if (name) {
      const brandFound = await Brand.findOne({ name });
      if (brandFound) {
        return next(appError("Nhãn hàng đã tồn tại", 403));
      }
      if (!req.file) {
        return next(appError("Bạn cần upload hình ảnh", 403));
      }
      //create Brand
      const brand = await Brand.create({
        name,
        user: req.userAuth,
        images: req?.file?.path,
      });

      // push Product to Brand
      // send response
      res.status(201).json({
        brand,
        status: "success",
        message: "Thêm mới nhãn hàng thành công !",
      });
    } else {
      return next(appError("Bạn cần nhập đầy đủ thông tin nhãn hàng", 403));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Get Brand by name
//@route GET /api/v1/Brands/
//@access Private/Admin

const getAllBrandCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 403));
    }
    const brands = await Brand.find();
    if (!brands) {
      return next(appError("Không tìm thấy danh sách nhãn hàng", 403));
    }

    res.status(201).json({
      brands,
      status: "success",
      message: "Tìm kiếm danh mục nhãn hàng thành công !",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Get Brand By Id
//@route GET /api/v1/Brands/:id
//@access Private/Admin

const getBrandByIdCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 403));
    }
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      next(appError("Không tìm thấy nhãn hàng !", 403));
    }
    res.status(201).json({
      brand,
      status: "success",
      message: "Tìm kiếm nhãn hàng thành công !",
    });
  } catch (error) {
    next(appError(error.message, 500));
  }
};

//@desc Update Brand
//@route PUT /api/v1/Brands/:id
//@access Private/Admin

const updateBrandCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 403));
    }
    const { name } = req.body;
    if (!req.file) {
      return next(appError("Bạn cần upload hình ảnh", 403));
    }
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name,
        images: req?.file?.path,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json({
      message: "Cập nhật nhãn hàng thành công !",
      status: "success",
      brand,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Delete Brand
//@route delete /api/v1/Brands/:id
//@access Private/Admin

const deleteBrandCtrl = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      return next(appError("Bạn cần đăng nhập", 403));
    }
    const brand = await Brand.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "Xóa nhãn hàng thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

module.exports = {
  addBrandCtrl,
  getAllBrandCtrl,
  getBrandByIdCtrl,
  updateBrandCtrl,
  deleteBrandCtrl,
};
