<template>
  <div class="orders">

    <div class="fliter">
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入姓名" v-model="name" clearable>
        </el-input>
      </div>
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入注册手机号" v-model="tel" clearable>
        </el-input>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="searchOrders">检索</el-button>
      </div>
    </div>

    <div class="eic_table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        border
        v-loading="loading"
      >
        <el-table-column align="center" prop="userid" label="用户UID"></el-table-column>
        <el-table-column align="center" prop="nickname" label="用户昵称"></el-table-column>
        <el-table-column align="center" prop="real_name" label="姓名"></el-table-column>
        <el-table-column align="center" prop="mobile" label="认证手机号"></el-table-column>
        <el-table-column align="center" prop="id_no" label="身份证号"></el-table-column>
        <el-table-column align="center" prop="bank_card_no" label="银行卡号"></el-table-column>
        <el-table-column align="center"
          property="add_time"
          :formatter="dateFormat"
          label="认证时间"
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
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    preview(src){
      this.img_src = src
      this.previewBox = true
    },
    async approve(uid) {
      let res = await this.$http.get("/manage/approvetalent", {
        uid: uid,
      });
      if (res.errcode == 0) {
        this.$message.success("审核成功");
        this.getData();
      }
    },
    async dele(uid) {
      let res = await this.$http.get("/manage/deletalent", {
        uid: uid,
      });
      if (res.errcode == 0) {
        this.$message.success("删除成功");
        this.getData();
      }
    },
    showWorks(imgs) {
      this.workImgs = imgs;
      this.workBox = true;
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
      let res = await this.$http.get("/manage/verifylist", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.dd_token,
        name: this.name,
        tel: this.tel,
        start_date: this.start_date,
        end_date: this.end_date,
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
</style>


