const db = require("../database/knex");
async function getAllCarts() {
  try {
    // Lấy tất cả giỏ hàng
    const carts = await db("gio_hang").select("*")
          .orderBy([{ column: "NGAY_TAO", order: "desc" }, { column: "TRANG_THAI", order: "asc" }]);


    // Khởi tạo một mảng để chứa kết quả cuối cùng
    const result = await Promise.all(
      carts.map(async (cart) => {
        // Lấy các sách trong giỏ hàng này và liên kết với bảng sach
        const books = await db("chi_tiet_gio_hang")
          .join("sach", "chi_tiet_gio_hang.MA_SACH", "sach.MA_SACH")
          .where({ MA_GIO_HANG: cart.MA_GIO_HANG })
          .select(
            "sach.MA_SACH",
            "sach.TEN_SACH",
            "sach.MO_TA",
            "sach.THE_LOAI",
            "sach.TAC_GIA",
            "sach.NHA_XUAT_BAN",
            "sach.ANH_BIA",
            "chi_tiet_gio_hang.SO_LUONG",
            "chi_tiet_gio_hang.GIA_MUA"
          );

        return {
          MA_GIO_HANG: cart.MA_GIO_HANG,
          TEN_TAI_KHOAN: cart.TEN_TAI_KHOAN,
          TRANG_THAI: cart.TRANG_THAI,
          NGAY_TAO: cart.NGAY_TAO,
          TEN_NGUOI_NHAN: cart.TEN_NGUOI_NHAN,
          SO_DIEN_THOAI: cart.SO_DIEN_THOAI,
          DIA_CHI_NHAN: cart.DIA_CHI_NHAN,
          books: books.map((book) => ({
            MA_SACH: book.MA_SACH,
            TEN_SACH: book.TEN_SACH,
            MO_TA: book.MO_TA,
            THE_LOAI: book.THE_LOAI,
            TAC_GIA: book.TAC_GIA,
            NHA_XUAT_BAN: book.NHA_XUAT_BAN,
            ANH_BIA: book.ANH_BIA,
            SO_LUONG: book.SO_LUONG,
            GIA_MUA: book.GIA_MUA,
          })),
        };
      })
    );

    return result; // Trả về danh sách giỏ hàng với các sách
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin giỏ hàng: " + error.message);
  }
}

async function getCurrentUserCart(userId) {
  // Lấy giỏ hàng của người dùng với trạng thái 0 (active)
  const cart = await db("gio_hang")
    .where({ TEN_TAI_KHOAN: userId, TRANG_THAI: 0 })
    .first();

  if (!cart) {
    return null; // Không tìm thấy giỏ hàng
  }

  // Lấy thông tin các sách trong giỏ hàng, kết hợp với bảng 'sach' để lấy đầy đủ thông tin sách
  const books = await db("chi_tiet_gio_hang as ctg")
    .join("sach as s", "ctg.MA_SACH", "=", "s.MA_SACH")
    .where({ MA_GIO_HANG: cart.MA_GIO_HANG })
    .select(
      "s.MA_SACH",
      "s.TEN_SACH",
      "s.MO_TA",
      "s.THE_LOAI",
      "s.TAC_GIA",
      "s.NHA_XUAT_BAN",
      "s.ANH_BIA",
      "ctg.SO_LUONG",
      "ctg.GIA_MUA"
    );

  return {
    MA_GIO_HANG: cart.MA_GIO_HANG,
    TEN_TAI_KHOAN: cart.TEN_TAI_KHOAN,
    TRANG_THAI: cart.TRANG_THAI,
    NGAY_TAO: cart.NGAY_TAO,
    TEN_NGUOI_NHAN: cart.TEN_NGUOI_NHAN,
    SO_DIEN_THOAI: cart.SO_DIEN_THOAI,
    DIA_CHI_NHAN: cart.DIA_CHI_NHAN,
    books: books.map((book) => ({
      MA_SACH: book.MA_SACH,
      TEN_SACH: book.TEN_SACH,
      MO_TA: book.MO_TA,
      THE_LOAI: book.THE_LOAI,
      TAC_GIA: book.TAC_GIA,
      NHA_XUAT_BAN: book.NHA_XUAT_BAN,
      ANH_BIA: book.ANH_BIA,
      SO_LUONG: book.SO_LUONG,
      GIA_MUA: book.GIA_MUA,
    })),
  };
}

async function getUserCarts(userId) {
  try {
    // Truy vấn để lấy thông tin giỏ hàng của người dùng
    const carts = await db("gio_hang")
      .select(
        "gio_hang.MA_GIO_HANG",
        "gio_hang.TEN_TAI_KHOAN",
        "gio_hang.TRANG_THAI",
        "gio_hang.NGAY_TAO",
        "gio_hang.TEN_NGUOI_NHAN",
        "gio_hang.SO_DIEN_THOAI",
        "gio_hang.DIA_CHI_NHAN"
      )
      .where({ "gio_hang.TEN_TAI_KHOAN": userId })
      .orderBy([{ column: "NGAY_TAO", order: "desc" }, { column: "TRANG_THAI", order: "asc" }]);


    // Nếu không có giỏ hàng nào, trả về mảng rỗng
    if (carts.length === 0) {
      return [];
    }

    // Sử dụng Promise.all để tối ưu hóa truy vấn lấy thông tin sách
    const cartsWithBooks = await Promise.all(
      carts.map(async (cart) => {
        const books = await db("chi_tiet_gio_hang as ctg")
          .join("sach as s", "ctg.MA_SACH", "=", "s.MA_SACH")
          .select(
            "s.MA_SACH",
            "s.TEN_SACH",
            "s.MO_TA",
            "s.THE_LOAI",
            "s.TAC_GIA",
            "s.NHA_XUAT_BAN",
            "s.ANH_BIA",
            "ctg.SO_LUONG",
            "ctg.GIA_MUA"
          )
          .where({ "ctg.MA_GIO_HANG": cart.MA_GIO_HANG });

        // Trả về đối tượng giỏ hàng kèm theo thông tin sách
        return {
          MA_GIO_HANG: cart.MA_GIO_HANG,
          TEN_TAI_KHOAN: cart.TEN_TAI_KHOAN,
          TRANG_THAI: cart.TRANG_THAI,
          NGAY_TAO: cart.NGAY_TAO,
          TEN_NGUOI_NHAN: cart.TEN_NGUOI_NHAN,
          SO_DIEN_THOAI: cart.SO_DIEN_THOAI,
          DIA_CHI_NHAN: cart.DIA_CHI_NHAN,
          books: books.map((book) => ({
            MA_SACH: book.MA_SACH,
            TEN_SACH: book.TEN_SACH,
            MO_TA: book.MO_TA,
            THE_LOAI: book.THE_LOAI,
            TAC_GIA: book.TAC_GIA,
            NHA_XUAT_BAN: book.NHA_XUAT_BAN,
            ANH_BIA: book.ANH_BIA,
            SO_LUONG: book.SO_LUONG,
            GIA_MUA: book.GIA_MUA,
          })),
        };
      })
    );

    return cartsWithBooks; // Trả về danh sách giỏ hàng kèm theo các sách
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy thông tin giỏ hàng của người dùng: " + error.message
    );
  }
}

async function getCartItems(cartId) {
  try {
    // Lấy thông tin giỏ hàng
    const cart = await db("gio_hang").where({ MA_GIO_HANG: cartId }).first();

    if (!cart) {
      throw new Error("Giỏ hàng không tồn tại.");
    }

    // Lấy sản phẩm trong giỏ hàng
    const cartItems = await db("chi_tiet_gio_hang as ctg")
      .join("sach as s", "ctg.MA_SACH", "=", "s.MA_SACH") // Join với bảng sách để lấy thông tin sản phẩm
      .where({ "ctg.MA_GIO_HANG": cartId })
      .select(
        "s.MA_SACH",
        "s.TEN_SACH",
        "s.MO_TA",
        "s.THE_LOAI",
        "s.TAC_GIA",
        "s.NHA_XUAT_BAN",
        "s.ANH_BIA",
        "ctg.SO_LUONG",
        "ctg.GIA_MUA"
      ); // Lấy tất cả thông tin sản phẩm và số lượng

    return {
      MA_GIO_HANG: cart.MA_GIO_HANG,
      TEN_TAI_KHOAN: cart.TEN_TAI_KHOAN,
      TRANG_THAI: cart.TRANG_THAI,
      NGAY_TAO: cart.NGAY_TAO,
      TEN_NGUOI_NHAN: cart.TEN_NGUOI_NHAN,
      SO_DIEN_THOAI: cart.SO_DIEN_THOAI,
      DIA_CHI_NHAN: cart.DIA_CHI_NHAN,
      books: cartItems.map((item) => ({
        MA_SACH: item.MA_SACH,
        TEN_SACH: item.TEN_SACH,
        MO_TA: item.MO_TA,
        THE_LOAI: item.THE_LOAI,
        TAC_GIA: item.TAC_GIA,
        NHA_XUAT_BAN: item.NHA_XUAT_BAN,
        ANH_BIA: item.ANH_BIA,
        SO_LUONG: item.SO_LUONG,
        GIA_MUA: item.GIA_MUA,
      })),
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy sản phẩm trong giỏ hàng: " + error.message);
  }
}

async function addBook(userId, bookId, quantity) {
  // Kiểm tra xem người dùng có giỏ hàng đang hoạt động không
  const existingCart = await db("gio_hang")
    .where({ TEN_TAI_KHOAN: userId, TRANG_THAI: 0 })
    .first();

  // Lấy giá bán của sách từ bảng SACH
  const book = await db("sach").where({ MA_SACH: bookId }).first();
  if (!book) {
    throw new Error("Sách không tồn tại");
  }

  const price = book.GIA_BAN; // Lấy giá bán của sách

  if (existingCart) {
    // Nếu có giỏ hàng đang hoạt động, thêm sách vào giỏ hàng đó
    const cartId = existingCart.MA_GIO_HANG;

    // Thêm sách vào giỏ hàng
    await db("chi_tiet_gio_hang").insert({
      MA_GIO_HANG: cartId,
      MA_SACH: bookId,
      SO_LUONG: quantity, // Số lượng sách từ request
      GIA_MUA: price, // Sử dụng giá hiện tại
    });

    return null;
  } else {
    // Nếu không có giỏ hàng, tạo giỏ hàng mới
    const newCartId = generateCartId(); // Tạo ID ngẫu nhiên cho giỏ hàng

    // Tạo giỏ hàng mới
    await db("gio_hang").insert({
      MA_GIO_HANG: newCartId,
      TEN_TAI_KHOAN: userId,
      TRANG_THAI: 0,
      NGAY_TAO: new Date(),
      TEN_NGUOI_NHAN: null,
      SO_DIEN_THOAI: null,
      DIA_CHI_NHAN: null,
    });

    // Thêm sách vào giỏ hàng mới
    await db("chi_tiet_gio_hang").insert({
      MA_GIO_HANG: newCartId,
      MA_SACH: bookId,
      SO_LUONG: quantity, // Số lượng sách từ request
      GIA_MUA: price, // Sử dụng giá hiện tại
    });

    return null;
  }
}

function generateCartId() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let cartId = "GH";
  const cartIdLength = 10; // Độ dài của mã giỏ hàng

  for (let i = 0; i < cartIdLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    cartId += chars[randomIndex];
  }

  return cartId;
}

async function updateBookNumber(userId, bookId, quantity) {
  // Kiểm tra xem người dùng có giỏ hàng chưa thanh toán không
  const existingCart = await db("gio_hang")
    .where({ TEN_TAI_KHOAN: userId, TRANG_THAI: 0 })
    .first();

  if (!existingCart) {
    throw new Error("Giỏ hàng không tồn tại");
  }

  const cartId = existingCart.MA_GIO_HANG;

  // Kiểm tra xem sách có trong giỏ hàng hay không
  const bookInCart = await db("chi_tiet_gio_hang")
    .where({ MA_GIO_HANG: cartId, MA_SACH: bookId })
    .first();

  if (!bookInCart) {
    throw new Error("Sách không tồn tại trong giỏ hàng");
  }

  // Kiểm tra số lượng hợp lệ
  if (quantity <= 0) {
    throw new Error("Số lượng sách không hợp lệ");
  }

  // Cập nhật số lượng sách trong giỏ hàng
  await db("chi_tiet_gio_hang")
    .where({ MA_GIO_HANG: cartId, MA_SACH: bookId })
    .update({ SO_LUONG: quantity });

  return null;
}

async function deleteBook(userId, bookId) {
  // Kiểm tra xem người dùng có giỏ hàng chưa thanh toán không
  const existingCart = await db("gio_hang")
    .where({ TEN_TAI_KHOAN: userId, TRANG_THAI: 0 })
    .first();

  if (!existingCart) {
    throw new Error("Giỏ hàng không tồn tại");
  }

  const cartId = existingCart.MA_GIO_HANG;

  // Kiểm tra xem sách có trong giỏ hàng không
  const bookInCart = await db("chi_tiet_gio_hang")
    .where({ MA_GIO_HANG: cartId, MA_SACH: bookId })
    .first();

  if (!bookInCart) {
    throw new Error("Sách không tồn tại trong giỏ hàng");
  }

  // Xóa sách khỏi giỏ hàng
  await db("chi_tiet_gio_hang")
    .where({ MA_GIO_HANG: cartId, MA_SACH: bookId })
    .del();

  return null;
}
async function checkoutCart(
  userId,
  receiverName,
  phoneNumber,
  deliveryAddress
) {
  // Kiểm tra xem người dùng có giỏ hàng chưa thanh toán không
  const existingCart = await db("gio_hang")
    .where({ TEN_TAI_KHOAN: userId, TRANG_THAI: 0 })
    .first();

  if (!existingCart) {
    throw new Error("Không tìm thấy giỏ hàng chưa thanh toán");
  }

  // Cập nhật trạng thái giỏ hàng thành đã thanh toán (1) và thông tin người nhận
  await db("gio_hang").where({ MA_GIO_HANG: existingCart.MA_GIO_HANG }).update({
    TRANG_THAI: 1,
    TEN_NGUOI_NHAN: receiverName, // Cập nhật tên người nhận
    SO_DIEN_THOAI: phoneNumber, // Cập nhật số điện thoại
    DIA_CHI_NHAN: deliveryAddress, // Cập nhật địa chỉ giao hàng
  });

  // Tạo một giỏ hàng mới, rỗng cho người dùng
  const newCartId = generateCartId(); // Hàm tạo mã giỏ hàng ngẫu nhiên

  await db("gio_hang").insert({
    MA_GIO_HANG: newCartId,
    TEN_TAI_KHOAN: userId,
    TRANG_THAI: 0, // Trạng thái chưa thanh toán
    NGAY_TAO: new Date(),
    TEN_NGUOI_NHAN: null, // Ban đầu để trống
    SO_DIEN_THOAI: null, // Ban đầu để trống
    DIA_CHI_NHAN: null, // Ban đầu để trống
  });

  return null;
}
async function deliverCart(cartId) {
  // Kiểm tra xem giỏ hàng có tồn tại và trạng thái hiện tại là 1 không
  const cart = await db("gio_hang")
    .where({ MA_GIO_HANG: cartId, TRANG_THAI: 1 })
    .first();

  if (!cart) {
    throw new Error(
      "Không tìm thấy giỏ hàng hoặc giỏ hàng không trong trạng thái chờ giao hàng"
    );
  }

  // Cập nhật trạng thái giỏ hàng thành 2 (giao hàng thành công)
  await db("gio_hang").where({ MA_GIO_HANG: cartId }).update({
    TRANG_THAI: 2, // Trạng thái "đã giao hàng thành công"
  });

  return null;
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
