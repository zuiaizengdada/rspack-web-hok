<template>
  <div class="fixed-assets-container">
    <div class="crumbs-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          :to="{
            path: '/oaManagement/oaMannagementIndex',
            query: { tab: 'fixedAssets' }
          }"
          class="nav-list"
          >固定资产</el-breadcrumb-item
        >
        <el-breadcrumb-item class="nav-add">{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.label"
        :label="item.label"
        :name="item.name"
        lazy
      >
        <template v-if="item.name === '1'">
          <MPageLayout
            ref="MPageLayout"
            type="tablePage"
            :slot-arr="slotArr"
            table-index-width="62px"
            :current-page="config.currentPage"
            :page-sizes="config.pageSizes"
            :page-size="config.pageSize"
            :total="config.total"
            :table-data="config.tableData"
            :table-columns="config.tableColumns"
            :loading="loading"
            layout="total, sizes, prev, pager, next, jumper"
            class="assetChangeRecords"
            :default-sort="{ prop: 'createTime', order: null }"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @handleSelectionChange="handleSelectionChange"
            @sort-change="sortChange"
          >
            <template slot="search">
              <el-form ref="search" size="small" :inline="true" :model="search">
                <el-form-item label="操作人" prop="operateUserId">
                  <el-select
                    v-model="search.operateUserId"
                    filterable
                    remote
                    size="small"
                    class="w-200 m-r-10"
                    clearable
                    placeholder="请输入操作人"
                    :remote-method="remoteMethodOperateUser"
                    @change="handleSearch"
                  >
                    <el-option
                      v-for="item in operateUserOptions"
                      :key="item.userId"
                      :label="item.nickName"
                      :value="item.userId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="操作类型" prop="operateType">
                  <el-select
                    v-model="search.operateType"
                    size="small"
                    class="w-200 m-r-10"
                    filterable
                    placeholder="请选择操作类型"
                    clearable
                    @change="handleSearch"
                  >
                    <el-option
                      v-for="item in operateTypeOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="handleSearch"
                    >查询</el-button
                  >
                  <el-button size="small" @click="handleClickReset"
                    >重置</el-button
                  >
                </el-form-item>
              </el-form>
            </template>
            <template slot="createTime" slot-scope="{ row }">
              <span>{{
                moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
              }}</span>
            </template>
            <template slot="operateType" slot-scope="{ row }">
              <span>{{
                row.operateType | getOptionsValue(operateTypeOption)
              }}</span>
            </template>
            <template slot="assetName" slot-scope="{ row }">
              <span
                :title="row.assetName"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'assetName'),
                  text_hidden: true
                }"
                >{{ row.assetName }}</span
              >
            </template>
            <template slot="assetCode" slot-scope="{ row }">
              <span
                :title="row.assetCode"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'assetCode'),
                  text_hidden: true
                }"
                >{{ row.assetCode }}</span
              > </template
            ><template slot="originalAssetCode" slot-scope="{ row }">
              <span
                :title="row.originalAssetCode"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'originalAssetCode'),
                  text_hidden: true
                }"
                >{{ row.originalAssetCode }}</span
              > </template
            ><template slot="specification" slot-scope="{ row }">
              <span
                :title="row.specification"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'specification'),
                  text_hidden: true
                }"
                >{{ row.specification }}</span
              > </template
            ><template slot="assetTypeName" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'assetTypeName')
                }"
                >{{ row.assetTypeName }}</span
              > </template
            ><template slot="assetSubtypeName" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'assetSubtypeName')
                }"
                >{{ row.assetSubtypeName }}</span
              > </template
            ><template slot="configuration" slot-scope="{ row }">
              <span
                :title="row.configuration"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'configuration'),
                  text_hidden: true
                }"
                >{{ row.configuration }}</span
              > </template
            ><template slot="number" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'number')
                }"
                >{{ row.number }}</span
              >

              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'unit')
                }"
                >{{ row.unit }}</span
              > </template
            ><template slot="purchaseDate" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'purchaseDate')
                }"
                >{{ row.purchaseDate }}</span
              > </template
            ><template slot="purchaseChannel" slot-scope="{ row }">
              <span
                :title="row.purchaseCode"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'purchaseChannel'),
                  text_hidden: true
                }"
                >{{ row.purchaseChannel }}</span
              > </template
            ><template slot="purchaseCode" slot-scope="{ row }">
              <span
                :title="row.purchaseCode"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'purchaseCode'),
                  text_hidden: true
                }"
                >{{ row.purchaseCode }}</span
              > </template
            ><template slot="purchaseUserName" slot-scope="{ row }">
              <span
                :title="row.purchaseUserName"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'purchaseUserName'),
                  text_hidden: true
                }"
                >{{ row.purchaseUserName }}</span
              > </template
            ><template slot="usableDuration" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'usableDuration')
                }"
                >{{ row.usableDuration }}</span
              > </template
            ><template slot="depreciationFormula" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(
                    row.changeField,
                    'depreciationFormula'
                  )
                }"
                >{{ row.depreciationFormula }}</span
              >
            </template>
            <template slot="purchaseMoney" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'purchaseMoney')
                }"
                >{{ row.purchaseMoney }}</span
              >
            </template>
            <template slot="depreciationMoney" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'depreciationMoney')
                }"
                >{{ row.depreciationMoney }}</span
              >
            </template>
            <template slot="state" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'state')
                }"
                >{{ row.state | getOptionsValue(userStatus) }}</span
              >
            </template>
            <template slot="occupantChainName" slot-scope="{ row }">
              <span
                :title="row.occupantChainName"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'occupantDeptName'),
                  text_hidden: true
                }"
                >{{ row.occupantChainName }}</span
              >
            </template>
            <template slot="occupantUserId" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'occupantUserId')
                }"
                >{{ row.occupantUserId }}</span
              >
            </template>
            <template slot="occupantUserName" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'occupantUserName')
                }"
                >{{ row.occupantUserName }}</span
              >
            </template>
            <template slot="originalOccupantUserName" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(
                    row.changeField,
                    'originalOccupantUserName'
                  )
                }"
                >{{ row.originalOccupantUserName }}</span
              >
            </template>
            <template slot="assetLocation" slot-scope="{ row }">
              <span
                :title="row.assetLocation"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'assetLocation'),
                  text_hidden: true
                }"
                >{{ row.assetLocation }}</span
              >
            </template>
            <template slot="occupantUserId" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'occupantUserId')
                }"
                >{{ row.occupantUserId }}</span
              >
            </template>
            <template slot="remark" slot-scope="{ row }">
              <span
                :title="row.remark"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'remark'),
                  text_hidden: true
                }"
                >{{ row.remark }}</span
              >
            </template>
            <template slot="cityName" slot-scope="{ row }">
              <span
                v-if="row.provinceName"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'provinceName')
                }"
              >
                {{ row.provinceName }} / {{ row.cityName }}</span
              >
            </template>
            <!-- <div
        v-for="item in config.tableColumns.filter(
          item => item.isHighlight === true
        )"
        :slot="item.prop"
        :key="item.prop"
        slot-scope="{ row }"
      >
        <span
          :class="{
            'c-F53F3F': isHighlight(row.changeField, item.prop)
          }"
          >{{ row[item.prop] }}</span
        >
      </div> -->
          </MPageLayout>
        </template>
        <template v-if="item.name === '2'">
          <MPageLayout
            ref="MPageLayout"
            type="tablePage"
            table-index-width="62px"
            :current-page="config.currentPage"
            :page-sizes="config.pageSizes"
            :page-size="config.pageSize"
            :total="config.total"
            :table-data="config.tableData"
            :table-columns="config.tableColumns1"
            :loading="loading"
            :slot-arr="['confirmTime', 'assetsPhotoUrl', 'footer']"
            layout="total, sizes, prev, pager, next, jumper"
            class="assetChangeRecords"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <template slot="assetsPhotoUrl" slot-scope="{ row }">
              <el-image
                v-if="row.assetsPhotoUrl"
                style="width: 80px; height: 60px"
                :src="row.assetsPhotoUrl"
                fit="contain"
                :preview-src-list="[row.assetsPhotoUrl]"
              />
            </template>
            <template slot="confirmTime" slot-scope="{ row }">
              <span>{{
                moment(row.confirmTime).format('YYYY-MM-DD HH:mm:ss')
              }}</span>
            </template>
          </MPageLayout>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  assetChangeRecordsColumns,
  assetConfirmRecordsColumns
} from '../tableColumns'
import { assetChangePageListAjax, confirmPageList } from '../../api/assets.js'
import { operateTypeOption, userStatus } from '../constants'
import { userNoPage } from '@/api/addressBookApi'

import moment from 'moment'
export default {
  data() {
    return {
      moment,
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: assetChangeRecordsColumns,
        tableColumns1: assetConfirmRecordsColumns
      },
      slotArr: [
        'footer',
        'search',
        'createTime',
        'operateType',
        'assetName',
        'assetCode',
        'originalAssetCode',
        'specification',
        'assetTypeName',
        'assetSubtypeName',
        'configuration',
        'number',
        'purchaseDate',
        'purchaseChannel',
        'purchaseCode',
        'purchaseUserName',
        'usableDuration',
        'depreciationFormula',
        'purchaseMoney',
        'depreciationMoney',
        'state',
        'occupantChainName',
        'occupantUserId',
        'occupantUserName',
        'originalOccupantUserName',
        'assetLocation',
        'remark',
        'cityName'
      ],
      editFormRow: {},
      title: '资产记录',
      search: {
        assetId: undefined,
        operateType: undefined,
        operateUserId: undefined,
        orderByWay: 0
      },
      operateTypeOption,
      userStatus,
      operateUserOptions: [],
      activeName: '1',
      tabs: [
        { label: '变更记录', name: '1' },
        { label: '确认记录', name: '2' }
      ]
    }
  },
  mounted() {
    this.$uweb?.setAction('Event_oa_fixedAsset_changeRecordsPage')
    this.handleSearch()
  },
  methods: {
    isHighlight(changeField, str) {
      if (changeField?.split(',').includes(str)) {
        return true
      }
      return false
    },
    queryFixedAssetsList() {
      const { assetId } = this.$route.query
      const params = {
        ...this.search,
        assetId,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }
      console.log(params, '查询参数')
      this.loading = true
      const Pro =
        this.activeName === '1' ? assetChangePageListAjax : confirmPageList
      Pro(params)
        .then(res => {
          if (res.code === 1) {
            this.config.tableData = res.data.items
            this.config.total = res.data.total
            // 刷新表格 防止对不齐
            this.$nextTick(() => {
              this.$refs.MPageLayout?.doLayout()
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCheckAllChange() {},
    handleClickUserStatusRow(row) {
      this.visibleDialogEditUserStatus = true
    },
    handleClickRow(row, btn) {
      this.editFormRow = JSON.parse(JSON.stringify(row))
      this.editFormRow.purchaseDate = new Date(this.editFormRow.purchaseDate)
      if (btn.value === 1) {
        this.visibleDialogEditAssets = true
      } else if (btn.value === 2) {
        // this.visibleDialogLogChange = true
        this.$router.push({ name: 'AssetChangeRecords' })
      } else if (btn.value === 3) {
        this.visibleDrawerMoreDeital = true
      } else if (btn.value === 0) {
        this.visibleDialogAllotAssets = true
      }
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.queryFixedAssetsList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.queryFixedAssetsList()
    },
    handleSelectionChange() {},
    async remoteMethodOperateUser(query) {
      const res = await userNoPage({ nickName: query })
      this.operateUserOptions = res.data
    },
    // 排序
    sortChange({ prop, order }) {
      this.search.orderByWay = 0
      const configMap = {
        createTime: {
          ascending: 0,
          descending: 1,
          default: 0
        }
      }
      if (prop === 'createTime') {
        this.search.orderByWay = configMap[prop][order]
      }
      this.queryFixedAssetsList()
    },
    // 重置
    handleClickReset() {
      this.search.operateType = undefined
      this.search.operateUserId = undefined
      this.search.orderByWay = 0
      this.handleSearch()
    },
    // 搜索
    handleSearch() {
      this.config.currentPage = 1
      this.queryFixedAssetsList()
    },
    handleTabClick(tab) {
      if (this.activeName === '1') {
        this.$uweb?.setAction('Event_oa_fixedAsset_changeRecordsPage')
      } else if (this.activeName === '2') {
        this.$uweb?.setAction('Event_oa_fixedAsset_confirmRecordsPage')
      }
      this.handleClickReset()
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
    height: calc(100vh - 300px);
  }
  .assetChangeRecords ::v-deep .el-table__cell {
    padding: 10px 6px;
  }
}
::v-deep .tablePage .page_header .page_header_action {
  justify-content: flex-end;
}
</style>
