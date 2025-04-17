<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import BookService from '../services/Book.service';

export default {
    setup() {
        const route = useRoute();

        // Reactive state
        const productfind = ref([]);
        const totalBook = ref(0);
        const keyword = ref('');
        const currentPage = ref(1);
        const itemsPerPage = ref(4); // Display 4 items per page
        const totalPages = ref(0);

        // Fetch data method
        const getDataProductSearch = async (page = 1) => {
            try {
                const result = await BookService.getBooksFiltered(route.params.name, '', page, 100000);
                const response = await BookService.getBooksFiltered(route.params.name, '', page, itemsPerPage.value);

                if (response.books.length === 0) {
                    keyword.value = route.params.name;
                    productfind.value = [];
                    totalBook.value = 0;
                    totalPages.value = 0;
                    currentPage.value = 0;
                } else {
                    // Assuming response has `books` and `total`
                    keyword.value = route.params.name;
                    productfind.value = response.books;
                    totalBook.value = result.books.length;
                    totalPages.value = response.pagination.TONG_SO_TRANG;
                    currentPage.value = response.pagination.TRANG_HIEN_TAI;
                }

            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        // Page navigation
        const goToPage = async (page) => {
            if (page >= 1 && page <= totalPages.value) {
                await getDataProductSearch(page);
            }
        };

        // Watch route changes to fetch new data
        watch(
            () => route.params.name,
            () => {
                getDataProductSearch();
            },
            { immediate: true }
        );

        // Initial data fetch
        onMounted(() => {
            getDataProductSearch();
        });

        return {
            productfind,
            totalBook,
            keyword,
            currentPage,
            itemsPerPage,
            totalPages,
            getDataProductSearch,
            goToPage
        };
    }
};
</script>


<template>
    <div class="container mt-5">
        <h2 class="mb-3">KẾT QUẢ TÌM KIẾM (<span style="color:#62ab00">{{ totalBook }}</span> kết quả) </h2>
        <h4>Từ khóa: <span style="color:#62ab00;font-size:30px">{{ keyword }}</span> </h4>
        <div class="d-flex row">
            <div class="col-lg-3 mt-4" v-for="item in productfind" :key=item.MA_SACH>
                <div class="card" style="width: 18rem;">
                    <img :src="item.ANH_BIA" class="card-img-top" alt="..." width="190" height="190"
                        style="object-fit: contain;">
                    <div class="card-body">
                        <span class="card-title" style="height:48px">{{ item.TEN_SACH }}</span>
                        <p class="card-text"><span class="fw-bold"> Giá bán:</span> <span class="text-danger fw-bold">
                                {{ item.GIA_BAN.toLocaleString() }} đ</span></p>
                        <router-link :to="{
                            name: 'Details',
                            params: { id: item.MA_SACH },
                        }">
                            <button type="button" class="btn" id="btn_detail">Xem chi
                                tiết</button>
                        </router-link>
                    </div>
                </div>
            </div>
            <!-- Pagination controls -->
            <div class="pagination-controls mt-3 text-center" v-if="currentPage != 0">
                <!-- Previous Page Button -->
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage <= 1 }">
                        <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1"><i
                                class="bi bi-chevron-left"></i>Trang trước</button>
                    </li>
                    <!-- Current Page and Total Pages -->
                    <li class="page-item disabled">
                        <span class="page-link fw-bold text-dark">Trang {{ currentPage }} / {{ totalPages }}</span>
                    </li>
                    <!-- Next Page Button -->
                    <li class="page-item" :class="{ disabled: currentPage === totalPages || currentPage === 0 }">
                        <button class="page-link" @click="goToPage(currentPage + 1)"
                            :disabled="currentPage === totalPages || currentPage === 0">Trang sau<i
                                class="bi bi-chevron-right"></i></button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<style>
#btn_detail {
    background-color: #ff1f1f;
    width: 100%;
    font-weight: bold;
    color: white;
}

.card-title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>