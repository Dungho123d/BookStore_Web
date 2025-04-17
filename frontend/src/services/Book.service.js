/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns Promise<Response>
 */
async function efetch(url, options = {}) {
  let result = {};
  let json = {};
  try {
    result = await fetch(url, options);
    json = await result.json();
  } catch (error) {
    throw new Error(error.message);
  }
  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message);
  }
  return json.data;
}

function BookService() {
  // const baseUrl = '/book';

  // Lấy danh sách sách với phân trang và bộ lọc
  async function getBooksFiltered(searchTerm = '', theLoai = '', page = 1, limit = 20) {
    const query = new URLSearchParams({ searchTerm, theLoai, page, limit }).toString();
    const url = `/api/book?${query}`;

    return await efetch(url, { method: 'GET' });
  }

  // Lấy thông tin chi tiết sách theo mã sách
  async function getBookInfo(bookId) {
    const url = `/api/book/${bookId}`;

    return await efetch(url, { method: 'GET' });
  }

  // Thêm sách mới
  async function addBook(bookData) {
    const options = {
      method: 'POST',
      body: bookData
    };
    return await efetch('/api/book', options);
  }

  // Cập nhật thông tin sách theo mã sách
  async function updateBook(bookId, updatedData) {
    const url = `/api/book/${bookId}`;
    const options = {
      method: 'PATCH',
      body: updatedData
    };
    return await efetch(url, options);
  }

  // Cập nhật trạng thái sách theo mã sách
  async function updateBookState(bookId) {
    const url = `/api/book/${bookId}/state`;
    return await efetch(url, { method: 'PATCH' });
  }

  return {
    getBooksFiltered,
    getBookInfo,
    addBook,
    updateBook,
    updateBookState
  };
}

export default new BookService();
