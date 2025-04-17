const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Online bookstore web application",
      version: "1.0.0",
      description:
        "Project of CT313H (Web Technologies and Services/Công nghệ và Dịch vụ Web), Semester 1, 2024-2025",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/docs/components.yaml"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
