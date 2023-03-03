<template>
  <div class="message">
    <div class="info_box">
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
        <el-table-column prop="title" label="消息标题"></el-table-column>
        <el-table-column prop="content" label="消息内容"></el-table-column>
        <el-table-column
          property="addtime"
          :formatter="dateFormat"
          label="发送时间"
        ></el-table-column>
        <el-table-column
          label="阅读状态"
          width="120">
          <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.is_read>0?'已读':'未读' }}</el-tag>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.is_read < 1" @click="handleEdit(scope.$index, scope.row)"
              >设为已读</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
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
    async getData() {
      let res = await this.$http.get("/api/user/message", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.nft_pro_token,
      });
      this.loading = false;
      this.tableData = res.data;
      if (res.total > 0) {
        this.$store.commit('setMsgNum',res.total)
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
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteMsg(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async deleteMsg(id) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/api/user/delmsg", {
        token: localStorage.nft_pro_token,
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

<style lang="less" scoped>
</style>


