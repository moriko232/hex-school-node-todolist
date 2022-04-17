// http 為 node.js內建工具
const http = require("http");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace("<password>", process.env.DB_PASSEORD);

const errorHandler = require("./errorHandler");
const successHandler = require("./successHandler");
const headers = require("./headerSetting.js");
const Post = require("./model/post.js");

// 連接資料庫
mongoose
  .connect(DB)
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch((error) => {
    console.log("連線失敗");
    console.log(error);
  });

const requertListener = async (req, res) => {
  let body = "";

  // 持續接收
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url === "/todos" && req.method === "GET") {
    const allData = await Post.find();
    successHandler(res, allData);
  } else if (req.url === "/todos" && req.method === "POST") {
    // 接收完畢
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        if (data.title !== undefined) {
          const post = {
            title: data.title,
          };
          await Post.create(post).then(async () => {
            const allData = await Post.find();
            successHandler(res, allData);
          });
        } else {
          errorHandler(res, "POST title未填寫");
        }
      } catch (error) {
        console.log("req error", error);
        errorHandler(res, `POST 格式錯誤，${error}`);
      }
    });
  } else if (req.url === "/todos" && req.method === "DELETE") {
    await Post.deleteMany({})
      .then(async () => {
        const allData = await Post.find();
        successHandler(res, allData);
      })
      .catch((error) => {
        errorHandler(res, error);
      });
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    await Post.findByIdAndDelete(id)
      .then(async () => {
        const allData = await Post.find();
        successHandler(res, allData);
      })
      .catch(() => {
        errorHandler(res, error);
      });
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const id = req.url.split("/").pop();

        if (data.title !== undefined) {
          await Post.findByIdAndUpdate(id, { title: data.title })
            .then(async () => {
              const allData = await Post.find();
              successHandler(res, allData);
            })
            .catch(() => {
              errorHandler(res, error);
            });
        } else {
          errorHandler(res, "格式錯誤或無該筆資料");
        }
      } catch (error) {
        errorHandler(res, "格式錯誤");
      }
    });
  } else if (req.method === "OPTIONS") {
    // 若browser 發送了預檢請求
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
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
