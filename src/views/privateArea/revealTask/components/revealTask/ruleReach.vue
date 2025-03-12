<template>
  <div class="warpBox">
    <div>
      <div class="titleText">
        单个手机号码 电话每天最多打2次，短信每天最多发3条。
      </div>
      <div class="addBox">
        <div>触达规则</div>
        <el-button
          v-if="
            form.taskReachAddRequests &&
              form.taskReachAddRequests.length < actionConfig.length
          "
          size="mini"
          type="primary"
          @click="handleAddModel"
        ><i class="el-icon-plus" /> 新增规则</el-button>
      </div>
      <div class="centent">
        <div
          v-for="(item, index) in form.taskReachAddRequests || []"
          :key="index"
        >
          <div class="cardText">
            <span>规则{{ index + 1 }}</span>
            <span
              v-show="form.taskReachAddRequests&&form.taskReachAddRequests.length > 1"
              @click="handleDel(index)"
            >删除</span>
          </div>
          <div class="itemBox">
            <div class="title">触达条件</div>
            <div class="selectBox">
              <span>*分配后未退款且</span>
              <m-select
                v-model="item.defineType"
                dict-key="ADD_WECHAT_STATUS"
                style="width: 200px"
                size="mini"
                @change="handleDefineType(index)"
              />
              <m-select
                v-model="item.actionId"
                :dict-list="actionConfig"
                :param="{ value: 'id', label: 'actionName' }"
                style="width: 200px; margin-left: 10px"
                size="mini"
              />
            </div>
          </div>
          <div class="itemBox">
            <div class="title">执行动作</div>
            <span>AI外呼</span>
            <m-select
              v-model="item.callId"
              filterable
              placeholder="请选择"
              style="width: 200px"
              size="mini"
              :dict-list="callTaskOptions"
              :param="{ value: 'id', label: 'name' }"
            />
            <span class="text">外呼时间段早8点至晚9点</span>
          </div>
          <el-form
            ref="ruleForm"
            :model="form"
            :rules="rules"
            label-width="80px"
            class="form-container"
          >
            <el-form-item label="短信模板" prop="smsActionId">
              <!-- <smsMsgTemplateSelect
                :sms-msg-template-id="item.smsActionId"
                :sms-msg="item.smsContent"
                @select="value => changeSmsTem(value, index)"
              >
                <el-form-item prop="smsSignatureId">
                  <m-select
                    v-model="item.smsSignatureId"
                    placeholder="请选择签名"
                    style="width: 200px; margin-top: 15px"
                    :param="{ value: 'id', label: 'signatureName' }"
                    :dict-list="signOptions"
                    @change="value => handleChangeSmsSignature(value, index)"
                  />
                </el-form-item>
              </smsMsgTemplateSelect> -->
              <smsMsgTemplate
                v-model="item.smsActionId"
                :sms-signature-id.sync="item.smsSignatureId"
                :sms-signature-name.sync="item.smsSignatureName"
                :sms-msg="item.smsContent"
                @handleSmsSignature="handleSmsSignature(index)"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="btnBox">
      <el-button size="mini" @click="handleStop(2)">上一步</el-button>
      <el-button type="primary" size="mini" @click="handleOk">完成</el-button>
    </div>
  </div>
</template>
<script>
const itemObj = {
  defineType: '',
  actionId: '',
  callId: '',
  smsTitle: '',
  smsActionId: '',
  smsSignatureId: ''
}
const msgList = {
  defineType: '请选择触达条件是否加微！',
  actionId: '请选择触达时间！',
  smsActionId: '请选择短信模板！',
  smsSignatureId: '请选择短信模板签名！'
}
import smsMsgTemplate from '../../../CRM/components/smsMsgTemplate'
import { callList } from '@/api/privateArea/toolbox'
import { getActionConfigList } from '@/api/privateArea/CRM'
import { getChannelSignaturePageV2 } from '@/api/system/sms'
export default {
  components: {
    smsMsgTemplate
  },
  props: {
    form: {
      type: Object,
      default: () => ({
        tags: []
      })
    }
  },
  data: () => ({
    actionConfigList: [],
    callTaskOptions: [],
    signOptions: [],
    rules: {},
    loading: false
  }),
  computed: {
    actionConfig() {
      if (
        this.form.taskReachAddRequests?.length &&
        this.actionConfigList?.length
      ) {
        const list = this.actionConfigList.map(item => ({
          ...item,
          disabled: this.form.taskReachAddRequests.find(
            n => n.actionId === item.id
          )
        }))
        return list || this.actionConfigList
      }
      return this.actionConfigList
    }
  },
  created() {
    this.setData()
  },
  methods: {
    handleDefineType(index) {
      const defineType = this.form?.taskReachAddRequests[index].defineType
      if (this.form?.taskReachAddRequests?.length > 1) {
        this.form.taskReachAddRequests = this.form.taskReachAddRequests.map(
          item => ({
            ...item,
            defineType
          })
        )
      }
    },
    listMsg() {
      let result = null
      for (let i = 0; i < this.form?.taskReachAddRequests.length; i++) {
        const obj = this.form.taskReachAddRequests[i]
        const msgKey = Object.keys(msgList)?.find(item => !obj[item])
        if (msgKey) {
          result = true
          this.$message.warning(`第${i + 1}条规则，${msgList[msgKey]}`)
          break
        }
      }
      return result
    },
    handleDel(index) {
      if (this.form.taskReachAddRequests.length === 1) {
        return this.$message.warning('最少保留一条触达规则！')
      }
      this.form.taskReachAddRequests.splice(index, 1)
    },
    handleAddModel() {
      this.form.taskReachAddRequests.push({
        ...itemObj,
        defineType: this.form?.taskReachAddRequests[0]?.defineType || '',
        smsSignatureId: this.form?.taskReachAddRequests[0]?.smsSignatureId || '',
        smsSignatureName: this.form?.taskReachAddRequests[0]?.smsSignatureName || ''
      })
    },
    handleStop() {
      const isMsg = this.listMsg()
      if (isMsg) return
      this.$emit('update:form', this.form)
      this.$emit('handleStop', 2)
    },
    handleOk() {
      const isMsg = this.listMsg()
      if (isMsg) return
      this.$emit('update:form', this.form)
      this.$emit('handleOk')
    },
    // async handleChangeSmsSignature(val, index) {
    //   const data = this.signOptions.find(i => i.id === val)
    //   this.form.taskReachAddRequests[index].smsSignatureName =
    //     data?.signatureName ?? ''
    // },
    handleALLDefineType(index, key) {
      const items = this.form?.taskReachAddRequests[index]
      if (this.form?.taskReachAddRequests?.length > 1) {
        this.form.taskReachAddRequests.forEach(item => {
          item[key] = items[key]
        })
      }
    },
    handleSmsSignature(index) {
      // 处理短信签名变化
      this.handleALLDefineType(index, 'smsSignatureName')
      this.handleALLDefineType(index, 'smsSignatureId')
    },
    setData() {
      this.getActionConfigList()
      this.getCallTask()
      this.getSignOptions()
    },
    async getActionConfigList() {
      const { code, data } = await getActionConfigList()
      if (code === 1 && data?.length) this.actionConfigList = data || []
    },
    async changeSmsTem(current, index) {
      this.form.taskReachAddRequests[index].smsContent = current.title
      this.form.taskReachAddRequests[index].smsActionId = current.actionId
    },
    async getSignOptions() {
      const { data } = await getChannelSignaturePageV2()
      this.signOptions = data ?? []
    },
    async getCallTask() {
      const { data } = await callList()
      this.callTaskOptions = data
    }
  }
}
</script>
<style lang="scss" scoped>
.warpBox::v-deep {
  width: 100%;
  height: calc(100vh - 105px);
  // overflow: scroll;
  display: flex;
  flex-direction: column;
  > div:nth-of-type(1) {
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 0 20px;
  }
  .drawer__footer {
    border-top: 1px solid #e7e7e7;
    padding: 12px 21px;
    text-align: left;
  }
  .centent {
    margin-left: 75px;
    .form-container {
      margin-top: 16px;
    }
    .itemBox {
      display: flex;
      align-items: center;
      margin-top: 16px;
      > .title {
        margin-right: 20px;
      }
      > span {
        margin-right: 10px;
        color: #000000;
        font-size: 16px;
        font-weight: 400;
      }
      .text {
        color: #999999;
        font-size: 12px;
        margin-left: 10px;
        margin-right: 0;
      }
    }
    > div {
      border: 0 solid #979797;
      background: #fafafa;
      padding: 20px;
      margin-top: 10px;
    }
    .cardText {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      line-height: 1;
      > span:nth-of-type(2) {
        color: #f1330d;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
      }
    }
    .title {
      color: #000000;
      font-size: 16px;
      font-weight: 700;
      line-height: 1;
    }
    .selectBox {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 1;
      > span {
        margin-right: 20px;
      }
    }
  }
  .titleText {
    color: #f53f3f;
    font-size: 14px;
    font-weight: 400;
    padding: 20px;
    border-radius: 8px;
    background: #fff6f2;
  }
  .addBox {
    display: flex;
    align-items: center;
    margin-top: 20px;
    > div:nth-of-type(1) {
      color: #333333;
      font-size: 14px;
      font-weight: 400;
      margin-right: 8px;
      &:before {
        content: '*';
        color: red;
        margin-right: 4px;
      }
    }
  }
  .btnBox {
    display: flex;
    padding: 17px 0;
    padding-right: 20px;
    border-top: 1px solid #e7e7e7;
    justify-content: flex-end;
  }
}
</style>
