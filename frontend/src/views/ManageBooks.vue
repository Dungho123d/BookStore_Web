<script>
import { ref, onMounted } from 'vue';
import BookService from '../services/Book.service';

export default {
    setup() {
        const ManageBooks = ref([]);
        const BookDataInput = ref({
            MA_SACH: "",
            TEN_SACH: "",
            ANH_BIA: "",
            TAC_GIA: "",
            THE_LOAI: "",
            GIA_BAN: "",
            MO_TA: "",
            NHA_XUAT_BAN: ""
        });
        const imageFile = ref(null);
        const inputSearch = ref("");
        const bookFields = {
            MA_SACH: "Mã sách",
            TEN_SACH: "Tên Sách",
            ANH_BIA: "Hình Ảnh Sách",
            TAC_GIA: "Tác Giả",
            THE_LOAI: "Thể Loại",
            GIA_BAN: "Giá Bán",
            MO_TA: "Mô Tả"
        };

        const getBookData = async () => {
            try {
                const response = await BookService.getBooksFiltered('', '', 1, 100000);
                ManageBooks.value = response.books;
            } catch (error) {
                console.error("Error fetching book data:", error);
            }
        };

        const onImageChange = (event) => {
            imageFile.value = event.target.files[0];
            if (imageFile.value) {
                BookDataInput.value.ANH_BIA = URL.createObjectURL(imageFile.value);
            }
        };

        const addBook = () => {
            document.querySelector("#table_manageBook").style.display = 'none';
            document.querySelector("#form_addBook").style.display = 'block';
            document.querySelector("#btn_addBook").style.display = 'none';
        };

        const backPage = () => {
            resetForm();
            document.querySelector("#form_addBook").style.display = 'none';
            document.querySelector("#table_manageBook").style.display = 'table';
            document.querySelector("#btn_addBook").style.display = 'inline-block';
        };

        const resetForm = () => {
            BookDataInput.value = {
                MA_SACH: "",
                TEN_SACH: "",
                ANH_BIA: "",
                TAC_GIA: "",
                THE_LOAI: "",
                GIA_BAN: "",
                MO_TA: "",
                NHA_XUAT_BAN: ""
            };
        };

        const handleAddBook = async () => {
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

                if (imageFile.value) {
                    formData.append("ANH_BIA", imageFile.value);
                }

                await BookService.addBook(formData);
                alert("Thêm sách mới thành công!");
                await getBookData();
                backPage();
            } catch (error) {
                console.error("Error adding book:", error);
                alert("Thêm sách thất bại!");
            }
        };

        onMounted(() => {
            getBookData();
        });

        return {
            ManageBooks,
            BookDataInput,
            imageFile,
            inputSearch,
            bookFields,
            getBookData,
            onImageChange,
            addBook,
            backPage,
            resetForm,
            handleAddBook
        };
    }
};
</script>

<template>
    <div class="content_admin_page">
        <h1 class="text-center">QUẢN LÝ SÁCH</h1>
        <div class="container text-center" style="margin-top:40px;">
            <button type="button" id="btn_addBook" class="btn btn-success" @click="addBook()"
                style="display: inline-block;">
                <i class="fa-solid fa-plus"></i> Thêm sách mới
            </button>
        </div>
        <!-- Giao diện thêm sách -->
        <div class="container">
            <form @submit.prevent id="form_addBook" style="display:none;">
                <button @click="backPage()" type="button" class="btn btn-primary">
                    <i class="fa-solid fa-arrow-left"></i> Trở về
                </button>
                <br>
                <h2 class="text-center">THÊM SÁCH MỚI</h2>
                <!-- IdBook Input -->
                <div class="mb-3">
                    <label for="bookId" class="form-label fw-bold">Mã sách: </label>
                    <input type="text" class="form-control" id="bookId" placeholder="Nhập vào mã sách..."
                        v-model="BookDataInput.MA_SACH" required>
                </div>
                <!-- Title Input -->
                <div class="mb-3">
                    <label for="bookTitle" class="form-label fw-bold">Tên sách: </label>
                    <input type="text" class="form-control" id="bookTitle" placeholder="Nhập vào tên sách..."
                        v-model="BookDataInput.TEN_SACH" required>
                </div>
                <!-- Img Input -->
                <div class="mb-3">
                    <label for="bookImage" class="form-label fw-bold">Ảnh bìa sách:</label>
                    <input type="file" class="form-control" id="bookImage" @change="onImageChange">
                </div>
                <div class="mb-3">
                    Ảnh bìa hiện tại:
                    <img :src="BookDataInput.ANH_BIA" alt="Ảnh bìa hiện tại" height="150"
                        v-if="BookDataInput.ANH_BIA" />
                </div>
                <!-- Author Input -->
                <div class="mb-3">
                    <label for="bookAuthor" class="form-label fw-bold">Tác giả: </label>
                    <input type="text" class="form-control" id="bookAuthor" placeholder="Nhập vào tên tác giả..."
                        v-model="BookDataInput.TAC_GIA" required>
                </div>
                <!-- Categories Input -->
                <div class="mb-3">
                    <label for="bookCategory" class="form-label fw-bold">Thể loại: </label>
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
                <!-- Price Input -->
                <div class="mb-3">
                    <label for="bookPrice" class="form-label fw-bold">Giá bán:</label>
                    <input type="text" class="form-control" id="bookPrice" placeholder="Nhập vào giá bán sách..."
                        v-model="BookDataInput.GIA_BAN" required>
                </div>
                <!-- Description Input -->
                <div class="mb-3">
                    <label for="bookDescription" class="form-label fw-bold">Mô tả: </label>
                    <input type="text" class="form-control" id="bookDescription" placeholder="Nhập vào mô tả sách..."
                        v-model="BookDataInput.MO_TA" required>
                </div>
                <!-- Publisher Input -->
                <div class="mb-3">
                    <label for="bookNxb" class="form-label fw-bold">Nhà xuất bản:</label>
                    <input type="text" class="form-control" id="bookNxb" placeholder="Nhập vào tên Nhà xuất bản..."
                        v-model="BookDataInput.NHA_XUAT_BAN" required>
                </div>
                <button @click="handleAddBook()" type="submit" class="btn btn-light fw-bold"
                    style="padding: 10px; border:1px solid #ccc">Thêm sách mới</button>
            </form>
        </div>
        <!-- Giao diện bảng Show Sách -->
        <div class="table-container mt-2">
            <table class="table" id="table_manageBook">
                <thead class="table-info text-center">
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Mã sách</th>
                        <th scope="col">Tên sách</th>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Tác giả</th>
                        <th scope="col">Nhà xuất bản</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Thể loại</th>
                        <th scope="col" style="min-width: 100px;">Giá</th>
                        <th scope="col">Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in ManageBooks" :key="item.MA_SACH">
                        <td class="text-center">{{ index + 1 }}</td>
                        <td>{{ item.MA_SACH }}</td>
                        <td>{{ item.TEN_SACH }}</td>
                        <td class="text-center" id="img_book">
                            <img :src="item.ANH_BIA" class="img-fluid" alt="..."
                                style="max-width: 80px; max-height: 80px;">
                        </td>
                        <td>{{ item.TAC_GIA }}</td>
                        <td>{{ item.NHA_XUAT_BAN }}</td>
                        <td>{{ item.MO_TA }}</td>
                        <td>{{ item.THE_LOAI }}</td>
                        <td class="text-end">{{ item.GIA_BAN.toLocaleString() }} đ</td>
                        <td>
                            <router-link :to="{ name: 'EditBook', params: { id: item.MA_SACH } }">
                                <button type="button" class="btn btn-warning"><i
                                        class="fa-regular fa-pen-to-square"></i> Sửa</button>
                            </router-link>
                            <br><br>
                        </td>
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

/* .table td {
    text-align: center;
} */
</style>
