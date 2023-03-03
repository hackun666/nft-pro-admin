<template>
  <div class="orders">
    <div class="fliter">
      <div class="fliter_item">
        <el-button @click="handleBatchApprove" type="primary"
          >批量设为已付款</el-button
        >
      </div>
      <div class="fliter_item">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="pickDate"
        >
        </el-date-picker>
      </div>
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入手机号" v-model="tel" clearable>
        </el-input>
      </div>
      <div class="fliter_item" style="width: 200px">
        <el-select
          v-model="status"
          placeholder="选择提现状态"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="searchTx">检索提现</el-button>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="exportTx">导出提现</el-button>
      </div>
    </div>
    <div class="eic_table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          prop="id"
          label="编号"
          width="80"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="id"
          label="编号"
          width="80"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="user.mobile"
          label="用户手机号"
        ></el-table-column>

        <el-table-column label="提现方式" align="center" width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.pay_type == 1">微信</el-tag>
              <el-tag v-if="scope.row.pay_type == 2">支付宝</el-tag>
              <el-tag v-if="scope.row.pay_type == 3">银行卡</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提现账户信息">
          <template slot-scope="scope">
            <el-link type="primary" @click="viewAccount(scope.row.pay_config)"
              >点击查看</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="cash"
          label="提现金额"
        ></el-table-column>
        <el-table-column
          align="center"
          property="addtime"
          :formatter="dateFormat"
          label="提现申请时间"
        ></el-table-column>
        <el-table-column
          align="center"
          property="paytime"
          :formatter="dateFormat"
          label="提现审核时间"
        ></el-table-column>
        <el-table-column align="center" label="提现状态" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0">未付款</el-tag>
            <el-tag v-if="scope.row.status == 1">已付款</el-tag>
            <!-- <el-tag v-if="scope.row.status == 2">派发中</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="hy_bill_no"
          label="汇元订单"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <el-link
              type="primary"
              v-if="scope.row.status == 0"
              @click="handleApprove(scope.row.id)"
              >设为已发放</el-link
            >
            <el-divider direction="vertical" v-if="scope.row.status == 0"></el-divider>
            <el-link
              type="primary"
              v-if="scope.row.status == 0"
              @click="heepay(scope.row.id)"
              >汇元付款</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          background
          :current-page="paginationData.currentPage"
          :page-size.sync="paginationData.pageSize"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
          :total="paginationData.total"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      title="查看收款账户"
      :visible.sync="pay_account_box"
      width="600px"
    >
      <el-descriptions
        title="用户收款账户信息"
        v-if="pay_info"
        :column="2"
        border
      >
        <el-descriptions-item label="真实姓名">{{
          pay_info.real_name
        }}</el-descriptions-item>
        <el-descriptions-item label="微信帐号">{{
          pay_info.wechat_id
        }}</el-descriptions-item>
        <el-descriptions-item label="支付宝帐号">{{
          pay_info.alipay_id
        }}</el-descriptions-item>
        <el-descriptions-item label="开户行">{{
          pay_info.bank_name
        }}</el-descriptions-item>
        <el-descriptions-item label="银行帐号">
          <el-tag size="small">{{ pay_info.bank_no }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
var moment = require("moment");
export default {
  components: {},
  data() {
    return {
      date: "",
      name: "",
      tel: "",
      start_date: "",
      end_date: "",
      loading: true,
      tableData: [],
      paginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      workBox: false,
      workImgs: [],
      previewBox: false,
      img_src: "",
      pay_account_box: false,
      pay_info: null,
      selstr: "",
      status: 0,
      options: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "待付款",
        },
        {
          value: 2,
          label: "已付款",
        },
        {
          value: 3,
          label: "付款中",
        },
      ],
      start_date: "",
      end_date: "",
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    async searchTx() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    pickDate(e) {
      console.log(e);
      this.start_date = e[0];
      this.end_date = e[1];
    },
    exportTx() {
      window.open(
        "/manage/exporttx?status=" +
          this.status +
          "&start_date=" +
          this.start_date +
          "&end_date=" +
          this.end_date +
          "&token=" +
          localStorage.nft_pro_token
      );
    },
    handleSelectionChange(selection) {
      console.log(selection);
      var i = 0;
      var str = "";
      for (i = 0; i < selection.length; i++) {
        str += selection[i].id + ",";
      }
      str = str.substring(0, str.length - 1);
      console.log(str);
      this.selstr = str;
    },
    heepay(id) {
      this.$confirm("确认使用汇元进行提现吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.heepayConfirm(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async heepayConfirm(id) {
      let res = await this.$http.get("/heepay/transfer", {
        token: localStorage.nft_pro_token,
        id: id,
      });
      if (res.errcode == 0) {
        this.$message.success("发放成功");
        this.getData();
      } else {
        this.$message({
          message: res.errmsg,
          type: "warning",
        });
      }
      
    },
    handleApprove(id) {
      this.$confirm("确认发放吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.approve(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async approve(id) {
      let res = await this.$http.get("/manage/approvetx", {
        token: localStorage.nft_pro_token,
        id: id,
      });
      if (res.errcode == 0) {
        this.$message.success("设置成功");
        this.getData();
      } else {
        this.$message({
          message: res.msg,
          type: "warning",
        });
      }
    },
    handleBatchApprove() {
      let that = this;
      this.$confirm("确认发放吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log();
          this.approveBatch(that.selstr);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async approveBatch(selstr) {
      this.$message.success("请求成功");
      let res = await this.$http.get("/manage/batchapprovetx", {
        token: localStorage.nft_pro_token,
        ids: selstr,
      });
      if (res.errcode == 0) {
        this.$message.success("设置成功");
        this.getData();
      } else {
        this.$message({
          message: res.msg,
          type: "warning",
        });
      }
    },
    viewAccount(res) {
      console.log(res);
      this.pay_info = res;
      this.pay_account_box = true;
    },
    pickDate(e) {
      console.log(e);
      this.start_date = e[0];
      this.end_date = e[1];
    },
    async searchOrders() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/txlog", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.nft_pro_token,
        start_date: this.start_date,
        end_date: this.end_date,
        status: this.status,
        tel: this.tel,
      });
      this.loading = false;
      this.tableData = res.data;
      if (res.total > 0) {
        this.paginationData.total = res.total;
      }
    },
    handleCurrentChange(num) {
      this.paginationData.currentPage = num;
      this.getData();
    },
    dateFormat: function (row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="less" scoped>
.orders {
  margin: 15px;
  background-color: #fff;
}
.xline {
  margin: 10px;
}
</style>