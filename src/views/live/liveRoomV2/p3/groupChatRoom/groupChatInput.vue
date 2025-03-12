<template>
  <div class="inputArea">
    <tool ref="tool" @selectImg="selectImg" @selectEmoji="selectEmoji" />
    <VEditDiv2
      ref="VEditDiv2"
      placeholder="请输入"
      @onDropFile="onDropFile"
      @sendMsg="sendMsg"
    />
    <!-- <VEditDiv ref="comment" v-model="msg" placeholder="请输入" @click.native="onHandleClick" @sendMsg="sendMsg" @inputFunc="inputFunc" @blurFunc="blurFunc" @sendPicMsg="sendPicMsg" @onDropFile="onDropFile" /> -->
    <div class="sendBtn" @click="sendMsg">发送</div>
  </div>
</template>

<script>
import tool from './tool.vue'
import VEditDiv2 from '@/views/live/liveRoomV2/p3/component/VEditDiv2.vue'
import { getSendMessageCmd, sendMessage } from '@/api/liveRoom/setting.js'
import { getFileType } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  components: {
    tool,
    VEditDiv2
  },
  data() {
    return {
      msg: '',
      emojiVisible: false,
      isShowAt: false,
      loading: false,
      listData: [],
      timer: null,
      ifOrderNoRead: false // 订单记录是否已读
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      cmd: state => state.im.cmd,
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  mounted() {
    this.getCmdText()
  },
  methods: {
    // 获取
    getCmdText() {
      getSendMessageCmd().then(res => {
        this.$store.commit('im/SET_cmd', res.data)
      })
    },
    // 工具栏选择图片
    selectImg(data) {
      this.$refs.VEditDiv2.imgSelection(data)
    },
    onDropFile(e) {
      const type = getFileType(e.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG'].includes(type)
      if (!isIMAGE) {
        return this.$message.error(`仅支持jpg或png格式图片!`)
      }
      this.$refs.tool.changeImage({ file: e })
    },
    sendMsg() {
      if (this.loading) {
        return
      }
      const value = this.$refs.VEditDiv2.getValue()
      console.log(value, 'value')
      this.msg = value
      if (!this.msg) {
        // this.$message.error('消息内容不能为空')
        return
      }
      if (this.cmd.enable && this.cmd.cmd) {
        console.log('12312313213')
        const regexStr = '^(' + this.cmd.cmd + '\\d*[:：])'
        const regex = new RegExp(regexStr, 'i')
        if (regex.test(this.msg)) {
          const str = this.msg.replace(regex, '')
          const regexStr2 = '^' + this.cmd.cmd + '(\\d+)[:：]'
          const regex2 = new RegExp(regexStr2, 'i')
          const match = this.msg.match(regex2)
          let num = 1
          if (match && match[1]) {
            num = match[1]
          }
          console.log('命中了特殊指令', str, num)
          this.loading = true
          const data = {
            liveRoomId: this.$route.params.id,
            message: str,
            num: num > 10 ? 10 : num
          }
          console.log(data, 'data')
          return sendMessage(data)
            .then(res => {
              this.msg = ''
              this.$refs.VEditDiv2.handleClear()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
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
    onfocus() {
      this.$refs.VEditDiv2 && this.$refs.VEditDiv2.onFocus()
    },
    selectEmoji(value) {
      this.$refs.VEditDiv2 && this.$refs.VEditDiv2.insertEmoji(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.inputArea {
  background: #fff;
  height: 164px;
  max-height: 164px;
  min-height: 164px;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 234px;
  max-height: 234px;
  min-height: 234px;
  .sendBtn {
    cursor: pointer;
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
    z-index: 10;
  }
}
</style>
