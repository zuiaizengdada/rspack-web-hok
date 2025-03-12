<template>
  <!-- 选择短信模板弹框 -->
  <AppDialog
    v-model="config.visible"
    title="选择短信模板"
    top="5vh"
    width="916px"
    height="695px"
    :loading="loading"
    @success="successFn"
  >
    <div v-loading="loading" class="smsDialog overflowOuto">
      <div class="headerSearch">
        <el-form ref="form" :model="form" :inline="true" label-width="70px">
          <el-form-item label="短信模板">
            <el-input v-model.trim="form.search" class="w-250 m-l-20" clearable @clear="sureSearch" @keyup.enter.native="sureSearch" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="sureSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table height="520px" :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f5f5f5' }" @row-click="selectFn">
        <el-table-column width="35">
          <template slot-scope="{ row }">
            <svg-icon v-if="selectObj.smsMsgTemplateId === row.templateCode" class-name="myRadioSelect" icon-class="radioChecked" />
            <div v-else class="myRadio" />
          </template>
        </el-table-column>
        <el-table-column prop="channelTemplateContent" label="短信模板" />
        <el-table-column prop="smsTypeName" label="场景" width="140px" />
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
// import { msgTemplate } from '@/api/msg/msg'
import { getSmsChannelTemplate } from '@/api/system/sms'
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
          smsMsgTemplateId: '',
          smsMsg: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      form: {
        search: ''
      },
      current: 1, // 当前页
      pageSize: 10, // 页数
      total: 0, // 总数
      tableData: [],
      selectObj: { // 选择的短信信息
        smsMsgTemplateId: '',
        smsMsg: ''
      }
    }
  },
  watch: {
    'config.visible'(val) {
      if (val) {
        this.selectObj.smsMsgTemplateId = this.config.smsMsgTemplateId
        this.selectObj.smsMsg = this.config.smsMsg
        this.init()
      }
    }
  },
  mounted() {},
  methods: {
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
        templateContent: this.form.search,
        pageIndex: this.current,
        pageSize: this.pageSize,
        tagName: 'pr'
        // customMsgType: 2 // 1: 普通 2：客服消息(短信模板中带有https://ap.hokkj.cn/pr/${userTaskId})
      }
      getSmsChannelTemplate(params).then(res => {
        console.log(res)
        this.tableData = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
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
    sureSearch() {
      this.current = 1
      this.getList()
    },
    selectFn(row, column, event) {
      console.log(row)
      this.selectObj.smsMsgTemplateId = row.templateCode
      this.selectObj.smsMsg = row.channelTemplateContent
      event.stopPropagation()
    //   this.$emit('select', row)
    },
    successFn() {
      this.$emit('select', this.selectObj)
      //   this.$emit('close')
      this.config.visible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.smsDialog {
  height: 695px;
  box-sizing: border-box;
  padding: 20px;
  .headerSearch {
    border-bottom: 1px solid #E7E7E7;
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
    border:1px solid #dcdfe6;
}
</style>
