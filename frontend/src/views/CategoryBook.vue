<script>
import { ref, computed, watch, onMounted } from 'vue';
import BookService from '../services/Book.service';
import { useRouter, useRoute } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const route = useRoute();

        const categoryBook = ref([]);
        const nameCategory = ref('');
        const currentPage = ref(1);
        const itemsPerPage = 3;
        const totalPages = ref(0);

        const staticCategories = [
            'Văn Học',
            'Kinh Tế',
            'Tiểu Sử Hồi Ký',
            'Tâm Lý - Kỹ Năng Sống',
            'Sách Thiếu Nhi',
            'Sách Giáo Khoa - Tham Khảo'
        ];

        const pagesList = computed(() => {
            return Array.from({ length: totalPages.value }, (_, i) => i + 1);
        });

        const getDetailDataBook = async (page = 1) => {
            try {
                const response = await BookService.getBooksFiltered('', nameCategory.value, page, itemsPerPage);
                console.log(response);

                if (response?.books?.length) {
                    categoryBook.value = response.books;
                    totalPages.value = response.pagination?.TONG_SO_TRANG || 1;
                    currentPage.value = response.pagination?.TRANG_HIEN_TAI || page;
                } else {
                    categoryBook.value = [];
                    totalPages.value = 0;
                    currentPage.value = 0;
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu sách:", error);
            }
        };

        const goToPage = async (page) => {
            if (page >= 1 && page <= totalPages.value) {
                await getDetailDataBook(page);
            }
        };

        const filterBooksByCategory = (category) => {
            currentPage.value = 1;
            router.push({
                name: 'CategoryBook',
                params: { name: category }
            });
        };

        watch(
            () => route.params.name,
            (newName) => {
                nameCategory.value = newName === "Tất Cả Sách" ? '' : newName;
                getDetailDataBook(1);
            },
            { immediate: true }
        );

        onMounted(() => {
            getDetailDataBook();
        });

        return {
            categoryBook,
            nameCategory,
            currentPage,
            itemsPerPage,
            totalPages,
            staticCategories,
            pagesList,
            getDetailDataBook,
            goToPage,
            filterBooksByCategory
        };
    }
};
</script>


<template>
    <div class="container" id="category_book">
        <!-- BreadCrumb -->
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb" style="align-items: center;">
                <li class="breadcrumb-item">
                    <router-link to="/" style="color:#62ab00">Trang chủ</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{ nameCategory }}</li>
            </ol>
        </nav>

        <!-- Navbar and content category -->
        <div class="row">
            <!-- Left_nav -->
            <div class="col-lg-3" id="left_nav" style="height:fit-content;">
                <ul>
                    <router-link @click="filterBooksByCategory('Tất Cả Sách')" to="#">
                        <li>Tất cả sách</li>
                    </router-link>
                    <router-link v-for="(category, index) in staticCategories" :key="index" to="#"
                        @click="filterBooksByCategory(category)">
                        <li>{{ category }}</li>
                    </router-link>
                </ul>
            </div>
            <!-- Right_content -->
            <div class="col-lg right_content" id="danhmuc">
                <h3 style="color:#62ab00;margin:10px;">{{ nameCategory }}</h3>
                <div class="container row">
                    <div class="col-lg-4 mt-3 mb-3" v-for="item in categoryBook" :key="item.MA_SACH"
                        data-aos="fade-left">
                        <div class="card" style="width: 18rem;">
                            <img :src="item.ANH_BIA" class="card-img-top" alt="..." width="190" height="190"
                                style="object-fit: contain;">
                            <div class="card-body">
                                <span class="card-title" style="height:48px">{{ item.TEN_SACH }}</span>
                                <p class="card-text"><span class="fw-bold"> Giá bán:</span> <span
                                        class="text-danger fw-bold"> {{ item.GIA_BAN.toLocaleString() }} đ</span></p>
                                <router-link :to="{ name: 'Details', params: { id: item.MA_SACH } }">
                                    <button type="button" class="btn" id="btn_detail">Xem chi tiết</button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center fw-bold fs-4" v-if="currentPage == 0"> Rất tiếc, chúng tôi không có sách thuộc
                    thể loại này!</div>
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
    </div>
</template>
<style>
#category_book {
    margin-top: 20px;
}

#left_nav,
.right_content {
    border: 1px solid #ccc;
    border-radius: 10px;
}

#left_nav ul li {
    list-style: none;
    margin-top: 20px;

}

#left_nav {
    margin-right: 20px;
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
</style>