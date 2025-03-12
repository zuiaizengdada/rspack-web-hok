<template>
  <div class="desensitization-cnt">
    <MPageLayout
      ref="desensitizationMpageRef"
      type="tablePage"
      class="desensitization-table"
      :checkbox="true"
      :slot-arr="config.slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      table-index-width="62px"
      layout="total, sizes, prev, pager, next, jumper"
      :selectable="selectable"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <template slot="search">
        <form-search ref="tableSearch" @search="handleSearch" />
      </template>
      <template slot="action" slot-scope="scope">
        <el-button type="text" @click="detailClick(scope.row)">详情</el-button>
        <el-button
          v-if="scope.row.isAssign"
          type="text"
          @click="assignClick(scope.row)"
        >
          指派
        </el-button>
      </template>
      <template slot="name" slot-scope="scope">
        <template v-if="scope.row.name">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.name"
            placement="top"
          >
            <p class="txt-hidden">{{ scope.row.name }}</p>
          </el-tooltip>
        </template>
        <template v-else>
          <p>--</p>
        </template>
      </template>
      <template slot="title" slot-scope="scope">
        <p>{{ scope.row.title || '--' }}</p>
      </template>
      <template slot="createUserName" slot-scope="scope">
        <p>{{ scope.row.createUserName || '--' }}</p>
      </template>
      <template slot="supplierOrgName" slot-scope="scope">
        <p>{{ scope.row.supplierOrgName || '--' }}</p>
      </template>

      <template slot="size" slot-scope="scope">
        <p>{{ scope.row.size | filterSize }}</p>
      </template>
      <template slot="duration" slot-scope="scope">
        <p>{{ getPlayDuration(scope.row.duration * 1000) }}</p>
      </template>
      <template slot="cpOrgList" slot-scope="scope">
        <div>
          {{ scope.row.cpOrgList | filterArrJoin('orgName') }}
        </div>
      </template>
      <template slot="teacherName" slot-scope="scope">
        <span>{{ scope.row.teacherName || '--' }}</span>
      </template>
      <template slot="assignList" slot-scope="scope">
        <template
          v-if="scope.row.assignList && scope.row.assignList.length > 10"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.assignList | filterArrJoin('userName')"
            placement="top-start"
          >
            <div>
              {{ scope.row.assignList | filterArrJoin('userName', 10) }}...
            </div>
          </el-tooltip>
        </template>
        <template v-else>
          <div>
            {{ scope.row.assignList | filterArrJoin('userName') }}
          </div>
        </template>
      </template>

      <div slot="footer">
        <el-button
          type="danger"
          size="mini"
          :disabled="multipleSelection.length === 0"
          @click="assignClick(false)"
        >
          批量指派
        </el-button>
      </div>
    </MPageLayout>

    <assignDialog ref="assignRef" @refesh="getTableInfo" />
    <finishedVideoDetailVue
      ref="finsiedShowDetail"
      :detail="showDetailObject"
      @reloadData="getTableInfo"
    />
  </div>
</template>

<script>
import formSearch from './cpns/formSearch.vue'
import assignDialog from './cpns/assignDialog.vue'

import finishedVideoDetailVue from '@/views/videoManagement/finishedProduct/cpns/finishedProductMy/cpns/finishedVideoDetail.vue'

import { finishedTableJson } from '../data'
import { getPlayDuration } from '@/utils/index'

import { finishVideoPageListApi } from '@/api/contentDistribution/index.js'
export default {
  components: {
    formSearch,
    assignDialog,
    finishedVideoDetailVue
  },
  filters: {
    filterArrJoin(arr, key, max) {
      if (!arr) return '--'
      if (max) arr.length = max
      return arr
        .map(item => {
          return item[key]
        })
        .join('、')
    }
  },
  data() {
    return {
      showDetailObject: {},
      multipleSelection: [],
      // MPageLayout 配置
      loading: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: finishedTableJson.columns,
        slotArr: finishedTableJson.slotArr
      }
    }
  },
  created() {
    this.getTableInfo()
  },
  methods: {
    getPlayDuration,
    async getTableInfo() {
      this.multipleSelection = []
      this.loading = true
      try {
        const req = this.$refs?.tableSearch?.searchInfo() || {}
        const { data } = await finishVideoPageListApi({
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
        console.log('error------desensitizedVideoPageListApi', error)
      }
      this.loading = false
    },
    // 详情
    detailClick(row) {
      this.showDetailObject = row
      this.$refs.finsiedShowDetail.show(row)
      this.$refs.finsiedShowDetail.loadZm(row)
    },
    // 指派
    assignClick(row) {
      this.$refs.assignRef.dialogChange(
        'open',
        row ? [row] : this.multipleSelection
      )
    },

    // 批量选择
    handleSelectionChange(row) {
      console.log(row)
      this.multipleSelection = row
    },

    // MPageLayout
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
    selectable(row) {
      return row.isAssign
    }
    // MPageLayout --end
  }
}
</script>

<style lang="scss" scoped>
.desensitization-cnt {
  height: calc(100% - 65px);
}
.txt-hidden {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0; // 避免flex布局的影响
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
