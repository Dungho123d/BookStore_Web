<template>
    <div class="container-fluid" id="main_content_pageAdmin">
        <div class="content_admin_page">
            <h1 class="text-center welcome-text">Xin chào bạn đến với trang quản lý</h1>
            <p class="text-center welcome-subtext">Chúng tôi rất vui khi bạn ghé thăm!</p>
        </div>
    </div>
</template>

<style scoped>
#main_content_pageAdmin {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('https://png.pngtree.com/background/20230519/original/pngtree-large-bookcase-with-many-books-and-lots-of-light-picture-image_2658801.jpg') no-repeat center center/cover; /* Replace with your image URL */
    background-color: #f4f6f9; /* Light background color for fallback */
}

.content_admin_page {
    background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    text-align: center;
    max-width: 800px;
    width: 800px;
}

.welcome-text {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 20px;
}

.welcome-subtext {
    font-size: 1.25rem;
    color: #7f8c8d;
    margin-top: 10px;
}

@media (max-width: 768px) {
    .welcome-text {
        font-size: 2rem;
    }

    .welcome-subtext {
        font-size: 1rem;
    }
}
</style>
