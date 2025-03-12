<template>
  <div class="fixed-assets-container">
    <div class="crumbs-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          :to="{
            path: '/oaManagement/oaMannagementIndex',
            query: { tab: 'confirmProcess' }
          }"
          class="nav-list"
          >确认流程</el-breadcrumb-item
        >
        <el-breadcrumb-item class="nav-add">{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.label"
        :label="item.label"
        :name="item.name"
        lazy
      >
        <template v-if="item.name === '0' && assetType === 1">
          <fixedAssetsTable
            ref="fixedAssetsTableRef01"
            :confirm-status="0"
            :asset-type="assetType"
            :stat-id="statId"
          />
        </template>
        <template v-else-if="item.name === '0' && assetType === 2">
          <phoneCardTable
            ref="phoneCardTableRef02"
            :confirm-status="0"
            :asset-type="assetType"
            :stat-id="statId"
          />
        </template>
        <template v-else-if="item.name === '1' && assetType === 1">
          <fixedAssetsTable
            ref="fixedAssetsTableRef11"
            :confirm-status="1"
            :asset-type="assetType"
            :stat-id="statId"
          />
        </template>
        <template v-else-if="item.name === '1' && assetType === 2">
          <phoneCardTable
            ref="phoneCardTableRef12"
            :confirm-status="1"
            :asset-type="assetType"
            :stat-id="statId"
          />
        </template>
        <template v-else-if="item.name === '3' && assetType === 1">
          <fixedAssetsTable
            ref="fixedAssetsTableRef31"
            :confirm-status="3"
            :asset-type="assetType"
            :stat-id="statId"
          />
        </template>
        <template v-else-if="item.name === '3' && assetType === 2">
          <phoneCardTable
            ref="phoneCardTableRef32"
            :confirm-status="3"
            :asset-type="assetType"
            :stat-id="statId"
          />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  operateTypeOption,
  stateList,
  communicationCompanyList
} from '../constants'
import moment from 'moment'
import fixedAssetsTable from './fixedAssetsTable.vue'
import phoneCardTable from './phoneCardTable.vue'

export default {
  components: {
    fixedAssetsTable,
    phoneCardTable
  },
  data() {
    this.communicationCompanyList = communicationCompanyList
    this.stateList = stateList
    this.operateTypeOption = operateTypeOption
    return {
      moment,
      loading: false,
      editFormRow: {},
      title: '更多详情',
      activeName: '1',
      tabs: [
        { label: '全部', name: '0' },
        { label: '未确认', name: '1' },
        { label: '已确认', name: '3' }
      ],
      assetType: null,
      statId: null
    }
  },
  created() {
    const { assetType, statId } = this.$route.query
    this.assetType = Number(assetType)
    this.statId = Number(statId)
  },
  mounted() {
    this.$uweb?.setAction('Event_oa_confirmProcess_detailRecordsPage')
  },
  methods: {
    handleClick() {
      if (this.activeName === '0' && this.assetType === 1) {
        this.$refs.fixedAssetsTableRef01[0]?.handleSearch()
      } else if (this.activeName === '0' && this.assetType === 2) {
        this.$refs.phoneCardTableRef02[0]?.handleSearch()
      } else if (this.activeName === '1' && this.assetType === 1) {
        this.$refs.fixedAssetsTableRef11[0]?.handleSearch()
      } else if (this.activeName === '1' && this.assetType === 2) {
        this.$refs.phoneCardTableRef12[0]?.handleSearch()
      } else if (this.activeName === '3' && this.assetType === 1) {
        this.$refs.fixedAssetsTableRef31[0]?.handleSearch()
      } else if (this.activeName === '3' && this.assetType === 2) {
        this.$refs.phoneCardTableRef32[0]?.handleSearch()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.fixed-assets-container {
  overflow: hidden;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  .crumbs-box {
    padding-bottom: 20px;
    border-bottom: 1px solid #eff2f6;
  }
  .assetChangeRecords {
    height: calc(100vh - 200px);
  }
  .assetChangeRecords ::v-deep .el-table__cell {
    padding: 10px 6px;
  }
}
</style>
