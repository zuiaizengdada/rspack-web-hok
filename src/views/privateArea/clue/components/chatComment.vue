<template>
  <span class="comment_content">
    <template v-if="type === 'text'">
      <span
        class="p-10 comment_content_text"
        v-html="filterContent(content.content)"
      />
    </template>
    <template v-else-if="type === 'image' || type === 'emotion'">
      <el-image
        lazy
        :src="item.ossFileUrl"
        fit="contain"
        :style="{ 'max-width': type === 'emotion'?'300px':'100px', height: '100%', display: 'flex' }"
        :preview-src-list="[item.ossFileUrl]"
        @load="imgLoadSuccess(item.ossFileUrl)"
      >
        <div slot="error" class="image-slot">
          <i v-if="ifSend" class="el-icon-picture-outline" />
          <span v-else>加载失败</span>
        </div>
      </el-image>
    </template>
    <template v-else-if="type === 'voice'">
      <div class="audioPlayBox">
        <div class="audioPlayView">
          <audioView :if-play="ifPlay" />
        </div>
        <div v-if="ifPlay" class="audioView">{{ useTime | filterTime }}</div>
        <svg-icon
          v-else
          icon-class="audioPlayBtn"
          class-name="playBtn"
          @click="playAudio(item.ossFileUrl)"
        />
      </div>
    </template>
    <template v-else-if="type === 'video'">
      <div class="videoPlayView" @click="playVideo(item.ossFileUrl)">
        <svg-icon icon-class="bofang" class-name="audioPlayBtn" />
      </div>
    </template>
    <template v-else-if="type === 'link'">
      <a target="_blank" :href="content.link?content.link.linkUrl:''">
        <el-image
          lazy
          :src="content.link?content.link.imageUrl:''"
          :style="{ 'max-width': '100px', height: '100%', display: 'flex' }"
        />
      </a>
    </template>
    <template v-else> 暂不支持该类型消息展示 </template>
  </span>
</template>

<script>
import AppVideo from '@/components/AppVideo'
import audioView from './audioView.vue'
var BenzAMRRecorder = require('benz-amr-recorder')
export default {
  components: {
    audioView
  },
  filters: {
    filterTime(value) {
      if (!value || typeof value !== 'number') {
        return '00:00:00'
      } else {
        const result = parseInt(value)
        const h =
          Math.floor(result / 3600) < 10
            ? '0' + Math.floor(result / 3600)
            : Math.floor(result / 3600)
        const m =
          Math.floor((result / 60) % 60) < 10
            ? '0' + Math.floor((result / 60) % 60)
            : Math.floor((result / 60) % 60)
        const s =
          Math.floor(result % 60) < 10
            ? '0' + Math.floor(result % 60)
            : Math.floor(result % 60)
        return h + ':' + m + ':' + s
      }
    }
  },
  props: {
    content: {
      type: [String, Object, Array],
      default: ''
    },
    ifSend: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    isMine: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      amrDuration: '',
      ifPlay: false,
      timer: null,
      useTime: 0
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  mounted() {
    console.log(1111111, this.content)
  },
  methods: {
    // getFileType,
    filterContent(value) {
      if (!value) {
        return ''
      } else {
        return value
      }
    },
    imgLoadSuccess(url) {
      this.$emit('imgLoadSuccess')
    },
    playAudio(src) {
      clearInterval(this.timer)
      this.useTime = 0
      console.log(src)
      const _this = this
      // this.$AppAudio({
      //   visible: true,
      //   src
      // })
      var amr = new BenzAMRRecorder()
      amr.initWithUrl(src).then(function () {
        console.log(amr.getDuration())
        amr.play()
        _this.ifPlay = true
        _this.timer = setInterval(() => {
          _this.useTime += 1
        }, 1000)
      })
      amr.onEnded(function () {
        _this.ifPlay = false
        console.log('播放完毕')
        clearInterval(this.timer)
        this.useTime = 0
      })
    },
    playVideo(src) {
      console.log(src)
      // this.$AppVideo.play({
      //   url: src
      // })
      AppVideo.play({
        url: src
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comment_content_text {
  display: inline-block;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  white-space: pre-wrap;
  font-size: inherit;
  word-break: break-word;
}
.comment_content {
  text-align: left;
  display: inline-block;
  // padding: 10px;
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  font-size: 14px;
  color: rgba(51, 51, 51, 0.9);
  line-height: 22px;
  box-sizing: border-box;
  position: relative;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
  .tiwen {
    position: absolute;
    top: -12px;
    right: -12px;
    width: 24px;
    height: 24px;
  }
  .myTiwen {
    position: absolute;
    top: -12px;
    left: -12px;
    width: 24px;
    height: 24px;
  }
}
.goodsView {
  display: flex;
  max-width: 305px;
  .goodsImage {
    width: 120px;
    height: 90px;
    background: #d8d8d8;
    border-radius: 4px;
  }
  .goodsInfo {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
    .goodsTitle {
      font-size: 14px;
      color: rgba(51, 51, 51, 0.9);
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
.goodsCoupon {
  display: flex;
  height: 110px;
  .goodsCouponLeft {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    min-width: 82px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fa8f36 0%, #ff5525 100%);
    color: #fff;
    .goodsCouponRightPirce {
      .moneyIcon {
        color: #fff;
        font-weight: bold;
        font-size: 20px;
        line-height: 26px;
        display: inline-block;
      }
      .pirce {
        color: #fff;
        font-weight: bold;
        font-size: 36px;
        line-height: 26px;
        display: inline-block;
      }
    }
    .couponTypeName {
      font-size: 14px;
      color: #ffffff;
      line-height: 22px;
    }
  }
  .goodsCouponRight {
    // min-width: 223px;
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
    .goodsCouponName {
      font-size: 14px;
      font-weight: bold;
      color: rgba(51, 51, 51, 0.9);
      line-height: 22px;
      margin-bottom: 4px;
    }
    .goodsCouponDes {
      font-size: 12px;
      color: #777777;
      line-height: 20px;
    }
    .goodsCouponTime {
      font-size: 12px;
      color: #999999;
      line-height: 20px;
    }
  }
}
.card_image {
  width: 305px;
  background: #ffffff;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;
  .card_image_header {
    display: flex;
    align-items: center;
    .lianjiesvg {
      width: 20px;
      height: 20px;
      min-width: 20px;
      min-height: 20px;
    }
    .card_image_title {
      margin-left: 10px;
      font-size: 14px;
      font-weight: bold;
      color: rgba(51, 51, 51, 0.9);
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .card_image_body {
    margin-top: 11px;
    display: flex;
    .card_image_url {
      width: 80px;
      height: 80px;
      border-radius: 4px;
      background: #d8d8d8;
    }
    .card_image_des {
      margin-left: 8px;
      .card_content {
        width: 197px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        font-size: 14px;
        color: #777777;
        line-height: 22px;
      }
    }
  }
}
.card_QRCode {
  padding: 10px;
  width: 217px;
  background: #ffffff;
  border-radius: 8px;
  .card_title {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: rgba(51, 51, 51, 0.9);
    line-height: 22px;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .card_image_url {
    width: 80px;
    height: 80px;
    margin: 20px auto 0;
    background: #d8d8d8;
  }
  .card_content {
    margin-top: 10px;
    font-size: 14px;
    color: #777777;
    line-height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 14px;
    color: #777777;
  }
}
.fileView {
  padding: 10px;
  display: flex;
  .fileImage {
    min-width: 52px;
    width: 52px;
    height: 52px;
    margin-right: 14px;
  }
  .fileViewTitle {
    font-size: 14px;
    color: rgba(51, 51, 51, 0.9);
    line-height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .fileViewSize {
    text-align: right;
    font-size: 12px;
    color: #999999;
    line-height: 20px;
  }
}
.imageView {
  max-width: 180px;
  border-radius: 8px;
  overflow: hidden;
  font-size: 0;
  line-height: 0;
}
.questionnaireView {
  display: flex;
  width: 305px;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  .questionnaireLeft {
    width: 82px;
    height: 96px;
    background: linear-gradient(135deg, #2592ff 0%, #0569fe 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    .questionnaireIcon {
      width: 48px;
      height: 46px;
    }
  }
  .questionnaireContent {
    width: 223px;
    padding: 10px;
    .questionnaireTitle {
      font-size: 14px;
      color: rgba(51, 51, 51, 0.9);
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .questionnaireDes {
      margin-top: 10px;
      font-size: 14px;
      color: #777777;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
.image-slot {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-icon-picture-outline {
    font-size: 24px;
    padding: 5px 10px;
  }
}
.myImageView {
  background: #f2f2f2;
}
.audioPlayBox {
  display: flex;
  align-items: center;
  background: #e7f0ff;
  padding: 0 20px;
  .audioPlayView {
    display: flex;
    height: 36px;
    background: #e7f0ff;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    .audioIcon {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
    .audioTime {
      margin-left: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3c8bff;
      line-height: 20px;
    }
  }
  .playBtn {
    width: 24px;
    height: 24px;
    font-size: 24px;
    margin-left: 20px;
    cursor: pointer;
  }
}
.videoPlayView {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  .audioPlayBtn {
    width: 20px;
    height: 20px;
    font-size: 20px;
    cursor: pointer;
  }
}
.audioView {
  margin-left: 10px;
  white-space: nowrap;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
}
</style>
