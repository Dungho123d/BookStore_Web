<script>
import { computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart.store';

export default {
    setup() {
        const cartStore = useCartStore();

        // Computed properties
        const data_show_product_cart = computed(() => cartStore.books);
        const totalCart = computed(() => cartStore.totalPrice);

        // Decrease book quantity function
        const decreaseQuantity = async (bookId) => {
            const book = data_show_product_cart.value.find((item) => item.MA_SACH === bookId);
            if (book && book.SO_LUONG > 1) {
                await cartStore.updateBookQuantity(bookId, book.SO_LUONG - 1);
            } else {
                alert('Số lượng sản phẩm thấp nhất là 1. Để xóa sản phẩm, chọn nút Xóa ở bên phải.');
            }
        };

        // Increase book quantity function
        const increaseQuantity = async (bookId) => {
            const book = data_show_product_cart.value.find((item) => item.MA_SACH === bookId);
            if (book) {
                await cartStore.updateBookQuantity(bookId, book.SO_LUONG + 1);
            }
        };

        // Remove book function
        const removeBook = async (bookId) => {
            await cartStore.removeBook(bookId);
        };

        // Capitalize first letter function
        const capitalizeFirstLetter = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        // Convert number to Vietnamese words function
        const numberToVietnameseWords = (number) => {
            const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
            const tens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
            const hundreds = ["", "một trăm", "hai trăm", "ba trăm", "bốn trăm", "năm trăm", "sáu trăm", "bảy trăm", "tám trăm", "chín trăm"];
            const thousands = ["", "nghìn", "triệu", "tỷ"];
            if (number === 0) return "Không đồng";
            let result = "";
            let numStr = number.toString();
            let groups = [];

            // Split number into groups of three digits
            while (numStr.length > 0) {
                groups.push(numStr.slice(-3));
                numStr = numStr.slice(0, -3);
            }
            groups = groups.map((group) => group.padStart(3, "0")).reverse();

            for (let i = 0; i < groups.length; i++) {
                let [hundred, ten, unit] = groups[i];
                let groupText = "";

                // Hundreds place
                if (hundred !== "0") groupText += hundreds[hundred] + " ";

                // Tens place
                if (ten === "0" && unit !== "0") {
                    groupText += "lẻ ";
                } else if (ten === "1") {
                    groupText += "mười ";
                } else if (ten !== "0") {
                    groupText += tens[ten] + " ";
                }

                // Units place
                if (unit === "1" && ten !== "0" && ten !== "1") {
                    groupText += "mốt ";
                } else if (unit === "5" && ten !== "0") {
                    groupText += "lăm ";
                } else if (unit !== "0") {
                    groupText += units[unit] + " ";
                }

                // Add thousands, millions, billions units
                if (groupText.trim() !== "") {
                    groupText += thousands[groups.length - 1 - i] + " ";
                }
                result += groupText;
            }

            return capitalizeFirstLetter(result.trim()) + " đồng";
        };

        // Load cart when component is mounted
        onMounted(() => {
            cartStore.loadCart();
        });

        return {
            data_show_product_cart,
            totalCart,
            decreaseQuantity,
            increaseQuantity,
            removeBook,
            capitalizeFirstLetter,
            numberToVietnameseWords
        };
    }
};
</script>


<template>
    <div class="container" id="cartPage">
        <h4>GIỎ HÀNG ({{ data_show_product_cart.length }} sản phẩm)</h4>
        <div class="row">
            <div class="col-sm-12 col-lg-8">
                <table class="table">
                    <thead>
                        <tr>
                            <th class="text-center" scope="col">STT</th>
                            <th class="text-center" scope="col">Mô tả sản phẩm</th>
                            <th class="text-center" scope="col">Số lượng</th>
                            <th class="text-center" scope="col text-center">Thành tiền</th>
                            <th class="text-center" scope="col">Xóa sản phẩm</th>
                        </tr>
                    </thead>
                    <tbody style="border-radius:5px;">
                        <template v-if="data_show_product_cart.length === 0">
                            <tr>
                                <td colspan="5" class="text-center fw-bold" style="color:#ff1f1f;">
                                    Không có sản phẩm nào trong giỏ hàng!
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr v-for="(item, index) in data_show_product_cart" :key="item.TEN_SACH">
                                <td class="text-center align-middle">
                                    {{ ++index }}
                                </td>
                                <td class="d-md-flex">
                                    <div class="col-sm-12 col-md-3 text-center mx-1">
                                        <img :src="item.ANH_BIA" class="img-thumbnail" alt="..."
                                            style="max-height: 100px">
                                    </div>
                                    <div class="col-sm-12 col-md-9">
                                        <div class="mb-2"> {{ item.TEN_SACH }}</div>
                                        <div style="font-weight:bold">{{ item.GIA_MUA.toLocaleString() }}
                                            đ</div>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex justify-content-center">
                                        <button id="btn_decrease" @click="decreaseQuantity(item.MA_SACH)">-</button>
                                        <input type="text" v-model="item.SO_LUONG" class="fw-bold" id="input_quantity">
                                        <button id="btn_increase" @click="increaseQuantity(item.MA_SACH)">+</button>
                                    </div>
                                </td>
                                <td class="text-end text-nowrap" style="font-weight:bold;color:red;">
                                    {{ (item.GIA_MUA * item.SO_LUONG).toLocaleString() }} đ
                                </td>
                                <td class="text-center">
                                    <i @click="removeBook(item.MA_SACH)" class="fa-solid fa-trash" id="btn_delete"></i>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            <div class="col-sm-12 col-lg-4">
                <div style="border:1px solid #ccc;padding:10px;border-radius:10px;">
                    <div class="row d-flex flex-column mb-2" style="flex-wrap:nowrap">
                        <h5 class="text-center">Tổng số tiền (Gồm VAT)</h5>
                        <div class="text-center" style="font-size:30px;color:red;font-weight:bold;">
                            {{ totalCart.toLocaleString() }} đ
                        </div>
                        <div class="text-center fst-italic fw-normal">
                            Bằng chữ: <span style="color:red">{{ numberToVietnameseWords(totalCart) }}</span>
                        </div>
                    </div>
                    <router-link to="/order">
                        <button type="button" class="btn btn-info text-white fw-bold"
                            style="width:100%;background-color:#ff1f1f;">
                            THANH TOÁN
                        </button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>


<style>
#cartPage {
    margin-top: 50px;
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

#input_quantity {
    width: 50px;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 3px;
    text-align: center;
}


#btn_decrease:hover {
    background-color: #ff1f1f;
}


#btn_increase:hover {
    background-color: #ff1f1f;
}

.input_quantity {
    width: 100px;
    text-align: center;
}

#btn_delete:hover {
    color: #ff1f1f;
    cursor: pointer;
}
</style>