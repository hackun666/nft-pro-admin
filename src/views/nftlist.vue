<template>
  <div class="orders">
    <div class="fliter">
      <div class="fliter_item">
        <el-button type="success" icon="el-icon-box" @click="kongtou"
          >发起空投</el-button
        >
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
          prop="id"
          label="编号"
          width="80"
        ></el-table-column>
        <el-table-column align="center" label="藏品封面" width="100">
          <template slot-scope="scope">
            <el-image
              @click="preview(scope.row.info.cover)"
              :src="scope.row.info.cover"
              style="width: 60px; height: 60px"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="info.title"
          label="藏品名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="info.asset_id"
          label="藏品主编号"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="nft_id"
          label="链上地址"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="user.nickname"
          label="藏品持有人昵称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="user.address"
          label="藏品持有人地址"
        ></el-table-column>
        <el-table-column
          align="center"
          property="time"
          :formatter="dateFormat"
          label="获得时间"
        ></el-table-column>
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

    <el-dialog title="发起空投" :visible.sync="kongtou_box" width="600px">
      <el-form ref="artistform" label-width="100px">
        <el-form-item label="选择空投条件">
          <el-radio-group v-model="ruleForm.tp">
            <el-radio :label="1">持有特定藏品</el-radio>
            <el-radio :label="2">指定用户地址</el-radio>
            <el-radio :label="3">所有实名用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="须持有藏品" v-if="ruleForm.tp == 1">
          <el-select
            multiple
            v-model="ruleForm.need_nft_id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in nftlist"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="钱包地址" v-if="ruleForm.tp == 2">
          <el-input v-model="ruleForm.address" placeholder="输入地址或手机号">
          </el-input>
        </el-form-item>

        <el-form-item label="要空投的藏品">
          <el-select v-model="ruleForm.nft_id" placeholder="请选择">
            <el-option
              v-for="item in nftlist"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="空投份数">
          <el-input v-model="ruleForm.num" placeholder="输入空投份数">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="kongtou_box = false">取 消</el-button>
        <el-button type="primary" @click="handleKT">点击发放空投</el-button>
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
      date: "",
      name: "",
      tel: "",
      start_date: "",
      end_date: "",
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
      img_src: "",
      kongtou_box: false,
      nftlist: [],
      ruleForm: {
        need_nft_id: "",
        nft_id: "",
        num: "1",
        address: "",
        tp: 1,
      },
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    handleKT() {
      this.$confirm("此操作将发放藏品到指定用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.sendKT();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async sendKT() {
      let res = await this.$http.post("/manage/sendkongtou", {
        token: localStorage.nft_pro_token,
        form: this.ruleForm
      });
      if (res.errcode == 0) {
        this.$message({
          type: "success",
          message: "发放成功",
        });
        this.kongtou_box = false;
      } else {
        this.$message({
          type: "error",
          message: res.errmsg,
        });
      }
    },
    kongtou() {
      this.getNftlist();
      this.kongtou_box = true;
    },
    async getNftlist() {
      let res = await this.$http.get("/manage/nftlistall",{
        token: localStorage.nft_pro_token,
      });
      this.nftlist = res.data;
    },
    pickDate(e) {
      console.log(e);
      this.start_date = e[0];
      this.end_date = e[1];
    },
    async searchOrders() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/nftlist", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.nft_pro_token,
        name: this.name,
        tel: this.tel,
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
