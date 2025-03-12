<template>
  <div class="data-info-container flex justify-between">
    <div v-for="(item,index) in dataInfoList" :key="index" class="data-info-content" :style="index===2?'flex:1':'flex:2;margin-right:20px'">
      <tips :tips="item.tips" :title="item.title" />
      <div
        v-if="index === 0"
        :class="{
          'info-item': true,
          'flex': true,
          [`info-item${index+1}`]: true,
          'item-active': activeIndex === index
        }"
        @click="handleClickItem(item, index)"
      >
        <svg-icon v-if="activeIndex === index" icon-class="materialBoard_select" class="materialBoard_select" />
        <div class="flex flex-column flex-1">
          <span class="flex flex-column" style="margin-bottom: 12px;">
            <span class="item-title">视频组数</span>
            <span class="item-strong item-nums">{{ videoGroupBoard.videoGroupCount }}</span>
          </span>
          <span class="flex flex-column">
            <span class="item-title">有效素材视频时长</span>
            <span class="item-nums">
              <!-- <span class="item-strong">{{ formatSeconds(videoGroupBoard.duration) }}</span> -->
              <span><span class="item-strong">{{ formatSeconds(videoGroupBoard.duration)[0] }}</span>小时</span><span><span class="item-strong">{{ formatSeconds(videoGroupBoard.duration)[1] }}</span>分</span><span><span class="item-strong">{{ formatSeconds(videoGroupBoard.duration)[2] }}</span>秒</span>
            </span>
          </span>
        </div>
        <div class="flex flex-column flex-1 separate">
          <span class="flex flex-column" style="margin-bottom: 12px;">
            <span class="item-title">有效：无效素材视频个数</span>
            <span class="item-strong item-nums">{{ videoGroupBoard.invalidVideoCount }}:{{ videoGroupBoard.effInvalidVideoCount }}</span>
          </span>
          <span class="flex flex-column">
            <span class="item-title">无效素材视频时长</span>
            <span class="item-nums">
              <!-- <span class="item-strong">{{ formatSeconds(videoGroupBoard.effDuration) }}</span> -->
              <span><span class="item-strong">{{ formatSeconds(videoGroupBoard.effDuration)[0] }}</span>小时</span><span><span class="item-strong">{{ formatSeconds(videoGroupBoard.effDuration)[1] }}</span>分</span><span><span class="item-strong">{{ formatSeconds(videoGroupBoard.effDuration)[2] }}</span>秒</span>
              <!-- <span class="item-strong">{{ videoGroupBoard.effDuration }}</span>小时<span class="item-strong">20</span>分<span class="item-strong">40</span>秒 -->
            </span>
          </span>
        </div>
      </div>
      <div
        v-if="index === 1"
        :class="{
          'info-item': true,
          'flex': true,
          [`info-item${index+1}`]: true,
          'item-active': activeIndex === index
        }"
        @click="handleClickItem(item, index)"
      >
        <svg-icon v-if="activeIndex === index" icon-class="materialBoard_select" class="materialBoard_select" />
        <div class="flex flex-column flex-1">
          <span class="flex flex-column" style="margin-bottom: 12px;">
            <span class="item-title">已手动脱敏数</span>
            <span class="item-strong item-nums">{{ videoGroupBoard.autoDesensitizedCount }}</span>
          </span>
          <span class="flex flex-column">
            <span class="item-title">未手动脱敏数</span>
            <span class="item-nums">
              <span class="item-strong item-nums">{{ videoGroupBoard.manualDesensitizedCount }}</span>
            </span>
          </span>
        </div>
        <div class="flex flex-column flex-1 separate">
          <span class="flex flex-column" style="margin-bottom: 12px;">
            <span class="item-title">已手动脱敏总时长</span>
            <span class="item-nums">
              <span><span class="item-strong">{{ formatSeconds(videoGroupBoard.autoDesensitizedDuration)[0] }}</span>小时</span><span><span class="item-strong">{{ formatSeconds(videoGroupBoard.autoDesensitizedDuration)[1] }}</span>分</span><span><span class="item-strong">{{ formatSeconds(videoGroupBoard.autoDesensitizedDuration)[2] }}</span>秒</span>
              <!-- <span class="item-strong">{{ videoGroupBoard.autoDesensitizedDuration }}</span>小时 -->
            </span>
          </span>
          <span class="flex flex-column">
            <span class="item-title">未手动脱敏视频时长</span>
            <span class="item-nums">
              <span><span class="item-strong">{{ formatSeconds(videoGroupBoard.manualDesensitizedDuration)[0] }}</span>小时</span><span><span class="item-strong">{{ formatSeconds(videoGroupBoard.manualDesensitizedDuration)[1] }}</span>分</span><span><span class="item-strong">{{ formatSeconds(videoGroupBoard.manualDesensitizedDuration)[2] }}</span>秒</span>
              <!-- <span class="item-strong">{{ videoGroupBoard.manualDesensitizedDuration }}</span>小时<span class="item-strong">20</span>分<span class="item-strong">40</span>秒 -->
            </span>
          </span>
        </div>
      </div>
      <div
        v-if="index === 2"
        :class="{
          'info-item': true,
          [`info-item${index+1}`]: true,
          'item-active': activeIndex === index
        }"
        @click="handleClickItem(item, index)"
      >
        <svg-icon v-if="activeIndex === index" icon-class="materialBoard_select" class="materialBoard_select" />
        <div class="flex flex-column flex-1">
          <span class="flex flex-column" style="margin-bottom: 12px;">
            <span class="item-title">共享视频数</span>
            <span class="item-strong item-nums">{{ videoGroupBoard.shareCount }}</span>
          </span>
          <span class="flex flex-column">
            <span class="item-title">共享视频视频时长</span>
            <span class="item-nums">
              <span><span class="item-strong">{{ formatSeconds(videoGroupBoard.shareDuration)[0] }}</span>小时</span><span><span class="item-strong">{{ formatSeconds(videoGroupBoard.shareDuration)[1] }}</span>分</span><span><span class="item-strong">{{ formatSeconds(videoGroupBoard.shareDuration)[2] }}</span>秒</span>
              <!-- <span class="item-strong ">{{ videoGroupBoard.shareDuration }}</span>小时<span class="item-strong">20</span>分<span class="item-strong">40</span>秒 -->
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script function>
import checkedIcon from '@/assets/image/materialBoard/checked.svg'
import { dataInfoList } from './constants'
import tips from './Tips.vue'
export default {
  components: {
    tips
  },
  props: {
    isClick: {
      type: Boolean,
      default: false
    },
    videoGroupBoard: {
      type: Object,
      default: () => ({})
    },
    defaultActive: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      activeIndex: 1,
      dataInfoList,
      checkedIcon
    }
  },
  mounted() {
    this.activeIndex = this.defaultActive
  },
  methods: {
    // 传入秒数，转换成时分秒
    formatSeconds(value) {
      console.log(value, '传进来的值')
      if (value === 0) {
        return ['00', '00', '00']
      }
      let theTime = parseInt(value) // 秒
      let theTime1 = 0 // 分
      let theTime2 = 0 // 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60)
          theTime1 = parseInt(theTime1 % 60)
        }
      }
      return [(theTime2 < 10 ? `0${theTime2}` : theTime2), (theTime1 < 10 ? `0${theTime1}` : theTime1), (theTime < 10 ? `0${theTime}` : theTime)]
    },

    handleClickItem(item, index) {
      if (!this.isClick) return
      this.activeIndex = index
      this.$emit('change', index)
    }
  }
}
</script>
<style lang="scss" scoped>
.data-info-content{
  padding: 2px;
  box-sizing: border-box;
}
.info-item{
  position: relative;
  border: 1px solid transparent;
  box-sizing: border-box;
  .materialBoard_select{
    position: absolute;
    top: -1px;
    right: 0;
  }
  .separate{
    border-left: 1px solid #dfdfdf;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .item-title{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
  .item-nums{
    margin-top: 12px;
  }
  .item-strong{
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
    color: #2C3242;
  }
}
.info-item1, .info-item2{
  // max-width: 566px;
  flex: 2;
  flex-grow: 1;
  padding: 20px;
  box-sizing: border-box;
  height: 178px;
  background: #FFFFFF;
  box-shadow: 0px 3px 11px 0px rgba(75,78,79,0.16);
  border-radius: 8px;
}
.info-item3{
  // max-width: 327px;
  flex: 1;
  flex-grow: 1;
  padding: 20px;
  box-sizing: border-box;
  height: 178px;
  background: #FFFFFF;
  box-shadow: 0px 3px 11px 0px rgba(75,78,79,0.16);
  border-radius: 8px;
}
.item-active{
  background: #F2F9FF;
  box-shadow: 0px 3px 11px 0px rgba(194,196,197,0.16);
  border: 1px solid #00A3FF;
}
</style>
