<template>
  <div class="orders">
    <div class="fliter">
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
          prop="uid"
          label="用户ID"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="mobile"
          label="手机号"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="nickname"
          label="昵称"
        ></el-table-column>
        <el-table-column align="center" label="邀请人数">
          <template slot-scope="scope">
            <span>{{ scope.row.ref_num }}</span>
            <el-divider direction="vertical"></el-divider>
            <el-link @click="editRef(scope.row.uid, scope.row.ref_num)"
              >修改</el-link
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效人数">
          <template slot-scope="scope">
            <span>{{ scope.row.real_num }}</span>
            <el-divider direction="vertical"></el-divider>
            <el-link @click="editReal(scope.row.uid, scope.row.real_num)"
              >修改</el-link
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

    <el-dialog title="修改邀请数量" :visible.sync="ref_box" width="300px">
      <div>
        <el-input-number
          v-model="ref_num"
          placeholder="邀请数量"
        ></el-input-number>
      </div>
      <br />
      <div>
        <el-input
          type="password"
          v-model="password"
          placeholder="操作密码"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ref_box = false">取 消</el-button>
        <el-button type="primary" @click="saveRef">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改有效数量" :visible.sync="edit_box" width="300px">
      <div>
        <el-input-number
          v-model="real_num"
          placeholder="有效数量"
        ></el-input-number>
      </div>
      <br />
      <div>
        <el-input
          type="password"
          v-model="password"
          placeholder="操作密码"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit_box = false">取 消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </span>
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
      loading: true,
      tableData: [],
      paginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      kongtou_list: [],
      edit_box: false,
      ref_box: false,
      password: "",
      real_num: "",
      ref_num: "",
      now_uid: 0,
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    editRef(uid, num) {
      this.now_uid = uid;
      this.ref_num = num;
      this.ref_box = true;
    },
    editReal(uid, num) {
      this.now_uid = uid;
      this.real_num = num;
      this.edit_box = true;
    },
    async saveRef() {
      let res = await this.$http.post("/manage/saveref", {
        token: localStorage.dd_token,
        uid: this.now_uid,
        ref_num: this.ref_num,
        password: this.password,
      });
      if (res.errcode == 0) {
        this.$message({
          type: "success",
          message: res.errmsg,
        });
        this.ref_box = false;
        this.getData();
      } else {
        this.$message({
          type: "error",
          message: res.errmsg,
        });
      }
    },
    async saveData() {
      let res = await this.$http.post("/manage/savereal", {
        token: localStorage.dd_token,
        uid: this.now_uid,
        real_num: this.real_num,
        password: this.password,
      });
      if (res.errcode == 0) {
        this.$message({
          type: "success",
          message: res.errmsg,
        });
        this.edit_box = false;
        this.getData();
      } else {
        this.$message({
          type: "error",
          message: res.errmsg,
        });
      }
    },
    exportData() {
      window.open("/manage/exportrank?token=" + localStorage.dd_token);
    },
    searchData() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/rankdata", {
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