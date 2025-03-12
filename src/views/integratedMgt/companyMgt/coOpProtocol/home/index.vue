<template>
  <div class="coop-protocol-home hoc-main-height">
    <MPageLayout
      ref="desensitizationMpageRef"
      type="tablePage"
      class="desensitization-table"
      :slot-arr="config.slotArr"
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
        <form-search ref="tableSearch" @search="handleSearch" />
      </template>
      <template slot="headerRight">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="goPage('CoOpProtocolAdd')"
        >
          新增协议
        </el-button>
      </template>
      <template slot="agreementName" slot-scope="scope">
        <template v-if="scope.row.agreementName">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.agreementName"
            placement="top"
          >
            <p class="txt-hidden">{{ scope.row.agreementName }}</p>
          </el-tooltip>
        </template>
        <template v-else>
          <p>--</p>
        </template>
      </template>
      <template slot="status" slot-scope="scope">
        <div class="flex flex-middle">
          <i :class="['home-icon', statusTansforIcon[scope.row.status].icon]" />
          <span class="txt pl6">{{ scope.row.statusName }}</span>
        </div>
      </template>
      <template slot="startDate" slot-scope="scope">
        <span class="txt">
          {{ scope.row.startDate }}~{{ scope.row.endDate }}
        </span>
      </template>
      <template slot="coopScopeList" slot-scope="scope">
        <span class="txt">
          {{
            scope.row.coopScopeList ? scope.row.coopScopeList.join('、') : '--'
          }}
        </span>
      </template>
      <template slot="action" slot-scope="scope">
        <div>
          <el-button
            v-if="[1, 4].includes(scope.row.status)"
            type="text"
            @click="goPage('CoOpProtocolAdd', { id: scope.row.id })"
          >
            编辑
          </el-button>
          <el-button
            v-if="
              ([5, 6, 7, 8, 9, 10].includes(scope.row.status) &&
                !scope.row.isSender) ||
              scope.row.isSender
            "
            type="text"
            @click="
              goPage('CoOpProtocolDetails', {
                id: scope.row.id
              })
            "
          >
            详情
          </el-button>
        </div>
      </template>
    </MPageLayout>
  </div>
</template>

<script>
import { agreementPageListApi } from '@/api/coOpProtocol'
import { finishTableJson, statusTansforIcon } from '../data'
import formSearch from './cpns/formSearch.vue'
export default {
  name: 'CoOpProtocolAudit',
  components: {
    formSearch
  },
  data() {
    return {
      tabs: [
        { label: '待审核', name: 'finish' },
        { label: '审核通过', name: 'finished' },
        { label: '审核驳回', name: 'unfinish' }
      ],

      // MPageLayout 配置
      loading: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: finishTableJson.columns,
        slotArr: finishTableJson.slotArr
      },
      statusTansforIcon
    }
  },
  created() {
    this.getTableInfo()
  },
  methods: {
    async getTableInfo() {
      this.loading = true
      try {
        const req = this.$refs?.tableSearch?.searchInfo() || {}
        const { data } = await agreementPageListApi({
          ...req,
          pageSize: this.config.pageSize,
          pageIndex: this.config.currentPage
        })
        this.$set(this.config, 'tableData', data.items || [])
        this.$set(this.config, 'total', data.total)
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
        name: name,
        query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.red {
  color: #ff2020;
}
.pl6 {
  padding-left: 6px;
}
.txt {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}
.coop-protocol-home {
  min-width: 1100px;
  width: 100%;
  background: #fff;
  padding: 10px 0 0 0;
  border-radius: 10px;
  /* .table-cnt {
    height: calc(100% - 60px);
  } */
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
.home-icon {
  display: inline-block;
  height: 14px;
  width: 14px;
  background-image: url('~@/assets/image/coOpProtocol/status_sprites.png');
  background-size: 72px;
  background-repeat: no-repeat;
  &.dzz {
    background-position: -5px -5px;
  }
  &.cg {
    background-position: -29px -5px;
  }
  &.dsh {
    background-position: -5px -29px;
  }
  &.shbh {
    background-position: -29px -29px;
  }
  &.yzz {
    background-position: -53px -5px;
  }
  &.ysb {
    background-position: -53px -29px;
  }
  &.yqs {
    background-position: -5px -53px;
  }
  &.dqs {
    background-position: -29px -53px;
  }
  &.yjj {
    background-position: -53px -53px;
  }
  &.ysx {
    background: url('~@/assets/image/coOpProtocol/icon_ysx.png');
    background-size: 100%;
  }
  &.shtg {
    background: url('~@/assets/image/coOpProtocol/icon_sptg.png');
    background-size: 100%;
  }
}

.txt-hidden {
  white-space: nowrap; /* 禁止文字换行 */
  overflow: hidden; /* 隐藏溢出部分 */
  text-overflow: ellipsis; /* 溢出部分用省略号表示 */
}
</style>
