<template>
  <div class="info_box">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
    >
      <el-form-item label="应用名称" prop="app_name">
        <el-input
          v-model="ruleForm.app_name"
          placeholder="请填写应用名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="应用介绍" prop="app_desc">
        <el-input
          v-model="ruleForm.app_desc"
          placeholder="请填写应用介绍"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="应用域名" prop="app_desc">
        <el-input
          v-model="ruleForm.domain"
          placeholder="填写当前应用的访问链接"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="应用logo" prop="cover">
        <el-upload
          action=""
          :show-file-list="false"
          :http-request="uploadLogo"
          :multiple="false"
          :before-upload="beforeImgUpload"
        >
          <img v-if="ruleForm.logo" :src="ruleForm.logo" width="200px" />
          <el-button v-else><i class="el-icon-upload2"></i> 点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            不超过1M 建议上传透明PNG图片
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="icp_no" prop="icp_no">
        <el-input
          v-model="ruleForm.icp_no"
          placeholder="请填写icp_no"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="客服电话" prop="tel">
        <el-input
          v-model="ruleForm.tel"
          placeholder="请填写联系客服电话"
        ></el-input>
      </el-form-item>
      <el-form-item label="显示区块链LOGO">
        <el-switch
          v-model="ruleForm.show_chain_logo"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
        <p class="tips">开启页面底部将显示区块链技术支持</p>
      </el-form-item>

      <el-form-item label="开启交易市场">
        <el-switch
          v-model="ruleForm.market_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
        <p class="tips">开启后藏品可以转售到交易市场</p>
      </el-form-item>
      <el-form-item label="一级市场商品锁定时间" prop="lock_time_a">
        <el-input-number v-model="ruleForm.lock_time_a"></el-input-number>
        <p class="tips">一级交易市场购买商品后等待支付时间 单位：分钟</p>
      </el-form-item>
      <el-form-item label="二级市场商品锁定时间" prop="lock_time">
        <el-input-number v-model="ruleForm.lock_time"></el-input-number>
        <p class="tips">二级交易市场购买商品后锁定的时间 单位：分钟</p>
      </el-form-item>
      <el-form-item label="不付款拉黑设置" prop="pay_limit_day">
        <el-input-number v-model="ruleForm.pay_limit_day"></el-input-number>
        <p class="tips">玩家一天内超过多少次不付款，则该玩家账号自动被封禁24小时，0为不限制</p>
      </el-form-item>
      <el-form-item label="开启转赠功能">
        <el-switch
          v-model="ruleForm.trans_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="转赠时间限制" prop="trans_limit_day">
        <el-input-number v-model="ruleForm.trans_limit_day"></el-input-number>
        <p class="tips">须持有多少天才能转赠</p>
      </el-form-item>

      <el-form-item label="开启邀请码">
        <el-switch
          v-model="ruleForm.refer_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
        <p class="tips">开启后注册时可填写邀请码</p>
      </el-form-item>
      
      <el-form-item label="邀请海报图片" prop="refer_img">
        <el-upload
          action=""
          :show-file-list="false"
          :http-request="uploadReferImg"
          :multiple="false"
          :before-upload="beforeImgUpload"
        >
          <img v-if="ruleForm.refer_img" :src="ruleForm.refer_img" width="200px" />
          <el-button v-else><i class="el-icon-upload2"></i> 点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            不超过10M
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="邀请海报文字" prop="refer_words">
        <el-input
          v-model="ruleForm.refer_words"
          placeholder="不超过20个字"
        ></el-input>
      </el-form-item>
      <el-form-item label="权益说明文字" prop="quanyi">
        <el-input
          type="textarea"
          rows="5"
          v-model="ruleForm.quanyi"
          placeholder="请填写藏品文字介绍"
        ></el-input>
      </el-form-item>
      <el-form-item label="购买须知文字" prop="goumai">
        <el-input
          type="textarea"
          rows="5"
          v-model="ruleForm.goumai"
          placeholder="请填写购买须知文字"
        ></el-input>
      </el-form-item>
      <el-form-item label="注册协议" prop="agreement">
        <div id="editor"></div>
      </el-form-item>
      <el-form-item label="隐私政策" prop="pravicy">
        <div id="editor2"></div>
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
import { putObject } from '@/utils/uploadCos'
export default {
  components: {},
  data() {
    return {
      chainList: [
        { id: "1", name: "百度超级链" },
        { id: "2", name: "BSN文昌链" },
      ],
      isSave: false,
      ruleForm: {},
      rules: {
        url: [{ required: true, message: "请上传藏品封面", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.editor = new E(`#editor`);
    this.editor.config.onchange = (newHtml) => {
      this.ruleForm.agreement = newHtml;
    };
    this.editor.create();

    this.editor2 = new E(`#editor2`);
    this.editor2.config.onchange = (newHtml) => {
      this.ruleForm.pravicy = newHtml;
    };
    this.editor2.create();

    this.getData();
  },
  computed: {},
  methods: {
    uploadLogo({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.ruleForm.logo = ossImg;
        }
      });
    },
    // uploadLogo(data) {
    //   var file = data.file
		//   putObject(file, (url, name) => {
    //     this.ruleForm.logo = url;
    //   })
		// },
    goBack() {
      this.$router.push({
        path: "/mainList",
      });
    },
    async getData() {
      let res = await this.$http.post("/manage/getconfig",{
        token: localStorage.dd_token,
      });
      if (res.errcode == 200) {
        console.log(res.data);
        this.ruleForm = res.data;
        this.editor.txt.html(res.data.agreement);
        this.editor2.txt.html(res.data.pravicy);
      } else {
        this.$message.error(res.msg);
      }
    },
    uploadReferImg({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.ruleForm.refer_img = ossImg;
        }
      });
    },
    // uploadReferImg(data) {
    //   var file = data.file
		//   putObject(file, (url, name) => {
    //     this.ruleForm.refer_img = url;
    //   })
		// },
    beforeImgUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 < 10;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isIMAGE && isLt1M;
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
      let res = await this.$http.post("/manage/saveconfig", {
        info: this.ruleForm,
        token: localStorage.dd_token,
        uid: localStorage.userId,
      });
      console.log(res);
      if (res.errcode == 0) {
        this.isSave = true;
        this.$message.success("基础资料保存成功");
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
