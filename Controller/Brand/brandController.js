const Brand = require("../../model/Brand/Brand");
const { appError, notFound } = require("../../Middlewares/appError");

//@desc Register Brand
//@route POST /api/v1/Brands/register
//@access Private/Admin

const addBrandCtrl = async (req, res, next) => {
  //check Brand exits
  try {
    const { name, user, product } = req.body;
    if (name) {
      const brandFound = await Brand.findOne({ name });
      if (brandFound) {
        return next(appError("Nhãn hàng đã tồn tại"));
      }
      //create Brand
      const brand = await Brand.create({
        name,
        user: req.userAuth,
      });
      // push Product to Brand
      // send response
      res.json({
        brand,
        status: "success",
        message: "Thêm mới nhãn hàng thành công !",
      });
    } else {
      return next(appError("Bạn cần nhập đầy đủ thông tin nhãn hàng"));
    }
  } catch (error) {
    return next(appError(error.message));
  }
};

//@desc Get Brand by name
//@route GET /api/v1/Brands/
//@access Private/Admin

const getAllBrandCtrl = async (req, res, next) => {
  try {
    const brands = await Brand.find();

    res.json({
      brands,
      status: "success",
      message: "Tìm kiếm danh mục nhãn hàng thành công !",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

//@desc Get Brand By Id
//@route GET /api/v1/Brands/:id
//@access Private/Admin

const getBrandByIdCtrl = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      next(appError("Không tìm thấy nhãn hàng !"));
    }
    res.json({
      brand,
      status: "success",
      message: "Tìm kiếm nhãn hàng thành công !",
    });
  } catch (error) {
    next(appError("Không tìm thấy nhãn hàng !"));
  }
};

//@desc Update Brand
//@route PUT /api/v1/Brands/:id
//@access Private/Admin

const updateBrandCtrl = async (req, res, next) => {
  try {
    const { name } = req.body;
    const brand = await Brand.findByIdAndUpdate(
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
      message: "Cập nhật nhãn hàng thành công !",
      status: "success",
      brand,
    });
  } catch (error) {
    return next(appError(error.message));
  }
};

//@desc Delete Brand
//@route delete /api/v1/Brands/:id
//@access Private/Admin

const deleteBrandCtrl = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    res.json({
      message: "Xóa nhãn hàng thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message));
  }
};

module.exports = {
  addBrandCtrl,
  getAllBrandCtrl,
  getBrandByIdCtrl,
  updateBrandCtrl,
  deleteBrandCtrl,
};
