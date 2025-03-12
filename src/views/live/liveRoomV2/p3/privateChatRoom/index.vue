<template>
  <div class="privateChatRoom">
    <p3Header @onload="onload" />
    <div v-if="!loading" class="privateChatRoom_content">
      <div ref="privateChatRoom" class="charRoom">
        <!-- 私人聊天 -->
        <ScroollPane ref="ScroollPane" class="chatList" @load="rollEnd" @rollTop="rollTop">
          <chatList @dblclick="(item) => $emit('dblclick', item)" @imgLoadSuccess="imgLoadSuccess" />
        </ScroollPane>
      </div>
      <slot>
        <privateChatInput ref="privateChatInput" />
      </slot>
    </div>
  </div>
</template>

<script>
import privateChatInput from './privateChatInput.vue'
import ScroollPane from './component/ScrollPane.vue'
import chatList from './component/chatList.vue'
import { mapState } from 'vuex'
import p3Header from './p3Header.vue'
export default {
  components: {
    privateChatInput,
    p3Header,
    ScroollPane,
    chatList
  },
  data() {
    return {
      msg: '',
      loading: false
    }
  },
  provide() {
    return {
      onfocus: () => this.onfocus()
    }
  },
  computed: {
    ...mapState({
      'chatListArr': state => state.im.privateChatView.messageData,
      isCompleted: state => state.im.privateChatView.isCompleted,
      chatUser: state => state.im.chatUser,
      imUserInfo: state => state.im.imUserInfo,
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  watch: {
    chatListArr: {
      handler(val) {
        // 聊天数据改变，需要将滚动条滚动到底部
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollBottom()
          }, 200)
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 加载完成
    onload() {
      this.loading = false
      setTimeout(() => {
        this.scrollBottom()
      }, 200)
    },
    // 滚动到底部
    scrollBottom() {
      this.$refs.ScroollPane && this.$refs.ScroollPane.scrollBottom()
    },
    // 图片加载完成
    imgLoadSuccess() {
      setTimeout(() => {
        this.scrollBottom()
      }, 200)
    },
    rollEnd() {
      console.log('触底了~')
    },
    rollTop() {
      if (!this.isCompleted && this.chatUser.type !== 2 && this.chatListArr.length > 0) {
        // 有更多数据，可以继续加载
        const id = `comment_${this.chatListArr[0].id}`
        this.$store.dispatch('im/getMessageListMore', this.chatUser.conversationID).then(() => {
          console.log('获取完数据拉')
          this.$nextTick(() => {
            const scrollHeight = document.querySelector(`#${id}`)
            this.$refs.ScroollPane.scrollEl(scrollHeight)
          })
        })
      }
    },
    onfocus() {
      this.$refs.privateChatInput ? this.$refs.privateChatInput.onfocus() : this.$emit('onfocus')
    }
    // clearMsg() {
    //   this.$refs.inputBox && this.$refs.inputBox.clearMsg()
    // }
    // 输入框点击
    // onHandleClick() {
    //   this.$store.dispatch('im/ifSendMessageReadReceipt')
    // },
    // sendMsg() {
    //   if (this.loading) {
    //     return
    //   }
    //   if (!this.msg) {
    //     return
    //   }
    //   this.$emit('scrollBottom')
    //   this.$refs.comment.clear()
    //   this.loading = true
    //   this.$store.dispatch('im/sendMessage', this.msg).then((res) => {
    //     this.msg = ''
    //     const data = {
    //       messageFeature: { needTyping: 0, version: 0 },
    //       messageReply: {
    //         cloudCustomData: '',
    //         messageAbstract: '', // 发送的消息内容
    //         messageSender: '', // 发送者ID
    //         messageSenderName: '', // 发送者姓名
    //         messageID: '',
    //         messageType: '', // 消息类型 1: 文本 3: 图片
    //         version: 0
    //       },
    //       payload: {}
    //     }
    //     this.$store.commit('im/SET_replySetting', { key: 'data', data: data })
    //     this.$store.commit('im/SET_replySetting', { key: 'ifReply', data: false })
    //     this.loading = false
    //   }).catch((err) => {
    //     this.msg = ''
    //     console.log('消息发送失败', err)
    //     this.loading = false
    //   })
    // },
    // // 输入框输入时回调函数
    // inputFunc(data, event) {
    //   // console.log('inputFunc', data, event)
    //   if (event.data === '@') {
    //     this.isShowAt = true // 显示弹窗
    //     this.$nextTick(() => {
    //       const dom = document.getElementsByClassName('at-pop-index')[0] // 获取成员列表弹窗，需要放在nextTick中
    //       // 设置位置
    //       dom.style.position = 'fixed'
    //       dom.style.left = Math.floor(data.left + 10) + 'px'
    //       dom.style.top = Math.floor(data.top) + 'px'
    //       dom.style.zIndex = 9999
    //     })
    //   } else {
    //     this.isShowAt = false
    //   }
    // },
    // blurFunc(event) {
    //   // 失焦时延时关闭弹窗，避免还未拿到数据
    //   if (this.isShowAt) {
    //     setTimeout(() => {
    //       this.isShowAt = false
    //     }, 500)
    //   }
    //   // console.log('blurFunc', event)
    // },
    // // 发送图片消息
    // sendPicMsg(result) {
    //   this.$refs.comment.clear()
    //   this.$store.dispatch('im/sendPic', result).then(res => {
    //     this.$emit('scrollBottom')
    //   })
    // },
    // onDropFile(e) {
    //   const type = getFileType(e.name).suffix
    //   const isIMAGE = ['jpg', 'png', 'JPG', 'PNG'].includes(type)
    //   if (!isIMAGE) {
    //     return this.$message.error(`仅支持jpg或png格式图片!`)
    //   }
    //   this.changeImage({ file: e })
    // },
    // handleImage(file, callback, maxWidth = 200) {
    //   // console.log('粘贴的图片', file)
    //   const that = this
    //   if (!file) {
    //     console.log('图片格式不支持')
    //     return
    //   }
    //   const reader = new FileReader()
    //   reader.onload = function () {
    //     const result = this.result
    //     // console.log('compressedDataUrl', result)
    //     let img = new Image()
    //     img.onload = function () {
    //       const compressedDataUrl = that.compress(
    //         img,
    //         file.type,
    //         maxWidth,
    //         true
    //       )
    //       const url = that.compress(img, file.type, maxWidth, false)
    //       img = null
    //       callback({
    //         data: file,
    //         compressedDataUrl,
    //         url,
    //         type: 'image'
    //       })
    //     }
    //     img.src = result
    //   }
    //   reader.readAsDataURL(file)
    // },
    // compress(img, type, maxWidth, flag) {
    //   let canvas = document.createElement('canvas')
    //   let ctx2 = canvas.getContext('2d')
    //   const ratio = img.width / img.height
    //   let width = img.width
    //   let height = img.height
    //   // 根据flag判断是否压缩图片
    //   if (flag) {
    //     // 压缩后的图片展示在输入框
    //     width = maxWidth
    //     height = maxWidth / ratio // 维持图片宽高比
    //   }
    //   canvas.width = width
    //   canvas.height = height
    //   ctx2.fillStyle = '#fff'
    //   ctx2.fillRect(0, 0, canvas.width, canvas.height)
    //   ctx2.drawImage(img, 0, 0, width, height)
    //   let base64Data = canvas.toDataURL(type, 0.75)
    //   if (type === 'image/gif') {
    //     const regx = /(?<=data:image).*?(?=;base64)/ // 正则表示时在用于replace时，根据浏览器的不同，有的需要为字符串
    //     base64Data = base64Data.replace(regx, '/gif')
    //   }
    //   canvas = null
    //   ctx2 = null
    //   return base64Data
    // }
  }
}
</script>

<style lang='scss' scoped>
.privateChatRoom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #F7F7F7;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 2;
  .privateChatRoom_content {
    flex: 1 0 0;
      position: relative;
      display: flex;
      flex-direction: column;
      .charRoom {
        flex: 1 0 0;
        overflow: hidden;
        position: relative;
      }
  }
  .chatList {
      height: 100%;
  }
  .liveChatRoom-scroll {
      height: 100%;
  }
  .scorllPaneChatList {
      height: 100%;
  }
}
</style>
