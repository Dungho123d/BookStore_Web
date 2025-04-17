const express = require("express");
const usersController = require("../controllers/users.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();
const multer = require("multer");
const upload = multer();
module.exports.setup = (app) => {
  app.use("/api/user", router);

  /**
   * @swagger
   * /api/user:
   *    post:
   *        summary: Create a new user account
   *        description: Create a new user account
   *        requestBody:
   *          required: true
   *          content:
   *            multipart/form-data:
   *              schema:
   *                type: object
   *                properties:
   *                  phoneNumber:
   *                    type: string
   *                    required: true
   *                    description: Phone number of the user
   *                    example: '0123456789'
   *                  username:
   *                    type: string
   *                    required: true
   *                    description: Username for the account
   *                    example: username
   *                  password:
   *                    type: string
   *                    required: true
   *                    description: Password for the account
   *                    format: password
   *                    example: password
   *                  confirmPassword:
   *                    type: string
   *                    required: true
   *                    description: Confirmation of the password
   *                    format: password
   *                    example: password
   *        tags:
   *            - user
   *        responses:
   *          '201':
   *            $ref: '#/components/responses/200'
   *            description: User account created successfully
   *          '400':
   *            $ref: '#/components/responses/400'
   *            description: Invalid input data
   *          '409':
   *            $ref: '#/components/responses/400'
   *            description: Username already exists
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while creating user account
   */
  router.post("/", upload.none(), usersController.createAccount);

  /**
   * @swagger
   * /api/user/{userId}/password:
   *    post:
   *        summary: Change password for an account
   *        description: Change password for an account
   *        parameters:
   *          - in: path
   *            name: userId
   *            description: User ID
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
   *                  oldPassword:
   *                    type: string
   *                    required: true
   *                    description: Current password of the user
   *                    example: old_password
   *                    format: password
   *                  newPassword:
   *                    type: string
   *                    required: true
   *                    description: New password for the user
   *                    example: new_password
   *                    format: password
   *                  confirmNewPassword:
   *                    type: string
   *                    required: true
   *                    description: Confirmation of the new password
   *                    example: new_password
   *                    format: password
   *        tags:
   *            - user
   *        responses:
   *          '200':
   *            $ref: '#/components/responses/200'
   *            description: Password changed successfully
   *          '400':
   *            $ref: '#/components/responses/400'
   *            description: Invalid input data
   *          '401':
   *            $ref: '#/components/responses/400'
   *            description: Old password is incorrect
   *          '404':
   *            $ref: '#/components/responses/404'
   *            description: User not found
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while changing password
   */
  router.post(
    "/:userId/password",
    upload.none(),
    usersController.changeUserPassword
  );

  /**
   * @swagger
   * /api/user/login:
   *    post:
   *        summary: Login to an account
   *        description: Login to an account
   *        requestBody:
   *          required: true
   *          content:
   *            multipart/form-data:
   *              schema:
   *                type: object
   *                properties:
   *                  username:
   *                    type: string
   *                    required: true
   *                    description: Username of a user
   *                    example: username
   *                  password:
   *                    type: string
   *                    required: true
   *                    description: Password of a user (should be sent securely)
   *                    example: password
   *                    format: password
   *        tags:
   *            - user
   *        responses:
   *          '200':
   *            description: Login successfully
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
   *                        username:
   *                          type: string
   *                          example: username
   *                        role:
   *                          type: integer
   *                          example: 0
   *          '400':
   *            $ref: '#/components/responses/400'
   *            description: Invalid username or password
   *          '404':
   *            $ref: '#/components/responses/404'
   *            description: User not found
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occurred while logging in
   */
  router.post("/login", upload.none(), usersController.login);
  /**
   * @swagger
   * /api/user/logout:
   *    post:
   *        summary: Logout an account
   *        description: Logout an account
   *        tags:
   *            - user
   *        responses:
   *          '200':
   *            $ref: '#/components/responses/200'
   *            description: Logout successfully
   *          '500':
   *            $ref: '#/components/responses/500'
   *            description: Error occured while logging out
   */
  router.post("/logout", usersController.logout);

  router.all("/", methodNotAllowed);
  router.all("/login", methodNotAllowed);
  router.all("/logout", methodNotAllowed);
  router.all("/:userId/password", methodNotAllowed);
};
