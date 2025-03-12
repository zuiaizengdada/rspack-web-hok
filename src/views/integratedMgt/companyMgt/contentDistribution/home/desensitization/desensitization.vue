<template>
  <div class="desensitization-cnt">
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
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="search">
        <form-search ref="tableSearch" @search="handleSearch" />
      </template>
      <template slot="action" slot-scope="scope">
        <el-button type="text" @click="detailClick(scope.row)">
          详情
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
        <template v-else>--</template>
      </template>
      <template slot="videoGroupName" slot-scope="scope">
        <p>{{ scope.row.videoGroupName || '--' }}</p>
      </template>
      <template slot="size" slot-scope="scope">
        <p>{{ scope.row.size | filterSize }}</p>
      </template>
      <template slot="duration" slot-scope="scope">
        <p>{{ getPlayDuration(scope.row.duration * 1000) }}</p>
      </template>
      <template slot="cpOrgList" slot-scope="scope">
        <div>
          {{ scope.row.cpOrgList | filterCpOrgList }}
        </div>
      </template>
      <template slot="teacherName" slot-scope="scope">
        <span>{{ scope.row.teacherName || '--' }}</span>
      </template>
    </MPageLayout>

    <finishedVideoDetailVue
      ref="finsiedShowDetail"
      :detail="showDetailObject"
      @reloadData="getTableInfo"
    />
  </div>
</template>

<script>
import formSearch from './cpns/formSearch.vue'
import finishedVideoDetailVue from './cpns/detailsDialog.vue'
// '@/views/videoManagement/finishedProduct/cpns/finishedProductMy/cpns/finishedVideoDetail.vue'
import { desensitizationTableJson } from '../data'
import { getPlayDuration } from '@/utils/index'

import {
  desensitizedVideoPageListApi
  // desensitizedVideoDetailApi
} from '@/api/contentDistribution/index.js'
export default {
  components: {
    formSearch,
    finishedVideoDetailVue
  },
  filters: {
    filterCpOrgList(arr) {
      if (!arr) return '--'
      return arr
        .map(item => {
          return item.orgName
        })
        .join('、')
    }
  },
  data() {
    return {
      showDetailObject: {},
      // MPageLayout 配置
      loading: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: desensitizationTableJson.columns,
        slotArr: desensitizationTableJson.slotArr
      }
    }
  },
  created() {
    this.getTableInfo()
  },
  methods: {
    getPlayDuration,
    async getTableInfo(req = {}) {
      this.loading = true
      try {
        const { data } = await desensitizedVideoPageListApi({
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
    // 查看脱敏详情
    detailClick(row) {
      this.showDetailObject = row
      this.$refs.finsiedShowDetail.show(row)
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
    handleSearch(req = {}) {
      this.config.currentPage = 1
      this.getTableInfo(req)
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
.txt-hidden {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0; // 避免flex布局的影响
}
</style>
