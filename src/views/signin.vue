<template>
  <div class="bg">
    <div class="login-wrap animated fadeIn">
      <div class="right">
        <h3>数字藏品平台管理后台</h3>
        <el-form ref="form" :model="form" :rules="rules" label-width="0px">
          <el-form-item prop="name">
            <el-input placeholder="请输入用户名" v-model="form.name" clearable></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="form.password"
              type="password"
              
               show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
          <el-row type="flex" justify="space-between">
            <el-checkbox v-model="isMemery" style="color:#aaa">记住密码</el-checkbox>
          </el-row>
          </el-form-item>
          <el-form-item>
            <el-button class="login_btn" type="primary" @click="Login('form')">立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="copy">2022 © 版权所有</div>

    
  </div>
</template>
<script>
// import LottiePlayer from 'lottie-player-vue';
export default {
  name: "signin",
  // components: {
  //   LottiePlayer
  // },
  data() {
    return {
      options: {
        autoplay: true,
        loop: true,
        speed: 1.5,
        width: '600px'
      },
      form: {
        name: localStorage.userInfo || "",
        password: localStorage.passwordInfo || ""
      },
      isMemery: false,
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: "blur"
            // validator: checkone
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: "blur"
          }
        ]
      },
      xyBox: false,
    };
  },
  mounted(){
  },
  methods: {
    Login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handlelogin()
        } else {
          return false;
        }
      });
    }, 
    async handlelogin(){
      let res = await this.$http.post("/api/token", {
        username: this.form.name,
        password: this.form.password,
      });
      if (res.errcode == 0) {
        localStorage.userName = res.username;
        localStorage.userId = res.userid;
        localStorage.nft_pro_token = res.access_token
        this.$router.push("/dashboard");
      } else {
        this.$message.error(res.errmsg);
      }
    },
  },
  watch: {
    isMemery(n, o) {
      if (n) {
        localStorage.userInfo = this.form.name;
        localStorage.passwordInfo = this.form.password;
      } else {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("passwordInfo");
      }
    }
  }
};
</script>
<style scoped lang="less">
.bg {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../assets/img/bg.png") no-repeat center;
  background-size: cover;
  position: relative;
  .copy {
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #a4abbd;
  }
}
.login-wrap {
  width: 500px;
  margin: auto;
  display: flex;
  align-items: center;
  .right {
    position: relative;
    background: #fff;
    border-radius: 10px;
    padding: 50px;
    flex: 1;
    box-shadow: 5px -5px 20px rgba(0,0,0,.06);
    .wx_login {
      position: absolute;
      top: 0;
      right: 0;
      width: 60px;
      cursor: pointer;
    }
    h3 {
      text-align: center;
      margin-top: 0px;
      margin-bottom: 5px;
      font-size: 22px;
      color: #2c2c2c;
      font-weight: 600;
    }
    p {
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    form {
      margin-top: 25px;
    }
    a {
      text-decoration: none;
      color: #1f2d3d;
    }
    .xy {
      font-size: 14px;
      color: #aaa;
      a {
        color: #787878;
        cursor: pointer;
      }
    }
  }
}
.login_btn {
  display: block;
  width: 100%;
}
</style>
