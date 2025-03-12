<template>
  <div class="page-cnt">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="gray">
        <span class="pointer" @click="goBack(0)">账单总览</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="gray">
        <span class="pointer" @click="goBack(1)">账单明细</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span>用量明细</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-button
      :loading="exportLoading"
      type="primary"
      class="export-btn"
      size="mini"
      @click="handleExport"
    >
      导出明细
    </el-button>
    <MPageLayout
      ref="tableRef"
      type="tablePage"
      class="table-cnt"
      :border="true"
      :slot-arr="config.slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.columns"
      :loading="loading"
      table-index-width="62px"
      layout="total, sizes, prev, pager, next, jumper"
      :row-class-name="tableRowClassName"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="usedAmount" slot-scope="scope">
        <p>{{ scope.row.usedAmount || '--' }} {{ scope.row.usedAmountUnit }}</p>
      </template>
      <template slot="chargesAmount" slot-scope="scope">
        <p>{{ scope.row.chargesAmount | priceFt }}</p>
      </template>
      <template slot="amount" slot-scope="scope">
        <p>{{ scope.row.amount | priceFt }}</p>
      </template>
      <template slot="payAmount" slot-scope="scope">
        <p>{{ scope.row.payAmount | priceFt }}</p>
      </template>
      <template slot="liveType" slot-scope="scope">
        <p>{{ liveTypeObj[scope.row.liveType] || '--' }}</p>
      </template>
      <template slot="type" slot-scope="scope">
        <p>{{ typeObj[scope.row.type] || '--' }}</p>
      </template>
      <template slot="usageGb" slot-scope="scope">
        <p>{{ scope.row.usageGb }} GB</p>
      </template>
      <template slot="Tokens" slot-scope="scope">
        <p>{{ scope.row.usedAmount }}</p>
      </template>
      <template slot="totalDuration" slot-scope="scope">
        <p>{{ scope.row.totalDuration | minFt }}</p>
      </template>
      <template slot="chargedDuration" slot-scope="scope">
        <p>{{ scope.row.chargedDuration | minFt }}</p>
      </template>
      <template slot="voucherUrl" slot-scope="scope">
        <span class="blue-txt" @click.stop="viewFile(scope.row.voucherUrl)">
          查看凭证
        </span>
      </template>
      <template slot="action" slot-scope="scope">
        <el-button
          class="ptb0"
          type="text"
          @click="openDialog('detail', scope.row)"
        >
          详情
        </el-button>
        <el-button
          class="ptb0"
          type="text"
          @click="openDialog('del', scope.row)"
        >
          删除
        </el-button>
      </template>
    </MPageLayout>
  </div>
</template>

<script>
import { codeTransAPpi } from './data'
import Decimal from 'decimal.js'
export default {
  name: 'BillingCenterUsageDetails',
  filters: {
    priceFt(number) {
      if (typeof number !== 'number') return '--'
      if (number < 0) number = 0
      number = Decimal(number).div(100) // 钱单位为分 单独处理
      // 这里我们手动处理，不依赖于特定的区域设置
      const yuanString = number.toString()
      const parts = yuanString.split('.')
      let integerPart = parts[0]
      const decimalPart = parts[1] ? '.' + parts[1] : ''

      // 添加千分位分隔符
      if (integerPart.length > 3) {
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }

      // 合并整数部分和小数部分（如果有的话）
      return '￥' + integerPart + decimalPart
    },
    minFt(seconds) {
      if (typeof seconds !== 'number') return '--'
      return Math.ceil(seconds / 60)
    }
  },
  data() {
    return {
      pageLoading: false,
      loading: false,
      exportLoading: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        columns: [],
        slotArr: []
      },
      reqInfo: {},
      apiPath: null,
      exportAPI: null,
      liveTypeObj: {
        PERSON_LIVE: '真人直播',
        AI_LIVE: '智能直播',
        DIGITAL_PERSON_LIVE: '数字人直播'
      },
      typeObj: {
        1: '视频-存储',
        2: '视频-播放/下载',
        3: '工程-存储',
        4: '工程-播放/下载'
      }
    }
  },
  mounted() {
    const { code, billCycle, tenantId } = this.$route.query
    if (code) {
      const isCUSTOM = code.includes('CUSTOM')
      const {
        api,
        columns,
        slotArr = []
      } = codeTransAPpi[isCUSTOM ? 'CUSTOM' : code]
      this.apiPath = api.list
      this.exportAPI = api.export
      this.config.columns = columns || []
      this.config.slotArr = slotArr || []
      this.reqInfo = {
        billCycle,
        tenantId,
        productChargesItemNo: code
      }
      // 数字人 及 自定义收费项 增加 productChargesItemNo
      // if (['SYS0001', 'SYS0002', 'SYS0003', 'SYS0004'].includes(code) || isCUSTOM) {
      //   this.reqInfo['productChargesItemNo'] = code
      // }
      this.searchFn()
    }
  },
  methods: {
    async getTableInfo() {
      this.loading = true
      try {
        if (!this.apiPath) return
        const { data } = await this.apiPath({
          ...this.reqInfo,
          pageSize: this.config.pageSize,
          pageIndex: this.config.currentPage
        })
        if (!data) return
        this.$set(this.config, 'tableData', data.items || [])
        this.$set(this.config, 'total', data.total)
        this.$nextTick(() => {
          this.$refs.tableRef.doLayout()
        })
        // 是第一页 重新可算总数
        console.log(
          'this.config.currentPage === 1-----',
          this.config.currentPage === 1
        )
      } catch (error) {
        console.log('error------getTableInfo', error)
      }
      this.loading = false
    },
    searchFn() {
      this.config.currentPage = 1
      this.getTableInfo()
    },
    viewFile(url) {
      console.log('url---', url)
      window.open(url)
    },
    // MPageLayout-=--start
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getTableInfo()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getTableInfo()
    },
    handleSearch() {
      this.config.currentPage = 1
      this.getTableInfo()
    },
    async handleExport() {
      // 导出
      this.exportLoading = true
      try {
        if (!this.exportAPI) return
        const { data } = await this.exportAPI(this.reqInfo)
        window.location = data
        window.open(data, '_self')
      } catch (error) {
        console.log('error------getTableInfo', error)
      }
      this.exportLoading = false
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2) {
        return 'blue-row'
      }
      return ''
    },
    goBack(index) {
      let prevPath = this.$route.query?.prevPath
      if (typeof prevPath === 'string') prevPath = JSON.parse(prevPath)
      if (prevPath) {
        this.$router.replace({
          path: prevPath[index].path,
          query: prevPath[index].query
        })
      } else {
        this.$router.go(-1)
      }
    }
    // MPageLayout -----end
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page-cnt {
  @include responsive-height(20px);
  min-width: 1100px;
  width: 100%;
  background: #fff;
  padding: 0;
  border-radius: 5px;
  position: absolute;
  display: flex;
  flex-direction: column;
  .export-btn {
    position: absolute;
    right: 20px;
    top: 10px;
  }
  .breadcrumb {
    height: 48px;
    border-bottom: 1px solid #dfe4ed;
    padding: 0 20px;
    ::v-deep .el-breadcrumb__inner {
      font-size: 15px;
      font-weight: 500;
      line-height: 48px;
      color: #000;
    }
    .gray {
      ::v-deep .el-breadcrumb__inner {
        color: #777777;
        cursor: pointer;
      }
    }
  }
  .hok-main {
    @include responsive-height(68px);
    overflow-y: auto;
    padding: 25px 20px 20px 20px;
    .mb20 {
      margin-bottom: 20px;
    }
    .mt20 {
      margin-top: 20px;
    }
    .title {
      color: #000000;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 18px;
      padding-left: 11px;
      text-align: left;
      position: relative;

      &::before {
        content: '';
        height: 100%;
        width: 2px;
        background: #0c6fff;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .info-cell {
      height: 49px;
      flex-shrink: 0;
      border-radius: 8px;
      border: 1px solid #eff2f6;
      background: #fbfcff;
      line-height: 49px;
      margin-bottom: 20px;
      padding: 0 13px;
      span {
        color: #4a4a4a;
        font-family: 'Microsoft YaHei';
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        strong {
          margin: 0 30px 0 18px;
        }
      }
    }
  }
  .btns {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 20px 0;
    box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 5%);
    border-radius: 0 0 5px 5px;
    background: #fff;
    z-index: 1;
  }
  ::v-deep .table-cnt {
    flex: 1;
    overflow: hidden;
    border-radius: 8px;
    .el-table {
      border-radius: 8px;
    }
    .el-table--border {
      border-radius: 8px;
    }
    /* .el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell{
      border-bottom: none;
    } */
    thead tr {
      th {
        background-color: #ebf7ff;
        &:first-child {
          border-radius: 8px 0 0 0;
        }
        &:nth-child(3) {
          border-radius: 0 8px 0 0;
        }
        .cell {
          color: #5c6387;
        }
      }
    }
    tbody tr:last-child {
      border-radius: 0 0 8px 8px;
      td:first-child {
        border-radius: 0 0 0 8px;
      }
      td:last-child {
        border-radius: 0 0 8px 0;
      }
    }

    .blue-row {
      background-color: #f2f9ff !important;
    }
    .page_footer {
      justify-content: flex-end;
    }
    .el-table--group,
    .el-table--border,
    .el-table th.el-table__cell.is-leaf,
    .el-table td.el-table__cell {
      border-color: #dcecf7;
    }
    .blue-row {
      background-color: #f2f9ff !important;
    }
    thead th {
      background-color: #f2f9ff !important;
      padding: 15px 0;
      text-align: center;
    }
    .cell {
      font-size: 14px;
      color: #333;
      text-align: center;
      justify-content: center;
      font-style: normal;
      font-weight: 500;
      .blue-txt {
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        color: #0c6fff;
        cursor: pointer;
      }
    }
    th.el-table__cell > .cell {
      font-size: 16px;
      font-weight: 600;
      color: #5c6387;
    }
    .el-button + .el-button {
      margin-left: 20px;
    }
  }
}
</style>
