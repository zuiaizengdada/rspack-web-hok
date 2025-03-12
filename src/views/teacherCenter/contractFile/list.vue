<template>
  <MCard>
    <div class="contractFile_page_wrap">
      <div class="search">
        <div class="search_form" style="flex: 1 0 0">
          <el-form :inline="true" :model="search" size="small">
            <el-form-item label="IP姓名">
              <teacherSelect v-model="search.teacherId" @clear="searchFn()" @select="searchFn" />
            </el-form-item>
            <el-form-item label="合同主体">
              <el-select v-model="search.subjectId" clearable @change="searchFn" @clear="searchFn">
                <el-option
                  v-for="(item, index) in companyList"
                  :key="index"
                  :label="item.contractSubject"
                  :value="item.subjectId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="合同状态">
              <el-select v-model="search.cooperateStatus" clearable @change="searchFn" @clear="searchFn">
                <el-option
                  v-for="(item, index) in CONTRACT_STATE"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否有电子附件">
              <el-select v-model="search.isHave" clearable @change="searchFn" @clear="searchFn">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="创建日期">
              <el-date-picker
                v-model="createTimeValue"
                type="daterange"
                style="width:228px"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                @change="handleCreateChange"
                @blur="currentTime = ''"
              />
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" :loading="loading" @click="searchFn">查询</el-button>
              <el-button size="small" :loading="loading" @click="clear">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="min-width: 228px">
            <el-button
              v-permission="['web:contractList:setting', permsList]"
              class="fr m-l-10"
              size="small"
              :loading="loading"
              @click="openRemindSetting()"
            >合同到期提醒设置</el-button>
            <el-button
              v-permission="['web:contractList:add', permsList]"
              type="primary"
              size="small"
              class="fr"
              :loading="loading"
              @click="gotoAdd"
            >新增合同</el-button>
          </div>
        </div>
        <!-- <div class="search_btn">
        </div> -->
      </div>
      <div class="tableModel">
        <!-- 合同档案 -->
        <MPageLayout
          ref="MPageLayout"
          type="tablePage"
          :slot-arr="slotArr"
          row-key="contractCode"
          checkbox
          :current-page="config.currentPage"
          :page-sizes="config.pageSizes"
          :page-size="config.pageSize"
          :total="config.total"
          :table-data="config.tableData"
          :table-columns="config.tableColumns"
          reserve-selection
          :loading="loading"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @handleSelectionChange="handleSelectionChange"
        >
          <div slot="action" slot-scope="{ row }">
            <el-button
              v-permission="['web:contractList:detail', permsList]"
              type="text"
              @click="gotoDetail(row)"
            >详情</el-button>
            <el-button
              v-permission="['web:contractList:edit', permsList]"
              type="text"
              @click="gotoEdit(row)"
            >编辑</el-button>
          </div>
          <template #footer>
            <span class="download-count-text">共选{{ multipleSelection.length }}个</span>
            <el-button
              v-permission="['web:contractList:batchImport', permsList]"
              type="primary"
              size="small"
              @click="batchDownload"
            >批量导出</el-button>
          </template>
          <template slot="contractStartTime" slot-scope="{ row }">
            {{ row.contractStartTime | parseTime('{y}-{m}-{d}') }}
          </template>
          <template slot="contractEndTime" slot-scope="{ row }">
            {{ row.contractEndTime | parseTime('{y}-{m}-{d}') }}
          </template>
        </MPageLayout>
      </div>
      <RemindSettingDialog :config="remindDialog" />
    </div>
  </MCard>
</template>

<script>
import { CONTRACT_STATE, SETTLEMENT_INTERVAL, CONTRACT_CATEGORY, CONTRACT_TYPE } from '../enum.js'
import teacherSelect from '../components/teacherSelect/index'
import RemindSettingDialog from './remindDialog.vue'
import { teacherContarctList, getCompanyList, teacherContractFileToZip } from '@/api/tearchCenter'
import { getOptionsValue } from '@/filters'
export default {
  components: {
    teacherSelect,
    RemindSettingDialog
  },
  data() {
    return {
      CONTRACT_STATE,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'contractStartTime', 'contractEndTime'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'teacherName', label: 'IP姓名', type: 'text', width: 180, fixed: 'left' },
          { prop: 'contractCode', label: '合同编号', type: 'text', width: 200 },
          { prop: 'contractSubject', label: '合同主体', type: 'text', width: 250 },
          {
            prop: 'contractType',
            label: '合同类型',
            type: 'text',
            width: 100,
            slotFn: (row) => getOptionsValue(row.contractType, CONTRACT_TYPE)
          },
          { prop: 'contractName', label: '合同名称', type: 'text', width: 240 },
          { prop: 'companyPartOne', label: '甲方单位名称', type: 'text', width: 240 },
          { prop: 'companyPartOneOperator', label: '甲方经办人', type: 'text', width: 140 },
          { prop: 'companyPartTwo', label: '乙方单位名称', type: 'text', width: 240 },
          { prop: 'companyPartTwoOperator', label: '乙方经办人', type: 'text', width: 140 },
          { prop: 'companyPartThree', label: '丙方单位名称', type: 'text', width: 240 },
          { prop: 'companyPartThreeOperator', label: '丙方经办人', type: 'text', width: 140 },
          {
            prop: 'contractCategory',
            label: '合作方式',
            type: 'text',
            width: 160,
            slotFn: (row) => getOptionsValue(row.contractCategory, CONTRACT_CATEGORY)
          },
          { prop: 'cooperativeSharingModel', label: '合作模式', type: 'text', width: 100 },
          { prop: 'teacherPhoneNumber', label: 'IP联系方式', type: 'text', width: 140 },
          { prop: 'teacherIdentityNumber', label: 'IP身份证号码', type: 'text', width: 180 },
          { prop: 'contractStartTime', label: '合同开始日期', type: 'slot', width: 120 },
          { prop: 'contractEndTime', label: '合同到期日期', type: 'slot', width: 120 },
          {
            prop: 'contractExpirationTime',
            label: '合同年限',
            type: 'text',
            width: 100,
            slotFn: (row) => row.contractExpirationTime + '月'
          },
          {
            prop: 'contractState',
            label: '合同状态',
            type: 'text',
            width: 100,
            slotFn: (row) => getOptionsValue(row.contractState, CONTRACT_STATE)
          },
          {
            prop: 'settlementInterval',
            label: '结算周期',
            type: 'text',
            width: 100,
            slotFn: (row) => getOptionsValue(row.settlementInterval, SETTLEMENT_INTERVAL)
          },
          {
            prop: 'have',
            label: '是否有电子附件',
            type: 'text',
            width: 120,
            slotFn: (row) => (row.have ? '是' : '否')
          },
          {
            prop: 'createName',
            label: '创建人',
            type: 'text',
            width: 90
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'text',
            width: 140
          },
          {
            prop: 'updateName',
            label: '修改人',
            type: 'text',
            width: 90
          },
          {
            prop: 'updateTime',
            label: '修改时间',
            type: 'text',
            width: 140
          },
          { prop: 'action', label: '操作', type: 'slot', width: 100, fixed: 'right' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      createTimeValue: [],
      currentTime: '',
      pickerOptions: {
        disabledDate: time => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime != '') {
            // 一年以内
            const one = 365 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            const minTime = this.currentTime - one
            const maxTime = this.currentTime + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      search: {
        teacherId: '',
        cooperateStatus: '',
        isHave: '',
        loading: false,
        subjectId: '',
        createTimeBegin: '',
        createTimeEnd: ''
      },
      options: [],
      loading: false,
      multipleSelection: [],
      remindDialog: {
        loading: false,
        visible: false,
        title: '合同到期提醒'
      },
      companyList: [],
      permsList: this.$route.meta.permsList || []
    }
  },
  activated() {
    this.getList()
  },
  mounted() {
    this.searchFn()
    this.getCompanyList()
  },
  methods: {
    // 页码改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    // 获取合同主体
    getCompanyList() {
      this.loading = true
      getCompanyList()
        .then((res) => {
          this.companyList = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCreateChange(val) {
      if (val && val.length) {
        this.search.createTimeBegin = val[0]
        this.search.createTimeEnd = val[1]
      } else {
        this.search.createTimeBegin = undefined
        this.search.createTimeEnd = undefined
      }
      this.searchFn()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 点击详情跳转详情页面
    gotoDetail(row) {
      this.$router.push(`/teacherCenter/contractFile/detail/${row.contractCode}`)
    },
    // 点击跳转新增页面
    gotoAdd() {
      this.$router.push(`/teacherCenter/contractFile/add`)
    },
    // 点击跳转编辑页面
    gotoEdit(row) {
      this.$router.push(`/teacherCenter/contractFile/edit/${row.contractCode}`)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async batchDownload() {
      if (!this.multipleSelection.length) {
        this.$notify.warning('请先勾选列表数据')
        return
      }
      this.loading = true
      try {
        const { data } = await teacherContractFileToZip({ list: this.multipleSelection.map(i => i.contractCode) })
        this.loading = false
        window.open(data)
      } catch (e) {
        this.loading = false
      }
    },
    // 清空触发
    clear() {
      this.search = {
        teacherId: '',
        cooperateStatus: '',
        isHave: '',
        loading: false,
        subjectId: '',
        createTimeBegin: '',
        createTimeEnd: ''
      }
      this.createTimeValue = []
      this.handleCreateChange()
      this.searchFn()
    },
    // 获取列表
    getList() {
      this.loading = true
      this.config.tableData = []
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        contractState: this.search.cooperateStatus,
        have: this.search.isHave,
        teacherId: this.search.teacherId,
        subjectId: this.search.subjectId,
        createTimeBegin: this.search.createTimeBegin,
        createTimeEnd: this.search.createTimeEnd
      }
      teacherContarctList(params)
        .then((res) => {
          this.loading = false
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.$refs.MPageLayout.doLayout()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 点击打开合同到期提醒
    openRemindSetting() {
      this.remindDialog.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.contractFile_page_wrap {
  // height: calc(100vh - 92px);
  border-radius: 10px;
  // min-height: calc(100vh - 144px);
  // min-height: calc(100vh - 144px);
  background: #fff;
  display: flex;
  flex-direction: column;
  .search {
    margin-left: 20px;
    margin-right: 20px;
    border-bottom: 1px solid #e7e7e7;
    padding-bottom: 20px;
    .search_form {
      display: flex;
      justify-content: space-between;
      .search_btn {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .download-count-text{
    color: #777;
    margin-right: 15px;
  }
  .tableModel {
    // flex: 1 0 0;
    height: calc(100vh - 251px);
  }
}
</style>
