<script>
import UserService from '../services/User.service';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useUserStore } from '../stores/user.store';
import { useCartStore } from '@/stores/cart.store';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    setup() {
        const userStore = useUserStore();
        const cartStore = useCartStore();
        const router = useRouter();

        // Form schema for validation
        const Loginform = yup.object().shape({
            username: yup
                .string()
                .required("Tên tài khoản là bắt buộc.")
                .max(30, "Tên tài khoản tối đa 30 ký tự."),
            password: yup
                .string()
                .min(6, "Mật khẩu phải có ít nhất 6 kí tự")
                .required("Mật khẩu là bắt buộc.")
        });

        // Form input data
        const userDataInput = reactive({
            username: "",
            password: ""
        });

        // Handle login function
        const handleLoginUser = async (values) => {
            try {
                const userDataLogin = await UserService.login(values.username, values.password);

                // Save JWT to localStorage if login successful
                localStorage.setItem('username', userDataLogin.username);
                localStorage.setItem('userRole', userDataLogin.role);
                alert("Đăng nhập thành công!");

                userStore.checkUserStatus();
                if (userStore.isAdmin) {
                    router.push({ name: "HomeAdmin" });
                } else {
                    cartStore.loadCart();
                    router.push({ name: "Home" });
                }
            } catch (err) {
                console.error(err);
                alert("Tên tài khoản hoặc mật khẩu không chính xác, vui lòng nhập lại!");
            }
        };

        return {
            Loginform,
            userDataInput,
            handleLoginUser,
            userStore,
            cartStore
        };
    }
};
</script>


<template>
    <div>
        <Form :validation-schema="Loginform" @submit="handleLoginUser">
            <div class="mb-3">
                <label for="username" class="form-label fw-bold">Tên tài khoản: </label>
                <Field id="username" placeholder="Nhập tên tài khoản" name="username" type="text"
                    class="form-control form-control-lg" v-model="userDataInput.username" required
                    autocomplete="username" />
                <ErrorMessage name="username" class="text-danger" />
            </div>

            <div class="mb-3">
                <label for="password" class="form-label fw-bold">Mật khẩu: </label>
                <Field id="password" placeholder="Nhập mật khẩu" name="password" type="password"
                    class="form-control form-control-lg" v-model="userDataInput.password" required
                    autocomplete="current-password" />
                <ErrorMessage name="password" class="text-danger" />
            </div>

            <button type="submit" class="btn btn-light fw-bold" style="padding: 10px; border:1px solid #ccc">Đăng
                nhập</button>
            <p class="mt-4">Nếu chưa có tài khoản, hãy <router-link to="/register" class="link-danger">Đăng
                    ký</router-link></p>
        </Form>
    </div>
</template>

<style scoped>
span {
    display: block;
}

.form-control-lg {
    font-size: 15px;
}
</style>
