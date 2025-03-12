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
        :key="1"
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
        :key="2"
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
        :key="3"
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
  </div>
</template>

<script>
import { toThousandFilter } from '@/filters/index'
import {
  getTaskClueStat,
  getTaskClueStatTotal,
  getTaskClueBizOfficialStatCollect,
  getTaskClueBizOfficialStatTotalCollect
} from '@/api/privateArea/CRM'
import detailDrawer from './detailDrawer'
const drawerParams = {
  clueNum: {},
  addQwNum: { isAddQw: 1 },
  addGwNum: { isAddGw: 1 },
  addWxNum: { isAddWx: 1 },
  newUserOfferNum: { type: 2 },
  existsOfferNum: { type: 1 },
  allOfferNum: { type: 3 },
  followerNum: { isSubscribe: 1 }
}
export default {
  name: 'BeforeClassTable',
  components: {
    detailDrawer
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      form: {},
      loading: false,
      tableData: [],
      orderByParam: '', // 排序属性： 1分配线索数，2添加企微数，3添加个微数，4添加微信数
      orderByWay: '', // 排序方式:0倒序 1升序
      taskClueStatCollect: {
        addGwNum: 0, // 	添加个微数
        addQwNum: 0, // 添加企微数
        addWxNum: 0, // 添加微信数
        addWxRatio: 0, // 	加微率
        clueNum: 0, // 分配线索数
        followUserId: '', // 	员工用户ID
        followUserName: ''
      },
      column1: [], // 跟进人 分配线索
      column2: [], // 加微阶段
      column3: [], // 公众号
      params: {}

    }
  },
  mounted() {
    this.taskId = this.$route.query.taskId
    // this.getList()
  },
  methods: {
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
        userName: undefined,
        liveId: undefined
      }
      getTaskClueStat({
        ...params,
        ...data
      })
        .then(async(res) => {
          this.total = res.data.total
          const tableData = res.data.items
          tableData.forEach(v => {
            v.addGwNum = toThousandFilter(v.addGwNum)
            v.addQwNum = toThousandFilter(v.addQwNum)
            v.addWxNum = toThousandFilter(v.addWxNum)
            v.addWxRatio = (v.addWxRatio * 100).toFixed(2) + '%'
            v.clueNum = toThousandFilter(v.clueNum)
            v.newUserOfferRatio = (v.newUserOfferRatio * 100).toFixed(2) + '%'
          })
          const sysUserIds = tableData.map(i => i.followUserId)
          try {
            // this.getTotal(params)
            const resData = await getTaskClueBizOfficialStatCollect({
              taskId: this.taskId,
              sysUserIds
            })
            const tableList = []
            resData.data.forEach(i => {
              tableData.forEach(j => {
                if (i.followUserId === j.followUserId) {
                  tableList.push({
                    ...j,
                    ...i,
                    followerRatio: this.getRatio(i.followerNum, j.clueNum)
                  })
                }
              })
            })
            this.tableData = tableList
            this.$nextTick(() => {
              this.$refs.table && this.$refs.table.doLayout()
            })
            this.loading = false
          } catch (e) {
            this.loading = false
          }
        }).catch(() => {
          this.loading = false
        })
    },
    setColumnList(items) {
      this.column1 = []
      this.column2 = []
      this.column3 = []
      if (!items.length) return
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
      })
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.doLayout()
      })
    },
    getTotal(data) {
      const params = {
        taskId: this.taskId,
        ...data,
        liveId: undefined,
        userName: undefined,
        sysUserId: undefined
      }
      Promise.all([
        getTaskClueStatTotal(params),
        getTaskClueBizOfficialStatTotalCollect(params)
      ])
        .then((res) => {
          const data1 = res[0]?.data ?? {}
          const data2 = res[1]?.data ?? {}
          this.taskClueStatCollect = {
            addGwNum: toThousandFilter(data1.addGwNum),
            addQwNum: toThousandFilter(data1.addQwNum),
            addWxNum: toThousandFilter(data1.addWxNum),
            addWxRatio: (data1.addWxRatio * 100).toFixed(2) + '%',
            clueNum: toThousandFilter(data1.clueNum),
            followerNum: data2.followerNum,
            followerRatio: this.getRatio(data2.followerNum / data1.clueNum),
            newUserOfferNum: data1.newUserOfferNum,
            newUserOfferRatio: (data1.newUserOfferRatio * 100).toFixed(2) + '%',
            existsOfferNum: data1.existsOfferNum,
            allOfferNum: data1.allOfferNum,
            followUserId: '',
            followUserName: ''
          }
          this.$nextTick(() => {
            const table = document.querySelector('.el-table__footer-wrapper>table')
            if (table.rows && table.rows[0]) {
              table.rows[0].cells.forEach((i, index) => {
                const children = i?.children[0]
                const innerText = children?.innerText ?? 0
                if (innerText > 0) {
                  children.style.color = '#0C6FFF'
                  children.style.cursor = 'pointer'
                  i.onclick = () => { this.getClick(index) }
                }
              })
            }
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
        10: 'followerNum'
      }
      const arr = Object.keys(params)
      if (arr.includes(index + '')) {
        return this.handleShowDrawer({}, params[index + ''])
      }
    },
    getRatio(num, num1) {
      if (!num1) {
        return '0%'
      }
      const val = (num / num1) || 0
      return (val * 100).toFixed(2) + '%'
    },
    handleShowDrawer(row, key) {
      const params = drawerParams[key] ?? {}
      this.$refs.detailDrawer.open(row, { ...params, ...this.params, liveId: undefined })
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
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const arr = [
          '',
          'clueNum',
          'addQwNum',
          'addGwNum',
          'addWxNum',
          'addWxRatio',
          'newUserOfferNum',
          'newUserOfferRatio',
          'existsOfferNum',
          'allOfferNum',
          'followerNum',
          'followerRatio'
        ]
        sums[index] = this.taskClueStatCollect[arr[index]]
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container ::v-deep{
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
  .el-table__body-wrapper.is-scrolling-left{
    min-height: 436px !important;
  }
}
</style>
