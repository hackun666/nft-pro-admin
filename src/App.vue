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
@charset "utf-8";
/* CSS Document */
body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
form,
fieldset,
input,
textarea,
p,
blockqueue,
th,
td {
  margin: 0;
  padding: 0;
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  -webkit-text-size-adjust: none !important;
}

table {
  border-collapse: collpase;
  border-spacing: 0;
}

fieldset,
img {
  border: 0;
}

address,
caption,
cite,
code,
dfn,
em,
strong,
th,
var {
  font-style: normal;
}
a {
  text-decoration: none;
}

ol,
ul {
  list-style: none;
}

caption,
th {
  text-align: left;
}

input[type="text"],
input[type="button"],
input[type="submit"],
input[type="reset"],
input[type="tel"],
textarea,
button {
  -webkit-appearance: none;
}
.el {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.transition {
  -webkit-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}
.el2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.el3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

[v-cloak] {
  display: none;
}
.flex_center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex_start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.flex_end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.flex_between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex_around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.flex_evenly {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.flex_column {
  display: flex;
  flex-direction: column;
}
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
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
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
  margin-left: auto !important;
}
.mb20 {
  margin-bottom: 20px !important;
}
.ml10 {
  margin-left: 10px !important;
}
.ml20 {
  margin-left: 20px !important;
}
.tips {
  font-size: 12px;
  color: #aaa;
}
</style>
