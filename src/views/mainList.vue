<template>
  <div class="orders">
    <div class="fliter">
      <div class="fliter_item">
        <el-button type="primary" icon="el-icon-plus" @click="addAsset"
          >创建新藏品</el-button
        >
      </div>
      <div class="fliter_item" style="width: 200px">
        <el-input placeholder="请输入藏品名称" v-model="title" clearable>
        </el-input>
      </div>
      <div class="fliter_item">
        <el-select v-model="type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="fliter_item">
        <el-button type="primary" @click="searchData">检索</el-button>
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
        <el-table-column label="类型" align="center" width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.nft_type == 1">普通藏品</el-tag>
              <el-tag v-if="scope.row.nft_type == 2">盲盒</el-tag>
              <el-tag v-if="scope.row.nft_type == 3">合成藏品</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="藏品名称"
          width="200"
        ></el-table-column>
        <el-table-column align="center" label="藏品封面" width="100">
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
          prop="price"
          label="价格"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="total_num"
          label="发售数量"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="num"
          label="库存数量"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="buy_num"
          label="售出数量"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="roll_num"
          label="参与抽签人数"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          property="sale_time"
          :formatter="dateFormat"
          label="开售时间"
          width="200"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="tx_hash"
          label="交易hash"
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
        <el-table-column align="center" label="转赠功能" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.trans_sta"
              active-value="1"
              inactive-value="0"
              @change="changeTransSta($event, scope.row.id)"
              active-color="#ff2b5b"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="二级市场销售" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.market_sale_sta"
              active-value="1"
              inactive-value="0"
              @change="changeMarketSta($event, scope.row.id)"
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

        <el-table-column align="center" label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.prize_sta == 1 && scope.row.roll_sta == 0"
              @click="rollDice(scope.row.id)"
              >开始抽签</el-link
            >
            <el-divider
              v-if="scope.row.prize_sta == 1 && scope.row.roll_sta == 0"
              direction="vertical"
            ></el-divider>
            <el-link
              v-if="scope.row.prize_sta == 1 && scope.row.roll_sta == 1"
              @click="showWinner(scope.row.id)"
              >中签记录</el-link
            >
            <el-divider
              v-if="scope.row.prize_sta == 1 && scope.row.roll_sta == 1"
              direction="vertical"
            ></el-divider>
            <el-link
              v-if="scope.row.prize_sta == 1"
              @click="showRoll(scope.row.id)"
              >抽签记录</el-link
            >
            <el-divider
              v-if="scope.row.prize_sta == 1"
              direction="vertical"
            ></el-divider>
            <el-link
              v-if="scope.row.nft_type == 3"
              @click="comboBox(scope.row.id)"
              >合成设置</el-link
            >

            <el-divider
              v-if="scope.row.nft_type == 3"
              direction="vertical"
            ></el-divider>
            <el-link
              v-if="scope.row.exchange_sta == 1"
              @click="exchangeBox(scope.row.id)"
              >兑换设置</el-link
            >
            <el-divider
              v-if="scope.row.exchange_sta == 1"
              direction="vertical"
            ></el-divider>
            <el-link
              v-if="scope.row.nft_type == 2"
              @click="editBox(scope.row.id)"
              >盲盒设置</el-link
            >
            <el-divider
              v-if="scope.row.nft_type == 2"
              direction="vertical"
            ></el-divider>
            <el-link
              v-if="scope.row.nft_type == 2"
              @click="showBoxList(scope.row.id)"
              >盲盒持有列表</el-link
            >
            <el-divider
              v-if="scope.row.nft_type == 2"
              direction="vertical"
            ></el-divider>
            <el-link @click="editNfts(scope.row.id)">藏品管理</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link
              v-if="!scope.row.class_id && scope.row.task_id"
              @click="updateNft(scope.row.id)"
              >更新链数据</el-link
            >
            <el-divider
              v-if="!scope.row.class_id && scope.row.task_id"
              direction="vertical"
            ></el-divider>
            <el-link @click="openWhiteList(scope.row.id)">白名单</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link @click="openVip(scope.row.id)">优先购</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link @click="editwork(scope.row.id)">编辑</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link type="danger" @click="handleDelete(scope.row.id)"
              >删除</el-link
            ><el-divider direction="vertical"></el-divider>
            <el-link type="danger" @click="setSoldOut(scope.row.id)"
              >一键售罄</el-link
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

    <el-dialog title="录入白名单" :visible.sync="white_input_box" width="500px">
      <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="tel" placeholder="请填写白名单手机号"></el-input>
        </el-form-item>
        <el-form-item label="购买份数" prop="num">
          <el-input-number v-model="num" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveWhite">保存信息</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="白名单列表" :visible.sync="white_box" width="800px">
      <div class="fliter">
        <div class="fliter_item">
          <el-button icon="el-icon-edit" @click="white_input_box = true"
            >手动录入</el-button
          >
        </div>
        <div class="fliter_item">
          <el-upload
            action="/api/uploadexcel"
            :on-success="handleExcelSuccess"
            :show-file-list="false"
            accept=".xls, .xlsx"
          >
            <el-button type="success" icon="el-icon-box">导入Excel</el-button>
          </el-upload>
        </div>
        <div class="fliter_item">
          <el-button icon="el-icon-download" @click="downloadDemo"
            >模版下载</el-button
          >
        </div>
        <div class="fliter_item">
          <el-input v-model="tel" placeholder="请填写白名单手机号"></el-input>
        </div>
        <div class="fliter_item">
          <el-button icon="el-icon-search" @click="searchWhite"
            >搜索</el-button
          >
        </div>
      </div>

      <div class="eic_table">
        <el-table
          ref="multipleTable"
          :data="whiteList"
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
            prop="tel"
            label="手机号"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="num"
            label="购买份数"
          ></el-table-column>
          <el-table-column
            align="center"
            property="time"
            :formatter="dateFormat"
            label="导入时间"
          ></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-link type="danger" @click="deleteWhite(scope.row.id)"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrap">
          <el-pagination
            background
            :current-page="whitePaginationData.currentPage"
            :page-size.sync="whitePaginationData.pageSize"
            @current-change="handleWhiteChange"
            layout="total, prev, pager, next, jumper"
            :total="whitePaginationData.total"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="优先购列表" :visible.sync="vip_box" width="800px">
      <div class="fliter">
        <div class="fliter_item">
          <el-button icon="el-icon-edit" @click="vip_rule_box = true"
            >新增规则</el-button
          >
        </div>
      </div>
      <div class="eic_table">
        <el-table
          ref="multipleTable"
          :data="vip_rules"
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
            label="须持有藏品"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="buy_num"
            label="可购买份数"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="buy_time"
            label="提前购买时间(分钟)"
          ></el-table-column>
          <el-table-column
            align="center"
            property="time"
            :formatter="dateFormat"
            label="导入时间"
          ></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-link type="danger" @click="deleterule(scope.row.id)"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog
      title="新增优先购规则"
      :visible.sync="vip_rule_box"
      width="500px"
    >
      <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="持有藏品">
          <el-select v-model="ruleForm.need_nft_id" placeholder="请选择">
            <el-option
              v-for="item in nft_list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可提前购买时间">
          <el-input-number
            v-model="ruleForm.buy_time"
            :min="0"
          ></el-input-number>
          <p class="tips">单位：分钟</p>
        </el-form-item>
        <el-form-item label="可购买份数">
          <el-input-number
            v-model="ruleForm.buy_num"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveVipRule">保存信息</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="合成条件设置" :visible.sync="combo_box" width="800px">
      <div class="fliter">
        <div class="fliter_item">
          <el-button icon="el-icon-edit" @click="combo_add_box = true"
            >新增合成条件</el-button
          >
        </div>
      </div>
      <div class="eic_table">
        <el-table
          ref="multipleTable"
          :data="combo_rules"
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
          <el-table-column label="材料类型" align="center" width="120">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag v-if="scope.row.mode == 1">普通藏品</el-tag>
                <el-tag v-if="scope.row.mode == 2">盲盒藏品</el-tag>
                <el-tag v-if="scope.row.mode == 3">指定盲盒</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="title"
            label="需要藏品"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="need_num"
            label="需要份数"
          ></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-link type="danger" @click="deletecomborule(scope.row.id)"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="合成条件设置" :visible.sync="combo_add_box" width="600px">
      <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="合成模式">
          <el-radio-group v-model="comboForm.mode">
            <el-radio :label="1">普通藏品合成</el-radio>
            <el-radio :label="2">盲盒合成</el-radio>
            <el-radio :label="3">指定盲盒合成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="需要藏品" v-if="comboForm.mode == 1">
          <el-select v-model="comboForm.need_nft_id" placeholder="请选择">
            <el-option
              v-for="item in nft_list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需要藏品" v-if="comboForm.mode == 2">
          <el-select v-model="comboForm.need_nft_id" placeholder="请选择">
            <el-option
              v-for="item in nft_box"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需要藏品" v-if="comboForm.mode == 3">
          <el-select v-model="comboForm.need_nft_id" placeholder="请选择">
            <el-option
              v-for="item in box_list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需要份数">
          <el-input-number
            v-model="comboForm.need_num"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveComboRule">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="兑换规则设置" :visible.sync="exchange_box" width="800px">
      <div class="fliter">
        <div class="fliter_item">
          <el-button icon="el-icon-edit" @click="exchange_add_box = true"
            >新增兑换规则</el-button
          >
        </div>
      </div>
      <div class="eic_table">
        <el-table
          ref="multipleTable"
          :data="exchange_rules"
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
            label="需要藏品"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="need_num"
            label="消耗份数"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="get_num"
            label="兑换份数"
          ></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-link type="danger" @click="deleteExchangerule(scope.row.id)"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog
      title="新增兑换规则"
      :visible.sync="exchange_add_box"
      width="500px"
    >
      <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="藏品类型">
          <el-radio-group v-model="exchangeForm.mode">
            <el-radio :label="1">普通藏品</el-radio>
            <el-radio :label="2">盲盒藏品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="需要藏品" v-if="exchangeForm.mode == 1">
          <el-select v-model="exchangeForm.need_nft_id" placeholder="请选择">
            <el-option
              v-for="item in nft_list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需要藏品" v-else>
          <el-select v-model="exchangeForm.need_nft_id" placeholder="请选择">
            <el-option
              v-for="item in nft_box"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消耗份数">
          <el-input-number
            v-model="exchangeForm.need_num"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="可兑换份数">
          <el-input-number
            v-model="exchangeForm.get_num"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveExchangeRule"
            >保存设置</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="中签名单" :visible.sync="winner_box" width="800px">
      <div class="eic_table">
        <el-table
          ref="multipleTable"
          :data="winner_list"
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
            prop="user.mobile"
            label="手机号"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="user.address"
            label="钱包地址"
          ></el-table-column>
          <el-table-column
            align="center"
            property="addtime"
            :formatter="dateFormat"
            label="中签时间"
          ></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="参与抽签名单" :visible.sync="roll_box" width="800px">
      <div class="fliter">
        <div class="fliter_item">
          <el-input v-model="tel" placeholder="请填写抽签手机号"></el-input>
        </div>
        <div class="fliter_item">
          <el-button icon="el-icon-search" @click="searchRoll"
            >搜索</el-button
          >
        </div>
      </div>
      <div class="eic_table">
        <el-table
          ref="multipleTable"
          :data="roll_list"
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
            prop="user.mobile"
            label="手机号"
          ></el-table-column>
          <el-table-column
            align="center"
            property="time"
            :formatter="dateFormat"
            label="抽签时间"
          ></el-table-column>
          <el-table-column align="center" label="指定中签">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.win_sta"
                active-value="1"
                inactive-value="0"
                @change="changeWinSta(scope.row.id)"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap">
          <el-pagination
            background
            :current-page="rollPaginationData.currentPage"
            :page-size.sync="rollPaginationData.pageSize"
            @current-change="handleRollChange"
            layout="total, prev, pager, next, jumper"
            :total="rollPaginationData.total"
          ></el-pagination>
        </div>
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
      title: "",
      tel: "",
      num: "",
      loading: true,
      tableData: [],
      paginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 6,
      },
      previewBox: false,
      img_src: "",
      options: [
        {
          value: 0,
          label: "全部藏品",
        },
        {
          value: 1,
          label: "普通藏品",
        },
        {
          value: 2,
          label: "盲盒",
        },
        {
          value: 3,
          label: "合成",
        },
      ],
      type: 0,
      whiteList: [],
      white_box: false,
      whitePaginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      rollPaginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      white_input_box: false,
      id: 0,
      vip_box: false,
      vip_rule_box: false,
      nft_list: [],
      nft_box: [],
      vip_rules: [],
      ruleForm: {
        nft_id: "",
        need_nft_id: "",
        buy_time: 30,
        buy_num: 1,
      },
      combo_box: false,
      combo_add_box: false,
      combo_rules: [],
      comboForm: {
        mode: 1,
        nft_id: "",
        need_nft_id: "",
        need_num: 1,
      },
      winner_list: [],
      winner_box: false,
      roll_box: false,
      roll_list: [],
      exchange_box: false,
      exchange_add_box: false,
      exchange_rules: [],
      exchangeForm: {
        mode: 1,
        nft_id: "",
        need_nft_id: "",
        need_num: 1,
        get_num: 1,
      },
    };
  },
  computed: {},
  mounted() {
    this.getData();
    this.getNft();
  },
  methods: {
    searchWhite(){
      if (this.tel.length == 0) {
        this.$message.error("请填写手机号");
      }
      this.whitePaginationData.currentPage = 1
      this.getWhiteList()
    },
    searchRoll(){
      if (this.tel.length == 0) {
        this.$message.error("请填写手机号");
      }
      this.rollPaginationData.currentPage = 1
      this.getRollData()
    },
    async changeWinSta(id) {
      let res = await this.$http.post("/manage/setwinsta", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.$message.success("设置成功");
      }
    },
    async showRoll(id) {
      this.id = id;
      this.getRollData()
      this.roll_box = true;
    },
    async getRollData(){
      let res = await this.$http.post("/manage/rolllist", {
        id: this.id,
        currentPage: this.rollPaginationData.currentPage,
        pageSize: this.rollPaginationData.pageSize,
        token: localStorage.nft_pro_token,
        tel: this.tel
      });
      if (res.errcode == 0) {
        this.roll_list = res.data;
        this.rollPaginationData.total = res.total;
      } else {
        this.$message.error(res.errmsg);
      }
    },
    setSoldOut(id) {
      this.$confirm("此操作将强制设置成售罄状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.doSoldOut(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async doSoldOut(id) {
      let res = await this.$http.post("/manage/setsoldout", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.$message.success("设置成功");
        this.getData();
      } else {
        this.$message.error(res.errmsg);
      }
    },
    async showWinner(id) {
      let res = await this.$http.post("/manage/winnerlist", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.winner_list = res.data;
        this.winner_box = true;
      } else {
        this.$message.error(res.errmsg);
      }
    },
    rollDice(id) {
      this.$confirm(
        "此操作执行抽签操作，抽取完成后用户将无法继续抽签, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.doRoll(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async doRoll(id) {
      let res = await this.$http.post("/manage/roll", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.$message.success("抽签成功");
        this.getData();
      } else {
        this.$message.error(res.errmsg);
      }
    },
    editBox(id) {
      this.$router.push({
        path: "/blindgoods?id=" + id,
      });
    },
    showBoxList(id) {
      this.$router.push({
        path: "/boxlist?id=" + id,
      });
    },
    comboBox(id) {
      this.id = id;
      this.getComboRules();
      this.getNft();
      this.combo_box = true;
    },
    exchangeBox(id) {
      this.id = id;
      this.getExchangeRules();
      this.getNft();
      this.exchange_box = true;
    },
    async updateNft(id) {
      let res = await this.$http.post("/manage/updatenft", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.$message.success("更新成功");
        this.getData();
      } else {
        this.$message.error(res.errmsg);
      }
    },
    handleExcelSuccess(e) {
      console.log(e);
      this.savewhitefromexcel(e.excel);
    },
    async savewhitefromexcel(excel) {
      let res = await this.$http.post("/manage/savewhitefromexcel", {
        id: this.id,
        excel: excel,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.$message.success("保存成功");
        this.getWhiteList();
      } else {
        this.$message.error(res.data.errmsg);
      }
    },
    async getNft() {
      let res = await this.$http.get("/manage/nftall", {
        token: localStorage.nft_pro_token,
      });
      this.nft_list = res.data;
      this.nft_box = res.nft_box;
      this.box_list = res.box_list;
    },
    async saveVipRule() {
      let res = await this.$http.post("/manage/saveviprule", {
        id: this.id,
        token: localStorage.nft_pro_token,
        rule: this.ruleForm,
      });
      if (res.errcode == 0) {
        this.$message.success("保存成功");
        this.getVipRules();
        this.vip_rule_box = false;
        this.ruleForm = {
          nft_id: "",
          need_nft_id: "",
          buy_time: 30,
          buy_num: 1,
        };
      } else {
        this.$message.error(res.errmsg);
      }
    },
    async saveExchangeRule() {
      let res = await this.$http.post("/manage/saveexchangerule", {
        id: this.id,
        token: localStorage.nft_pro_token,
        rule: this.exchangeForm,
      });
      if (res.errcode == 0) {
        this.$message.success("保存成功");
        this.getExchangeRules();
        this.exchange_add_box = false;
        this.exchangeForm = {
          nft_id: "",
          mode: 1,
          need_nft_id: "",
          get_num: 1,
        };
      } else {
        this.$message.error(res.errmsg);
      }
    },
    async saveComboRule() {
      let res = await this.$http.post("/manage/savecomborule", {
        id: this.id,
        token: localStorage.nft_pro_token,
        rule: this.comboForm,
      });
      if (res.errcode == 0) {
        this.$message.success("保存成功");
        this.getComboRules();
        this.combo_add_box = false;
        this.comboForm = {
          nft_id: "",
          mode: 1,
          need_nft_id: "",
          need_num: 1,
        };
      } else {
        this.$message.error(res.errmsg);
      }
    },
    openVip(id) {
      this.id = id;
      this.vip_box = true;
      this.getVipRules();
      this.getNft();
    },
    async getVipRules() {
      let res = await this.$http.post("/manage/viprules", {
        token: localStorage.nft_pro_token,
        id: this.id,
      });
      if (res.errcode == 0) {
        this.vip_rules = res.data;
      }
    },
    async getComboRules() {
      let res = await this.$http.post("/manage/comborules", {
        token: localStorage.nft_pro_token,
        id: this.id,
      });
      if (res.errcode == 0) {
        this.combo_rules = res.data;
      }
    },
    async getExchangeRules() {
      let res = await this.$http.post("/manage/exchangerules", {
        token: localStorage.nft_pro_token,
        id: this.id,
      });
      if (res.errcode == 0) {
        this.exchange_rules = res.data;
      }
    },
    async deleteWhite(id) {
      let res = await this.$http.get("/manage/deletewhite", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.$message.success("删除成功");
        this.getWhiteList();
      } else {
        this.$message.error(res.data.errmsg);
      }
    },
    async deleteExchangerule(id) {
      let res = await this.$http.get("/manage/deleteexchangerule", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.$message.success("删除成功");
        this.getExchangeRules();
      } else {
        this.$message.error(res.data.errmsg);
      }
    },
    async deletecomborule(id) {
      let res = await this.$http.get("/manage/deletecomborule", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.$message.success("删除成功");
        this.getComboRules();
      } else {
        this.$message.error(res.data.errmsg);
      }
    },
    async deleterule(id) {
      let res = await this.$http.get("/manage/deleteviprule", {
        id: id,
        token: localStorage.nft_pro_token,
      });
      if (res.errcode == 0) {
        this.$message.success("删除成功");
        this.getVipRules();
      } else {
        this.$message.error(res.data.errmsg);
      }
    },
    async saveWhite() {
      if (this.tel.length > 0 && this.num > 0) {
        let res = await this.$http.post("/manage/savewhite", {
          id: this.id,
          token: localStorage.nft_pro_token,
          tel: this.tel,
          num: this.num,
        });
        if (res.errcode == 0) {
          this.white_input_box = false;
          this.tel = "";
          this.num = "";
          this.getWhiteList();
        } else {
          this.$message({
            message: res.errmsg,
            type: "warning",
          });
        }
      }
    },
    async changeTransSta(event, id) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/transsta", {
        token: localStorage.nft_pro_token,
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
    downloadDemo() {
      window.open("/white_list.xlsx");
    },
    openWhiteList(id) {
      this.id = id;
      this.getWhiteList();
      this.white_box = true;
    },
    async getWhiteList() {
      let res = await this.$http.post("/manage/whitelist", {
        token: localStorage.nft_pro_token,
        currentPage: this.whitePaginationData.currentPage,
        pageSize: this.whitePaginationData.pageSize,
        id: this.id,
        tel: this.tel,
      });
      if (res.errcode == 0) {
        this.whiteList = res.data;
        this.whitePaginationData.total = res.total;
      }
    },
    exportWhiteList() {},
    editNfts(id) {
      this.$router.push({
        path: "/nftitems?id=" + id,
      });
    },
    async changeSta(event, id) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/salesta", {
        token: localStorage.nft_pro_token,
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
    async changeMarketSta(event, id) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/manage/nftmarketsalesta", {
        token: localStorage.nft_pro_token,
        id: id,
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
    async publish(id) {
      let res = await this.$http.get("/blockchain/publish", {
        id: id,
      });
      console.log(res);

      if (res.response.errno == 0) {
        this.$message.success("发布藏品成功");
        this.getData();
      }
    },
    async query(id) {
      let res = await this.$http.get("/blockchain/query", {
        id: id,
      });
      console.log(res);
      if (res.errcode == 0) {
        this.$message.success("更新成功");
        this.getData();
      } else {
        this.$message.error("等待数据同步区块链 大约1-3分钟");
      }
    },
    editwork(id) {
      this.$router.push({
        path: "/create?id=" + id,
      });
    },
    addAsset() {
      this.$router.push({
        path: "/create",
      });
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
      let res = await this.$http.get("/manage/mainlist", {
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
        token: localStorage.nft_pro_token,
        type: this.type,
        title: this.title,
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
          this.delework(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async delework(id) {
      let res = await this.$http.get("/manage/delenft", {
        id: id,
        token: localStorage.nft_pro_token,
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
    handleWhiteChange(num) {
      this.whitePaginationData.currentPage = num;
      this.getWhiteList();
    },
    handleRollChange(num) {
      this.rollPaginationData.currentPage = num;
      this.getRollData();
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
