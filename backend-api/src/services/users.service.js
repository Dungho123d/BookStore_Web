const db = require("../database/knex");
const jwt = require("jsonwebtoken");
async function createAccount(userData) {
  const { TEN_TAI_KHOAN, MAT_KHAU, SO_DIEN_THOAI } = userData;
  try {
    // Kiểm tra xem tài khoản đã tồn tại hay chưa
    const existingAccount = await db("tai_khoan")
      .where("TEN_TAI_KHOAN", TEN_TAI_KHOAN)
      .first();
    if (existingAccount) {
      throw new Error("Tên tài khoản đã tồn tại");
    }

    // Gán vai trò mặc định là 0
    const VAI_TRO = 0;

    // Thêm tài khoản vào cơ sở dữ liệu
    await db("tai_khoan").insert({
      TEN_TAI_KHOAN,
      MAT_KHAU,
      SO_DIEN_THOAI,
      VAI_TRO,
    });

    return true;
  } catch (err) {
    throw new Error("Lỗi khi tạo tài khoản: " + err.message);
  }
}

async function changeUserPassword(userId, oldPassword, newPassword) {
  try {
    // Tìm tài khoản người dùng dựa trên userId
    const userAccount = await db("tai_khoan")
      .where({ TEN_TAI_KHOAN: userId })
      .first();

    if (!userAccount) {
      throw new Error("Tài khoản không tồn tại");
    }

    // Kiểm tra xem mật khẩu cũ có đúng không
    if (userAccount.MAT_KHAU !== oldPassword) {
      throw new Error("Mật khẩu cũ không chính xác");
    }

    // Cập nhật mật khẩu mới
    await db("tai_khoan")
      .where({ TEN_TAI_KHOAN: userId })
      .update({ MAT_KHAU: newPassword });

    return true; // Trả về trạng thái thành công
  } catch (err) {
    throw new Error("Lỗi khi đổi mật khẩu: " + err.message);
  }
}

async function login(userData, res) {
  const { TEN_TAI_KHOAN, MAT_KHAU } = userData;

  try {
    // Kiểm tra thông tin tài khoản
    const account = await db("tai_khoan").where({ TEN_TAI_KHOAN }).first();

    if (!account) {
      throw new Error("Tài khoản không tồn tại");
    }

    // Kiểm tra mật khẩu
    if (account.MAT_KHAU !== MAT_KHAU) {
      throw new Error("Mật khẩu không chính xác");
    }

    // Tạo JWT token
    const token = jwt.sign(
      { username: account.TEN_TAI_KHOAN, role: account.VAI_TRO },
      process.env.JWT_SECRET, // Bí mật dùng để mã hóa token
      { expiresIn: "1h" } // Token hết hạn sau 1 giờ
    );
    // Đặt cookie với JWT token
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, // 1 giờ
    });
    return {
      status: "success",
      user: account,
      role: account.VAI_TRO,
    };
  } catch (err) {
    throw new Error("Lỗi khi đăng nhập: " + err.message);
  }
}

async function logout() {
  try {
    // Perform necessary actions like invalidating the session or JWT token.
    // If using a token-based approach, you might want to blacklist the token.
    // Return success status
    return true;
  } catch (error) {
    throw new Error("Lỗi khi đăng xuất: " + error.message);
  }
}

module.exports = {
  createAccount,
  changeUserPassword,
  login,
  logout,
};
