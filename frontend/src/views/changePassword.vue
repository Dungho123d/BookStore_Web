<script>
import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import UserService from '../services/User.service';

export default {
    setup() {
        const router = useRouter();
        const route = useRoute();

        // Using reactive for userDataInput
        const userDataInput = reactive({
            old_password: "",
            new_password: "",
            renew_password: ""
        });

        const backPage = () => {
            router.push(`/infoUser/${route.params.id}`);
        };

        const handleChangePassword = async () => {
            if (!userDataInput.old_password || !userDataInput.new_password || !userDataInput.renew_password) {
                alert("Vui lòng nhập đầy đủ các trường thông tin!");
            } else {
                if (userDataInput.new_password === userDataInput.renew_password) {
                    try {
                        await UserService.changeUserPassword(
                            route.params.id,
                            userDataInput.old_password,
                            userDataInput.new_password,
                            userDataInput.renew_password
                        );
                        alert("Đổi mật khẩu thành công!");
                        router.push(`/infoUser/${route.params.id}`);
                    } catch (err) {
                        alert("Đổi mật khẩu thất bại!");
                    }
                } else {
                    alert("Mật khẩu không trùng khớp!");
                }
            }
        };
        return {
            userDataInput,
            backPage,
            handleChangePassword
        };
    }
};
</script>
<template>
    <div class="container" style="margin-top:90px;">
        <!-- Giao diện chỉnh sửa thông tin cá nhân -->
        <form @submit.prevent id="form_editUser" style="width:100%;">
            <button @click="backPage()" type="button" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i> Trở
                về</button>
            <br>
            <h2 class="text-center" style="color:#62ab00">Đổi mật khẩu</h2>
            <!-- Title Input -->
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label fw-bold">Nhập mật khẩu cũ: </label>
                <input type="password" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                    placeholder="Vui lòng nhập vào mật khẩu cũ" name="old_password" v-model="userDataInput.old_password"
                    required>
            </div>
            <div class="mb-3">
                <label for="exampleInputEmail2" class="form-label fw-bold">Nhập mật khẩu mới: </label>
                <input type="password" class="form-control" id="exampleInputEmail2" aria-describedby="emailHelp"
                    placeholder="Vui lòng nhập vào mật khẩu mới" name="new_password"
                    v-model="userDataInput.new_password" required>
            </div>
            <div class="mb-3">
                <label for="exampleInputEmail3" class="form-label fw-bold">Nhập lại mật khẩu mới: </label>
                <input type="password" class="form-control" id="exampleInputEmail3" aria-describedby="emailHelp"
                    placeholder="Vui lòng nhập lại mật khẩu mới" v-model="userDataInput.renew_password" required>
            </div>
            <button @click="handleChangePassword()" type="submit" class="btn btn-light fw-bold"
                style="padding: 10px;border:1px solid #ccc">Xác Nhận
            </button>
        </form>
    </div>
</template>