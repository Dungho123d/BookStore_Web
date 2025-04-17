const express = require("express");
const cors = require("cors");
const JSend = require("./jsend");
const cartsRouter = require("./routes/carts.router");
const usersRouter = require("./routes/users.router");
const booksRouter = require("./routes/books.router");
const { specs, swaggerUi } = require("./docs/swagger");
const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");    

const app = express();
// Cấu hình CORS để chấp nhận từ frontend
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/public", express.static("public"));

booksRouter.setup(app);
cartsRouter.setup(app);
usersRouter.setup(app);

app.use(resourceNotFound);
app.use(handleError);

module.exports = app;
