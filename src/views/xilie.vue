<template>
  <div class="info_box">
    <div class="fliter">
      <div class="fliter_item">
        <el-button type="primary" icon="el-icon-plus" @click="add"
          >添加藏品系列</el-button
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
          width="80"
          align="center"
        ></el-table-column>
        <!-- <el-table-column align="center" label="形象图">
          <template slot-scope="scope">
            <el-image
              @click="preview(scope.row.cover)"
              :src="scope.row.cover"
              style="width: 60px; height: 60px"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="name"
          label="系列名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name_str"
          label="包含藏品"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          align="center"
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click="editXilie(scope.row)">编辑</el-link>
            <!-- 
            <el-divider direction="vertical"></el-divider>

            <el-link type="danger" @click="deleArtist(scope.row.id)"
              >删除</el-link
            > -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加系列" :visible.sync="xilieBox" width="500px">
      <el-form ref="producerform" label-width="100px">
        <el-form-item label="系列名称">
          <el-input v-model="name" placeholder="输入系列名称"> </el-input>
        </el-form-item>
        <!-- <el-form-item label="系列封面" prop="url">
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
        </el-form-item> -->
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="sort"
            placeholder="请填写数字 数字越大 排序越往前"
          ></el-input>
        </el-form-item>
        <el-form-item label="包含藏品">
          <el-input
            type="textarea"
            v-model="name_str"
            rows="5"
            placeholder="请填写包含藏品 必须英文双引号和逗号"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="xilieBox = false">取 消</el-button>
        <el-button type="primary" @click="saveXilie">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
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
      xilieBox: false,
      name: "",
      sort: 0,
      id: 0,
      name_str: "",
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
      let res = await this.$http.post("/manage/xiliesta", {
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
    editXilie(item) {
      this.name = item.name;
      this.name_str = item.name_str;
      this.id = item.id;
      this.sort = item.sort;
      this.xilieBox = true;
    },
    async saveXilie() {
      if (this.name.length < 1) {
        this.$message.warning("系列名称不能为空");
        return;
      }
      let res = await this.$http.get("/manage/savexilie", {
        name: this.name,
        name_str: this.name_str,
        sort: this.sort,
        id: this.id,
        token: localStorage.dd_token,
      });
      if (res.errcode == 0) {
        this.xilieBox = false;
        this.name = "";
        this.name_str = "";
        this.sort = 0;
        this.id = 0;
        this.$message.success("系列添加成功");
        this.getData();
      }
    },
    add() {
      this.name = "";
      this.name_str = "";
      this.id = 0;
      this.sort = 0;
      this.xilieBox = true;
    },
    async getData() {
      let res = await this.$http.get("/manage/xilielist", {
        token: localStorage.dd_token,
      });
      this.loading = false;
      this.tableData = res.data;
    },
    handleCurrentChange(num) {
      this.paginationData.currentPage = num;
      this.getData();
    },
    // deleArtist(id) {
    //   this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       this.deleteInfo(id);
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消操作",
    //       });
    //     });
    // },
    // async deleteInfo(id) {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: "请稍候...",
    //     spinner: "el-icon-loading",
    //     background: "rgba(255, 255, 255, 0.5)",
    //   });
    //   let res = await this.$http.post("/manage/deleproducer", {
    //     token: localStorage.dd_token,
    //     id: id,
    //   });
    //   if (res.errcode == 0) {
    //     this.$message.success("删除成功");
    //     loading.close();
    //     this.getData();
    //   } else {
    //     this.$message({
    //       message: res.msg,
    //       type: "warning",
    //     });
    //   }
    // },
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