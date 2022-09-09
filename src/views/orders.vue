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
        <el-input placeholder="请输入订单号" v-model="order_no" clearable>
        </el-input>
      </div>
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入手机号" v-model="tel" clearable>
        </el-input>
      </div>
      <div class="fliter_item" style="width: 200px">
        <el-select
          v-model="status"
          placeholder="选择订单状态"
          style="width: 100%" clearable
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
      <div class="fliter_item" style="width: 200px">
        <el-select
          v-model="nft_id"
          placeholder="选择藏品"
          style="width: 100%" clearable
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
        <el-button type="primary" @click="searchOrders">检索订单</el-button>
      </div>
      <div class="fliter_item">
        <el-button type="success" @click="exportOrders">导出订单</el-button>
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
        <el-table-column
        align="center"
          type="index"
          label="编号ID"
          width="80"
        ></el-table-column>
        <el-table-column label="订单类型" align="center" width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.order_type == 1">普通藏品</el-tag>
              <el-tag v-if="scope.row.order_type == 2">盲盒</el-tag>
              <el-tag v-if="scope.row.order_type == 3">市场订单</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="order_no" width="200" label="订单号"></el-table-column>
        <el-table-column
          label="订单状态" align="center" width="120">
          <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag v-if="scope.row.status == 1" type="success" size="medium">已支付</el-tag>
                <el-tag v-if="scope.row.status == 0" type="danger" size="medium">未支付</el-tag>
                <el-tag v-if="scope.row.status == 2" type="info" size="medium">已取消</el-tag>
              </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="nickname" label="用户昵称" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.user.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号" prop="user.mobile" width="150"></el-table-column>
        <el-table-column
          label="购买数量" align="center" width="120">
          <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag type="success" size="medium">×{{scope.row.buy_num}}</el-tag>
              </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="fee" label="交易金额" width="120"></el-table-column>
        <el-table-column align="center" label="藏品标题" width="200">
          <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <p>{{scope.row.title}}</p>
              </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="藏品封面" width="100">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover" fit="fit" :preview-src-list="toarray(previewcover[scope.row.id])" style="width: 60px; height: 60px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="add_time" label="下单时间"  width="200" :formatter="dateFormat"></el-table-column>
        <el-table-column align="center" prop="pay_time" label="支付时间"  width="200" :formatter="dateFormat"></el-table-column>

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
      date: '',
      order_no: "",
      name: "",
      tel: "",
      nft_id: "",
      status: -1,
      start_date: '',
      end_date: '',
      options: [
        {
          value: -1,
          label: "全部订单",
        },
        {
          value: 0,
          label: "未支付",
        },
        {
          value: 1,
          label: "已支付",
        },
        {
          value: 2,
          label: "已取消",
        },
      ],
      loading: true,
      tableData: [],
      paginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      previewcover: [],
      nfts: [],
    };
  },
  computed: {},
  mounted() {
    this.getData();
    this.getNftlist();
  },
  methods: {
    async getNftlist() {
      let res = await this.$http.get("/manage/nftlistall",{
        
        token: localStorage.dd_token,
      });
      this.nfts = res.data;
    },
    pickDate(e){
      console.log(e)
      this.start_date = e[0]
      this.end_date = e[1]
    },
    seebig(c){
      this.previewcover[0] = c; 
      console.log(this.previewcover)
    },
    toarray(c){
      return [c];
    },
    exportOrders(){
      if(this.nft_id > 0){
      window.open('/manage/exportorders?id=' + this.nft_id);
      }
    },
    async searchOrders() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/orderlist", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.dd_token,
        order_no: this.order_no,
        name: this.name,
        tel: this.tel,
        nft_id: this.nft_id,
        status: this.status,
        start_date: this.start_date,
        end_date: this.end_date,
      });
      this.loading = false;
      this.tableData = res.data;
      this.tableData.forEach(item => {
        this.previewcover[item.id] = item.cover;
      });
      // console.log(this.previewcover)
      // console.log(this.tableData)
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
      if (date == 0 || date == undefined) {
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


