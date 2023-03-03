/**
 * 阿里云oss上传工具
 */
let OSS = require("ali-oss");
let config = {
  secure: true,
  region: "oss-cn-beijing",
  accessKeyId: "",
  accessKeySecret: "",
  bucket: "",
};

/**
 * 配置
 */
let init = () => {
  return new OSS(config);
};

/**
 * 生成uuid
 */
let guid = () => {
  let S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
};

/**
 * 修改文件名字
 */
let fileName = (file) => {
  let arr = file.name.split(".");
  var uuid = "oss" + guid();
  if (arr.length > 1) {
    uuid = uuid + "." + arr[arr.length - 1];
  }
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  return year + "/" + month + "/" + day + "/" + uuid;
};

/**
 * 上传文件
 */
let ossPut = (file) => {
  return new Promise((resolve, reject) => {
    let objectName = fileName(file);
    init()
      .put(objectName, file)
      .then(({ res, url }) => {
        if (res && res.status == 200) {
          console.log("阿里云OSS上传文件成功回调", res, url);

          // fileUrl = fileUrl.replace(
          //   "http://guochuang-1311899294.cos.ap-shanghai.myqcloud.com/",
          //   "http://cdn.guochuang123.com/"
          // );
          resolve(res, url);
        }
      })
      .catch((err) => {
        console.log("阿里云OSS上传文件失败回调", err);
        reject(err);
      });
  });
};

/**
 * 下载文件
 */
let ossGet = (name) => {
  return new Promise((resolve, reject) => {
    init()
      .get(name)
      .then(({ res }) => {
        if (res && res.status == 200) {
          console.log("阿里云OSS下载文件成功回调", res);
          resolve(res);
        }
      })
      .catch((err) => {
        console.log("阿里云OSS下载文件失败回调", err);
        reject(err);
      });
  });
};

export default {
  ossPut,
  ossGet,
};
