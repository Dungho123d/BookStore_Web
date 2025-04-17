<template>
    <div>
        <Form :validation-schema="Registerform" @submit.prevent>
            <!-- UserName Input -->
            <div class="mb-3">
                <label for="inputUserName" class="form-label fw-bold">Tên tài khoản: </label>
                <Field id="inputUserName" placeholder="Nhập vào tên tài khoản" name="username" type="text"
                    class="form-control form-control-lg" v-model="userDataInput.username" required />
                <ErrorMessage name="username" class="text-danger" />
            </div>

            <!-- Email Input -->
            <div class="mb-3">
                <label for="email" class="form-label fw-bold">Email: </label>
                <Field id="email" placeholder="Nhập vào Email" name="email" type="email"
                    class="form-control form-control-lg" v-model="userDataInput.email" required />
                <ErrorMessage name="email" class="text-danger" />
            </div>

            <!-- PhoneNumber Input -->
            <div class="mb-3">
                <label for="inputphonenumber" class="form-label fw-bold">Số điện thoại: </label>
                <Field id="inputphonenumber" placeholder="Nhập vào số điện thoại" name="phoneNumber" type="text"
                    class="form-control form-control-lg" v-model="userDataInput.phoneNumber" required />
                <ErrorMessage name="phoneNumber" class="text-danger" />
            </div>

            <!-- Password Input -->
            <div class="mb-3">
                <label for="password" class="form-label fw-bold">Mật khẩu: </label>
                <Field id="password" placeholder="Nhập vào mật khẩu" name="password" type="password"
                    class="form-control form-control-lg" v-model="userDataInput.password" required />
                <ErrorMessage name="password" class="text-danger" />
            </div>

            <!-- Confirm Password Input -->
            <div class="mb-3">
                <label for="confirmPassword" class="form-label fw-bold">Xác nhận mật khẩu: </label>
                <Field id="confirmPassword" placeholder="Xác nhận mật khẩu" name="confirmPassword" type="password"
                    class="form-control form-control-lg" v-model="userDataInput.confirmPassword" required />
                <ErrorMessage name="confirmPassword" class="text-danger" />
            </div>

            <button type="submit" class="btn btn-light fw-bold" style="padding: 10px; border: 1px solid #ccc"
                @click="createUser">Đăng ký</button>
            <p class="mt-4">Nếu đã có tài khoản, hãy nhấn vào
                <router-link to="/login" class="link-danger">Đăng nhập</router-link>
            </p>
        </Form>
    </div>
</template>

<script>
import { reactive } from 'vue';
import UserService from '../services/User.service';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useRouter } from 'vue-router';

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    setup() {
        const router = useRouter();

        // Form validation schema
        const Registerform = yup.object().shape({
            username: yup
                .string()
                .required("Vui lòng nhập tên tài khoản!"),
            email: yup
                .string()
                .required("Email phải có giá trị.")
                .email("Email không đúng định dạng")
                .max(30, "Email tối đa 30 ký tự."),
            phoneNumber: yup
                .string()
                .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Số điện thoại không hợp lệ.")
                .required("Số điện thoại không được bỏ trống"),
            password: yup
                .string()
                .min(6, "Mật khẩu phải có ít nhất 6 kí tự")
                .required("Mật khẩu phải có giá trị."),
            confirmPassword: yup
                .string()
                .oneOf([yup.ref('password'), null], "Mật khẩu không khớp")
                .required("Bạn cần xác nhận mật khẩu"),
        });

        // Reactive data for form inputs and toast notifications
        const userDataInput = reactive({
            username: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: ""
        });

        // Function to handle user creation
        const createUser = async () => {
            try {
                // Check if all fields are filled
                if (Object.values(userDataInput).some(value => value === "")) {
                    alert("Vui lòng điền đầy đủ các trường thông tin!")
                    return;
                }
                // Call to UserService to create the account
                await UserService.createAccount(
                    userDataInput.phoneNumber,
                    userDataInput.username,
                    userDataInput.password,
                    userDataInput.confirmPassword
                );
                // Success notification and Redirect to login page
                alert("Đăng ký thành công!");
                router.push({ name: "Login" });
            } catch (err) {
                console.error(err);
                // Failure notification
                alert("Đăng ký tài khoản không thành công!");
            }
        };

        return {
            Registerform,
            userDataInput,
            createUser
        };
    }
};
</script>


<style scoped>
span {
    display: block;
}

.form-control-lg {
    font-size: 15px;
}
</style>
