<script>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CartService from '../services/Carts.service';
import { useCartStore } from '@/stores/cart.store';

export default {
    setup() {
        const route = useRoute();
        const cartStore = useCartStore();
        const dataUser = ref({});
        const name_user = ref('');
        const totalAllOrder = ref(0);
        const dataOrder = ref([]);
        const id_order = ref('');
        const Payment = "Thanh toán khi nhận hàng (COD)";
        const TotalOrder = ref(0);

        const dataOrderInput = reactive({
            iduser: "",
            username: "",
            email: "",
            phonenumber: "",
            address: "",
            payment: "",
            detail_cart: [],
            TRANG_THAI: "",
            totalOrder: ""
        });

        const BookDataInput = reactive({
            img_url: [],
            title: "",
            author: "",
            categories: "",
            description: "",
            price: "",
            bookType: "",
            quantityonhand: ""
        });

        // Fetch order data and calculate totals
        const getDataOrder = async () => {
            try {
                const response = await CartService.getUserCarts(route.params.id);
                dataOrder.value = response.carts;

                dataOrder.value.forEach(cart => {
                    if (cart.TRANG_THAI === 0) {
                        cart.totalOrder = 0;
                    } else {
                        cart.totalOrder = cart.books.reduce((total, item) => {
                            return total + (item.GIA_MUA * item.SO_LUONG);
                        }, 0) + 35000;
                    }
                });

                totalAllOrder.value = dataOrder.value.reduce((total, cart) => {
                    return total + cart.totalOrder;
                }, 0);

            } catch (error) {
                console.error("Failed to get order data:", error);
            }
        };

        // Date formatting utility function
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return isNaN(date) ? '' : date.toLocaleDateString('en-GB');
        };

        onMounted(() => {
            getDataOrder();
        });

        return {
            cartStore,
            dataUser,
            name_user,
            totalAllOrder,
            dataOrder,
            id_order,
            Payment,
            TotalOrder,
            dataOrderInput,
            BookDataInput,
            getDataOrder,
            formatDate
        };
    }
}
</script>

<template>
    <div class="container" id="container_height">
        <span style="font-weight:bold;opacity:0.6">ĐỔI MẬT KHẨU NGƯỜI DÙNG </span>
        <router-link :to="{ name: 'ChangePassword', params: { id: $route.params.id } }">
            <button type="button" class="btn btn-info text-white"><i class="fa-solid fa-key"></i> Đổi mật khẩu </button>
        </router-link>
        <hr>
        <h5>QUẢN LÝ ĐƠN HÀNG</h5>
        <table class="table">
            <thead>
                <tr>
                    <th class="text-center" scope="col">STT</th>
                    <th class="text-center" scope="col">Mã đơn hàng</th>
                    <th class="text-center" scope="col">Ngày tạo đơn hàng</th>
                    <th class="text-center" scope="col">Hình thức thanh toán</th>
                    <th class="text-center" scope="col">Địa chỉ giao hàng</th>
                    <th class="text-center" scope="col">Tổng số tiền</th>
                    <th class="text-center" scope="col">Trạng thái đơn hàng</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="dataOrder.length === 0" style="color:red;font-weight:bold;">Bạn chưa có đơn hàng nào!</tr>
                <tr v-for="(item, index) in dataOrder" :key="item.MA_GIO_HANG">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td style="font-weight:bold;">
                        <router-link :to="{ name: 'DetailOrder', params: { id: item.MA_GIO_HANG } }">
                            <p style="color:red;">{{ item.MA_GIO_HANG }}</p>
                        </router-link>
                    </td>
                    <td class="text-center">
                        <p>{{ formatDate(item.NGAY_TAO) }}</p>
                    </td>
                    <td>{{ Payment }}</td>
                    <td>{{ item.DIA_CHI_NHAN }}</td>
                    <td class="text-end">{{ item.totalOrder.toLocaleString() }} đ</td>

                    <td v-if="item.TRANG_THAI == 0" style="color:#6c757d;font-weight:bold">
                        Chưa thanh toán
                    </td>
                    <td v-else-if="item.TRANG_THAI == 1" style="color:#0d6efd;font-weight:bold">
                        Đã thanh toán
                    </td>
                    <td v-else-if="item.TRANG_THAI == 2" style="color:blue;font-weight:bold;cursor:pointer;">
                        Đã giao hàng
                    </td>
                </tr>
                <tr>
                    <td colspan="4"></td>
                    <td colspan="4" style="font-weight:bold;color:blue">Tổng tất cả đơn hàng: {{
                        totalAllOrder.toLocaleString() }} đ</td>
                </tr>
            </tbody>
        </table>
        <hr>
        <!-- <p>Tên người dùng: {{ dataUser.TEN_TAI_KHOAN }}</p>
    <p>Email: {{ dataUser.email }}</p>
    <p>Số điện thoại: {{ dataUser.SO_DIEN_THOAI }}</p>
    <p>Địa chỉ: Việt Nam</p>  -->
    </div>
</template>

<style>
#container_height {
    margin-top: 50px;
}
</style>
