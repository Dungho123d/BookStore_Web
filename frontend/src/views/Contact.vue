<template>
    <div class="container" id="main_page_contact">
        <div id="main_content">
            <h3>VIẾT NHẬN XÉT</h3>
            <hr>
            <div class="row">
                <p style="font-style: italic; opacity:0.6">
                    Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, chúng tôi sẽ liên lạc lại với bạn sớm
                    nhất có thể.
                </p>
                <form>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Tên của bạn:</label>
                        <input type="text" class="form-control" name="usernameInput" id="exampleInputEmail1"
                            aria-describedby="emailHelp" required>
                        <div id="emailHelp" class="form-text"></div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email:</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" name="emailInput"
                            aria-describedby="emailHelp" required>
                    </div>

                    <div class="form-floating">
                        <textarea required class="form-control" placeholder="Leave a comment here"
                            id="floatingTextarea2" name="commentInput" style="height: 100px"></textarea>
                        <label for="floatingTextarea2">Viết bình luận</label>
                    </div>
                    <br>
                    <button type="submit" class="btn btn-primary">Gửi liên hệ</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style>
#main_page_contact {
    height: 100%;
}

#main_content {
    border: 2px solid #62ab00;
    margin-top: 20px;
    padding: 20px;
    border-radius: 10px;
}

span.contact {
    color: #62ab00;
    font-weight: bold;
}
</style>