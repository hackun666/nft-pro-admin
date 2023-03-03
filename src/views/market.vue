<template>
  <div class="orders">
    <div class="fliter">
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入藏品名称" v-model="name" clearable>
        </el-input>
      </div>
      
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入卖家手机号" v-model="tel" clearable>
        </el-input>
      </div>
      
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入最低价" v-model="min_price" clearable>
        </el-input>
      </div>
      
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入最高价" v-model="max_price" clearable>
        </el-input>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="searchData">检索</el-button>
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
          label="编号"
          width="60"
        ></el-table-column>
        <el-table-column label="类型" align="center" width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.nft_type == 1">普通藏品</el-tag>
              <el-tag v-if="scope.row.nft_type == 2">盲盒</el-tag>
            </div>
          </template>
        </el-table-column>
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
        <el-table-column
          align="center"
          prop="title"
          label="藏品名称"
          width="200"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="nft_item_id"
          label="藏品唯一编号"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="price"
          label="转售价格"
          width="150"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="user.nickname"
          label="持有者昵称"
          width="150"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="user.mobile"
          label="卖家手机号"
          width="300"
        ></el-table-column>
        <el-table-column
          align="center"
          property="add_time"
          :formatter="dateFormat"
          label="转售时间"
          width="200"
        ></el-table-column>
        <el-table-column align="center" label="上架状态" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.onsale"
              active-value="1"
              inactive-value="0"
              @change="changeSta($event, scope.row.id)"
              active-color="#ff2b5b"
            ></el-switch>
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

    <el-dialog title="预览图片" :visible.sync="previewBox" width="1000px">
      <img :src="img_src" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
var moment = require("moment");
export default {
  components: {},
  data() {
    return {
      min_price: "",
      name: "",
      tel: "",
      max_price: "",
      end_date: "",
      loading: true,
      tableData: [],
      paginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 6,
      },
      previewBox: false,
      img_src: "",
      options: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "待审核",
        },
        {
          value: 2,
          label: "已审核",
        },
      ],
      status: 0,
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    async changeSta(event, id) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/marketsalesta", {
        token: localStorage.nft_pro_token,
        id: id,
      });
      if (res.errcode == 0) {
        this.$message.success("设置成功");
        loading.close();
        this.getData();
      } else {
        this.$message({
          message: res.msg,
          type: "warning",
        });
      }
    },
    editwork(id) {
      this.$router.push({
        path: "/create?id=" + id,
      });
    },
    preview(src) {
      this.img_src = src;
      this.previewBox = true;
    },
    async searchData() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/market", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.nft_pro_token,
        name: this.name,
        tel: this.tel,
        min_price: this.min_price,
        max_price: this.max_price,
      });
      this.loading = false;
      this.tableData = res.data;
      this.paginationData.total = res.total;
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delework(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async delework(id) {
      let res = await this.$http.get("/manage/delenft", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.$message.success("删除成功");
        this.getData();
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
