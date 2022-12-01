<!-- 左侧导航组件 -->
<!-- 使用说明：<side-bar></side-bar> -->
<template>
  <div id="sidebar-wrap" :class="{ collapsed: isFold }">
    <!-- 顶部图标 -->
    <div class="logo">
      <p v-if="isFold">后台</p>
      <p v-else>数藏后台</p>
    </div>

    <!-- 侧栏菜单 -->
    <el-menu
      :default-active="$route.path"
      :unique-opened="true"
      :router="true"
      :collapse="isFold"
    >
      <el-menu-item index="/dashboard">
        <i class="el-icon-s-home"></i>
        <span slot="title">管理后台</span>
      </el-menu-item>
      <el-submenu index="config">
        <template slot="title">
          <i class="el-icon-s-tools"></i>
          <span>参数配置</span>
        </template>
        <el-menu-item index="/siteconfig">网站设置</el-menu-item>
        <!-- <el-menu-item index="/baseconfig">功能配置</el-menu-item>
        <el-menu-item index="/payconfig">支付配置</el-menu-item> -->
      </el-submenu>
      <el-menu-item index="/banners/list">
        <i class="el-icon-picture"></i>
        <span slot="title">轮播管理</span>
      </el-menu-item>
      <el-menu-item index="/notice">
        <i class="el-icon-message-solid"></i>
        <span slot="title">公告管理</span>
      </el-menu-item>
      <el-submenu index="mainList">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>藏品管理</span>
        </template>
        <el-menu-item index="/mainList">藏品管理</el-menu-item>
        <el-menu-item index="/artist">艺术家列表</el-menu-item>
        <el-menu-item index="/producer">发行方列表</el-menu-item>
        <el-menu-item index="/kongtou">藏品空投记录</el-menu-item>
        <el-menu-item index="/translog">藏品转赠记录</el-menu-item>
        <el-menu-item index="/xilie">藏品系列管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="/orders">
        <i class="el-icon-s-finance"></i>
        <span slot="title">藏品订单</span>
      </el-menu-item>
      <el-menu-item index="/rank">
        <i class="el-icon-s-data"></i>
        <span slot="title">拉新排行</span>
      </el-menu-item>
      <el-menu-item index="/cashrank">
        <i class="el-icon-s-data"></i>
        <span slot="title">消费排行</span>
      </el-menu-item>
      
      <el-submenu index="Mall">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>积分商城模块</span>
        </template>
        <el-menu-item index="/shopgoods">积分商品管理</el-menu-item>
      </el-submenu>
      <el-submenu index="market">
        <template slot="title">
          <i class="el-icon-s-goods"></i>
          <span>二级市场管理</span>
        </template>
        <el-menu-item index="/market">商品管理</el-menu-item>
        <el-menu-item index="/tradelog">流转明细</el-menu-item>
        <el-menu-item index="/rechargelog">用户充值记录</el-menu-item>
        <el-menu-item index="/txlog">用户提现记录</el-menu-item>
      </el-submenu>
      <el-menu-item index="/verify">
        <i class="el-icon-s-check"></i>
        <span slot="title">认证管理</span>
      </el-menu-item>
      <el-menu-item index="/users">
        <i class="el-icon-user-solid"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "sidebar",
  data() {
    return {
      isMusicOn: false,
      menu: localStorage.menu ? JSON.parse(localStorage.menu) : [],
    };
  },
  computed: {
    isFold() {
      return this.$store.state.common.isCollapse;
    },
  },
  created() {},
  methods: {},
};
</script>
<style scoped lang="less">
#sidebar-wrap {
  width: 180px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  max-height: 100vh;
  overflow-y: scroll;
  z-index: 5;
  transition: all 0.3s;
  background: #fff;
  border-right: 1px solid #efefef;
  box-sizing: border-box;
  &.collapsed {
    width: 64px;
    transition: all 0.3s;
  }
  .logo {
    color: #333;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      font-size: 20px;
      color: #232323;
      font-weight: bold;
      letter-spacing: 2px;
    }
    img {
      width: 40px;
    }
  }
}
#sidebar-wrap::-webkit-scrollbar {
  display: none;
}
.el-menu {
  height: 100%;
}

// 美化左侧导航的留白
.el-submenu .el-menu-item {
  padding: 0 20px;
  min-width: 160px;
  padding-left: 50px !important;
}
</style>
