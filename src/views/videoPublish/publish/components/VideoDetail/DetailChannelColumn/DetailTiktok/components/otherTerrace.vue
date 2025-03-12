<template>
  <div class="otherContent">
    <div class="otherName">
      <span>同步到其他平台</span>
      <span class="otherTips">打开同步开关可以同步内容至今日头条</span>
    </div>
    <div class="otherSelect ">
      <div class="fl fl_ai_c">
        <!--        <img :src="xigua">-->
        <!--        <span class="font1">西瓜视频</span>-->
        <!--        <span class="font2">/</span>-->
        <img :src="tt" />
        <span class="font1">今日头条</span>
      </div>
      <el-switch
        v-model="value"
        @change="changeSave"
      />
    </div>
  </div>
</template>

<script>
import xigua from '@/assets/svg/videoManga/xigua_icon.svg'
import tt from '@/assets/svg/videoManga/tt_icon.svg'
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'

export default {
  name: 'OtherTerrace',
  mixins: [mixinsAllOperations],
  data() {
    return {
      xigua,
      tt,
      value: true
    }
  },
  methods: {
    initData() {
      this.value = this.publishChannelData.activeData?.isSyncOtherPlatform
    },
    changeSave(e) {
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'isSyncOtherPlatform', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.otherName{
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 24px;
  margin-top: 20px;
}
.otherTips{
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  margin-left: 10px;
}
.otherSelect{
  width: 100%;
  height: 68px;
  background: #FAFAFA;
  border-radius: 4px;
  margin-top: 10px;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.font1,.font2{
  font-family: PingFangSC-Regular, PingFang SC;
  color: #333333;
}
.font1{
  font-size: 14px;
  font-weight: 400;
  margin-left: 10px;
}
.font2{
  font-size: 24px;
  font-weight: 300;
  margin: 0 10px;
}
</style>
