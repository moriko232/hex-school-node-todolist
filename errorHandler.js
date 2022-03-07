const headers = require("./headerSetting.js");

function errorHandler(res, errorText = "發生錯誤") {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: "fail",
      message: errorText,
    })
  );
  res.end();
}

module.exports = errorHandler;
