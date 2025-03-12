<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <MPageLayout
        ref="MPageLayout"
        :slot-arr="slotArr"
        :current-page="config.pageIndex"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="config.tableData"
        :table-columns="config.tableColumns"
        :loading="loading"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <div slot="advertiseChannel" slot-scope="scope">
          <p v-if="scope.row.advertiseChannel === 1">巨量千川</p>
          <p v-else-if="scope.row.advertiseChannel === 3">腾讯广告</p>
          <p v-else-if="scope.row.advertiseChannel === 5">小红书聚光</p>
          <p v-else-if="scope.row.advertiseChannel === 4">百度营销</p>
          <p v-else-if="scope.row.advertiseChannel === 6">磁力金牛</p>
        </div>
        <div slot="year" slot-scope="scope">
          <p>{{ returnYearString(scope.row.month) }}</p>
        </div>
        <div slot="month" slot-scope="scope">
          <p>{{ returnMonthString(scope.row.month) }}</p>
        </div>
        <div slot="advertiseFlag" slot-scope="scope">
          <p v-if="scope.row.advertiseFlag === 0">自投</p>
          <p v-else-if="scope.row.advertiseFlag === 1">代投</p>
        </div>
        <div slot="accountType" slot-scope="scope">
          <p v-if="scope.row.accountType === 0">运营团队</p>
          <p v-else-if="scope.row.accountType === 1">直播团队</p>
        </div>
        <div slot="monthlyCost" slot-scope="scope">
          <p>{{ returnJine(scope.row.monthlyCost) }}</p>
        </div>

      </MPageLayout>
    </div>
  </div>
</template>

<script>
import { getAdvertiseCostDoPage } from '@/api/system/dataConfiguration.js'
export default {
  name: 'PutInOrdersData',
  components: {

  },
  directives: {
  },
  props: {

  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      loading: false,
      auditStatus: 1,
      orderTimeArray: [],
      searchForStart: {
        orderNo: '',
        pageIndex: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      slotArr: ['footer', 'action', 'accountType', 'year', 'month', 'monthlyCost', 'advertiseFlag', 'advertiseChannel'],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          { prop: 'advertiseChannel', label: '渠道', type: 'slot', visible: true, disable: true },
          { prop: 'year', label: '年份', type: 'slot', visible: true, disable: true },
          { prop: 'month', label: '月份', type: 'slot', visible: true, disable: true },
          { prop: 'advertiserId', label: '投放账号', align: 'center', type: 'text', visible: true, disable: true },
          { prop: 'advertiseFlag', label: '投放类型', type: 'slot', visible: true },
          { prop: 'accountType', label: '账号类型', type: 'slot', visible: true },
          { prop: 'monthlyCost', label: '当月累计花费', type: 'slot', visible: true },
          { prop: 'createdAt', label: '上传时间', type: 'text', visible: true },
          { prop: 'createdByName', label: '上传用户', type: 'text', visible: true }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        pageIndex: 1,
        total: 0
      }

    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  activated() {
  },
  methods: {
    returnJine(num) {
      const price = num / 100
      return price.toFixed(2)
    },
    returnMonthString(month) {
      const date = new Date(month)
      const monthd = date.getMonth() + 1
      return monthd
    },
    returnYearString(month) {
      const date = new Date(month)
      const year = date.getFullYear()
      return year
    },
    loadData(search) {
      this.searchForStart = { ...search }
      const params = {
        pageIndex: this.searchForStart.pageIndex,
        pageSize: this.searchForStart.pageSize,
        account: this.searchForStart.account
      }
      getAdvertiseCostDoPage(params).then(res => {
        if (res.code === 1) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        }
      })
    },
    handleCurrentChange(val) {
      this.searchForStart.pageIndex = val
      this.loadData(this.searchForStart)
    },
    handleSizeChange(val) {
      this.searchForStart.pageSize = val
      this.loadData(this.searchForStart)
    }
  }
}
</script>

<style scoped lang="scss">
    .page_wrap {
      height: 100%;
      border-top: 1px solid #E7E7E7;
      ::v-deep .el-table::before {
        height: 0px;
      }
      ::v-deep .customer-table .el-table__fixed-right::before,
      .el-table__fixed::before {
        width: 0;
      }
      .content {
        height: 100%;
        min-height: 580px;
        ::v-deep .tablePage .page_content {
          min-height: 500px;
          padding: 0;
        }
        ::v-deep .el-table--scrollable-y .el-table__body-wrapper {
          min-height: 460px;
        }
        ::v-deep .el-table__body-wrapper .is-scrolling-left {
          min-height: 460px;
        }
        ::v-deep .tablePage .page_header {
          padding: 0!important;
          min-height: 0!important;
          margin-top: 20px;
        }
        ::v-deep .tablePage .my-table {
          width: 100%;
          margin: 0!important;
        }
        ::v-deep .tablePage .page_content{
          width: 100%;
          padding: 0!important;
        }
      }
    }

    .red-cls {
      color: #F53F3F;
    }
    .success-cls {
      color: #67c23a;
    }
    .sys-cls {
      color: #0C6FFF;
    }

    .coupon-data-row {
      width: 100%;
      height: 40px;
      .data-row-btn {
          float: left;
          padding: 3px;
          height: 36px;
          background: #F3F3F3;
          border-radius: 4px;
          span {
              width: 90px;
              text-align: center;
              height: 30px;
              line-height: 30px;
              color: #333;
              display: inline-block;
              cursor: pointer;
              font-size: 14px;
          }
          span.active {
              background: #fff;
              color: #0C6FFF;
          }
      }
      .data-row-tool {
          float: right;
      }
  }
  .audit-div-cls {
padding: 3px 10px;
border-radius: 12px;
background: #FFF2E6;
display: inline-block;
img {
  float: left;
  width: 16px;
  height: 16px;
  margin-top: 4px;
  margin-right: 5px;
}
p {
  float: left;
  color: #FF7D00;
  font-size: 12px;
}
}
.audit-bohui-cls {
background: #FEECEC;
p {
  color: #F53F3F;
}
}
.audit-fushen-cls {
background: #FFF2CC;
p {
  color: #FFC619;
}
}
.audit-tongguo-cls {
background: #E6F7EA;
p {
  color: #00B42A;
}
}
.goods-title-cls {
color: #161616;
font-size: 16px;
margin-bottom: 5px;
white-space: pre-line; /*允许换行*/
overflow: hidden;
text-overflow: ellipsis; /*省略号*/
display: -webkit-box;
-webkit-box-orient: vertical; /*行向垂直排列*/
-webkit-line-clamp: 2; /*限制2行*/
}
.goods-blue-cls {
font-size: 12px;
color: #0C6FFF;
}
.goods-em-cls {
font-style: normal;
font-size: 12px;
color: #FF7D00;
}
.coupon-youhui {
color: #161616;
font-size: 14px;
}
.coupon-yh-em {
font-size: 12px;
color: #999;
}
  </style>

