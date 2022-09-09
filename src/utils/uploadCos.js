/* 1.获取临时秘钥data 2.初始化 3.判断上传文件的类型 4.判断文件大小 是否需要分片上传*/

import COS from "cos-js-sdk-v5";
import axios from "axios";
import { Message } from "element-ui";

// 上传
export function putObject(file, callback) {
  console.log(file.name)
  let file_name = file.name;
  let url = "/manage/cossts"; // 秘钥相关信息
  axios.post(url).then((response) => {
    // 后台接口返回 密钥相关信息
    console.log(response);
    const data = response.data;
    var credentials = data && data.credentials;

    // 获取当前时间戳 可以与文件名拼接 为cos.putObject里的参数Key
    // let uploadFileName = Date.parse(new Date())

    if (!data || !credentials) return console.error("credentials invalid");
    // 初始化
    var cos = new COS({
      getAuthorization: function (options, callback) {
        //q-sign-algorithm=sha1&q-ak=AKIDGi195ol6GDxiqqeIjx372jEZllaCcuyg&q-sign-time=1654245497;1654249097&q-key-time=1654245497;1654249097&q-header-list=&q-url-param-list=&q-signature=636660d77cb18fafbd74668edafe7b6c9d1d608b
        callback({
          TmpSecretId: credentials.tmpSecretId,
          TmpSecretKey: credentials.tmpSecretKey,
          XCosSecurityToken: credentials.sessionToken,
          StartTime: data.startTime,
          ExpiredTime: data.expiredTime,
          expiration: data.expiration,
          requestId: data.requestId,
        });
      },
    });
    console.log('cos:',cos)
    
    cos.putObject(
      {
        Bucket: "", // 存储桶名称
        Region: "ap-nanjing", // 地区
        Key: "/nftimg/" + file_name, // 图片名称
        StorageClass: "STANDARD",
        Body: file, // 上传文件对象
        onHashProgress: function (progressData) {
          console.log("校验中", JSON.stringify(progressData));
        },
        onProgress: function (progressData) {
          console.log("上传中", JSON.stringify(progressData));
          // callback(progressData)
        },
      },
      function (err, data) {
        console.log(err);
        console.log(data);
        // console.log('999', err, data, data.Location)
        if (err) {
          Message({ message: "文件上传失败,请重新上传", type: "error" });
        } else {
          let fileUrl = "http://" + data.Location;
          console.log(fileUrl);

          callback(fileUrl, file_name);
        }
      }
    );
  });
}

export default {
  putObject
};
