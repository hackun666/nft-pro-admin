<template>
  <div class="orders">
    <div class="fliter">
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入昵称" v-model="name" clearable>
        </el-input>
      </div>
      <div class="fliter_item" style="width: 240px">
        <el-input placeholder="请输入手机号码或钱包地址" v-model="tel" clearable>
        </el-input>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="searchUsers">检索用户</el-button>
      </div>
      <div class="fliter_item">
        <el-button type="success" icon="el-icon-box" @click="kongtou"
          >发起空投</el-button
        >
      </div>
      <div class="fliter_item">
        <el-button type="success" @click="exportRank">按持仓排名导出</el-button>
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
        <el-table-column align="center"
          type="index"
          label="编号ID"
          width="80"
        ></el-table-column>
        <el-table-column align="center" prop="nickname" label="昵称" width="150"></el-table-column>
        <el-table-column align="center" prop="mobile" label="联系方式" width="150"></el-table-column>
        <el-table-column align="center" label="实名认证状态" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.rz_sta == 0" type="info">未认证</el-tag>
            <el-tag v-if="scope.row.rz_sta == 1" >已认证</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="藏品数量" width="160">
          <template slot-scope="scope">
            <el-tag>{{scope.row.nft_num}}</el-tag>
            <el-divider
              direction="vertical"
            ></el-divider>
            <el-link @click="showNft(scope.row.uid)">查看持仓</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户余额" width="200">
          <template slot-scope="scope">
            <el-tag @click="editCash(scope.row.uid,scope.row.cash)">{{scope.row.cash}}</el-tag>
            <el-divider
              direction="vertical"
            ></el-divider>
            <el-link @click="showTrade(scope.row.uid)">账户明细</el-link>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="address" label="区块链地址" width="330"></el-table-column>
        <el-table-column align="center" width="200"
          property="reg_time"
          :formatter="dateFormat"
          label="注册时间"
        ></el-table-column>
        <el-table-column align="center" prop="reg_ip" label="注册IP" width="150"></el-table-column>
        <el-table-column align="center" prop="ref_code" label="邀请码" width="150"></el-table-column>
        <el-table-column align="center" prop="ref_num" label="拉新人数" width="150"></el-table-column>
        
        <el-table-column align="center" label="转赠功能" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.trans_sta"
              active-value="1"
              inactive-value="0"
              @change="changeSta($event,scope.row.uid)"
              active-color="#ff2b5b"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" align="center" width="150">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.isblock == 0" size="medium">正常</el-tag>
              <el-tag type="info" v-else size="medium">封禁中</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          fixed="right"
          label="操作"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand" trigger="click">
              <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="scope.row.isblock == 0"
                  :command="
                    beforeHandleCommand(scope.$index, scope.row, 'block')
                  "
                  icon="el-icon-lock"
                  >封禁用户</el-dropdown-item
                >
                <el-dropdown-item
                  v-else
                  :command="
                    beforeHandleCommand(scope.$index, scope.row, 'release')
                  "
                  icon="el-icon-unlock"
                  >解封用户</el-dropdown-item
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

    <el-dialog title="发起空投" :visible.sync="kongtou_box" width="800px">
      <el-form ref="artistform" label-width="100px">
        <el-form-item label="选择空投条件">
          <el-radio-group v-model="ruleForm.tp">
            <el-radio :label="1">持有特定藏品</el-radio>
            <el-radio :label="2">指定用户地址</el-radio>
            <el-radio :label="3">所有实名用户</el-radio>
            <el-radio :label="4">导入用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="须持有藏品" v-if="ruleForm.tp == 1" >
          <el-select
            v-model="ruleForm.need_nft_id" multiple
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
        <el-form-item label="上传EXCEL" v-if="ruleForm.tp == 4">
         <el-upload
            action="/api/uploadexcel"
            :on-success="handleExcelSuccess"
            :show-file-list="false"
            accept=".xls, .xlsx"
          >
            <el-button type="success" icon="el-icon-box">导入Excel</el-button>
          </el-upload>
          <p class="tips">{{ruleForm.excel}}</p>
        </el-form-item>

        <el-form-item label="要空投的藏品">
          <el-select v-model="ruleForm.nft_id" placeholder="请选择" >
            <el-option
              v-for="item in nftlist"
              :key="item.id"
              :label="item.title + '（库存'+item.left_num+'）'"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送数量" v-if="ruleForm.tp != 4">
          <el-radio-group v-model="ruleForm.num_tp">
            <el-radio :label="1">手动填写份数</el-radio>
            <el-radio :label="2">按持有数量自动计算</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="空投份数" v-if="ruleForm.tp != 4 && ruleForm.num_tp == 1">
          <el-input v-model="ruleForm.num" placeholder="输入空投份数">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="kongtou_box = false">取 消</el-button>
        <el-button type="primary" @click="handleKT">点击发放空投</el-button>
      </span>
    </el-dialog>


     <el-dialog title="藏品持有明细" :visible.sync="nft_box" width="1100px">
      <el-table
        ref="multipleTable"
        :data="nft_list"
        stripe
        border
        v-loading="loading"
      >
        <el-table-column
          align="center"
          prop="id"
          label="系统ID"
        ></el-table-column>
        <el-table-column label="藏品图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.uri" width="30px" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="藏品名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="no"
          label="藏品编号"
        ></el-table-column>
        <el-table-column
          align="center"
          property="create_time"
          :formatter="dateFormat"
          label="创建时间"
        ></el-table-column>
        <el-table-column
          align="center"
          property="update_time"
          :formatter="dateFormat"
          label="更新时间"
        ></el-table-column>
        <!-- <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-link
              type="danger"
              v-if="scope.row.is_lock == 0"
              @click="lockNft(scope.row.id)"
              >锁定</el-link
            >
            <el-link type="danger" v-else @click="unlockNft(scope.row.id)"
              >解锁</el-link
            >
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          background
          :current-page="nftPaginationData.currentPage"
          :page-size.sync="nftPaginationData.pageSize"
          @current-change="handleNftCurrentChange"
          layout="total, prev, pager, next, jumper"
          :total="nftPaginationData.total"
        ></el-pagination>
      </div>
    </el-dialog>


<el-dialog title="修改用户余额" :visible.sync="cash_box" width="300px"> 
      <div>

      <el-input
          v-model="cash"
          placeholder="用户余额"
        ></el-input>
      </div>
      <br/>
        <div>
        <el-input
        type="password"
          v-model="password"
          placeholder="操作密码"
        ></el-input>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cash_box = false">取 消</el-button>
        <el-button type="primary" @click="saveCash">保存</el-button>
      </span>
    </el-dialog>



    <el-dialog title="用户收支明细" :visible.sync="trade_box" width="1000px"> 
      <el-table
        ref="multipleTable"
        :data="trade_list"
        stripe
        border
      >
        <el-table-column align="center"
          prop="id"
          label="系统ID"
          width="80"
        ></el-table-column>
        <el-table-column align="center" label="收支类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.flow_type == 1" type="success">收入</el-tag>
            <el-tag v-if="scope.row.flow_type == 2"  type="danger">支出</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="trade_amount" label="金额"></el-table-column>
        <el-table-column align="center" prop="balance" label="余额"></el-table-column>
        <el-table-column align="center" prop="desc" label="备注"></el-table-column>
        <el-table-column align="center" prop="add_time" label="时间"></el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          background
          :current-page="tradePaginationData.currentPage"
          :page-size.sync="tradePaginationData.pageSize"
          @current-change="handleTradeCurrentChange"
          layout="total, prev, pager, next, jumper"
          :total="tradePaginationData.total"
        ></el-pagination>
      </div>
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
      start_date: '',
      end_date: '',
      loading: true,
      tableData: [],
      paginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      kongtou_box: false,
      nftlist: [],
      ruleForm: {
        need_nft_id: "",
        nft_id: "",
        num: "1",
        address: "",
        tp: 1,
        excel: "",
        num_tp: 1
      },
      nftPaginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      nft_box: false,
      nft_list: [],
      cash: 0,
      password: "",
      cash_box: false,
      trade_box: false,
      trade_list: [],
      tradePaginationData: {
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
    exportRank() {
      window.open(
        "/manage/exportusernftrank?token=" +
          localStorage.dd_token
      );
    },
    showTrade(uid){
      this.now_uid = uid
      this.trade_list = []
      this.tradePaginationData.currentPage = 1
      this.getTradeData();
    },
    handleTradeCurrentChange(num) {
      this.tradePaginationData.currentPage = num;
      this.getTradeData();
    },
    async getTradeData(){
       let res = await this.$http.post("/manage/usertrade", {
        token: localStorage.dd_token,
        currentPage: this.tradePaginationData.currentPage,
        pageSize: this.tradePaginationData.pageSize,
        uid: this.now_uid,
        cash: this.cash
      });
      if (res.errcode == 0) {
        this.trade_list = res.data
        this.tradePaginationData.total = res.total;
        this.trade_box = true;
      }
    },
    async saveCash(){
      let res = await this.$http.post("/manage/savecash", {
        token: localStorage.dd_token,
        uid: this.now_uid,
        cash: this.cash,
        password: this.password
      });
      if (res.errcode == 0) {
        this.$message({
          type: "success",
          message: '操作成功',
        });
        this.getData();
        this.cash_box = false;
      } else {
        this.$message({
          type: "error",
          message: res.errmsg,
        });
      }
    },
    editCash(uid,cash){
      this.now_uid = uid
      this.cash = cash
      this.cash_box = true
    },
    showNft(uid) {
      this.uid = uid;
      this.getUserNft();
    },
    async getUserNft() {
      let res = await this.$http.post("/manage/getusernft", {
        uid: this.uid,
        token: localStorage.dd_token,
        currentPage: this.nftPaginationData.currentPage,
      });
      if (res.errcode == 0) {
        this.nft_list = res.data;
        this.nftPaginationData.total = res.total;
        this.nft_box = true;
      }
    },
    handleNftCurrentChange(num) {
      this.nftPaginationData.currentPage = num;
      this.getUserNft();
    },
    handleExcelSuccess(e) {
      console.log(e)
      this.ruleForm.excel = e.excel
    },
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
        token: localStorage.dd_token,
        form: this.ruleForm
      });
      if (res.errcode == 0) {
        this.$message({
          type: "success",
          message: res.errmsg,
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
        token: localStorage.dd_token,
      });
      this.nftlist = res.data;
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
        case "block":
          this.blockUser(command.row.uid);
          break;
        case "release":
          this.releaseUser(command.row.uid);
          break;
      }
    },
    async releaseUser(uid) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/release", {
        token: localStorage.dd_token,
        uid: uid,
      });
      if (res.errcode == 0) {
        this.$message.success("操作成功");
        loading.close();
        this.getData();
      } else {
        this.$message({
          message: res.msg,
          type: "warning",
        });
      }
    },
    blockUser(uid) {
      this.$confirm("封禁后用户将无法访问系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.block(uid);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async block(uid) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/block", {
        token: localStorage.dd_token,
        uid: uid,
      });
      if (res.errcode == 0) {
        this.$message.success("操作成功");
        loading.close();
        this.getData();
      } else {
        this.$message({
          message: res.msg,
          type: "warning",
        });
      }
    },
    async changeSta(event, uid) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/transsta", {
        token: localStorage.dd_token,
        uid: uid,
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
    pickDate(e){
      console.log(e)
      this.start_date = e[0]
      this.end_date = e[1]
    },
    async searchUsers() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/userlist", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.dd_token,
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


