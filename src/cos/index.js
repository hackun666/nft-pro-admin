var COS = require('cos-js-sdk-v5');

var cos = new COS({
    SecretId: 'xxxx',
    SecretKey: 'xxxx',
});

var tengxunCos = {
    Bucket: 'xxx-12345678',//这边注意了，bucket的名称一定不能用-拼接，cos默认-后面是appId
    Region: 'ap-xxx',
    iconBaseUrl:"https://wxxx-12345678.cos.ap-xxx.xxxx.com/"
}
export default {
    cos, tengxunCos
}
