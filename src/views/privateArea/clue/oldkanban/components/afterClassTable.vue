<template>
  <div class="table-container">
    <!-- :summary-method="getSummaries"
      show-summary -->
    <el-table
      ref="table"
      v-loading="loading"
      height="100%"
      :header-cell-style="{ background: '#F2F9FF' }"
      class="drawerContentTable"

      :data="tableData"
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="followUserName"
        label="跟进人"
        width="100"
        align="center"
      />
      <template v-for="item in column1">
        <el-table-column
          v-if="item.visible"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable"
          align="center"
        >
          <template slot-scope="{row}">
            <!-- <el-button
              v-if="row[item.key] > 0 && item.isClick"
              type="text"
              @click="handleShowDrawer(row, item.key)"
            >{{ row[item.key] }}</el-button>
            <span v-else> {{ row[item.key] }}</span> -->
            <span> {{ row[item.key] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-show="column2.length"
        prop="date"
        label="加微阶段"
        align="center"
      >
        <template v-for="item in column2">
          <el-table-column
            v-if="item.visible"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            :width="item.width"
            :sortable="item.sortable"
            align="center"
          >
            <template slot-scope="{row}">
              <!-- <el-button
                v-if="row[item.key] > 0 && item.isClick"
                type="text"
                @click="handleShowDrawer(row, item.key)"
              >{{ row[item.key] }}</el-button>
              <span v-else> {{ row[item.key] }}</span> -->
              <span> {{ row[item.key] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
      <el-table-column
        v-show="column3.length"
        prop="official"
        label="公众号"
        align="center"
      >
        <template v-for="item in column3">
          <el-table-column
            v-if="item.visible"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            :width="item.width"
            align="center"
          >
            <template slot-scope="{row}">
              <!-- <el-button
                v-if="row[item.key] > 0 && item.isClick"
                type="text"
                @click="handleShowDrawer(row, item.key)"
              >{{ row[item.key] }}</el-button>
              <span v-else> {{ row[item.key] }}</span> -->
              <span> {{ row[item.key] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
      <el-table-column
        v-show="column4.length"
        prop="live1"
        label="任务汇总"
        align="center"
      >
        <template v-for="item in column4">
          <el-table-column
            v-if="item.visible"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            :width="item.width"
            align="center"
          >
            <template slot-scope="{row}">
              <!-- <el-button
                v-if="row[item.key] > 0 && item.isClick"
                type="text"
                @click="handleShowDrawer(row, item.key)"
              >{{ row[item.key] }}</el-button>
              <el-button
                v-else-if="row[item.key] > 0 && item.isOrderClick"
                type="text"
                @click="handleShowOrderDrawer(row, item.key)"
              >{{ row[item.key] }}</el-button>
              <span v-else> {{ row[item.key] }}</span> -->
              <span> {{ row[item.key] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <div class="ss-material-box-footer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <detailDrawer ref="detailDrawer" />
    <detailOrderDrawer ref="detailOrderDrawer" />
  </div>
</template>

<script>
import { toThousandFilter } from '@/filters/index'
import {
  getTaskClueStat,
  getTaskClueLiveStatCollect2,
  getTaskClueLiveStatCollect,
  getTaskClueStatTotal,
  getTaskClueLiveStatTotalCollect,
  getTaskClueLiveStatTotalCollect2,
  getTaskClueBizOfficialStatCollect
} from '@/api/privateArea/CRM'
import detailDrawer from './detailDrawer'
import detailOrderDrawer from './detailOrderDrawer'
const drawerParams = {
  clueNum: {},
  addQwNum: { isAddQw: 1 },
  addGwNum: { isAddGw: 1 },
  addWxNum: { isAddWx: 1 },
  newUserOfferNum: { type: 2 },
  existsOfferNum: { type: 1 },
  allOfferNum: { type: 3 },
  newUserClassNum: { type: 4 },
  existsClassNum: { type: 5 },
  userClassNum: { type: 6 },
  newUserClassDoneNum: { type: 7 },
  existsClassDoneNum: { type: 8 },
  newUserInvertNum: { type: 10 },
  existsUserInvertNum: { type: 11 },
  userInvertNum: { type: 12 },
  followerNum: { isSubscribe: 1 }
}
const drawerOrderParams = {
  newUserOrderInvertNum: { type: 1 },
  newUserOrderInvertPrice: { type: 4 },
  existsUserOrderInvertNum: { type: 2 },
  existsUserOrderInvertPrice: { type: 5 },
  userInvertOrderNum: { type: 3 },
  userOrderInvertPrice: { type: 6 }
}
export default {
  name: 'InClassTable',
  components: {
    detailDrawer,
    detailOrderDrawer
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      orderByParam: '', // 排序属性： 1分配线索数，2添加企微数，3添加个微数，4添加微信数
      orderByWay: '', // 排序方式:0倒序 1升序
      taskClueStatCollect: {

      },
      loading: false,
      params: {},
      column1: [], // 跟进人 分配线索
      column2: [], // 加微阶段
      column3: [], // 公众号
      column4: [] // 直播间
    }
  },
  mounted() {
    this.taskId = this.$route.query.taskId
    // this.getList()
  },
  methods: {
    handleShowDrawer(row, key) {
      console.log(row, key)
      const params = drawerParams[key] ?? {}
      this.$refs.detailDrawer.open(row, params)
    },
    handleShowOrderDrawer(row, key) {
      console.log(row, key)
      const params = drawerOrderParams[key] ?? {}
      this.$refs.detailOrderDrawer.open(row, { ...params, ...this.params })
    },
    getList(params = {}) {
      this.loading = true
      this.tableData = []
      this.params = params
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        orderByParam: this.orderByParam,
        orderByWay: this.orderByWay,
        taskId: this.taskId,
        ...params,
        userName: undefined,
        liveId: undefined
      }
      getTaskClueStat(data)
        .then(async(res) => {
          this.total = res.data.total
          const tableData = res.data.items
          const sysUserIds = tableData.map(i => i.followUserId)
          const current = {
            taskId: this.taskId,
            sysUserIds
          }
          // this.getTotal(params)
          this.getTableData(current, tableData)
        }).catch(() => {
          this.loading = false
        })
    },
    getTableData(params, tableData) {
      Promise.all([
        getTaskClueLiveStatCollect({
          ...params,
          inClass: false
        }),
        getTaskClueLiveStatCollect2({
          ...params,
          inClass: false
        }),
        getTaskClueBizOfficialStatCollect({
          ...params,
          liveId: undefined
        })
      ]).then(res => {
        const liveData2 = res[0]?.data?.map(i => {
          return {
            ...i,
            followUserId: i.sysUserId
          }
        }) ?? []
        const liveData = res[1]?.data?.map(i => {
          return {
            ...i,
            followUserId: i.sysUserId
          }
        }) ?? []
        const resData = res[2]?.data
        const arr1 = this.contontArr(tableData, liveData2)
        const arr2 = this.contontArr(arr1, liveData)
        const arr3 = this.contontArr(arr2, resData)
        this.tableData = arr3.map(i => this.getCurrentData(i))
        this.$nextTick(() => {
          this.$refs.table && this.$refs.table.doLayout()
        })
        this.loading = false
      })
        .catch((e) => {
          this.loading = false
          console.log(e)
        })
    },
    setColumnList(items) {
      this.column1 = []
      this.column2 = []
      this.column3 = []
      this.column4 = []
      if (!items.length) return
      this.show = false
      items.forEach(i => {
        if (i.type === 'arr1') {
          this.column1.push(i)
        }
        if (i.type === 'arr2') {
          this.column2.push(i)
        }
        if (i.type === 'arr3') {
          this.column3.push(i)
        }
        if (i.type === 'arr4') {
          this.column4.push(i)
        }
      })
      this.show = true
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.doLayout()
      })
    },
    getCurrentData(i) {
      const newUserClassRatio = this.getRatio(i.newUserClassNum, i.newUserOfferNum)
      const existsClassRatio = this.getRatio(i.existsClassNum, i.existsOfferNum)
      const newUserClassDoneRatio = this.getRatio(i.newUserClassDoneNum, i.newUserClassNum)
      const existsClassDoneRatio = this.getRatio(i.existsClassDoneNum, i.existsClassNum)
      const newUserOrderInvertRatio = this.getRatio(i.newUserOrderInvertNum, i.clueNum)
      const newUserInvertRatio = this.getRatio(i.newUserInvertNum, i.clueNum)
      const clueRatio = this.getRatio(i.userInvertNum, i.clueNum)
      const addWxInvertRatio = this.getRatio(i.userInvertNum, i.addWxNum)
      const allOfferRatio = this.getRatio(i.userInvertNum, i.allOfferNum)
      const userClassRatio = this.getRatio(i.userInvertNum, i.userClassNum)
      const followerRatio = this.getRatio(i.followerNum / i.clueNum)
      const addGwNum = toThousandFilter(i.addGwNum)
      const addQwNum = toThousandFilter(i.addQwNum)
      const addWxNum = toThousandFilter(i.addWxNum)
      const clueNum = toThousandFilter(i.clueNum)
      const addWxRatio = (i.addWxRatio * 100).toFixed(2) + '%'
      const newUserOfferRatio = (i.newUserOfferRatio * 100).toFixed(2) + '%'
      const newUserOrderInvertPrice = (i.newUserOrderInvertPrice / 100).toFixed(2)
      const existsUserOrderInvertPrice = (i.existsUserOrderInvertPrice / 100).toFixed(2)
      const userOrderInvertPrice = (i.userOrderInvertPrice / 100).toFixed(2)
      return {
        ...i,
        followerRatio,
        addWxRatio,
        newUserOfferRatio,
        addGwNum,
        addQwNum,
        addWxNum,
        clueNum,
        newUserClassRatio,
        existsClassRatio,
        newUserClassDoneRatio,
        existsClassDoneRatio,
        newUserOrderInvertRatio,
        newUserInvertRatio,
        clueRatio,
        addWxInvertRatio,
        allOfferRatio,
        userClassRatio,
        newUserOrderInvertPrice,
        existsUserOrderInvertPrice,
        userOrderInvertPrice
      }
    },
    getTotal(data) {
      const params = {
        taskId: this.taskId,
        ...data,
        userName: undefined
      }
      Promise.all([
        getTaskClueStatTotal(params),
        getTaskClueLiveStatTotalCollect(params),
        getTaskClueLiveStatTotalCollect2(params)
      ])
        .then((res) => {
          const data1 = res[0]?.data ?? {}
          const data2 = res[1]?.data ?? {}
          const data3 = res[2]?.data ?? {}
          this.taskClueStatCollect = this.getCurrentData({ ...data1, ...data2, ...data3 })
          this.$nextTick(() => {
            const table = document.querySelector('.el-table__footer-wrapper>table')
            table.rows[0].cells.forEach((i, index) => {
              const children = i?.children[0]
              const innerText = children?.innerText ?? 0
              if (innerText > 0) {
                children.style.color = '#0C6FFF'
                children.style.cursor = 'pointer'
                i.onclick = () => { this.getClick(index) }
              }
            })
          })
        })
    },
    getClick(index) {
      const params = {
        1: 'clueNum',
        2: 'addQwNum',
        3: 'addGwNum',
        4: 'addWxNum',
        6: 'newUserOfferNum',
        8: 'existsOfferNum',
        9: 'allOfferNum',
        10: 'followerNum',
        12: 'newUserClassNum',
        14: 'existsClassNum',
        16: 'userClassNum',
        17: 'newUserClassDoneNum',
        19: 'existsClassDoneNum',
        21: 'newUserInvertNum',
        26: 'existsUserInvertNum',
        29: 'userInvertNum'
      }
      const orderArr = Object.keys(params)
      if (orderArr.includes(index + '')) {
        return this.handleShowDrawer({}, index + '')
      }
      const orderParams = {
        23: 'newUserOrderInvertNum',
        25: 'newUserOrderInvertPrice',
        27: 'existsUserOrderInvertNum',
        28: 'existsUserOrderInvertPrice',
        30: 'userInvertOrderNum',
        31: 'userOrderInvertPrice'
      }
      const arr = Object.keys(orderParams)
      if (arr.includes(index + '')) {
        return this.handleShowOrderDrawer({}, index + '')
      }
    },
    getRatio(num, num1) {
      if (!num1) {
        return '0%'
      }
      const val = (num / num1) || 0
      return (val * 100).toFixed(2) + '%'
    },
    contontArr(arr1, arr2) {
      const arr = []
      arr1.forEach(i => {
        arr2.forEach(j => {
          if (i.followUserId === j.followUserId) {
            const current = {
              ...i,
              ...j
            }
            arr.push(current)
          }
        })
      })
      return arr
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    sortChange(val) {
      console.log('排序改变触发', val)
      let orderByWay = ''
      if (val.order === 'descending') {
        orderByWay = 0
      } else if (val.order === 'ascending') {
        orderByWay = 1
      }
      const OBJ = { clueNum: 1, addQwNum: 2, addGwNum: 3, addWxNum: 4 }
      this.orderByWay = orderByWay
      this.orderByParam = OBJ[val.prop] || ''
      this.getList()
    },
    getSummaries(param) {
      // const { columns } = param
      const sums = []
      // columns.forEach((column, index) => {
      //   if (index === 0) {
      //     sums[index] = '合计'
      //     return
      //   }
      //   const arr = [
      //     '',
      //     'clueNum',
      //     'addQwNum',
      //     'addGwNum',
      //     'addWxNum',
      //     'addWxRatio',
      //     'newUserOfferNum',
      //     'newUserOfferRatio',
      //     'existsOfferNum',
      //     'allOfferNum',
      //     'followerNum',
      //     'followerRatio',
      //     'newUserClassNum',
      //     'newUserClassRatio',
      //     'existsClassNum',
      //     'existsClassRatio',
      //     'userClassNum',
      //     'newUserClassDoneNum',
      //     'newUserClassDoneRatio',
      //     'existsClassDoneNum',
      //     'existsClassDoneRatio',
      //     'newUserInvertNum',
      //     'newUserInvertRatio',
      //     'newUserOrderInvertNum',
      //     'newUserOrderInvertRatio',
      //     'newUserOrderInvertPrice',
      //     'existsUserInvertNum',
      //     'existsUserOrderInvertNum',
      //     'existsUserOrderInvertPrice',
      //     'userInvertNum',
      //     'userInvertOrderNum',
      //     'userOrderInvertPrice',
      //     'clueRatio',
      //     'addWxInvertRatio',
      //     'allOfferRatio',
      //     'userClassRatio'
      //   ]
      //   sums[index] = this.taskClueStatCollect[arr[index]]
      // })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
    height: 100%;
    overflow: hidden;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    .ss-material-box-footer {
        height: 68px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 20px;
    }
}
</style>
