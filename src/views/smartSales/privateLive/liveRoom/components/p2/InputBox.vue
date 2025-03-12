<template>
  <div class="InputBox">
    <div class="tools">
      <!-- 功能区 -->
      <template v-for="(item, index) in toolBar">
        <template v-if="item.show(item)">
          <template v-if="item.type">
            <template v-if="item.type === 'emoji'">
              <el-tooltip :key="index" effect="dark" :content="item.label" placement="top">
                <Emoji v-model="emojiVisible" class="m-r-28" @selectEmoji="selectEmoji" />
              </el-tooltip>
            </template>
            <template v-else-if="item.type === 'hotlive'">
              <el-tooltip :key="index" effect="dark" :content="item.label" placement="top">
                <div :class="{disabled: liveRoomDetail.status === 9}" class="heatLive" @click="handleCommand(item.toolFn)">
                  <div class="heatLiveBox">
                    <img src="~@/assets/image/liveRoom/heatLive.png" alt="" class="heatLiveIcon" />
                    <span class="heatLiveText">加热直播间</span>
                  </div>
                </div>
              </el-tooltip>
            </template>
            <template v-else-if="item.type === 'image'">
              <el-tooltip :key="index" effect="dark" :content="item.label" placement="top">
                <el-upload ref="upload" class="upload-demo m-r-28" action="#" :limit="1" :show-file-list="false" :http-request="changeImage" accept=".jpg,.jpeg,.png,JPG,JPEG,PNG">
                  <svg-icon class-name="toolsIcon" icon-class="tupian" />
                </el-upload>
              </el-tooltip>
            </template>
            <template v-else-if="item.type === 'line'">
              <div v-if="chatUser.type === 2" :key="index" class="line" />
            </template>

            <template v-else-if="item.type === 'purchaseRecord'">
              <el-tooltip :key="index" effect="dark" :content="item.label" placement="top">
                <svg-icon class="m-r-28" class-name="toolsIcon" :icon-class="ifOrderNoRead ? 'livedingdanDoc' : 'livedingdan'" @click="onhandlePurchaseRecord" />
              </el-tooltip>
            </template>
          </template>
          <template v-else>
            <el-tooltip :key="index" effect="dark" :content="item.label" placement="top">
              <svg-icon class="m-r-28" class-name="toolsIcon" :icon-class="item.icon" @click="handleCommand(item.toolFn)" />
            </el-tooltip>
          </template>
        </template>
      </template>
      <div class="rightBtn">
        <el-tooltip v-if="chatUser.type === 2 && liveRoomDetail.liveModel === 'AI_LIVE' && [1, 2, 3].includes(liveRoomDetail.status)" effect="dark" content="设置" placement="top">
          <el-dropdown trigger="click" placement="top" @command="handleCommand">
            <span class="el-dropdown-link">
              <svg-icon v-if="chatUser.type === 2" class-name="toolsIcon" icon-class="jiaobenshezhi" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if=" scriptSetting.isRelateScript && scriptSetting.scriptInteractStatus === 1 && [1, 2, 3].includes(liveRoomDetail.status) && havBtnOld('web:liveRoom:pause')" command="onhandleStop">
                <svg-icon class-name="toolsIcon m-r-10" icon-class="zantinghudong" />暂停互动</el-dropdown-item>
              <el-dropdown-item v-if="liveRoomDetail.liveModel === 'AI_LIVE' && [1, 2, 3].includes(liveRoomDetail.status) && havBtnOld('web:liveRoom:classOver')" command="onhandleEnd">
                <svg-icon class-name="toolsIcon m-r-10" icon-class="jinjixiake" />紧急下课</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </div>
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
    <div class="footer">
      <el-button
        size="mini"
        type="primary"
        :loading="loading"
        class="footerSendBtn"
        @click="sendMsg"
      >发送</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VEditDiv from './VEditDiv.vue'
import Emoji from './Emoji/index'
import AtPop from './AtPop.vue'
import Dialog from '../Dialog/index'
import Drawer from '@/views/live/Drawer/index.js'
import {
  couponRevoke,
  couponSend,
  orderRemindNewRemind
} from '@/api/liveRoom/index.js'
import { mapGetters } from 'vuex'
import { getFileType } from '@/utils/index'
import { urgentEndClass, operateInteract } from '@/api/liveRoom/im'
import { getSendMessageCmd, sendMessage } from '@/api/liveRoom/setting.js'
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
      timer: null,
      ifOrderNoRead: false, // 订单记录是否已读
      atIndex: 0, // 每次@成员，atIndex递增
      toolBar: [
        { sort: 1, label: '表情', type: 'emoji', toolFn: '', show: (row) => { return ['AI_LIVE', 'PERSON_LIVE'].includes(this.liveRoomDetail.liveModel) } },
        { sort: 2, label: '图片', type: 'image', toolFn: '', show: (row) => { return ['AI_LIVE', 'PERSON_LIVE'].includes(this.liveRoomDetail.liveModel) } },
        { sort: 3, label: '清屏', toolFn: 'clearMessage', icon: 'qingping', show: (row) => { return ['AI_LIVE', 'PERSON_LIVE'].includes(this.liveRoomDetail.liveModel) } },
        { sort: 4, label: '学员无法观看视频', toolFn: 'onhandleStudentVideo', icon: 'studentWatchVideo', show: (row) => { return ['AI_LIVE'].includes(this.liveRoomDetail.liveModel) } },
        { sort: 8, label: '分割线', type: 'line', toolFn: '', show: (row) => { return ['AI_LIVE', 'PERSON_LIVE'].includes(this.liveRoomDetail.liveModel) } },
        { sort: 13, label: '签到', toolFn: 'onhandleOpenSign', icon: 'liveRoomSign', show: (row) => { return this.liveRoomDetail.status !== 9 } },
        { sort: 5, label: '抽奖', toolFn: 'onhandleOpenLottery', icon: 'lottery', show: (row) => { return ['AI_LIVE', 'PERSON_LIVE'].includes(this.liveRoomDetail.liveModel) } },
        { sort: 10, label: '优惠券', toolFn: 'onhandleSendCoupon', icon: 'youhuijuan', show: (row) => { return ['AI_LIVE', 'PERSON_LIVE'].includes(this.liveRoomDetail.liveModel) } },
        { sort: 11, label: '发送商品', toolFn: 'onhandleOpenGoods', icon: 'tuisongshangping', show: (row) => { return ['AI_LIVE', 'PERSON_LIVE'].includes(this.liveRoomDetail.liveModel) } },
        { sort: 9, label: '购买记录', type: 'purchaseRecord', toolFn: 'onhandlePurchaseRecord', show: (row) => { return ['AI_LIVE', 'PERSON_LIVE'].includes(this.liveRoomDetail.liveModel) } },
        { sort: 6, label: '连麦记录', toolFn: 'onhandleOpenLianmaiRecord', icon: 'newsLianmai', show: (row) => { return ['AI_LIVE', 'PERSON_LIVE'].includes(this.liveRoomDetail.liveModel) } },
        { sort: 7, label: '发送预约直播间', toolFn: 'onhandleOpenNextLive', icon: 'nextLive', show: (row) => { return this.chatUser.type === 2 && [1].includes(this.liveRoomDetail.status) } },
        { sort: 10, label: '加热直播间', type: 'hotlive', toolFn: 'onhandleHotlive', show: (row) => { return this.liveRoomDetail.heatButton } }
        // { sort: 12, label: '发送消息', toolFn: 'robotSend', icon: 'robotMsg', show: (row) => { return ['AI_LIVE', 'PERSON_LIVE'].includes(this.liveRoomDetail.liveModel) } }
        // { sort: 13, label: '检测', toolFn: 'onopenDeviceDetection', icon: 'robotMsg', show: {return(row) =>[return'PERSON_LIVE']} },
      ],
      showTimeLength: 1 // 停留时长
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      leftList: state => state.im.leftList,
      liveRoomDetail: state => state.im.liveRoomDetail,
      scriptSetting: state => state.im.scriptSetting,
      cmd: state => state.im.cmd
    }),
    ...mapGetters(['permission_routes'])
  },
  watch: {
    leftList: {
      handler(val) {
        const arr = this.leftList.onlineMyTrainees.concat(this.leftList.offMyTrainees).concat(this.leftList.onlineGeneralTrainees).concat(this.leftList.offGeneralTrainees)
        this.listData = arr
      },
      deep: true,
      immediate: true
    }
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
  },
  mounted() {
    this.getCmdText()
    this.timer = setInterval(() => {
      this.getorderRemindNewRemind()
    }, 5000)
  },
  methods: {
    // 获取
    getCmdText() {
      getSendMessageCmd().then(res => {
        console.log(res, '获取cmd指令')
        this.$store.commit('im/SET_cmd', res.data)
      })
    },
    onhandleHotlive() {
      if (this.liveRoomDetail.status === 9) {
        this.$delModal({
          tips: '当前直播已结束，无法加热直播间',
          sureBtnText: '我知道了',
          noCancelBtn: true,
          success: () => {}
        })
        return
      }
      Dialog.open({
        visible: true,
        liveRoomId: this.liveRoomDetail.liveRoomId,
        type: 'HotLive',
        liveStatus: this.liveRoomDetail.status,
        liveStartTime: this.liveRoomDetail.startTime,
        success: () => {
          Dialog.close()
        }
      })
    },
    // 判断是否有权限-紧急下课
    havBtnOld(key) {
      const obj = this.permission_routes.find(v => v.path === '/privateLive')
      if (obj && obj.children && obj.children.length > 0) {
        const o = obj.children.find(v => v.path === 'liveRoomV2')
        console.log(o, 'o-1')
        if (o & o.meta && o.meta.permsList && o.meta.permsList.length > 0) {
          return o.meta.permsList.includes(key)
        }
      }
      return false
    },
    onfocus() {
      this.$refs.comment && this.$refs.comment.onfocus()
    },
    onhandleTest() {
      let i = 0
      const a = setInterval(() => {
        i++
        i < 300 ? this.testSend(String(i)) : clearInterval(a)
      }, 200)
    },
    testSend(msg) {
      this.$emit('scrollBottom')
      this.$refs.comment.clear()
      this.loading = true
      this.msg = msg
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
    // 点击打开订单详情
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
      if (this.cmd.enable && this.cmd.cmd) {
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
          return sendMessage(data).then(res => {
            this.msg = ''
            this.$refs.comment.clear()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      }
      this.$emit('scrollBottom')
      this.$refs.comment.clear()
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
    // 发送图片消息
    sendPicMsg(result) {
      this.$refs.comment.clear()
      this.$store.dispatch('im/sendPic', result).then(res => {
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
    leaveLiveRoom() {
      this.$store
        .dispatch('im/leaveLiveRoom', this.$route.params.id)
        .then(() => {
          this.$router.go(-1)
        })
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
      // console.log('blurFunc', event)
    },
    // 选择成员时插入数据，并关闭弹窗
    onSelect(item) {
      this.atIndex++
      // 使用a标签表示@的成员
      const at = `<span name="at" value="${item.memberId}" tabindex="-1" id="${this.atIndex}" contenteditable="false" >@${item.memberName}</span>&#x200B;`
      this.$refs.comment.insertContent(at, this.atIndex)
      // console.log('onSelect', item)
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
      if (this.$refs.upload) {
        Object.prototype.toString.call(this.$refs.upload).slice(8, -1) === 'Array' ? this.$refs.upload[0].clearFiles() : this.$refs.upload.clearFiles()
      }
      this.handleImage(e.file, data => {
        this.sendPicMsg(data)
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
        success: (res) => {
          this.$notify.success({ title: '提示', message: '发送成功' })
          this.showTimeLength = res?.showTimeLength / 60
          // Dialog.close()
        }
      })
    },
    // 发送下一场预约直播间
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
    // 清屏
    clearMessage() {
      this.$store.commit('im/set_isCompleted', true)
      this.$store.commit('im/SET_messageData', [])
      this.$store.commit('im/set_ifScrollBottom', true)
      this.$store.commit('im/set_ifCanScrollBottom', true)
    },
    // 输入框点击
    onHandleClick() {
      this.$store.dispatch('im/ifSendMessageReadReceipt')
    },
    // 人数调整
    onhandlePeopleNumber() {
      console.log('点击人数调整按钮')
      Dialog.open({
        visible: true,
        type: 'EditPeopleNumber',
        success: () => {
          Dialog.close()
        }
      })
    },
    // 点击重启互动按钮
    onhandleRestart() {
      this.$delModal({
        tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">重启互动提示</div>
          <div class="m-t-16" style="font-size: 16px;color: #F53F3F;line-height: 24px;">将课堂中的重启互动。请老师谨慎操作！</div>
        `,
        success: () => {
          console.log('点击重启互动按钮')
          const data = {
            liveRoomId: this.$route.params.id,
            operateType: 5
          }
          operateInteract(data).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
          })
        }
      })
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
    // 启动互动
    onhandleStart() {
      this.$delModal({
        tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">启动互动提示</div>
          <div class="m-t-16" style="font-size: 16px;color: #F53F3F;line-height: 24px;">启动互动将课堂中的互动进行启动。请老师保持课堂跟进！</div>
        `,
        success: () => {
          console.log('点击启动互动按钮')
          const data = {
            liveRoomId: this.$route.params.id,
            operateType: 2
          }
          operateInteract(data).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
          })
        }
      })
    },
    // 延时互动
    onhandleDelayed() {
      Dialog.open({
        visible: true,
        // value: this.scriptSetting.delayTime,
        liveRoomId: this.$route.params.id,
        type: 'InteractiveDelay',
        success: () => {
          Dialog.close()
        }
      })
      console.log('点击延时互动按钮')
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
    },
    handleCommand(res) {
      // console.log(res)
      this[res]()
    },
    // 点击无法看视频按钮
    onhandleStudentVideo() {
      Dialog.open({
        visible: true,
        liveRoomId: this.$route.params.id,
        liveModel: this.liveRoomDetail.liveModel,
        type: 'StudentCanVideo',
        success: () => {}
      })
    },
    robotSend() {
      Dialog.open({
        visible: true,
        type: this.liveRoomDetail.liveModel === 'AI_LIVE' ? 'RobotSend' : 'RobotSendP',
        liveRoomId: this.$route.params.id,
        groupId: this.liveRoomDetail.groupId,
        success: () => {}
      })
    },
    // 点击打开连麦记录
    onhandleOpenLianmaiRecord() {
      Dialog.open({
        visible: true,
        type: 'LianmaiRecord',
        liveRoomId: this.$route.params.id,
        groupId: this.liveRoomDetail.groupId,
        success: () => {}
      })
    },
    // 点击打开抽奖
    onhandleOpenLottery() {
      Dialog.open({
        visible: true,
        type: 'Lottery',
        liveRoomId: this.$route.params.id,
        groupId: this.liveRoomDetail.groupId,
        success: row => {}
      })
    },
    // 点击打开签到弹框
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
    // 点击打开发送优惠券弹框
    onhandleSendCoupon() {
      Dialog.open({
        visible: true,
        type: 'SendCoupon',
        liveRoomId: this.$route.params.id,
        showRevoke: this.chatUser.type === 2,
        groupId: this.liveRoomDetail.groupId,
        success: (row) => {
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
    // 直播间发送优惠券
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
    // 点击直播页面设置
    onhandleToolSetting() {
      Drawer.open({
        visible: true,
        type: 'LiveRoomSetting'
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.InputBox {
  display: flex;
  flex-direction: column;
  height: 219px;
  background: #f5f5f5;
  .tools {
    color: #fff;
    width: 100%;
    height: 44px;
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    padding-left: 19px;
    padding-right: 24px;
    .rightBtn {
      flex: 1 0 0;
      display: flex;
      justify-content: flex-end;
      // align-items: center;
    }
    // 分割线
    .line {
      width: 1px;
      height: 23px;
      border: 1px solid #dde1e6;
      // margin-left: 28px;
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
.m-r-24 {
  margin-right: 24px;
}
::v-deep {
  .el-upload {
    display: flex;
  }
}
.heatLive {
  padding: 2px;
  border-radius: 14px;
  // border-width: 2px;
  // border-color: red;
  // border-style: solid;
  background: radial-gradient(circle, #FFDC80, #FF8282);
  cursor: pointer;
  .heatLiveBox {
    padding: 4px 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: #fff;
    .heatLiveIcon {
      width: 16px;
      height: 16px;
    }
    .heatLiveText {
      margin-left: 3px;
      color: #f53f3f;
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      line-height: 12px;
    }
  }
}
.disabled {
  cursor: not-allowed;
}
</style>
