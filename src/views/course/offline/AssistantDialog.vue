<template>
  <!-- 助教弹框 -->
  <el-dialog
    title="助教"
    width="1080px"
    :visible.sync="visible"
  >
    <div class="AssistantDialog overflowOuto">
      <div class="titleName">分配规则：</div>
      <div class="cardText">
        每轮助教分配
        <el-input-number
          v-model="num"
          :precision="0"
          placeholder="请输入内容"
          controls-position="right"
          size="mini"
          :min="1"
          :max="500"
          @change="handleChange"
        />
        名学生后，按更新时间顺序分给下一个被设置为自主分配的助教
      </div>
      <div class="titleName">助教列表：</div>
      <MPageLayout
        ref="MPageLayout"
        type="tablePage"
        :slot-arr="slotArr"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :total="total"
        :table-data="tableData"
        :table-columns="tableColumns"
        :loading="loading"
        layout="total, sizes, prev, pager, next, jumper"
        checkbox
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <template slot="search">
          <el-form ref="ruleForm" :inline="true" :model="search" size="small">
            <el-form-item label="助教姓名" prop="sysUserName">
              <el-input
                v-model="search.sysUserName"
                style="width: 200px"
                clearable
                @clear="searchFn"
              />
            </el-form-item>
            <el-form-item label="自动分配" prop="autoDistribute">
              <el-select
                v-model="search.autoDistribute"
                placeholder="请选择"
                clearable
                @clear="searchFn"
              >
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                type="primary"
                @click="searchFn"
              >查询</el-button>
              <el-button size="small" @click="clear">重置</el-button>
              <el-button
                size="small"
                class="btn_primary"
                @click="handleClickAdd"
              >新增</el-button>
              <el-button
                size="small"
                class="btn_primary"
                @click="handleSelectRule"
              >选择规则</el-button>
              <el-button
                size="small"
                class="btn_primary"
                @click="handleSaveRule"
              >保存规则</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template slot="footer">
          <el-button
            size="small"
            :disabled="multipleSelection.length === 0"
            @click="handleClickDel"
          >批量移除</el-button>
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-button
            v-if="row.autoDistribute === 0"
            type="text"
            size="small"
            @click="handleClickAutoAllocation(row)"
          >自动分配</el-button>
          <el-button
            v-else
            size="small"
            type="text"
            @click="handleClickUnAutoAllocation(row)"
          >取消自动分配</el-button>
        </template>
      </MPageLayout>
    </div>
    <saveRule ref="saveRule" />
    <selectRule ref="selectRule" @handleOk="handleOk" />
  </el-dialog>
</template>

<script>
import {
  getAssistantPage,
  distributeAssistant,
  deleteAssistant,
  addAssistant
} from '@/api/deliver/assistant'
import { getGoodsDetail, addByWarehouse } from '@/api/course'
import saveRule from './saveRule'
import moment from 'moment'
import selectRule from './selectRule'
export default {
  components: {
    saveRule,
    selectRule
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          goodsId: '',
          goodsName: ''
        }
      }
    }
  },
  data() {
    return {
      num: 1,
      loading: false,
      slotArr: ['search', 'action', 'footer'],
      tableData: [],
      tableColumns: [
        { prop: 'deptName', label: '部门名称', type: 'text' },
        { prop: 'sysUserName', label: '助教名称', type: 'text' },
        {
          prop: 'autoDistribute',
          label: '自动分配',
          type: 'text',
          render: row => {
            return { 0: '否', 1: '是' }[row.autoDistribute]
          }
        },
        {
          prop: 'createTime',
          label: '加入时间',
          type: 'text',
          width: '180',
          render: row => {
            return row.createTime
              ? moment(row.createTime).format('yyyy-MM-DD HH:mm:ss')
              : ''
          }
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          type: 'text',
          width: '180',
          render: row => {
            return row.updateTime
              ? moment(row.updateTime).format('yyyy-MM-DD HH:mm:ss')
              : ''
          }
        },
        { prop: 'action', label: '操作', type: 'slot' }
      ],
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      search: {
        sysUserName: '',
        autoDistribute: ''
      },
      assistantList: [] // 目前已经提交的数据
    }
  },
  watch: {
    'config.visible'(val) {
      if (val) {
        this.init()
      } else {
        this.num = 1
        this.total = 0
        this.multipleSelection = []
        this.search = {
          sysUserName: '',
          autoDistribute: ''
        }
        this.tableData = []
      }
    }
  },
  mounted() {},
  methods: {
    async handleOk(data) {
      try {
        this.loading = true
        await addByWarehouse({
          num: this.num,
          goodsId: this.config.goodsId,
          goodsName: this.config.goodsName,
          assistantWarehouseId: data.id
        })
        this.searchFn()
      } catch {
        this.loading = false
      }
    },
    handleChange(val) {
      const checkUser = this.assistantList.reduce((pre, next) => {
        pre.push({
          autoDistribute: next.autoDistribute,
          sysUserId: next.sysUserId
        })
        return pre
      }, [])
      const data = {
        goodsId: this.config.goodsId,
        goodsName: this.config.goodsName,
        assistantList: checkUser,
        num: val
      }
      this.queryAddAssistant(data)
    },
    handleSaveRule() {
      this.$refs.saveRule.open(this.config)
    },
    handleSelectRule() {
      this.$refs.selectRule.open()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.searchFn()
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
        goodsId: this.config.goodsId,
        autoDistribute: this.search.autoDistribute,
        sysUserName: this.search.sysUserName
      }
      return getAssistantPage(params)
        .then(res => {
          this.loading = false
          this.tableData = res.data.items
          this.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },

    queryAddAssistant(data) {
      addAssistant(data)
        .then(res => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.init()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击新增按钮
    handleClickAdd() {
      const checkUser = this.assistantList.reduce((pre, next) => {
        pre.push({
          userId: next.sysUserId,
          nickName: next.sysUserName,
          autoDistribute: next.autoDistribute
        })
        return pre
      }, [])
      this.$AddressBook({
        visible: true,
        multiple: true,
        checkUser,
        type: [1],
        minlength: 1,
        success: res => {
          if (res.user.length > 0) {
            this.loading = true
            const assistantList = res.user.reduce((pre, next) => {
              pre.push({
                autoDistribute: next.autoDistribute ?? 0,
                deptId: next.deptId,
                sysUserId: next.userId
              })
              return pre
            }, [])
            const data = {
              goodsId: this.config.goodsId,
              goodsName: this.config.goodsName,
              assistantList: assistantList,
              num: this.num
            }
            this.queryAddAssistant(data)
          }
        }
      })
    },
    // 点击自动分配
    handleClickAutoAllocation(row) {
      console.log(row)
      this.$delModal({
        tips: '是否确认加入自动分配,加入后有新订单进入交付系统后将轮询分配助教来服务学员。',
        sureBtnBgColor: '#409EFF',
        success: () => {
          this.loading = true
          const params = {
            autoDistribute: 1,
            id: row.id
          }
          distributeAssistant(params)
            .then(res => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击取消自动分配
    handleClickUnAutoAllocation(row) {
      console.log(row)
      this.$delModal({
        tips: '是否确认取消自动分配,取消后有新订单进入交付系统后将不再自动分配学员给此助教。',
        success: () => {
          this.loading = true
          const params = {
            autoDistribute: 0,
            id: row.id
          }
          distributeAssistant(params)
            .then(res => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击批量移除助教
    handleClickDel() {
      const ids = []
      console.log(this.multipleSelection, 'this.multipleSelection')
      const tips = this.multipleSelection.reduce((prev, next, index) => {
        ids.push(next.id)
        return `${prev}${index === 0 ? '' : ','}${next.sysUserName}`
      }, '')
      this.$delModal({
        tips: `是否确认批量移除助教（${tips}）？`,
        success: () => {
          this.loading = true
          const params = {
            ids,
            goodsId: this.config.goodsId
          }
          deleteAssistant(params)
            .then(() => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.init()
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
        sysUserName: '',
        autoDistribute: ''
      }
      this.searchFn()
    },
    getDetail() {
      return getGoodsDetail(this.config.goodsId).then(res => {
        console.log('获取详情数据', res)
        return res
      })
    },
    // 初始化
    init() {
      this.loading = true
      this.currentPage = 1
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        goodsId: this.config.goodsId,
        autoDistribute: this.search.autoDistribute,
        sysUserName: this.search.sysUserName
      }
      Promise.all([this.getDetail(), getAssistantPage(params)])
        .then(res => {
          console.log('=====>', res[0])
          this.num = res[0]?.data?.assistantList[0]?.num || 1
          this.tableData = res[1].data.items
          this.total = res[1].data.total
          this.assistantList = res[0].data.assistantList || []
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
.AssistantDialog {
  padding: 0 16px;
  box-sizing: border-box;
  > .titleName {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
    margin-bottom: 16px;
  }
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
::v-deep {
  .my-table {
    margin: 0;
  }
  .tablePage .page_footer {
    padding: 0;
    box-shadow: none;
  }
  .tablePage {
    height: 700px;
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
