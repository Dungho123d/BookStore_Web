<script>
import { ref, reactive, onMounted, watch } from 'vue';
import BookService from '../services/Book.service';
import CartService from '@/services/Carts.service';
import { useUserStore } from '@/stores/user.store';
import { useCartStore } from '@/stores/cart.store';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();
    const cartStore = useCartStore();

    const DetailBookData = ref({});
    const SO_LUONG = ref(1);
    const RelatedBook = ref([]);
    const theloai = ref("");

    // Load book details based on the current route parameter
    async function getDetailDataBook() {
      try {
        const data = await BookService.getBookInfo(route.params.id);
        DetailBookData.value = data.book;
        theloai.value = data.book.THE_LOAI;
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    }

    // Load related books based on `theloai`
    async function getRelatedBook() {
      try {
        const response = await BookService.getBooksFiltered("", theloai.value, 1, 4);
        const relatedBooks = response.books;

        if (Array.isArray(relatedBooks)) {
          RelatedBook.value = relatedBooks.filter(
            (item) => item.MA_SACH !== route.params.id
          );
        } else {
          RelatedBook.value = [];
        }
      } catch (err) {
        console.error("Error fetching related books:", err);
      }
    }

    function redirectPage(id) {
      if (id) {
        router.push(`/detail/${id}`);
      }
    }

    function DecreaseNumber() {
      if (SO_LUONG.value > 1) {
        SO_LUONG.value -= 1;
      } else {
        alert("Số lượng sản phẩm thấp nhất là 1!")
      }
    }

    function IncreaseNumber() {
      SO_LUONG.value += 1;
    }

    async function addtoCart(id_book) {
      if (!userStore.isLoggedIn) {
        alert('Bạn cần phải đăng nhập trước khi thêm vào giỏ hàng!');
        router.push('/login');
        return;
      }

      const bookData = {
        id_book: id_book,
        img_book: DetailBookData.value.ANH_BIA,
        title_book: DetailBookData.value.TEN_SACH,
        price_book: DetailBookData.value.GIA_BAN,
        quantity_book: SO_LUONG.value,
      };

      try {
        const response = await CartService.getCurrentUserCart(userStore.username);
        // Check if the cart and cart.books exist
        let currentCart = response?.cart?.books || [];
        const existingBook = currentCart.find(item => item.MA_SACH === id_book);

        if (existingBook) {
          await CartService.updateBookNumber(userStore.username, id_book, existingBook.SO_LUONG + bookData.quantity_book);
          alert('Cập nhật số lượng sản phẩm trong giỏ hàng thành công!');
        } else {
          await CartService.addBook(userStore.username, id_book, bookData.quantity_book);
          alert('Thêm vào giỏ hàng thành công!');
          cartStore.loadCart(); // Reload cart after adding
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Đã xảy ra lỗi khi thêm vào giỏ hàng. Vui lòng thử lại.');
      }
    }

    // Fetch book details and related books on component mount
    onMounted(async () => {
      await getDetailDataBook();
      await getRelatedBook();
    });

    // Watch route changes to reload data when navigating to a different book
    watch(
      () => route.params.id,
      async () => {
        await getDetailDataBook();
        await getRelatedBook();
      },
      { immediate: true }
    );

    return {
      DetailBookData,
      SO_LUONG,
      RelatedBook,
      theloai,
      getDetailDataBook,
      getRelatedBook,
      redirectPage,
      DecreaseNumber,
      IncreaseNumber,
      addtoCart,
    };
  },
};
</script>

<template>
  <div class="container" id="main_page_detail_book">
    <!-- BreadCrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb" style="align-items: center;">
        <li class="breadcrumb-item">
          <router-link to="/" style="color:#ff1f1f">Trang chủ</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Chi tiết sản phẩm</li>
      </ol>
    </nav>
    <!-- Detail_book -->
    <div class="row">
      <div class="col-6 text-center">
        <img :src="DetailBookData.ANH_BIA" class="img-fluid" alt="..." width="400" height="400"
          style="border: 1px solid #ccc; border-radius: 10px; padding: 10px;box-shadow: 1px 2px 13px 0px;">
      </div>
      <div class="col-6">
        <div class="row">
          <h4>{{ DetailBookData.TEN_SACH }}</h4>
        </div>
        <br>
        <div class="row">
          <p>Thể loại: <span class="fw-bold">{{ DetailBookData.THE_LOAI }}</span></p>
          <p>Tác giả: <span class="fw-bold">{{ DetailBookData.TAC_GIA }}</span></p>
          <p>Nhà xuất bản: <span class="fw-bold">{{ DetailBookData.NHA_XUAT_BAN }}</span></p>
        </div>
        <div class="row">
          <div style="border:1px solid #ff1f1f;;width:fit-content;border-radius:10px;padding:20px">
            Giá bán:
            <span class="fw-bold" style="color:#ff1f1f; font-size: 2rem;">
              {{ DetailBookData.GIA_BAN?.toLocaleString() }} đ
            </span>
          </div>
        </div>
        <br>
        <div class="row">
          <br>
          <br>
          <div class="d-flex">
            <button id="btn_decrease" @click="DecreaseNumber">-</button>
            <input type="text" class="fw-bold" v-model="SO_LUONG" id="input_quantity">
            <button id="btn_increase" @click="IncreaseNumber">+</button>
          </div>
        </div>

        <div class="row" v-if="DetailBookData.quantityonhand != 0">
          <p @click="addtoCart(DetailBookData.MA_SACH)" id="cart_btn" style="cursor:pointer"><i
              class="fa-solid fa-cart-shopping"></i> Thêm vào giỏ hàng</p>
        </div>
      </div>
    </div>
    <!-- Description Book -->
    <div class="row mt-5" id="description">
      <h5>MÔ TẢ SẢN PHẨM</h5>
      <hr>
      <div>
        <p>
          {{ DetailBookData.MO_TA }}
        </p>
      </div>
    </div>
    <!-- Book_Related -->
    <div class="row mt-5" id="description">
      <h5>SẢN PHẨM LIÊN QUAN</h5>
      <hr>
      <div class="d-flex flex-row container">
        <div class="col-md-4 mt-2" v-for="item in RelatedBook" :key="item.MA_SACH" data-aos="zoom-out-left">
          <div class="card mx-auto" style="max-width: 19rem;">
            <img :src="item.ANH_BIA" class="card-img-top" alt="..." width="190" height="190"
              style="object-fit: contain;">
            <div class="card-body">
              <span class="card-title" style="height:48px">{{ item.TEN_SACH }}</span>
              <p class="card-text"><span class="fw-bold"> Giá bán:</span> <span class="text-danger fw-bold"> {{
                item.GIA_BAN.toLocaleString() }} đ</span></p>
              <router-link :to="{ name: 'Details', params: { id: item.MA_SACH } }">
                <button type="button" class="btn" id="btn_detail">Xem chi tiết</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
#main_page_detail_book {
  height: 100%;
  margin-top: 50px;
}

#btn_detail {
  background-color: #ff1f1f;
  width: 100%;
  font-weight: bold;
  color: white;
}


#btn_decrease {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: none;
}

#btn_increase {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: none;
}


#btn_decrease:hover {
  background-color: #ff1f1f;
}


#btn_increase:hover {
  background-color: #ff1f1f;
}

#input_quantity {
  height: 40px;
  width: 50px;
  text-align: center;
}

#cart_btn {
  padding: 16px;
  border: 1px solid #ff1f1f;
  color: #ff1f1f;
  font-weight: bold;
  width: fit-content;
  border-radius: 10px;
  font-size: 17px;
  margin-top: 29px;
}

#description {
  border: 2px solid #ff1f1f;
  padding: 10px;
  border-radius: 10px;
}


.card-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.img_introduce:hover {
  border: 4px solid #ff1f1f !important;
  cursor: pointer;
}
</style>