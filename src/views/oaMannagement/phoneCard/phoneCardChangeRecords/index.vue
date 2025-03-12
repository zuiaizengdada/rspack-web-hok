<template>
  <div class="fixed-assets-container">
    <div class="crumbs-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          :to="{
            path: '/oaManagement/oaMannagementIndex',
            query: { tab: 'phoneCard' }
          }"
          class="nav-list"
          >电话卡</el-breadcrumb-item
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
            table-index-width="62px"
            :slot-arr="slotArr"
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
                    clearable
                    size="small"
                    class="w-200 m-r-10"
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
                    placeholder="请选择"
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
            <template slot="phoneNumber" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'phoneNumber')
                }"
                >{{ row.phoneNumber }}</span
              >
            </template>
            <template slot="embryoEndNumber" slot-scope="{ row }">
              <span
                :title="row.embryoEndNumber"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'embryoEndNumber'),
                  text_hidden: true
                }"
                >{{ row.embryoEndNumber }}</span
              >
            </template>
            <template slot="communicationCompany" slot-scope="{ row }">
              <span
                :title="row.communicationCompany"
                :class="{
                  'c-F53F3F': isHighlight(
                    row.changeField,
                    'communicationCompany'
                  ),
                  text_hidden: true
                }"
                >{{
                  row.communicationCompany
                    | getOptionsValue(communicationCompanyList)
                }}</span
              >
            </template>
            <template slot="issuerName" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'issuerName')
                }"
                >{{ row.issuerName }}</span
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
            <template slot="occupantDeptName" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'occupantDeptName')
                }"
                >{{ row.occupantDeptName }}</span
              >
            </template>
            <template slot="occupantDate" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'occupantDate')
                }"
                >{{ row.occupantDate }}</span
              >
            </template>
            <template slot="cityName" slot-scope="{ row }">
              <span
                v-if="row.provinceName"
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'cityName')
                }"
              >
                {{ row.provinceName }} / {{ row.cityName }}</span
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
            <template slot="state" slot-scope="{ row }">
              <span
                :class="{
                  'c-F53F3F': isHighlight(row.changeField, 'state')
                }"
                >{{ row.state | getOptionsValue(stateList) }}</span
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
            :slot-arr="['confirmTime', 'footer']"
            layout="total, sizes, prev, pager, next, jumper"
            class="assetChangeRecords"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
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
  phoneChangeRecordsColumns,
  phoneComfirmRecordsColumns
} from '../tableColumns'
import { phoneCardChangePageListAjax, confirmPageList } from '../../api/card.js'
import {
  operateTypeOption,
  stateList,
  communicationCompanyList
} from '../constants'
import { userNoPage } from '@/api/addressBookApi'
import moment from 'moment'

export default {
  components: {},
  data() {
    this.communicationCompanyList = communicationCompanyList
    this.stateList = stateList
    this.operateTypeOption = operateTypeOption
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
        tableColumns: phoneChangeRecordsColumns,
        tableColumns1: phoneComfirmRecordsColumns
      },
      slotArr: [
        'createTime',
        'operateType',
        'footer',
        'search',
        'phoneNumber',
        'embryoEndNumber',
        'issuerName',
        'occupantUserId',
        'occupantUserName',
        'communicationCompany',
        'occupantDeptName',
        'occupantDate',
        'originalOccupantUserName',
        'state',
        'cityName',
        'remark'
      ],
      editFormRow: {},
      title: '电话卡变更记录',
      search: {
        cardId: undefined,
        operateType: undefined,
        operateUserId: undefined,
        orderByWay: 0
      },
      operateUserOptions: [],
      activeName: '1',
      tabs: [
        { label: '变更记录', name: '1' },
        { label: '确认记录', name: '2' }
      ]
    }
  },
  mounted() {
    this.$uweb?.setAction('Event_oa_phoneCard_changeRecordsPage')
    this.handleSearch()
  },
  methods: {
    isHighlight(changeField, str) {
      if (changeField?.split(',').includes(str)) {
        return true
      }
      return false
    },
    // 搜索
    handleSearch() {
      this.config.currentPage = 1
      this.queryFixedAssetsList()
    },
    queryFixedAssetsList() {
      const { cardId } = this.$route.query
      const params = {
        ...this.search,
        cardId,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }
      console.log(params, '查询参数')
      this.loading = true
      const Pro =
        this.activeName === '1' ? phoneCardChangePageListAjax : confirmPageList
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
    // 重置
    handleClickReset() {
      this.search.operateType = undefined
      this.search.operateUserId = undefined
      this.search.orderByWay = 0
      this.handleSearch()
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
    handleTabClick(tab) {
      if (this.activeName === '1') {
        this.$uweb?.setAction('Event_oa_phoneCard_changeRecordsPage')
      } else if (this.activeName === '2') {
        this.$uweb?.setAction('Event_oa_phoneCard_confirmRecordsPage')
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
    height: calc(100vh - 200px);
  }
  .assetChangeRecords ::v-deep .el-table__cell {
    padding: 10px 6px;
  }
}
::v-deep .tablePage .page_header .page_header_action {
  justify-content: flex-end;
}
</style>
