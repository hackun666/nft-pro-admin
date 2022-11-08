<template>
  <div class="orders">
    <div class="fliter">
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
      <div class="fliter_item" style="width: 240px">
        <el-input placeholder="请输入手机号码" v-model="tel" clearable>
        </el-input>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="searchData">检索</el-button>
      </div>
      <div class="fliter_item">
        <el-button type="success" @click="exportData">导出</el-button>
      </div>
    </div>
    <div class="eic_table">
      <el-table
        :data="tableData"
        stripe
        border
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="userid"
          label="用户ID"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="user.mobile"
          label="手机号"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="user.nickname"
          label="昵称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cash"
          label="消费金额"
        ></el-table-column>
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
  </div>
</template>

<script>
var moment = require("moment");
export default {
  components: {},
  data() {
    return {
      date: "",
      tel: "",
      loading: true,
      tableData: [],
      orders_num_cs: 0,
      paginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      kongtou_list: [],
      start_date: "",
      end_date: "",
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    pickDate(e) {
      console.log(e);
      this.start_date = e[0];
      this.end_date = e[1];
    },
    exportData() {
      window.open(
        "/manage/exportcashrank?token=" +
          localStorage.dd_token +
          "&start_date=" +
          this.start_date +
          "&end_date=" +
          this.end_date
      );
    },
    searchData() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/cashrank", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.dd_token,
        tel: this.tel,
        start_date: this.start_date,
        end_date: this.end_date,
      });
      this.orders_num_cs = res.orders_num_cs;
      this.loading = false;
      this.tableData = res.data;
      this.paginationData.total = res.total;
    },
    handleCurrentChange(num) {
      this.paginationData.currentPage = num;
      this.getData();
    },
    dateFormat: function (row, column) {
      var date = row[column.property];
      if (date == undefined || date == 0) {
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
</style>