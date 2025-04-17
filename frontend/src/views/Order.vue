<script>
import { ref, computed, onMounted } from 'vue';
import CartService from '../services/Carts.service';
import { useCartStore } from '@/stores/cart.store';
import { useUserStore } from '@/stores/user.store';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useRouter } from 'vue-router';

export default {
    beforeRouteEnter(to, from, next) {
        // Access the cart store to check totalQuantity
        const cartStore = useCartStore();

        // Check the total quantity of items in the cart
        if (cartStore.totalQuantity === 0) {
            alert("Vui lòng chọn ít nhất 1 quyển sách để thanh toán!");
            next('/cart'); // Redirect to the cart page if cart is empty
        } else {
            next(); // Proceed if the cart has items
        }
    },
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    setup() {
        const cartStore = useCartStore();
        const userStore = useUserStore();
        const router = useRouter();

        const OrderForm = yup.object().shape({
            username: yup.string().required("Phải nhập vào tên đầy đủ!"),
            email: yup.string().required("Email phải có giá trị.").email("Email không đúng định dạng").max(30, "Email tối đa 30 ký tự."),
            phonenumber: yup.number().required("Số điện thoại không được bỏ trống").typeError("Số điện thoại chưa đúng định dạng ! - Nhập đủ 10 kí tự").min(10, "Số điện thoại phải có ít nhất 10 kí tự"),
            address: yup.string().min(17, "Địa chỉ phải có ít nhất 17 kí tự").required("Địa chỉ không được bỏ trống.")
        });

        const dataOrderInput = ref({
            username: "",
            name: "",
            email: "",
            phonenumber: "",
            address: "",
            payment: "Thanh toán khi nhận hàng (COD)",
            detail_cart: [],
            statusOrder: "",
            totalOrder: ""
        });

        const dataShowFromCart = ref([]);
        const deliverFee = 35000;
        const totalCart = computed(() => cartStore.totalPrice);
        const books = computed(() => cartStore.books);
        const numofBooks = computed(() => cartStore.totalQuantity);

        const loadUserData = () => {
            const { username } = userStore;
            dataOrderInput.value.username = username;
            dataOrderInput.value.totalOrder = totalCart.value;
            dataOrderInput.value.detail_cart = cartStore.books;
        };

        const handleOrder = async () => {
            const { username, name, email, phonenumber, address, payment } = dataOrderInput.value;
            if (!username || !name || !email || !phonenumber || !address || !payment) {
                alert("Vui lòng điền đầy đủ các trường thông tin!");
                return;
            }
            try {
                await CartService.checkoutCart(username, name, phonenumber, address);
                alert("Thanh toán thành công!");
                const cartId = cartStore.cartId;
                cartStore.resetCart();
                router.push(`/order_complete/${cartId}`);
            } catch (error) {
                console.error("Error in handling order:", error);
            }
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

        onMounted(() => {
            loadUserData();
        });

        return {
            OrderForm,
            dataOrderInput,
            dataShowFromCart,
            deliverFee,
            loadUserData,
            handleOrder,
            capitalizeFirstLetter,
            numberToVietnameseWords,
            cartStore,
            userStore,
            totalCart,
            books,
            numofBooks
        };
    }
};
</script>


<template>
    <div class="container" style="margin-top:50px;">
        <div class="row">
            <div class="col-lg-7">
                <h2>NHÀ SÁCH ZBOOKS STORE</h2>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb" style="align-items: center;">
                        <li class="breadcrumb-item">
                            <router-link to="/cart" style="color:#62ab00">Giỏ hàng</router-link>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page" style="color:red;font-weight:bold">Thông
                            tin giao hàng</li>
                        <li class="breadcrumb-item active" aria-current="page">Xác nhận thành công đơn hàng</li>
                    </ol>
                </nav>
                <div class="text-center fw-bold fs-3">THÔNG TIN GIAO HÀNG</div>

                <Form :validation-schema="OrderForm" @submit.prevent="handleOrder">
                    <div class="mb-3">
                        <label for="inputUserName" class="form-label fw-bold">Họ và tên: </label>
                        <Field id="inputUserName" placeholder="Vui lòng nhập vào tên người nhận..." name="username"
                            type="text" class="form-control form-control-lg" v-model="dataOrderInput.name" required />
                        <ErrorMessage name="username" class="text-danger" />
                    </div>
                    <div class="mb-3">
                        <label for="inputphonenumber" class="form-label fw-bold">Số điện thoại:</label>
                        <Field id="inputphonenumber" placeholder="Vui lòng nhập vào số điện thoại" name="phonenumber"
                            type="text" class="form-control form-control-lg" v-model="dataOrderInput.phonenumber"
                            required />
                        <ErrorMessage name="phonenumber" class="text-danger" />
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label fw-bold">Email:</label>
                        <Field id="email" placeholder="Vui lòng nhập vào Email" name="email" type="email"
                            class="form-control form-control-lg" v-model="dataOrderInput.email" required />
                        <ErrorMessage name="email" class="text-danger" />
                    </div>
                    <div class="mb-3">
                        <label for="address" class="form-label fw-bold">Địa chỉ:</label>
                        <Field id="address" placeholder="Vui lòng nhập vào địa chỉ" name="address" type="text"
                            class="form-control form-control-lg" v-model="dataOrderInput.address" required />
                        <ErrorMessage name="address" class="text-danger" />
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label fw-bold">Hình thức thanh toán: Thanh toán khi
                            nhận hàng (COD)</label>

                    </div>
                    <button @click="handleOrder()" type="submit" class="btn btn-info text-white fw-bold mb-2"
                        style="padding: 10px;border:1px solid #ccc;width:100%;">Xác Nhận</button>
                </Form>
            </div>
            <div class="col-lg-5" style="border:1px solid #62ab00;border-radius:10px;">
                <div class="text-center mt-2 fw-bold fs-3">THÔNG TIN ĐƠN HÀNG</div>
                <div class="row px-2 py-1" v-for="item in books" :key="item.MA_SACH"
                    style="display:flex;flex-wrap:nowrap">
                    <div class="col-9">
                        <img :src="item.ANH_BIA" class="img-thumbnail" alt="..." width="75" height="75">
                        <br>
                        <span>{{ item.TEN_SACH }}</span>
                        <span style="color:#62ab00">&nbsp;(SL: {{ item.SO_LUONG }})</span>
                    </div>
                    <div class="col-3 fw-bold text-end my-auto">
                        {{ (item.GIA_MUA * item.SO_LUONG).toLocaleString() }} đ
                    </div>
                </div>
                <hr>
                <div class="row px-2 py-1" style="display:flex;flex-wrap:nowrap">
                    <div class="col-8">Thành tiền:</div>
                    <div class="col-4 fw-bold text-end">{{ totalCart.toLocaleString() }} đ
                    </div>
                </div>
                <div class="row px-2 py-1" style="display:flex;flex-wrap:nowrap">
                    <div class="col-8">Phí vận chuyển:</div>
                    <div class="col-4 fw-bold text-end">{{ deliverFee.toLocaleString() }} đ</div>
                </div>
                <hr>
                <div class="row px-2 py-1">
                    <div class="col d-flex flex-row mb-2">
                        <div class="col-8 fw-bold my-auto">Tổng số tiền (đã gồm VAT):</div>
                        <div class="col-4 fw-bold text-end fs-3" style="color:red">{{
                            (totalCart + deliverFee).toLocaleString() }} đ
                        </div>
                    </div>
                    <div class="col-12 text-end fst-italic"> Bằng chữ:
                        <span style="color:red">
                            {{ numberToVietnameseWords(totalCart + deliverFee) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
