<template>
  <!-- 学员详情弹框 -->
  <el-drawer
    :size="800"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div v-loading="loading" class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">
          <span>任务名称：{{ taskName }}</span>
        </div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent overflowOuto">
        <div class="myTable">
          <el-table ref="table" height="100%" :header-cell-style="{ background: '#F2F9FF' }" class="drawerContentTable" :summary-method="getSummaries" show-summary :data="tableData" style="width: 100%" @sort-change="sortChange">
            <el-table-column prop="followUserName" label="跟进人" width="110" align="center" />
            <el-table-column prop="clueNum" label="分配线索数" width="132" align="center" sortable="custom" />
            <el-table-column prop="date" label="业绩组成" align="center">
              <el-table-column prop="addQwNum" label="添加企微数" width="132" align="center" sortable="custom" />
              <el-table-column prop="addGwNum" label="添加个微数" width="133" align="center" sortable="custom" />
              <el-table-column prop="addWxNum" label="添加微信数" width="131" align="center" sortable="custom" />
              <el-table-column prop="addWxRatio" label="加微率" align="center" />
            </el-table-column>
          </el-table>
        </div>
      </div>
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
    </div>
  </el-drawer>
</template>

<script>
import { toThousandFilter } from '@/filters/index'
import { getTaskClueStat, getTaskClueStatCollect } from '@/api/privateArea/CRM'
export default {
  components: {},
  filters: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: [Number, String],
      default: ''
    },
    taskName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
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
      }
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visible(val) {
      val && this.init()
    }
  },
  mounted() {},
  methods: {
    // 点击关闭
    close() {
      this.$emit('update:visible', false)
    },
    init() {
      this.currentPage = 1
      this.getList()
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
    getList() {
      this.loading = true
      this.tableData = []
      const data = {
        pageIndex: 1,
        pageSize: 10,
        orderByParam: this.orderByParam,
        orderByWay: this.orderByWay,
        taskId: this.taskId
      }
      Promise.all([
        getTaskClueStat(data),
        getTaskClueStatCollect(data)
      ]).then(res => {
        this.taskClueStatCollect = {
          addGwNum: toThousandFilter(res[1].data.addGwNum),
          addQwNum: toThousandFilter(res[1].data.addQwNum),
          addWxNum: toThousandFilter(res[1].data.addWxNum),
          addWxRatio: (res[1].data.addWxRatio * 100).toFixed(2) + '%',
          clueNum: toThousandFilter(res[1].data.clueNum),
          followUserId: '',
          followUserName: ''
        }
        this.total = res[0].data.total
        res[0].data.items.map(v => {
          v.addGwNum = toThousandFilter(v.addGwNum)
          v.addQwNum = toThousandFilter(v.addQwNum)
          v.addWxNum = toThousandFilter(v.addWxNum)
          v.addWxRatio = (v.addWxRatio * 100).toFixed(2) + '%'
          v.clueNum = toThousandFilter(v.clueNum)
        })
        this.tableData = res[0].data.items
        this.$nextTick(() => {
          this.$refs.table && this.$refs.table.doLayout()
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const arr = ['', 'clueNum', 'addQwNum', 'addGwNum', 'addWxNum', 'addWxRatio']
        sums[index] = this.taskClueStatCollect[arr[index]]
      })
      return sums
    }
  }
}
</script>

<style lang='scss' scoped>
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #FFFFFF;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      display: flex;
      align-items: center;
      justify-content: center;
        .title-btn {
            width: 68px;
            height: 20px;
            background: #E7F0FF;
            border-radius: 2px;
            line-height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #0C6FFF;
            line-height: 17px;
            margin-left: 16px;
            cursor: pointer;
        }
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .drawerContent {
    flex: 1 0 0;
    padding: 20px;
    box-sizing: border-box;
    .myTable {
      height: 100%;
      overflow: hidden;
      border-radius: 6px;
    }
  }
  .ss-material-box-footer {
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
  }
}
::v-deep {
  .el-table__header-wrapper tbody td.el-table__cell, .el-table__footer-wrapper tbody td.el-table__cell {
    background: #F2F9FF;
  }
}
</style>
