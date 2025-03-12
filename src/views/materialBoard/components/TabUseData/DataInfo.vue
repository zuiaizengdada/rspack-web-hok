<template>
  <div>
    <div class="line" />
    <Title title="数据概览" />
    <div class="data-info-container flex justify-between  m-t-20">
      <div v-for="(item,index) in dataInfoList" :key="index" class="data-info-content flex flex-between" :style="index===1?'flex:1':''">
        <div
          v-if="index === 0"
          :class="{
            'info-item': true,
            'flex': true,
            [`info-item${index+1}`]: true,
            'item-active': activeIndex === index
          }"
          style="min-width: 620px;"
          @click="handleClickItem(item, index)"
        >
          <svg-icon v-if="activeIndex === index" icon-class="materialBoard_select" class="materialBoard_select" />
          <!-- <tips :tips="item.tips" :title="item.title" /> -->
          <div class="item_mr">
            <tips :tips="item.tips" :title="item.title" />
            <div class="flex flex-column flex-1">
              <span class="flex flex-column" style="margin-bottom: 12px;">
                <span class="item-title">共享视频数</span>
                <span class="item-strong item-nums">{{ useData.shardCount }}</span>
              </span>
              <span class="flex flex-column">
                <span class="item-title">共享视频时长</span>
                <span class="item-nums">
                  <!-- <span class="item-strong">{{ formatSeconds(useData.shareDuration) }}</span> -->
                  <span><span class="item-strong">{{ formatSeconds(useData.shareDuration)[0] }}</span>小时</span><span><span class="item-strong">{{ formatSeconds(useData.shareDuration)[1] }}</span>分</span><span><span class="item-strong">{{ formatSeconds(useData.shareDuration)[2] }}</span>秒</span>
                <!-- <span class="item-strong">139</span>小时<span class="item-strong">20</span>分 -->
                </span>
              </span>
            </div>
          </div>
          <div class="separate">
            <tips :tips="videoUse" :title="'视频使用'" />
            <div class="flex">
              <div class="flex flex-column flex-1 ">
                <span class="flex flex-column" style="margin-bottom: 12px;">
                  <span class="item-title">已使用数：未使用数</span>
                  <span class="item-strong item-nums">{{ useData.usedCount }}:{{ useData.notUsedCount }}</span>
                </span>
                <span class="flex flex-column">
                  <span class="item-title">使用人数</span>
                  <span class="item-nums">
                    <span class="item-strong">{{ useData.usedPeopleCount }}</span>
                  </span>
                </span>
              </div>
              <div class="flex flex-column flex-1 ">
                <span class="flex flex-column" style="margin-bottom: 12px;">
                  <span class="item-title">已使用视频时长</span>
                  <span class="item-nums">
                    <!-- <span class="item-strong">{{ formatSeconds(useData.usedDuration) }}</span> -->
                    <span><span class="item-strong">{{ formatSeconds(useData.usedDuration)[0] }}</span>小时</span><span><span class="item-strong">{{ formatSeconds(useData.usedDuration)[1] }}</span>分</span><span><span class="item-strong">{{ formatSeconds(useData.usedDuration)[2] }}</span>秒</span>
                  <!-- <span class="item-strong">139</span>小时<span class="item-strong">20</span>分<span class="item-strong">40</span>秒 -->
                  </span>
                </span>
                <span class="flex flex-column">
                  <span class="item-title">未使用视频时长</span>
                  <span class="item-nums">
                    <span><span class="item-strong">{{ formatSeconds(useData.notUsedDuration)[0] }}</span>小时</span><span><span class="item-strong">{{ formatSeconds(useData.notUsedDuration)[1] }}</span>分</span><span><span class="item-strong">{{ formatSeconds(useData.notUsedDuration)[2] }}</span>秒</span>
                    <!-- <span class="item-strong">{{ formatSeconds(useData.notUsedDuration) }}</span> -->
                  <!-- <span class="item-strong">139</span>小时<span class="item-strong">20</span>分<span class="item-strong">40</span>秒 -->
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="index === 1"
          :class="{
            'info-item': true,
            [`info-item${index+1}`]: true,
            'flex-column':true,
            'item-active': activeIndex === index
          }"
          @click="handleClickItem(item, index)"
        >
          <svg-icon v-if="activeIndex === index" icon-class="materialBoard_select" class="materialBoard_select" />
          <tips :tips="item.tips" :title="item.title" />
          <div class="flex flex-column flex-1">
            <span class="flex flex-column" style="margin-bottom: 12px;">
              <span class="item-title">已发布成品数</span>
              <span class="item-strong item-nums">{{ useData.finishCount }}</span>
            </span>
            <span class="flex flex-column">
              <span class="item-title">已发布作品数</span>
              <span class="item-nums">
                <span class="item-strong ">{{ useData.workCount }}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script function>
import checkedIcon from '@/assets/image/materialBoard/checked.svg'
import { dataInfoList, videoUse } from './constants'
import tips from '../Base/Tips.vue'
import Title from '../Base/Title.vue'
export default {
  components: {
    tips,
    Title
  },
  props: {
    isClick: {
      type: Boolean,
      default: false
    },
    useData: {
      type: Object,
      default: () => {}
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
      videoUse,
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
      if (value === 0 || value === null) {
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
  width: 100%;
}
.item_mr{
  flex: 1;
}
.separate{
  flex: 2;
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
.info-item1{
  width: 100%;
  // min-width: 1200px;
  padding: 20px;
  box-sizing: border-box;
  height: 211px;
  background: #FFFFFF;
  box-shadow: 0px 3px 11px 0px rgba(75,78,79,0.16);
  border-radius: 8px;
}
.info-item2{
  margin-left: 20px;
  min-width: 327px;
  padding: 20px;
  box-sizing: border-box;
  height: 211px;
  background: #FFFFFF;
  box-shadow: 0px 3px 11px 0px rgba(75,78,79,0.16);
  border-radius: 8px;
}
.item-active{
  background: #F2F9FF;
  box-shadow: 0px 3px 11px 0px rgba(194,196,197,0.16);
  border: 1px solid #00A3FF;
}
.line{
  height: 1px;
  background-color: #dfe4ed;
  width: 100%;
  margin: 20px 0px;
}
</style>
