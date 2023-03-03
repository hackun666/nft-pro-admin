<template>
  <div class="orders">

    <div class="fliter">
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入发送人手机号" v-model="sender" clearable>
        </el-input>
      </div>
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入接收人手机号" v-model="reciver" clearable>
        </el-input>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="searchData">检索</el-button>
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
        <el-table-column align="center" prop="id" label="ID" width="80"></el-table-column>
        <el-table-column align="center" label="藏品封面" width="100">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.info.uri"
              style="width: 60px; height: 60px"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="info.name" label="藏品名称"></el-table-column>
        <el-table-column align="center" prop="info.no" label="藏品编号"></el-table-column>
        <el-table-column align="center" prop="sender.mobile" label="发送人手机号"></el-table-column>
        <el-table-column align="center" prop="reciver.mobile" label="接收人手机号"></el-table-column>
        <el-table-column align="center"
          property="time"
          :formatter="dateFormat"
          label="赠送时间"
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
      sender: "",
      reciver: "",
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
      img_src: ''
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    searchData(e) {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async searchOrders() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/translog", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.nft_pro_token,
        sender: this.sender,
        reciver: this.reciver,
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


