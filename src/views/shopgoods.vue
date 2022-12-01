<template>
  <div class="info_box">
    <div class="fliter">
      <div class="fliter_item">
        <el-button type="primary" icon="el-icon-plus" @click="add"
          >添加商品</el-button
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
        row-key="id"
        v-loading="loading"
      >
        <el-table-column
          type="index"
          label="编号ID"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column label="类型" align="center" width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.type == 1">数字藏品</el-tag>
              <el-tag v-if="scope.row.type == 2">实物商品</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品封面">
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
          prop="title"
          label="商品名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="score"
          label="需要积分"
          align="center"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="num"
          label="库存数量"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          property="sale_time"
          :formatter="dateFormat"
          label="开售时间"
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
        <el-table-column
          align="center"
          property="add_time"
          :formatter="dateFormat"
          label="发布时间"
          width="200"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="240" fixed="right">
          <template slot-scope="scope">
            <el-link @click="openVip(scope.row.id)" v-if="scope.row.type == 1">藏品管理</el-link>
            <el-divider direction="vertical" v-if="scope.row.type == 1"></el-divider>
            <el-link type="warning" @click="editGood(scope.row.id)"
              >编辑</el-link
            >
            <el-divider direction="vertical"></el-divider>
            <el-link type="danger" @click="deleGood(scope.row.id)"
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

    <el-dialog title="藏品列表" :visible.sync="vip_box" width="800px">
      <div class="fliter">
        <div class="fliter_item">
          <el-button icon="el-icon-edit" @click="vip_rule_box = true"
            >新增藏品</el-button
          >
        </div>
      </div>
      <div class="eic_table">
        <el-table
          ref="multipleTable"
          :data="mall_goods"
          height="400"
          stripe
          size="mini"
          border
        >
          <el-table-column
            align="center"
            prop="id"
            label="编号"
            width="80"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="title"
            label="藏品名称"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="num"
            label="藏品份数"
          ></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-link type="danger" @click="deletegood(scope.row.id)"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog title="新增藏品" :visible.sync="vip_rule_box" width="500px">
      <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="选择藏品">
          <el-select v-model="ruleForm.nft_main_id" placeholder="请选择">
            <el-option
              v-for="item in nft_list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收到份数">
          <el-input-number v-model="ruleForm.num" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveMallGood">保存信息</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
      artistBox: false,
      name: "",
      id: 0,
      face: "",
      desc: "",
      good_box: false,
      mall_goods: [],
      vip_box: false,
      vip_rule_box: false,
      ruleForm: {
        item_id: "",
        nft_main_id: "",
        num: 1,
      },
      nft_list: [],
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    openVip(id) {
      this.id = id;
      this.vip_box = true;
      this.getmallgoods();
      this.getNft();
    },
    async getNft() {
      let res = await this.$http.get("/manage/nftall",{
        
        token: localStorage.dd_token,
      });
      this.nft_list = res.data;
      this.nft_box = res.nft_box;
    },
    async getmallgoods() {
      let res = await this.$http.post("/manage/getmallgoods", {
        token: localStorage.dd_token,
        id: this.id,
      });
      if (res.errcode == 0) {
        this.mall_goods = res.data;
      }
    },
    async deletegood(id) {
      let res = await this.$http.get("/manage/deletemallgood", {
        id: id,
        token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        this.$message.success("删除成功");
        this.getmallgoods();
      } else {
        this.$message.error(res.data.errmsg);
      }
    },
    async saveMallGood() {
      let res = await this.$http.post("/manage/savemallgood", {
        id: this.id,
        token: localStorage.dd_token,
        rule: this.ruleForm,
      });
      if (res.errcode == 0) {
        this.$message.success("保存成功");
        this.getmallgoods();
        this.vip_rule_box = false;
        this.ruleForm = {
          item_id: "",
          nft_main_id: "",
          num: 1,
        };
      } else {
        this.$message.error(res.errmsg);
      }
    },
    editGood(id) {
      this.$router.push({
        path: "/addgood?id=" + id,
      });
    },
    async changeSta(event, id) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/goodsalesta", {
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
    beforeImgUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
      }
      return isIMAGE && isLt1M;
    },

    dateFormat: function (row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    uploadHttp({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.face = ossImg;
        }
      });
    },
    add() {
      this.$router.push({
        path: "/addgood",
      });
    },
    async searchOrders() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/goodslist", {
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
    deleGood(id) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteInfo(id);
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
      let res = await this.$http.post("/manage/deleshopgood", {
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
