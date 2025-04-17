const express = require("express");
const cartsController = require("../controllers/carts.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();
const multer = require("multer");
const upload = multer();
module.exports.setup = (app) => {
  app.use("/api/cart", router);

  /**
   * @swagger
   * /api/cart:
   *    get:
   *        summary: Get information of all carts
   *        description: Get information of all carts
   *        tags:
   *            - cart
   *        responses:
   *          '200':
   *            description: The information of all carts
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    status:
   *                      type: string
   *                      description: The response status
   *                      enum: [success]
   *                    data:
   *                      type: object
   *                      properties:
   *                        carts:
   *                          type: array
   *                          items:
   *                            $ref: '#/components/schemas/Cart'
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while retrieving cart information
   */
  router.get("/", cartsController.getAllCarts);
  /**
   * @swagger
   * /api/cart/{cartId}:
   *    get:
   *        summary: Get information and items of a cart
   *        description: Get information and items of a cart
   *        parameters:
   *            - in: path
   *              name: cartId
   *              description: Cart ID
   *              required: true
   *              schema:
   *                type: string
   *        tags:
   *            - cart
   *        responses:
   *          '200':
   *            description: Successfully retrieved items from the cart
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    status:
   *                      type: string
   *                      description: The response status
   *                      enum: [success]
   *                    data:
   *                      type: object
   *                      properties:
   *                        cart:
   *                          $ref: '#/components/schemas/Cart'
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while retrieving cart items
   */
  router.get("/:cartId", cartsController.getCartItems);
  /**
   * @swagger
   * /api/cart/{userId}/now:
   *    get:
   *        summary: Get information about current cart of a user
   *        description: Get information about current cart of a user
   *        parameters:
   *          - in: path
   *            name: userId
   *            required: true
   *            description: User ID
   *            schema:
   *              type: string
   *        tags:
   *            - cart
   *        responses:
   *          '200':
   *            description: Successfully retrieved information of user's current cart
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    status:
   *                      type: string
   *                      description: The response status
   *                      enum: [success]
   *                    data:
   *                      type: object
   *                      properties:
   *                        cart:
   *                          $ref: '#/components/schemas/Cart'
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while retrieving user's cart information
   */
  router.get("/:userId/now", cartsController.getCurrentUserCart);
  /**
   * @swagger
   * /api/cart/{userId}/all:
   *    get:
   *        summary: Get information about all carts of a user
   *        description: Get information about all carts of a user
   *        parameters:
   *          - in: path
   *            name: userId
   *            required: true
   *            description: User ID
   *            schema:
   *              type: string
   *        tags:
   *            - cart
   *        responses:
   *          '200':
   *            description: Successfully retrieved information of user's carts
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    status:
   *                      type: string
   *                      description: The response status
   *                      enum: [success]
   *                    data:
   *                      type: object
   *                      properties:
   *                        carts:
   *                          type: array
   *                          items:
   *                            $ref: '#/components/schemas/Cart'
   *          '404':
   *            $ref: '#/components/responses/404'
   *            description: No cart found for the user
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while retrieving user's cart information
   */
  router.get("/:userId/all", cartsController.getUserCarts);
  /**
   * @swagger
   * /api/cart/{userId}:
   *    post:
   *        summary: Update cart state after checkout and add a new empty cart
   *        description: Update cart state after checkout and add a new empty cart
   *        parameters:
   *            - in: path
   *              name: userId
   *              description: User ID
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
   *                  TEN_NGUOI_NHAN:
   *                    type: string
   *                    require: true
   *                    description: Receiver's name
   *                    example: John Doe
   *                  SO_DIEN_THOAI:
   *                    type: string
   *                    require: true
   *                    description: Receiver's phone number
   *                    example: "0123456789"
   *                  DIA_CHI_NHAN:
   *                    type: string
   *                    require: true
   *                    description: Delivery address
   *                    example: "123 Main Street, City, Country"
   *        tags:
   *            - cart
   *        responses:
   *          '200':
   *            $ref: '#/components/responses/200'
   *            description: Successfully checkout the cart
   *          '404':
   *            $ref: '#/components/responses/404'
   *            description: Cart not found
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while checking out the cart
   */
  router.post("/:userId", upload.none(), cartsController.checkoutCart);
  /**
   * @swagger
   * /api/cart/{cartId}:
   *    patch:
   *        summary: Update cart state after delivering to customer
   *        description: Update cart state after delivering to customer
   *        parameters:
   *            - in: path
   *              name: cartId
   *              description: Cart ID
   *              required: true
   *              schema:
   *                type: string
   *        tags:
   *            - cart
   *        responses:
   *          '200':
   *            $ref: '#/components/responses/200'
   *            description: Successfully update cart state
   *          '404':
   *            $ref: '#/components/responses/404'
   *            description: Cart not found
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while updating cart state
   */
  router.patch("/:cartId", cartsController.deliverCart);
  /**
   * @swagger
   * /api/cart/{userId}/book/{bookId}:
   *    post:
   *        summary: Add a new book into a cart
   *        description: Add a new book into a cart
   *        parameters:
   *            - in: path
   *              name: userId
   *              description: User ID
   *              required: true
   *              schema:
   *                type: string
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
   *                  quantity:
   *                    type: integer
   *                    description: Quantity of books to add
   *                    example: 2
   *        tags:
   *          - cart
   *        responses:
   *          '200':
   *            $ref: '#/components/responses/200'
   *            description: Successfully added book to the cart
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while adding book to the cart
   */
  router.post("/:userId/book/:bookId", upload.none(), cartsController.addBook);

  /**
   * @swagger
   * /api/cart/{userId}/book/{bookId}:
   *    patch:
   *        summary: Update the number of a book in a cart
   *        description: Update the number of a book in a cart
   *        parameters:
   *          - in: path
   *            name: userId
   *            description: User ID
   *            required: true
   *            schema:
   *              type: string
   *          - in: path
   *            name: bookId
   *            description: Book ID
   *            required: true
   *            schema:
   *              type: string
   *        requestBody:
   *          required: true
   *          content:
   *            multipart/form-data:
   *              schema:
   *                type: object
   *                properties:
   *                  quantity:
   *                    type: integer
   *                    description: New quantity of the book (taken from form input)
   *                    example: 3
   *        tags:
   *          - cart
   *        responses:
   *          '200':
   *            $ref: '#/components/responses/200'
   *            description: Successfully updated the quantity of a book in the cart
   *          '404':
   *            $ref: '#/components/responses/404'
   *            description: Cart or book not found
   *          '400':
   *            $ref: '#/components/responses/400'
   *            description: Invalid quantity of a book
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while updating the quantity of a book in the cart
   */
  router.patch(
    "/:userId/book/:bookId",
    upload.none(),
    cartsController.updateBookNumber
  );

  /**
   * @swagger
   * /api/cart/{userId}/book/{bookId}:
   *    delete:
   *        summary: Delete a book in a cart
   *        description: Delete a book in a cart
   *        parameters:
   *            - in: path
   *              name: userId
   *              description: User ID
   *              required: true
   *              schema:
   *                type: string
   *            - in: path
   *              name: bookId
   *              description: Book ID
   *              required: true
   *              schema:
   *                type: string
   *        tags:
   *            - cart
   *        responses:
   *          '200':
   *            $ref: '#/components/responses/200'
   *            description: Successfully delete a book in the cart
   *          '404':
   *            $ref: '#/components/responses/404'
   *            description: Cart or book not found
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while delete book in the cart
   */
  router.delete("/:userId/book/:bookId", cartsController.deleteBook);

  router.all("/", methodNotAllowed);
  router.all("/:cartId", methodNotAllowed);
  router.all("/:userId", methodNotAllowed);
  router.all("/:userId/now", methodNotAllowed);
  router.all("/:userId/all", methodNotAllowed);
  router.all("/:userId/book/:bookId", methodNotAllowed);
};
