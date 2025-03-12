<template>
  <el-drawer
    title="助教规则库"
    size="80%"
    class="dialog-container"
    :visible.sync="visible"
  >
    <div v-loading="loading" class="AssistantDialog overflowOuto">
      <div class="dialog-header">
        <el-button
          size="small"
          @click="handleSelectRule"
        >选择已有规则库
        </el-button>
        <el-button
          size="small"
          @click="handleSaveRule"
        >保存当前到的规则库
        </el-button>
        <el-form
          ref="ruleForm"
          label-width="80px"
          :rules="rules"
          :model="form"
          size="small"
        >
          <el-form-item label="IP：">
            <span>{{ form.userName }}</span>
          </el-form-item>
          <el-form-item label="课程类型：" prop="assistantUserId">
            <span>{{ form.courseTypeName }}</span>
          </el-form-item>
          <el-form-item label="分配规则：" prop="allocationRules">
            <el-radio-group v-model="form.allocationRules" @change="handleCheck">
              <el-radio :label="1">轮询分配
                <span class="tips">每轮分配1个学员给正常分配的助教，直到分配最大接待人数为止</span>
              </el-radio>
              <el-radio :label="2">依次阶梯分配
                <span class="tips">按正常分配的助教顺序依次分满</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="兜底助教：" prop="assistantUserId">
            <span>{{ `${form.deptName || ''} - ${form.assistantUserName || ''}` }}</span>
            <el-button
              type="text"
              style="margin-left:5px"
              @click="handleSelectUser"
            >选择</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-form
        label-position="top"
        label-width="80px"
        :rules="rules"
        class="form-box"
        :model="form"
        size="small"
      >
        <el-form-item label="助教列表" prop="name">
          <MPageLayout
            ref="MPageLayout"
            type="tablePage"
            class="drop-table"
            row-key="id"
            :slot-arr="slotArr"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :total="total"
            :table-data="tableData"
            :table-columns="tableColumns"
            layout="total, sizes, prev, pager, next, jumper"
            checkbox
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @handleSelectionChange="handleSelectionChange"
            @sort-change="handleSortChange"
          >
            <template slot="search">
              <el-form
                ref="ruleForm"
                label-width="70px"
                :inline="true"
                :model="search"
                size="small"
              >
                <el-form-item label-width="40px" label="班期">
                  <el-select
                    v-model="search.scheduleId"
                    placeholder="请选择"
                    clearable
                    @change="handleChangeScheduleId"
                  >
                    <el-option
                      v-for="item in scheduleList"
                      :key="item.id"
                      :label="item.scheduleNum"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="助教名称">
                  <el-input
                    v-model="search.assistantUserName"
                    style="width: 200px"
                    placeholder="请输入"
                    clearable
                    @clear="searchFn"
                  />
                </el-form-item>
                <el-form-item label="分配状态">
                  <el-select
                    v-model="search.allocationState"
                    placeholder="请选择"
                    clearable
                    @clear="searchFn"
                  >
                    <el-option label="正常分配" :value="1" />
                    <el-option label="暂停分配" :value="0" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="small"
                    type="primary"
                    @click="searchFn"
                  >查询</el-button>
                  <el-button size="small" @click="clear">重置</el-button>
                </el-form-item>
              </el-form>
            </template>
            <template #price="{row}">
              <div class="flex flex-middle">
                <div v-if="row.isWholePrice === 0">
                  {{ `${getPrice(row.startPrice)} — ${getPrice(row.endPrice)}` }}
                </div>
                <div v-else>
                  全部
                </div>
                <img
                  class="table-edit_icon"
                  src="@/assets/image/icon-edit.webp"
                  alt=""
                  @click="openPrice(row)"
                />
              </div>
            </template>
            <template #receptionsNum="{row}">
              <div v-if="!row.editPrice" class="flex flex-middle">
                <div>
                  {{ row.receptionsNum }}
                </div>
                <img
                  class="table-edit_icon"
                  src="@/assets/image/icon-edit.webp"
                  alt=""
                  @click="handleEditPrice(row)"
                />
              </div>
              <div v-else class="flex flex-middle">
                <el-input-number
                  ref="receptionsNum"
                  v-model="row.receptionsNum"
                  style="width:80px"
                  :controls="false"
                  :precision="0"
                  :min="1"
                  :max="500"
                  @blur="handleChangeNum(row)"
                />
              </div>
            </template>
            <template #allocationState="{row}">
              <span
                :class="row.allocationState === 0 ? 'red' : 'green'"
              >{{ { 0: '暂停分配', 1: '正常分配' }[row.allocationState] }}
              </span>
            </template>
            <template #deliveredRatio="{row}">
              <span :class="{red:isMin60(row.deliveredRatio)}">{{ row.deliveredRatio !== null ?row.deliveredRatio+'%' : '——' }}</span>
            </template>
            <template #headerLeft>
              <div style="margin-bottom:20px">
                <el-button
                  size="small"
                  class="btn_primary"
                  @click="handleClickAdd"
                >新增人员</el-button>
              </div>
            </template>
            <template slot="footer">
              <el-button
                size="small"
                :disabled="multipleSelection.length === 0"
                @click="openBatchPrice"
              >课程价格</el-button>
              <el-button
                size="small"
                :disabled="multipleSelection.length === 0"
                @click="handleSetBatchState(0)"
              >暂停分配</el-button>
              <el-button
                size="small"
                :disabled="multipleSelection.length === 0"
                @click="handleSetBatchState(1)"
              >继续分配</el-button>
              <el-button
                size="small"
                :disabled="multipleSelection.length === 0"
                @click="handleClickBatchDel"
              >批量删除</el-button>
            </template>
            <template #action-header>
              <div class="flex flex-between flex-middle">
                <span>操作</span>
                <el-button type="text" size="small" @click="clearOrder">默认排序</el-button>
              </div>
            </template>
            <template slot="action" slot-scope="{ row }">
              <el-button
                v-if="row.allocationState === 0"
                type="text"
                @click="handleSetState(row)"
              >继续分配</el-button>
              <el-button
                v-else
                type="text"
                @click="handleSetState(row)"
              >暂停分配</el-button>
              <el-button
                type="text"
                style="color:#F53F3F"
                @click="handleClickDel(row)"
              >删除</el-button>
              <el-button
                v-if="row.allocationState === 1 && !search.orderType"
                type="text"
                class="drop-class"
                style="cursor: move;"
              >拖动排序</el-button>
            </template>
          </MPageLayout>
        </el-form-item>
      </el-form>
    </div>
    <saveRule ref="saveRule" />
    <selectRule ref="selectRule" @select="handleOk" />
    <addUserModal ref="addUserModal" @success="searchFn" />
    <batchSetPrice ref="batchSetPrice" @success="searchFn" />
  </el-drawer>
</template>

<script>
import {
  assistantSettingDel,
  assistantSettingEdit,
  assistantAllocationRules,
  assistantSettingScheduleList,
  assistantSettingDetailPage,
  assistantReceptionsNum,
  assistantSettingEditState,
  assistantSettingSort,
  assistantSettingCover
} from '@/api/deliver/assistant'
import { assistantDetail } from '@/api/deliver/assistant'
import saveRule from './saveRule'
import Sortable from 'sortablejs'
import moment from 'moment'
import selectRule from './selectRule'
import addUserModal from './addUserModal'
import batchSetPrice from './batchSetPrice'
export default {
  components: {
    saveRule,
    selectRule,
    addUserModal,
    batchSetPrice
  },
  data() {
    return {
      num: 1,
      loading: false,
      slotArr: ['search', 'action', 'action-header', 'footer', 'headerLeft', 'price', 'receptionsNum', 'deliveredRatio', 'allocationState'],
      tableData: [],
      visible: false,
      tableColumns: [
        { prop: 'deptName', label: '部门名称', type: 'text', width: 100 },
        { prop: 'assistantUserName', label: '助教名称', type: 'text' },
        {
          prop: 'allocationState',
          label: '分配状态',
          type: 'slot',
          render: row => {
            return { 0: '暂停分配', 1: '正常分配' }[row.allocationState]
          }
        },
        {
          prop: 'undeliveredCount',
          label: '未交付人数',
          type: 'text',
          width: 100
        },
        {
          prop: 'deliveredCount',
          label: '入班人数',
          type: 'text',
          sortable: 'custom',
          width: 100,
          slotFn: (row) => row.deliveredCount ?? '——'
        },
        {
          prop: 'deliveredRatio',
          label: '入班率',
          type: 'slot',
          sortable: 'custom',
          width: 100,
          slotFn: (row) => row.deliveredRatio ?? '——'
        },
        {
          prop: 'receptionsNum',
          label: '最大接待数',
          type: 'slot',
          width: 120
        },
        {
          prop: 'price',
          label: '接待课程价格',
          type: 'slot',
          width: 120
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          type: 'text',
          width: 170,
          render: row => {
            return row.updateTime
              ? moment(row.updateTime).format('yyyy-MM-DD HH:mm')
              : ''
          }
        },
        { prop: 'action', headerSlot: true, label: '操作', type: 'slot', width: 190 }
      ],
      rules: {},
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      search: {
        scheduleId: '',
        allocationState: '',
        assistantUserName: '',
        orderBy: undefined,
        orderType: ''
      },
      form: {
        allocationRules: 1,
        assistantUserId: '',
        assistantUserName: '',
        deptName: '',
        courseTypeName: '',
        userName: ''
      },
      current: {},
      scheduleList: [],
      assistantList: [],
      sortable: null,
      sortForm: {}
    }
  },
  methods: {
    open(row) {
      this.current = row
      this.search = {
        scheduleId: '',
        allocationState: '',
        assistantUserName: '',
        orderBy: undefined,
        orderType: ''
      }
      this.init()
      this.visible = true
    },
    handleEditPrice(row) {
      row.editPrice = true
      row.receptionsNumCopy = row.receptionsNum
      this.$nextTick(() => {
        this.$refs.receptionsNum.focus()
      })
    },
    clearOrder() {
      this.search.orderBy = undefined
      this.search.orderType = undefined
      console.log(this.$refs.MPageLayout)
      this.$refs.MPageLayout.clearSort()
      this.getList()
    },
    isMin60(num) {
      if (!num) {
        return false
      }
      if (num && num < 60) {
        return true
      }
      return false
    },
    async handleChangeNum(row) {
      if (row.receptionsNumCopy === row.receptionsNum) {
        row.editPrice = false
        return
      }
      const { code } = await assistantReceptionsNum({
        id: row.id,
        num: row.receptionsNum
      })
      if (code === 1) {
        // eslint-disable-next-line require-atomic-updates
        row.editPrice = false
        this.$message.success('修改成功')
        this.getList()
      }
    },
    handleSortChange(row) {
      if (row.prop && row.order && this.search.scheduleId) {
        this.search.orderBy = {
          deliveredRatio: 1,
          deliveredCount: 2
        }[row.prop]
        this.search.orderType = {
          ascending: 1,
          descending: 2
        }[row.order]
      } else {
        this.search.orderBy = undefined
        this.search.orderType = undefined
      }
      this.getList()
    },
    handleChangeScheduleId() {
      this.search.orderBy = undefined
      this.search.orderType = undefined
      this.getList()
    },
    handleSelectUser() {
      const checkUser = this.form.assistantUserId ? [{
        userId: this.form.assistantUserId,
        nickName: this.form.assistantUserName,
        deptName: this.form.deptName
      }] : []
      this.$AddressBook({
        visible: true,
        multiple: false,
        checkUser,
        type: [1],
        success: async (res) => {
          if (res.user.length > 0) {
            const params = {
              id: this.current.id,
              userId: res.user[0].userId,
              userName: res.user[0].nickName
            }
            const { code } = await assistantSettingEdit(params)
            if (code === 1) {
              this.form.assistantUserId = res.user[0].userId
              this.form.assistantUserName = res.user[0].nickName
              this.form.deptName = res.user[0].deptName
            }
          }
        }
      })
    },
    openPrice(row) {
      const userId = [{
        id: row.id,
        userName: row.assistantUserName
      }]
      this.$refs.batchSetPrice.open({
        userId,
        id: this.current.id,
        startPrice: row.startPrice,
        endPrice: row.endPrice,
        isWholePrice: row.isWholePrice
      })
    },
    openBatchPrice() {
      const userId = this.multipleSelection.map(i => {
        return {
          id: i.id,
          userName: i.assistantUserName
        }
      })
      this.$refs.batchSetPrice.open({
        userId,
        id: this.current.id
      })
    },
    async handleOk(warehouseId) {
      try {
        this.loading = true
        const { code } = await assistantSettingCover({
          settingId: this.current.id,
          warehouseId
        })
        if (code === 1) {
          this.init()
          this.loading = false
        }
      } catch {
        this.loading = false
      }
    },
    handleSaveRule() {
      this.$refs.saveRule.open({
        ...this.form,
        id: this.current.id
      })
    },
    handleSelectRule() {
      this.$refs.selectRule.open()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        scheduleId: this.search.scheduleId,
        allocationState: this.search.allocationState,
        assistantUserName: this.search.assistantUserName,
        settingId: this.current.id,
        orderBy: this.search.orderBy,
        orderType: this.search.orderType
      }
      return assistantSettingDetailPage(params)
        .then(res => {
          this.tableData = []
          this.loading = false
          this.tableData = res.data.items.map(i => {
            return {
              ...i,
              editPrice: false
            }
          })
          this.$nextTick(() => {
            this.rowDrop()
            this.$refs.MPageLayout.doLayout()
          })
          this.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    getPrice(price) {
      if (typeof price === 'number') {
        return price / 100
      }
      return price
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    async handleCheck() {
      const { code } = await assistantAllocationRules({
        id: this.current.id,
        rules: this.form.allocationRules
      })
      if (code === 1) {
        this.$message.success('修改成功')
      }
    },
    // 点击新增按钮
    handleClickAdd() {
      this.$refs.addUserModal.open(this.current.id)
    },
    async handleSetState(row) {
      const { data, code } = await assistantSettingEditState({
        ids: [row.id],
        state: row.allocationState === 0 ? 1 : 0,
        settingId: this.current.id
      })
      if (code === 1) {
        this.$message.success(data ?? '操作成功')
        this.searchFn()
      }
    },
    rowDrop() {
      const tbody = document.querySelector('.drop-table tbody')
      this.sortable && this.sortable.destroy()
      const tableData = JSON.parse(JSON.stringify(this.tableData))
      const tableIds = tableData.map(i => i.id)
      if (tbody) {
        const _this = this
        this.sortable = Sortable.create(tbody, {
          animation: 300,
          handle: '.drop-class',
          async onEnd({ newIndex, oldIndex }) {
            const currRow = tableIds.splice(oldIndex, 1)[0]
            tableIds.splice(newIndex, 0, currRow)
            const dropList = tableIds.map((i, index) => {
              return {
                id: i,
                sort: index + (_this.currentPage - 1) * _this.pageSize
              }
            })
            try {
              await assistantSettingSort(dropList)
              _this.getList()
            } catch (e) {
              console.log(e)
            }
          }
        })
      }
    },
    handleSetBatchState(state) {
      const ids = this.multipleSelection.map(i => i.id)
      const tips = this.multipleSelection.map(i => `${i.assistantUserName}`).join('/')
      this.$delModal({
        tips: `是否确认批量${state === 1 ? '继续' : '暂停'}分配助教（${tips}）？`,
        success: () => {
          this.loading = true
          const params = {
            ids,
            state,
            settingId: this.current.id
          }
          assistantSettingEditState(params)
            .then((res) => {
              this.loading = false
              this.$message.success(res.data ?? '操作成功')
              this.multipleSelection = []
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    handleClickDel(row) {
      this.$delModal({
        tips: `是否确认移除该助教？`,
        success: () => {
          this.loading = true
          const params = {
            ids: [row.id],
            settingId: this.current.id
          }
          assistantSettingDel(params)
            .then(() => {
              this.loading = false
              this.$message.success('操作成功')
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击批量移除助教
    handleClickBatchDel() {
      const ids = this.multipleSelection.map(i => i.id)
      const tips = this.multipleSelection.map(i => `${i.assistantUserName}`).join('/')
      this.$delModal({
        tips: `是否确认批量移除助教（${tips}）？`,
        success: () => {
          this.loading = true
          const params = {
            ids,
            settingId: this.current.id
          }
          assistantSettingDel(params)
            .then(() => {
              this.loading = false
              this.$message.success('操作成功')
              this.multipleSelection = []
              this.searchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击重置
    clear() {
      this.search = {
        scheduleId: '',
        allocationState: '',
        assistantUserId: ''
      }
      this.searchFn()
    },
    getDetail() {
      return assistantDetail({ id: this.current.id })
    },
    // 初始化
    init() {
      this.form = {}
      this.loading = true
      this.currentPage = 1
      this.getList()
      Promise.all([this.getDetail(), assistantSettingScheduleList(this.current.id)])
        .then(res => {
          const detail = res[0].data
          this.form = {
            allocationRules: detail.allocationRules,
            assistantUserId: detail.assistantUserId,
            assistantUserName: detail.assistantUserName,
            deptName: detail.deptName,
            courseTypeName: detail.courseTypeName,
            userName: detail.userName
          }
          this.scheduleList = res[1].data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.dialog-container ::v-deep{
  .el-drawer__header{
    border-bottom:1px solid #EFF2F6 ;
    margin-bottom: 0px;
    padding-bottom: 20px;
  }
  .table-edit_icon{
    width:16px;
    height:16px;
    margin-left:5px;
    cursor: pointer;
  }
  .tips{
    color: #999999;
    font-size: 12px;
    margin-left: 5px;
  }
  .dialog-header{
    padding:20px 10px 0;
    border-radius: 8px;
    background: #F7FBFF;
  }
  .el-form{
    margin-top: 10px;
  }
  .form-box{
    padding: 12px 12px 0;
    border: 1px solid #E7E7E7;
    border-radius: 8px;
    flex: 1;
    margin-bottom: 0px;
  }
  .el-drawer__body{
    padding: 20px;
  }
  .el-form-item--small.el-form-item{
    margin-bottom: 10px;
  }
  .red{
    color: #F53F3F;
  }
  .green{
    color: #00B42A;
  }
  .AssistantDialog {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    .cardText {
      background: #f7fbff;
      border-radius: 8px;
      padding: 16px;
      font-size: 14px;
      font-weight: 400;
      margin-bottom: 16px;
      color: #333333;
      line-height: 22px;
      > .inputNumber {
        width: 130px;
      }
    }
  }
  .my-table {
    margin: 0;
  }
  .tablePage .page_footer {
    padding: 0;
    box-shadow: none;
  }
  .page_content{
    border-radius: 8px;
  }
  .tablePage {
    height: 500px;
    flex: 1;
  }
  .tablePage .page_content {
    margin-bottom: 0;
  }
  .tablePage .page_header {
    padding: 10px 0 0;
  }
  .tablePage .page_content {
    padding-bottom: 0px !important;
  }
  .tablePage .page_footer {
    padding: 17px 0 !important;
  }
}

</style>
