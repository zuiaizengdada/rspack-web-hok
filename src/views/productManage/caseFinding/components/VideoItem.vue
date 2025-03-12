<template>
  <div class="video-container">
    <p class="platform">{{ data.platform }}</p>
    <div class="tips flex justify-between">
      <div class="flex">
        <p v-show="data.playNum > 0" class="play mr-1">
          <i class="el-icon-video-play" style="margin-right: 4px" />
          <span>{{ data.playNum | filterPlayNum }}</span>
        </p>
        <p v-show="data.zanNum > 0" class="zan">
          <svg-icon icon-class="like" style="margin-right: 4px; color: #fff; font-size: 16px" />
          <span>{{ data.zanNum | filterZanNum }}</span>
        </p>
      </div>

      <p class="duration">{{ data.duration }}</p>
    </div>
    <el-image class="image cursor-pointer" :src="data.coverSrc" fit="cover" @click="openWindowBlank">
      <div slot="error" class="image-slot">
        <img :src="defaultErrorPNG" />
      </div>
    </el-image>

    <p class="title cursor-pointer truncate" :title="data.title" @click="openWindowBlank" v-html="data.title" />
    <p class="time">发布时间：{{ data.publishDate }}</p>
    <p class="account">账号名称：{{ data.author }}</p>
    <base-dialog :visible.sync="visibleDialogVideo" width="800px" :visible-footer="true" :append-to-body="true">
      <div slot="content">
        <video autoplay :src="data.iframeSrc" controls style="width: 100%; height: 500px" />
      </div>
    </base-dialog>
  </div>
</template>
<script>
import defaultErrorPNG from '@/assets/image/default.png'
import BaseDialog from '@/components/BaseDialog.vue'
export default {
  components: { BaseDialog },
  filters: {
    filterPlayNum(value) {
      return value > 10000 ? (value / 10000).toFixed(1) + '万播放' : value
    },
    filterZanNum(value) {
      return value > 10000 ? (value / 10000).toFixed(1) + '万点赞' : value
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visibleDialogVideo: false,
      defaultErrorPNG
    }
  },
  methods: {
    openWindowBlank() {
      console.log(this.data, 111)
      if (this.data.platform === '小红书') {
        this.visibleDialogVideo = true
      } else {
        window.open(this.data.iframeSrc, '_blank')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.video-container {
  width: calc((100% - 60px) / 4);
  margin: 0 20px 20px 0;
  color: #333;
  position: relative;
  &:nth-child(4n + 4) {
    margin-right: 0;
  }
  &:last-child {
    margin-right: auto;
  }
  .platform {
    position: absolute;
    z-index: 2;
    top: 6px;
    right: 6px;
    background: rgba(0, 0, 0, 0.5);
    font-size: 12px;
    color: #fff;
    padding: 1px 2px;
    border-radius: 4px;
  }
  .tips {
    padding: 0 4px;
    width: 100%;
    position: absolute;
    top: 180px;
    z-index: 2;
    color: #fff;
    p {
      font-size: 12px;
      padding: 2px 4px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.5);
    }
  }
  .image {
    width: 100%;
    box-shadow: 0px 12px 18px 0px rgba(22, 22, 22, 0.25);
    border-radius: 6px;
    margin-bottom: 12px;
    height: 210px;
    position: relative;
    z-index: 1;
  }
  .title {
    margin-bottom: 8px;
    ::v-deep em {
      // color:#f25d8e;
      font-style: normal;
    }
  }
  .time {
    font-size: 12px;
    color: #777;
    margin-bottom: 8px;
  }
  .account {
    font-size: 12px;
    color: #777;
  }
}
</style>
