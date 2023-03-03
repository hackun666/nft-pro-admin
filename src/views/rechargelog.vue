<template>
  <div class="orders">

    <div class="fliter">
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="输入手机号" v-model="tel" clearable>
        </el-input>
      </div>
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="订单号" v-model="order_no" clearable>
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
        <el-table-column align="center" prop="id" label="系统ID" width="80"></el-table-column>
        <el-table-column align="center" prop="order_no" label="订单号"></el-table-column>
        <el-table-column
          label="订单状态" align="center" width="120">
          <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag v-if="scope.row.status == 1" type="success" size="medium">已支付</el-tag>
                <el-tag v-if="scope.row.status == 0" type="danger" size="medium">未支付</el-tag>
              </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="user.mobile" label="手机号"></el-table-column>
        <el-table-column align="center" prop="fee" label="充值金额"></el-table-column>
        <el-table-column align="center" prop="add_time" label="下单时间"  :formatter="dateFormat"></el-table-column>
        <el-table-column align="center" prop="pay_time" label="付款时间"  :formatter="dateFormat"></el-table-column>
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

    <el-dialog title="查看作品" :visible.sync="workBox" width="1000px">
      <el-carousel trigger="click" height="600px">
        <el-carousel-item v-for="item in workImgs" :key="item.id">
          <el-image
            :src="item.url"
            style="width: 1000px; height: 600px"
            fit="contain"
          ></el-image>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    
    <el-dialog title="预览图片" :visible.sync="previewBox" width="1000px">
      <img :src="img_src" width="100%">
    </el-dialog>

    
    <el-dialog title="订单详情" :visible.sync="notify_data_box" width="500px">
      <p>{{notify_data}}</p>
    </el-dialog>
  </div>
</template>

<script>
var moment = require("moment");
export default {
  components: {},
  data() {
    return {
      tel: "",
      buyer: "",
      order_no: "",
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
      img_src: '',
      notify_data: '',
      notify_data_box: false,
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    showData(notify_data){
      this.notify_data = notify_data;
      this.notify_data_box = true;
    },
    pickDate(e) {
      console.log(e);
      this.start_date = e[0];
      this.end_date = e[1];
    },
    async searchData() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/rechargelog", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.nft_pro_token,
        tel: this.tel,
        order_no: this.order_no,
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


