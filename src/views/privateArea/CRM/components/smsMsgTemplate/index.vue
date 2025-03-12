<template>
  <div>
    <div class="smsMsg">
      <el-button
        :disabled="btnDisabled"
        size="mini"
        style="font-size: 14px"
        type="text"
        @click="handleClickSms"
      >选择短信模板</el-button>
      <i class="el-icon-arrow-down icon_down" @click="handleChange" />
      <m-select
        ref="selectRef"
        :value="smsSignatureId"
        :disabled="btnDisabled"
        placeholder="请选择签名"
        size="mini"
        style="width: 90px; margin-left: 5px"
        :param="{ value: 'id', label: 'signatureName' }"
        :dict-list="signOptions"
        @change="handleSmsSignatureId"
      />
      <span v-if="newSmsMsg">{{ newSmsMsg }}</span>
    </div>
    <div v-if="msgFilter" class="msgText">
      此为营销短信，客户晚上10点后下单的短信第二天早上8点统一发送
    </div>
    <smsDialog ref="smsDialog" @select="changeSmsTem" />
  </div>
</template>

<script>
import smsDialog from './smsDialog.vue'
import { getChannelSignaturePageV2 } from '@/api/system/sms'
export default {
  components: {
    smsDialog
  },
  props: {
    btnDisabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String],
      default: ''
    },
    smsSignatureName: {
      type: String,
      default: ''
    },
    smsSignatureId: {
      type: [Number, String],
      default: ''
    },
    smsMsg: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      msg: '',
      signOptions: [] // 短信签名选项
    }
  },
  computed: {
    newSmsMsg() {
      return this.msg || this.smsMsg
    },
    msgFilter() {
      const pattern = /退订回N|退订回T|回T退订|回N退订|拒收请回复R/
      return pattern.test(this.msg || this.smsMsg)
    }
  },
  created() {
    this.getSignOptions()
  },
  activated() {
    this.getSignOptions()
  },
  methods: {
    async getSignOptions() {
      // 获取短信签名选项
      const { data } = await getChannelSignaturePageV2()
      this.signOptions = data ?? [] // 设置短信签名选项
      if (this.signOptions.length > 0 && !this.smsSignatureId) {
        this.$emit('update:smsSignatureId', this.signOptions[0].id)
        this.$emit('update:smsSignatureName', this.signOptions[0].signatureName)
      }
    },
    handleChange() {
      const selectRef = this.$refs.selectRef?.initRef()
      if (selectRef) selectRef.toggleMenu()
    },
    async changeSmsTem(current) {
      // 更改短信模板
      this.msg = current.title // 更新短信内容
      this.$emit('input', current.actionId)
      this.handleUpdate()
    },
    handleSmsSignatureId(value) {
      const items = this.signOptions.find(item => item.id === value)
      this.$emit('update:smsSignatureId', value)
      this.$emit('update:smsSignatureName', items.signatureName)
      this.$emit('handleSmsSignature')
      this.handleUpdate()
    },
    handleUpdate() {
      this.$emit('update')
    },
    // 点击打开选择短信模板弹框
    handleClickSms() {
      this.$refs.smsDialog.open({
        actionId: this.smsMsgTemplateId,
        title: this.smsMsg
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.smsMsg::v-deep {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
  width: 527px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  margin-top: 10px;
  .icon_down {
    background: #0c6fff;
    color: #ffffff;
    margin-left: 10px;
    cursor: pointer;
  }
  .el-select {
    input {
      border: none;
      background: none;
      color: #0c6fff;
      padding: 0;
      font-size: 14px;
    }
    .el-icon-arrow-up {
      display: none;
    }
  }
}
.msgText{
  color:#7e7a7a;
  font-size: 12px;
}
</style>
