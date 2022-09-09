<template>
  <div class="orders">
    <div class="fliter">
      <div class="fliter_item" style="width: 240px">
        <el-input placeholder="请输入手机号码" v-model="tel" clearable>
        </el-input>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="searchData">检索任务</el-button>
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
          prop="id"
          label="系统ID" width="120"
        ></el-table-column>
        <el-table-column label="任务状态" align="center" width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.status == 1">已完成</el-tag>
              <el-tag v-else type="success">未执行</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="nft_name"
          label="藏品名称" width="200"
        ></el-table-column>
        
        <el-table-column
          align="center"
          prop="amount"
          label="藏品数量" width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="mobile"
          label="手机号"
          width="200"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="userid"
          label="用户ID" width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          property="time"
          :formatter="dateFormat"
          label="任务创建时间"
        ></el-table-column>
        <el-table-column
          align="center"
          property="send_time"
          :formatter="dateFormat"
          label="发送时间"
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
      tel: '',
      loading: true,
      tableData: [],
      paginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      kongtou_list: [],
    };
  },
  computed: {},
  mounted() {
      this.getData();
  },
  methods: {
    searchData(){
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/kongtouhistory", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.dd_token,
        tel: this.tel,
      });
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
