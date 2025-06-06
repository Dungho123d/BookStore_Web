const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;
const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  },
});
// Kiểm tra kết nối với cơ sở dữ liệu
knex
  .raw("SELECT 1")
  .then(() => {
    console.log("Kết nối cơ sở dữ liệu thành công!");
  })
  .catch((err) => {
    console.error("Kết nối cơ sở dữ liệu thất bại:", err.message);
  });

module.exports = knex;
