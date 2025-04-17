const db = require("../database/knex");

async function getBooksFiltered(filters = {}) {
  const { searchTerm, theLoai, page = 1, limit = 20 } = filters; // Thêm `limit` vào filters

  try {
    let query = db("sach");

    // Lọc theo thể loại nếu có
    if (theLoai && theLoai !== "") {
      query = query.where("THE_LOAI", theLoai);
    }

    // Tìm kiếm theo từ khóa trong các trường: TEN_SACH, TAC_GIA, NHA_XUAT_BAN
    if (searchTerm && searchTerm !== "") {
      query = query.where((builder) => {
        builder
          .where("TEN_SACH", "like", `%${searchTerm}%`)
          .orWhere("TAC_GIA", "like", `%${searchTerm}%`)
          .orWhere("NHA_XUAT_BAN", "like", `%${searchTerm}%`);
      });
    }

    // Phân trang: tính toán giới hạn và offset dựa vào `page` và `limit`
    const offset = (page - 1) * limit;

    // Lấy tổng số sách (dành cho tính tổng số trang ở client)
    const totalBooks = await query.clone().count("MA_SACH as count").first();
    const totalPages = Math.ceil(totalBooks.count / limit);

    // Lấy sách theo `limit` và `offset`
    const books = await query.limit(limit).offset(offset).select("*");

    return { books, totalPages, currentPage: page };
  } catch (err) {
    throw new Error("Lỗi khi tra cứu sách: " + err.message);
  }
}

async function getBookInfo(maSach) {
  const book = await db("sach").select("*").where("MA_SACH", maSach).first();
  return book;
}
async function addBook(bookData) {
  try {
    await db("sach").insert(bookData);
    const newBook = await db("sach")
      .where({ MA_SACH: bookData.MA_SACH })
      .first();
    return newBook;
  } catch (err) {
    throw new Error("Lỗi khi thêm sách: " + err.message);
  }
}
async function updateBook(maSach, bookData) {
  try {
    // Cập nhật sách với thông tin mới, dựa vào MA_SACH
    const updated = await db("sach")
      .where({ MA_SACH: maSach })
      .update(bookData);

    // Kiểm tra xem có sách nào được cập nhật không
    if (updated === 0) {
      throw new Error("Sách không tồn tại");
    }

    // Lấy lại thông tin sách sau khi cập nhật
    const updatedBook = await db("sach").where({ MA_SACH: maSach }).first();

    return updatedBook;
  } catch (err) {
    throw new Error("Lỗi khi cập nhật sách: " + err.message);
  }
}

async function updateBookState(bookId) {
  try {
    // Lấy thông tin sách hiện tại
    const book = await db("sach").where({ MA_SACH: bookId }).first();

    if (!book) {
      throw new Error("Sách không tồn tại");
    }

    // Kiểm tra trạng thái hiện tại và chuyển đổi
    const newState = book.TRANG_THAI === 0 ? 1 : 0;

    // Cập nhật trạng thái mới
    await db("sach")
      .where({ MA_SACH: bookId })
      .update({ TRANG_THAI: newState });

    // Lấy lại thông tin sách sau khi cập nhật
    const updatedBook = await db("sach").where({ MA_SACH: bookId }).first();

    return updatedBook;
  } catch (err) {
    throw new Error("Lỗi khi cập nhật trạng thái sách: " + err.message);
  }
}

module.exports = {
  getBookInfo,
  getBooksFiltered,
  addBook,
  updateBook,
  updateBookState,
};
