<template>
  <div class="page-content">
    <div class="back">
      <span class="pointer" @click="back()">广告投放管理</span> /<span>关联广告</span>
    </div>
    <el-tabs v-model="activeName" class="mCard" @tab-click="handleClick">
      <el-tab-pane label="关联的投放账号" name="tuofangzhanghao">
        <MCard class="page_wrap">
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <template slot="search">
              <filterTop
                :search="search"
                :active-name="'tuofangzhanghao'"
                @onSearch="onSearchFn"
                @onClear="onClear"
              />
            </template>
          </MPageLayout>
        </MCard>
      </el-tab-pane>
      <el-tab-pane label="关联广告组" name="guangaozhu">
        <MCard class="page_wrap">
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <template slot="search">
              <filterTop
                :search="search"
                :status="1"
                :active-name="'guangaozhu'"
                @onSearch="onSearchFn"
                @onClear="onClear"
              />
            </template>
            <template slot="action" slot-scope="{ row }">
              <el-button
                v-if="row.interrelatedStatus === 1"
                type="text"
                :loading="loading"
                @click="cancelGroup(row.id)"
              >取消关联
              </el-button>
              <el-button
                v-if="row.interrelatedStatus === 0"
                type="text"
                :loading="loading"
                @click="againGroup(row.id)"
              >重新关联
              </el-button>
            </template>
          </MPageLayout>
        </MCard>
      </el-tab-pane>
      <el-tab-pane label="关联广告计划" name="guanggaojihua">
        <MCard class="page_wrap">
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <template slot="search">
              <filterTop
                :search="search"
                :status="2"
                :active-name="'guanggaojihua'"
                @onSearch="onSearchFn"
                @onClear="onClear"
              />
            </template>

            <template slot="action" slot-scope="{ row }">
              <el-button
                v-if="row.interrelatedStatus === 1"
                type="text"
                :loading="loading"
                @click="cancelPlan(row.id)"
              >取消关联</el-button>
              <el-button
                v-if="row.interrelatedStatus === 0"
                type="text"
                :loading="loading"
                @click="againPlan(row.id)"
              >重新关联
              </el-button>
            </template>
          </MPageLayout>
        </MCard>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import filterTop from './filterTop.vue'
import { getColumns, getColumns1, getColumns2 } from './columns'
import { getOptionsValueByKey } from '@/filters/index.js'
import {
  getADPlanList,
  adPlanCancel,
  getADGroupList,
  adGroupCancel,
  getAdvertiserUserList,
  adGroupRE,
  adPlanRE
} from '@/api/advertisingKanBan'
export default {
  components: {
    filterTop
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'expertChannel'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      tabIndex: 0,
      search: {},
      activeName: 'tuofangzhanghao',
      loading: false
    }
  },
  mounted() {
    this.onSearchFn()
  },
  methods: {
    back() {
      this.$router.back(-1)
    },
    againPlan(id) {
      this.$confirm('确定重新关联吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          adPlanRE({ id })
            .then(() => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.onSearchFn()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.loading = false
        })
    },
    cancelPlan(id) {
      this.$delModal({
        tips: `确定取消关联吗？`,
        success: () => {
          this.loading = true
          adPlanCancel({ id })
            .then(() => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.onSearchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    againGroup(id) {
      this.$confirm('确定重新关联吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          adGroupRE({ id })
            .then(() => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.onSearchFn()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.loading = false
        })
    },
    cancelGroup(id) {
      this.$delModal({
        tips: `确定取消关联吗？`,
        success: () => {
          this.loading = true
          adGroupCancel({ id })
            .then(() => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.onSearchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    getOptionsValueByKey,
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList()
    },
    // 切换
    handleClick() {
      this.search = {}
      this.onSearchFn()
      if (this.activeName === 'tuofangzhanghao') {
        this.$set(this.config, 'tableColumns', getColumns.call(this))
      } else if (this.activeName === 'guangaozhu') {
        this.$set(this.config, 'tableColumns', getColumns1.call(this))
      } else if (this.activeName === 'guanggaojihua') {
        this.$set(this.config, 'tableColumns', getColumns2.call(this))
      }
    },
    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getList()
    },
    // 点击查询按钮
    onSearchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 点击重置按钮
    onClear() {
      this.search = {}
      this.onSearchFn()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        ...this.search
      }
      const api =
        this.activeName === 'tuofangzhanghao'
          ? getAdvertiserUserList(params)
          : this.activeName === 'guanggaojihua'
            ? getADPlanList(params)
            : getADGroupList(params)
      api
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  height:88%;
  .back {
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 20px;
    background: #fff;
  }
}
.mCard {
  height: 100%;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
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

.page_wrap {
  height: 100%;
  width: 100%;
  //padding: 20px;
}
::v-deep .tablePage .page_content {
  height: 76%;
  flex: initial;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.expertChannel {
  display: flex;
  align-items: center;
  .expertChannelicon {
    width: 20px;
    height: 20px;
    font-size: 20px;
    margin-right: 8px;
  }
}
</style>
