<script>
import { ref, onMounted } from 'vue';
import CartService from '../services/Carts.service';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';

export default {
  setup() {
    // Initialize the store and reactive state
    const userStore = useUserStore();
    const route = useRoute();
    const router = useRouter();
    const idOrder = ref('');
    const detailOrder = ref([]); // Initialize as an empty array to hold book details

    // Define methods
    async function loadDataOrderDetail() {
      try {
        idOrder.value = route.params.id; // Use route params to get idOrder
        const response = await CartService.getCartItems(idOrder.value);
        detailOrder.value = response.cart.books;
      } catch (error) {
        console.error("Error loading order details:", error);
      }
    }

    function backPage() {
      const idUser = userStore.username;
      if (idUser) {
        router.push(`/infoUser/${idUser}`);
      } else {
        console.error("Username is not available");
      }
    }

    // Fetch order data on component mount
    onMounted(() => {
      loadDataOrderDetail();
    });

    return {
      idOrder,
      detailOrder,
      backPage
    };
  }
};
</script>


<template>
  <div class="container" id="orderDetail">
    <button @click="backPage" type="button" class="btn btn-primary">
      <i class="fa-solid fa-arrow-left"></i> Trở về
    </button>
    <br><br>
    <h5 style="color:#62ab00;">ĐƠN HÀNG: {{ idOrder }}</h5>
    <br>
    <h5>CHI TIẾT ĐƠN HÀNG</h5>
    <br>
    <table class="table">
      <thead class="text-center">
        <tr>
          <th scope="col">STT</th>
          <th scope="col">Sản phẩm</th>
          <th scope="col">Hình ảnh</th>
          <th scope="col">Giá</th>
          <th scope="col">Số lượng</th>
          <th scope="col">Tổng cộng</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in detailOrder" :key="item.MA_SACH">
          <td class="text-center">{{ index + 1 }}</td>
          <td>{{ item.TEN_SACH }}</td>
          <td class="text-center">
            <img :src="item.ANH_BIA" alt="" height="100">
          </td>
          <td class="text-end">{{ item.GIA_MUA.toLocaleString() }} đ</td>
          <td class="text-center">{{ item.SO_LUONG }}</td>
          <td class="text-end">{{ (item.GIA_MUA * item.SO_LUONG).toLocaleString() }} đ</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
#orderDetail {
  margin-top: 50px;
}
</style>
