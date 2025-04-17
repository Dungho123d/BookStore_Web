const JSend = require("../jsend");
const CartsService = require("../services/carts.service");
const ApiError = require("../api-error");
// Đổi tên controller lại cho phù hợp
async function getAllCarts(req, res, next) {
  try {
    const carts = await CartsService.getAllCarts();

    // Trả về thông tin giỏ hàng
    return res.json(JSend.success({ carts }));
  } catch (error) {
    console.error("Lỗi khi lấy thông tin giỏ hàng:", error);
    return next(new ApiError(500, "Lỗi khi lấy thông tin giỏ hàng"));
  }
}
async function getCurrentUserCart(req, res, next) {
  const { userId } = req.params;

  try {
    const cart = await CartsService.getCurrentUserCart(userId);
    // Trả về kết quả với cart
    return res.status(200).json(JSend.success({ cart }));
  } catch (error) {
    console.error("Lỗi khi lấy thông tin giỏ hàng:", error);
    return next(new ApiError(500, "Lỗi khi lấy thông tin giỏ hàng"));
  }
}

async function getUserCarts(req, res, next) {
  const { userId } = req.params; // Lấy userId từ params

  try {
    const carts = await CartsService.getUserCarts(userId);

    // Trả về thông tin giỏ hàng của người dùng
    return res.json(JSend.success({ carts }));
  } catch (error) {
    console.error("Lỗi khi lấy thông tin giỏ hàng của người dùng:", error);
    return next(
      new ApiError(500, "Lỗi khi lấy thông tin giỏ hàng của người dùng")
    );
  }
}

async function getCartItems(req, res, next) {
  const { cartId } = req.params;

  try {
    const cartData = await CartsService.getCartItems(cartId);
    return res.json(
      JSend.success({
        cart: {
          MA_GIO_HANG: cartData.MA_GIO_HANG,
          TEN_TAI_KHOAN: cartData.TEN_TAI_KHOAN,
          TRANG_THAI: cartData.TRANG_THAI,
          NGAY_TAO: cartData.NGAY_TAO,
          TEN_NGUOI_NHAN: cartData.TEN_NGUOI_NHAN,
          SO_DIEN_THOAI: cartData.SO_DIEN_THOAI,
          DIA_CHI_NHAN: cartData.DIA_CHI_NHAN,
          books: cartData.books,
        },
      })
    );
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm trong giỏ hàng:", error);
    return next(new ApiError(500, "Lỗi khi lấy sản phẩm trong giỏ hàng"));
  }
}

async function addBook(req, res, next) {
  const { userId, bookId } = req.params;
  const { quantity } = req.body;

  try {
    const result = await CartsService.addBook(userId, bookId, quantity);
    return res.json(JSend.success(result));
  } catch (error) {
    console.error("Lỗi khi thêm sách vào giỏ hàng:", error);
    return next(new ApiError(500, "Lỗi khi thêm sách vào giỏ hàng"));
  }
}

async function updateBookNumber(req, res, next) {
  const { userId, bookId } = req.params;
  const { quantity } = req.body;

  try {
    // Gọi service để cập nhật số lượng sách
    const result = await CartsService.updateBookNumber(
      userId,
      bookId,
      quantity
    );
    return res.json(JSend.success(result));
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng sách trong giỏ hàng:", error);

    // Xử lý các lỗi khác nhau
    if (
      error.message === "Giỏ hàng không tồn tại" ||
      error.message === "Sách không tồn tại trong giỏ hàng"
    ) {
      return next(new ApiError(404, error.message));
    }
    if (error.message === "Số lượng sách không hợp lệ") {
      return next(new ApiError(400, error.message));
    }

    return next(
      new ApiError(500, "Lỗi khi cập nhật số lượng sách trong giỏ hàng")
    );
  }
}

async function deleteBook(req, res, next) {
  const { userId, bookId } = req.params;

  try {
    // Gọi service để xóa sách
    const result = await CartsService.deleteBook(userId, bookId);
    return res.json(JSend.success(result));
  } catch (error) {
    console.error("Lỗi khi xóa sách khỏi giỏ hàng:", error);

    // Xử lý các lỗi
    if (
      error.message === "Giỏ hàng không tồn tại" ||
      error.message === "Sách không tồn tại trong giỏ hàng"
    ) {
      return next(new ApiError(404, error.message));
    }

    return next(new ApiError(500, "Lỗi khi xóa sách khỏi giỏ hàng"));
  }
}

async function checkoutCart(req, res, next) {
  const { userId } = req.params;
  const { TEN_NGUOI_NHAN, SO_DIEN_THOAI, DIA_CHI_NHAN } = req.body;
  try {
    // Gọi service để xử lý thanh toán và tạo giỏ hàng mới
    const result = await CartsService.checkoutCart(
      userId,
      TEN_NGUOI_NHAN,
      SO_DIEN_THOAI,
      DIA_CHI_NHAN
    );
    return res.json(JSend.success(result));
  } catch (error) {
    console.error("Lỗi khi thanh toán giỏ hàng:", error);

    // Xử lý lỗi khi không tìm thấy giỏ hàng
    if (error.message === "Không tìm thấy giỏ hàng chưa thanh toán") {
      return next(new ApiError(404, error.message));
    }

    return next(new ApiError(500, "Lỗi khi thanh toán giỏ hàng"));
  }
}
async function deliverCart(req, res, next) {
  const { cartId } = req.params;

  try {
    // Gọi service để cập nhật trạng thái giỏ hàng
    const result = await CartsService.deliverCart(cartId);
    return res.json(JSend.success(result));
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái giỏ hàng:", error);

    if (error.message === "Không tìm thấy giỏ hàng") {
      return next(new ApiError(404, error.message));
    }

    return next(new ApiError(500, "Lỗi khi cập nhật trạng thái giỏ hàng"));
  }
}
module.exports = {
  getAllCarts,
  getCurrentUserCart,
  getUserCarts,
  getCartItems,
  addBook,
  updateBookNumber,
  deleteBook,
  checkoutCart,
  deliverCart,
};
