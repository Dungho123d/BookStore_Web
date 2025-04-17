<script>
import { ref, onMounted } from 'vue';
import CartService from '../services/Carts.service';
import { useCartStore } from '@/stores/cart.store';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const ManageOrder = ref([]);
        const id_book = ref('');
        const data_edit = ref('');
        const inputSearch = ref('');
        const Payment = ref('');
        const cartStore = useCartStore();
        const router = useRouter();

        const getOrderData = async () => {
            try {
                const response = await CartService.getAllCarts();
                ManageOrder.value = response.carts;
                Payment.value = localStorage.getItem('payment');

                ManageOrder.value.forEach(cart => {
                    cart.totalOrder = cart.books.reduce((total, item) => {
                        return total + (item.GIA_MUA * item.SO_LUONG);
                    }, 0);
                });
            } catch (error) {
                console.log(error);
            }
        };

        const editOrder = async (Id_order) => {
            router.push(`/editorder/${Id_order}`);
        };

        const deliverCart = async (cartId) => {
            try {
                await CartService.deliverCart(cartId);
                alert("Giao hàng thành công");
                getOrderData();
            } catch (err) {
                console.log(err);
            }
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            if (isNaN(date)) {
                return '';
            }
            return date.toLocaleDateString('en-GB');
        };

        onMounted(() => {
            getOrderData();
        });

        return {
            ManageOrder,
            id_book,
            data_edit,
            inputSearch,
            Payment,
            cartStore,
            getOrderData,
            editOrder,
            deliverCart,
            formatDate
        };
    }
};
</script>

<template>
    <div class="content_admin_page">
        <h1 class="text-center">QUẢN LÝ GIỎ HÀNG - ĐƠN HÀNG</h1>
        <br>
        <!-- Giao diện bảng Show đơn hàng -->
        <div class="table-container">
            <table class="table" border="1" id="table_manageAuthor">
                <thead>
                    <tr class="table-info text-center">
                        <th class="text-center align-top" scope="col">STT</th>
                        <th class="text-center align-top" scope="col">Mã đơn hàng</th>
                        <th class="text-center align-top" scope="col">Tên tài khoản</th>
                        <th class="text-center align-top" scope="col">Tên người nhận</th>
                        <th class="text-center align-top" scope="col">Số điện thoại</th>
                        <th class="text-center align-top" scope="col">Ngày đặt hàng</th>
                        <th class="text-center align-top" scope="col">Tổng số tiền<br>(chưa tính phí giao hàng)</th>
                        <th class="text-center align-top" scope="col">Địa chỉ nhận hàng</th>
                        <th class="text-center align-top" scope="col">Trạng thái đơn hàng</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in ManageOrder" :key="item.MA_GIO_HANG">
                        <td class="text-center">{{ index + 1 }}</td>
                        <td>{{ item.MA_GIO_HANG }}</td>
                        <td>{{ item.TEN_TAI_KHOAN }}</td>
                        <td class="text-start">{{ item.TEN_NGUOI_NHAN }}</td>
                        <td class="text-center">{{ item.SO_DIEN_THOAI }}</td>
                        <td class="text-center">
                            <p>{{ formatDate(item.NGAY_TAO) }}</p>
                        </td>
                        <td class="text-end">{{ item.totalOrder.toLocaleString() }} đ</td>
                        <td class="text-start">{{ item.DIA_CHI_NHAN }}</td>

                        <!-- Display status based on item.TRANG_THAI value -->
                        <td v-if="item.TRANG_THAI === 0" style="color:#6c757d;font-weight:bold">Chưa thanh toán</td>
                        <td v-else-if="item.TRANG_THAI === 1" style="color:#0d6efd;font-weight:bold">Đã thanh toán<br>
                            <button @click="deliverCart(item.MA_GIO_HANG)" type="button" class="btn btn-primary btn-sm">
                                <i class="fa-solid fa-edit"></i> Giao hàng
                            </button>
                        </td>
                        <td v-else-if="item.TRANG_THAI === 2" style="color:#198754;font-weight:bold">Đã giao hàng</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.content_admin_page {
    margin-top: 40px;
}

.table-container {
    display: flex;
    justify-content: center;
    /* Centers the table horizontally */
    margin-top: 20px;
    /* Adds space above the table */
}

.table {
    width: 90vw;
    border-collapse: collapse;
}

.table th,
.table td {
    border: 1px solid #ccc;
    padding: 8px;
}

.table th {
    background-color: #f8f9fa;
    text-align: center;
}

.table td {
    text-align: center;
}

.table-info {
    background-color: #f8f9fa;
}
</style>
