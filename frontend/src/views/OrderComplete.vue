<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CartService from '../services/Carts.service';

export default {
    setup() {
        const router = useRouter();
        const route = useRoute();

        // State variables
        const dataCompleteOrder = ref(''); // Adjusted for direct data access
        const cartItems = ref([]); // List of items in the cart
        const Payment = "Thanh toán khi nhận hàng (COD)";
        const TotalOrder = ref(0);
        const deliverFee = 35000;

        // Fetch cart summary and items
        const loadDataCompleteOrder = async () => {
            try {
                const cartId = route.params.id;
                const response = await CartService.getCartItems(cartId);
                console.log(response);

                dataCompleteOrder.value = response.cart;
                cartItems.value = response.cart.books;

                // Calculate total order amount
                TotalOrder.value = cartItems.value.reduce((total, item) => {
                    return total + (item.GIA_MUA * item.SO_LUONG);
                }, 0);
            } catch (error) {
                console.error("Error loading order data:", error);
            }
        };

        // Navigate back to home and clear local storage
        const continueShopping = () => {
            router.push(`/`);
        };

        const capitalizeFirstLetter = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        const numberToVietnameseWords = (number) => {
            const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
            const tens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
            const hundreds = ["", "một trăm", "hai trăm", "ba trăm", "bốn trăm", "năm trăm", "sáu trăm", "bảy trăm", "tám trăm", "chín trăm"];
            const thousands = ["", "nghìn", "triệu", "tỷ"];
            if (number === 0) return "Không đồng";
            let result = "";
            let numStr = number.toString();
            let groups = [];
            while (numStr.length > 0) {
                groups.push(numStr.slice(-3));
                numStr = numStr.slice(0, -3);
            }
            groups = groups.map((group) => group.padStart(3, "0")).reverse();
            for (let i = 0; i < groups.length; i++) {
                let [hundred, ten, unit] = groups[i];
                let groupText = "";
                if (hundred !== "0") groupText += hundreds[hundred] + " ";
                if (ten === "0" && unit !== "0") {
                    groupText += "lẻ ";
                } else if (ten === "1") {
                    groupText += "mười ";
                } else if (ten !== "0") {
                    groupText += tens[ten] + " ";
                }
                if (unit === "1" && ten !== "0" && ten !== "1") {
                    groupText += "mốt ";
                } else if (unit === "5" && ten !== "0") {
                    groupText += "lăm ";
                } else if (unit !== "0") {
                    groupText += units[unit] + " ";
                }
                if (groupText.trim() !== "") {
                    groupText += thousands[groups.length - 1 - i] + " ";
                }
                result += groupText;
            }
            return capitalizeFirstLetter(result.trim()) + " đồng";
        };
        // Lifecycle hook to load data on component creation
        onMounted(() => {
            loadDataCompleteOrder();
        });

        return {
            dataCompleteOrder,
            cartItems,
            Payment,
            TotalOrder,
            deliverFee,
            continueShopping,
            capitalizeFirstLetter,
            numberToVietnameseWords
        };
    }
};
</script>


<template>
    <div class="container" style="margin-top:50px;">
        <!-- Order confirmation layout -->
        <div class="row">
            <!-- Left page: Order summary -->
            <div class="col-lg-5">
                <h2><i class="fa-regular fa-circle-check"></i> NHÀ SÁCH ZBOOKS STORE</h2>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb" style="align-items: center;">
                        <li class="breadcrumb-item">
                            <router-link to="/cartStore" style="color:#62ab00">Giỏ hàng</router-link>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">Thông tin giao hàng</li>
                        <li class="breadcrumb-item active" aria-current="page" style="color:red;font-weight:bold">
                            Xác nhận thành công đơn hàng
                        </li>
                    </ol>
                </nav>

                <p><strong>Xác nhận thành công đơn hàng</strong></p>
                <p>Mã đơn hàng: <span style="color:#62ab00;font-weight:bold">{{ dataCompleteOrder.MA_GIO_HANG }}</span>
                </p>
                <p><strong>Cảm ơn bạn đã mua hàng!</strong></p>

                <div class="order-info">
                    <h2>THÔNG TIN ĐƠN HÀNG</h2>
                    <p>Họ và tên: {{ dataCompleteOrder.TEN_NGUOI_NHAN }}</p>
                    <p>Địa chỉ: {{ dataCompleteOrder.DIA_CHI_NHAN }}</p>
                    <p>Số điện thoại: {{ dataCompleteOrder.SO_DIEN_THOAI }}</p>

                    <h2>PHƯƠNG THỨC THANH TOÁN</h2>
                    <p>{{ Payment }}</p>
                </div>

                <div class="continue-shopping">
                    <router-link to="/" @click="continueShopping">
                        <button type="button" class="btn btn-secondary">Tiếp tục mua hàng</button>
                    </router-link>
                </div>
            </div>

            <!-- Right page: Order items -->
            <div class="col order-details">
                <div v-for="item in cartItems" :key="item.MA_SACH" class="row px-2 py-1 d-flex flex-row">
                    <div class="item-details col-8">
                        <img :src="item.ANH_BIA" alt="Product Image" width="100" height="100" class="img-thumbnail">
                        &nbsp;
                        <span>{{ item.TEN_SACH }}</span>
                        <span style="color:#62ab00"> (SL: {{ item.SO_LUONG }})</span>
                    </div>
                    <div class="item-price col-4 text-end my-auto">
                        <span>{{ (item.GIA_MUA * item.SO_LUONG).toLocaleString() }} đ</span>
                    </div>
                </div>
                <hr>
                <div class="row px-2 py-1" style="display:flex;flex-wrap:nowrap">
                    <div class="col-8">Thành tiền:</div>
                    <div class="col-4 fw-bold text-end">{{ TotalOrder.toLocaleString() }} đ</div>
                </div>
                <div class="row px-2 py-1" style="display:flex;flex-wrap:nowrap">
                    <div class="col-8">Phí vận chuyển:</div>
                    <div class="col-4 fw-bold text-end">35.000 đ</div>
                </div>
                <hr>
                <div class="total-price px-2">
                    <h4 class="my-auto">Tổng cộng: (bao gồm VAT)</h4>
                    <div class="fw-bold" style="color: red">
                        <span style="font-size: 20px;opacity:0.6">VND &nbsp;</span>
                        <span style="font-size: 30px;">{{ (TotalOrder + deliverFee).toLocaleString() }} đ</span>
                    </div>
                </div>
                <div class="col-12 text-end fst-italic px-2"> Bằng chữ:
                    <span style="color:red">
                        {{ numberToVietnameseWords(TotalOrder + deliverFee) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.order-details {
    border: 1px solid #62ab00;
    border-radius: 10px;
}

.order-item {
    display: flex;
    padding: 20px;
}

.item-details,
.item-price {
    line-height: 1.5;
}

.shipping-fee,
.total-price {
    display: flex;
    justify-content: space-between;
}
</style>
