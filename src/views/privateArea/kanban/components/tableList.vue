<template>
  <div class="tableList">
    <div class="titleSearchBox">
      <span>跟进人数据汇总</span>
      <el-select
        v-if="type !== 'my'"
        v-model="form.followUserId"
        filterable
        remote
        clearable
        reserve-keyword
        style="font-weight: 400"
        placeholder="请输入姓名"
        :remote-method="getSelectListTeacher"
        :loading="selectLoading"
      >
        <el-option
          v-for="item in options"
          :key="item.userId"
          :label="item.nickName"
          :value="item.userId"
        />
      </el-select>
      <el-button
        v-if="type !== 'my'"
        style="margin-left: 10px"
        type="primary"
        @click="handleSumit"
      >查询</el-button>
    </div>
    <div class="tableBox">
      <MPageLayout
        ref="MPageLayout"
        class="content"
        :keys="`private_area_kb_${type}_${search.type}`"
        style="height: 400px"
        :slot-arr="slotArr"
        :current-page="config.pageIndex"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="config.tableData"
        :table-columns="newColumns"
        :loading="loading"
        :row-class-name="tableRowClassName"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @sort-change="sortChange"
        @current-change="handleCurrentChange"
      >
        <template slot="clueNum" slot-scope="{ row}">
          <!-- 企微标签 -->
          <div
            :style="{'color': row.followDeptName !== '合计'? '#065cff':'', 'cursor': 'pointer !important'}"
            @click="handleClue(row)"
          >
            {{ row.clueNum }}
          </div>
        </template>
      </MPageLayout>
    </div>
  </div>
</template>

<script>
import { getSelectTeacherList } from '@/api/privateArea/kanban'
import { getColumns, getColumnsOne } from './tableColumns'
import { getUserClueStat, getClueStatPayPage } from '@/api/privateArea/kanban'
import { mapActions } from 'vuex'
const searchTypeMap = {
  all: 3,
  my: 1,
  department: 2
}
export default {
  props: {
    tabType: {
      type: Number,
      default: 0
    },
    listData: {
      type: Array,
      default: () => {
        return []
      }
    },
    search: {
      type: Object,
      default: () => {
        return {
          type: 0,
          searchType: 3,
          time: { active: 7, time: ['', ''], type: undefined },
          clueType: 1, // 线索管理
          channelId: '', // 渠道ID
          deptIdChain: [], // 跟进人部门链
          teacherId: '',
          teacherName: '',
          paramType: 1
        }
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    slotArr: [
      'clueNum',
      'outBoundNum',
      'manualOutBoundNum',
      'sendSmsNum',
      'manualAddQwNum',
      'addWxNum',
      'sumAddQwNum',
      'addGwNum',
      'addInvitationsNum',
      'coursesNum',
      'convertedOrdersNum',
      'conversionAmount',
      'refundAmount',
      'revenueAmount',
      'yxtAddQwNum',
      'addQwNum'
    ],
    loading: false,
    config: {
      tableData: [],
      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      pageIndex: 1,
      total: 0
    },

    form: {
      followUserId: ''
    },
    selectLoading: false,
    options: []
  }),
  computed: {
    newColumns() {
      return this.search.type ? getColumnsOne : getColumns
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === this.config.tableData?.length - 1) {
        return 'bottomRow'
      }
    },
    ...mapActions('user', ['setSingleHistory']),
    init() {
      this.form = { followUserId: '', sort: '', column: '' }
      this.config.pageIndex = 1
      this.getUserClueList()
    },
    // 员工加微统计
    getUserClueList() {
      this.loading = true
      const data = {
        searchType: this.search.searchType,
        channelId: this.search.channelId,
        clueType: this.search?.clueType, // 线索类型:1-订单、2线下表格
        followDeptId: this.search?.followDeptId,
        endTime: this.search.time.time[1],
        startTime: this.search.time.time[0],
        type: this.search.time?.type,
        teacherId: this.search.teacherId,
        pageIndex: this.config.pageIndex,
        pageSize: this.config.pageSize,
        ...this.form
      }
      let query = getUserClueStat
      if (this.search.type === 1) {
        query = getClueStatPayPage
      }
      query(data)
        .then(res => {
          if (res.code === 1) {
            this.config.tableData = res.data.items
            this.config.total = res.data.total
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleClue(row) {
      if (row.followDeptName === '合计') return
      const params = {
        followUserId: row.followUserId,
        createTime: [this.search.time.time[0], this.search.time.time[1]],
        channelId: this.search.channelId,
        teacherId: this.search.teacherId,
        clueType: this.search.clueType
      }
      this.setSingleHistory('/privateArea/clue')
      this.$router.replace({ name: 'clueAll', params })
    },
    handleSumit() {
      this.config.pageIndex = 1
      this.getUserClueList()
    },
    async getSelectListTeacher(name) {
      this.selectLoading = true
      try {
        const res = await getSelectTeacherList({
          name,
          searchType: searchTypeMap[this.type]
        })
        this.options = res?.data || []
        this.selectLoading = false
      } catch {
        this.selectLoading = false
      }
    },
    initNum(num) {
      return `${(num / 100 || 0).toFixed(2)}`
    },
    sortChange(val) {
      let sort = ''
      if (val.order === 'descending') {
        sort = 'DESC'
      } else if (val.order === 'ascending') {
        sort = 'ASC'
      }
      this.form = { ...this.form, sort, column: val.prop || '' }
      this.getUserClueList()
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.pageIndex = 1
      this.getUserClueList()
    },
    handleCurrentChange(val) {
      this.config.pageIndex = val
      this.getUserClueList()
    }
  }
}
</script>

<style lang="scss" scoped>
.titleSearchBox {
  background: #ffffff;
  border-radius: 10px;
  padding: 15px 0;
  padding-left: 20px;
  > span {
    font-weight: bold;
    margin-right: 10px;
  }
}
.tableList {
  margin-top: 20px !important;
}
.tableListBorder {
  height: 400px;
  border-radius: 6px;
  overflow: hidden;
}
.tableBox::v-deep {
  margin-top: 20px;
  padding: 20px 0;
  padding-top: 0;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  .my-table {
    margin-right: 30px !important;
    .el-table__body-wrapper {
      &::-webkit-scrollbar {
        height: 12px;
      }
    }
  }
  .bottomRow {
    background: #eff2f6 !important;
  }
  .page_content {
    overflow: hidden !important;
  }
  .page_footer {
    justify-content: flex-end !important;
  }
  .customHeader {
    right: -25px !important;
    top: 0 !important;
  }
}
.paginationBox {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
