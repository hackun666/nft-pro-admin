<template>
  <div class="info_box">
    <div class="fliter">
      <div class="fliter_item">
        <el-button type="primary" icon="el-icon-plus" @click="add"
          >添加轮播图</el-button
        >
      </div>
    </div>

    <div class="line"></div>
    <div class="eic_table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        border
        v-loading="loading"
      >
        <el-table-column
          type="index"
          label="编号ID"
          width="80" align="center"
        ></el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.src" width="150px"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          label="跳转链接"
          align="center"
        ></el-table-column>
        <el-table-column
          property="addtime"
          :formatter="dateFormat"
          label="添加时间" align="center"
        ></el-table-column>
        <el-table-column
          property="updatetime"
          :formatter="dateFormat"
          label="更新时间" align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand" trigger="click">
              <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="
                    beforeHandleCommand(scope.$index, scope.row, 'edit')
                  "
                  icon="el-icon-edit"
                  >编辑</el-dropdown-item
                >
                <el-dropdown-item
                  :command="
                    beforeHandleCommand(scope.$index, scope.row, 'delete')
                  "
                  icon="el-icon-document-copy"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
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
    add() {
      this.$router.push({
        name: "bannerAdd",
      });
    },
    async searchOrders() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/banners", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.dd_token,
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
    formatTime(timestamp) {
      return moment(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    beforeHandleCommand(index, row, command) {
      return {
        index: index,
        row: row,
        command: command,
      };
    },
    handleCommand(command) {
      switch (command.command) {
        case "edit":
          this.handleEdit(command.index, command.row);
          break;
        case "delete":
          this.handleDelete(command.index, command.row);
          break;
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.$router.push({
        path: "/banners/edit",
        query: {
          id: row.id,
        },
      });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteInfo(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async deleteInfo(id) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/delebanner", {
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

<style lang="less" scoped>
</style>


