<template>
  <footer>
    <span>
      2022 © 版权所有
    </span>
    <el-backtop target=".page-component-wrap" :bottom="60"></el-backtop>
  </footer>
</template>
<style lang="less" scoped>
footer {
  padding: 25px;
  font-size: 14px;
  text-align: center;
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  font-size: 14px;
  color: #909399;
  border-top: 1px solid #efefef;
  i {
    padding-left: 4px;
  }
  a,
  i {
    text-decoration: none;
    color: #606266;
  }
}
</style>