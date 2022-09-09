<template>
  <div id="topbar-wrap" :class="{ topCollapsed: isCollapse }">
    <i
      class="el-icon-s-fold toggle-btn"
      :style="iconStyle"
      @click="toggleSiderBar"
    ></i>
    <div class="bar_user">
      <el-dropdown @command="handleCommand" trigger="click">
        <a class="animated fadeIn"
          >欢迎您，{{ userName }} <i class="el-icon-caret-bottom"></i
        ></a>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="basic"
            ><i class="el-icon-edit"></i>修改资料
          </el-dropdown-item>
          <el-dropdown-item command="logout" divided>
            <i class="el-icon-switch-button"></i>退出登录</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>  
  </div>
</template>
<script>
export default {
  name: "topbar",
  data() {
    return {
      userName: localStorage.userName || "",
      showDate: true,
    };
  },
  components: {
  },
  computed: {
    term() {
      return this.$store.state.common.term;
    },
    isCollapse() {
      return this.$store.state.common.isCollapse;
    },
    iconStyle() {
      return {
        transform: this.isCollapse ? "rotate(180deg)" : "rotate(0deg)",
      };
    },
  },
  mounted() {
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "logout":
          this.logout();
          break;
        case "basic":
          this.$router.push("/basic/info");
          break;
        default:
          this.$message("click on item " + command);
      }
    },
    toggleSiderBar() {
      this.$store.commit("toggleSiderBar");
    },
    logout() {
      let _temp = localStorage.curColor;
      localStorage.clear();
      localStorage.curColor = _temp;
      this.$router.push("/signin");
    },
  },
};
</script>
<style scoped lang="less">
#topbar-wrap {
  overflow: hidden;
  border-bottom: 1px solid #efefef;
  background: #fff;
  color: #353d47;
  padding: 0 15px;
  height: 60px;
  z-index: 4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    cursor: pointer;
  }
  i {
    transition: all 0.5s;
    &:hover {
      color: #5c2834;
      cursor: pointer;
    }
  }
  .bar_user {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #787878;
    p {
      margin-right: 20px;
    }
  }
  .toggle-btn {
    vertical-align: middle;
    display: inline-block;
    margin-right: 20px;
  }

  .logout {
    text-decoration: none;
  }
}
.row-right > div {
  text-align: center;
}
.row-right > div.hi {
  text-align: right;
  a {
    padding-right: 2%;
  }
}
</style>
