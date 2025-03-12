<template>
  <div class="InputBox">
    <div class="tools">
      <!-- 功能区 -->
      <el-tooltip effect="dark" content="表情" placement="top">
        <Emoji v-model="emojiVisible" class="m-r-28" @selectEmoji="selectEmoji" />
      </el-tooltip>
      <el-tooltip effect="dark" content="图片" placement="top">
        <el-upload ref="upload" class="upload-demo m-r-28" action="#" :limit="1" :show-file-list="false" :http-request="changeImage" accept=".jpg,.jpeg,.png,JPG,JPEG,PNG">
          <svg-icon class-name="toolsIcon" icon-class="tupian" />
        </el-upload>
      </el-tooltip>
      <el-tooltip effect="dark" content="发送商品" placement="top">
        <svg-icon class="m-r-28" class-name="toolsIcon" icon-class="tuisongshangping" @click="onhandleOpenGoods" />
      </el-tooltip>
      <el-tooltip effect="dark" content="优惠券" placement="top">
        <svg-icon class="m-r-28" class-name="toolsIcon" icon-class="youhuijuan" @click="onhandleSendCoupon" />
      </el-tooltip>
    </div>
    <div class="import">
      <!-- 输入区域 -->
      <VEditDiv
        ref="comment"
        v-model="msg"
        placeholder="请输入"
        @click.native="onHandleClick"
        @sendMsg="sendMsg"
        @inputFunc="inputFunc"
        @blurFunc="blurFunc"
        @sendPicMsg="sendPicMsg"
        @onDropFile="onDropFile"
      />
      <at-pop v-if="isShowAt" :list-data="listData" @onSelect="onSelect" />
    </div>
    <div class="footer"><el-button size="mini" type="primary" :loading="loading" class="footerSendBtn" @click="sendMsg">发送</el-button></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VEditDiv from '@/views/live/liveRoom/components/p2/VEditDiv'
import Emoji from '@/views/live/liveRoom/components/p2/Emoji/index'
import AtPop from '@/views/live/liveRoom/components/p2/AtPop.vue'
import Dialog from '@/views/live/liveRoom/components/Dialog/index.js'
import { couponRevoke, couponSend } from '@/api/liveRoom/index.js'
import { getFileType } from '@/utils/index'
export default {
  components: {
    VEditDiv,
    Emoji,
    AtPop
  },
  data() {
    return {
      msg: '',
      emojiVisible: false,
      isShowAt: false,
      loading: false,
      listData: [],
      atIndex: 0 // 每次@成员，atIndex递增
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      leftList: state => state.im.leftList,
      liveRoomDetail: state => state.im.liveRoomDetail,
      scriptSetting: state => state.im.scriptSetting
    })
  },
  watch: {
    leftList: {
      handler(val) {
        const arr = this.leftList.myTrainees.concat(this.leftList.generalTrainees)
        this.listData = arr
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    onfocus() {
      this.$refs.comment && this.$refs.comment.onfocus()
    },
    onhandleTest() {
      let i = 0
      const a = setInterval(() => {
        i++
        i < 100 ? this.testSend(String(i)) : clearInterval(a)
      }, 200)
    },
    testSend(msg) {
      this.$emit('scrollBottom')
      this.$refs.comment.clear()
      this.loading = true
      this.msg = msg
      this.$store.dispatch('im/sendMessage', this.msg).then((res) => {
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
        this.$store.commit('im/SET_replySetting', { key: 'ifReply', data: false })
        this.loading = false
      }).catch((err) => {
        this.msg = ''
        console.log('消息发送失败', err)
        this.loading = false
      })
    },
    sendMsg() {
      if (this.loading) {
        return
      }
      if (!this.msg) {
        // this.$message.error('消息内容不能为空')
        return
      }
      // if (this.liveRoomDetail.status === 9) {
      //   this.$refs.comment.clear()
      //   this.msg = ''
      //   return
      // }
      this.$emit('scrollBottom')
      this.$refs.comment.clear()
      this.loading = true
      this.$store.dispatch('im/sendMessage', this.msg).then((res) => {
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
        this.$store.commit('im/SET_replySetting', { key: 'ifReply', data: false })
        this.loading = false
      }).catch((err) => {
        this.msg = ''
        console.log('消息发送失败', err)
        this.loading = false
      })
    },
    // 发送图片消息
    sendPicMsg(result) {
      this.$refs.comment.clear()
      this.$store.dispatch('im/sendPic', result).then((res) => {
        this.$emit('scrollBottom')
      })
    },
    onDropFile(e) {
      const type = getFileType(e.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG'].includes(type)
      if (!isIMAGE) {
        return this.$message.error(`仅支持jpg或png格式图片!`)
      }
      this.changeImage({ file: e })
    },
    selectEmoji(res) {
      this.$refs.comment.insertEmoji(res.name)
    },
    // 输入框输入时回调函数
    inputFunc(data, event) {
      // console.log('inputFunc', data, event)
      if (event.data === '@') {
        this.isShowAt = true // 显示弹窗
        this.$nextTick(() => {
          const dom = document.getElementsByClassName('at-pop-index')[0] // 获取成员列表弹窗，需要放在nextTick中
          // 设置位置
          dom.style.position = 'fixed'
          dom.style.left = Math.floor(data.left + 10) + 'px'
          dom.style.top = Math.floor(data.top) + 'px'
          dom.style.zIndex = 9999
        })
      } else {
        this.isShowAt = false
      }
    },
    blurFunc(event) {
      // 失焦时延时关闭弹窗，避免还未拿到数据
      if (this.isShowAt) {
        setTimeout(() => {
          this.isShowAt = false
        }, 500)
      }
      console.log('blurFunc', event)
    },
    // 选择成员时插入数据，并关闭弹窗
    onSelect(item) {
      this.atIndex++
      // 使用a标签表示@的成员
      const at = `<span name="at" value="${item.memberId}" tabindex="-1" id="${this.atIndex}" contenteditable="false" >@${item.memberName}</span>&#x200B;`
      this.$refs.comment.insertContent(at, this.atIndex)
      console.log('onSelect', item)
      // this.$refs.comment.insertContent(`${item.name} `); // 有空格
      this.isShowAt = false
    },
    onhandleScrollBottom() {
      this.$emit('scrollBottom')
    },
    clearMsg() {
      this.msg = ''
      this.$refs.comment.clear()
    },
    changeImage(e) {
      this.$refs.upload && this.$refs.upload.clearFiles()
      this.handleImage(e.file, (data) => {
        this.sendPicMsg(data)
      })
    },
    handleImage(file, callback, maxWidth = 200) {
      console.log('粘贴的图片', file)
      const that = this
      if (!file) {
        console.log('图片格式不支持')
        return
      }
      const reader = new FileReader()
      reader.onload = function () {
        const result = this.result
        console.log('compressedDataUrl', result)
        let img = new Image()
        img.onload = function() {
          const compressedDataUrl = that.compress(img, file.type, maxWidth, true)
          const url = that.compress(img, file.type, maxWidth, false)
          img = null
          callback({
            data: file,
            compressedDataUrl,
            url,
            type: 'image'
          })
        }
        img.src = result
      }
      reader.readAsDataURL(file)
    },
    compress(img, type, maxWidth, flag) {
      let canvas = document.createElement('canvas')
      let ctx2 = canvas.getContext('2d')
      const ratio = img.width / img.height
      let width = img.width; let height = img.height
      // 根据flag判断是否压缩图片
      if (flag) {
      // 压缩后的图片展示在输入框
        width = maxWidth
        height = maxWidth / ratio // 维持图片宽高比
      }
      canvas.width = width
      canvas.height = height
      ctx2.fillStyle = '#fff'
      ctx2.fillRect(0, 0, canvas.width, canvas.height)
      ctx2.drawImage(img, 0, 0, width, height)
      let base64Data = canvas.toDataURL(type, 0.75)
      if (type === 'image/gif') {
        const regx = /(?<=data:image).*?(?=;base64)/ // 正则表示时在用于replace时，根据浏览器的不同，有的需要为字符串
        base64Data = base64Data.replace(regx, '/gif')
      }
      canvas = null
      ctx2 = null
      return base64Data
    },
    // 点击打开发送商品弹框
    onhandleOpenGoods() {
      Dialog.open({
        visible: true,
        type: 'SendGoods',
        chatType: 1,
        liveRoomId: this.$route.params.id,
        success: (res) => {
          const data = {
            ...res,
            form_liveRoomId: this.liveRoomDetail.liveRoomId,
            form_liveRoomCode: this.liveRoomDetail.code
          }
          Dialog.close()
          return this.$store.dispatch('im/sendGoods', { data: data })
          // this.$notify.success({ title: '提示', message: '发送成功' })
        }
      })
    },
    // 输入框点击
    onHandleClick() {
      this.$store.dispatch('im/ifSendMessageReadReceipt')
    },
    handleCommand(res) {
      // console.log(res)
      this[res]()
    },
    // 点击打开发送优惠券弹框
    onhandleSendCoupon() {
      Dialog.open({
        visible: true,
        type: 'SendCoupon',
        liveRoomId: this.$route.params.id,
        showRevoke: this.chatUser.type === 2,
        groupId: this.liveRoomDetail.groupId,
        success: (row) => {
          console.log(row)
          if (row.type === 'send') {
            // 发送
            return this.privateChatSendCoupon(row.data, row.stayTime)
          } else if (row.type === 'revoke') {
            // 撤回
            return this.liveRoomRevokeCoupon(row.data)
          }
        }
      })
    },
    // 1v1私聊发送优惠券
    privateChatSendCoupon(row) {
      const data = {
        liveRoomId: this.$route.params.id,
        type: 2,
        liveCouponId: row.liveCouponId,
        userId: this.chatUser.userId
      }
      return couponSend(data).then((res) => {
        return this.$store.dispatch('im/sendCoupon', { data: row, res: res })
      })
    },
    // 直播间撤回优惠券
    liveRoomRevokeCoupon(row) {
      const data = {
        liveRoomId: this.$route.params.id,
        type: 1,
        liveCouponId: row.liveCouponId
      }
      return couponRevoke(data)
    }
  }
}
</script>

<style lang='scss' scoped>
.InputBox {
  display: flex;
  flex-direction: column;
  height: 219px;
  background: #F5F5F5;
  .tools {
    color: #fff;
    width: 100%;
    height: 44px;
    border-top: 1px solid #E6E6E6;
    border-bottom: 1px solid #E6E6E6;
    background: #F5F5F5;
    display: flex;
    align-items: center;
    padding-left: 19px;
    padding-right: 24px;
    .rightBtn {
      flex: 1 0 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    // 分割线
    .line {
      width: 1px;
      height: 23px;
      border: 1px solid #DDE1E6;
      margin-left: 28px;
      margin-right: 28px;
    }
  }
  .import {
    flex: 1 0 0;
    height: 100%;
    position: relative;
  }
  .footer {
    padding: 10px 23px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .upload-demo {
    width: 24px;
    height: 24px;
    font-size: 24px;
    cursor: pointer;
    // transform: translateY(-6px);
  }
  .toolsIcon {
    width: 24px;
    height: 24px;
    font-size: 24px;
    cursor: pointer;
  }
}
.m-r-28 {
  margin-right: 28px;
}
::v-deep {
  .el-upload {
    display: flex;
  }
}
</style>
