<template>
  <div class="page-content">
    <!-- 线索管理 -->
    <MCard class="page_wrap">
      <MPageLayout
        ref="MPageLayout"
        type="tablePage"
        :slot-arr="slotArr"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="config.tableData"
        :table-columns="config.tableColumns"
        :loading="loading"
        :span-method="objectSpanMethod"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template slot="search">
          <filterTop
            :loading="loading"
            :search="search"
            @onSearch="searchFn"
            @onClear="onClear"
          />
        </template>
        <template slot="action">
          <el-button type="text">查看</el-button>
        </template>
        <template slot="telephone" slot-scope="{ row }">
          <!-- <watchPhoneNumber :default-value="row.telephone" /> -->
          <div class="list-child-info">{{ row.telephone || '--' }} <i v-if="row.telephone.indexOf('XXXX') > 0 || row.telephone.indexOf('xxxx') > 0" class="pointer el-icon-view" @click="toShowPhoneNumber(row)" /></div>
        </template>
        <template slot="isDistributed" slot-scope="{ row }">
          <div
            class="isDistributedType"
            :class="`isDistributedType${row.isDistributed}`"
          >
            {{ { 1: '已分配', 0: '未分配' }[row.isDistributed] }}
          </div>
        </template>
        <template slot="fromProblemDtos" slot-scope="{ row }">
          <el-popover
            placement="bottom"
            width="450"
            trigger="hover"
            popper-class="message-popover"
          >
            <el-table
              :data="row.fromProblemDtos"
              :header-cell-style="headerCellStyle"
              style="width: 100%;border: 1px solid rgb(245, 245, 245);"
            >
              <el-table-column
                prop="problem"
                label="问题"
              />
              <el-table-column
                prop="answer"
                label="回答"
              />
            </el-table>
            <p slot="reference" class="search-price-p">查看</p>
          </el-popover>
        </template>

        <template slot="isPurchased" slot-scope="{ row }">
          <div
            class="isDistributedType"
            :class="`isDistributedType${row.isPurchased}`"
          >
            {{ { 1: '已转化', 0: '未转化' }[row.isPurchased] }}
          </div>
        </template>

        <template slot="hasCheckIn" slot-scope="{ row }">
          <div
            class="isDistributedType"
            :class="`isDistributedType${row.hasCheckIn}`"
          >
            {{ { 1: '已到场', 0: '未到场' }[row.hasCheckIn] }}
          </div>
        </template>
        <template slot="isSameContact" slot-scope="{row}">
          <div>{{ row.isSameContact === 1?'是':'否' }}</div>
        </template>
        <template slot="erpPrice" slot-scope="{ row }">
          <template v-if="row.list">
            <div
              v-for="(item, index) in row.list"
              :key="index"
              class="row-span3"
              style="padding: 10px 0"
            >
              <div>￥{{ filtersMoneyByZero(item.fee) }}</div>
              <div>{{ item.name }}</div>
              <div>￥{{ filtersMoneyByZero(item.payAmount) }}</div>
            </div>
          </template>
          <div v-else class="row-span3">
            <div>￥{{ filtersMoneyByZero(row.erpPrice) }}</div>
            <div>{{ row.erpGoodsName }}</div>
            <div>￥{{ filtersMoneyByZero(row.erpActualAmount) }}</div>
          </div>
        </template>
      </MPageLayout>
    </MCard>
  </div>
</template>

<script>
import { getColumns } from './columns.js'
import filterTop from './filterTop.vue'
import { getCluePage } from '@/api/business/clue.js'
import { filtersMoneyByZero } from '@/filters/index'
import { queryPhoneNumberByClueId } from '@/api/user/member'
export default {
  components: {
    filterTop
  },
  data() {
    return {
      headerCellStyle: {
        'background-color': 'rgb(245, 245, 245)'
      },
      slotArr: [
        'action',
        'search',
        'footer',
        'activeFlag',
        'telephone',
        'isDistributed',
        'isPurchased',
        'hasCheckIn',
        'erpPrice',
        'fromProblemDtos',
        'isSameContact'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        isSameContact: '', // 是否撞单选项
        adProductUserId: '', // 投放员工
        clueId: '', // 线索ID
        launchPlatform: '', // 投放平台
        launchPlatType: '', // 投放类型
        advertiserAccount: '', // 账号ID
        time: { label: 1, value: '' }, // 时间查询
        advertiserID: '', // 广告主ID
        orderingCommodityName: '', // 下单商品名称
        assignTeam: '', // 分配团队
        dealIntention: '', // 成交意向
        coursePrice: [], // 成交课程价格
        transactionCoursePrice: '', // 意向上课地点
        clueInfo: { label: 1, value: '' }, // 线索信息
        clueType: { label: 1, value: '' }, // 线索状态
        erpDistributeUserName: '' // 分配销售人员
      },
      loading: false,
      filtersMoneyByZero
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    toShowPhoneNumber(row) {
      queryPhoneNumberByClueId(row.clueId).then(res => {
        if (res.code === 1) {
          row.telephone = res.data
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 19) {
        return {
          rowspan: 1,
          colspan: 3
        }
      }
      if (columnIndex > 19 && columnIndex < 22) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    getList() {
      this.loading = true
      this.config.tableData = []
      const params = {
        isSameContact: this.search.isSameContact,
        adProductUserId: this.search.adProductUserId ? this.search.adProductUserId : null,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        adPlatform: this.search.launchPlatform, // 投放平台
        advertiserId: this.search.advertiserID, // 广告主ID
        advertiserAccount: this.search.advertiserAccount, // 账号ID
        beginTime: this.search.time.value ? this.search.time.value[0] : '', // 起始时间
        endTime: this.search.time.value ? this.search.time.value[1] : '', // 截止时间
        timeType: this.search.time.label, // 时间查询类型 1线索入库时间 2分配时间3首次跟订单时间 4首次出单时间
        clueId: this.search.clueId, // 线索ID
        clueInfo: this.search.clueInfo.label,
        clueInfoContent: this.search.clueInfo.value, // 线索信息
        clueStatus: this.search.clueType.label, // 线索状态1分配 2转化 3到场
        clueStatusContent: this.search.clueType.value, // 线索状态
        clueType: this.search.launchPlatType, // 投放类型
        goodsName: this.search.orderingCommodityName, // 下单商品名称
        groupId: this.search.assignTeam, // 分配团队ID
        intentionLocation: this.search.transactionCoursePrice, // 意向上课地点
        transactionIntention: this.search.dealIntention, // 成交意向
        transactionPrice: this.search.coursePrice.join(','), // 成交课程价格
        erpDistributeUserName: this.search.erpDistributeUserName // 分配销售人员
      }
      getCluePage(params)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    onClear() {
      this.search = {
        clueId: '', // 线索ID
        launchPlatform: '', // 投放平台
        launchPlatType: '', // 投放类型
        advertiserAccount: '', // 账号ID
        time: { label: 1, value: '' }, // 时间查询
        advertiserID: '', // 广告主ID
        orderingCommodityName: '', // 下单商品名称
        assignTeam: '', // 分配团队
        dealIntention: '', // 成交意向
        coursePrice: [], // 成交课程价格
        transactionCoursePrice: '', // 意向上课地点
        clueInfo: { label: 1, value: '' }, // 线索信息
        clueType: { label: 1, value: '' } // 线索状态
      }
      this.searchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  // height: 100%;
  height: calc(100vh - 90px);
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  ::v-deep .el-tabs {
    height: 100%;
  }
  ::v-deep .el-tabs__item {
    font-size: 16px;
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);
  }
  ::v-deep .el-tabs__header {
    margin: 0;
  }
  ::v-deep .el-tab-pane {
    height: 100%;
  }
}
.page_wrap {
  //min-width: 1200px;
  height: 100%;
  //height: calc(100vh - 97px);
  //padding: 20px 20px;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.isDistributedType {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-family: MicrosoftYaHei;
  line-height: 12px;
}
.isDistributedType0 {
  background: #feecec;
  color: #f53f3f;
}
.isDistributedType1 {
  background: #e6f7ea;
  color: #00b42a;
}
::v-deep {
  .item-column {
    padding: 0;

    .cell {
      padding-left: 0px;
      padding-right: 0px;

      .row-span3 {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;

        div {
          width: 33.3%;
        }
      }
    }
  }
}

.search-price-p {
  width: 100%;
  cursor: pointer;
  text-align: center;
  color: #0C6FFF;
}
.pointer {
  cursor: pointer;
  color: #2C82FF;
}
</style>
<style>
.message-popover {
  padding: 0 !important;
  width: 360px!important;
}
</style>
