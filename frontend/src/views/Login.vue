<script>
import Login from "../components/Login.vue"
export default {
    components: {
        Login,
    },
};
</script>

<template>
    <div class="container">
        <h2 style="margin-top: 50px; margin-bottom:50px; text-align:center; 
            background-color:#ff1f1f; padding:10px; border-radius:10px; color:white;">
            ĐĂNG NHẬP
        </h2>
        <div class="h-100">
            <div class="container h-custom">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-sm-12 col-md-6 d-flex align-items-center" style="border-right:1px solid #ccc">
                        <img src="https://images.unsplash.com/photo-1544716278-e513176f20b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
                            class="img-fluid mx-auto" alt="Sample image">
                    </div>
                    <div class="col-sm-12 col-md-6">
                        <Login></Login>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>