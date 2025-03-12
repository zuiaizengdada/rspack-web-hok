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
    reserve-selection
    if-index
    row-key="detailId"
    :checkbox="confirmStatus === 1"
    layout="total, sizes, prev, pager, next, jumper"
    class="assetChangeRecords"
    :default-sort="{ prop: 'createTime', order: null }"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    @handleSelectionChange="handleSelectionChange"
  >
    <template slot="search">
      <el-form ref="search" size="small" :inline="true" :model="search">
        <el-form-item label="使用人" prop="occupantUserId">
          <el-select
            v-model="search.occupantUserId"
            filterable
            remote
            placeholder="请输入使用人"
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
        <el-form-item label="使用部门" prop="occupantDeptIds">
          <el-cascader
            v-model="search.occupantDeptIds"
            placeholder="请选择使用部门"
            :options="deptTreeArray"
            :props="{ multiple: true, emitPath: false, checkStrictly: true }"
            clearable
            @change="changeCascader"
          />
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
    <template slot="assetCode" slot-scope="{ row }">
      <el-popover
        placement="top-start"
        title="原资产编号"
        width="180"
        trigger="click"
        :disabled="!hasValue(row.originalAssetCode)"
        :content="row.originalAssetCode"
      >
        <div
          slot="reference"
          :title="row.assetCode"
          :class="{
            text_hidden: true,
            c_0C6FFF: hasValue(row.originalAssetCode),
            cursorPoninter: hasValue(row.originalAssetCode)
          }"
        >
          {{ row.assetCode }}
        </div>
      </el-popover>
    </template>
    <template slot="cityName" slot-scope="{ row }">
      <span v-if="row.provinceName">
        {{ row.provinceName }} / {{ row.cityName }}</span
      >
    </template>
    <template slot="assetsPhotoUrl" slot-scope="{ row }">
      <el-image
        v-if="row.assetsPhotoUrl"
        style="width: 80px; height: 60px"
        :src="row.assetsPhotoUrl"
        fit="contain"
        :preview-src-list="[row.assetsPhotoUrl]"
      />
    </template>
    <template slot="confirmStatus" slot-scope="{ row }">
      <span>{{
        row.confirmStatus | getOptionsValue(detailConfirmStatusOption)
      }}</span>
    </template>
    <template slot="lastNoticeTime" slot-scope="{ row }">
      <span>
        {{
          row.lastNoticeTime &&
          moment(row.lastNoticeTime).format('YYYY-MM-DD HH:mm:ss')
        }}</span
      >
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
import { fixedAssetsTableColumns } from '../tableColumns'
import { detailConfirmStatusOption } from '../constants'
import { deptTree, userNoPage } from '@/api/addressBookApi'
import moment from 'moment'
import {
  confirmProcessDetailPageListAjax,
  confirmProcessNotifyAgainAjax
} from '../../api/confirmProcess.js'
import { hasValue } from '@/utils/index'

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
    this.detailConfirmStatusOption = detailConfirmStatusOption
    return {
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: fixedAssetsTableColumns
      },
      slotArr: [
        'assetCode',
        'cityName',
        'footer',
        'search',
        'assetsPhotoUrl',
        'confirmStatus',
        'lastNoticeTime',
        'action',
        'headerLeft'
      ],
      editFormRow: {},
      title: '更多详情',
      search: {
        statId: undefined,
        confirmStatus: undefined,
        assetType: undefined,
        occupantUserId: undefined,
        occupantDeptIds: [] // 使用部门ID
      },
      operateUserOptions: [],
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
      deptTreeArray: []
    }
  },
  mounted() {
    this.handleSearch()
    this.getDeptTree()
  },
  methods: {
    moment,
    hasValue,
    sendNotice(data, type) {
      this.$confirm('是否向所选员工发送确认通知?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (type === 1) {
          this.$uweb?.setAction('Event_oa_confirmProcess_notifyAgain')
        } else if (type === 2) {
          this.$uweb?.setAction('Event_oa_confirmProcess_batchConfirm')
        }
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
      const type = 2
      const data = this.selectList.map(v => v.detailId)
      this.sendNotice(data, type)
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
      this.loading = true
      confirmProcessDetailPageListAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.config.tableData = res.data.items.map(item => {
              // 将 fixedAssetVo 中的每个属性复制到顶层
              delete item.fixedAssetVo.assetsPhotoUrl // 防止被覆盖
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
        const type = 1
        this.sendNotice(data, type)
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
    handleSelectionChange(row) {
      this.selectList = row
    },
    async remoteMethodOperateUser(query) {
      const res = await userNoPage({ nickName: query })
      this.operateUserOptions = res.data
    },
    // 重置
    handleClickReset() {
      this.search.occupantUserId = undefined
      this.search.occupantDeptIds = []
      this.handleSearch()
    },
    clearSelection() {
      this.$nextTick(() => {
        this.$refs?.MPageLayout?.clearSelection()
      })
    },
    async getDeptTree() {
      const res = await deptTree()
      const list = this.encapsulateData(res.data)
      this.deptTreeArray = list
    },
    encapsulateData(array) {
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
      return array
    },
    changeCascader() {
      this.handleClickQuery()
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .tablePage .page_header .page_header_action {
  // justify-content: flex-end;
}
</style>
