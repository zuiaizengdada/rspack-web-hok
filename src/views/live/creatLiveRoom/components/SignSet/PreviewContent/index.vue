<template>
  <div class="preview-content">
    <div class="room-cover">
      <el-image :src="form.coverImgUrl" fit="cover" style="width:100%;" />
    </div>
    <div class="room-info">
      <p class="title">{{ form.name }}</p>
      <p v-show="form.startTime" class="time">开播时间: {{ form.startTime }}</p>
    </div>
    <div class="room-detail">
      <el-image v-for="item in form.applyImgUrl" :key="item" :src="item" />
    </div>
    <div class="room-bottom flex justify-center items-center">
      <el-button type="primary" size="mini" round class="bottom-btn">{{ form.applyViewText }}</el-button>
    </div>
  </div>
</template>
<script>
import BackgroundPng from '../../../image/background.png'
import defaultCoverImg from '../../../image/livePoster.jpg'
import defaultDetailImg from '../../../image/registerSettingsNodata.png'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      BackgroundPng,
      defaultCoverImg,
      defaultDetailImg,
      form: {
        coverImgUrl: defaultCoverImg,
        name: '',
        startTime: '',
        applyViewText: '立即预约',
        applyImgUrl: [defaultDetailImg]
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        console.log(val, '监听变化。。。')

        if (val.name) {
          this.form.name = val.name
        }
        if (val.startTime) {
          this.form.startTime = val.startTime
        }
        if (val.coverImgUrl) {
          this.form.coverImgUrl = val.coverImgUrl
        }
        if (val.applyViewText) {
          this.form.applyViewText = val.notApplyViewText
        }
        if (val.applyImgUrl) {
          this.form.applyImgUrl = val.applyImgUrl.split(',')
        }
      },
      deep: true

    }
  }
}
</script>
<style lang="scss" scoped>
.preview-content{
  position: relative;
  width: 240px;
  height: 476px;
  background: #fff;
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1);
  border: 1px solid #E8E8E8;
  border-radius: 24px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom:40px;
  .room-cover{
    width:100%;
    // height:212px;
  }
  .room-info{
    margin-bottom:10px;
    .title{
      font-size: 14px;
      color: #333;
    }
    .time{
      font-size:12px;
      color:#999;
    }
  }
  .room-detail{
    overflow: auto;
  }
  .room-bottom{
    position: absolute;
    width:100%;
    left:0;
    bottom:0;
    height:40px;
  }
}
.bottom-btn{
  background: #F53F3F!important;
  border-color:#F53F3F!important;
}
</style>
