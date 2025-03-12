<template>
  <div class="pageWrap">
    <MCard>
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
        layout="total, sizes, prev, pager, next, jumper"
        @sort-change="sortChange"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
      >
        <template slot="search">
          <filterTop
            ref="filterTop"
            :statistics-loading="statisticsLoading"
            :loading="loading"
            :columns="config.tableColumns"
            :search="search"
            @searchChange="searchChange"
            @searchFn="searchFn"
            @clear="clearFn"
            @change="handleCheckedTableColumnsChange"
          />
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-button type="text" @click="gotoDetail(row)">详情</el-button>
          <el-button
            v-if="row.ecsStatus === 1"
            :loading="row.closeLoading"
            type="text"
            @click="onhandleClickShutdown(row)"
          >关机</el-button>
          <el-button
            v-if="row.ecsStatus !== 3"
            :loading="row.releaseLoading"
            type="text"
            class="c_F53F3F"
            @click="onhandleClickRelease(row)"
          >释放</el-button>
        </template>
        <template slot="ecsUserName" slot-scope="{ row }">
          <span v-if="row.userEscId !== mouseRowId">{{ row.ecsUserName }}</span>
          <AppIconClipboard v-else :src="row.ecsUserName">
            {{ row.ecsUserName }}
          </AppIconClipboard>
        </template>
        <template slot="eip" slot-scope="{ row }">
          <span v-if="row.userEscId !== mouseRowId">{{ row.eip }}</span>
          <AppIconClipboard v-else :src="row.eip">
            {{ row.eip }}
          </AppIconClipboard>
        </template>
        <template slot="ecsPassword" slot-scope="{ row }">
          <span v-if="row.userEscId !== mouseRowId || row.showPassword">{{
            row.showPassword ? row.ecsPassword : '******'
          }}</span>
          <watchPhoneNumber
            v-else
            :key="row.eip"
            :default-value="row.ecsPassword"
            :reg-type="1"
            @success="watchPhoneNumberFn(row)"
          />
        </template>
        <template slot="ecsStatus" slot-scope="{ row }">
          <div :class="`ecsStatus${row.ecsStatus}`">
            {{ { 1: '已开机', 2: '已关机', 3: '已释放' }[row.ecsStatus] }}
          </div>
        </template>
        <template slot="phoneNumber" slot-scope="{ row }">
          <span v-if="row.userEscId !== mouseRowId">{{ row.phoneNumber }}</span>
          <AppIconClipboard v-else :src="row.phoneNumber">
            {{ row.phoneNumber }}
          </AppIconClipboard>
        </template>
      </MPageLayout>
    </MCard>
  </div>
</template>

<script>
import { getColumns } from './columns.js'
import {
  getCloudPcPage,
  cloudPcStatistics,
  manageCloudPcOperation
} from '@/api/videoManagement/cloudDesktop'
import filterTop from './filterTop.vue'
import AppIconClipboard from '@/components/AppIconClipboard'
import watchPhoneNumber from '@/components/watchPhoneNumber'
export default {
  components: {
    filterTop,
    AppIconClipboard,
    watchPhoneNumber
  },
  data() {
    return {
      slotArr: [
        'action',
        'search',
        'footer',
        'ecsUserName',
        'ecsPassword',
        'ecsStatus',
        'eip',
        'phoneNumber'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      // 筛选栏对象
      search: {
        user: { label: 'userPhone', value: '' },
        ecsStatus: '',
        userIds: [],
        staffStatus: '',
        numSort: '', // 次数排序
        timeSort: '' // 时长排序
      },
      statisticsLoading: false,
      mouseRowId: '', // 鼠标移入的id
    }
  },
  mounted() {
    this.searchFn() 
  },
  activated() {
  },
  methods: {
    // 排序触发改变
    sortChange({ column, prop, order }) {
      if (prop === 'useTime') {
        this.search.numSort = ''
        if (order === 'ascending') {
          this.search.timeSort = 1
        } else if (order === 'descending') {
          this.search.timeSort = 2
        } else {
          this.search.timeSort = ''
        }
      }
      if (prop === 'useCount') {
        this.search.timeSort = ''
        if (order === 'ascending') {
          this.search.numSort = 1
        } else if (order === 'descending') {
          this.search.numSort = 2
        } else {
          this.search.numSort = ''
        }
      }
      console.log(prop, order)
      // console.log(this.search)
      this.getList()
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
      this.getCloudPcStatistics()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
      this.getCloudPcStatistics()
    },
    // 获取列表数据
    getList() {
      console.log(this.search)
      this.loading = true
      let type
      if (!this.search.user.value) {
        type = null
      } else {
        type = this.search.user.label === 'userPhone' ? 1 : 2
      }
      const params = {
        ecsStatus: this.search.ecsStatus,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        content: this.search.user.value,
        timeSort: this.search.timeSort,
        numSort: this.search.numSort,
        staffStatus:
          this.search.staffStatus.length === 0 ? null : this.search.staffStatus,
        type
      }
      getCloudPcPage(params)
        .then(res => {
          console.log(res, '获取列表数据')
          res.data.items.forEach(element => {
            element.closeLoading = false
            element.releaseLoading = false
            element.showPassword = false
          })
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
      this.getCloudPcStatistics()
    },
    clearFn() {
      const arrElm = document.getElementsByClassName(
        'el-table__cell descending'
      )
      arrElm.forEach(element => {
        element.classList.remove('descending')
      })
      const arrElm2 = document.getElementsByClassName(
        'el-table__cell ascending'
      )
      arrElm2.forEach(element => {
        element.classList.remove('ascending')
      })
      this.search = {
        user: { label: 'userPhone', value: '' },
        ecsStatus: '',
        userIds: [],
        staffStatus: '',
        numSort: '', // 次数排序
        timeSort: '' // 时长排序
      }
      this.searchFn()
    },
    // 获取统计数据
    getCloudPcStatistics() {
      this.statisticsLoading = true
      cloudPcStatistics()
        .then(res => {
          this.$refs.filterTop.setStatistics(
            'releaseCount',
            res.data.releaseCount
          )
          this.$refs.filterTop.setStatistics('startCount', res.data.startCount)
          this.$refs.filterTop.setStatistics('stopCount', res.data.stopCount)
          this.$refs.filterTop.setStatistics('totalCount', res.data.totalCount)
          this.statisticsLoading = false
        })
        .catch(err => {
          this.statisticsLoading = false
          console.log(err)
        })
    },
    searchChange(value) {
      this.search.userIds = value
    },
    cellMouseEnter(row, column, cell, event) {
      this.mouseRowId = row.userEscId
    },
    cellMouseLeave() {
      this.mouseRowId = ''
    },
    watchPhoneNumberFn(row) {
      console.log('123')
      console.log(row)
      row.showPassword = true
    },
    // 点击关机
    onhandleClickShutdown(row) {
      if (row.closeLoading) {
        return
      }
      row.closeLoading = true
      this.$delModal({
        width: '505px',
        tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">关闭云桌面提醒</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">关闭云桌面后，将无法继续操作当前云桌面；如果当前有正在操作的内容，将会中断执行。确认是否执行关机操作？</div>
        `,
        success: () => {
          const params = {
            userEcsId: row.userEscId,
            ecsStatus: 2
          }
          manageCloudPcOperation(params)
            .then(res => {
              row.closeLoading = false
              this.getList()
            })
            .catch(() => {
              row.closeLoading = false
            })
        },
        fail: () => {
          row.closeLoading = false
        }
      })
    },
    // 点击释放
    onhandleClickRelease(row) {
      console.log(row)
      if (row.releaseLoading) {
        return
      }
      row.releaseLoading = true
      this.$delModal({
        width: '505px',
        tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">释放云桌面提醒</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">释放云桌面后，将会销毁云桌面，存储在云桌面上的内容都将一并释放，需谨慎操作，确认执行吗？</div>
        `,
        success: () => {
          const params = {
            userEcsId: row.userEscId,
            ecsStatus: 3
          }
          manageCloudPcOperation(params)
            .then(res => {
              row.releaseLoading = false
              this.getList()
            })
            .catch(() => {
              row.releaseLoading = false
            })
        },
        fail: () => {
          row.releaseLoading = false
        }
      })
    },
    // 前往详情页面
    gotoDetail(row) {
      this.$router.push(`/system/cloudDesktop/detail/${row.userEscId}`)
    },
    // 自定义表头改变触发
    handleCheckedTableColumnsChange() {
      this.$nextTick(() => {
        this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.pageWrap {
  @include responsive-height(20px);
  min-width: 1200px;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 20px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 20px !important;
}
::v-deep .el-input-group__prepend .el-select .el-input .el-input__inner {
  color: #333;
}
.c_F53F3F {
  color: #f53f3f;
}
.ecsStatus1 {
  width: 56px;
  height: 24px;
  background: #e6f7ea;
  border-radius: 12px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #00b42a;
  line-height: 24px;
  text-align: center;
}
.ecsStatus2 {
  width: 56px;
  height: 24px;
  background: #fff2e6;
  border-radius: 12px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #ff7d00;
  line-height: 24px;
  text-align: center;
}
.ecsStatus3 {
  width: 56px;
  height: 24px;
  background: #feecec;
  border-radius: 12px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  // color: #f53f3f;
  line-height: 24px;
  text-align: center;
}
.delisting::v-deep {
  .el-dialog__header{
    padding-bottom: 0px;
  }
  .el-dialog--center .el-dialog__body {
    padding: 20px 25px 25px;
  }
  .delisting-tips {
    font-size: 16px;
    color: #333333;
    font-weight: 400;
  }
  .delisting-tips-text {
    color: #f1330d;
    font-weight: 600;
    font-size: 18px;
  }
  .el-dialog__title {
    // color: #f1330d;
    font-weight: 600;
    font-size: 22px;
  }
}
</style>
