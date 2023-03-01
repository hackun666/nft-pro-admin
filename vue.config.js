// Config Reference: https://cli.vuejs.org/zh/config/
// 编译文件可视化工具
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  // publicPath默认是/，根据项目实际需要调整
  publicPath: process.env.NODE_ENV === "production" ? "/admin_666" : "/",
  productionSourceMap: false,
  devServer: {
    // openPage: "#/signin",
    port: 8081, // 配置端口号
    // 配置代理
    proxy: {
      "/": {
        target: "http://nft.sdxhan.top/",
        changeOrigin: true,
      },
    },
  },
};
