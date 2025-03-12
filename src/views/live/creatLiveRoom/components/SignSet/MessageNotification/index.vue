<template>
  <div>
    <el-checkbox-group v-model="msgType">
      <el-checkbox label="1">短信通知</el-checkbox>
      <el-checkbox label="2" :disabled="true">公众号通知</el-checkbox>
    </el-checkbox-group>
    <div v-if="msgType.length" class="officialFlag-container">
      <applyMsgs v-for="item in msgType" :key="item" :ref="`applyMsgsObj${item}`" :config="applyMsgsObj[item]" @select="handleSelectApplyMsg" />
    </div>
  </div>
</template>
<script>
import applyMsgs from './applyMsgs'
export default {
  components: { applyMsgs },
  data() {
    return {
      msgType: [],

      applyMsgsObj: {
        '1': {
          msgType: 1,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 1,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            sendMsgFlag: 1,
            msgType: 1
          }]
        },
        '2': {
          msgType: 2,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 1,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            sendMsgFlag: 1,
            msgType: 2
          }]
        }
      },
      officeList: [],
      messageList: []
    }
  },
  methods: {
    handleSelectApplyMsg(data) {
      console.log(data, 'refs')
      data.applyMsgs.forEach(item => {
        // item.msgType = 1
        item.sendMsgFlag = data.sendMsgFlag
      })

      if (data.msgType === 1) {
        this.messageList = data.applyMsgs
      } else {
        this.officeList = data.applyMsgs
      }
      const list = [...this.messageList, ...this.officeList]

      this.$emit('select', list)
      // this.$
      // console.log(this.messageList, 111)
      // console.log(this.officeList, 222)
    }
  }
}
</script>
<style lang="scss" scoped>
  .officialFlag-container {
    border: 1px solid #E1E6ED;
    padding: 0px 16px 16px 16px;
    width: 468px;
     border-radius: 6px;
    position: relative;
    .officialFlag-img {
      margin-top: 12px;
       border: 1px solid #dcdcdc;
      border-radius: 4px;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.5) inset;
    }
  }
</style>
