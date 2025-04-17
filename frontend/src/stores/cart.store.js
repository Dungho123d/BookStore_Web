import { defineStore } from 'pinia';
import CartService from '@/services/Carts.service';
import { useUserStore } from '@/stores/user.store';

export const useCartStore = defineStore('cart', {
  state: () => ({
    books: [],           // List of books in the cart
    totalQuantity: 0,    // Total number of book types
    totalPrice: 0,       // Total amount payable
    cartId: '',
  }),

  actions: {
    async loadCart() {
      const userStore = useUserStore();
      const userId = userStore.username;

      if (userId) {
        try {
          const cartData = await CartService.getCurrentUserCart(userId);
          if (cartData.cart) {
            this.books = cartData.cart.books;
            this.cartId = cartData.cart.MA_GIO_HANG;
            // console.log(this.cartId );
            this.calculateCartTotals();
            // Update localStorage with the fetched cart data
            localStorage.setItem("productCart", JSON.stringify(this.books));
          } else {
            this.resetCart();
          }
        } catch (error) {
          console.error("Lỗi khi tải giỏ hàng:", error);
          alert("Không thể tải giỏ hàng. Vui lòng thử lại sau.");
        }
      } else {
        this.resetCart();
      }
    },

    // Calculate total quantity and total price
    calculateCartTotals() {
      this.totalQuantity = this.books.length;
      this.totalPrice = this.books.reduce((sum, item) => sum + item.SO_LUONG * item.GIA_MUA, 0);
    },

    async updateBookQuantity(bookId, newQuantity) {
      const userStore = useUserStore();
      const userId = userStore.username;

      try {
        await CartService.updateBookNumber(userId, bookId, newQuantity);
        await this.loadCart(); // Reload cart data to reflect changes
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
        alert("Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại sau.");
      }
    },

    async removeBook(bookId) {
      const userStore = useUserStore();
      const userId = userStore.username;

      const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sách khỏi giỏ hàng?");
      if (!isConfirmed) return;

      try {
        await CartService.deleteBook(userId, bookId);
        alert('Sản phẩm đã được xóa khỏi giỏ hàng!');
        await this.loadCart();
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
        alert('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
      }
    },

    resetCart() {
      this.books = [];
      this.totalQuantity = 0;
      this.totalPrice = 0;
      this.cartId = '';
      localStorage.removeItem("productCart"); // Clear localStorage cart when reset
    },
  },
});
