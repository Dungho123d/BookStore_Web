<script>
import { computed, ref } from 'vue';  // Cần import cả `ref`
import { useRoute } from 'vue-router';  // Hook để theo dõi route
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();  // Dùng useRoute để theo dõi route hiện tại

    // Khởi tạo searchResults là một mảng rỗng
    const searchResults = ref([]); 

    // Kiểm tra xem route hiện tại có phải là trang chi tiết không
    const isDetailPage = computed(() => route.name === 'Details');
    
    return {
      searchResults,
      isDetailPage
    };
  }
}
</script>

<template>
  <div>
    <div class="header">
      <Header />
    </div>
    <div class="main_content">
      <!-- Chỉ hiển thị kết quả tìm kiếm nếu không phải trang chi tiết -->
      <div v-if="!isDetailPage">
        <!-- Kiểm tra searchResults có tồn tại và có ít nhất một phần tử -->
        <div v-if="searchResults && searchResults.length > 0" class="search-results">
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
      <router-view></router-view> <!-- Nội dung chính của các trang khác -->
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>


