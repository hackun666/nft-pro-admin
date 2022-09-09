<template>
  <div class="info_box">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
    >
      <el-form-item label="支付宝支付">
        <el-switch
          v-model="ruleForm.ali_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <div v-if="ruleForm.ali_sta == 1">
        <el-form-item label="支付宝商户ID" prop="ali_mchid">
          <el-input
            v-model="ruleForm.ali_mchid"
            placeholder="请填写支付宝商户ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付宝应用ID" prop="ali_appid">
          <el-input
            v-model="ruleForm.ali_appid"
            placeholder="请填写支付宝应用ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付宝私钥" prop="ali_private_key">
          <el-input type="textarea"
            v-model="ruleForm.ali_private_key"
            placeholder="请填写支付宝私钥"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付宝公钥" prop="ali_public_key">
          <el-input type="textarea"
            v-model="ruleForm.ali_public_key"
            placeholder="请填写支付宝公钥"
          ></el-input>
        </el-form-item>
      </div>

      <el-form-item label="微信支付">
        <el-switch
          v-model="ruleForm.wx_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
        <!-- <p class="tips">开启后藏品可以转售到交易市场</p> -->
      </el-form-item>
      <div v-if="ruleForm.wx_sta == 1">
        <el-form-item label="微信商户ID" prop="wx_mchid">
          <el-input
            v-model="ruleForm.wx_mchid"
            placeholder="请填写微信商户ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="微信公众号APPID" prop="wx_appid">
          <el-input
            v-model="ruleForm.wx_appid"
            placeholder="请填写微信公众号APPID"
          ></el-input>
        </el-form-item>
        <el-form-item label="微信商户密钥" prop="wx_key">
          <el-input
            v-model="ruleForm.wx_key"
            placeholder="请填写微信商户密钥"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="杉德支付">
        <el-switch
          v-model="ruleForm.sand_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <div v-if="ruleForm.sand_sta == 1">
        <el-form-item label="杉德商户ID" prop="sand_pid">
          <el-input
            v-model="ruleForm.sand_pid"
            placeholder="请填写杉德商户ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="杉德私钥密码" prop="sand_pass">
          <el-input
            v-model="ruleForm.sand_pass"
            placeholder="请填写杉德私钥密码"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存信息</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isSave: false,
      ruleForm: {},
      rules: {
        url: [{ required: true, message: "请上传藏品封面", trigger: "blur" }],
      },
    };
  },
  mounted() {

    this.getData();
  },
  computed: {},
  methods: {
    async getData() {
      let res = await this.$http.post("/manage/getpayconfig", {
        token: localStorage.dd_token,
      });
      if (res.errcode == 200) {
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
      let res = await this.$http.post("/manage/savepayconfig", {
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
