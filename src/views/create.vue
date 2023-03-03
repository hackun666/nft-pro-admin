<template>
  <div class="info_box">
    <el-page-header
      @back="goBack"
      :content="ruleForm.id > 0 ? '编辑藏品' : '创建藏品'"
    ></el-page-header
    ><br />
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="藏品类型" prop="sort">
        <el-select v-model="ruleForm.nft_type" placeholder="请选择">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="藏品封面图" prop="cover">
        <el-upload
          action=""
          :show-file-list="false"
          :http-request="uploadCover"
          :multiple="false"
          :before-upload="beforeImgUpload"
        >
          <img v-if="ruleForm.cover" :src="ruleForm.cover" width="200px" />
          <el-button v-else><i class="el-icon-upload2"></i> 点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            不超过1M 格式支持：”jpg”, “jpeg”, “png”, “bmp”, “webp”, “heic”。
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="封面格式" prop="format">
        <el-select v-model="ruleForm.format" placeholder="请选择">
          <el-option
            v-for="item in formatList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面源文件" prop="asset_url">
        <el-upload
          action=""
          :show-file-list="false"
          :http-request="uploadAsset"
          :multiple="false"
          :before-upload="beforeFileUpload"
        >
          <el-button><i class="el-icon-upload2"></i> 点击上传</el-button>
          <div slot="tip" class="el-upload__tip">文件大小不能超过20M</div>
        </el-upload>
        <p>{{ ruleForm.asset_url }}</p>
      </el-form-item>
      <el-form-item label="藏品标题" prop="title">
        <el-input
          v-model="ruleForm.title"
          placeholder="请填写藏品标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="藏品文字介绍" prop="long_desc">
        <el-input
          type="textarea"
          rows="5"
          v-model="ruleForm.long_desc"
          placeholder="请填写藏品文字介绍"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="藏品简介" prop="desc">
        <el-input
          v-model="ruleForm.desc"
          placeholder="请填写藏品标题"
        ></el-input>
      </el-form-item> -->

      <el-form-item label="藏品价格" prop="price" v-if="ruleForm.nft_type != 3">
        <el-input
          v-model="ruleForm.price"
          placeholder="请填写藏品价格"
        ></el-input>
      </el-form-item>
      <el-form-item label="发售数量" prop="total_num">
        <el-input-number
          v-model="ruleForm.total_num"
          placeholder="发售数量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="库存数量" prop="num">
        <el-input-number
          v-model="ruleForm.num"
          placeholder="库存数量"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="最多购买数量"
        prop="max_buy"
        v-if="ruleForm.nft_type != 3"
      >
        <el-input-number v-model="ruleForm.max_buy"></el-input-number>
      </el-form-item>
      <el-form-item label="开售时间" prop="sale_time">
        <el-date-picker
          type="datetime"
          placeholder="选择开售日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="ruleForm.sale_time"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="开启兑换" prop="exchange_sta">
        <el-switch
          v-model="ruleForm.exchange_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
        <p class="tips">
          开启后商品仅可使用藏品进行兑换 请返回藏品列表进行兑换设置
        </p>
      </el-form-item>
      <!-- <el-form-item label="再接再励兑换" v-if="ruleForm.exchange_sta == 1">
        <el-switch
          v-model="ruleForm.thx_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
        <p class="tips">开启后显示使用再接再励兑换</p>
      </el-form-item>
      <el-form-item label="再接再励数量" v-if="ruleForm.thx_sta == 1">
        <el-input-number
          v-model="ruleForm.thx_num"
          placeholder="再接再励数量"
        ></el-input-number>
        <p class="tips">兑换一份藏品需要的再接再励数量</p>
      </el-form-item> -->
      
      <el-form-item label="开启积分兑换" prop="score_sta">
        <el-switch
          v-model="ruleForm.score_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
        <p class="tips">
          开启后藏品可兑换积分
        </p>
      </el-form-item>
      <el-form-item label="可兑换积分数" prop="score" v-if="ruleForm.score_sta == 1">
        <el-input-number v-model="ruleForm.score"></el-input-number>
      </el-form-item>
      <el-form-item
        label="开启抽签"
        prop="prize_sta"
        v-if="ruleForm.nft_type != 3"
      >
        <el-switch
          v-model="ruleForm.prize_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
        <p class="tips">开启后商品发售前支持抽签</p>
      </el-form-item>
      <div v-if="ruleForm.prize_sta == 1">
        <el-form-item label="中签人数" prop="prize_num">
          <el-input-number
            v-model="ruleForm.prize_num"
            :min="0"
            :max="10000"
          ></el-input-number>
          <p class="tips">可以中签的人数</p>
        </el-form-item>
        <el-form-item label="提前购买时间" prop="winner_buy_time">
          <el-input-number
            v-model="ruleForm.winner_buy_time"
            :min="0"
            :max="7200"
          ></el-input-number>
          <p class="tips">中签用户提前可提前多少（单位：分钟）购买</p>
        </el-form-item>
      </div>

      <el-form-item
        label="白名单功能"
        prop="white_list_sta"
      >
        <el-switch
          v-model="ruleForm.white_list_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
        <p class="tips">开启后仅白名单用户可以购买</p>
      </el-form-item>
      <div v-if="ruleForm.white_list_sta == 1">
        <el-form-item label="白名单购买时间" prop="white_buy_time">
          <el-input-number
            v-model="ruleForm.white_buy_time"
            :min="0"
            :max="7200"
          ></el-input-number>
          <p class="tips">白名单用户提前可提前多少（单位：分钟）购买</p>
        </el-form-item>
      </div>

      <el-form-item label="标签一" prop="tag_a">
        <el-input
          v-model="ruleForm.tag_a"
          placeholder="请填写标签一"
        ></el-input>
      </el-form-item>
      <el-form-item label="标签二" prop="tag_b">
        <el-input
          v-model="ruleForm.tag_b"
          placeholder="请填写标签二"
        ></el-input>
      </el-form-item>
      <el-form-item label="藏品详情长图" prop="content_src">
        <el-upload
          action=""
          :show-file-list="false"
          :http-request="uploadContentSrc"
          :multiple="false"
          :before-upload="beforeImgUpload"
        >
          <img
            v-if="ruleForm.content_src"
            :src="ruleForm.content_src"
            width="100px"
          />
          <el-button v-else><i class="el-icon-upload2"></i> 点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            不超过1M 格式支持：”jpg”, “jpeg”, “png”, “bmp”, “webp”, “heic”。
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="选择艺术家" prop="sort">
        <el-select v-model="ruleForm.artist_id" placeholder="请选择">
          <el-option
            v-for="item in artist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择发行方" prop="sort">
        <el-select v-model="ruleForm.producer_id" placeholder="请选择">
          <el-option
            v-for="item in producer"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易手续费" prop="sxf">
        <el-input-number
          :min="0"
          :max="100"
          v-model="ruleForm.sxf"
          placeholder="请填写数字"
        ></el-input-number>
        <p class="tips">二级市场转售成功手续费 单位：%</p>
      </el-form-item>
      <el-form-item label="交易版税" prop="copy_fee">
        <el-input-number
          :min="0"
          :max="100"
          v-model="ruleForm.copy_fee"
          placeholder="请填写数字"
        ></el-input-number>
        <p class="tips">二级市场转售成功创作者版税 单位：%</p>
      </el-form-item>
      
      <el-form-item label="最低寄售价格" prop="sell_min">
        <el-input-number v-model="ruleForm.sell_min" :precision="2" :step="0.01"></el-input-number>
        <p class="tips">二级市场最低寄售价格 单位：元</p>
      </el-form-item>
      <el-form-item label="最高寄售价格" prop="sell_max">
        <el-input-number v-model="ruleForm.sell_max" :precision="2" :step="0.01"></el-input-number>
        <p class="tips">二级市场最高寄售价格 单位：元</p>
      </el-form-item>
      
      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="ruleForm.sort"
          placeholder="请填写数字 数字越大 排序越往前"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存信息</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
var moment = require("moment");
import E from "wangeditor";
import { putObject } from "@/utils/uploadCos";
export default {
  components: {},
  data() {
    return {
      typeList: [
        {
          value: "1",
          label: "普通藏品",
        },
        {
          value: "2",
          label: "盲盒",
        },
        {
          value: "3",
          label: "合成藏品",
        },
      ],
      formatList: [
        {
          value: "1",
          label: "图片",
        },
        {
          value: "2",
          label: "GIF动图",
        },
        {
          value: "3",
          label: "视频",
        },
        {
          value: "4",
          label: "3D模型",
        },
      ],
      isSave: false,
      ruleForm: {
        id: 0,
        cate: 2,
        sort: "",
        cover: "",
        asset_url: "",
        title: "",
        desc: "",
        price: "",
        total_num: "",
        max_buy: 1,
        exchange_sta: "0",
        sale_time: "",
        content: "",
        author_face: "",
        author_name: "",
        author_desc: "",
        long_desc: "",
        content_src: "",
        prize_num: 100,
        winner_buy_time: 30,
        white_buy_time: 60,
        score: "",
      },
      rules: {
        cover: [{ required: true, message: "请上传藏品封面", trigger: "blur" }],
        title: [{ required: true, message: "请填写藏品名称", trigger: "blur" }],
      },
      artist: [],
      producer: [],
      save_sta: true,
    };
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isSave) {
      this.$confirm("您还未保存信息，确定需要离开当前页面吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          next();
        })
        .catch(() => {});
    } else {
      next();
    }
  },
  mounted() {
    let id = this.$route.query.id;
    if (id > 0) {
      this.getData(id);
    }
    this.getArtist();
  },
  computed: {},
  methods: {
    async getArtist() {
      let res = await this.$http.get("/manage/artistall", {
        token: localStorage.nft_pro_token,
      });
      this.artist = res.artist;
      this.producer = res.producer;
    },
    goBack() {
      this.$router.push({
        path: "/mainList",
      });
    },
    async getData(id) {
      let res = await this.$http.post("/manage/getinfo", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        console.log(res.data);
        this.ruleForm = res.data;
        this.ruleForm.sale_time = moment(res.data.sale_time * 1000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        // this.editor.txt.html(res.data.content);
      } else {
        this.$message.error(res.msg);
      }
    },
    beforeImgUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/webp" || "image/png";
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isIMAGE && isLt10M;
    },
    beforeFileUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isLt10M;
    },
    uploadCover({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.ruleForm.cover = ossImg;
        }
      });
    },
    // uploadCover(data) {
    //   var file = data.file
    //   putObject(file, (url, name) => {
    //     this.ruleForm.cover = url;
    //   })
    // },
    uploadAuthorFace({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.ruleForm.author_face = ossImg;
        }
      });
    },
    // uploadAuthorFace(data) {
    //   var file = data.file
    //   putObject(file, (url, name) => {
    //     this.ruleForm.author_face = url;
    //   })
    // },
    uploadContentSrc({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.ruleForm.content_src = ossImg;
        }
      });
    },
    // uploadContentSrc(data) {
    //   var file = data.file
    //   putObject(file, (url, name) => {
    //     this.ruleForm.content_src = url;
    //   })
    // },

    uploadAsset({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          console.log("Asset:", ossImg);
          this.ruleForm.asset_url = ossImg;
          console.log("asset_url:", this.ruleForm.asset_url);
        }
      });
    },
    // uploadAsset(data) {
    //   var file = data.file
    //   putObject(file, (url, name) => {
    //     this.ruleForm.asset_url = url;
    //   })
    // },
    submitForm(formName) {
      console.log(this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveForm();
        } else {
          return false;
        }
      });
    },
    async saveForm() {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/savenft", {
        info: this.ruleForm,
        token: localStorage.nft_pro_token,
        uid: localStorage.userId,
      });
      console.log(res);
      if (res.errcode == 0) {
        this.isSave = true;
        this.$message.success("藏品信息保存成功");
        setTimeout(() => {
          this.$router.push({
            path: "/mainList",
          });
        }, 600);
      } else {
        this.$message.error(res.errmsg);
      }
      loading.close();
    },
  },
};
</script>

<style lang="less" scoped></style>