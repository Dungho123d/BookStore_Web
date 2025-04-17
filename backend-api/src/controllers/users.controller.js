const JSend = require("../jsend");
const UsersService = require("../services/users.service");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
// Đổi tên controller lại cho phù hợp
async function createAccount(req, res, next) {
  const { phoneNumber, username, password, confirmPassword } = req.body;

  try {
    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json(JSend.fail("Mật khẩu và xác nhận mật khẩu không khớp"));
    }

    // Gọi service để tạo tài khoản
    await UsersService.createAccount({
      TEN_TAI_KHOAN: username,
      MAT_KHAU: password,
      SO_DIEN_THOAI: phoneNumber,
    });

    // Trả về kết quả thành công
    return res.status(201).json(
      JSend.success({
        message: `Tài khoản ${username} đã được tạo thành công!`,
      })
    );
  } catch (error) {
    console.error("Lỗi khi tạo tài khoản:", error);
    if (error.message === "Lỗi khi tạo tài khoản: Tên tài khoản đã tồn tại") {
      return res.status(409).json(JSend.fail("Tên tài khoản đã tồn tại"));
    }
    return next(new ApiError(500, "Lỗi khi tạo tài khoản"));
  }
}

async function changeUserPassword(req, res, next) {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const { userId } = req.params;

  try {
    // Kiểm tra xem mật khẩu mới và xác nhận có khớp không
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json(JSend.fail("Mật khẩu mới và xác nhận mật khẩu không khớp"));
    }

    // Gọi service để đổi mật khẩu
    const passwordChanged = await UsersService.changeUserPassword(
      userId,
      oldPassword,
      newPassword
    );

    if (passwordChanged) {
      return res
        .status(200)
        .json(JSend.success({ message: "Đổi mật khẩu thành công!" }));
    } else {
      throw new Error("Không thể đổi mật khẩu");
    }
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    if (error.message === "Lỗi khi đổi mật khẩu: Tài khoản không tồn tại") {
      return res.status(404).json(JSend.fail("Tài khoản không tồn tại"));
    }
    if (error.message === "Lỗi khi đổi mật khẩu: Mật khẩu cũ không chính xác") {
      return res.status(401).json(JSend.fail("Mật khẩu cũ không chính xác"));
    }
    return next(new ApiError(500, "Lỗi khi đổi mật khẩu"));
  }
}

async function login(req, res, next) {
  const { username, password } = req.body;

  try {
    // Gọi service để kiểm tra tài khoản
    const result = await UsersService.login({
      TEN_TAI_KHOAN: username,
      MAT_KHAU: password,
    }, res);

    // Trả về thông tin tài khoản và vai trò cho frontend
    return res.status(200).json(
      JSend.success({
        username: result.user.TEN_TAI_KHOAN,
        role: result.user.VAI_TRO,
      })
    );
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    // Phân loại lỗi và trả về mã lỗi tương ứng
    if (error.message === "Lỗi khi đăng nhập: Tài khoản không tồn tại") {
      return res.status(404).json(JSend.fail("Tài khoản không tồn tại"));
    }
    if (error.message === "Lỗi khi đăng nhập: Mật khẩu không chính xác") {
      return res.status(400).json(JSend.fail("Mật khẩu không chính xác"));
    }
    return next(new ApiError(500, "Lỗi khi đăng nhập. Vui lòng thử lại sau."));
  }
}

async function logout(req, res, next) {
  try {
    await UsersService.logout();
    return res
      .status(200)
      .json(JSend.success({ message: "Đăng xuất thành công!" }));
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    return next(new ApiError(500, "Lỗi khi đăng xuất"));
  }
}

module.exports = {
  createAccount,
  changeUserPassword,
  login,
  logout,
};
