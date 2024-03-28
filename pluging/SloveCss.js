const transform = require("./cssBuild");

const fs = require("fs");

const path = require("path");
// 复制文件夹
function copyFolder(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  const files = fs.readdirSync(source);

  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyFolder(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });
}

// 遍历文件夹
function traverseFolder(folderPath) {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    if (fs.lstatSync(filePath).isDirectory()) {
      traverseFolder(filePath);
    } else {
      if (path.extname(filePath) === ".css") {
        // 运行sss()并替换内容
        const fileContent = fs.readFileSync(filePath, "utf8");
        const replacedContent = transform.default(fileContent); // 假设sss()是一个处理函数
        fs.writeFileSync(
          filePath,
          `export default ${JSON.stringify(replacedContent)}`,
          "utf8"
        );
      }
    }
  });
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const deleteFs = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    // 删除文件夹
    fs.rmdirSync(folderPath, { recursive: true });
} else {
    console.log('Folder does not exist');
}
}

// 自定义插件
class SloveCss {
  constructor(srcPath) {
    this.srcPath = srcPath;
  }
  apply(compiler) {
    // 在Webpack构建过程的特定阶段执行任务
    compiler.hooks.beforeCompile.tap("MyCustomPlugin", (compilation) => {
      // 复制文件夹
      const sourceFolder = path.join(this.srcPath, "./src");
      const destinationFolder = path.join(
        this.srcPath,
        "./.weDynamic/srcBuild"
      );
      deleteFs(destinationFolder)
      ensureDirectoryExistence(destinationFolder);
      copyFolder(sourceFolder, destinationFolder);

      // 遍历文件夹并替换内容
      const folderToTraverse = path.join(this.srcPath, "./.weDynamic/srcBuild");
      traverseFolder(folderToTraverse);
    });
  }
}

// 导出插件
module.exports = SloveCss;
