<template>
  <div class="registerMobile-page">
    <div class="liveRoomStartScale">
      <div class="page_wrap overflowOuto">
        <!-- 封面图 -->
        <div class="registerMobile-poster">
          <img :src="coverImgUrl" alt="" />
        </div>
        <!-- 提示层 -->
        <div
          v-if="!(liveInfo.status === 0 && timeShow.times < 0)"
          class="registerMobile-tips"
        >
          <template v-if="liveInfo.status === 0">
            <div class="liveRoomStartCountdown">
              <span class="registerMobile-tips-text">开播倒计时</span>
              <span class="registerMobile-tips-value">{{ timeShow.day }}</span>
              <span class="registerMobile-tips-unit">天</span>
              <span class="registerMobile-tips-value">{{ timeShow.h }}</span>
              <span class="registerMobile-tips-unit">时</span>
              <span class="registerMobile-tips-value">{{ timeShow.m }}</span>
              <span class="registerMobile-tips-unit">分</span>
              <span class="registerMobile-tips-value">{{ timeShow.s }}</span>
              <span class="registerMobile-tips-unit">秒</span>
            </div>
          </template>
          <template v-else-if="[1, 2, 3].includes(liveInfo.status)">
            <div
              class="registerMobile-tips-liveing"
              :class="`liveRoomLiveState${liveInfo.status}`"
            >
              <svg-icon
                class-name="liveTypeicon"
                :icon-class="
                  {
                    0: 'livenostart',
                    1: 'liveIng',
                    2: 'liveSuspend',
                    3: 'liveError',
                    9: 'audit_info'
                  }[liveInfo.status]
                "
              />
              <span style="margin-left: 12px">{{
                liveInfo.status | getOptionsValue(liveStateOption)
              }}</span>
            </div>
          </template>
          <template v-else-if="[9].includes(liveInfo.status)">
            <div class="registerMobile-tips-liveEnd">
              本场直播已结束 请联系班主任学习下一场
            </div>
          </template>
        </div>
        <!-- 标题栏 -->
        <div class="registerMobile-title">
          <div class="registerMobile-name">{{ liveInfo.name }}</div>
          <div class="registerMobile-startTime">
            <template v-if="liveInfo.status !== 9">
              开播时间
              <span class="m-l-10">{{
                liveInfo.startTime
                  ? moment(liveInfo.startTime).format('YYYY-MM-DD HH:mm')
                  : ''
              }}</span>
            </template>
            <template v-else>
              <svg-icon class-name="size-icon" icon-class="time_grey" />
              <span style="margin-left: 5px">{{
                liveInfo.endTime
                  ? moment(liveInfo.endTime).format('YYYY-MM-DD HH:mm')
                  : ''
              }}</span>
              <span style="margin-left: 10px">结束</span>
            </template>
          </div>
        </div>
        <!-- 详情栏 -->
        <div class="registerMobile-main">
          <template v-if="imgList.length === 0">
            <img
              src="~@/assets/image/live/registerSettingsNodata.png"
              alt=""
              style="width: 245px; margin: auto"
            />
          </template>
          <template v-else>
            <img
              v-for="(item, index) in curImgList"
              :key="index"
              width="100%"
              :src="item"
            />
          </template>
        </div>
      </div>
      <!-- 底部定位栏 -->
      <div v-if="liveInfo.status !== 9" class="registerMobile-footer">
        <div class="footer-btn">
          {{
            liveInfo.status === 0
              ? buttomTitleObj.notApplyViewText
              : buttomTitleObj.applyViewText
          }}
        </div>
      </div>
    </div>
    <!-- <div class="registerMobile-main">
      <img v-for="(item,index) in curImgList" :key="index" width="100%" :src="item">
    </div>
    <div class="registerMobile-login">
      <div class="registerMobile-loginInfo">
        <div class="registerMobile-loginInfo-title text_hidden_1">{{ liveInfo.name }}</div>
        <div class="registerMobile-loginInfo-time">开播时间：{{ moment(liveInfo.startTime).format('YYYY-MM-DD HH:mm') }}</div>
      </div>
      <img src="@/assets/image/live/registerMobile_login.png" width="100%" height="160">
    </div> -->
  </div>
</template>

<script>
import moment from 'moment'
import { liveStateOption } from '../../../../columns.js'
import { getOptionsValueByKey } from '@/filters/index'
export default {
  props: {
    imgList: {
      type: Array,
      default: () => {
        return []
      }
    },
    liveInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    coverImgUrl: {
      type: String,
      default: ''
    },
    buttomTitleObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      liveStateOption,
      timeShow: {
        times: -1,
        h: '',
        m: '',
        s: ''
      },
      timer: null
    }
  },
  computed: {
    curImgList() {
      // 设置默认图
      if (this.imgList.length === 0) {
        return ['https://oss.hokkj.cn/live/registerPcBackground.png']
      }
      return this.imgList
    }
  },
  watch: {
    'liveInfo.startTime'(val) {
      if (val) {
        // console.log(val, 'liveInfo.startTime')
        this.timer && clearInterval(this.timer)
        this.liveInfo.status === 0 &&
          (this.timer = setInterval(() => {
            // console.log(this.timeShow, 'timeShow')
            this.timeShow = this.countDown()
          }, 1000))
      }
    }
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
  },
  mounted() {
    this.timer && clearInterval(this.timer)
    this.liveInfo.status === 0 &&
      (this.timer = setInterval(() => {
        console.log(this.timeShow, 'timeShow')
        this.timeShow = this.countDown()
      }, 1000))
  },
  methods: {
    getOptionsValueByKey,
    moment,
    countDown() {
      const time = new Date(this.liveInfo.startTime).getTime()
      var nowTime = +new Date() // 返回的是当前时间总的毫秒数
      var times = Number(((time - nowTime) / 1000).toFixed(0)) // times是剩余时间总的秒数
      const result = parseInt(Math.abs(times))
      const day =
        Math.floor(result / (24 * 60 * 60)) < 10
          ? '0' + Math.floor(result / (24 * 60 * 60))
          : Math.floor(result / (24 * 60 * 60))
      const h =
        Math.floor((result % (24 * 60 * 60)) / (60 * 60)) < 10
          ? '0' + Math.floor((result % (24 * 60 * 60)) / (60 * 60))
          : Math.floor((result % (24 * 60 * 60)) / (60 * 60))
      const m =
        Math.floor((result % (60 * 60)) / 60) < 10
          ? '0' + Math.floor((result % (60 * 60)) / 60)
          : Math.floor((result % (60 * 60)) / 60)
      const s = result % 60 < 10 ? '0' + (result % 60) : result % 60
      return {
        times,
        day,
        h,
        m,
        s
      }
      // return d + '天' + h + '时' + m + '分' + s + '秒' // 返回函数计算出的值
    }
  }
}
</script>

<style lang="scss" scoped>
.registerMobile-page {
  width: 243px;
  height: 476px;
  background: #fff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  border-radius: 24px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.liveRoomStartScale {
  background: #f4f5f7;
  position: absolute;
  width: 375px;
  height: calc(456px * (1 / 0.59));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transform: scale(0.59); // translateX(-46.5px)
  transform-origin: left top;
  border-radius: 24px 24px 0 0;
}
.page_wrap {
  flex: 1 0 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background: #fff;
  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }
}
.registerMobile-poster {
  width: 100%;
  height: 212px;
  > img {
    width: 100%;
    height: 100%;
  }
}
.registerMobile-tips {
  background: #fff;
  height: 46px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .liveRoomStartCountdown {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    padding-left: 16px;
    .registerMobile-tips-text {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 17px;
      margin-right: 12px;
    }
    .registerMobile-tips-value {
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ff7d00;
      line-height: 33px;
    }
    .registerMobile-tips-unit {
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 21px;
      margin-left: 4px;
      margin-right: 4px;
    }
  }
  .registerMobile-tips-liveing {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 22px;
    padding-left: 16px;
    .liveTypeicon {
      width: 24px;
      height: 24px;
    }
  }
  .registerMobile-tips-liveEnd {
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #f53f3f;
    font-weight: bolder;
    line-height: 25px;
    padding-left: 12px;
  }
}

.registerMobile-title {
  background: #fff;
  height: 91px;
  height: 107px;
  padding: 24px 16px;
  border-bottom: 16px solid #f4f5f7;
  // margin-bottom: 16px;
  .registerMobile-name {
    font-size: 17px;
    color: #333;
  }
  .registerMobile-startTime {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
    margin-top: 14px;
    display: flex;
    align-items: center;
  }
}
.registerMobile-main {
  // flex: 1 0 0;
  // overflow: auto;
  background: #fff;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
}
.registerMobile-footer {
  height: 56px;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.09);
  padding: 8px 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  .footer-btn {
    background: #f53f3f;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    color: #fff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.liveRoomLiveState0 {
  color: #717f99;
}
.liveRoomLiveState1 {
  color: #1778ff;
}
.liveRoomLiveState2 {
  color: #ff7d00;
}
.liveRoomLiveState3 {
  color: #f53f3f;
}
.liveRoomLiveState9 {
  color: #999999;
}
.time_grey {
  width: 12px;
  height: 12px;
}
</style>
