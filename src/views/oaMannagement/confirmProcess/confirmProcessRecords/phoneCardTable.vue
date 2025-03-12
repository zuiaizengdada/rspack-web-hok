<template>
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
    :checkbox="confirmStatus === 1"
    reserve-selection
    if-index
    row-key="detailId"
    layout="total, sizes, prev, pager, next, jumper"
    class="assetChangeRecords"
    :default-sort="{ prop: 'createTime', order: null }"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    @handleSelectionChange="handleSelectionChange"
  >
    <template slot="search">
      <el-form ref="search" size="small" :inline="true" :model="search">
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input
            v-model="search.phoneNumber"
            clearable
            placeholder="请输入手机号码"
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="开卡人" prop="issuerId">
          <el-select
            v-model="search.issuerId"
            placeholder="请输入开卡人"
            filterable
            clearable
            :remote-method="remoteMethodIssuer"
            remote
            @change="handleSearch"
          >
            <el-option
              v-for="item in issuerOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开卡地" prop="cityCode">
          <el-select
            v-model="search.cityCode"
            clearable
            filterable
            placeholder="请选择开卡地"
            @change="handleSearch"
          >
            <el-option
              v-for="item in querySelectCityList"
              :key="item.cityCode"
              :label="`${item.provinceName}/${item.cityName}`"
              :value="item.cityCode"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="使用人" prop="occupantUserId">
          <el-select
            v-model="search.occupantUserId"
            filterable
            remote
            clearable
            size="small"
            placeholder="请输入使用人"
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
        <el-form-item>
          <el-button size="small" type="primary" @click="handleSearch"
            >查询</el-button
          >
          <el-button size="small" @click="handleClickReset">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template slot="headerLeft">
      <el-button
        v-if="confirmStatus === 1"
        size="small"
        type="primary"
        :disabled="selectList.length === 0"
        @click="batchSendNotice"
        >发送确认通知</el-button
      >
    </template>
    <template slot="communicationCompany" slot-scope="{ row }">
      <span>{{
        row.communicationCompany | getOptionsValue(communicationCompanyList)
      }}</span>
    </template>
    <template slot="cityName" slot-scope="{ row }">
      <span v-if="row.provinceName">
        {{ row.provinceName }} / {{ row.cityName }}</span
      >
    </template>
    <template slot="confirmStatus" slot-scope="{ row }">
      <span>{{
        row.confirmStatus | getOptionsValue(detailConfirmStatusOption)
      }}</span>
    </template>
    <template slot="lastNoticeTime" slot-scope="{ row }">
      <span>{{
        row.lastNoticeTime &&
        moment(row.lastNoticeTime).format('YYYY-MM-DD HH:mm:ss')
      }}</span>
    </template>
    <div slot="action" slot-scope="{ row }">
      <el-button-group>
        <template v-for="item in actionButtons">
          <el-button
            v-if="item.show(row)"
            :key="item.value"
            type="text"
            class="m-r-16"
            @click="handleClickRow(row, item)"
            >{{ item.label }}</el-button
          >
        </template>
      </el-button-group>
    </div>
  </MPageLayout>
</template>
<script>
import { phoneCardTableColumns } from '../tableColumns'
import {
  communicationCompanyList,
  detailConfirmStatusOption
} from '../constants'
import { userNoPage } from '@/api/addressBookApi'
import moment from 'moment'
import {
  confirmProcessDetailPageListAjax,
  confirmProcessNotifyAgainAjax
} from '../../api/confirmProcess.js'
import { cardSelectCityAjax } from '../../api/card.js'

export default {
  components: {},
  props: {
    confirmStatus: {
      type: Number,
      default: 1
    },
    assetType: {
      type: Number,
      default: 0
    },
    statId: {
      type: Number,
      default: 0
    }
  },
  data() {
    this.communicationCompanyList = communicationCompanyList
    this.detailConfirmStatusOption = detailConfirmStatusOption
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
        tableColumns: phoneCardTableColumns
      },
      slotArr: [
        'communicationCompany',
        'provinceName',
        'footer',
        'search',
        'cityName',
        'confirmStatus',
        'lastNoticeTime',
        'headerLeft',
        'action'
      ],
      editFormRow: {},
      title: '更多详情',
      search: {
        statId: undefined,
        confirmStatus: undefined,
        assetType: undefined,
        occupantUserId: undefined,
        issuerId: undefined
      },
      operateUserOptions: [],
      issuerOptions: [],
      activeName: '2',
      actionButtons: [
        {
          label: '再次通知',
          value: 1,
          show: row => {
            return [1, 2].includes(row.confirmStatus)
          }
        }
      ],
      selectList: [],
      curFormRow: {}, // 当前选择行
      querySelectCityList: []
    }
  },
  mounted() {
    this.handleSearch()
    this.querySelectCity()
  },
  methods: {
    sendNotice(data) {
      this.$confirm('是否向所选员工发送确认通知?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await confirmProcessNotifyAgainAjax(data)
        this.$message({
          type: 'success',
          message: '发送成功!'
        })
        this.handleSearch()
      })
    },
    // 批量确认
    batchSendNotice() {
      const data = this.selectList.map(v => v.detailId)
      this.sendNotice(data)
    },
    handleSelectionChange(row) {
      this.selectList = row
    },
    isHighlight(changeField, str) {
      if (changeField?.split(',').includes(str)) {
        return true
      }
      return false
    },
    // 搜索
    handleSearch() {
      this.config.currentPage = 1
      this.clearSelection()
      this.queryFixedAssetsList()
    },
    queryFixedAssetsList() {
      const params = {
        ...this.search,
        statId: this.statId,
        assetType: this.assetType,
        confirmStatus: this.confirmStatus,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }
      console.log(params, '查询参数')
      this.loading = true
      confirmProcessDetailPageListAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.config.tableData = res.data.items.map(item => {
              // 将 fixedAssetVo 中的每个属性复制到顶层
              this.assetType === 1 && Object.assign(item, item.fixedAssetVo)
              this.assetType === 2 && Object.assign(item, item.telephoneCardVo)
              // 删除原有的 fixedAssetVo 属性
              delete item.fixedAssetVo
              delete item.telephoneCardVo
              return item
            })
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
      this.curFormRow = JSON.parse(JSON.stringify(row))
      if (btn.value === 1) {
        const data = [this.curFormRow.detailId]
        this.sendNotice(data)
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
    async remoteMethodOperateUser(query) {
      const res = await userNoPage({ nickName: query })
      this.operateUserOptions = res.data
    },
    async remoteMethodIssuer(query) {
      const res = await userNoPage({ nickName: query })
      this.issuerOptions = res.data
    },
    // 重置
    handleClickReset() {
      this.search.occupantUserId = undefined
      this.search.issuerId = undefined
      this.search.cityCode = undefined
      this.search.phoneNumber = undefined
      this.handleSearch()
    },
    clearSelection() {
      this.$nextTick(() => {
        this.$refs?.MPageLayout?.clearSelection()
      })
    },
    async querySelectCity() {
      const res = await cardSelectCityAjax()
      this.querySelectCityList = res.data
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .tablePage .page_header .page_header_action {
  // justify-content: flex-end;
}
</style>
