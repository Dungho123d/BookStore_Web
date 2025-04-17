<template>
    <div class="container-fluid" style="    width: 100%;
        margin-top: 17px;
        border: 2px solid #ccc;
        padding: 8px;
        border-radius: 14px">
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
                    aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                    aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                    aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="@/assets/img/slider/NXBTre-920x420-v23.png"
                        class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="@/assets/img/slider/920x420_phienchodocu.png"
                        class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="@/assets/img/slider/Gold_DongA_600X350.jpg"
                        class="d-block w-100" alt="...">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
</template>
<style>
.carousel {
    z-index: 1;
    /* Đảm bảo z-index của carousel thấp hơn navbar */
}
</style>