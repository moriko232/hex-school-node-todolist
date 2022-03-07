const headers = require("./headerSetting.js");

function successHandler(res, data = "") {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: "success",
      data,
    })
  );
  res.end();
}

module.exports = successHandler;
