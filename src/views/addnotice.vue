<template>
  <div class="info_box">
    <el-page-header
      @back="goBack"
      :content="ruleForm.id > 0 ? '编辑公告' : '创建公告'"
    ></el-page-header
    ><br />
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="公告标题" prop="title">
        <el-input
          v-model="ruleForm.title"
          placeholder="请填写公告标题"
        ></el-input>
      </el-form-item>

      <el-form-item label="置顶此公告">
        <el-switch
          v-model="ruleForm.zhiding"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="公告详情" prop="content">
        <div id="editor"></div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存信息</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
var moment = require("moment");
import E from "wangeditor";
 let OSS = require('ali-oss');
export default {
  components: {},
  data() {
    return {
      isSave: false,
      ruleForm: {
        id: 0,
        cover: "",
        title: "",
        desc: "",
        price: "",
        total_num: "",
        max_buy: 1,
        sale_time: "",
        content: "",
      },
    };
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isSave) {
      this.$confirm("您还未保存信息，确定需要离开当前页面吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          next();
        })
        .catch(() => {});
    } else {
      next();
    }
  },
  mounted() {
    this.editor = new E(`#editor`);
    let client = new OSS({
      secure: true,
      region: "oss-cn-beijing",
      accessKeyId: "LTAImDzzRGgpsDHo",
      accessKeySecret: "oAMbLEM2KHmfbbXf0jWYmCZr27KcCe",
      bucket: "qywapp",
    });
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      var filename =
        year + "/" + month + "/" + day + "/" + Math.random().toString(36);
      client
        .put(filename, resultFiles[0])
        .then(function (res) {
          // 上传图片，返回结果，将图片插入到编辑器中
          insertImgFn(res.url);
        })
        .catch(function (err) {
          console.log(err);
        });
    };
    this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 1M
    this.editor.config.zIndex = 100;
    this.editor.config.uploadImgAccept = ["jpg", "jpeg", "png", "gif", "bmp"];
    this.editor.config.onchange = (newHtml) => {
      this.ruleForm.content = newHtml;
    };
    this.editor.create();
    let id = this.$route.query.id;
    if (id > 0) {
      this.getData(id);
    }
  },
  computed: {},
  methods: {
    goBack() {
      this.$router.push({
        path: "/notice",
      });
    },
    async getData(id) {
      let res = await this.$http.post("/manage/getnotice", {
        id: id,
        token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        console.log(res.data);
        this.ruleForm = res.data;
        this.ruleForm.sale_time = moment(res.data.sale_time * 1000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.editor.txt.html(res.data.content);
      } else {
        this.$message.error(res.msg);
      }
    },
    beforeImgUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/webp" || "image/png";
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isIMAGE && isLt10M;
    },
    beforeFileUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isLt10M;
    },
    uploadCover({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.ruleForm.cover = ossImg;
        }
      });
    },
    submitForm(formName) {
      console.log(this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveForm();
        } else {
          return false;
        }
      });
    },
    async saveForm() {
      let res = await this.$http.post("/manage/savenotice", {
        info: this.ruleForm,
        token: localStorage.dd_token,
        uid: localStorage.userId,
      });
      console.log(res);
      if (res.errcode == 0) {
        this.isSave = true;
        this.$message.success("公告信息保存成功");
        setTimeout(() => {
          this.$router.push({
            path: "/notice",
          });
        }, 600);
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
