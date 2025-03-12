<template>
  <div class="video-common-container overflowOuto">
    <div class="video-common-title flex items-center">
      <div class="flex">
        <h4>一键设置</h4>
        <p> 一键设置中的内容自动同步覆盖已选和新增账号的内容，也可在账号中单独设置字段内容</p>
      </div>
      <el-button type="text" v-bind="$attrs" v-on="$listeners">更换视频</el-button>
    </div>
    <div class="video-common-content">
      <video-player class="mb-20" @getVideoOver="$emit('getVideoOver')" />
      <video-title class="mb-32" />
      <video-cover class="mb-32" />
      <video-intro class="mb-32" />
      <video-topic class="mb-32" />
      <!--      <video-address class="mb-32" />-->
      <video-open-scope class="mb-32" />
      <video-publish-timed />
    </div>
  </div>
</template>
<script>
import VideoPlayer from './VideoPlayer/index.vue'
import VideoTitle from './VideoTitle/index.vue'
import VideoCover from './VideoCover/index.vue'
import VideoIntro from './VideoIntro/index.vue'
import VideoTopic from './VideoTopic/index.vue'
import VideoOpenScope from './VideoOpenScope/index.vue'
import VideoPublishTimed from './VideoPublishTimed/index.vue'
export default {
  components: {
    VideoPlayer,
    VideoTitle,
    VideoCover,
    VideoIntro,
    VideoTopic,
    VideoOpenScope,
    VideoPublishTimed
  }
}
</script>
<style lang="scss">
.video-common-container {
  height: 100%;
}
.video-common-title{
  height: 64px;
  border-bottom:1px solid #eee;
  line-height: 24px;
  justify-content: space-between;
  padding-right: 24px;
  box-sizing: border-box;
  h4{
    font-size:16px;
    font-weight: 500;
    position: relative;
    padding-left:34px;
    flex:none;
    &::before{
      content:'';
      position: absolute;
      width: 4px;
      height: 24px;
      background: #0C6FFF;
      border-radius: 6px;
      left:20px;
      top:0;
    }
  }
  p{
    font-weight: 400;
    font-size: 12px;
    color: #777777;
    margin-left:10px;
    padding-right:10px;
  }
}
.video-common-content{
  padding:20px 110px;
}
.mb-20{
  margin-bottom:20px
}
.mb-32{
  margin-bottom:32px;
}
</style>
