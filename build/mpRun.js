const express = require("express");

const { exec, execSync } = require("child_process");

const fs = require("fs");

const path = require("path");

const http = require("http");

const getPort = require("get-port");

const inputArray = process.argv.splice(2);

const srcPath = inputArray[0];

const __dirname2 = inputArray[1];


/**
 * 打开网页的函数
 * @param {string} url 要打开的网址
 */
function openUrl(url) {
  if (!url) {
    console.error("URL不能为空");
    return;
  }

  switch (process.platform) {
    case "darwin": // macOS
      exec(`open "${url}"`, (error) => {
        if (error) {
          console.error(`打开网页失败: ${error}`);
        }
      });
      break;
    case "win32": // Windows
      exec(`start "" "${url}"`, (error) => {
        if (error) {
          console.error(`打开网页失败: ${error}`);
        }
      });
      break;
    default: // Linux或其他平台
      exec(`xdg-open "${url}"`, (error) => {
        if (error) {
          console.error(`打开网页失败: ${error}`);
        }
      });
  }
}

// 1.创建express的服务器
const app = express();
const server = http.createServer(app); // 创建HTTP服务器并附加Express应用
const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: {
    origin: "*", // 允许来自 localhost:10085 的连接
    methods: ["GET", "POST"], // 允许的HTTP请求方法
  },
});

// 设置CORS规则
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/mock", (req, res) => {
  const mock = req.query("mock");
  let js = fs.readFileSync(
    path.join(srcPath, "./.weDynamic/dist/mock.json"),
    "utf-8"
  );
  res.send(js);
});

app.get("/source", (req, res) => {
  let js = fs.readFileSync(
    path.join(srcPath, "./.weDynamic/dist/ast.we"),
    "utf-8"
  );
  res.send({ code: js });
});

let lastExecuted = 0;
const throttleInterval = 1000; // 设置节流间隔为1000毫秒

// 处理Socket.IO连接
io.on("connection", (socket) => {
  const watchOptions = {
    recursive: true,
  };

  const filePath = path.join(srcPath, "./src");

  const watcher = fs.watch(filePath, watchOptions, () => {
    const now = Date.now();

    if (now - lastExecuted > throttleInterval) {
      lastExecuted = now;
      let logTime = new Date().getTime().toString();

      a = false;
      fs.writeFileSync(
        path.join(srcPath, "./.weDynamic/dist/log.data"),
        logTime,
        {
          encoding: "utf8",
        },
        (err) => {}
      );

      const log = execSync(`webpack --env srcPath=${srcPath}`, {
        cwd: __dirname2,
        encoding: "utf8",
      });

      logTime = logTime + "\n" + new Date().getTime().toString();

      fs.writeFileSync(
        path.join(srcPath, "./.weDynamic/dist/log.data"),
        logTime,
        {
          encoding: "utf8",
        },
        (err) => {}
      );

      socket.emit("fileChanged");
    }
  });

  socket.on("disconnect", () => {
    watcher.close();
    console.log("user disconnected");
  });
});

const port = 8010;

const startServer = async () => {
  try {
    const availablePort = await getPort({ port: port });
    server.listen(availablePort, () => {
      console.log(`Server running on port ${availablePort}`);
      openUrl(
        "http://we.biubbmk.cn/baota/front/chat/index.html#/pages/Hot/HotRemote/index?host=127.0.0.1:" +
          availablePort
      );
    });
  } catch (err) {
    console.error("Error starting the server:", err);
  }
};

startServer();
