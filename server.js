// http 為 node.js內建工具
const http = require("http");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const errorHandler = require("./errorHandler");
const successHandler = require("./successHandler");
const headers = require("./headerSetting.js");

// 連接資料庫
mongoose
  .connect("mongodb://localhost:27017/hotel")
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch((error) => {
    console.log(error);
  });

const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      require: [true, "價格必填"],
    },
    rating: Number,
    createAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { versionKey: false }
);
const Room = new mongoose.model("room", roomSchema);
const testRoom = new Room({
  name: "單人房2",
  price: 300,
  rating: 1.0,
});
testRoom
  .save()
  .then(() => {
    console.log("新增成功");
  })
  .catch((err) => {
    console.log(error);
  });

// 紀錄todo資料arr
let todos = [];

const requertListener = (req, res) => {
  let body = "";

  // 持續接收
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url === "/todos" && req.method === "GET") {
    successHandler(res, todos);
  } else if (req.url === "/todos" && req.method === "POST") {
    // 接收完畢
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        if (data.title !== undefined) {
          const todo = {
            title: data.title,
            id: uuidv4(),
          };
          todos.push(todo);
          successHandler(res, todos);
        } else {
          errorHandler(res, "POST title未填寫");
        }
      } catch (error) {
        console.log("req error", error);
        errorHandler(res, "POST 格式錯誤");
      }
    });
  } else if (req.url === "/todos" && req.method === "DELETE") {
    todos = [];
    successHandler(res, todos);
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((todo) => {
      return todo.id === id;
    });
    if (index !== -1) {
      todos.splice(index, 1);
      successHandler(res, todos);
    } else {
      errorHandler(res, "找不到該項目");
    }
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const id = req.url.split("/").pop();
        const index = todos.findIndex((todo) => {
          return todo.id === id;
        });
        if (data.title !== undefined && index !== -1) {
          todos[index].title = data.title;

          successHandler(res, todos);
        } else {
          errorHandler(res, "格式錯誤或無該筆資料");
        }
      } catch (error) {
        // console.log("req error", error);
        errorHandler(res, "格式錯誤");
      }
    });
  } else if (req.method === "OPTIONS") {
    // 若browser 發送了預檢請求
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    // res.write("not found 404"); // 簡單文字寫法
    res.write(
      JSON.stringify({
        status: "fail",
        message: "404",
      })
    );
    res.end();
  }
};
const server = http.createServer(requertListener);

server.listen(process.env.PORT || 8080);
