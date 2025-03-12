<template>
  <div class="imageShowView">
    <template v-for="(item, index) in fileList">
      <div
        v-if="(fileList.length >= maxShowLength - 1 && showMore) || index < maxShowLength - 1"
        :key="`image_${index}`"
        class="image_poster_box"
      >
        <template v-if="index < maxShowLength">
          <div class="image_poster">
            <imgShow :url="item" style="width: 100%; height: 100%" />
          </div>
        </template>
        <template v-if="index >= maxShowLength && showMore">
          <div class="image_poster">
            <imgShow :url="item" style="width: 100%; height: 100%" />
          </div>
        </template>
      </div>
    </template>
    <div v-if="fileList.length > maxShowLength && !showMore" class="image_poster_box">
      <div class="iconview" @click="showMore = true">
        <svg-icon icon-class="gengduo" />
        <span class="iconText">查看更多</span>
      </div>
    </div>
    <div v-if="fileList.length > maxShowLength && showMore" class="image_poster_box">
      <div class="iconview" @click="showMore = false">
        <svg-icon icon-class="shouqi" />
        <span class="iconText">点击收起</span>
      </div>
    </div>
  </div>
</template>

<script>
import imgShow from '../components/imgShow.vue'
export default {
  components: {
    imgShow
  },
  props: {
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    maxShowLength: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      showMore: true
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.imageShowView {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.image_poster_box {
  position: relative;
  width: 120px;
  height: 90px;
  margin-right: 20px;
  margin-bottom: 20px;
  .del {
    position: absolute;
    right: -6px;
    top: -6px;
    color: #686664;
    cursor: pointer;
  }
  .iconview {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    font-size: 24px;
    cursor: pointer;
    .iconText {
      margin-top: 8px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      line-height: 20px;
    }
  }
  .image_poster {
    position: relative;
    width: 120px;
    height: 90px;
    background: #ffffff;
    border-radius: 4px;
    background: #fafafa;
    // border: 1px dashed #DCDCDC;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0c6fff;
    line-height: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    overflow: hidden;
    .addimag_icon {
      font-size: 18px;
      margin-bottom: 13px;
    }
    &:hover {
      border-color: #0c6fff;
    }
    .addimag_icon_error {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #f53f3f;
      line-height: 22px;
    }
    .alignUploadShow {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 2;
      background: #fbfcfe;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .alignUploadIcon {
        font-size: 24px;
      }
    }
  }
}
</style>
