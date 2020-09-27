const fs = require("fs");
const path = require("path");
function cpyDir(dir, src) {
  const root = fs.readdirSync(dir);

  root.forEach((file) => {
    const isDir = fs
      .lstatSync(path.resolve(__dirname, dir, file))
      .isDirectory();
    if (isDir) {
      fs.mkdirSync(path.resolve(__dirname, src, dir), { recursive: true });
      cpyDir(`${dir}/${file}`, src);
    } else {
      fs.mkdirSync(path.resolve(__dirname, src, dir), { recursive: true });
      fs.copyFileSync(
        path.resolve(__dirname, dir, file),
        path.resolve(__dirname, src, dir, file)
      );
    }
  });
}

cpyDir("responsive login", "zxc");
