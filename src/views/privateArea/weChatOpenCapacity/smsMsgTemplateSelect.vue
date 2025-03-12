<template>
  <div>
    <el-button size="small" @click="handleClickSms">选择短信模板</el-button>
    <div v-if="smsMsg" class="smsMsg">
      {{ smsMsg }}
    </div>
    <smsDialog :config="smsConfig" @select="(val) => $emit('select', val)" />
  </div>
</template>

<script>
import smsDialog from './smsDialog.vue'
export default {
  components: {
    smsDialog
  },
  props: {
    smsMsgTemplateId: {
      type: [Number, String],
      default: ''
    },
    smsMsg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      smsConfig: {
        visible: false,
        smsMsgTemplateId: '',
        smsMsg: ''
      }
    }
  },
  mounted() {},
  methods: {
    // 点击打开选择短信模板弹框
    handleClickSms() {
      this.smsConfig.visible = true
      this.smsConfig.smsMsgTemplateId = this.smsMsgTemplateId
      this.smsConfig.smsMsg = this.smsMsg
    }

  }
}
</script>

<style lang='scss' scoped>
.smsMsg {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    width: 527px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    margin-top: 10px;
}
</style>
