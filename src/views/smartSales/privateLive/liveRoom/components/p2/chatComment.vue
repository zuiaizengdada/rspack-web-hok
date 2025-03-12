<template>
  <span class="chatComment" :class="`hokMsgType${getHokMsgType()}`">
    <template v-if="type === 'text'">
      <template v-if="getcloudCustomData.hokMsgType === 6">
        <coupon :cloud-custom-data="getcloudCustomData.data" />
      </template>
      <template v-else-if="getcloudCustomData.hokMsgType === 7">
        <goodsView :cloud-custom-data="getcloudCustomData.data" @load="imgLoadSuccess()" />
      </template>

      <span v-else class="p-10 chatComment_text" v-html="filterContent(content.text)" />
    </template>
    <template v-else-if="type === 'image'">
      <template v-if="ifSend">
        <div v-loading="ifSend" style="width: 52px;height: 52px;" element-loading-text="发送中" />
      </template>
      <el-image
        v-else
        fit="cover"
        class="myImageView"
        :class="`hokMsgType${getHokMsgType()}`"
        :src="renderImgSrc(content.imageInfoArray[0].imageUrl)"
        :style="{'max-width': content.imageInfoArray[0].height > 1000 ? '100px' : '200px', height: content.imageInfoArray[0].height + 'px', 'max-height': '200px' }"
        :preview-src-list="[content.imageInfoArray[0].imageUrl]"
      >
        <div slot="error" class="image-slot">
          <i v-if="ifSend" class="el-icon-picture-outline" />
          <span v-else>加载失败</span>
        </div>
      </el-image>
    </template>
    <slot />
  </span>
</template>

<script>
import { emojiMap } from './Emoji/emoji.js'
import coupon from './coupon.vue'
import goodsView from './goodsView.vue'
export default {
  components: {
    coupon,
    goodsView
  },
  props: {
    cloudCustomData: {
      type: String,
      default: ''
    },
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
    }
  },
  data() {
    return {}
  },
  computed: {
    getcloudCustomData() {
      if (this.cloudCustomData) {
        return JSON.parse(this.cloudCustomData)
      } else {
        return {
          hokMsgType: ''
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    // getFileType,
    filterContent(value) {
      if (!value) {
        return ''
      } else {
        const reg = /\[(.*?)\]/gi
        const tmp = value.match(reg)
        if (!tmp) return value
        tmp.forEach((i) => {
          let imgStr = ''
          if (emojiMap[i]) {
            if (this.ifOneEmo(value)) {
              imgStr = `<img src="${emojiMap[i]}" style="width:22px;height:22px;display: inline-block;vertical-align:bottom;" />`
            } else {
              imgStr = `<img src="${emojiMap[i]}" style="width:22px;height:22px;display: inline-block;vertical-align:bottom;" />`
            }
          } else {
            imgStr = i
          }
          value = value.replace(i, imgStr)
        })
        return value
      }
    },
    imgLoadSuccess(url) {
      this.$emit('imgLoadSuccess')
    },
    getHokMsgType() {
      if (this.cloudCustomData) {
        const obj = JSON.parse(this.cloudCustomData)
        return obj.hokMsgType
      }
    },
    // 选择渲染图片
    renderImgSrc(src) {
      if (src.includes('oss.hokkj.cn')) {
        return src + '?x-oss-process=image/resize,w_198,h_198'
      } else {
        return src + '&imageView2/3/w/198/h/198'
      }
    },
    // 判断是否是一个表情包，且命中了系统已有的表情包
    ifOneEmo(text) {
      const flag = /^\[.*\]$/.test(text)
      if (flag) {
        return Boolean(emojiMap[text])
      }
      return false
    }
  }
}
</script>

<style lang='scss' scoped>
.chatComment_text {
  // display: inline-block;
  display: inline-block;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  background-color: #fff;
  line-height: 20px;
  white-space: pre-wrap;
  font-size: inherit;
  word-break: break-word;
  position: relative;
}
.noBg {
  background-color: transparent!important;
}
.chatComment {
  text-align: left;
  display: inline-block;
  // padding: 10px;
  // background: #FFFFFF;
  border-radius: 6px;
  overflow: hidden;
  font-size: 14px;
  color: rgba(51, 51, 51, 0.9);
  line-height: 20px;
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
    background: #D8D8D8;
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
    background: linear-gradient(135deg, #FA8F36 0%, #FF5525 100%);
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
      color: #FFFFFF;
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
  background: #FFFFFF;
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
      background: #D8D8D8;
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
  background: #FFFFFF;
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
    background: #D8D8D8;
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
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  .questionnaireLeft {
    width: 82px;
    height: 96px;
    background: linear-gradient(135deg, #2592FF 0%, #0569FE 100%);
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
    .questionnaireTitle{
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
  background: transparent;
}
.hokMsgType2 {
  width: 20px!important;
  height: 20px!important;
}
</style>
