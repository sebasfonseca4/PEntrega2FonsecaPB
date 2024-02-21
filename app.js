const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const path = require("path");
const app = express();

const httpServer = app.listen(3000, () => console.log('Servidor corriendo en el puerto: http://127.0.0.1:3000'))

const io = new Server(httpServer);

const connectDB = require("./dao/db");
connectDB();

app.engine(
  "handlebars",
  handlebars.engine({ extname: "hbs", defaultLayout: "", layoutsDir: "" })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const viewsRouter = require("./routes/views.router");
app.use("/", viewsRouter);

const productsRouter = require("./routes/products.router");
app.use("/", productsRouter);

const chatRouter = require("./routes/chat.router");
app.use("/chat", chatRouter);

const cartsRouter = require("./routes/carts.router");
app.use("/api/carts", cartsRouter);