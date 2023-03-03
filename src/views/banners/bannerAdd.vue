<template>
  <div class="info_box">
    <el-page-header @back="goBack" :content="ruleForm.id > 0?'编辑轮播图':'添加轮播图'"></el-page-header><br />
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="轮播图片">

        <el-upload
            action=""
            :show-file-list="false"
            :http-request="uploadHttp"
            :multiple="false"
            :before-upload="beforeImgUpload"
          >
          <img v-if="ruleForm.src" :src="ruleForm.src" width="200px" />
            <el-button v-else
              ><i class="el-icon-upload2"></i> 点击上传</el-button
            >
          </el-upload>
          <p class="tips">建议最佳尺寸：1000 × 500</p>
      </el-form-item>
      <el-form-item label="跳转链接" prop="sort">
        <el-input
          v-model="ruleForm.url"
          placeholder="请填写跳转链接"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="所在页面" prop="sort">
        <el-select v-model="ruleForm.type" placeholder="请选择">
          <el-option
            v-for="item in posList"
            :key="item.type"
            :label="item.name"
            :value="item.type">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="ruleForm.sort"
          placeholder="请填写数字 数字越大 排序越往前"
        ></el-input>
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
import { putObject } from '@/utils/uploadCos'
export default {
  components: {
  },
  data() {
    return {
      posList: [
        {type: 1, name: '首页顶部'},
      ],
      isSave: false,
      ruleForm: {
        id: 0,
        // type: 1,
        sort: '',
        src: "",
        url: ""
      },
      rules: {
        src: [
          { required: true, message: "请上传轮播图", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    let id = this.$route.query.id;
    if (id > 0) {
      this.getData(id);
    }
  },
  computed: {},
  methods: {
    beforeImgUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
      }
      return isIMAGE && isLt1M;
    },
    //  uploadHttp(data) {
    //   var file = data.file
		//   putObject(file, (url, name) => {
    //     this.ruleForm.src = url;
    //   })
		// },
    uploadHttp({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.ruleForm.src = ossImg;
        }
      });
    },
    goBack() {
      this.$router.push({
        path: "/banners/list",
      });
    },
    async getData(id) {
      let res = await this.$http.post("/manage/bannerinfo", {
        token: localStorage.nft_pro_token,
        id: id,
      });
      if (res.errcode == 0) {
        console.log(res.data);
        this.ruleForm = res.data;
      } else {
        this.$message.error(res.msg);
      }
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
      let res = await this.$http.post("/manage/savebanner", {
        token: localStorage.nft_pro_token,
        info: this.ruleForm,
      });
      console.log(res)
      if (res.errcode == 0) {
        this.isSave = true;
        this.$message.success("轮播图信息保存成功");
        setTimeout(() => {
          this.$router.push({
            path: "/banners/list",
          });
        }, 600);
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>


