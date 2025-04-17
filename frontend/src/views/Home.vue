<script>
import { ref, onMounted } from 'vue';
import BookService from '../services/Book.service';
import SliderProduct from '../components/SliderProduct.vue';

export default {
    components: {
        SliderProduct
    },
    setup() {
        const BookData = ref([]);
        const currentPage = ref(1);
        const itemsPerPage = ref(4); // Display 4 items per page
        const totalPages = ref(0);

        // Lấy danh sách tất cả sách
        const getDataBook = async (page = 1) => {
            try {
                const response = await BookService.getBooksFiltered("", "", page, itemsPerPage.value);
                BookData.value = response.books;

                if (response.books.length === 0) {
                    totalPages.value = 0;
                    currentPage.value = 0;
                } else {
                    totalPages.value = response.pagination.TONG_SO_TRANG;
                    currentPage.value = response.pagination.TRANG_HIEN_TAI;
                }
            } catch (error) {
                console.error(error);
            }
        };

        // Điều hướng đến trang mới
        const goToPage = async (page) => {
            if (page >= 1 && page <= totalPages.value) {
                await getDataBook(page);
            }
        };

        onMounted(() => {
            getDataBook().catch((error) => console.error("Error in getDataBook:", error));
        });

        return {
            BookData,
            currentPage,
            itemsPerPage,
            totalPages,
            getDataBook,
            goToPage
        };
    }
};
</script>


<template>
    <div class="container" id="main_page">
        <!-- Slider Image -->
        <SliderProduct></SliderProduct>

        <!-- Main_Content_book-->
        <div class="row mt-5 item_book">
            <h4><i class="fa-solid fa-fire"></i> Sản phẩm</h4>
            <div class="col-lg-3" v-for="item in BookData" :key="item.MA_SACH" data-aos="zoom-out-left">
                <div class="card" style="width: 18rem;">
                    <img :src="item.ANH_BIA" class="card-img-top" alt="Book Image" width="190" height="190"
                        style="object-fit: contain;">
                    <div class="card-body">
                        <span class="card-title" style="height:48px">{{ item.TEN_SACH }}</span>
                        <p class="card-text"><span class="fw-bold"> Giá bán:</span> <span class="text-danger fw-bold">
                                {{ item.GIA_BAN.toLocaleString() }} đ</span></p>
                        <router-link :to="{ name: 'Details', params: { id: item.MA_SACH } }">
                            <button type="button" class="btn" id="btn_detail">Xem chi tiết</button>
                        </router-link>
                    </div>
                </div>
            </div>
            <!-- Pagination controls -->
                <div class="pagination-controls mt-3 text-center" v-if="currentPage != 0">
                    <!-- Previous Page Button -->
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: currentPage <= 1 }">
                            <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1"><i class="bi bi-chevron-left"></i>Trang trước</button>
                        </li>
                        <!-- Current Page and Total Pages -->
                        <li class="page-item disabled">
                            <span class="page-link fw-bold text-dark">Trang {{ currentPage }} / {{ totalPages }}</span>
                        </li>
                        <!-- Next Page Button -->
                        <li class="page-item" :class="{ disabled: currentPage === totalPages || currentPage === 0 }">
                            <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages || currentPage === 0">Trang sau<i class="bi bi-chevron-right"></i></button>
                        </li>
                    </ul>
                </div>
        </div>

        <!-- Img_Banner_Adv   -->
        <div class="row mt-5" data-aos="fade-up">
            <div class="col">
                <img src="https://thietkelogo.edu.vn/uploads/images/thiet-ke-do-hoa-khac/banner-sach/14.png"
                    class="img-fluid" alt="..." width="100%">
            </div>
            <div class="col">
                <img src="https://thietkelogo.edu.vn/uploads/images/thiet-ke-do-hoa-khac/banner-sach/3.jpg"
                    class="img-fluid" alt="..." width="100%">
            </div>
        </div>

    </div>
</template>


<style>
#main_page {
    height: 100%;
}

.item_book h4 {
    background-color: #ff1f1f;
    border-radius: 5px;
    text-align: center;
    color: white;
    padding: 5px;
    margin-bottom: 19px;
}

.item_book {
    border: 1.5px solid #ff1f1f;
    border-radius: 5px;
    padding: 5px;
}

.card-title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

#btn_detail {
    background-color: #ff1f1f;
    width: 100%;
    font-weight: bold;
    color: white;
}

/* CSS */
.button-88 {
    display: flex;
    align-items: center;
    font-family: inherit;
    font-weight: 500;
    font-size: 16px;
    padding: 0.7em 1.4em 0.7em 1.1em;
    color: white;
    background: #ad5389;
    background: linear-gradient(0deg, rgba(20, 167, 62, 1) 0%, rgba(102, 247, 113, 1) 100%);
    border: none;
    box-shadow: 0 0.7em 1.5em -0.5em #14a73e98;
    letter-spacing: 0.05em;
    border-radius: 20em;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
}

.button-88:hover {
    box-shadow: 0 0.5em 1.5em -0.5em #14a73e98;
}

.button-88:active {
    box-shadow: 0 0.3em 1em -0.5em #14a73e98;
}
</style>