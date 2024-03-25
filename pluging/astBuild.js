// 自定义插件
class SloveCss {
  constructor(srcPath, status) {
    this.srcPath = srcPath;
    this.status = status
  }
  apply(compiler) {
    // 在Webpack构建过程的特定阶段执行任务
    compiler.hooks.done.tap("MyCustomPlugin", (compilation) => {
      const fs = require("fs");
      const path = require("path");
      try {
        const srcPath = this.srcPath;

        const { transformSync } = require("@babel/core");

        const acorn = require("acorn");

        const pako = require("pako");

        let js = fs.readFileSync(
          path.join(srcPath, "./.weDynamic/dist/index.js"),
          "utf-8"
        );
        js = js.replace(/React\./g, "we.");

        // 移除开头的部分
        const startCode = '!function(){"use strict";';
        const startIndex = js.indexOf(startCode);
        js = js.substring(startIndex + startCode.length);

        // 移除结尾的部分
        const endCode = "}();";
        const endIndex = js.lastIndexOf(endCode);

        js = js.substring(0, endIndex);

        js = js.replace(/throw new TypeError/g, "console.log");

        js = transformSync(js, {
          filename: "./file.jsx",
          presets: ["@babel/preset-env"],
          plugins: [
            "@babel/plugin-transform-react-jsx",
            "./pluging/es5Chain.js",
          ],
        }).code;

        this.status === "test" && (js = `
        var socketIoScript = document.createElement('script');
        socketIoScript.src = "https://cdn.socket.io/4.5.1/socket.io.min.js";
        socketIoScript.crossOrigin = "anonymous";
        socketIoScript.onload = function() {
            var inlineScript = document.createElement('script');
            console.log(555555551);
            inlineScript.innerHTML = 
            "var url = new URL(window.location.href.replace('/#/', '/').replace('#/', '/'));" + 
            "var params = new URLSearchParams(url.search);" + 
            "var host = params.get('host');" + 
            "var socket = io('http://' + host);console.log(socket);" +
            "socket.on('connect', () => {" +
                "console.log('Connected to the server. socket');" +
            "});" +
            "socket.on('disconnect', (reason) => { console.log('reasonsocket');  });" +
            "socket.on('fileChanged', (data) => {" +
                "console.log('File changed:', data);" +
                "window.location.reload();" +
            "});";
            document.head.appendChild(inlineScript);
        }
        
        document.head.appendChild(socketIoScript);
        ` + js);

        fs.writeFileSync(
          path.join(srcPath, "./.weDynamic/dist/index.js"),
          `${js}
              `,
          "utf8"
        );

        js = js.replace("WeDyncamic.App", "module.exports");

        var options = {
          ecmaVersion: 5,
          sourceType: "module",
        };



        var ast = JSON.stringify(acorn.parse(js, options));

        ast = JSON.parse(ast);
        var del = (ast) => {
          if (ast) {
            Object.keys(ast).forEach((e) => {
              if (e == "start" || e == "end" || e == "raw") {
                delete ast[e];
              }
              if (Array.isArray(ast[e])) {
                ast[e].forEach((e1) => {
                  del(e1);
                });
              } else if (typeof ast[e] == "object") {
                del(ast[e]);
              }
            });
          }
        };
        del(ast);
        ast = JSON.stringify(ast);
        ast = ast.replace(/VariableDeclaration/g, "VD");
        ast = ast.replace(/ExpressionStatement/g, "ES");
        ast = ast.replace(/FunctionExpression/g, "FE");
        ast = ast.replace(/CallExpression/g, "CE");
        ast = ast.replace(/VariableDeclarator/g, "VDt");
        ast = ast.replace(/BlockStatement/g, "BS");
        ast = ast.replace(/FunctionDeclaration/g, "FDt");
        ast = ast.replace(/ArrayExpression/g, "AE");
        ast = ast.replace(/Identifier/g, "Id");
        ast = ast.replace(/AssignmentExpression/g, "AEo");
        ast = ast.replace(/ForStatement/g, "FS");
        ast = ast.replace(/MemberExpression/g, "ME");
        ast = ast.replace(/UnaryExpression/g, "UE");
        ast = ast.replace(/SwitchStatement/g, "SS");
        ast = ast.replace(/BreakStatement/g, "BSs");
        ast = ast.replace(/SwitchCase/g, "SC");
        ast = ast.replace(/UpdateExpression/g, "UEo");
        ast = ast.replace(/BinaryExpression/g, "BE");
        ast = ast.replace(/LogicalExpression/g, "LE");
        ast = ast.replace(/ObjectExpression/g, "OE");
        ast = ast.replace(/ConditionalExpression/g, "CEo");
        ast = ast.replace(/Literal/g, "Ll");

        let _keyStr =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // 加密
        var encode = function (input) {
          var output = "";
          var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
          var i = 0;
          input = _utf8_encode(input);
          while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
              enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
              enc4 = 64;
            }
            output =
              output +
              _keyStr.charAt(enc1) +
              _keyStr.charAt(enc2) +
              _keyStr.charAt(enc3) +
              _keyStr.charAt(enc4);
          }
          return output;
        };

        let _utf8_encode = (string) => {
          string = string.replace(/\r\n/g, "\n");
          var utftext = "";
          for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
              utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
            } else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
            }
          }
          return utftext;
        };

        const zip = (str) => {
          let binaryString = pako.gzip(str);
          let a = Array.from(binaryString);
          let s = "";
          a.forEach((item, index) => {
            s += String.fromCharCode(item);
          });
          return encode(s);
        };
        ast = zip(ast);

        fs.writeFileSync(
          path.join(srcPath, "./.weDynamic/dist/ast.we"),
          ast,
          {
            encoding: "utf8",
          },
          (err) => {}
        );
      } catch (error) {
        const srcPath = this.srcPath;
        fs.writeFileSync(
          path.join(srcPath, "./.weDynamic/dist/error.log"),
          error,
          {
            encoding: "utf8",
          },
          (err) => {}
        );
      }
    });
  }
}

// 导出插件
module.exports = SloveCss;
