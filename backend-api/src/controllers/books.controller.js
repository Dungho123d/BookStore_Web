const JSend = require("../jsend");
const BooksService = require("../services/books.service");
const ApiError = require("../api-error");

async function getBooksFiltered(req, res, next) {
  try {
    const filters = {
      searchTerm: req.query.searchTerm || "", // Chuỗi tìm kiếm
      theLoai: req.query.theLoai || "", // Thể loại
      page: parseInt(req.query.page, 10) || 1, // Trang hiện tại
      limit: parseInt(req.query.limit, 10) || 20, // Số sách mỗi trang (mặc định 20)
    };

    const { books, totalPages, currentPage } =
      await BooksService.getBooksFiltered(filters);

    // Trả về kết quả với thông tin sách, trang hiện tại và tổng số trang
    return res.json(
      JSend.success({
        books,
        pagination: {
          TONG_SO_TRANG: totalPages,
          TRANG_HIEN_TAI: currentPage,
          SO_SACH_TREN_TRANG: filters.limit,
        },
      })
    );
  } catch (error) {
    console.log("Lỗi khi tìm kiếm sách:", error);
    return next(new ApiError(500, "Lỗi khi tìm kiếm sách"));
  }
}

async function getBookInfo(req, res, next) {
  const { bookId } = req.params;
  try {
    const book = await BooksService.getBookInfo(bookId);
    if (!book) {
      return next(new ApiError(404, `Không tìm thấy sách với mã ${bookId}`));
    }
    return res.json(JSend.success({ book }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Lỗi khi tìm kiếm sách với mã ${bookId}`));
  }
}
async function addBook(req, res, next) {
  const { MA_SACH, TEN_SACH, MO_TA, THE_LOAI, TAC_GIA, NHA_XUAT_BAN, GIA_BAN } =
    req.body;
  let ANH_BIA = "/public/images/blank-profile-picture.png"; // Default image if none is uploaded

  if (req.file) {
    ANH_BIA = `/public/uploads/${req.file.filename}`; // Use uploaded file's path
  }
  try {
    // Gọi service để thêm sách
    const newBook = await BooksService.addBook({
      MA_SACH,
      TEN_SACH,
      MO_TA,
      THE_LOAI,
      TAC_GIA,
      NHA_XUAT_BAN,
      GIA_BAN,
      ANH_BIA,
      TRANG_THAI: 1,
    });

    // Trả về kết quả thành công
    return res.status(201).json(JSend.success({ newBook }));
  } catch (error) {
    console.error("Lỗi khi thêm sách:", error);
    return next(new ApiError(500, "Lỗi khi thêm sách"));
  }
}
async function updateBook(req, res, next) {
  const { bookId } = req.params; // Lấy mã sách từ đường dẫn
  const { TEN_SACH, MO_TA, THE_LOAI, TAC_GIA, NHA_XUAT_BAN, GIA_BAN } =
    req.body;

  // Lấy đường dẫn của ảnh bìa mới nếu có tải lên
  const ANH_BIA = req.file ? `/public/uploads/${req.file.filename}` : null;

  // Kiểm tra dữ liệu hợp lệ
  if (
    !bookId ||
    !TEN_SACH ||
    !GIA_BAN ||
    !THE_LOAI ||
    !TAC_GIA ||
    !NHA_XUAT_BAN ||
    isNaN(GIA_BAN)
  ) {
    return res
      .status(400)
      .json(
        JSend.fail(
          "Dữ liệu không hợp lệ. Vui lòng kiểm tra các trường bắt buộc."
        )
      );
  }

  try {
    // Gọi service để cập nhật sách
    const updatedBook = await BooksService.updateBook(bookId, {
      TEN_SACH,
      MO_TA,
      THE_LOAI,
      TAC_GIA,
      NHA_XUAT_BAN,
      GIA_BAN,
      ...(ANH_BIA && { ANH_BIA }), // Chỉ cập nhật ANH_BIA nếu có ảnh mới
    });

    // Trả về kết quả thành công với thông tin sách đã cập nhật
    return res.status(200).json(JSend.success({ updatedBook }));
  } catch (error) {
    console.error("Lỗi khi cập nhật sách:", error);
    if (error.message === "Lỗi khi cập nhật sách: Sách không tồn tại") {
      return res.status(404).json(JSend.fail("Sách không tồn tại"));
    }
    return next(new ApiError(500, "Lỗi khi cập nhật sách"));
  }
}
async function updateBookState(req, res, next) {
  const { bookId } = req.params; // Lấy mã sách từ params

  try {
    // Gọi service để cập nhật trạng thái sách
    const updatedBook = await BooksService.updateBookState(bookId);

    // Trả về kết quả thành công với thông tin sách đã cập nhật
    return res.status(200).json(JSend.success({ updatedBook }));
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái sách:", error);
    if (error.message === "Sách không tồn tại") {
      return res.status(404).json(JSend.fail("Sách không tồn tại"));
    }
    return next(new ApiError(500, "Lỗi khi cập nhật trạng thái sách"));
  }
}

module.exports = {
  getBooksFiltered,
  getBookInfo,
  addBook,
  updateBook,
  updateBookState,
};
