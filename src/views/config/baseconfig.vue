<template>
  <div class="info_box">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
    >
      <el-form-item label="文昌链ak" prop="bsn_ak">
        <el-input
          v-model="ruleForm.bsn_ak"
          placeholder="文昌链ak"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="文昌链sk" prop="bsn_sk">
        <el-input
          v-model="ruleForm.bsn_sk"
          placeholder="文昌链sk"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="文昌链主账户" prop="bsn_owner">
        <el-input
          v-model="ruleForm.bsn_owner"
          placeholder="文昌链主账户"
          clearable
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
export default {
  components: {},
  data() {
    return {
      ruleForm: {},
      rules: {}
    };
  },
  mounted() {
    this.getData();
  },
  computed: {},
  methods: {
    async getData() {
      let res = await this.$http.post("/manage/getbaseconfig",{
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 200) {
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
      let res = await this.$http.post("/manage/savebaseconfig", {
        info: this.ruleForm,
        token: localStorage.nft_pro_token,
        uid: localStorage.userId,
      });
      console.log(res);
      if (res.errcode == 0) {
        this.$message.success("资料保存成功");
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
