const Color = require("../../model/Color/Color");
const { appError, notFound } = require("../../Middlewares/appError");

//@desc Register Color
//@route POST /api/v1/Colors/register
//@access Private/Admin

const addColorCtrl = async (req, res, next) => {
  //check Color exits
  try {
    const { name } = req.body;
    console.log(name);
    if (name) {
      const colorFound = await Color.findOne({ name });
      if (colorFound) {
        return next(appError("Danh mục màu sắc sản phẩm đã tồn tại", 403));
      }
      //create Color
      const color = await Color.create({
        name,
        user: req.userAuth,
      });
      // push Color to Color
      // send response
      res.status(201).json({
        data: color,
        status: "success",
        message: "Thêm mới màu sắc sản phẩm thành công !",
      });
    } else {
      return next(appError("Bạn cần nhập đầy đủ thông tin sản phẩm", 403));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//@desc Get Color by name
//@route GET /api/v1/Colors/
//@access Private/Admin

const getAllColorCtrl = async (req, res, next) => {
  try {
    const colors = await Color.find();
    if (!colors) {
      next(appError("Không tìm thấy danh sách màu sắc", 403));
    }

    res.status(201).json({
      colors,
      status: "success",
      message: "Tìm kiếm màu sắc sản phẩm thành công !",
    });
  } catch (error) {
    next(appError(error.message, 500));
  }
};

//@desc Get Color By Id
//@route GET /api/v1/Colors/:id
//@access Private/Admin

const getColorByIdCtrl = async (req, res, next) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      next(appError("Không tìm thấy màu sắc sản phẩm !", 403));
    }
    res.status(201).json({
      color,
      status: "success",
      message: "Tìm kiếm màu sắc sản phẩm thành công !",
    });
  } catch (error) {
    next(appError("Không tìm thấy màu sắc sản phẩm !", 500));
  }
};

//@desc Update Color
//@route PUT /api/v1/Colors/:id
//@access Private/Admin

const updateColorCtrl = async (req, res, next) => {
  try {
    const { name } = req.body;
    const color = await Color.findByIdAndUpdate(
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

//@desc Delete Color
//@route delete /api/v1/Colors/:id
//@access Private/Admin

const deleteColorCtrl = async (req, res, next) => {
  try {
    const color = await color.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "Xóa màu sắc sản phẩm thành công !",
      status: "success",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

module.exports = {
  addColorCtrl,
  getAllColorCtrl,
  getColorByIdCtrl,
  updateColorCtrl,
  deleteColorCtrl,
};
