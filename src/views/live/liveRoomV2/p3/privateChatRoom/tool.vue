<template>
  <div class="tool_box">
    <div class="tools">
      <template v-for="(item) in list">
        <template v-if="item.show(item)">
          <template v-if="item.type">
            <template v-if="item.type === 'emoji'">
              <el-tooltip :key="item.key" effect="dark" :content="item.label" placement="top">
                <div class="iconBg m-l-r-5">
                  <Emoji v-model="emojiVisible" @selectEmoji="selectEmoji" />
                </div>
              </el-tooltip>
            </template>
            <template v-else-if="item.type === 'image'">
              <el-tooltip :key="item.key" effect="dark" :content="item.label" placement="top">
                <div class="iconBg m-l-r-5">
                  <el-upload ref="upload" class="upload-demo" action="#" :limit="1" :show-file-list="false" :http-request="changeImage" accept=".jpg,.jpeg,.png,JPG,JPEG,PNG">
                    <svg-icon class-name="toolsIcon" icon-class="liveToolImage" />
                  </el-upload>
                </div>
              </el-tooltip>
            </template>
          </template>
          <template v-else>
            <el-tooltip :key="item.key" effect="dark" :content="item.label" placement="top">
              <div class="iconBg m-l-r-5">
                <svg-icon class-name="toolsIcon" :icon-class="item.icon" @click="handleCommand(item.toolFn)" />
              </div>
            </el-tooltip>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import Emoji from '@/views/live/liveRoomV2/p3/component/Emoji/index'
import { mapState } from 'vuex'
import Dialog from '@/views/live/liveRoomV2/Dialog'
import {
  couponRevoke,
  couponSend
} from '@/api/liveRoom/index.js'
export default {
  components: {
    Emoji
  },
  data() {
    return {
      list: [
        { key: 'emoji', label: '表情', type: 'emoji', toolFn: '', show: (row) => { return true } },
        { key: 'image', label: '图片', type: 'image', toolFn: '', show: (row) => { return true } },
        { key: 'heatingOrder', label: '发送商品', toolFn: 'onhandleOpenGoods', icon: 'liveToolPlaceOrder', show: (row) => { return true } },
        { key: 'heatingCollar', label: '优惠券', toolFn: 'onhandleSendCoupon', icon: 'liveToolCoupon', show: (row) => { return true } }
      ],
      emojiVisible: false
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      liveRoomDetail: state => state.im.liveRoomDetail,
      scriptSetting: state => state.im.scriptSetting
    })
  },
  mounted() {},
  methods: {
    handleCommand(res) {
      console.log(res, '点击了')
      if (res && this[res]) {
        this[res]()
      }
      // this[res]()
    },
    // 1v1私聊发送优惠券
    privateChatSendCoupon(row) {
      const data = {
        liveRoomId: this.$route.params.id,
        type: 2,
        liveCouponId: row.liveCouponId,
        userId: this.chatUser.userId
      }
      return couponSend(data).then(res => {
        return this.$store.dispatch('im/sendCoupon', { data: row, res: res })
      })
    },
    selectEmoji(res) {
      // this.$refs.comment.insertEmoji(res.name)
      this.$emit('selectEmoji', res.name)
    },
    changeImage(e) {
      if (this.$refs.upload) {
        Object.prototype.toString.call(this.$refs.upload).slice(8, -1) === 'Array' ? this.$refs.upload[0].clearFiles() : this.$refs.upload.clearFiles()
      }
      this.handleImage(e.file, data => {
        // this.sendPicMsg(data)
        console.log(data, 'data')
        this.$emit('selectImg', data)
      })
    },
    handleImage(file, callback, maxWidth = 200) {
      // console.log('粘贴的图片', file)
      const that = this
      if (!file) {
        console.log('图片格式不支持')
        return
      }
      const reader = new FileReader()
      reader.onload = function () {
        const result = this.result
        // console.log('compressedDataUrl', result)
        let img = new Image()
        img.onload = function () {
          const compressedDataUrl = that.compress(
            img,
            file.type,
            maxWidth,
            true
          )
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
    // 发送图片消息
    sendPicMsg(result) {
      this.$refs.comment.clear()
      this.$store.dispatch('im/sendPic', result).then(res => {
        this.$emit('scrollBottom')
      })
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
    // 直播间撤回优惠券
    liveRoomRevokeCoupon(row) {
      const data = {
        liveRoomId: this.$route.params.id,
        type: 1,
        liveCouponId: row.liveCouponId
      }
      return couponRevoke(data)
    },
    compress(img, type, maxWidth, flag) {
      let canvas = document.createElement('canvas')
      let ctx2 = canvas.getContext('2d')
      const ratio = img.width / img.height
      let width = img.width
      let height = img.height
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
    }
  }
}
</script>

<style lang='scss' scoped>
.tool_box {
  display: flex;
  height: 44px;
  min-height: 44px;
  max-height: 44px;
  // overflow: hidden;
  background: #FFF;
  border-top: 1px solid #e6e6e6;
  .tools {
    // overflow: hidden;
    color: #fff;
    height: 44px;
    display: flex;
    align-items: center;
    // 分割线
    .line {
      width: 1px;
      height: 23px;
      border: 1px solid #dde1e6;
      margin-left: 14px;
      margin-right: 14px;
    }
  }
  .rightTools {
    flex: 1 0 0;
    width: 0;
    border-top: 1px solid #e6e6e6;
    // border-bottom: 1px solid #e6e6e6;
    .rightTools_tools {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      color: #fff;
      height: 44px;
    }
  }
  .toolsSetting {
    width: 50px;
    border-top: 1px solid #e6e6e6;
    // border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: center;
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
    width: 20px;
    height: 20px;
    font-size: 20px;
    cursor: pointer;
    // transform: translateY(-6px);
  }
  .toolsIcon {
    width: 20px;
    height: 20px;
    min-width: 20px;
    font-size: 20px;
    cursor: pointer;
  }
  .toolsView {
    animation-name: slide-left;
    animation-duration: 0.3s;
  }
}
.m-l-r-5 {
  margin-left: 5px;
  margin-right: 5px;
}

::v-deep {
  .upload-demo {
    .el-upload {
      display: flex;
      align-items: center;
    }
  }
  .rightTools {
    .el-scrollbar .el-scrollbar__wrap {
      overflow: hidden;
    }
    .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view{
      white-space: nowrap;
      display: inline-block;
      min-width: 100%;
      height: 44px;
    }
    .el-scrollbar__bar.is-horizontal {
      bottom: 8px;
    }
  }
}
@keyframes slide-left {
  0%{
    opacity: 0;
    transform: translateY(100%);
  }
  100%{
    opacity: 1;
    transform: translateY(0);
  }
}
.iconBg {
  width: 28px;
  height: 28px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #F7F7F7;
  }
}
</style>
