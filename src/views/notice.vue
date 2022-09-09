<template>
  <div class="message">
    <div class="info_box">
      <div class="fliter">
        <div class="fliter_item">
          <el-button type="primary" icon="el-icon-plus" @click="addNotice"
            >添加公告</el-button
          >
        </div>
      </div>

      <div class="line"></div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        v-loading="loading"
      >
        <el-table-column
          type="index"
          label="编号ID"
          width="80"
        ></el-table-column>
        <el-table-column prop="title" label="公告标题"></el-table-column>
        <el-table-column
          property="addtime"
          :formatter="dateFormat"
          label="发布时间"
        ></el-table-column>
        <el-table-column align="center" label="显示状态" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_hide"
              active-value="0"
              inactive-value="1"
              @change="changeSta($event, scope.row.id)"
              active-color="#ff2b5b"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link @click="editNotice(scope.row.id)">编辑</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-link
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
      let res = await this.$http.post("/manage/noticesta", {
        token: localStorage.dd_token,
        id: id,
      });
      if (res.errcode == 0) {
        this.$message.success("设置成功");
        loading.close();
        this.getData();
      } else {
        this.$message({
          message: res.errmsg,
          type: "warning",
        });
      }
    },
    addNotice() {
      this.$router.push({
        path: "/addnotice",
      });
    },
    editNotice(id) {
      this.$router.push({
        path: "/addnotice?id=" + id,
      });
    },
    async getData() {
      let res = await this.$http.get("/manage/noticelist", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.dd_token,
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
      if (date == undefined) {
        return "";
      }
      return moment(date * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteNotice(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async deleteNotice(id) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/delenotice", {
        token: localStorage.dd_token,
        id: id,
      });
      if (res.errcode == 0) {
        this.$message.success("删除成功");
        loading.close();
        this.getData();
      } else {
        this.$message({
          message: res.msg,
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
