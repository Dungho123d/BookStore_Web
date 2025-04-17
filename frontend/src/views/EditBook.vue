<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BookService from '../services/Book.service';

export default {
    setup() {
        const router = useRouter();
        const route = useRoute();

        // Reactive state variables
        const BookDataInput = ref({
            MA_SACH: "",
            ANH_BIA: "",
            TEN_SACH: "",
            TAC_GIA: "",
            THE_LOAI: "",
            MO_TA: "",
            GIA_BAN: "",
            NHA_XUAT_BAN: ""
        });
        const imageFile = ref(null);

        // Method to load book data for editing
        const loadDataEditBook = async () => {
            try {
                const result = await BookService.getBookInfo(route.params.id);
                console.log(result);

                // Fill BookDataInput with API data
                BookDataInput.value = {
                    MA_SACH: result.book.MA_SACH,
                    ANH_BIA: result.book.ANH_BIA,
                    TEN_SACH: result.book.TEN_SACH,
                    TAC_GIA: result.book.TAC_GIA,
                    THE_LOAI: result.book.THE_LOAI,
                    MO_TA: result.book.MO_TA,
                    GIA_BAN: result.book.GIA_BAN,
                    NHA_XUAT_BAN: result.book.NHA_XUAT_BAN
                };
            } catch (err) {
                console.error("Error fetching book data:", err);
                alert("Không thể tải thông tin sách!");
            }
        };

        // Handle image file selection
        const onImageChange = (event) => {
            imageFile.value = event.target.files[0];
            if (imageFile.value) {
                BookDataInput.value.ANH_BIA = URL.createObjectURL(imageFile.value);
            }
        };

        // Handle book update
        const handleEditBook = async () => {
            try {
                const formData = new FormData();
                const { MA_SACH, TEN_SACH, TAC_GIA, THE_LOAI, GIA_BAN, MO_TA, NHA_XUAT_BAN } = BookDataInput.value;
                formData.append("MA_SACH", MA_SACH);
                formData.append("TEN_SACH", TEN_SACH);
                formData.append("TAC_GIA", TAC_GIA);
                formData.append("THE_LOAI", THE_LOAI);
                formData.append("GIA_BAN", GIA_BAN);
                formData.append("MO_TA", MO_TA);
                formData.append("NHA_XUAT_BAN", NHA_XUAT_BAN);

                // Add image file if selected
                if (imageFile.value) {
                    formData.append("ANH_BIA", imageFile.value);
                }

                await BookService.updateBook(route.params.id, formData);
                alert("Cập nhật sách thành công!");
                router.push("/admin/ManageBooks");
            } catch (err) {
                console.error("Error updating book:", err);
                alert("Cập nhật sách thất bại!");
            }
        };

        // Navigate back to the ManageBooks page
        const backPage = () => {
            router.push("/admin/ManageBooks");
        };

        // Load data on component mount
        onMounted(() => {
            loadDataEditBook();
        });

        return {
            BookDataInput,
            imageFile,
            onImageChange,
            handleEditBook,
            backPage
        };
    }
};
</script>


<template>

    <div class="container" style="margin-top:40px;">
        <h1 class="text-center">QUẢN LÝ SÁCH</h1>
        <div style="margin-top: 40px;"></div>
        <div>
            <form @submit.prevent="handleEditBook" style="width:100%;">
                <button @click="backPage" type="button" class="btn btn-primary">
                    <i class="fa-solid fa-arrow-left"></i> Trở về
                </button>
                <br>
                <h2 class="text-center">SỬA THÔNG TIN SÁCH</h2>

                <!-- MA_SACH Input -->
                <div class="mb-3">
                    <label for="bookId" class="form-label fw-bold">Mã sách:</label>
                    <input type="text" class="form-control" id="bookId" v-model="BookDataInput.MA_SACH" readonly>
                </div>

                <!-- TEN_SACH Input -->
                <div class="mb-3">
                    <label for="bookTitle" class="form-label fw-bold">Tên sách:</label>
                    <input type="text" class="form-control" id="bookTitle" v-model="BookDataInput.TEN_SACH" required>
                </div>

                <!-- ANH_BIA Input -->
                <div class="mb-3">
                    <label for="bookImage" class="form-label fw-bold">Ảnh bìa sách:</label>
                    <input type="file" class="form-control" id="bookImage" @change="onImageChange">
                </div>
                <div class="mb-3">
                    Ảnh bìa hiện tại:
                    <img :src="BookDataInput.ANH_BIA" alt="Ảnh bìa hiện tại" height="150"
                        v-if="BookDataInput.ANH_BIA" />
                </div>

                <!-- TAC_GIA Input -->
                <div class="mb-3">
                    <label for="bookAuthor" class="form-label fw-bold">Tác giả:</label>
                    <input type="text" class="form-control" id="bookAuthor" v-model="BookDataInput.TAC_GIA" required>
                </div>

                <!-- THE_LOAI Input -->
                <div class="mb-3">
                    <label for="bookCategory" class="form-label fw-bold">Thể loại:</label>
                    <select class="form-select" id="bookCategory" v-model="BookDataInput.THE_LOAI" required>
                        <option value="" disabled selected>Chọn thể loại sách</option>
                        <option value="Văn Học">Văn Học</option>
                        <option value="Kinh Tế">Kinh Tế</option>
                        <option value="Tiểu Sử Hồi Ký">Tiểu Sử Hồi Ký</option>
                        <option value="Tâm Lý - Kỹ Năng Sống">Tâm Lý - Kỹ Năng Sống</option>
                        <option value="Sách Thiếu Nhi">Sách Thiếu Nhi</option>
                        <option value="Sách Giáo Khoa - Tham Khảo">Sách Giáo Khoa - Tham Khảo</option>
                    </select>
                </div>

                <!-- GIA_BAN Input -->
                <div class="mb-3">
                    <label for="bookPrice" class="form-label fw-bold">Giá bán:</label>
                    <input type="text" class="form-control" id="bookPrice" v-model="BookDataInput.GIA_BAN" required>
                </div>

                <!-- MO_TA Input -->
                <div class="mb-3">
                    <label for="bookDescription" class="form-label fw-bold">Mô tả:</label>
                    <input type="text" class="form-control" id="bookDescription" v-model="BookDataInput.MO_TA" required>
                </div>

                <!-- NHA_XUAT_BAN Input -->
                <div class="mb-3">
                    <label for="bookNxb" class="form-label fw-bold">Nhà xuất bản:</label>
                    <input type="text" class="form-control" id="bookNxb" v-model="BookDataInput.NHA_XUAT_BAN" required>
                </div>

                <button type="submit" class="btn btn-light fw-bold" style="padding: 10px; border:1px solid #ccc">
                    Sửa thông tin
                </button>
            </form>
        </div>
    </div>
</template>