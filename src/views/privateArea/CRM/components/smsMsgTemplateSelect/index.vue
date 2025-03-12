<template>
  <div>
    <el-button
      :disabled="disabled"
      size="small"
      @click="handleClickSms"
    >选择短信模板</el-button>
    <slot />
    <div v-if="smsMsg" class="smsMsg">
      {{ smsMsg }}
    </div>
    <smsDialog
      ref="smsDialog"
      @select="(val) => $emit('select', val)"
    />
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  mounted() {},
  methods: {
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
