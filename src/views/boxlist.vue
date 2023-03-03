<template>
  <div class="orders">
    <div class="fliter">
      <div class="fliter_item">
        <el-button icon="el-icon-back" @click="goBacK">返回列表</el-button>
      </div>
      <div class="fliter_item" style="width: 240px">
        <el-input placeholder="请输入手机号码或钱包地址" v-model="tel" clearable>
        </el-input>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="searchData">检索藏品</el-button>
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
        <el-table-column
          align="center"
          prop="no"
          label="藏品编号" width="120"
        ></el-table-column>
        
        <el-table-column label="开启状态" align="center" width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.open_sta == 1">已开启</el-tag>
              <el-tag v-else type="success">未开启</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="user.mobile"
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
          property="open_time"
          :formatter="dateFormat"
          label="开启时间"
        ></el-table-column>

        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-link type="danger" @click="destroyBox(scope.row.id)"
              >销毁</el-link
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

  </div>
</template>

<script>
var moment = require("moment");
export default {
  components: {},
  data() {
    return {
      loading: true,
      tableData: [],
      paginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      nft_id: 0,
      nft: {
        name: "",
        uri: "",
        data: "",
        amount: 1,
      },
      rules: {
        name: [{ required: true, message: "请填写NFT名称", trigger: "blur" }],
      },
      nft_box: false,
      nft_list: [],
      classes: [],
      tel: '',
    };
  },
  computed: {},
  mounted() {
    let id = this.$route.query.id;
    if (id > 0) {
      this.nft_id = id;
      this.getData();
    }
  },
  methods: {
    searchData(){
      this.paginationData.currentPage = 1;
      this.getData();
    },
    goBacK() {
      this.$router.push({
        path: "/mainList",
      });
    },
    async getData() {
      let res = await this.$http.get("/manage/myboxlist", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.nft_pro_token,
        status: this.status,
        id: this.nft_id,
        tel: this.tel
      });
      this.loading = false;
      this.tableData = res.data;
      this.paginationData.total = res.total;
    },
    destroyBox(id) {
      this.$confirm("此操作将永久销毁该NFT数据且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.handleDestroyNft(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async handleDestroyNft(id) {
      let res = await this.$http.post("/manage/destroybox", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.$message.success("当前盲盒销毁成功");
        this.getData();
      } else {
        this.$message.error(res.errmsg);
      }
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
