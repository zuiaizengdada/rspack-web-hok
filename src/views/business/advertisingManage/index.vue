<template>
  <div class="page-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="千川类" name="qichuan">
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
            show-summary
            :summary-method="getSummaries"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <template slot="search">
              <filterTop
                :search="search"
                @onSearch="onSearchFn"
                @onClear="onClear"
                @onAdd="onAdd"
                @gopage="gopage"
              />
            </template>
            <!-- <template slot="expertChannel" slot-scope="{ row }">
              <div class="expertChannel">
                {{
                  getOptionsValueByKey(
                    'value',
                    'label',
                    row.expertChannel,
                    liveChannel
                  )
                }}
              </div>
            </template> -->
          </MPageLayout>
        </MCard>
      </el-tab-pane>
      <!--  <el-tab-pane label="信息流类" name="xinxiliu">
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
              <filterTop :search="search" @onSearch="onSearchFn" @onClear="onClear" @onAdd="onAdd" @gopage="gopage" />
            </template>
            <template slot="expertChannel" slot-scope="{ row }">
              <div class="expertChannel">
                       <svg-icon class-name="expertChannelicon" :icon-class="getOptionsValueByKey('value', 'icon', row.expertChannel, liveChannel)" />
                {{ getOptionsValueByKey('value', 'label', row.expertChannel, liveChannel) }}
              </div>
            </template>
          </MPageLayout>
        </MCard>
      </el-tab-pane>
      -->
    </el-tabs>
    <AddAdvertising :config="addConfig" @success="successAdd" />
  </div>
</template>

<script>
import filterTop from './filterTop.vue'
import AddAdvertising from './components/addAdvertising'
import { getColumns, getColumns1 } from './columns'
import { getOptionsValueByKey } from '@/filters/index.js'
import {
  getPutInDataList,
  getCreativeDataTotalList
} from '@/api/advertisingKanBan'
export default {
  components: {
    filterTop,
    AddAdvertising
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
      search: {
        expertChannel: '', // 达人渠道
        expertId: '', // 平台达人ID
        operateUid: '', // 运营人员ID
        operateName: '', // 运营人员姓名
        departmentId: '', // 部门id
        departmentName: '' // 部门名称
      },
      activeName: 'qichuan',
      loading: false,
      addConfig: {
        type: 0, // 0：新增 2：编辑
        visible: false
      },
      totalObj: {}
    }
  },
  mounted() {
    this.onSearchFn()
  },
  methods: {
    isReservTwo(key) {
      return (
        key !== 'totalShowCnt' &&
        key !== 'totalClickCnt' &&
        key !== 'payOrderCount' &&
        key !== 'totalPayOrderCount'
      )
    },
    numberFormat(value, key) {
      if (key === 'totalClickRatio') {
        return Number(value).toFixed(2) + '%'
      }
      if (Number(value) < 10000) {
        return this.isReservTwo(key) ? Number(value).toFixed(2) : value
      }
      if (Number(value) > 10000) {
        return (Number(value) * 0.0001).toFixed(2) + '万'
      }
      if (Number(value) > 10000) {
        return (Number(value) * 0.00000001).toFixed(2) + '亿'
      }
    },
    successAdd() {
      this.addConfig.visible = false
      this.onSearchFn()
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        if (index < 8) {
          sums[index] = ''
          return
        }
        const s = {
          8: () => {
            sums[index] = this.numberFormat(
              this.totalObj.totalShowCnt,
              'totalShowCnt'
            )
          },
          9: () => {
            sums[index] = this.numberFormat(
              this.totalObj.totalClickCnt,
              'totalClickCnt'
            )
          },
          10: () => {
            sums[index] = this.numberFormat(
              this.totalObj.totalClickRatio,
              'totalClickRatio'
            )
          },
          11: () => {
            sums[index] = this.numberFormat(
              this.totalObj.cpcPlatform,
              'cpcPlatform'
            )
          },
          12: () => {
            sums[index] = this.numberFormat(
              this.totalObj.totalCpmPlatform,
              'totalCpmPlatform'
            )
          },
          13: () => {
            sums[index] = this.numberFormat(
              this.totalObj.totalStatCost,
              'totalStatCost'
            )
          },
          14: () => {
            sums[index] = this.numberFormat(
              this.totalObj.payOrderCount,
              'payOrderCount'
            )
          },
          15: () => {
            sums[index] = this.numberFormat(
              this.totalObj.totalPayOrderCount,
              'totalPayOrderCount'
            )
          },
          16: () => {
            sums[index] = this.numberFormat(
              this.totalObj.payOrderAmount,
              'payOrderAmount'
            )
          },
          17: () => {
            sums[index] = this.numberFormat(
              this.totalObj.totalPayOrderAmount,
              'totalPayOrderAmount'
            )
          },
          18: () => {
            sums[index] = this.numberFormat(
              this.totalObj.totalPrepayAndPayOrderRoi,
              'totalPrepayAndPayOrderRoi'
            )
          },
          19: () => {
            sums[index] = this.numberFormat(this.totalObj.totalRoi, 'totalRoi')
          }
        }
        s[index]()
      })

      return sums
    },
    getOptionsValueByKey,
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList()
    },
    // 新增关联广告
    onAdd() {
      this.addConfig.visible = true
    },
    // 新页面
    gopage() {
      this.$router.push({
        name: 'RelatedAdvertising'
      })
    },
    // 切换
    handleClick(tab, event) {
      this.addConfig.type = tab.index
      if (this.addConfig.type === '0') {
        this.$set(this.config, 'tableColumns', getColumns.call(this))
      } else {
        this.$set(this.config, 'tableColumns', getColumns1.call(this))
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
      this.search = {
        expertChannel: '', // 达人渠道
        expertId: '', // 平台达人ID
        operateUid: '', // 运营人员ID
        operateName: '', // 运营人员姓名
        departmentId: '', // 部门id
        departmentName: '' // 部门名称
      }
      this.onSearchFn()
    },
    // 获取列表数据
    async getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        ...this.search
      }
      const t = await getCreativeDataTotalList(params)
      if (t.code === 1) {
        this.totalObj = t.data
      }
      getPutInDataList(params)
        .then(res => {
          this.config.tableData = res.data.items.map(m => ({
            ...m,
            totalShowCnt: this.numberFormat(m.totalShowCnt, 'totalShowCnt'),
            totalClickCnt: this.numberFormat(m.totalClickCnt, 'totalClickCnt'),
            totalClickRatio: this.numberFormat(
              m.totalClickRatio,
              'totalClickRatio'
            ),
            cpcPlatform: this.numberFormat(m.cpcPlatform, 'cpcPlatform'),
            totalCpmPlatform: this.numberFormat(
              m.totalCpmPlatform,
              'totalCpmPlatform'
            ),
            totalStatCost: this.numberFormat(m.totalStatCost, 'totalStatCost'),
            payOrderCount: this.numberFormat(m.payOrderCount, 'payOrderCount'),
            totalPayOrderCount: this.numberFormat(
              m.totalPayOrderCount,
              'totalPayOrderCount'
            ),
            payOrderAmount: this.numberFormat(
              m.payOrderAmount,
              'payOrderAmount'
            ),
            totalPayOrderAmount: this.numberFormat(
              m.totalPayOrderAmount,
              'totalPayOrderAmount'
            ),
            totalPrepayAndPayOrderRoi: this.numberFormat(
              m.totalPrepayAndPayOrderRoi,
              'totalPrepayAndPayOrderRoi'
            ),
            totalRoi: this.numberFormat(m.totalRoi)
          }))
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击关闭弹框并刷新列表
    closeAddDialog() {
      this.addConfig.visible = false
      this.onSearchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  height: 100%;
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
.page_wrap {
  height: 100%;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .tablePage .page_content {
  height: 68%;
  flex: initial;
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
