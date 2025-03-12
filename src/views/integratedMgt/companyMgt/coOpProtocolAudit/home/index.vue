<template>
  <div class="coop-protocol-audit-home hoc-main-height">
    <el-tabs v-model="activeName" class="hok-tabs">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.label"
        :label="`${item.label}（${item.num}）`"
        :name="item.name"
        lazy
      />
    </el-tabs>
    <div class="table-cnt">
      <MPageLayout
        ref="desensitizationMpageRef"
        type="tablePage"
        class="desensitization-table"
        :slot-arr="slotArr"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="config.tableData"
        :table-columns="config.tableColumns"
        :loading="loading"
        table-index-width="62px"
        :row-class-name="tableRowClassName"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template slot="search">
          <form-search
            ref="coOpProtocolAuditRef"
            :active-name="activeName"
            @search="handleSearch"
          />
        </template>
        <template slot="coopScopeList" slot-scope="scope">
          <div>
            {{
              scope.row.coopScopeList
                ? scope.row.coopScopeList.join('、')
                : '--'
            }}
          </div>
        </template>
        <template slot="startDate" slot-scope="scope">
          <div>{{ scope.row.startDate }}~{{ scope.row.endDate }}</div>
        </template>
        <template slot="headerRight">
          <el-button
            size="small"
            type="primary"
            @click="goPage('CoOpProtocolAuditPage')"
          >
            审核设置
          </el-button>
        </template>
        <template slot="action" slot-scope="scope">
          <el-button
            type="text"
            @click="
              goPage('CoOpProtocolAuditDetails', {
                id: scope.row.id
              })
            "
          >
            详情
          </el-button>
        </template>
      </MPageLayout>
    </div>
    <!-- <component :is="activeName" /> -->
  </div>
</template>

<script>
import {
  agreementPageAuditListApi,
  auditCountListApi
} from '@/api/coOpProtocol'
import { finishTableJson, finishedTableJson, tabsToStatus } from '../data'
import formSearch from './cpns/formSearch.vue'

export default {
  name: 'CoOpProtocolAuditPage',
  components: {
    formSearch
  },
  filters: {
    filterArrJoin(arr, key) {
      return arr
        .map(item => {
          return item[key]
        })
        .join('、')
    }
  },
  data() {
    return {
      activeName: 'finish',
      tabs: [
        { label: '待审核', num: 0, name: 'finish' },
        { label: '审核通过', num: 0, name: 'finished' },
        { label: '审核驳回', num: 0, name: 'unfinish' }
      ],
      tabsToIndex: { finish: 0, finished: 1, unfinish: 2 },

      // MPageLayout 配置
      loading: false,
      slotArr: [
        'search',
        'headerLeft',
        'headerRight',
        'coopScopeList',
        'action',
        'startDate',
        'footer'
      ],
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: finishTableJson
      }
    }
  },
  watch: {
    activeName: {
      handler(val) {
        if (val === 'unfinish' || val === 'finished') {
          this.$set(this.config, 'tableColumns', finishedTableJson)
        } else {
          this.$set(this.config, 'tableColumns', finishTableJson)
        }
        if (this.$refs?.coOpProtocolAuditRef) {
          this.$refs?.coOpProtocolAuditRef?.handleClickReset()
        } else {
          this.getTableInfo()
        }
        this.$nextTick(() => {
          this.$refs.desensitizationMpageRef.doLayout()
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.auditCountListApi()
    const { tab } = this.$route.query
    if (tab === 'unfinish' || tab === 'finished') {
      this.activeName = tab
    } else {
      this.activeName = 'finish'
    }
  },
  methods: {
    async auditCountListApi() {
      try {
        const { data } = await auditCountListApi()
        this.tabs.forEach((v, index) => {
          this.$set(
            this.tabs[index],
            'num',
            data.find(f => f.auditStatus === Number(tabsToStatus[v.name])).num
          )
        })
      } catch (error) {
        console.log('error-------auditCountListApi', error)
      }
    },
    async getTableInfo() {
      const req = this.$refs?.coOpProtocolAuditRef?.searchInfo() || {}
      this.loading = true
      try {
        const { data } = await agreementPageAuditListApi({
          ...req,
          auditStatus: tabsToStatus[this.activeName],
          pageSize: this.config.pageSize,
          pageIndex: this.config.currentPage
        })
        this.$set(this.config, 'tableData', data.items || [])
        this.$set(this.config, 'total', data.total)
        this.$set(
          this.tabs[this.tabsToIndex[this.activeName]],
          'num',
          data.total
        )

        this.$nextTick(() => {
          this.$refs.desensitizationMpageRef.doLayout()
        })
      } catch (error) {
        console.log('error------getTableInfo', error)
      }
      this.loading = false
    },
    // MPageLayout
    tableRowClassName({ row, rowIndex }) {
      if (row.assetId === this.currentIndex) {
        return 'highlight-row'
      }
      return ''
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getTableInfo()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getTableInfo()
    },
    handleSearch() {
      this.config.currentPage = 1
      this.getTableInfo()
    },
    // MPageLayout --end

    goPage(name, query = {}) {
      this.$router.push({
        name,
        query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.coop-protocol-audit-home {
  min-width: 1100px;
  width: 100%;
  background: #fff;
  padding: 5px 0 0 0;
  border-radius: 5px;
  .table-cnt {
    height: calc(100% - 60px);
  }
}
::v-deep .hok-tabs {
  .el-tabs__header {
    margin-bottom: 10px;
  }
  .el-tabs__nav-wrap {
    padding: 0 20px;
    .el-tabs__item {
      color: #000000;
      font-size: 14px;
      font-weight: 500;
      line-height: 48px;
      height: 48px;
      &.is-active {
        color: $subMenuActive;
      }
    }
  }
}
::v-deep .el-table {
  th.el-table__cell > .cell {
    font-weight: 600;
  }
  .cell {
    font-weight: 450;
    font-size: 14px;
    color: #333;
  }
  .el-button + .el-button {
    margin-left: 20px;
  }
}
</style>
