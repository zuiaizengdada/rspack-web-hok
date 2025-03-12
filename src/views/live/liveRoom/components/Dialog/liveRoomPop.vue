<template>
  <transition name="slide">
    <div v-if="show" class="liveRoomPop-container" :style="{top: config.top}">
      <template>
        <el-image
          class="liveRoomPop-img"
          fit="contain"
          :src="config.imgUrl"
          lazy
        />
        <slot name="imgTip" />
      </template>
      <div class="liveRoomPop-contant">
        <div class="liveRoomPop-title" :class="config.titleTextHidden === 2 ? 'text_hidden':'text_hidden_1'">{{ config.title }}</div>
        <slot name="text" />
      </div>
      <svg-icon class-name="liveRoomPop-close" icon-class="live_roomPopClose" @click.stop="handleClose" />
    </div>
  </transition>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          top: '0px',
          visible: false,
          titleTextHidden: 2
        }
      }
    }
  },
  data() {
    return {
      timer: null,
      show: false
    }
  },
  watch: {
    config: {
      handler(val) {
        if (val.visible) {
          const { showEndTime } = this.config
          if (showEndTime) {
            const endTime = moment(showEndTime)
            // const sendTime = moment(finalSendTime)
            const diffTime = moment(endTime).diff(moment(), 'x')
            if (diffTime > 0) {
              this.show = true
              this.closeTimer(diffTime)
            } else {
              this.closeTimer()
            }
          }
        } else {
          this.closeTimer()
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
  },
  methods: {
    handleClose() {
      this.closeTimer()
    },
    // 关闭弹窗并销毁定时器
    closeTimer(diffTime = 0) {
      this.timer && clearTimeout(this.timer)
      if (diffTime === 0 || diffTime < 0) {
        return (this.show = false)
      } else {
        this.timer = setTimeout(() => {
          this.show = false
        }, diffTime)
      }
    }
  }
}
</script>
<style lang='scss' scoped>
  .liveRoomPop-container {
    background: #FFFFFF;
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.2);
    border-radius: 6px;
    display: flex;
    width: 272px;
    height: 92px;
    padding: 8px 16px 8px 8px;
    position: absolute;
    top: 0;
    right: 22px;
    .liveRoomPop-img {
      width: 76px;
      height: 76px;
      min-width: 76px;
      min-height: 76px;
      border-radius: 2px;
      background: #fafafa;
    }
    .liveRoomPop-contant {
      margin-left: 16px;
    }
    .liveRoomPop-title {
      font-size: 15px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 550;
      color: #333333;
    }
    .liveRoomPop-close {
      width: 38px;
      height: 38px;
      position: absolute;
      top: -12px;
      right: -12px;
      cursor: pointer;
    }
  }
  .slide-enter-active, .slide-leave-active {
    transition: opacity .4s;
  }
  .slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
