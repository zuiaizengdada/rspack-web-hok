<template>
  <div class="offlineTable">
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="form-container"
    >
      <el-form-item label="AI外呼" prop="callId">
        <el-select
          v-model="form.callId"
          filterable
          :disabled="form.taskStatus === '4'"
          placeholder="请选择"
          style="width: 200px"
          @change="handleChangeAI"
        >
          <el-option
            v-for="item in callTaskOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="短信模板" prop="smsActionId">
        <smsMsgTemplate
          v-model="form.smsActionId"
          :sms-signature-id.sync="form.smsSignatureId"
          :btn-disabled="form.taskStatus === '4'"
          :sms-signature-name.sync="form.smsSignatureName"
          :sms-msg="form.title"
          @update="changeSmsTem"
        />
        <!-- <smsMsgTemplateSelect
          :sms-msg-template-id="form.smsActionId"
          :sms-msg="form.title"
          :disabled="form.taskStatus === '4'"
          @select="changeSmsTem"
        >
          <el-form-item prop="smsSignatureId">
            <el-select
              v-model="form.smsSignatureId"
              :disabled="form.taskStatus === '4'"
              placeholder="请选择签名"
              style="width: 200px; margin-top: 15px"
              @change="handleChangeSmsSignature"
            >
              <el-option
                v-for="item in signOptions"
                :key="item.id"
                :label="item.signatureName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </smsMsgTemplateSelect> -->
      </el-form-item>
    </el-form>
    <template v-if="dataType === 2">
      <div v-loading class="tableBorder">
        <el-table
          style="width: 100%"
          height="100%"
          :data="tableData"
          :header-cell-style="{ background: '#F2F9FF' }"
        >
          <el-table-column prop="userName" label="客户姓名" />
          <el-table-column prop="userPhone" label="手机号码">
            <template slot-scope="{ row }">
              <tablePhoneItem
                v-model="row.userPhone"
                :row-data="row"
                type="crm"
              />
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="购买商品" />
          <el-table-column prop="userIntention" label="客户意向" />
          <el-table-column prop="createTime" label="上传时间" width="160" />
        </el-table>
      </div>
      <el-pagination
        class="pagination m-t-20"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
    <template v-else>
      <div
        class="el-form-item is-required el-form-item--medium"
        style="margin-bottom: 0px; margin-left: 20px"
      >
        <label class="el-form-item__label">线索接量方式</label>
      </div>
      <clueTable ref="clueTable" />
    </template>
  </div>
</template>

<script>
import { getSaleTaskOfflinePage } from '@/api/privateArea/CRM'
import { getChannelSignaturePageV2 } from '@/api/system/sms'
import smsMsgTemplate from '../smsMsgTemplate'
import { callList, taskCallAI, taskCallSms } from '@/api/privateArea/toolbox'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import clueTable from '../clueTable/index'
export default {
  components: {
    smsMsgTemplate,
    tablePhoneItem,
    clueTable
  },
  props: {
    taskObjective: {
      type: Number,
      default: 1
    },
    taskId: {
      type: [String, Number],
      default: ''
    },
    dataType: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      form: {
        smsActionId: '',
        callId: '',
        smsSignatureId: '',
        smsSignatureName: '',
        id: '',
        taskStatus: '',
        title: ''
      },
      // rules: {
      //   callId: [{ required: true, message: '请选择', trigger: 'change' }],
      //   smsSignatureId: [
      //     { required: true, message: '请选择', trigger: 'change' }
      //   ],
      //   smsActionId: [
      //     { required: true, message: '请选择短信模板', trigger: 'change' }
      //   ]
      // },
      callTaskOptions: [],
      signOptions: []
    }
  },
  computed: {
    rules() {
      return {
        callId: [
          {
            required: this.taskObjective === 1 ? true : false,
            message: '请选择AI外呼',
            trigger: 'change'
          }
        ],
        smsSignatureId: [
          { required: true, message: '请选择签名', trigger: 'change' }
        ],
        smsActionId: [
          {
            required: this.dataType === 4 ? true : false,
            message: '请选择短信模板',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    setData(form = {}) {
      this.currentPage = 1
      this.form = form
      this.getList()
      this.getCallTask()
      this.getSignOptions()
      if (this.dataType === 4) {
        this.$refs.clueTable.form.taskId = form.id
        this.$refs.clueTable.search()
      }
    },
    async getCallTask() {
      const { data } = await callList()
      this.callTaskOptions = data
    },
    async handleChangeAI() {
      const params = {
        taskId: this.form.id,
        callId: this.form.callId
      }
      const { code } = await taskCallAI(params)
      if (code === 1) {
        this.$message.success('修改成功')
      }
    },
    async changeSmsTem() {
      const params = {
        taskId: this.form.id,
        smsActionId: this.form.smsActionId,
        smsSignatureId: this.form.smsSignatureId,
        smsSignatureName: this.form.smsSignatureName
      }
      const { code } = await taskCallSms(params)
      if (code === 1) {
        this.$message.success('修改成功')
      }
    },
    async handleChangeSmsSignature(val) {
      const data = this.signOptions.find(i => i.id === val)
      this.form.smsSignatureName = data?.signatureName ?? ''
      const params = {
        taskId: this.form.id,
        smsActionId: this.form.smsActionId,
        smsSignatureId: this.form.smsSignatureId,
        smsSignatureName: this.form.smsSignatureName
      }
      const { code } = await taskCallSms(params)
      if (code === 1) {
        this.$message.success('修改成功')
      }
    },
    async getSignOptions() {
      const { data } = await getChannelSignaturePageV2()
      this.signOptions = data ?? []
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
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        taskId: this.form.id,
        addFlag: false
      }
      getSaleTaskOfflinePage(data)
        .then(res => {
          this.tableData = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.offlineTable {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  .tableBorder {
    margin: 20px;
    flex: 1;
    border-radius: 6px;
    border: 1px solid #cbcfd3;
    overflow: hidden;
  }
  .pagination {
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 66px;
  }
}
</style>
