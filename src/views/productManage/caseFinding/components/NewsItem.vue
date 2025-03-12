<template>
  <div class="news-container flex">
    <el-image class="news-image cursor-pointer" :src="data.coverSrc" @click="openWindowBlank">
      <div slot="error" class="image-slot">
        <img :src="defaultErrorPNG" />
      </div>
    </el-image>
    <div class="news-right flex-1">
      <p class="title cursor-pointer truncate" :title="data.title" @click="openWindowBlank" v-html="data.title" />
      <p class="desc cursor-pointer" @click="openWindowBlank" v-html="data.desc" />
      <div class="bottom flex justify-between">
        <p>
          <span v-show="data.author.length">发布人：{{ data.author }}</span>
          <span v-show="data.releasTime.length" class="time">发布时间:{{ data.releasTime }} </span>
        </p>
        <p>平台：{{ data.account }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import defaultErrorPNG from '@/assets/image/default.png'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      defaultErrorPNG
    }
  },
  methods: {
    openWindowBlank() {
      window.open(this.data.link, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.news-container {
  margin-bottom: 30px;
}
.news-image {
  width: 230px;
  height: 135px;
  box-shadow: 0px 12px 18px 0px rgba(22, 22, 22, 0.25);
  border-radius: 6px;
  margin-right: 16px;
}
.news-right {
  line-height: 24px;
  color: #333333;
  position: relative;
  height: 135px;
  .title {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    color: #777;
    width: 100%;
    span {
      margin-right: 16px;
    }
    .time {
      color: #999;
    }
  }
}
</style>
