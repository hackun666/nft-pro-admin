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
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="卖家手机号" v-model="tel" clearable>
        </el-input>
      </div>
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="买家手机号" v-model="buyer" clearable>
        </el-input>
      </div>
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="订单号" v-model="order_no" clearable>
        </el-input>
      </div>
      
      <div class="fliter_item" style="width: 200px">
        <el-select
          v-model="nft_id"
          placeholder="选择藏品"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in nfts"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          >
          </el-option>
        </el-select>
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
        <el-table-column align="center" prop="id" label="编号" width="80"></el-table-column>
        <el-table-column align="center" label="藏品封面" width="100">
          <template slot-scope="scope">
            <el-image
              @click="preview(scope.row.cover)"
              :src="scope.row.cover"
              style="width: 60px; height: 60px"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="藏品名称"></el-table-column>
        <el-table-column align="center" prop="nft_item_id" label="藏品ID"></el-table-column>
        <!-- <el-table-column align="center" prop="box_id" label="盲盒ID"></el-table-column> -->
        <el-table-column align="center" prop="from_user.mobile" label="卖家手机号"></el-table-column>
        <el-table-column align="center" prop="to_user.mobile" label="买家手机号"></el-table-column>
        <el-table-column align="center" prop="fee" label="卖出金额"></el-table-column>
        <el-table-column align="center" prop="order_no" label="订单号"></el-table-column>
        <el-table-column align="center" prop="pay_time" label="交易时间"  :formatter="dateFormat"></el-table-column>
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
      nfts: [],
      nft_id: "",
      start_date: "",
      end_date: "",
    };
  },
  computed: {},
  mounted() {
    this.getData();
    this.getNftlist();
  },
  methods: {
    async getNftlist() {
      let res = await this.$http.get("/manage/nftlistall", {
        token: localStorage.dd_token,
      });
      this.nfts = res.data;
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
      let res = await this.$http.get("/manage/tradelog", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.dd_token,
        tel: this.tel,
        buyer: this.buyer,
        order_no: this.order_no,
        nft_id: this.nft_id,
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


