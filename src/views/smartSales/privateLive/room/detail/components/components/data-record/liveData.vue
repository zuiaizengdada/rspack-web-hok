<template>
  <div class="pageWrap">
    <div class="titleHeader">
      <MTitle style="width: 100%">
        <span>直播数据统计</span>
      </MTitle>
    </div>
    <div class="pageContent">
      <div class="m-b-20 filterTop">
        <label class="tips">
          <span class="m-r-10 tipsText">跟进人部门</span>
          <el-cascader
            v-model="search.deptId"
            size="small"
            filterable
            :options="deptTreeArray"
            :props="{ checkStrictly: true }"
            clearable
            @change="searchFn"
          />
        </label>

        <!-- <CustomTabelHeader :columns="config.columns" @change="handleCheckedTableColumnsChange" /> -->
      </div>
      <MPageLayout
        v-if="attendClassTime !== ''"
        ref="table"
        v-loading="loading"
        row-key="id"
        :slot-arr="slotArr"
        :table-columns="config.columns"
        :table-data="config.tableData"
        class="table_wrap"
        :header-cell-style="{
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#333',
          'font-weight': 700,
          'letter-spacing': '1px',
          'border-radius': '4px'
        }"
        :class="{ 'el-table-null': !config.tableData.length }"
        :current-page="search.currentPage"
        :page-sizes="search.pageSizes"
        :page-size="search.pageSize"
        :total="search.total"
        show-summary
        :summary-method="getSummaries"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @sort-change="handleSortChange"
      >
        <template v-for="(item) in config.columns" :slot="item.prop + '-header'">
          <MTips :key="item.prop" :text="item.label" :tips="item.tipsFn ? item.tipsFn(attendClassTime) : item.tips" align="center" />
        </template>
        <template v-for="(item) in config.columns" :slot="item.prop" slot-scope="{ row }">
          <div :key="item.prop">
            <template v-if="item.dataType === 'Rate'">{{ row[item.prop] | renderRate }}%</template>
            <template v-else-if="item.dataType === 'Number'">{{ row[item.prop] || 0 }}</template>
            <template v-else-if="item.dataType === 'Money'">{{ row[item.prop] | filtersMoneyByZero }}</template>
            <template v-else>{{ row[item.prop] || '' }}</template>
          </div>
        </template>
      </MPageLayout>
    </div>
  </div>
</template>

<script>
import { getColumns, slotArr } from './columns'
import { filtersMoneyByZero } from '@/filters'
import { getOptionsValueByKey } from '@/filters/index.js'
import { liveRoomDataBoard } from '@/api/liveRoom/kanban.js'
import { deptTree } from '@/api/addressBookApi'
// import CustomTabelHeader from './CustomTabelHeader.vue'
import { mapState } from 'vuex'
import BigNumber from 'bignumber.js'
export default {
  filters: {
    renderTearch(val) {
      if (!val || val.length === 0) return ''
      return val.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next.userName}`)
        return pre
      }, '')
    },
    renderRate(val) {
      if (!val) return 0
      return val.toFixed(2).toString().replace(/(\.00)$/, '')
    }
  },
  components: {
    // CustomTabelHeader
  },
  data() {
    return {
      slotArr: slotArr,
      loading: false,
      search: {
        orderBy: '', // 排序字段
        isAsc: false, // 是否升序
        deptId: '', // 所属部门
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dataRowCount: {
        newClueCount: 0, // 新量线索量
        clueNum: 0, // 线索量合计
        addWechatNum: 0, // 加微数合计
        addWechatRate: 0, // 加微率合计
        signUpNum: 0, // 报名人数合计
        attendPeopleNum: 0, // 到课人数合计
        attendPeopleRate: 0, // 到课率合计
        orderNum: 0, // 转化订单数合计
        attendPeopleOrderRate: 0, // 到课转化率合计
        clueOrderRate: 0, // 线索转化率合计
        gmv: 0, // 转化GMV合计
        totalRplCount: 0, // Rpl合计
        singleClueOutput: ''// 单条线索产出合计
      },
      config: {
        columns: getColumns.call(this),
        tableData: []
      },
      deptTreeArray: []
    }
  },
  computed: {
    ...mapState({
      attendClassTime: state => state.liveSetting.attendClassTime
    })
  },
  async created() {
    // const res = localStorage.getItem('tableColumns_liveData5')
    // if (res) {
    //   this.config.columns = JSON.parse(res)
    // }
    this.loadTreeData()
    await this.$store.dispatch('liveSetting/getLiveRoomOrgConfig')
    this.getList()
  },
  methods: {
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    // 金额处理：分转元 并添加，分割，以及取小数点后两位
    filtersMoney(money, flag = true) {
      const str = flag ? parseFloat(BigNumber(Math.abs(+money || 0)).div(100)) : parseFloat(BigNumber(Math.abs(+money || 0)))
      return parseFloat(str)
        .toFixed(2)
        .toString()
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})/g, '$1,')
        .replace(/\,$/, '')
        .split('')
        .reverse()
        .join('').replace(/(\.00)$/, '')
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else if (index === 1) {
          sums[index] = ''
          return
        } else {
          const dataType = getOptionsValueByKey('prop', 'dataType', column.property, this.config.columns)
          const sumProp = getOptionsValueByKey('prop', 'sumProp', column.property, this.config.columns)
          if (dataType === 'Number') {
            sums[index] = this.dataRowCount[sumProp] || 0
          } else if (dataType === 'Rate') {
            sums[index] = this.dataRowCount[sumProp] ? this.dataRowCount[sumProp] + '%' : '0%'
          } else if (dataType === 'Money') {
            sums[index] = filtersMoneyByZero(this.dataRowCount[sumProp]) || 0
          } else {
            sums[index] = this.dataRowCount[sumProp] || ''
          }
        }
        // console.log(column, 'column')
        // if ([3, 9, 17, 13, 14].includes(index)) {
        //   sums[index] = this.dataRowCount[obj[index]] ? (this.dataRowCount[obj[index]] || 0) + '%' : 0
        //   return
        // }
        // if ([16, 15, 18].includes(index)) {
        //   sums[index] = this.dataRowCount[obj[index]] ? filtersMoneyByZero(this.dataRowCount[obj[index]]) : 0
        //   return
        // }
        // if (index > 0) {
        //   sums[index] = this.dataRowCount[obj[index]] ? this.dataRowCount[obj[index]] : 0
        //   return
        // }
        // sums[index] = obj[index]
        // return
      })

      return sums
    },
    handleSortChange(row) {
      console.log(row)
      this.search.orderBy = row.prop
      if (!row.order) {
        this.search.orderBy = ''
        this.search.isAsc = null
      } else {
        this.search.isAsc = row.order === 'ascending'
      }
      this.getList()
    },
    handleSizeChange(res) {
      this.search.pageSize = res
      this.search.currentPage = 1
      this.getList()
    },
    handleCurrentChange(res) {
      this.search.currentPage = res
      this.getList()
    },
    getList() {
      this.loading = true
      let deptId = ''
      if (this.search.deptId.length > 0) {
        deptId = this.search.deptId[this.search.deptId.length - 1]
      }
      const data = {
        deptId: deptId,
        orderBy: this.search.orderBy,
        isAsc: this.search.isAsc,
        liveRoomId: this.$route.params.id,
        pageIndex: this.search.currentPage,
        pageSize: this.search.pageSize
      }
      liveRoomDataBoard(data).then(res => {
        this.dataRowCount = {
          ...res.data
        }
        res.data.pageData.data.items.map((v, i) => {
          // v.gmv = this.filtersMoney(v.gmv)
          // v.singleClueOutput = this.filtersMoney(v.singleClueOutput)
          v.id = ((this.search.currentPage - 1) * this.search.pageSize) + i
        })
        this.config.tableData = res.data.pageData.data.items
        this.search.total = res.data.pageData.data.total
        this.$refs.table && this.$refs.table.doLayout()
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.$forceUpdate()
      })
    },
    handleCheckedTableColumnsChange(res) {
      this.loading = true
      this.config.columns = res
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.table && this.$refs.table.doLayout()
          this.loading = false
        })
      }, 200)
    },
    searchFn() {
      this.search.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  .titleHeader {
    padding-left: 20px;
    height: 62px;
    background: #F9FBFF;
    display: flex;
    align-items: center;
    .iconText {
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }
  }
  .pageContent {
    padding: 16px 30px 34px;
    background: #fff;
    .filterTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .table_wrap {
      max-height: 600px;
    }
  }
}
::v-deep {
  .MTitle{
    .title {
      display: flex;
      align-items: center;
    }
  }
}

::v-deep {
  .tablePage .page_header {
    padding: 0;
    min-height: 0;
  }
  .my-table {
    margin: 0;
    padding: 0;
  }
  .tips {
    .tipsText {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bolder;
      color: #2C3242;
      // line-height: 12px;
    }
    .iconText {
      margin-left: 2px;
      width: 12px;
      height: 12px;
    }
  }
  .el-table__body-wrapper.is-scrolling-none {
    height: auto!important;
  }
  .el-table__body-wrapper.is-scrolling-left {
    height: auto!important;
  }
  .el-table__body-wrapper.is-scrolling-right {
    height: auto!important;
  }
  .el-table {
    .el-table__body-wrapper{
      z-index: 2
    }
  }
}
.expandTable {
  background: #F5F5F5;
  padding: 11px;
}
::v-deep {
  .el-table__header-wrapper .cell > span > div {
    display: inline-block;
  }
  .el-table__fixed-body-wrapper {
    background: #fff;
  }
  .expandTable .el-table__footer-wrapper .el-table__cell{
    background: #fff;
    font-size: 12px;
    font-weight: bolder;
    color: #2C3242;
    // line-height: 17px;
  }
  .el-table__fixed-footer-wrapper tbody td.el-table__cell {
    border-top: none;
    padding-top: 0;
  }
  .is-leaf.el-table__cell {
    border-bottom: 1px solid transparent;
  }
  .el-table__footer-wrapper td.el-table__cell {
    border-top: 1px solid transparent;
  }
  .el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell {
    border-bottom: none;
  }
  .el-table th.el-table__cell > .cell {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bolder;
    color: #2C3242;
    line-height: 34px;
  }
  // .el-table__fixed-header-wrapper thead > tr > th:nth-child(1),th:nth-child(2){
  //   .cell {
  //     margin-top: -28px;
  //   }
  // }
}
.pagination {
  padding-top: 23px;
  padding-bottom: 6px;
  text-align: right;
}
</style>
