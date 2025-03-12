<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <el-table :data="rowList" :cell-style="columStyle" :header-cell-style="headerColumStyle" :row-style="changeRowBgColorByIsPay">
        <template v-for="item in headerList">
          <table-column
            v-if="item.subHeaderList && item.subHeaderList.length"
            :key="item.group"
            :coloumn-header="item"
          />
          <el-table-column
            v-else
            :key="item.group"
            :label="item.headerName"
            :prop="item.group"
          />
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  getStatisticsOperation
} from '@/api/business/financial'
import tableColumn from '@/views/business/financialInstruments/components/tableColumn'
export default {
  name: 'OperationStatistcsData',
  components: {
    tableColumn
  },
  props: {

  },
  data() {
    return {
      row: {},
      headerList: [],
      rowList: [],
      loading: false,
      orderTimeArray: [],
      search: {
        deptId: '',
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        orderEndTime: '', // 订单结束时间
        orderStartTime: '', // 订单开始时间
        operateUid: '' // 员工
      }

    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.$store.dispatch('option/getDeptList', { deptId: 0 })
  },
  activated() {
  },
  methods: {
    changeRowBgColorByIsPay(row) {
      if (row.row.groupDept.indexOf('合计') >= 0 || row.row.groupDept.indexOf('总计') >= 0) {
        const styleJson = {
          'background-color': '#bdd7ee',
          'color': '#27408B'
        }
        return styleJson
      }
    },
    columStyle({ row, columnIndex }) {
      if (
        columnIndex === 2 ||
        columnIndex === 3 ||
        columnIndex === 4 ||
        columnIndex === 8 ||
        columnIndex === 9 ||
        columnIndex === 10
      ) {
        if (!(row.groupDept.indexOf('合计') >= 0 || row.groupDept.indexOf('总计') >= 0)) {
          return 'background: #fff2cd; text-align: center'
        } else {
          return 'text-align: center'
        }
      } else {
        return 'text-align: center'
      }
    },
    headerColumStyle({ row, columnIndex }) {
      if (row.length === 5) {
        if (columnIndex === 1 || columnIndex === 3) {
          return 'background: #fff2cd; text-align: center'
        } else {
          return 'text-align: center'
        }
      }
      if (row.length === 14) {
        return 'background: #f4af85;color: #27408B;font-weight: bold; text-align: center'
      }
    },
    toComplete(row) {
      this.row = row
      this.$refs.completeModal.show(row)
    },
    returnChannelName(value) {
      let str = ''
      this.channelSourceType.some(item => {
        if (item.value === value) {
          str = item.label
        }
      })
      return str
    },
    formLastLoadData() {
      this.loadData(this.search)
    },
    loadData(search) {
      this.search = search
      getStatisticsOperation(search).then(res => {
        if (res.code === 1) {
          this.rowList = res.data.rowList
          this.headerList = res.data.headerList
        }
      })
    },
    handleCurrentChange(val) {
      this.search.pageIndex = val
      this.loadData(this.search)
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      this.loadData(this.search)
    }
  }
}
</script>

    <style scoped lang="scss">
      .page_wrap {
        height: 100%;
        // background-color: #fff;
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
    </style>

