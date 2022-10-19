<template>
  <div class="orders">
    <div class="fliter">
      <div class="fliter_item">
        <el-button icon="el-icon-back" @click="goBacK">返回</el-button>
      </div>
      <div class="fliter_item">
        <el-button type="primary" icon="el-icon-plus" @click="addGood"
          >添加新盲盒</el-button
        >
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
        <el-table-column
          align="center"
          prop="title"
          label="盲盒名称"
        ></el-table-column>
        <el-table-column align="center" label="盲盒封面">
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
          prop="total_num"
          label="发售数量"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="sold_num"
          label="铸造数量"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="rate"
          label="抽中概率（%）"
          width="150"
        ></el-table-column>

        <el-table-column
          align="center"
          property="addtime"
          :formatter="dateFormat"
          label="发布时间"
          width="200"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-link @click="create(scope.row.id, scope.row.title)"
              >手动铸造</el-link
            >
            <el-divider direction="vertical"></el-divider>
            <el-link @click="editbox(scope.row)">编辑</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link type="danger" @click="delebox(scope.row.id)">删除</el-link>
            <el-link type="danger" @click="resetNo(scope.row.id)"
              >一键重新编码</el-link
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

    <el-dialog title="预览图片" :visible.sync="previewBox" width="1000px">
      <img :src="img_src" width="100%" />
    </el-dialog>

    <el-dialog title="盲盒商品管理" :visible.sync="good_box" width="500px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品图片" prop="cover">
          <el-upload
            action=""
            :show-file-list="false"
            :http-request="uploadHttp"
            :multiple="false"
            :before-upload="beforeImgUpload"
          >
            <img v-if="ruleForm.cover" :src="ruleForm.cover" width="200px" />
            <el-button v-else
              ><i class="el-icon-upload2"></i> 点击上传</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="藏品名称" prop="title">
          <el-input
            v-model="ruleForm.title"
            placeholder="填写藏品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="发售数量" prop="total_num">
          <el-input-number
            :min="1"
            v-model="ruleForm.total_num"
            placeholder="请填写发售数量"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="抽中概率" prop="rate">
          <el-input-number
            :min="0"
            :max="100000"
            v-model="ruleForm.rate"
            placeholder="填写数字"
          ></el-input-number>
          <p class="tips">该藏品的抽中几率 单位：%</p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >保存信息</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="'手动铸造藏品:' + box_name"
      :visible.sync="trans_box"
      width="400px"
    >
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
        <el-button type="primary" @click="saveTrans">确认铸造</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { putObject } from "@/utils/uploadCos";
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
        pageSize: 6,
      },
      previewBox: false,
      img_src: "",
      status: 0,
      nft_id: 0,
      ruleForm: {
        id: 0,
        title: "",
        cover: "",
        rate: "",
        total_num: "",
      },
      options: [],
      rules: {
        cover: [{ required: true, message: "请上传藏品封面", trigger: "blur" }],
        title: [{ required: true, message: "请填写藏品名称", trigger: "blur" }],
        total_num: [
          { required: true, message: "请填写发行数量", trigger: "change" },
        ],
        rate: [{ required: true, message: "请填写抽中几率", trigger: "blur" }],
      },
      good_box: false,
      box_id: 0,
      box_name: "",
      trans_box: false,
      to_user: "",
      num: 1,
      password: "",
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
    resetNo(box_id) {
      this.$confirm("确认后藏品将重新编号且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.handleResetNo(box_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async handleResetNo(box_id) {
      let res = await this.$http.post("/manage/resetboxno", {
        box_id: box_id,
        token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        this.$message.success("藏品编号信息更新成功");
      } else {
        this.$message.error(res.errmsg);
      }
    },
    create(id, name) {
      this.box_name = name;
      this.box_id = id;
      this.trans_box = true;
    },
    async saveTrans() {
      let res = await this.$http.post("/manage/createblindnft", {
        box_id: this.box_id,
        to_user: this.to_user,
        num: this.num,
        password: this.password,
        token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        this.$message.success("操作成功");
        this.trans_box = false;
        this.getData();
      } else {
        this.$message.error(res.errmsg);
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
    uploadHttp({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.ruleForm.cover = ossImg;
        }
      });
    },
    // uploadHttp(data) {
    //   var file = data.file
    //   putObject(file, (url, name) => {
    //     this.ruleForm.cover = url;
    //   })
    // },
    goBacK() {
      this.$router.push({
        path: "/mainList",
      });
    },
    editbox(row) {
      this.ruleForm = {
        id: row.id,
        title: row.title,
        cover: row.cover,
        rate: row.rate,
        total_num: row.total_num,
      };
      this.good_box = true;
    },
    addGood() {
      (this.ruleForm = {
        id: 0,
        title: "",
        cover: "",
        rate: "",
        total_num: "",
      }),
        (this.good_box = true);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveForm();
        } else {
          return false;
        }
      });
    },
    async saveForm() {
      let res = await this.$http.post("/manage/savebox", {
        info: this.ruleForm,
        nft_id: this.nft_id,
        token: localStorage.dd_token,
        uid: localStorage.userId,
      });
      console.log(res);
      if (res.errcode == 0) {
        this.isSave = true;
        this.good_box = false;
        this.$message.success("盲盒藏品信息保存成功");
        (this.ruleForm = {
          id: 0,
          title: "",
          cover: "",
          rate: "",
          total_num: "",
        }),
          this.getData();
      } else {
        this.$message.error(res.errmsg);
      }
    },
    async getNft() {
      let res = await this.$http.get("/manage/nftall", {
        token: localStorage.dd_token,
      });
      this.nft_list = res.data;
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
      let res = await this.$http.get("/manage/boxlist", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.dd_token,
        status: this.status,
        id: this.nft_id,
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
          this.delebox(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async delebox(id) {
      let res = await this.$http.get("/manage/delebox", {
        id: id,
        token: localStorage.dd_token,
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