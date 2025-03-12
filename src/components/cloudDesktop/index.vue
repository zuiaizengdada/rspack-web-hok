<template>
  <div v-if="status !== 3" class="cloudDesktop">
    <div v-if="status === 1" class="cloudDesktopGroup m-r-32">
      <el-popover
        placement="bottom"
        width="420"
        trigger="click"
      >
        <template>
          <div class="delisting-title">通知</div>
          <div class="delisting-tips">
            <span class="delisting-tips-text">2025年1月16日</span>下架云桌面。大家请提前把云桌面的相关数据下载至个人本地电脑，云桌面保留数据至
            <span class="delisting-tips-text">2025年1月16日</span>。
          </div>
        </template>
        <button
          slot="reference"
          class="cloudDesktopBtn button--default"
          :class="{
            'is-disabled': openCloudDesktopLoading
          }"
          @click="openCloudDesktop"
        >
          <i v-if="openCloudDesktopLoading" class="el-icon-loading" />
          <span>唤起云桌面</span>
        </button>
      </el-popover>
    </div>

    <div class="cloudDesktopGroup">
      <el-popover placement="bottom" width="420" trigger="click">
        <template>
          <div class="delisting-title">通知</div>
          <div class="delisting-tips">
            <span class="delisting-tips-text">2025年1月16日</span>下架云桌面。大家请提前把云桌面的相关数据下载至个人本地电脑，云桌面保留数据至
            <span class="delisting-tips-text">2025年1月16日</span>。
          </div>
        </template>
        <button
          slot="reference"
          class="cloudDesktopBtn first-child"
          :class="{
            'button--danger': status === 1 || status === 5,
            'button--primary': status === 2 || status === 4,
            'is-disabled': status === 4 || status === 5
          }"
          @click="onClickDeskTopFn"
        >
          <i v-if="status === 4 || status === 5" class="el-icon-loading" />
          <span>{{ deskBtnStatus[status] }}</span>
        </button>
      </el-popover>

      <el-popover
        ref="popover"
        v-model="showDeskTopDialog"
        placement="bottom-end"
        width="478"
        popper-class="popover-container"
        trigger="manual"
      >
        <div slot="reference" class="cloudDesktopBtnBox">
          <button
            class="cloudDesktopBtn last-child"
            :class="
              status === 1 || status === 5
                ? 'button--danger'
                : 'button--primary'
            "
            @click="dialogClick"
          >
            <i class="el-dropdown__icon el-icon-arrow-down" />
          </button>
        </div>

        <div class="deskTopDialog">
          <el-row>
            <el-col :span="12">
              <span class="deskTopDialogLabel">IP：</span>
              <AppIconClipboard :src="form.eip">
                <span class="deskTopDialogValue">{{ form.eip }}</span>
              </AppIconClipboard>
            </el-col>
            <el-col :span="12">
              <div v-if="status === 1" class="deskTopDialogStatus c_0C6FFF">
                <svg-icon icon-class="yikaiji" class-name="yikaiji-icon" />
                <span class="deskTopDialogStatusText">
                  {{ deskTopStauts[status] }}：
                  {{ form.useTime | filterTime }}
                </span>
              </div>
              <div v-else-if="status === 2" class="deskTopDialogStatus c_333">
                <svg-icon icon-class="yikaiji" class="yikaiji-icon c_333" />
                <span class="deskTopDialogStatusText">{{
                  deskTopStauts[status]
                }}</span>
              </div>
              <div v-else-if="status === 3" class="deskTopDialogStatus">
                <span class="deskTopDialogStatusText">{{
                  deskTopStauts[status]
                }}</span>
              </div>
              <div
                v-else-if="status === 4"
                class="deskTopDialogStatus c_0C6FFF"
              >
                <i class="el-icon-loading" />
                <span class="deskTopDialogStatusText">{{
                  deskTopStauts[status]
                }}</span>
              </div>
              <div v-else-if="status === 5" class="deskTopDialogStatus">
                <i class="el-icon-loading" />
                <span class="deskTopDialogStatusText">{{
                  deskTopStauts[status]
                }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="m-t-18">
            <el-col :span="12">
              <span class="deskTopDialogLabel">账号：</span>
              <AppIconClipboard :src="form.ecsUserName">
                <span class="deskTopDialogValue">{{ form.ecsUserName }}</span>
              </AppIconClipboard>
            </el-col>
            <el-col :span="12">
              <span class="deskTopDialogLabel">密码：</span>
              <watchPhoneNumber
                :reg-type="1"
                class="deskTopDialogValue"
                :default-value="form.ecsPassword"
              />
            </el-col>
          </el-row>
          <el-row class="m-t-29" type="flex" justify="end">
            <el-button
              size="small"
              @click="openDetails"
            >云桌面使用明细</el-button>
            <!-- <el-button size="small" @click="gotoDetail">使用明细</el-button> -->
            <el-button
              v-if="OSnow() === 'mac'"
              size="small"
              :loading="downLoading"
              @click="openDoc"
            >Mac操作说明</el-button>
            <el-button
              v-else
              size="small"
              :loading="downLoading"
              @click="downUrl"
            >下载配置文件</el-button>
            <img
              v-if="showCloudDeskTips"
              :src="cloudDesk"
              alt=""
              class="mycloudDeskTips"
            />
          </el-row>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { deskTopStauts, deskBtnStatus } from './columns.js'
import protocolCheck from './protocolcheck'
import AppIconClipboard from '@/components/AppIconClipboard'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import cloudDesk from '@/assets/image/cloudDesk.gif'
import {
  userCloudPc,
  userCloudOperation
} from '@/api/videoManagement/cloudDesktop'
import { OSnow } from '@/utils/index'
export default {
  components: {
    AppIconClipboard,
    watchPhoneNumber
  },
  filters: {
    filterTime(value) {
      if (!value || typeof value !== 'number') {
        return '0秒'
      } else {
        const result = parseInt(value)
        const h =
          Math.floor(result / 3600) < 10
            ? '0' + Math.floor(result / 3600)
            : Math.floor(result / 3600)
        const m =
          Math.floor((result / 60) % 60) < 10
            ? '0' + Math.floor((result / 60) % 60)
            : Math.floor((result / 60) % 60)
        const s =
          Math.floor(result % 60) < 10
            ? '0' + Math.floor(result % 60)
            : Math.floor(result % 60)
        return h + '时' + m + '分' + s + '秒'
      }
    }
  },
  data() {
    return {
      openCloudDesktopLoading: false,
      OSnow,
      downLoading: false,
      loading: false,
      deskBtnStatus,
      deskTopStauts,
      cloudDesk,
      showDeskTopDialog: false,
      showCloudDeskTips: false,
      form: {
        batUrl: '', // 配置文件下载地址
        ecsPassword: '', // 云桌面密码
        ecsStatus: '', // 云桌面状态
        ecsUserName: '', // 云桌面账号
        eip: '', // 云桌面ip
        useTime: 0,
        userEcsId: ''
      },
      // 1-已开机 2-已关机 3-已释放
      status: 3,
      timer: null, // 在线时长计时器
      show: false,
      timer2: null // 循环查询用户云桌面信息定时器
    }
  },
  created() {
    this.getUserInfo()
  },
  mounted() {
    // window.addEventListener('click', function (e) {
    //   console.log(e)
    // })
  },
  methods: {
    closePopover() {
      this.$refs.popover.doClose()
    },
    // 点击开启/关闭云桌面
    async onClickDeskTopFn() {
      if (this.status === 4 || this.status === 5) {
        return
      }

      let ecsStatus = ''
      if (this.form.ecsStatus === 1) {
        // 关闭云桌面操作
        this.closeDeskTop()
      } else if (this.form.ecsStatus === 2) {
        const res = await this.$store.dispatch(
          'user/viewingFlag',
          'openCloudPC'
        )
        if (!res) {
          // 开启云桌面操作
          this.status = 4
          ecsStatus = 1
          this.startDeskTop(ecsStatus)
        }
      } else {
        this.status = ''
      }
    },
    // 开启云桌面
    startDeskTop(ecsStatus) {
      this.$uweb && this.$uweb.setAction('Event_cloudDesktop_open')
      const params = {
        ecsStatus: ecsStatus
      }
      userCloudOperation(params)
        .then(res => {
          this.timer2 = setInterval(() => {
            this.getUserInfo(true)
          }, 1000)
        })
        .catch(() => {
          this.status = this.form.ecsStatus
          this.getUserInfo()
        })
    },
    openDetails() {
      this.$emit('openDetails', this.form)
    },
    // 关闭云桌面
    closeDeskTop() {
      this.$uweb && this.$uweb.setAction('Event_cloudDesktop_close')
      this.$delModal({
        width: '505px',
        tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">关闭云桌面提醒</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">关闭云桌面后，将无法继续操作当前云桌面；如果当前有正在操作的内容，将会中断执行。确认是否执行关机操作？</div>
        `,
        success: () => {
          this.status = 5
          const params = {
            ecsStatus: 2
          }
          userCloudOperation(params)
            .then(res => {
              this.timer2 = setInterval(() => {
                this.getUserInfo(true)
              }, 1000)
            })
            .catch(() => {
              this.status = this.form.ecsStatus
              this.getUserInfo()
            })
        },
        fail: () => {}
      })
    },
    checkProtocol(error, success, notSupport) {
      protocolCheck('myprotocol://', error, success, notSupport)
    },
    // 获取用户云桌面信息
    getUserInfo(flag) {
      this.loading = true
      userCloudPc()
        .then(res => {
          this.form = {
            batUrl: res.data.batUrl || '', // 配置文件下载地址
            ecsPassword: res.data.ecsPassword || '',
            ecsStatus: res.data.ecsStatus || 3,
            ecsUserName: res.data.ecsUserName || '',
            eip: res.data.eip || '',
            useTime: res.data.useTime || 0,
            userEcsId: res.data.userEcsId || ''
          }
          this.timer && clearInterval(this.timer)
          this.timer = null
          if (this.form.ecsStatus === 1) {
            this.timer = setInterval(() => {
              this.form.useTime += 1
            }, 1000)
          }

          if (flag) {
            if (
              (this.status === 4 && this.form.ecsStatus === 1 && this.timer2) ||
              (this.status === 5 && this.form.ecsStatus === 2 && this.timer2)
            ) {
              clearInterval(this.timer2)
              this.timer2 = null
              if (this.form.ecsStatus === 1) {
                if (OSnow() === 'mac') {
                  this.$delModal({
                    width: '505px',
                    tips: `
                    <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">注意</div>
                    <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">监测到你的电脑是Mac系统，请点击按钮【Mac操作说明】查看如何唤起云桌面。</div>
                  `,
                    sureBtnText: 'Mac操作说明',
                    iconClassName: 'c_FF7D00',
                    sureBtnBgColor: '#0C6FFF',
                    success: () => {
                      this.openDoc()
                      setTimeout(() => {
                        this.$refs.popover.doShow()
                      }, 100)
                    }
                  })
                } else {
                  this.checkProtocol(
                    () => {
                      this.showCloudDeskTips = true
                      this.$notify.warning({
                        title: '提示',
                        message: '请先下载并运行配置文件'
                      })
                      setTimeout(() => {
                        this.showDeskTopDialog = true
                      }, 1000)
                    },
                    () => {
                      this.callapp_PC({
                        url: 'myprotocol://'
                      })
                    },
                    () => {
                      this.$notify.warning({
                        title: '提示',
                        message:
                          '当前浏览器不支持打开云桌面，请尝试其他浏览器打开'
                      })
                    }
                  )
                }
              }
              this.status = this.form.ecsStatus || 3
            }
          } else {
            this.status = this.form.ecsStatus || 3
          }
          this.loading = false
        })
        .catch(() => {
          this.status = this.form.ecsStatus || 3
          if (this.timer2) {
            clearInterval(this.timer2)
            this.timer2 = null
          }
          this.loading = false
        })
    },
    // 点击使用明细按钮
    gotoDetail() {
      if (
        this.$route.name === 'cloudDesktopDetail' &&
        this.$route.params.id === this.form.userEcsId
      ) {
        return
      }
      if (this.form.userEcsId) {
        this.$router.push({
          path: `/system/cloudDesktop/detail/${this.form.userEcsId}`
        })
      }
    },
    downUrl() {
      this.$uweb && this.$uweb.setAction('Event_cloudDesktop_down')
      if (this.form.batUrl && !this.downLoading) {
        this.downLoading = true
        var newWin = window.open('loading page', '_self')
        newWin.location.href = this.form.batUrl + `?t=${new Date().getTime()}` // 成功 重定向到目标页面
        this.downLoading = false
        this.showCloudDeskTips = false
      }
    },
    openDoc() {
      this.$uweb && this.$uweb.setAction('Event_cloudDesktop_down')
      var newWin = window.open('loading page', '_blank')
      newWin.location.href =
        'https://pv9bg3blkb.feishu.cn/wiki/wikcnkJUX7HvMldc60dDRtHCVxg'
    },
    callapp_PC({ url }) {
      // var t = setTimeout(callback, 1000)
      // var inp = document.createElement('input')
      // inp.style.position = 'absolute'
      // inp.style.clip = 'rect(0, 0, 0, 0)'
      // // 出现下载框的时候往下跳的问题
      // inp.style.top = '0'
      // inp.style.left = '0'
      // function blur() {
      //   window.clearTimeout(t)
      // }
      // inp.addEventListener('blur', blur) // 监听blur事件
      // document.body.appendChild(inp)
      // inp.focus() // 获取焦点
      // setTimeout(function () {
      //   // 删除无用的标签
      //   inp.removeEventListener('blur', blur)
      //   document.body.removeChild(inp)
      // }, 1000)
      // 有客户端 如果有本地exe应用，就会弹框，input失去焦点，然后执行blur()事件 清空t定时器 - 删除无用的标签定时器
      // 无客户端 不会弹框，input也不会失去焦点 触发t定时器- 执行callback - 删除无用的标签定时器
      // location.href = url
      var newWin = window.open('loading page', '_self')
      newWin.location.href = url
      this.openCloudDesktopLoading = false
    },
    // 点击唤起云桌面
    async openCloudDesktop() {
      this.$uweb && this.$uweb.setAction('Event_cloudDesktop_arouse')
      if (OSnow() === 'mac') {
        this.$delModal({
          width: '505px',
          tips: `
            <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">注意</div>
            <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">监测到你的电脑是Mac系统，请点击按钮【Mac操作说明】查看如何唤起云桌面。</div>
          `,
          sureBtnText: 'Mac操作说明',
          iconClassName: 'c_FF7D00',
          sureBtnBgColor: '#0C6FFF',
          success: () => {
            this.openDoc()
            setTimeout(() => {
              this.$refs.popover.doShow()
            }, 100)
            // this.show = true
          }
        })
      } else {
        if (this.openCloudDesktopLoading) {
          return
        }
        this.openCloudDesktopLoading = true
        this.checkProtocol(
          () => {
            this.openCloudDesktopLoading = false
            this.showCloudDeskTips = true
            setTimeout(() => {
              this.showDeskTopDialog = true
            }, 1000)
            this.$notify.warning({
              title: '提示',
              message: '请先下载并运行配置文件'
            })
          },
          () => {
            this.callapp_PC({
              url: 'myprotocol://'
            })
          },
          () => {
            this.openCloudDesktopLoading = false
            this.$notify.warning({
              title: '提示',
              message: '当前浏览器不支持打开云桌面，请尝试其他浏览器打开'
            })
          }
        )
      }
    },
    // 右侧按钮点击
    dialogClick() {
      this.centerDialogVisible = true
      this.showDeskTopDialog = !this.showDeskTopDialog
      this.showCloudDeskTips = false
      this.$uweb && this.$uweb.setAction('Event_cloudDesktop_detail')
    }
  }
}
</script>

<style lang="scss" scoped>
.mycloudDeskTips {
  width: 100px;
  height: 100px;
  position: absolute;
  top: -80px;
  right: -12px;
}
.cloudDesktop {
  padding: 0 16px;
  height: 100%;
  // vertical-align: text-bottom;
  vertical-align: top;
  display: inline-block;
  position: relative;
  color: #606266;
  font-size: 14px;
  .cloudDesktopGroup {
    float: left;
    &::before {
      display: table;
      content: '';
    }
    .cloudDesktopBtn {
      position: relative;
      float: none;
      display: inline-block;
      line-height: 22px;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      transition: 0.1s;
      font-weight: 500;
      padding: 5px 20px;
      border-radius: 4px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #ffffff;
    }
    .first-child {
      width: 110px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .last-child {
      width: 28px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding-left: 5px;
      padding-right: 5px;
      position: relative;
      border-left: none;
    }
    .button--primary {
      color: #fff;
      background-color: #0c6fff;
      border-color: #0c6fff;
      // &:first-child {
      //   border-right-color: #0C6FFF;
      // }
      // &:last-child {
      //   border-left-color: #0C6FFF;
      // }
      // &:hover {
      //   background: #66b1ff;
      //   border-color: #66b1ff;
      //   color: #fff;
      // }
      // &:active {
      //   background: #3a8ee6;
      //   border-color: #3a8ee6;
      //   color: #fff;
      // }
    }
    .button--primary.first-child {
      border-right-color: #fff !important;
      &:hover {
        background: #66b1ff;
        border-color: #66b1ff;
        color: #fff;
        border-right-color: #fff;
      }
      &:active {
        background: #3a8ee6;
        border-color: #3a8ee6;
        color: #fff;
      }
    }
    .button--primary.last-child {
      border-right-color: #0c6fff;
      border-left-color: #0c6fff;
      &:hover {
        background: #66b1ff;
        border-color: #66b1ff;
        color: #fff;
      }
      &:active {
        background: #3a8ee6;
        border-color: #3a8ee6;
        color: #fff;
        border-right-color: #3a8ee6;
      }
    }
    .button--primary.is-disabled {
      color: #fff;
      background-color: #9dc5ff;
      border-color: #9dc5ff;
      &:hover {
        cursor: not-allowed;
        background-image: none;
      }
    }

    .button--danger {
      color: #fff;
      background-color: #f53f3f;
      border-color: #f53f3f;
    }
    .button--danger.is-disabled {
      color: #fff;
      background-color: #fab6b6;
      border-color: #fab6b6;
      &:hover {
        cursor: not-allowed;
        background-image: none;
      }
    }
    .button--danger.first-child {
      border-right-color: #fff !important;
      &:hover {
        background: #f78989;
        border-color: #f78989;
        color: #fff;
        border-right-color: #fff;
      }
      &:active {
        background: #dd6161;
        border-color: #dd6161;
        color: #fff;
        border-right-color: #fff;
      }
    }
    .button--danger.last-child {
      border-right-color: #f53f3f;
      border-left-color: #f53f3f;
      &:hover {
        background: #f78989;
        border-color: #f78989;
        color: #fff;
      }
      &:active {
        background: #dd6161;
        border-color: #dd6161;
        color: #fff;
        border-right-color: #dd6161;
      }
    }

    .button--default {
      background: #ffffff;
      border-radius: 4px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      line-height: 22px;
      border: 1px solid #0c6fff;
      &:hover {
        color: #409eff;
        background-color: #ecf5ff;
      }
    }
    .button--default.is-disabled {
      &:hover {
        cursor: not-allowed;
        background-image: none;
      }
    }
  }
}
.deskTopDialog {
  padding: 8px;
  .deskTopDialogLabel {
    display: inline-block;
    width: 48px;
    text-align: right;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 24px;
    margin-right: 8px;
  }
  .deskTopDialogValue {
    display: inline-block;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
  }
  .deskTopDialogStatus {
    display: flex;
    height: 24px;
    align-items: center;
    justify-content: flex-end;
    .deskTopDialogStatusText {
      line-height: 24px;
    }
    .yikaiji-icon {
      width: 20px;
      height: 20px;
    }
  }
}
.m-t-29 {
  margin-top: 29px;
}
.m-t-18 {
  margin-top: 18px;
}
.c_0C6FFF {
  color: #0c6fff;
}
.c_333 {
  color: #333;
}
.m-r-32 {
  margin-right: 32px;
}
.cloudDesktopBtnBox {
  height: 100%;
  display: inline-block;
}

.delisting {
  border: 1px solid #f2f2f2;
  background: #fff;
  box-shadow: 0 4px 8px 0 #0000000d;
}
.delisting-tips {
  font-size: 16px;
  color: #333333;
  font-weight: 400;
  line-height: 28px;
}
.delisting-tips-text {
  color: #f1330d;
  font-weight: 600;
}
.delisting-title {
  // color: #f1330d;
  font-weight: 600;
  font-size: 20px;
  height: 50px;
  width: 100%;
  text-align: center;
  line-height: 45px;
}
</style>
