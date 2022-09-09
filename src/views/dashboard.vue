<template>
  <div class="homepage">
    <div class="data_box">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="data-card">
            <div class="tit">
              <span>藏品发布数量</span>
              <el-tag>今日发布</el-tag>
            </div>
            <div class="data-main">
              <div class="big din">
                +<countTo
                  :startVal="0"
                  :endVal="today_work"
                  :duration="3000"
                ></countTo
                ><small>件</small>
              </div>
            </div>
            <div class="meta">
              <span>总发布数</span>
              <span class="din">{{ total_work }} 件</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="data-card">
            <div class="tit">
              <span>注册用户</span>
              <el-tag>今日注册</el-tag>
            </div>
            <div class="data-main">
              <div class="big din">
                +<countTo
                  :startVal="0"
                  :endVal="today_user_num"
                  :duration="3000"
                ></countTo
                ><small>人</small>
              </div>
            </div>
            <div class="meta">
              <span>总注册用户</span>
              <span class="din">{{ total_user_num }} 人</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="data-card">
            <div class="tit">
              <span>一级市场订单量</span>
              <el-tag>本月订单</el-tag>
            </div>
            <div class="data-main">
              <div class="big din">
                <countTo
                  :startVal="0"
                  :endVal="order_num"
                  :duration="3000"
                ></countTo
                ><small>笔</small>
              </div>
            </div>
            <div class="meta">
              <span>总订单量</span>
              <span class="din">{{ total_order_num }} 笔</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="data-card">
            <div class="tit">
              <span>成交额</span>
              <el-tag>本月</el-tag>
            </div>
            <div class="data-main">
              <div class="big din">
                <small>¥</small
                ><countTo
                  :startVal="0"
                  :endVal="order_money"
                  :decimals="2"
                  :duration="3000"
                ></countTo>
              </div>
            </div>
            <div class="meta">
              <span>总成交额</span>
              <span class="din">¥ {{ total_order_money }} 元</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="data-card">
            <div class="tit">
              <span>二级市场订单量</span>
              <el-tag>本月订单</el-tag>
            </div>
            <div class="data-main">
              <div class="big din">
                <countTo
                  :startVal="0"
                  :endVal="order_num2"
                  :duration="3000"
                ></countTo
                ><small>笔</small>
              </div>
            </div>
            <div class="meta">
              <span>总订单量</span>
              <span class="din">{{ total_order_num2 }} 笔</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="data-card">
            <div class="tit">
              <span>二级市场成交额</span>
              <el-tag>本月</el-tag>
            </div>
            <div class="data-main">
              <div class="big din">
                <small>¥</small
                ><countTo
                  :startVal="0"
                  :endVal="order_money2"
                  :decimals="2"
                  :duration="3000"
                ></countTo>
              </div>
            </div>
            <div class="meta">
              <span>二级市场总成交额</span>
              <span class="din">¥ {{ total_order_money2 }} 元</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="home_bottom">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="tit_bar">
            <i class="el-icon-s-data"></i> 用户访问趋势
          </div>
          <div class="chart_box">
            <ve-histogram :data="chartData1" :settings="chartSettings"></ve-histogram>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="tit_bar">
            <i class="el-icon-s-flag"></i> 订单趋势
          </div>
          <div class="chart_box">
            <ve-line :data="chartData2" :settings="chartSettings"></ve-line>
          </div>
        </el-col>
      </el-row>
    </div> 
  </div>
</template>

<script>
import countTo from 'vue-count-to';
export default {
  name: "dashboard",
  components: {countTo},
  data() {
    this.chartSettings = {
      min: [1, 1],
      area: true,
    };
    return {
      chartData1: {
        columns: ["日期", "新增用户"],
        rows: [],
      },
      chartData2: {
        columns: ["日期", "订单数"],
        rows: [],
      },
      today_work: 0,
      total_work: 0,
      total_view: 0,
      today_view: 0,
      talent_num: 0,
      total_talent_num: 0,
      today_user_num: 0,
      total_user_num: 0,
      order_num: 0,
      total_order_num: 0,
      order_money: 0,
      total_order_money: 0,
      new_users: [],
      order_num2: 0,
      total_order_num2: 0,
      order_money2: 0,
      total_order_money2: 0,
    };
  },
  computed: {},
  mounted() {
    this.getHomeData()
  },
  methods: {
    async getHomeData() {
      let res = await this.$http.post("/manage/homedata", {
      token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        this.chartData1.rows = res.data1
        this.chartData2.rows = res.data2
        this.today_work = res.today_work
        this.total_work = res.total_work
        this.today_view = res.today_view
        this.total_view = res.total_view
        this.talent_num = res.talent_num
        this.total_talent_num = res.total_talent_num
        this.today_user_num = res.today_user_num
        this.total_user_num = res.total_user_num
        this.order_num = res.order_num
        this.total_order_num = res.total_order_num
        this.order_money = res.order_money
        this.total_order_money = res.total_order_money
        this.new_users = res.new_users
        this.order_num2 = res.order_num2
        this.total_order_num2 = res.total_order_num2
        this.order_money2 = res.order_money2
        this.total_order_money2 = res.total_order_money2
      }
    },
  },
};
</script>

<style lang="less" scoped>
.info_box {
  margin: 15px;
}
.data_box {
  margin-bottom: 25px;
}
.data-card {
  border: 1px solid #f1f1f1;
  background-color: #fff;
  .tit {
    font-size: 14px;
    font-weight: 500;
    padding: 10px;
    display: flex;
    color: #17233d;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
  }
  .data-main {
    padding: 20px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    border-bottom: 1px solid #f1f1f1;
    .big {
      font-size: 30px;
    }
    .users {
      padding-left: 10px;
      .img {
        display: block;
        border-radius: 50%;
        float: left;
        margin-left: -10px;
        img {      
          width: 30px;
          height: 30px;
          border: 1px solid #fff;
          border-radius: 50%;
        }
      }
    }
    p {
      line-height: 30px;
      color: #787878;
    }
  }
  .meta {
    padding: 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.data-card:hover {
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.08);
}
.homepage {
  margin: 15px;
  background-color: #fff;
  .tit_bar {
    font-size: 16px;
    color: #4f5a6c;
    // border-bottom: 1px solid #f1f1f1;
    margin-bottom: 15px;
    i {
      color: #ff445d;
    }
  }
}
.home_bottom {
    margin-bottom: 30px;
    .chart_box {
      padding: 10px;
      height: 360px;
      border: 1px solid #EBEEF5;
      border-radius: 3px;
    }
    .chart_box:hover {
      box-shadow: 0 0 20px rgba(0,0,0,.1);
    }
    .news_box {
      p {
        font-size: 16px;
        line-height: 35px;
        a {
          color: #4f5a6c;
        }
        a:hover {
          color: #ff445d;
        }
        i {
          font-size: 12px;
          padding-right: 10px;
          color: #f47004;
        }
      }
    }
  }
</style>


