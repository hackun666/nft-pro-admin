<template>
  <div id="app">
    <router-view></router-view>
    <!-- 如果不同路由渲染同一组件，会导致数据不更新，这时候可以巧妙的加一个不同的Key -->
    <!-- <router-view :key="$route.fullpath"></router-view> -->
  </div>
</template>
<script>
// import router from "./router/index";
// import generateRoutes from "./router/parser";
export default {
  name: "app",
  // 在SPA初始化时，立刻从本地存储中拿到原始数据，解析后注入到路由实例中【吐血】
  // created() {
  //   if (localStorage.menu) {
  //     const menu = JSON.parse(localStorage.menu);
  //     const _routes = generateRoutes(menu);
  //     router.addRoutes(_routes);
  //   }
  // }
};
</script>

<style lang="less">
// 此处的lang必须是less，
// 如果是普通的css的话，最开始，下方全局的样式将不会被换肤插件抽离出来，修改后刷新页面才可以。
// 所以，只能改成less了，但是是全局的
html,
body {
  height: 100%;
}
@font-face {
  font-family: "din";
  src: url("assets/fonts/DIN.otf");
  font-style: normal;
  font-weight: normal;
}
.din {
  font-family: "din";
}
body {
  margin: 0;
  padding: 0;
      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
  #app {
    height: 100%;
  }
}

.pagination-wrap {
  margin-top: 20px;
}
.info_box {
  padding: 20px;
  background-color: #fff;
}
.line {
  height: 1px;
  width: 100%;
  margin: 20px 0;
  background-color: #f6f7f8;
}
.center {
  text-align: center;
}
.el-dropdown {
  cursor: pointer;
}
.fliter {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.fliter_item {
  margin-left: 10px;
  margin-bottom: 10px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

::selection {
    background: #406d91;
    color: #fff;
}
.flex_left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.ma {
  margin-left: auto!important;
}
.mb20 {
  margin-bottom: 20px!important;
}
.ml10 {
  margin-left: 10px!important;
}
.ml20 {
  margin-left: 20px!important;
}
.tips {
  font-size: 12px;
  color: #aaa;
}
</style>
