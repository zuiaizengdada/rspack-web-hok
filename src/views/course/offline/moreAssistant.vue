<template>
  <!-- 助教弹框 -->
  <AppDialog
    v-model="config.visible"
    width="850px"
    height="500px"
    title="助教"
    :loading="loading"
  >
    <div class="AssistantDialog overflowOuto">
      <div class="titleName">分配规则：</div>
      <div class="cardText">
        每轮助教分配
        <el-input-number v-model="num" :precision="0" placeholder="请输入内容" controls-position="right" size="mini" :min="1" :max="500" @change="handleChange" />
        名学生后，按更新时间顺序分给下一个被设置为自主分配的助教
      </div>
      <div class="titleName">分配助教：</div>
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
              <el-input v-model="search.sysUserName" style="width: 200px" clearable @clear="searchFn" />
            </el-form-item>
            <el-form-item label="自动分配" prop="autoDistribute">
              <el-select v-model="search.autoDistribute" placeholder="请选择" clearable @clear="searchFn">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="searchFn">查询</el-button>
              <el-button size="small" @click="clear">重置</el-button>
              <!-- <el-button size="small" class="btn_primary" @click="handleClickAdd">新增</el-button> -->
            </el-form-item>
          </el-form>
        </template>
        <template slot="footer">
          <!-- <el-button size="small" :disabled="multipleSelection.length === 0" @click="handleClickDel">批量移除</el-button> -->
        </template>
        <!-- <template slot="action" slot-scope="{ row }">
          <el-button v-if="row.autoDistribute === 0" type="text" size="small" @click="handleClickAutoAllocation(row)">自动分配</el-button>
          <el-button v-else size="small" type="text" @click="handleClickUnAutoAllocation(row)">取消自动分配</el-button>
        </template> -->
      </MPageLayout>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          data: []
        }
      }
    }
  },
  data() {
    return {
      num: 1,
      loading: false,
      slotArr: ['search', 'footer'],
      tableData: [],
      tableColumns: [
        { prop: 'deptName', label: '部门名称', type: 'text' },
        { prop: 'nickName', label: '助教名称', type: 'text' },
        { prop: 'autoDistribute', label: '自动分配', type: 'text', render: (row) => { return { 0: '否', 1: '是' }[row.autoDistribute] } }
        // 新军说隐藏，周荣在
        // { prop: 'createTime', label: '加入时间', type: 'text', width: '180', render: (row) => { return row.createTime ? moment(row.createTime).format('yyyy-MM-DD HH:mm:ss') : '' } },
        // { prop: 'updateTime', label: '更新时间', type: 'text', width: '180', render: (row) => { return row.updateTime ? moment(row.updateTime).format('yyyy-MM-DD HH:mm:ss') : '' } },
        // { prop: 'action', label: '操作', type: 'slot' }
      ],
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      search: {
        sysUserName: '',
        autoDistribute: ''
      }
    }
  },
  watch: {
    'config.visible'(val) {
      val && this.searchFn()
      if (!val) this.num = 1
    }
  },
  mounted() {},
  methods: {
    handleChange(val) {
      const user = this.config?.data?.map(item => ({
        ...item,
        num: val
      })) || []
      this.$emit('onAdd', user)
    },
    handleSizeChange(val) {
      this.pageSize = val
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
      const allData = []
      this.config.data.map((v, i) => {
        if ((this.search.autoDistribute === '' || this.search.autoDistribute === v.autoDistribute) && v.nickName.includes(this.search.sysUserName)) {
          allData.push(v)
        }
      })
      this.tableData = allData.filter((v, i) => {
        return i >= (this.currentPage - 1) * this.pageSize && i < this.currentPage * this.pageSize
      })
      this.num = this.tableData[0]?.num || 1
      this.total = allData.length
      this.loading = false
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    // 点击新增按钮
    handleClickAdd() {
      const disabledUser = []
      this.config.data.map(v => {
        disabledUser.push(v.userId)
      })
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        minlength: 1,
        checkUser: this.config.data,
        success: (res) => {
          console.log(res?.user)
          const user = res?.user.map(item => ({
            ...item,
            num: this.num
          }))
          this.loading = true
          this.$emit('onAdd', user)
          this.loading = false
          this.searchFn()
        }
      })
    },
    // 点击自动分配
    handleClickAutoAllocation(row) {
      this.$delModal({
        tips: '是否确认加入自动分配,加入后有新订单进入交付系统后将轮询分配助教来服务学员。',
        sureBtnBgColor: '#409EFF',
        success: () => {
          this.loading = true
          this.$emit('autoAllocation', row)
          this.loading = false
        }
      })
    },
    // 点击取消自动分配
    handleClickUnAutoAllocation(row) {
      this.$delModal({
        tips: '是否确认取消自动分配,取消后有新订单进入交付系统后将不再自动分配学员给此助教。',
        success: () => {
          this.loading = true
          this.$emit('unAutoAllocation', row)
          this.loading = false
        }
      })
    },
    // 点击批量移除助教
    handleClickDel() {
      this.$emit('onDel', this.multipleSelection)
    },
    // 点击重置
    clear() {
      this.search = {
        sysUserName: '',
        autoDistribute: ''
      }
      this.searchFn()
    }
    // 获取详情信息
  }
}
</script>

<style lang='scss' scoped>
.AssistantDialog {
    padding: 0 16px;
    height: 500px;
    box-sizing: border-box;
}
::v-deep {
  .my-table {
    margin: 0;
  }
  .tablePage .page_footer {
    padding: 0;
    box-shadow: none;
  }
  .tablePage .page_content {
    margin-bottom: 0;
  }
  .tablePage .page_header {
    padding: 10px 0 0;
  }
  .el-input__validateIcon {
    display: none;
  }
  .tablePage .page_content {
    padding-bottom: 0px!important;
  }
  .tablePage .page_footer {
    padding: 17px 0!important;
  }
  .titleName{
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      line-height: 24px;
      margin-bottom: 16px;
    }
    .cardText{
      background: #F7FBFF;
      border-radius: 8px;
      padding:16px;
      font-size: 14px;
      font-weight: 400;
      margin-bottom: 16px;
      color: #333333;
      line-height: 22px;
      >.inputNumber{
        width:130px;
      }
    }
}
</style>
