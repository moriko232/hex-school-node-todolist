const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-With",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
  "Content-Type": "application/json",
};

function errorHandler(res, errorText = "欄位填寫有誤") {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: "false",
      message: errorText,
    })
  );
  res.end();
}

module.exports = errorHandler;
