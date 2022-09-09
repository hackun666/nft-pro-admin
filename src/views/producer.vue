<template>
  <div class="info_box">
    <div class="fliter">
      <div class="fliter_item">
        <el-button type="primary" icon="el-icon-plus" @click="add"
          >添加发行方</el-button
        >
      </div>
    </div>

    <div class="line"></div>
    <div class="eic_table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        row-key="id"
        v-loading="loading"
        :default-expand-all="false"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          type="index"
          label="编号ID"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column align="center" label="形象图">
          <template slot-scope="scope">
            <el-image
              @click="preview(scope.row.face)"
              :src="scope.row.face"
              style="width: 60px; height: 60px"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="desc"
          label="简介"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click="editArtist(scope.row)"
              >编辑</el-link
            >

            <el-divider direction="vertical"></el-divider>

            <el-link type="danger" @click="deleArtist(scope.row.id)"
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

    <el-dialog title="添加发行方" :visible.sync="producerBox" width="500px">
      <el-form ref="producerform" label-width="100px">
        <el-form-item label="发行方名称">
          <el-input v-model="name" placeholder="输入发行方名称"> </el-input>
        </el-form-item>
        <el-form-item label="发行方封面" prop="url">
          <el-upload
            action=""
            :show-file-list="false"
            :http-request="uploadHttp"
            :multiple="false"
            :before-upload="beforeImgUpload"
          >
            <img v-if="face" :src="face" width="200px" />
            <el-button v-else
              ><i class="el-icon-upload2"></i> 点击上传</el-button
            >
            <div slot="tip" class="el-upload__tip">建议宽500*高500像素</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" v-model="desc" placeholder="请填写简介">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="producerBox = false">取 消</el-button>
        <el-button type="primary" @click="saveArtist">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
var moment = require("moment");
import { putObject } from '@/utils/uploadCos'
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
      producerBox: false,
      name: "",
      id: 0,
      face: "",
      desc: "",
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
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

    // uploadHttp(data) {
    //   var file = data.file
		//   putObject(file, (url, name) => {
    //     this.face = url;
    //   })
		// },
    uploadHttp({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.face = ossImg;
        }
      });
    },
    editArtist(item) {
      this.name = item.name;
      this.face = item.face;
      this.desc = item.desc;
      this.id = item.id;
      this.producerBox = true;
    },
    async saveArtist() {
      if (this.name.length < 1) {
        this.$message.warning("发行方名称不能为空");
        return;
      }
      let res = await this.$http.get("/manage/saveproducer", {
        name: this.name,
        face: this.face,
        desc: this.desc,
        id: this.id,
        token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        this.producerBox = false;
        this.name = "";
        this.face = "";
      this.desc = "";
        this.id = 0;
        this.$message.success("发行方添加成功");
        this.getData();
      }
    },
    add() {
      this.name = "";
      this.face = "";
      this.desc = "";
      this.id = 0;
      this.producerBox = true;
    },
    async searchOrders() {
      this.paginationData.currentPage = 1;
      this.getData();
    },
    async getData() {
      let res = await this.$http.get("/manage/producerlist", {
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
    deleArtist(id) {
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
      let res = await this.$http.post("/manage/deleproducer", {
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
