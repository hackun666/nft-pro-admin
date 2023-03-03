<template>
  <div class="info_box">
    <el-page-header
      @back="goBack"
      :content="ruleForm.id > 0 ? '编辑商品' : '创建商品'"
    ></el-page-header
    ><br />
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="商品类型" prop="sort">
        <el-select v-model="ruleForm.type" placeholder="请选择">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品封面图" prop="cover">
        <el-upload
          action=""
          :show-file-list="false"
          :http-request="uploadCover"
          :multiple="false"
          :before-upload="beforeImgUpload"
        >
          <img v-if="ruleForm.cover" :src="ruleForm.cover" width="200px" />
          <el-button v-else><i class="el-icon-upload2"></i> 点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            不超过1M 格式支持：”jpg”, “jpeg”, “png”。
          </div>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item label="商品源文件" prop="asset_url" v-if="ruleForm.type == 1">
        <el-upload
          action=""
          :show-file-list="false"
          :http-request="uploadAsset"
          :multiple="false"
          :before-upload="beforeFileUpload"
        >
          <el-button><i class="el-icon-upload2"></i> 点击上传</el-button>
          <div slot="tip" class="el-upload__tip">文件大小不能超过10M</div>
        </el-upload>
        <p>{{ ruleForm.asset_url }}</p>
      </el-form-item> -->
      <el-form-item label="商品标题" prop="title">
        <el-input
          v-model="ruleForm.title"
          placeholder="请填写商品标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品简介" prop="desc">
        <el-input
          v-model="ruleForm.desc"
          placeholder="请填写商品标题"
        ></el-input>
      </el-form-item>

      <!-- <el-form-item label="商品价格" prop="price">
        <el-input
          v-model="ruleForm.price"
          placeholder="请填写商品价格"
        ></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="运费" prop="trans_fee">
        <el-input
          v-model="ruleForm.trans_fee"
          placeholder="请填写运费"
        ></el-input>
        <p class="tips">填写商品的运费：填写0即包邮</p>
      </el-form-item> -->
      <el-form-item label="需要积分" prop="score">
        <el-input
          v-model="ruleForm.score"
          placeholder="请填写需要积分"
        ></el-input>
      </el-form-item>
      <el-form-item label="发售数量" prop="num">
        <el-input-number
          v-model="ruleForm.total_num"
          placeholder="发售数量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="库存数量" prop="num">
        <el-input-number
          v-model="ruleForm.num"
          placeholder="库存数量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="最多购买数量" prop="max_buy">
        <el-input-number v-model="ruleForm.max_buy"></el-input-number>
      </el-form-item>
      <el-form-item label="开售时间" prop="sale_time">
        <el-date-picker
          type="datetime"
          placeholder="选择开售日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="ruleForm.sale_time"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="商品详情介绍" prop="content">
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
// import { putObject } from '@/utils/uploadCos'
import OSS from "ali-oss";
export default {
  components: {},
  data() {
    return {
      typeList: [
        {
          value: "1",
          label: "数字藏品",
        },
        {
          value: "2",
          label: "实物商品",
        },
      ],
      isSave: false,
      ruleForm: {
        title: "",
        cover: "",
        type: "1",
        desc: "",
        price: "",
        score: "",
        num: "",
        content: "",
        trans_fee: "",
        sale_time: "",
        max_buy: 1,
      },
      rules: {
        cover: [{ required: true, message: "请上传商品封面", trigger: "blur" }],
      },
      save_sta: true,
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
      accessKeyId: "",
      accessKeySecret: "",
      bucket: "",
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
        path: "/shopgoods",
      });
    },
    async getData(id) {
      let res = await this.$http.post("/manage/goodinfo", {
        token: localStorage.nft_pro_token,
        id: id,
      });
      if (res.errcode == 0) {
        console.log(res.data);
        this.ruleForm = res.data;
        this.editor.txt.html(res.data.content);
        this.ruleForm.sale_time = moment(res.data.sale_time * 1000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
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
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/savegood", {
        info: this.ruleForm,
        uid: localStorage.userId,
        token: localStorage.nft_pro_token,
      });
      console.log(res);
      if (res.errcode == 0) {
        this.isSave = true;
        this.$message.success("商品信息保存成功");
        setTimeout(() => {
          this.$router.push({
            path: "/shopgoods",
          });
        }, 600);
      } else {
        this.$message.error(res.errmsg);
      }
      loading.close();
    },
  },
};
</script>

<style lang="less" scoped></style>
