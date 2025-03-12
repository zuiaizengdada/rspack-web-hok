<template>
  <div class="tool_box">
    <div class="tools">
      <template v-for="item in list">
        <template v-if="item.show(item)">
          <template v-if="item.type">
            <template v-if="item.type === 'emoji'">
              <el-tooltip
                :key="item.key"
                effect="dark"
                :content="item.label"
                placement="top"
              >
                <div class="iconBg m-l-r-5">
                  <Emoji v-model="emojiVisible" @selectEmoji="selectEmoji" />
                </div>
              </el-tooltip>
            </template>
            <template v-else-if="item.type === 'image'">
              <el-tooltip
                :key="item.key"
                effect="dark"
                :content="item.label"
                placement="top"
              >
                <div class="iconBg m-l-r-5">
                  <el-upload
                    ref="upload"
                    class="upload-demo"
                    action="#"
                    :limit="1"
                    :show-file-list="false"
                    :http-request="changeImage"
                    accept=".jpg,.jpeg,.png,JPG,JPEG,PNG"
                  >
                    <svg-icon
                      class-name="toolsIcon"
                      icon-class="liveToolImage"
                    />
                  </el-upload>
                </div>
              </el-tooltip>
            </template>
          </template>
          <template v-else>
            <el-tooltip
              :key="item.key"
              effect="dark"
              :content="item.label"
              placement="top"
            >
              <div class="iconBg m-l-r-5">
                <svg-icon
                  class-name="toolsIcon"
                  :icon-class="item.icon"
                  @click="handleCommand(item.toolFn)"
                />
              </div>
            </el-tooltip>
          </template>
        </template>
      </template>
      <div v-if="chatUser.type === 2" class="line" />
    </div>

    <div class="rightTools">
      <el-scrollbar
        class="horizontal-scrollbar"
        wrap-style="margin-bottom: 17px;"
      >
        <div class="rightTools_tools">
          <template v-for="item in toolBar">
            <template v-if="item.show(item)">
              <template v-if="item.type">
                <template v-if="item.type === 'purchaseRecord'">
                  <el-tooltip
                    :key="item.key"
                    effect="dark"
                    :content="item.label"
                    placement="top"
                  >
                    <div class="purchaseRecordIcon iconBg m-l-r-5">
                      <span v-if="ifOrderNoRead" class="m_Badge" />
                      <svg-icon
                        class="toolsView"
                        class-name="toolsIcon"
                        icon-class="liveToolShopping"
                        @click="onhandlePurchaseRecord"
                      />
                    </div>
                  </el-tooltip>
                </template>
              </template>
              <template v-else>
                <el-tooltip
                  :key="item.key"
                  effect="dark"
                  :content="item.label"
                  placement="top"
                >
                  <template v-if="item.icon">
                    <div class="iconBg m-l-r-5">
                      <svg-icon
                        class="toolsView"
                        class-name="toolsIcon"
                        :icon-class="item.icon"
                        @click="handleCommand(item.toolFn)"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <div class="iconBg m-l-r-5">
                      <AppAvatar
                        :name="item.label"
                        :width="24"
                        class="toolsView"
                        :no-name="true"
                        @click="handleCommand(item.toolFn)"
                      />
                    </div>
                  </template>
                </el-tooltip>
              </template>
            </template>
          </template>
        </div>
      </el-scrollbar>
    </div>

    <!--  -->
    <div
      v-if="
        chatUser.type === 2 &&
        liveRoomDetail.liveModel === 'AI_LIVE' &&
        [1, 2, 3].includes(liveRoomDetail.status) &&
        (havBtnOld('web:liveRoom:pause') || havBtnOld('web:liveRoom:classOver'))
      "
      class="toolsSetting"
    >
      <el-tooltip effect="dark" content="设置" placement="top">
        <el-dropdown trigger="click" placement="top" @command="handleCommand">
          <span class="el-dropdown-link">
            <svg-icon
              class-name="toolsIcon"
              icon-class="liveToolEmergencyStop"
              style="transform: translateY(2px)"
            />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="
                scriptSetting.isRelateScript &&
                scriptSetting.scriptInteractStatus === 1 &&
                [1, 2, 3].includes(liveRoomDetail.status) &&
                havBtnOld('web:liveRoom:pause')
              "
              command="onhandleStop"
            >
              <svg-icon
                class-name="toolsIcon m-r-10"
                icon-class="liveToolPauseinteraction"
              />暂停互动</el-dropdown-item
            >
            <el-dropdown-item
              v-if="
                liveRoomDetail.liveModel === 'AI_LIVE' &&
                [1, 2, 3].includes(liveRoomDetail.status) &&
                havBtnOld('web:liveRoom:classOver')
              "
              command="onhandleEnd"
            >
              <svg-icon
                class-name="toolsIcon m-r-10"
                icon-class="liveToolClassOver"
              /><span style="color: #ff1f00">紧急下课</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import Emoji from '@/views/live/liveRoomV2/p3/component/Emoji/index'
import { mapState, mapGetters } from 'vuex'
import Dialog from '@/views/live/liveRoomV2/Dialog'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import liveToolPopularity from '@/views/live/liveRoomV2/components/liveToolPopularity/index.vue'
import liveToolPlaceOrder from '@/views/live/liveRoomV2/components/liveToolPlaceOrder/index.vue'
import liveToolCoupon from '@/views/live/liveRoomV2/components/liveToolCoupon/index.vue'
import liveToolDesensitization from '@/views/live/liveRoomV2/components/liveToolDesensitization/index.vue'
import { urgentEndClass, operateInteract } from '@/api/liveRoom/im'
import {
  couponRevoke,
  couponSend,
  orderRemindNewRemind
} from '@/api/liveRoom/index.js'
export default {
  components: {
    Emoji,
    AppAvatar
  },
  inject: ['getLiveToolBar'],
  data() {
    return {
      list: [
        {
          key: 'emoji',
          label: '表情',
          type: 'emoji',
          toolFn: '',
          show: row => {
            return ['AI_LIVE', 'PERSON_LIVE'].includes(
              this.liveRoomDetail.liveModel
            )
          }
        },
        {
          key: 'image',
          label: '图片',
          type: 'image',
          toolFn: '',
          show: row => {
            return ['AI_LIVE', 'PERSON_LIVE'].includes(
              this.liveRoomDetail.liveModel
            )
          }
        },
        {
          key: 'clearMessage',
          label: '清屏',
          toolFn: 'clearMessage',
          icon: 'liveToolClearScreen',
          show: row => {
            return this.chatUser.type === 2
          }
        },
        {
          key: 'heatingOrder',
          label: '发送商品',
          toolFn: 'onhandleOpenGoods',
          icon: 'liveToolPlaceOrder',
          show: row => {
            return this.chatUser.type === 1
          }
        },
        {
          key: 'heatingCollar',
          label: '优惠券',
          toolFn: 'onhandleSendCoupon',
          icon: 'liveToolCoupon',
          show: row => {
            return this.chatUser.type === 1
          }
        },
        {
          key: 'studentVideo',
          label: '学员无法观看视频',
          toolFn: 'onhandleStudentVideo',
          icon: 'liveToolsUnwatchable',
          show: row => {
            return (
              ['AI_LIVE'].includes(this.liveRoomDetail.liveModel) &&
              this.chatUser.type === 2
            )
          }
        }
      ],
      emojiVisible: false,
      timer: null,
      ifOrderNoRead: false,
      showTimeLength: 1, // 停留时长
      notifyExample: []
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      liveRoomDetail: state => state.im.liveRoomDetail,
      scriptSetting: state => state.im.scriptSetting,
      noticeArray: state => state.im.noticeArray
    }),
    ...mapGetters(['permission_routes']),
    toolBar() {
      return this.getLiveToolBar()
    }
  },
  watch: {
    noticeArray: {
      handler(val) {
        if (val.length > 0) {
          // 超过三个 删除最开始的第一个
          if (this.notifyExample.length >= 3) {
            const firstNotify = this.notifyExample[0]
            this.notifyExample.splice(0, 1) // 从数组中移除
            firstNotify.close() // 关闭第一个通知
          }
          const cur = val[val.length - 1]
          const _this = this
          const instance = this.$notify({
            title: '追单消息',
            dangerouslyUseHTMLString: true,
            duration: 0,
            message: `<div style="cursor: pointer;">${cur.content}</div>`,
            onClose: res => {
              const index = this.notifyExample.findIndex(
                f => f._uid === res._uid
              )
              if (index !== -1) {
                this.notifyExample.splice(index, 1) // 确保只在找到时移除
              }
            },
            onClick: () => {
              Dialog.close({ visible: false, type: 'PurchaseRecord' })
              Dialog.open({
                visible: true,
                type: 'PurchaseRecord',
                liveRoomId: _this.$route.params.id,
                liveRoomCode: _this.liveRoomDetail.code,
                openData: {
                  existInviteTeacher: false,
                  orderStatus: Number(cur.orderStatus),
                  teacherId: cur.userId
                },
                success: row => {}
              })
              const index = _this.notifyExample.findIndex(
                f => f._uid === instance._uid
              )
              if (index !== -1) {
                const notifyEl = this.notifyExample.splice(index, 1)
                notifyEl[0].close() // 确保关闭
              }
            }
          })
          this.notifyExample.push(instance)
        }
      },
      immediate: true,
      deep: true
    }
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getorderRemindNewRemind()
    }, 5000)
  },
  methods: {
    handleCommand(res) {
      console.log(res, '点击了')
      if (res && this[res]) {
        this[res]()
      }
      // this[res]()
    },
    // 公共聊天室--点击打开连麦记录
    onhandleOpenLianmaiRecord() {
      Dialog.open({
        visible: true,
        type: 'LianmaiRecord',
        liveRoomId: this.$route.params.id,
        groupId: this.liveRoomDetail.groupId,
        success: () => {}
      })
    },
    // 公共聊天室--点击打开抽奖
    onhandleOpenLottery() {
      Dialog.open({
        visible: true,
        type: 'Lottery',
        liveRoomId: this.$route.params.id,
        groupId: this.liveRoomDetail.groupId,
        success: row => {}
      })
    },
    // 公共聊天室--点击打开签到弹框
    onhandleOpenSign() {
      Dialog.open({
        visible: true,
        type: 'SendSign',
        liveRoomId: this.$route.params.id,
        groupId: this.liveRoomDetail.groupId,
        success: row => {
          Dialog.close()
        }
      })
    },
    // 公共聊天室--点击打开发送优惠券弹框
    onhandleSendCoupon() {
      Dialog.open({
        visible: true,
        type: 'SendCoupon',
        liveRoomId: this.$route.params.id,
        showRevoke: this.chatUser.type === 2,
        groupId: this.liveRoomDetail.groupId,
        success: row => {
          // console.log(row)
          if (row.type === 'send') {
            // 发送
            return this.chatUser.type === 2
              ? this.liveRoomSendCoupon(row.data, row.stayTime)
              : this.privateChatSendCoupon(row.data, row.stayTime)
          } else if (row.type === 'revoke') {
            // 撤回
            return this.liveRoomRevokeCoupon(row.data)
          }
        }
      })
    },
    // 公共聊天室--直播间发送优惠券
    liveRoomSendCoupon(row, stayTime) {
      const data = {
        stayTime: stayTime,
        liveRoomId: this.$route.params.id,
        type: 1,
        liveCouponId: row.liveCouponId
      }
      return couponSend(data)
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
    // 直播间撤回优惠券
    liveRoomRevokeCoupon(row) {
      const data = {
        liveRoomId: this.$route.params.id,
        type: 1,
        liveCouponId: row.liveCouponId
      }
      return couponRevoke(data)
    },
    // 直播间订单小红点:查询是否有新消息
    getorderRemindNewRemind() {
      const data = {
        liveRoomId: this.$route.params.id
      }
      orderRemindNewRemind(data).then(res => {
        this.ifOrderNoRead = res.data.isRead === 1
      })
    },
    // 公共聊天室--点击打开订单详情
    onhandlePurchaseRecord() {
      // PurchaseRecord
      Dialog.open({
        visible: true,
        type: 'PurchaseRecord',
        liveRoomId: this.$route.params.id,
        liveRoomCode: this.liveRoomDetail.code,
        success: row => {}
      })
    },
    // 公共聊天室--点击无法看视频按钮
    onhandleStudentVideo() {
      Dialog.open({
        visible: true,
        liveRoomId: this.$route.params.id,
        liveModel: this.liveRoomDetail.liveModel,
        type: 'StudentCanVideo',
        success: () => {}
      })
    },
    selectEmoji(res) {
      console.log(res.name, 'res.name')
      this.$emit('selectEmoji', res.name)
      // this.$refs.comment.insertEmoji(res.name)
    },
    changeImage(e) {
      if (this.$refs.upload) {
        Object.prototype.toString.call(this.$refs.upload).slice(8, -1) ===
        'Array'
          ? this.$refs.upload[0].clearFiles()
          : this.$refs.upload.clearFiles()
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
    },
    // 点击打开发送商品弹框
    onhandleOpenGoods() {
      Dialog.open({
        visible: true,
        type: 'SendGoods',
        liveRoomId: this.$route.params.id,
        value: this.showTimeLength,
        success: res => {
          this.$notify.success({ title: '提示', message: '发送成功' })
          this.showTimeLength = res?.showTimeLength / 60
          // Dialog.close()
        }
      })
    },
    // 公共聊天室-公告
    onhandleAnnouncement() {
      Dialog.open({
        type: 'EditNotice',
        visible: true,
        liveRoomId: this.$route.params.id,
        form: {
          value: JSON.parse(JSON.stringify(this.liveRoomDetail.announcement)),
          url: JSON.parse(
            JSON.stringify(this.liveRoomDetail.announcementUrl || '')
          )
        },
        success: () => {
          Dialog.close()
        }
      })
    },
    // 公共聊天室-预约下一场
    onhandleOpenNextLive() {
      Dialog.open({
        visible: true,
        type: 'SendNextLive',
        liveRoomId: this.$route.params.id,
        groupId: this.liveRoomDetail.groupId,
        success: () => {
          this.$notify.success({ title: '提示', message: '发送成功' })
          Dialog.close()
        }
      })
    },
    // 公共聊天室-敏感词liveToolDesensitization
    onhandleDesensitization() {
      Dialog.open({
        visible: true,
        type: 'LiveTool',
        height: 526,
        title: '敏感词',
        viewComponent: liveToolDesensitization,
        options: {
          liveRoomId: this.$route.params.id,
          groupId: this.liveRoomDetail.groupId,
          success: () => {
            Dialog.close()
          }
        }
      })
    },
    // 公共聊天室-加热人气
    heatPopularity() {
      Dialog.open({
        visible: true,
        type: 'LiveTool',
        height: 526,
        title: '加热人气',
        viewComponent: liveToolPopularity,
        options: {
          liveStartTime: this.liveRoomDetail.startTime,
          liveRoomId: this.$route.params.id,
          liveRoomStatus: this.liveRoomDetail.status,
          groupId: this.liveRoomDetail.groupId,
          success: () => {
            Dialog.close()
          }
        }
      })
    },
    // 公共聊天室-加热领券
    heatingCollar() {
      Dialog.open({
        visible: true,
        type: 'LiveTool',
        height: 526,
        title: '加热领券',
        viewComponent: liveToolCoupon,
        options: {
          liveRoomId: this.$route.params.id,
          groupId: this.liveRoomDetail.groupId,
          success: () => {
            Dialog.close()
          }
        }
      })
    },
    // 公共聊天室-加热下单
    heatingOrder() {
      Dialog.open({
        visible: true,
        type: 'LiveTool',
        height: 526,
        title: '加热下单',
        viewComponent: liveToolPlaceOrder,
        options: {
          liveRoomId: this.$route.params.id,
          groupId: this.liveRoomDetail.groupId,
          success: () => {
            Dialog.close()
          }
        }
      })
    },
    // 判断是否有权限-紧急下课
    havBtnOld(key) {
      const obj = this.permission_routes.find(v => v.path === '/privateLive')
      if (obj && obj.children && obj.children.length > 0) {
        const o = obj.children.find(v => v.path === 'liveRoomV2')
        console.log(o, 'o')
        if (o && o.meta && o.meta.permsList && o.meta.permsList.length > 0) {
          return o.meta.permsList.includes(key)
        }
      }

      return false
    },
    clearMessage() {
      this.$store.commit('im/set_isCompleted', true)
      this.$store.commit('im/SET_messageData', [])
      this.$store.commit('im/set_ifScrollBottom', true)
      this.$store.commit('im/set_ifCanScrollBottom', true)
    },
    // 暂停互动
    onhandleStop() {
      console.log('点击暂停互动按钮')
      this.$delModal({
        tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">暂停互动提示</div>
          <div class="m-t-16" style="font-size: 16px;color: #F53F3F;line-height: 24px;">将课堂中的互动进行暂停。请老师谨慎操作！</div>
        `,
        success: () => {
          const data = {
            liveRoomId: this.$route.params.id,
            operateType: 1
          }
          operateInteract(data).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
          })
        }
      })
    },
    // 紧急下课
    onhandleEnd() {
      this.$delModal({
        tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">紧急下课提示</div>
          <div class="m-t-16" style="font-size: 16px;color: #F53F3F;line-height: 24px;">
            1、紧急下课将是直播结束，不能再进行直播！<br>
            2、课堂中的学员还可以发言；<br>
          </div>
        `,
        success: () => {
          console.log('点击紧急下课按钮')
          const data = {
            liveRoomId: this.$route.params.id
            // operateType: 4
          }
          urgentEndClass(data).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tool_box {
  display: flex;
  height: 44px;
  min-height: 44px;
  max-height: 44px;
  // overflow: hidden;
  background: #fff;
  .tools {
    // overflow: hidden;
    color: #fff;
    height: 44px;
    border-top: 1px solid #e6e6e6;
    // border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    // 分割线
    .line {
      width: 1px;
      height: 12px;
      border: 1px solid #f0f1f1;
      margin-left: 9px;
      margin-right: 9px;
      // margin-left: 28px;
      // margin-right: 28px;
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
  .m_Badge {
    position: absolute;
    top: 0;
    width: 6px;
    height: 6px;
    background: red;
    right: 0;
    border-radius: 50%;
  }
}
.m-l-r-5 {
  margin-left: 5px;
  margin-right: 5px;
}
.purchaseRecordIcon {
  position: relative;
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
    .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
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
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
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
    background: #f7f7f7;
  }
}
</style>
