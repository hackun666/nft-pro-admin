<template>
  <div class="orders">
    <div class="fliter">
      <div class="fliter_item">
        <el-button icon="el-icon-back" @click="goBacK">返回列表</el-button>
      </div>
      <div class="fliter_item" style="width: 240px">
        <el-input
          placeholder="请输入手机号码或钱包地址"
          v-model="tel"
          clearable
        >
        </el-input>
      </div>
      <div class="fliter_item" style="width: 240px">
        <el-input placeholder="请输入藏品名称" v-model="name" clearable>
        </el-input>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="searchData">检索藏品</el-button>
      </div>
      <div class="fliter_item">
        <el-button type="success" @click="exportData">导出藏品数据</el-button>
      </div>
      <div class="fliter_item">
        <el-button type="success" @click="exportRank">按持仓排名导出</el-button>
      </div>
      <div class="fliter_item">
        <el-button type="success" @click="transData">转移藏品</el-button>
      </div>
      <div class="fliter_item">
        <el-button type="success" @click="batDestroy">批量销毁</el-button>
      </div>

      <div class="fliter_item" style="margin-left: auto">
        <el-button type="danger" @click="resetNo">一键重新编码</el-button>
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
          label="系统ID"
          width="120"
        ></el-table-column>
        <el-table-column label="藏品编号" align="center" width="120">
          <template slot-scope="scope">
            <p>{{ scope.row.no }} - {{ scope.row.max_no }}</p>
          </template>
        </el-table-column>
        <el-table-column label="藏品图片" align="center" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.uri" width="80px" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="藏品名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="nft_id"
          label="链上地址"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="tx_hash"
          label="交易hash"
          width="200"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="owner"
          label="持有者账户"
          width="200"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="user.mobile"
          label="手机号"
          width="200"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="userid"
          label="用户ID"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          property="create_time"
          :formatter="dateFormat"
          label="更新时间"
        ></el-table-column>

        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <!-- <el-link @click="editNft(scope.row)">编辑</el-link>
            <el-divider direction="vertical"></el-divider> -->
            <el-link type="danger" @click="destroyNft(scope.row.id)"
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

    <el-dialog title="添加新的NFT" :visible.sync="nft_box" width="500px">
      <el-form :model="nft" :rules="rules" ref="nftForm" label-width="120px">
        <el-form-item label="NFT名称" prop="name">
          <el-input v-model="nft.name" placeholder="请填写NFT名称"></el-input>
        </el-form-item>
        <el-form-item label="NFT图片">
          <el-upload
            action=""
            :show-file-list="false"
            :http-request="UploadCover"
            :multiple="false"
            :before-upload="beforeImgUpload"
          >
            <img v-if="nft.uri" :src="nft.uri" width="200px" />
            <el-button v-else
              ><i class="el-icon-upload2"></i> 点击上传</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="发行数量" v-if="!nft.id">
          <el-input-number
            v-model="nft.amount"
            :min="1"
            :max="1000"
            placeholder="发行数量"
          >
          </el-input-number>
          <p class="tips">单次最大发行1000份</p>
        </el-form-item>
        <el-form-item label="NFT链上元数据">
          <el-input
            type="textarea"
            v-model="nft.data"
            placeholder="输入NFT链上元数据"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitNft('nftForm')"
            >保存信息</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="转移藏品" :visible.sync="trans_box" width="400px">
      <div>
        <el-input v-model="from_user" placeholder="发送人手机号"></el-input>
      </div>
      <br />
      <div>
        <el-input v-model="to_user" placeholder="接收人手机号"></el-input>
      </div>
      <br />
      <div>
        <el-input-number v-model="num" placeholder="数量"></el-input-number>
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
        <el-button @click="trans_box = false">取 消</el-button>
        <el-button type="primary" @click="saveTrans">确认转移</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量销毁藏品" :visible.sync="destroy_box" width="400px">
      <el-form ref="ruleForm" label-width="120px">
        <el-form-item label="用户手机号">
          <el-input v-model="mobile" placeholder="用户手机号"></el-input>
        </el-form-item>
        <el-form-item label="请选择藏品">
          <el-select v-model="box_id" placeholder="请选择">
            <el-option
              v-for="item in box_list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <p class="tips">注意：盲盒类型的必须选</p>
        </el-form-item>
        <el-form-item label="销毁数量">
          <el-input-number
            v-model="num"
            placeholder="销毁数量"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="操作密码">
          <el-input
            type="password"
            v-model="password"
            placeholder="操作密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="destroy_box = false">取 消</el-button>
        <el-button type="primary" @click="saveDestroy">确认销毁</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
var moment = require("moment");
// import { putObject } from '@/utils/uploadCos'
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
      name: "",
      tel: "",
      trans_box: false,
      destroy_box: false,
      from_user: "",
      to_user: "",
      num: 1,
      password: "",
      mobile: "",
      nft_name: "",
      box_list: [],
      box_id: "",
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
    async getNft() {
      let res = await this.$http.get("/manage/nftbox", {
        nft_id: this.nft_id,
        token: localStorage.dd_token,
      });
      this.box_list = res.box_list;
    },
    resetNo() {
      this.$confirm("确认后藏品将重新编号且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.handleResetNo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async handleResetNo() {
      let res = await this.$http.post("/manage/resetno", {
        id: this.nft_id,
        token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        this.$message.success("藏品编号信息更新成功");
        this.getData();
      } else {
        this.$message.error(res.errmsg);
      }
    },
    transData() {
      this.trans_box = true;
    },
    batDestroy() {
      this.getNft();
      this.destroy_box = true;
    },
    async saveDestroy() {
      let res = await this.$http.post("/manage/batdestroy", {
        nft_id: this.nft_id,
        box_id: this.box_id,
        mobile: this.mobile,
        num: this.num,
        nft_name: this.nft_name,
        password: this.password,
        token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        this.$message.success("操作成功");
        this.destroy_box = false;
      } else {
        this.$message.error(res.errmsg);
      }
    },
    async saveTrans() {
      let res = await this.$http.post("/manage/transnft", {
        nft_id: this.nft_id,
        from_user: this.from_user,
        to_user: this.to_user,
        num: this.num,
        password: this.password,
        token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        this.$message.success("操作成功");
        this.trans_box = false;
      } else {
        this.$message.error(res.errmsg);
      }
    },
    exportRank() {
      window.open(
        "/manage/exportnftrank?id=" +
          this.nft_id +
          "&token=" +
          localStorage.dd_token
      );
    },
    exportData() {
      window.open(
        "/manage/exportnftitems?id=" +
          this.nft_id +
          "&token=" +
          localStorage.dd_token
      );
    },
    searchData() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    UploadCover(data) {
      var file = data.file;
      putObject(file, (url, name) => {
        console.log(url);
        this.nft.uri = url;
      });
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
    uploadHttp({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.nft.uri = ossImg;
        }
      });
    },
    async updateItem(id) {
      let res = await this.$http.post("/manage/updatenftitem", {
        id: id,
        token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        this.$message.success("NFT信息更新成功");
        this.getData();
      } else {
        this.$message.error(res.errmsg);
      }
    },
    goBacK() {
      this.$router.push({
        path: "/mainList",
      });
    },
    editNft(row) {
      this.nft = row;
      this.nft_box = true;
    },
    addNft() {
      (this.nft = {
        name: "",
        uri: "",
        data: "",
        amount: 1,
      }),
        (this.nft_box = true);
    },
    submitNft(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveForm();
        } else {
          return false;
        }
      });
    },
    // async saveForm() {
    //   let res = await this.$http.post("/manage/createnft", {
    //     nft: this.nft,
    //     nft_id: this.nft_id,
    //   });
    //   if (res.errcode == 0) {
    //     this.isSave = true;
    //     this.nft_box = false;
    //     this.$message.success("NFT创建成功");
    //     this.nft = {
    //       uri: "",
    //       class_id: "",
    //       data: "",
    //       amount: 1,
    //     };
    //     this.getData();
    //   } else {
    //     this.$message.error(res.errmsg);
    //   }
    // },
    async searchData() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/nftslist", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.dd_token,
        status: this.status,
        id: this.nft_id,
        tel: this.tel,
        name: this.name,
      });
      this.loading = false;
      this.tableData = res.data;
      this.paginationData.total = res.total;
    },
    destroyNft(id) {
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
      let res = await this.$http.post("/manage/destroynftitem", {
        id: id,
        token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        this.$message.success("藏品销毁成功");
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