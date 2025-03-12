<template>
  <div class="warpBox">
    <div class="contentBox">
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="form-container"
      >
        <el-form-item label="触达规则" prop="reachType">
          <el-checkbox-group v-model="form.reachType" @change="handleReachType">
            <el-checkbox key="1" label="1" :true-label="2" false-label=""> 默认规则</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="AI外呼" prop="callId">
          <el-select
            v-model="form.callId"
            :disabled="form.taskStatus === '4'"
            filterable
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="item in callTaskOptions"
              :key="item.id"
              :disabled="item.status === 2"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="短信模板" prop="smsActionId">
          <smsMsgTemplateSelect
            :sms-msg-template-id="form.smsActionId"
            :sms-msg="form.smsContent"
            @select="changeSmsTem"
          >
            <el-form-item prop="smsSignatureId">
              <el-select
                v-model="form.smsSignatureId"
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
          </smsMsgTemplateSelect>
        </el-form-item>
      </el-form>
    </div>
    <div class="btnBox">
      <el-button size="mini" @click="handleStop(2)">上一步</el-button>
      <el-button type="primary" size="mini" @click="handleOk">完成</el-button>
    </div>
  </div>
</template>
<script>
import smsMsgTemplateSelect from '../../../CRM/components/smsMsgTemplateSelect/index'
import { getChannelSignaturePageV2 } from '@/api/system/sms'
import { callList } from '@/api/privateArea/toolbox'
export default {
  components: {
    smsMsgTemplateSelect
  },
  props: {
    form: {
      type: Object,
      default: () => ({
        smsSignatureName: '',
        smsActionId: '',
        reachType: 2
      })
    }
  },
  data: () => ({
    callTaskOptions: [],
    signOptions: [],
    rules: {
      reachType: [
        {
          required: true,
          message: '请选择触达规则',
          trigger: 'blur'
        }
      ],
      callId: [
        {
          required: true,
          message: '请选择AI外呼',
          trigger: 'blur'
        }
      ],
      smsActionId: [
        {
          required: true,
          message: '请选择短信模板',
          trigger: 'blur'
        }
      ],
      smsSignatureId: [
        {
          required: true,
          message: '请选择签名',
          trigger: 'blur'
        }
      ]
    }
  }),
  created() {
    this.getCallTask()
    this.getSignOptions()
  },
  methods: {
    handleChangeSmsSignature(val) {
      const data = this.signOptions.find(i => i.id === val)
      this.form.smsSignatureName = data?.signatureName ?? ''
      this.$emit('update:form', this.form)
    },
    handleStop(value) {
      this.$emit('handleStop', value)
    },
    handleReachType() {
      this.$emit('update:form', this.form)
    },
    changeSmsTem(current) {
      this.form.smsContent = current.title
      this.form.smsActionId = current.actionId
      this.$emit('update:form', this.form)
    },
    async handleOk() {
      await this.$refs.ruleForm.validate()
      this.$emit('update:form', this.form)
      this.$emit('handleOk')
    },
    async getCallTask() {
      const { data } = await callList()
      this.callTaskOptions = data
    },
    async getSignOptions() {
      const { data } = await getChannelSignaturePageV2()
      this.signOptions = data ?? []
    }
  }
}
</script>
<style lang="scss" scoped>
.warpBox {
  width: 100%;
  height: calc(100vh - 105px);
  // overflow: scroll;
  display: flex;
  flex-direction: column;
  > .contentBox {
    flex: 1;
    padding: 0 20px;
    padding-bottom: 40px;
    overflow: scroll;
    .enabledBox {
      display: flex;
      align-items: center;
      .textContent {
        margin-left: 10px;
      }
    }
    .cardBox {
      background: #fafafa;
      border-radius: 8px;
      display: flex;
      padding: 12px;
      > div:nth-of-type(1) {
        flex: 1;
        margin-right: 22px;
      }
    }
  }
  > .btnBox {
    display: flex;
    padding: 17px 0;
    padding-right: 20px;
    border-top: 1px solid #e7e7e7;
    justify-content: flex-end;
  }
}
</style>
