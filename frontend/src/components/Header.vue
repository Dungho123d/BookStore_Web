<template>
    <div>
        <!-- Header1 -->
        <nav class="navbar navbar-expand-lg navbar-light" id="top_nav">
            <div class="container" style="height: 100%">
                <router-link class="navbar-brand" :to="isAdmin ? '/admin' : '/'" style="margin-right: 100px">
                    <img src="@/assets/img/logo_ZBooks.png" alt="..." height="80px" />
                </router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent1" aria-controls="navbarSupportedContent1"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse flex-row justify-content-end" id="navbarSupportedContent1"
                    style="max-height: 80px;">
                    <!-- Khung tìm kiếm -->
                    <div class="input-group" v-if="!isAdmin">
                        <form class="d-flex" style="width: 500px; height: max-content;" @submit.prevent="handleSearch">
                            <input type="text" class="form-control" placeholder="Nhập vào tên sách hoặc mô tả..."
                                aria-label="Recipient's username" aria-describedby="basic-addon2"
                                style="border-radius: 6px" v-model="inputSearch" @input="handleInputSearch" />
                            <span v-if="inputSearch !== ''">
                                <button id="btn_search" type="submit" style="width: 120px; height: 50px; border-radius: 6px">
                                    Tìm kiếm
                                </button>
                            </span>
                        </form>
                        <!-- Hiển thị kết quả tìm kiếm dưới ô input -->
                        <div v-if="searchResults.length > 0" class="search-results">
                            <ul>
                            <li v-for="result in searchResults" :key="result.MA_SACH" @click="goToDetail(result)">
                                <div class="search-result-item">
                                <img :src="result.ANH_BIA" alt="book image" class="search-result-image" />
                                <div class="search-result-info">
                                    <div class="search-result-title">{{ result.TEN_SACH }}</div>
                                    <div class="search-result-price">{{ result.GIA_BAN.toLocaleString() }} đ</div>
                                </div>
                                </div>
                            </li>
                            </ul>
                        </div>
                    </div>
                    <!-- Các thành phần căn phải -->
                    <!-- Đã đăng nhập -->
                    <div class="d-flex flex-row" v-if="isLoggedIn">
                        <div>
                            <div class="d-flex flex-column" style="min-width: 100px; max-width: max-content;">
                                <div class="text-center mb-1" style="white-space: nowrap;">
                                    <router-link :to="{ name: 'infoUser', params: { id: username } }">
                                        Xin chào, <span class="fw-bold">{{ username }}</span>
                                    </router-link>
                                </div>
                                <div class="mx-auto" style="white-space: nowrap;">
                                    <button @click="handleLogout()"
                                        class="btn btn-danger text-white text-decoration-none text-dark" style="
                                    width: fit-content;
                                    height: 35px;
                                    display: flex;
                                    align-items: center;
                                    margin-top: 3px;
                                    justify-content: center;
                                ">
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style="width: 100px" v-if="isAdmin"></div>
                    </div>
                    <!-- Chưa đăng nhập -->
                    <div style="height: 80px" v-else>
                        <div class="d-flex flex-column h-100" style="min-width: 100px; max-width: max-content;">
                            <div class="fw-bold text-center my-auto" style="white-space: nowrap;">
                                <router-link to="/login" class="text-decoration-none text-dark">Đăng
                                    nhập</router-link>
                            </div>
                            <div class="text-center my-auto" style="white-space: nowrap;">
                                <router-link to="/register" class="text-decoration-none text-dark">Đăng
                                    ký</router-link>
                            </div>
                        </div>
                    </div>
                    <!-- cart_icon -->
                    <div id="icon_cart" class="align-items-center" style="width: 200px" v-if="!isAdmin">
                        <router-link :to="`/cart`" class="d-flex justify-content-center mb-1 mt-1">
                            <i class="fa-solid fa-cart-shopping" style="color: #ff1f1f; position: relative">
                                <span style="
                                    position: absolute;
                                    border-radius: 50%;
                                    background-color: black;
                                    color: white;
                                    top: -8px;
                                    right: -6px;
                                    padding: 2px;
                                    font-size: 15px;
                                    width: 20px;
                                    height: 20px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                ">{{ numofBooks }}</span>
                            </i>
                        </router-link>
                        <div class="text-center" style="font-size: 8px">Giỏ hàng</div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Header 2 -->
        <nav class="navbar navbar-expand-lg navbar-light" id="nav_bottom">
            <div class="container" style="height: max-content">
                <div class="navbar-brand" v-if="!isAdmin" href="#" style="margin-right: 50px;">
                    <!-- Dropdown cho Danh Mục Sản Phẩm -->
                    <div class="dropdown">
                        <button class="btn dropdown-toggle text-light fw-bold" type="button" id="dropdownMenuButton1"
                            data-bs-toggle="dropdown" aria-expanded="false"
                            style="border: 2px solid white; padding: 10px;">
                            <i class="fa-solid fa-bars"></i>
                            &nbsp; DANH MỤC SẢN PHẨM
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1"
                            style="list-style: none; color: black; font-size: 15px; z-index: 1600;">
                            <div class="container d-flex flex-column">
                                <router-link @click="filterBooksByCategory('Tất Cả Sách')" to="#">
                                    <li>Tất cả sách</li>
                                </router-link>
                                <!-- Hiển thị các thể loại tĩnh -->
                                <router-link v-for="(category, index) in staticCategories" :key="index" to="#"
                                    @click="filterBooksByCategory(category)">
                                    <li>{{ category }}</li>
                                </router-link>
                            </div>
                        </ul>
                    </div>
                </div>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">

                    <div class="w-100 contentNavbarBottom" style="" v-if="!isAdmin">
                        <ul class="nav d-flex justify-content-around">
                            <li class="nav-item">
                                <router-link to="/" class="nav-link text-decoration-none text-white">
                                    TRANG CHỦ
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link to="/storesystem" class="nav-link text-decoration-none text-white">
                                    HỆ THỐNG NHÀ SÁCH
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link to="/introduce" class="nav-link text-decoration-none text-white">
                                    GIỚI THIỆU
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link to="/contact" class="nav-link text-decoration-none text-white">
                                    LIÊN HỆ
                                </router-link>
                            </li>
                        </ul>
                    </div>
                    <div class="w-100 contentNavbarBottom" v-else>
                        <ul class="nav d-flex justify-content-around">
                            <li class="nav-item">
                                <router-link to="/admin" class="nav-link text-decoration-none text-white">
                                    TRANG CHỦ
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link to="/admin/ManageBooks" class="nav-link text-decoration-none text-white">
                                    QUẢN LÝ SÁCH
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link to="/admin/ManageOrders" class="nav-link text-decoration-none text-white">
                                    QUẢN LÝ GIỎ HÀNG - ĐƠN HÀNG
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hiển thị sách theo thể loại đã chọn -->
        <div v-if="filteredBooks.length > 0" class="mt-5">
            <h4>Sách theo thể loại: {{ selectedCategory }}</h4>
            <div class="row">
                <div class="col-lg-4" v-for="book in filteredBooks" :key="book.MA_SACH">
                    <div class="card" style="width: 18rem" data-aos="zoom-in-down">
                        <img :src="book.ANH_BIA" class="card-img-top" alt="..." width="190" height="190"
                            style="object-fit: contain" />
                        <div class="card-body">
                            <span class="card-title" style="height: 48px">{{ book.TEN_SACH }}</span>
                            <p class="card-text">
                                <span class="fw-bold"> Giá bán:</span>
                                <span class="text-danger fw-bold"> {{ book.GIA_BAN }} đ </span>
                            </p>
                            <router-link :to="{ name: 'Details', params: { id: book.MA_SACH } }">
                                <button type="button" class="btn" id="btn_detail">
                                    Xem chi tiết
                                </button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, watch, computed } from 'vue';
import { useUserStore } from '@/stores/user.store';
import BookService from '@/services/Book.service';
import { useCartStore } from '@/stores/cart.store';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const userStore = useUserStore();
        const cartStore = useCartStore();
        const router = useRouter();
        // Define component data
        const searchResults = ref([]);
        const inputSearch = ref('');
        const username = ref('');
        const staticCategories = ['Văn Học', 'Kinh Tế', 'Tiểu Sử Hồi Ký', 'Tâm Lý - Kỹ Năng Sống', 'Sách Thiếu Nhi', 'Sách Giáo Khoa - Tham Khảo'];
        const filteredBooks = ref([]);
        const selectedCategory = ref('');

        // Computed properties to access store state
        const isLoggedIn = computed(() => userStore.isLoggedIn);
        const isAdmin = computed(() => userStore.isAdmin);
        const numofBooks = computed(() => cartStore.totalQuantity);

        // Watch for changes in isLoggedIn and trigger checkUserStatus if changed
        watch(isLoggedIn, (newVal) => {
                if (newVal) {
                    console.log('User has logged in:', userStore.username);
                    checkUserStatus();
                } else {
                    console.log('User has logged out');
                }
        });

        // Function to check user status from localStorage
        function checkUserStatus() {
            userStore.checkUserStatus();
            username.value = userStore.username; // Update username based on store
        }

        // Handle logout functionality
        function handleLogout() {
            if (confirm("Bạn có muốn đăng xuất khỏi tài khoản này không?")) {
                cartStore.resetCart();
                userStore.logout(); // Use the store's logout action to clear state
                alert("Đăng xuất thành công!");
                router.push({ name: 'Home' });
            }
        }

        // Filter books by category
        async function filterBooksByCategory(category) {
            selectedCategory.value = category;
            try {
                const books = await BookService.getBooksFiltered('', category);
                filteredBooks.value = books;
                router.push({
                    name: 'CategoryBook',
                    params: { name: category }
                });
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        }

        const handleSearch = () => {
            const searchKeyword = inputSearch.value; // Lưu giá trị từ khóa
            inputSearch.value = ""; // Xóa nội dung ô tìm kiếm
            searchResults.value = [];

            if (searchKeyword) {
                // Chuyển hướng đến trang tìm kiếm với từ khóa
                router.push({ name: 'FindProduct', params: { name: searchKeyword } });
            } else {
                alert("Vui lòng nhập từ khóa để tìm kiếm!");
            }
        };

        const handleInputSearch = async () => {
            const searchKeyword = inputSearch.value;
            if (searchKeyword && searchKeyword.length > 0 ) { // Only search if keyword is longer than 1 characters
                try {
                    
                    const results = await BookService.getBooksFiltered(searchKeyword , '', '', '') // Assume `searchBooks` is an API call for searching books
                    searchResults.value = results.books;
                    console.log(searchResults.value)

                } catch (error) {
                    console.error('Error fetching search results:', error);
                }
            } else {
                searchResults.value = []; // Clear results if search keyword is too short
            }
        };
        const goToDetail = (product) => {
            searchResults.value = [];
            const searchKeyword = inputSearch.value; // Lưu giá trị từ khóa
            inputSearch.value = ""; // Xóa nội dung ô tìm kiếm
            if(searchKeyword){
                router.push({ name: 'Details', params: { id: product.MA_SACH } });
            }else{
                alert("Vui lòng nhập từ khóa để tìm kiếm!");
            }
            
        };

        // Mounted lifecycle hook
        onMounted(() => {
            checkUserStatus();
            if (isLoggedIn.value) {
                cartStore.loadCart(); // Nếu đã đăng nhập, tải giỏ hàng từ cartStore
            } else {
                cartStore.resetCart(); // Nếu chưa đăng nhập, reset giỏ hàng
            }
        });

        // Return everything needed in the template
        return {
            searchResults,
            inputSearch,
            username,
            staticCategories,
            filteredBooks,
            selectedCategory,
            isLoggedIn,
            isAdmin,
            numofBooks,
            handleLogout,
            filterBooksByCategory,
            handleSearch,
            handleInputSearch,
            goToDetail
        };
    }
};
</script>

<style>
ul {
    text-decoration: none;
    width: 100%;
}

a {
    text-decoration: none !important;
    color: black;
}

img {
    line-height: 0;
}

.navbar-brand {
    padding: 0;
}

.dropdown-menu li {
    text-decoration: none !important;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    margin: 1px;
}

.dropdown-menu li:hover {
    color: #ff1f1f;
}

#btn_search {
    background-color: #ff1f1f;
    color: white;
    font-weight: bold;
    border: none;
}

#icon_cart {
    color: #ff1f1f;
    font-size: 30px;
}

#top_nav {
    height: 80px;
    padding-top: 0px;
    padding-bottom: 0px;
}

#nav_bottom {
    background-color: #ff1f1f;
    height: 76px;
}

#myBtn {
    display: none;
    position: fixed;
    bottom: 20px;
    right: 30px;
    z-index: 99;
    font-size: 18px;
    border: none;
    outline: none;
    background-color: #ff1f1f;
    color: white;
    cursor: pointer;
    padding: 15px;
    border-radius: 4px;
}

#myBtn:hover {
    background-color: #555;
}

.nav-item a:hover {
    color: black !important;
}


#navbarSupportedContent {
    z-index: 1500;
}

/* Tùy chỉnh thanh tìm kiếm */
.search-results {
    position: absolute;
    top: 60px; /* Điều chỉnh vị trí top để hiển thị dưới ô tìm kiếm */
    left: 0;
    right: 0;
    max-height: 300px; /* Tăng chiều cao để có thể chứa nhiều kết quả hơn */
    overflow-y: auto;
    background-color: white;
    border: 1px solid #ccc;
    z-index: 9999; /* Đảm bảo danh sách kết quả hiển thị trên các phần tử khác */
    border-radius: 6px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1); /* Tạo bóng cho kết quả */
}

/* Loại bỏ dấu đầu dòng của danh sách */
.search-results ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

/* Mỗi item trong kết quả tìm kiếm */
.search-result-item {
    display: flex;
    padding: 10px;
    cursor: pointer;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
}

.search-result-item:hover {
    background-color: #f1f1f1; /* Màu nền khi hover */
}

/* Hình ảnh sách */
.search-result-image {
    width: 50px;
    height: 70px;
    object-fit: cover;
    margin-right: 10px;
}

/* Thông tin về kết quả tìm kiếm */
.search-result-info {
    flex-grow: 1;
}

/* Tiêu đề sách */
.search-result-title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
}

/* Giá bán sách */
.search-result-price {
    font-size: 12px;
    color: #888;
}

/* Thanh header */
#top_nav {
    position: relative;
    height: 80px;
    padding-top: 0px;
    padding-bottom: 0px;
}

/* Đảm bảo kết quả tìm kiếm hiển thị trên thanh header */
#navbarSupportedContent {
    z-index: 1500;
}

.contentNavbarBottom {
    background-color: #ff1f1f;
    z-index: 1500;
}

</style>