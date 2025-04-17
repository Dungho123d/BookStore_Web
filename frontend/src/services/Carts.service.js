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
    throw new Error(json.message || 'Unknown error');
  }
  return json.data;
}

function CartService() {
  // const baseUrl = '/cart';

  // Lấy tất cả giỏ hàng
  async function getAllCarts() {
    try {
      return await efetch('/api/cart');
    } catch (error) {
      console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
      throw error;
    }
  }

  // Lấy giỏ hàng hiện tại của người dùng
  async function getCurrentUserCart(userId) {
    try {
      return await efetch(`/api/cart/${userId}/now`);
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng hiện tại của người dùng:', error);
      throw error;
    }
  }

  // Lấy tất cả giỏ hàng của người dùng
  async function getUserCarts(userId) {
    try {
      return await efetch(`/api/cart/${userId}/all`);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin giỏ hàng của người dùng:', error);
      throw error;
    }
  }

  // Lấy các sản phẩm trong giỏ hàng theo mã giỏ hàng
  async function getCartItems(cartId) {
    try {
      return await efetch(`/api/cart/${cartId}`);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm trong giỏ hàng:', error);
      throw error;
    }
  }

  // Thêm sách vào giỏ hàng
  async function addBook(userId, bookId, quantity) {
    try {
      return await efetch(`/api/cart/${userId}/book/${bookId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
    } catch (error) {
      console.error('Lỗi khi thêm sách vào giỏ hàng:', error);
      throw error;
    }
  }

  // Cập nhật số lượng sách trong giỏ hàng
  async function updateBookNumber(userId, bookId, quantity) {
    try {
      return await efetch(`/api/cart/${userId}/book/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng sách trong giỏ hàng:', error);
      throw error;
    }
  }

  // Xóa sách khỏi giỏ hàng
  async function deleteBook(userId, bookId) {
    try {
      return await efetch(`/api/cart/${userId}/book/${bookId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Lỗi khi xóa sách khỏi giỏ hàng:', error);
      throw error;
    }
  }

  // Thanh toán giỏ hàng
  async function checkoutCart(userId, TEN_NGUOI_NHAN, SO_DIEN_THOAI, DIA_CHI_NHAN) {
    try {
      return await efetch(`/api/cart/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          TEN_NGUOI_NHAN,
          SO_DIEN_THOAI,
          DIA_CHI_NHAN
        })
      });
    } catch (error) {
      console.error('Lỗi khi thanh toán giỏ hàng:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái giỏ hàng thành 'Đã giao'
  async function deliverCart(cartId) {
    try {
      return await efetch(`/api/cart/${cartId}`, {
        method: 'PATCH'
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái giỏ hàng:', error);
      throw error;
    }
  }

  return {
    getAllCarts,
    getCurrentUserCart,
    getUserCarts,
    getCartItems,
    addBook,
    updateBookNumber,
    deleteBook,
    checkoutCart,
    deliverCart
  };
}

export default CartService();
