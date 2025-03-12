<template>
  <div class="inputArea">
    <tool ref="tool" @selectImg="selectImg" @selectEmoji="selectEmoji" />
    <VEditDiv2
      ref="VEditDiv2"
      placeholder="请输入"
      @onDropFile="onDropFile"
      @sendMsg="sendMsg"
    />
    <div class="sendBtn" @click="sendMsg">发送</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import tool from './tool.vue'
import { getFileType } from '@/utils/index'
import VEditDiv2 from '@/views/live/liveRoomV2/p3/component/VEditDiv2.vue'
export default {
  components: {
    VEditDiv2,
    tool
  },
  data() {
    return {
      msg: '',
      loading: false
    }
  },
  computed: {
    ...mapState({
      chatListArr: state => state.im.privateChatView.messageData,
      isCompleted: state => state.im.privateChatView.isCompleted,
      chatUser: state => state.im.chatUser,
      imUserInfo: state => state.im.imUserInfo,
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  mounted() {},
  methods: {
    selectEmoji(value) {
      this.$refs.VEditDiv2 && this.$refs.VEditDiv2.insertEmoji(value)
    },
    // 工具栏选择图片
    selectImg(data) {
      this.$refs.VEditDiv2 && this.$refs.VEditDiv2.imgSelection(data)
    },
    sendMsg() {
      console.log('123123123')
      if (this.loading) {
        return
      }
      const value = this.$refs.VEditDiv2.getValue()
      console.log(value, 'value')
      this.msg = value
      if (!this.msg) {
        return
      }
      this.$emit('scrollBottom')
      this.$refs.VEditDiv2.handleClear()
      this.loading = true
      this.$store
        .dispatch('im/sendMessage', this.msg)
        .then(res => {
          this.msg = ''
          const data = {
            messageFeature: { needTyping: 0, version: 0 },
            messageReply: {
              cloudCustomData: '',
              messageAbstract: '', // 发送的消息内容
              messageSender: '', // 发送者ID
              messageSenderName: '', // 发送者姓名
              messageID: '',
              messageType: '', // 消息类型 1: 文本 3: 图片
              version: 0
            },
            payload: {}
          }
          this.$store.commit('im/SET_replySetting', { key: 'data', data: data })
          this.$store.commit('im/SET_replySetting', {
            key: 'ifReply',
            data: false
          })
          this.loading = false
        })
        .catch(err => {
          this.msg = ''
          console.log('消息发送失败', err)
          this.loading = false
        })
    },
    onDropFile(e) {
      const type = getFileType(e.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG'].includes(type)
      if (!isIMAGE) {
        return this.$message.error(`仅支持jpg或png格式图片!`)
      }
      this.$refs.tool.changeImage({ file: e })
    },
    onfocus() {
      this.$refs.VEditDiv2 && this.$refs.VEditDiv2.onFocus()
    }
  }
}
</script>

<style lang="scss" scoped>
.inputArea {
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 234px;
  max-height: 234px;
  min-height: 234px;
  .sendBtn {
    position: absolute;
    bottom: 15px;
    right: 15px;
    width: 70px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 5px;
    background: #0c6fff;
    color: #ffffff;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 32px;
    cursor: pointer;
    z-index: 2;
  }
}
</style>
