const express = require("express");
// const creactErrror = require("http-errors");
const cors = require("cors");
// const mongoose = require("mongoose");
const posts = require("./route/posts");
const register = require("./route/register");
const login = require("./route/login");
const profile = require("./route/profile");
const mypost = require("./route/mypost");
const allpost = require("./route/allPost");
const allUserChat = require("./route/chat");
// const formmodel = require("./models/formData");
const app = express();

const { Server } = require("socket.io");

const http = require("http");
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require("constants");
const server = http.createServer(app);
//
//
//
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (soketId) => {
  console.log("socketis", soketId);
  users = users.filter((user) => user.socketId !== soketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("socketio conneced!!", socket.id);
  socket.on("addUser", (userId) => {
    userId ? addUser(userId, socket.id) : null;
    // console.log(userId);
    io.emit("getUser", users);
  });

  socket.on("sendMessage", async (data) => {
    console.log("index.js sendMessage = >>>", data);
    const user = await getUser(data.receverId);
    // console.log(
    //   "user isnvkljdcdcljewndcnjmdlqadljmwqldkldjmqdk",
    //   user
    // );
    await io.to(user?.socketId).emit("recevMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
  
});
//
//
//
//
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/form", posts);
app.use("/register", register);
app.use("/login", login);
app.use("/profile", profile);
app.use("/mypost", mypost);
app.use("/allpost", allpost);
app.use("/allUser", allUserChat);
// const CONECTION_URL = "mongodb://localhost/node-react-api";
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`server runing port is: ${PORT}`));
