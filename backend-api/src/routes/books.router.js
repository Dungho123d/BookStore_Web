const express = require("express");
const booksController = require("../controllers/books.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/"); // Specify the upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save with a unique name
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });
module.exports.setup = (app) => {
  app.use("/api/book", router);

  /**
   * @swagger
   * /api/book:
   *    get:
   *        summary: Get books with filtered criteria
   *        description: Get books with filtered criteria
   *        parameters:
   *          - name: searchTerm
   *            in: query
   *            description: Keyword for searching in TEN_SACH, TAC_GIA, or NHA_XUAT_BAN
   *            required: false
   *            schema:
   *              type: string
   *          - name: theLoai
   *            in: query
   *            description: Type of the book
   *            required: false
   *            schema:
   *              type: string
   *          - name: page
   *            in: query
   *            description: Page number for pagination
   *            required: false
   *            schema:
   *              type: integer
   *              default: 1
   *          - name: limit
   *            in: query
   *            description: Number of books per page
   *            required: false
   *            schema:
   *              type: integer
   *              default: 20
   *        tags:
   *          - book
   *        responses:
   *          '200':
   *            description: A list of books
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    status:
   *                      type: string
   *                      description: Response status
   *                      enum: [success]
   *                    data:
   *                      type: object
   *                      properties:
   *                        books:
   *                          type: array
   *                          items:
   *                            $ref: '#/components/schemas/Book'
   *                        pagination:
   *                          type: object
   *                          properties:
   *                            TONG_SO_TRANG:
   *                              type: integer
   *                              example: 10
   *                              description: The total number of pages
   *                            TRANG_HIEN_TAI:
   *                              type: integer
   *                              example: 1
   *                              description: The current page number
   *                            SO_SACH_TREN_TRANG:
   *                              type: integer
   *                              example: 20
   *                              description: Number of books per page
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occured when finding books
   */
  router.get("/", booksController.getBooksFiltered);

  /**
   * @swagger
   * /api/book/{bookId}:
   *    get:
   *        summary: Get detailed information about a book
   *        description: Get detailed information about a book
   *        parameters:
   *          - name: bookId
   *            in: path
   *            required: true
   *            description: ID of the book
   *            schema:
   *              type: string
   *        tags:
   *            -   book
   *        responses:
   *          '200':
   *            description: The information of a book
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    status:
   *                      type: string
   *                      description: Response status
   *                      enum: [success]
   *                    data:
   *                      type: object
   *                      properties:
   *                        book:
   *                          $ref: '#/components/schemas/Book'
   *          '404':
   *            $ref: '#/components/responses/404'
   *            description: Book not found
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occured when finding a book
   */
  router.get("/:bookId", booksController.getBookInfo);

  /**
   * @swagger
   * /api/book:
   *    post:
   *        summary: Create a new book
   *        description: Create a new book
   *        requestBody:
   *          required: true
   *          content:
   *            multipart/form-data:
   *              schema:
   *                type: object
   *                properties:
   *                  MA_SACH:
   *                    type: string
   *                    description: The book ID
   *                    example: "S1"
   *                  TEN_SACH:
   *                    type: string
   *                    description: The book title
   *                    example: "Tên sách"
   *                  MO_TA:
   *                    type: string
   *                    description: Description of the book
   *                    example: "Mô tả sách"
   *                  THE_LOAI:
   *                    type: string
   *                    description: Type of the book
   *                    example: "Thể loại sách"
   *                  TAC_GIA:
   *                    type: string
   *                    description: Author of the book
   *                    example: "Tác giả sách"
   *                  NHA_XUAT_BAN:
   *                    type: string
   *                    description: Publisher of the book
   *                    example: "Nhà xuất bản"
   *                  GIA_BAN:
   *                    type: integer
   *                    description: Price of the book
   *                    example: 10000
   *                  ANH_BIA:
   *                    type: string
   *                    format: binary
   *                    description: Cover image file
   *        tags:
   *          -   book
   *        responses:
   *          '201':
   *            description: Book created successfully
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    status:
   *                      type: string
   *                      description: Response status
   *                      enum: [success]
   *                    data:
   *                      type: object
   *                      properties:
   *                        newBook:
   *                          $ref: '#/components/schemas/Book'
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occured when adding a new book
   */
  router.post("/", upload.single("ANH_BIA"), booksController.addBook);

  /**
   * @swagger
   * /api/book/{bookId}:
   *    patch:
   *        summary: Update the information of a book
   *        description: Update the information of a book
   *        parameters:
   *            - in: path
   *              name: bookId
   *              description: Book ID
   *              required: true
   *              schema:
   *                type: string
   *        requestBody:
   *          required: true
   *          content:
   *            multipart/form-data:
   *              schema:
   *                type: object
   *                properties:
   *                  TEN_SACH:
   *                    type: string
   *                    description: New title of the book
   *                    example: Tên sách
   *                  MO_TA:
   *                    type: string
   *                    description: New description of the book
   *                    example: Mô tả sách
   *                  THE_LOAI:
   *                    type: string
   *                    description: New type of the book
   *                    example: Thể loại sách
   *                  TAC_GIA:
   *                    type: string
   *                    description: New author of the book
   *                    example: Tác giả sách
   *                  NHA_XUAT_BAN:
   *                    type: string
   *                    description: New publisher of the book
   *                    example: Nhà xuất bản
   *                  GIA_BAN:
   *                    type: integer
   *                    description: New selling price of the book
   *                    example: 10000
   *                  ANH_BIA:
   *                    type: string
   *                    format: binary
   *                    description: New cover image URL of the book
   *        tags:
   *            - book
   *        responses:
   *          '200':
   *            description: Book updated successfully
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    status:
   *                      type: string
   *                      description: Response status
   *                      enum: [success]
   *                    data:
   *                      type: object
   *                      properties:
   *                        updatedBook:
   *                          $ref: '#/components/schemas/Book'
   *          '400':
   *            $ref: '#/components/responses/400'
   *            description: Invalid input data
   *          '404':
   *            $ref: '#/components/responses/404'
   *            description: Book not found
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while updating book
   */
  router.patch(
    "/:bookId",
    upload.single("ANH_BIA"),
    booksController.updateBook
  );

  /**
   * @swagger
   * /api/book/{bookId}/state:
   *    patch:
   *        summary: Update the state of a book
   *        description: Update the state of a book
   *        parameters:
   *            - in: path
   *              name: bookId
   *              description: Book ID
   *              required: true
   *              schema:
   *                type: string
   *        tags:
   *            - book
   *        responses:
   *          '200':
   *            description: Book state updated successfully
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    status:
   *                      type: string
   *                      description: Response status
   *                      enum: [success]
   *                    data:
   *                      type: object
   *                      properties:
   *                        updatedBook:
   *                          $ref: '#/components/schemas/Book'
   *          '400':
   *            $ref: '#/components/responses/400'
   *            description: Invalid input data
   *          '404':
   *            $ref: '#/components/responses/404'
   *            description: Book not found
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while updating book
   */
  router.patch("/:bookId/state", booksController.updateBookState);

  router.all("/", methodNotAllowed);
  router.all("/:bookId", methodNotAllowed);
  router.all("/:bookId/state", methodNotAllowed);
};
