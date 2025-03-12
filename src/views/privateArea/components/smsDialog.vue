<template>
  <!-- 选择短信模板弹框 -->
  <AppDialog
    v-model="visible"
    title="选择短信模板"
    top="5vh"
    width="916px"
    height="695px"
    :footer-text="['批量群发信息', '取 消']"
    :loading="loading"
    @success="successFn"
  >
    <div v-loading="loading" class="smsDialog overflowOuto">
      <div class="headerSearch">
        <el-form ref="form" :model="form" :inline="true" label-width="70px">
          <el-form-item label="短信模板">
            <el-input
              v-model.trim="form.search"
              class="w-250 m-l-20"
              clearable
              @clear="sureSearch"
              @keyup.enter.stop.native="sureSearch"
            />
          </el-form-item>
          <el-form-item label="模板内容">
            <el-input
              v-model.trim="form.search"
              class="w-250 m-l-20"
              clearable
              @clear="sureSearch"
              @keyup.enter.stop.native="sureSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="sureSearch"
            >查询</el-button>
            <el-button size="small" @click="sureSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        height="520px"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f5f5' }"
        @row-click="selectFn"
      >
        <el-table-column width="35">
          <template slot-scope="{ row }">
            <svg-icon
              v-if="selectObj.actionId === row.actionId"
              class-name="myRadioSelect"
              icon-class="radioChecked"
            />
            <div v-else class="myRadio" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="模板名称" />

        <el-table-column prop="smsTypeId" label="模板类型">
          <template slot-scope="{ row }">
            {{ type[row.smsTypeId] }}
          </template>
        </el-table-column>
        <el-table-column prop="templateDesc" label="模板内容" />
      </el-table>
      <el-pagination
        class="pagination"
        :current-page.sync="current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getOrgMessageTemplateList } from '@/api/system/sms'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      multipleSelection: [],
      loading: false,
      form: {
        search: ''
      },
      visible: false,
      current: 1, // 当前页
      pageSize: 10, // 页数
      total: 0, // 总数
      tableData: [],
      selectObj: {
        // 选择的短信信息
        actionId: '',
        title: ''
      },
      type: {
        1: '验证码',
        2: '通知',
        3: '营销推广'
      }
    }
  },
  mounted() {},
  methods: {
    open(row = {}) {
      this.visible = true
      this.multipleSelection = row.multipleSelection
      this.selectObj.actionId = row.actionId ?? ''
      this.selectObj.title = row.title ?? ''
      this.getList()
    },
    init() {
      this.current = 1
      this.total = 0
      this.form.search = ''
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        // channelId: 1,
        title: this.form.search,
        tagName: '智能销售',
        current: this.current,
        size: this.pageSize
        // customMsgType: 2 // 1: 普通 2：客服消息(短信模板中带有https://ap.hokkj.cn/pr/${userTaskId})
      }
      getOrgMessageTemplateList(params)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.current = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    sureSearch(event) {
      event?.preventDefault()
      this.current = 1
      this.getList()
    },
    selectFn(row, column, event) {
      this.selectObj.actionId = row.actionId
      this.selectObj.title = row.templateDesc
      event.stopPropagation()
      //   this.$emit('select', row)
    },
    successFn() {
      if (!this.selectObj?.actionId) return this.$message.warning('请选择短信模板！')
      this.$confirm(`<strong>
          <div style="font-weight: 400;">
            人工发送单天单线索最多2条，不符合条件的线索自动忽略不处理，只处理可以正常执行的线索！
          </div>
          <div>
            模板内容
          </div>
          <div style="font-weight: 400;">
          ${this.selectObj.title}
          </div>
        </strong>`, `已选择线索 ${this.multipleSelection?.length} 条`, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确认群发',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$emit('handleOk', this.selectObj)
          this.visible = false
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.smsDialog {
  height: 695px;
  box-sizing: border-box;
  padding: 20px;
  .headerSearch {
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 20px;
  }
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
.myRadioSelect {
  width: 12px;
  height: 12px;
  color: #409eff;
}
.myRadio {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #dcdfe6;
}
</style>
