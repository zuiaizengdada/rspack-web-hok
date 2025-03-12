<!-- 协议管理 -->
<template>
  <div class="page-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in configList"
        :key="index"
        :name="`first${index}`"
        :label="`${item.name}`"
      >
        <div class="page_wrap1">
          <filter-top
            v-if="index == configIndex"
            :tearch-array="tearchArray"
            :platform-array="platformArray"
            :search-form="searchForm"
            :config-index="configIndex"
            @handleChangeTeacher="handleChangeTeacher"
            @tearchFilter="tearchFilter"
            @selectWorks="selectWorks"
            @timeChange="timeChange"
            @clear="clear"
            @exportData="exportData"
            @getListForSearch="getListForSearch"
          />
          <!-- 内容区(协议管理) -->
          <MPageLayout
            ref="MPageLayout"
            :slot-arr="slotArr"
            :table-data="config.tableData"
            :table-columns="config.tableColumns"
            :loading="loading"
            :current-page="config.currentPage"
            :page-sizes="config.pageSizes"
            :page-size="config.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="config.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <template slot="ranking" slot-scope="scope">
              <svg-icon
                v-if="scope.row.ranking <= 3"
                :icon-class="`ranking_${scope.row.ranking}`"
                class="ranking-icon"
              />
              <div v-else class="ranking-box">{{ scope.row.ranking }}</div>
            </template>
            <div slot="teacherName" slot-scope="{ row }">
              <span>
                {{ row.teacherName || '--' }}
              </span>
            </div>
            <template slot="name" slot-scope="scope">
              <div
                class="name text_hidden"
                @click="openAccountDetails(scope.row)"
              >
                {{ scope.row.name }}
              </div>
            </template>
            <template slot="title" slot-scope="scope">
              <div class="flex flex-middle">
                <span
                  v-if="scope.row.videoLabel === 1"
                  class="commerce"
                >带货</span>
                <div
                  :class="
                    scope.row.openUrl
                      ? 'name text_hidden flex-1'
                      : 'text_hidden flex-1'
                  "
                  @click="openWorksDetails(scope.row)"
                >
                  {{ scope.row.title }}
                </div>
              </div>
            </template>
          </MPageLayout>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getPlatform } from '@/api/videoManagement/accountManage'
import { getPublishAccountList, getPublishWorkList, exportPublishWorkList, exportPublishAccountList } from '@/api/videoManagement/operationalRank'
import { userNoPage } from '@/api/addressBookApi'
import { tableColumns, tableColumns1 } from './columns'
import filterTop from './components/filterTop.vue'
import { loadUserData, changeTeacher, tearchFilter } from '@/utils/videoMange'
import { downloadFile } from '@/utils/index'
export default {
  components: {
    filterTop
  },
  data() {
    return {
      activeName: 'first0',
      configList: [
        {
          name: '作品'
        },
        {
          name: '账号'
        }
      ],
      permsList: this.$route.meta.permsList || [],
      slotArr: ['action', 'footer', 'type', 'name', 'ranking', 'title', 'teacherName'],
      loading: false,
      tearchArray: [],
      tearchList: [],
      configIndex: '0',
      platformArray: [],
      searchForm: {
        platformId: '', // 平台ID
        teacherId: '', // IP
        orderByParam: 1, // 排行类型
        time: {
          active: 7,
          time: ['', '']
        }
      },
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: tableColumns,
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 30,
        currentPage: 1,
        total: 0
      }
    }
  },
  created() {
    this.loadTeacherData()
    this.loadPlatformData()
  },
  methods: {
    // 页码改变触发
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.config.pageSize = val
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    loadPlatformData() {
      getPlatform().then(res => {
        if (res.success) {
          this.platformArray = res.data
        }
      })
    },
    async loadTeacherData() {
      if (this.activeName === 'first1') {
        const { tearchArray, tearchList } = await loadUserData('operationalRankTearch', 1)
        this.tearchArray = tearchArray
        this.tearchList = tearchList
      } else {
        const { tearchArray, tearchList } = await loadUserData('operationalRankTearch1', 1)
        this.tearchArray = tearchArray
        this.tearchList = tearchList
      }
      this.tearchFilter('')
    },
    async handleChangeTeacher(data) {
      if (this.searchForm.teacherId) {
        if (this.activeName === 'first1') {
          const res = await changeTeacher(this.tearchList, this.tearchArray, 'operationalRankTearch', this.searchForm.teacherId)
          this.tearchArray = res
        } else {
          const res = await changeTeacher(this.tearchList, this.tearchArray, 'operationalRankTearch1', this.searchForm.teacherId)
          this.tearchArray = res
        }
      }
      this.getListForSearch(data)
    },
    async tearchFilter(query) {
      const res = await tearchFilter(query, this.tearchList)
      this.tearchArray[0].isHidden = query.length > 0
      this.tearchArray[1].options = res
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    handleClick(tab, event) {
      this.config.currentPage = 1
      this.config.tableColumns = tableColumns1
      if (tab.index === '0') {
        this.config.tableColumns = tableColumns
      } else {
        this.config.tableColumns = tableColumns1
      }
      this.loadTeacherData()
      this.clear()
      this.configIndex = tab.index
    },
    selectWorks(data) {
      console.log(data, '传过来')
      this.config.currentPage = 1
      this.searchForm.orderByParam = data
      this.getList()
    },
    openAccountDetails(row) {
      const path = this.$route.path
      const routerJump = this.$router.resolve({
        path: `/videoManagement/myAccountDetail?fromType=all&accountId=${row.id}`,
        query: {
          path,
          name: '运营数据榜单',
          target: '_blank'
        }
      })
      window.open(routerJump.href, '_blank')
    },
    openWorksDetails(row) {
      if (!row.openUrl) return
      // 新窗口打开openUrl
      window.open(row.openUrl)
    },
    getListForSearch(data) {
      this.config.currentPage = 1
      this.searchForm = { ...this.searchForm, ...data }
      this.getList()
    },
    clear() {
      this.searchForm.platformId = ''
      this.searchForm.teacherId = ''
      if (this.configIndex === '0') {
        this.searchForm.orderByParam = 6
      } else {
        this.searchForm.orderByParam = 1
      }
    },
    timeChange(data) {
      this.config.currentPage = 1
      this.searchForm.time = data
      this.getList()
    },
    async exportData() {
      const params = {
        startDate: this.searchForm?.time.time[0] || '',
        endDate: this.searchForm?.time.time[1] || '',
        platformId: this.searchForm.platformId, // 平台ID
        teacherId: this.searchForm.teacherId, // 讲师
        orderByParam: this.searchForm.orderByParam, // 排行类型
        pageIndex: 1,
        pageSize: 100
      }
      let res = null
      if (this.configIndex === '0') {
        res = await exportPublishWorkList(params)
      } else {
        res = await exportPublishAccountList(params)
      }
      downloadFile(res, '运营数据榜单.xls')
    },
    // 获取列表
    async getList() {
      this.loading = true
      const params = {
        startDate: this.searchForm?.time.time[0] || '',
        endDate: this.searchForm?.time.time[1] || '',
        platformId: this.searchForm.platformId, // 平台ID
        teacherId: this.searchForm.teacherId, // IP
        orderByParam: this.searchForm.orderByParam, // 排行类型
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      let res = null
      if (this.configIndex === '0') {
        res = await getPublishWorkList(params)
      } else {
        res = await getPublishAccountList(params)
      }
      this.config.tableData = res.data.items
      this.config.total = res.data.total
      this.optData(res.data.items)
      this.loading = false
    },
    optData() {
      this.config.tableData.forEach((item, index) => {
        // 根本当前页码和每页条数计算出排名
        item.ranking =
          (this.config.currentPage - 1) * this.config.pageSize + index + 1
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page-content {
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
.commerce {
  width: 32px;
  height: 18px;
  background: #52d3b6;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
  text-align: center;
  margin-right: 4px;
}
.ranking-icon {
  font-size: 32px;
}
.ranking-box {
  width: 32px;
  height: 32px;
  font-size: 14px;
  text-align: center;
  line-height: 32px;
}
.name {
  color: #1778ff;
  cursor: pointer;
}
.page_wrap1 ::v-deep {
  height: calc(100vh - 180px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  // padding-top: 15px;
  .tablePage {
    height: 600px;
  }
  .el-table::before {
    background-color: transparent;
  }
  .my-table {
    margin: 0 !important;
  }
}
</style>
