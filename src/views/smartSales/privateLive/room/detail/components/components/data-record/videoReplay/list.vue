<template>
  <div class="interaction" :class="{active: ifActive, searchActive: item.id === currentSearchId}">
    <div class="list_wrap" @click="onhandleClick">
      <div class="view_left"><span class="view_time">{{ item.msgTime| parseTime('{h}:{i}:{s}') }}</span></div>
      <div class="view_user">
        <div v-if="[3, 4, 5].includes(item.fromUserRole)" class="robatIcon">
          <img src="~@/assets/image/live/robat.png" alt="" />
        </div>
        <div class="userName"><textShowMore :line-clamp="1" :text="item.fromUserName" /></div>
        <div v-if="[0, 5].includes(item.fromUserRole)" class="userRole">讲师</div>
        <div v-else-if="[1 ,4].includes(item.fromUserRole)" class="userRole">助教</div>
      </div>
      <div class="view_right">
        <template>
          <div v-if="item.msgBody && item.msgBody[0].msgType === 'TIMTextElem' && item.msgBody[0].textMsgContent" class="comment_content_text" v-html="filterContent(item.msgBody[0].textMsgContent.text)" />
          <div v-else-if="item.msgBody && item.msgBody[0].msgType === 'TIMImageElem' && item.msgBody[0].imageMsgContent.origImage">
            <el-image
              :style="{
                width:`${!item.msgBody[0].imageMsgContent.origImage.width ? 100 : item.msgBody[0].imageMsgContent.origImage.width}px`,
                height: `${!item.msgBody[0].imageMsgContent.origImage.height ? 100 : item.msgBody[0].imageMsgContent.origImage.height}px`,
                maxHeight: '100px',
                maxWidth: '100px'
              }"
              :src="item.msgBody[0].imageMsgContent.origImage.url"
              fit="contain"
              :preview-src-list="[item.msgBody[0].imageMsgContent.origImage.url]"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { emojiMap } from './Emoji/emoji.js'
import { filtersTextPhone } from '@/utils/index'
import textShowMore from '@/components/textShowMore/index2.vue'
export default {
  components: {
    textShowMore
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          time: '',
          userName: '',
          role: 1,
          text: ''
        }
      }
    },
    playTime: {
      type: Number,
      default: 0
    },
    // 当前点击的currentId
    currentId: {
      type: [String, Number],
      default: ''
    },
    currentSearchId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ifActive() {
      return this.getTime(this.item.time) === this.getTime(this.playTime * 1000) || this.currentId === this.item.id
    }
  },
  mounted() {
    console.log()
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
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
    onhandleClick() {
      console.log(this.item, 'item')
      this.$emit('onHandleClick', this.item)
    },
    getTime(value) {
      const h =
      Math.floor(value / 3600000) >= 10
        ? String(Math.floor(value / 3600000))
        : '0' + Math.floor(value / 3600000)
      const m =
      Math.floor((value / 60000) % 60) >= 10
        ? String(Math.floor((value / 60000) % 60))
        : '0' + Math.floor((value / 60000) % 60)
      const s =
      Math.floor((value / 1000) % 60) >= 10
        ? String(Math.floor((value / 1000) % 60))
        : '0' + Math.floor((value / 1000) % 60)
      return h + ':' + m + ':' + s
    }
  }
}
</script>

<style lang='scss' scoped>
.interaction {
  padding: 10px 10px 0 0;
  .list_wrap {
    display: flex;
    align-items: center;
    min-height: 60px;
    border-radius: 4px;
    opacity: 1;
    border: 1px solid #e3e3e3;
    background: #fcfcfc;
    cursor: pointer;
    .view_left {
        width: 78px;
        .view_time {
            display: inline-block;
            text-align: center;
            width: 100%;
            padding-left: 10px;
            padding-right: 10px;
            color: #000000;
            font-size: 14px;
            font-weight: 700;
            font-family: "微软雅黑";
            text-align: left;
            line-height: 14px;
            border-right: 1px solid #cccccc;
        }
    }
    .view_user {
      width: 118px;
      display: flex;
      align-items: center;
      padding-left: 14px;
      .robatIcon {
        width: 16px;
        height: 16px;
        min-width: 16px;
        > img {
            width: 100%;
        }
      }
      .userName {
        margin-left: 3px;
        margin-right: 3px;
        // flex: 1 0 0;
        color: #000000;
        font-size: 14px;
        font-weight: 400;
        font-family: "微软雅黑";
        text-align: left;
        line-height: 16px;
        height: 16px;
      }
      .userRole {
        min-width: 26px;
        width: 26px;
        height: 14px;
        line-height: 14px;
        border-radius: 2px;
        opacity: 1;
        background: #0091ff;
        color: #ffffff;
        font-size: 10px;
        font-weight: 400;
        font-family: "AlibabaPuHuiTi";
        text-align: center;
      }
    }
    .view_right {
      flex: 1 0 0;
      padding-left: 10px;
      overflow: hidden;
      font-size: 14px;
      font-weight: 400;
      font-family: "微软雅黑";
    }
  }
}
.active {
  .list_wrap {
    border: 1px solid #0c6fff;
    // background: #fffbed;
  }
  .comment_content_text {
    // color: #FF8D1A;
  }
}
.searchActive {
  .list_wrap {
    border: 1px solid #FF8D1A;
    background: #fffbed;
  }
  .comment_content_text {
    color: #FF8D1A;
  }
}
</style>
