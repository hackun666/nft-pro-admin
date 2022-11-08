import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// 登录
const signin = () => import("@/views/signin");
// 非登录页的包裹组件
const layout = () => import("@/layout");
// 嵌套的更深层级的包裹组件
const nested = () => import("@/layout/nested");
// 首页
const dashboard = () => import("@/views/dashboard");
// 空白页面
const blank = () => import("@/views/blank");
// 401
const unauthorized = () => import("@/views/401");
// 404
const notfound = () => import("@/views/404");
const orders = () => import("@/views/orders");
const message = () => import("@/views/message");
const users = () => import("@/views/users");
const bannerList = () => import("@/views/banners/bannerList");
const bannerAdd = () => import("@/views/banners/bannerAdd");
const mainList = () => import("@/views/mainList");
const create = () => import("@/views/create");

const verify = () => import("@/views/verify");
const siteconfig = () => import("@/views/config/siteconfig");
const payconfig = () => import("@/views/config/payconfig");
const baseconfig = () => import("@/views/config/baseconfig");
const translog = () => import("@/views/translog");
const nftlist = () => import("@/views/nftlist");
const market = () => import("@/views/market");
const notice = () => import("@/views/notice");
const addnotice = () => import("@/views/addnotice");
const artist = () => import("@/views/artist");
const producer = () => import("@/views/producer");
const nftitems = () => import("@/views/nftitems");
const blindgoods = () => import("@/views/blindgoods");
const txlog = () => import("@/views/txlog");
const boxlist = () => import("@/views/boxlist");
const kongtou = () => import("@/views/kongtou");
const rank = () => import("@/views/rank");
const tradelog = () => import("@/views/tradelog");
const rechargelog = () => import("@/views/rechargelog");

const xilie = () => import("@/views/xilie");
const cashrank = () => import("@/views/cashrank");

const router = new Router({
  routes: [
    // 首先是登录页的路由
    {
      path: "/signin",
      name: "signin",
      meta: {
        title: "后台登录",
      },
      component: signin,
    },
    {
      path: "/",
      name: "home",
      meta: {
        title: "首页",
        needLogin: true,
      },
      redirect: "/dashboard",
      component: layout,
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          meta: {
            title: "管理后台",
            needLogin: true,
          },
          component: dashboard,
        },
        {
          path: "siteconfig",
          name: "siteconfig",
          meta: {
            title: "基础资料",
            needLogin: true,
          },
          component: siteconfig,
        },
        {
          path: "payconfig",
          name: "payconfig",
          meta: {
            title: "支付配置",
            needLogin: true,
          },
          component: payconfig,
        },
        {
          path: "baseconfig",
          name: "baseconfig",
          meta: {
            title: "功能配置",
            needLogin: true,
          },
          component: baseconfig,
        },
        {
          path: "banners",
          name: "banners",
          meta: {
            title: "轮播图管理",
            needLogin: true,
          },
          component: nested,
          children: [
            {
              path: "list",
              name: "bannerList",
              meta: {
                title: "轮播图列表",
                needLogin: true,
              },
              component: bannerList,
            },
            {
              path: "add",
              name: "bannerAdd",
              meta: {
                title: "添加轮播图",
                needLogin: true,
              },
              component: bannerAdd,
            },
            {
              path: "edit",
              name: "bannerEdit",
              meta: {
                title: "编辑轮播图",
                needLogin: true,
              },
              component: bannerAdd,
            },
          ],
        },
        {
          path: "artist",
          name: "artist",
          meta: {
            title: "艺术家列表",
            needLogin: true,
          },
          component: artist,
        },
        {
          path: "producer",
          name: "producer",
          meta: {
            title: "发行方列表",
            needLogin: true,
          },
          component: producer,
        },
        {
          path: "xilie",
          name: "xilie",
          meta: {
            title: "藏品系列",
            needLogin: true,
          },
          component: xilie,
        },
        {
          path: "rank",
          name: "rank",
          meta: {
            title: "拉新排行",
            needLogin: true,
          },
          component: rank,
        },
        {
          path: "cashrank",
          name: "cashrank",
          meta: {
            title: "消费排行",
            needLogin: true,
          },
          component: cashrank,
        },
        {
          path: "message",
          name: "message",
          meta: {
            title: "消息通知",
            needLogin: true,
          },
          component: message,
        },
        {
          path: "users",
          name: "users",
          meta: {
            title: "用户管理",
            needLogin: true,
          },
          component: users,
        },
        {
          path: "mainList",
          name: "mainList",
          meta: {
            title: "藏品管理",
            needLogin: true,
          },
          component: mainList,
        },
        {
          path: "blindgoods",
          name: "blindgoods",
          meta: {
            title: "盲盒设置",
            needLogin: true,
          },
          component: blindgoods,
        },
        {
          path: "nftitems",
          name: "nftitems",
          meta: {
            title: "藏品管理",
            needLogin: true,
          },
          component: nftitems,
        },
        {
          path: "create",
          name: "create",
          meta: {
            title: "创建藏品",
            needLogin: true,
          },
          component: create,
        },
        {
          path: "txlog",
          name: "txlog",
          meta: {
            title: "用户提现记录",
            needLogin: true,
          },
          component: txlog,
        },
        {
          path: "rechargelog",
          name: "rechargelog",
          meta: {
            title: "用户充值记录",
            needLogin: true,
          },
          component: rechargelog,
        },
        {
          path: "tradelog",
          name: "tradelog",
          meta: {
            title: "市场交易记录",
            needLogin: true,
          },
          component: tradelog,
        },
        {
          path: "kongtou",
          name: "kongtou",
          meta: {
            title: "空投记录",
            needLogin: true,
          },
          component: kongtou,
        },
        {
          path: "verify",
          name: "verify",
          meta: {
            title: "待审认证",
            needLogin: true,
          },
          component: verify,
        },
        {
          path: "boxlist",
          name: "boxlist",
          meta: {
            title: "盲盒列表",
            needLogin: true,
          },
          component: boxlist,
        },
        {
          path: "orders",
          name: "orders",
          meta: {
            title: "藏品订单",
            needLogin: true,
          },
          component: orders,
        },
        {
          path: "market",
          name: "market",
          meta: {
            title: "交易市场",
            needLogin: true,
          },
          component: market,
        },
        {
          path: "nftlist",
          name: "nftlist",
          meta: {
            title: "藏品持有列表",
            needLogin: true,
          },
          component: nftlist,
        },
        {
          path: "translog",
          name: "translog",
          meta: {
            title: "转赠记录",
            needLogin: true,
          },
          component: translog,
        },
        {
          path: "notice",
          name: "notice",
          meta: {
            title: "公告管理",
            needLogin: true,
          },
          component: notice,
        },
        {
          path: "addnotice",
          name: "addnotice",
          meta: {
            title: "新增公告",
            needLogin: true,
          },
          component: addnotice,
        },
      ],
    },
    {
      path: "/401",
      name: "401",
      meta: {
        title: "Unauthorized",
      },
      component: unauthorized,
    },
    {
      path: "*",
      meta: {
        title: "404",
      },
      component: notfound,
    },
  ],
});

// 当一个导航触发时，全局的 before 钩子按照创建顺序调用。钩子是异步解析执行，此时导航在所有钩子 resolve 完之前一直处于等待中。
router.beforeEach((to, from, next) => {
  // 自动化修改页面标签的 title
  document.title = to.meta.title;
  window.scrollTo(0, 0);
  const isLogin = localStorage.getItem("dd_token");
  // console.log(isLogin)
  if (to.meta.needLogin) {
    if (isLogin) {
      next();
    } else {
      next({
        path: "/signin",
      });
    }
  } else {
    next();
  }
});

export default router;
