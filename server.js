// http 為 node.js內建工具
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errorHandler = require("./errorHandler");

// 紀錄todo資料arr
let todos = [];

const requertListener = (req, res) => {
  let body = "";

  // 持續接收
  req.on("data", (chunk) => {
    body += chunk;
  });

  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  // res.writeHead(200, { "Content-Type": "text/html" });
  if (req.url === "/todos" && req.method === "GET") {
    res.writeHead(200, headers);
    res.write(
      // 將OBJ轉成字串傳輸給API
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
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
          console.log("req data", data);

          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
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

    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((todo) => {
      return todo.id === id;
    });
    if (index !== -1) {
      todos.splice(index, 1);

      res.end();
    } else {
      errorHandler(res, "找不到該項目");
    }
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    // console.log("PATCH");
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const id = req.url.split("/").pop();
        const index = todos.findIndex((todo) => {
          return todo.id === id;
        });
        if (data.title !== undefined && index !== -1) {
          todos[index].title = data.title;

          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandler(res, "格式錯誤或無該筆資料");
        }
      } catch (error) {
        console.log("req error", error);
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
