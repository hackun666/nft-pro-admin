<template>
  <div class="orders">
    <div class="fliter">
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入姓名或昵称" v-model="name" clearable>
        </el-input>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="searchOrders">检索</el-button>
      </div>
    </div>
    <div class="eic_table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        v-loading="loading"
        center
      >
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 1">个人认证</el-tag>
            <el-tag v-if="scope.row.type == 2">企业认证</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cardno" label="身份证号"></el-table-column>
        <el-table-column label="身份证正面">
          <template slot-scope="scope" v-if="scope.row.type == 1">
            <el-image 
              :src="scope.row.idcardfront" @click="preview(scope.row.idcardfront)"
              style="width: 100px; height: 60px"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="身份证反面">
          <template slot-scope="scope" v-if="scope.row.type == 1">
            <el-image
              :src="scope.row.idcardback" @click="preview(scope.row.idcardback)"
              style="width: 100px; height: 60px"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="营业执照">
          <template slot-scope="scope" v-if="scope.row.type == 2">
            <el-image
              :src="scope.row.buzinesslicenseimg" @click="preview(scope.row.buzinesslicenseimg)"
              style="width: 100px; height: 60px"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          property="addtime"
          :formatter="dateFormat"
          label="申请时间"
        ></el-table-column>
        
        <el-table-column label="所属员工">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.em_id > 0">{{scope.row.em_name}}</el-tag>
            <el-button v-if="scope.row.em_id == 0" size="mini" @click="bindEm(scope.row.userid)">绑定员工</el-button>
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

    <el-dialog title="查看作品" :visible.sync="workBox" width="1000px">
      <el-carousel trigger="click" height="600px">
        <el-carousel-item v-for="item in workImgs" :key="item.id">
          <el-image
            :src="item.url"
            style="width: 1000px; height: 600px"
            fit="contain"
          ></el-image>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <el-dialog title="绑定员工" :visible.sync="emBox" width="400px">
      <div style="margin-bottom:10px">
      <el-input placeholder="请输入员工姓名" v-model="em_name">
      <template slot="prepend">绑定员工</template>
    </el-input></div>
    <el-button type="primary" @click="saveEm">保存</el-button>
    </el-dialog>
    
    <el-dialog title="预览图片" :visible.sync="previewBox" width="1000px">
      <img :src="img_src" width="100%">
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
      emBox: false,
      em_name: '',
      now_uid: 0,
      previewBox: false,
      img_src: ''
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    preview(src){
      this.img_src = src
      this.previewBox = true
    },
    async saveEm(){
      let res = await this.$http.post("/manage/saveem", {
        uid: this.now_uid,
        token: localStorage.nft_pro_token,
        em_name: this.em_name,
      });
      if (res.errcode == 0) {
        this.$message.success("员工绑定成功");
        this.emBox = false
        this.em_name = ''
        this.now_uid = 0
        this.getData();
      }else{
        this.$message.error(res.errmsg);
      }
    },
    bindEm(uid){
      this.emBox = true
      this.now_uid = uid
    },
    showWorks(imgs) {
      this.workImgs = imgs;
      this.workBox = true;
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
      let res = await this.$http.get("/manage/talentlist", {
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


