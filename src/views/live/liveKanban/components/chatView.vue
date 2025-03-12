<template>
  <div class="BarrageContent">
    <template v-if="item.type === '3'">
      <div class="BarrageBox infoSys">{{ item.content }}</div>
    </template>
    <span v-else class="BarrageBox">
      <span class="userName">{{ item.message.nick }}：</span>
      <span v-if="type === 'text'" class="barrage comment_content_text" v-html="filterContent(item.message.payload.text)" />
      <template v-else-if="type === 'image'">
        <el-image
          :src="item.message.payload.imageInfoArray[0].imageUrl"
          :style="{'max-width': item.message.payload.imageInfoArray[0].height > 1000 ? '50px' : '300px', height: '100%'}"
          :preview-src-list="[item.message.payload.imageInfoArray[0].imageUrl]"
          @load="imgLoadSuccess(item.message.payload.imageInfoArray[0].imageUrl)"
        >
          <div slot="error" class="image-slot">
            <i v-if="item.ifSend" class="el-icon-picture-outline" />
            <span v-else>加载失败</span>
          </div>
        </el-image>
      </template>
    </span>
  </div>
</template>

<script>
import { emojiMap } from '../../liveRoom/components/p2/Emoji/emoji.js'
export default {
  components: {},
  props: {
    type: {
      type: String,
      default: 'text'
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
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
    }
  }
}
</script>

<style lang='scss' scoped>
.BarrageContent {
  margin: 5px 6px;
  // padding: 0 24px;
  .BarrageBox {
    background: rgba(21, 28, 51, .3);
    border-radius: 4px;
    padding: 0 5px;
    display: inline-block;
    min-height: 24px;
    .userName {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #85DAFF;
      line-height: 17px;
      float: left;
      padding-top: 5px;
    }
    .barrage {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #fff;
      line-height: 17px;
    }
  }
  .infoSys {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fff;
    line-height: 24px;
  }
}
.comment_content_text {
  // display: inline-block;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  white-space: pre-wrap;
  font-size: inherit;
  word-break: break-word;
}
</style>
