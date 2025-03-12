<template>
  <span class="comment_content" :style="{background: type === 4 ? 'transparent' : '#F5F9FF'}">
    <template v-if="[1,3,5, 11].includes(type)">
      <span class="p-10 comment_content_text" v-html="filterContent(content)" />
    </template>
    <template v-else-if="[4].includes(type)">
      <el-image
        class="myImageView"
        :src="content"
        :style="{'max-width': height > 1000 ? '50px' : '200px', height: '100%'}"
        :preview-src-list="[content]"
        @load="imgLoadSuccess(content)"
      >
        <div slot="error" class="image-slot">
          <i v-if="ifSend" class="el-icon-picture-outline" />
          <span v-else>加载失败</span>
        </div>
      </el-image>
    </template>
    <template v-else-if="[2].includes(type)">
      <div class="p-10">
        <el-image
          lazy
          class="myImageView"
          :src="content"
          style="width: 20px; height: 20px;"
          @load="imgLoadSuccess(content)"
        >
          <div slot="error" class="image-slot">
            <i v-if="ifSend" class="el-icon-picture-outline" />
            <span v-else>加载失败</span>
          </div>
        </el-image>
      </div>
    </template>
    <template v-else-if="[8].includes(type)">
      <div class="shoping">
        <img src="~@/assets/image/liveRoom/shopCar.png" class="shopingIcon" />
        <div class="shopingText">正在购买中</div>
      </div>
    </template>
    <template v-else-if="[9].includes(type)">
      <div class="shoping shoped">
        <img src="~@/assets/image/liveRoom/shopCar.png" class="shopingIcon" />
        <div class="shopingText">已购买</div>
      </div>
    </template>
    <template v-else-if="[10].includes(type)">
      <div class="shoping shoped">
        <img src="~@/assets/image/liveRoom/shopCar.png" class="shopingIcon" />
        <div class="shopingText">已领取优惠券</div>
      </div>
    </template>
  </span>
</template>

<script>
import { emojiMap } from '../../../liveRoom/components/p2/Emoji/emoji.js'
export default {
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
      type: Number,
      default: 3
    },
    isMine: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 0
    },
    height: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {}
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
            imgStr = `<img src="${emojiMap[i]}" style="width:20px;height:20px;display: inline-block;vertical-align:bottom;" />`
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
    }
  }
}
</script>

<style lang='scss' scoped>
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
  // background: #FFFFFF;
  background: #F5F9FF;
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
  // background: #fff;
}
.shoping {
  height: 36px;
  background: linear-gradient(90deg, #FCDCB4 0%, #F4F5F7 100%);
  // border-radius: 19px 0 19px 0;
  display: flex;
  align-items: center;
  padding-left: 6px;
  padding-right: 12px;
  .shopingIcon {
    width: 26px;
    height: 26px;
    background: #FDB765;
    border-radius: 50%;
    margin-right: 6px;
  }
  .shopingText {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 17px;
  }
}
.shoped {
  width: 100%;
  background: linear-gradient(90deg, #F53F3F 0%, #F4F5F7 100%);
}
</style>
