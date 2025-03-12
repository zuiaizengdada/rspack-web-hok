<template>
  <div class="playerBarrage">
    <ScroollPane ref="ScroollPane" style="height: 100%" @load="rollEnd" @rollTop="rollTop">
      <chatView
        v-for="(item, index) in messageData"
        :key="index"
        :type="getOptionsValue(item.type, commentType)"
        :item="item"
        @imgLoadSuccess="imgLoadSuccess"
      />
    </ScroollPane>
  </div>
</template>

<script>
import chatView from './chatView.vue'
import { mapState } from 'vuex'
import { getOptionsValue } from '@/filters/index'
import ScroollPane from '../../liveRoom/components/p2/ScrollPane.vue'
export default {
  components: {
    chatView,
    ScroollPane
  },
  data() {
    return {
      commentType: [
        { label: 'text', value: '1', des: '普通文本' },
        { label: 'image', value: '2', des: '图片' },
        { label: 'system', value: '3', des: '系统消息' }
      ]
    }
  },
  computed: {
    ...mapState({
      messageData: state => state.im.chatView.messageData,
      chatListArr: state => state.im.chatView.messageData
    })
  },
  watch: {
    chatListArr: {
      handler(val) {
        if (val.length > 0) {
          this.scrollBottom()
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    getOptionsValue,
    rollEnd() {
      console.log('触底了~')
    },
    rollTop() {
      console.log('到顶部了')
    },
    scrollBottom() {
      this.$refs.ScroollPane && this.$refs.ScroollPane.scrollBottom()
    },
    imgLoadSuccess() {
      setTimeout(() => {
        this.scrollBottom()
      }, 200)
    }
  }
}
</script>

<style lang='scss' scoped>
.playerBarrage {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding-top: 40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: auto;
    .BarrageContent {
      margin: 5px 6px;
      // padding: 0 24px;
      .BarrageBox {
        background: rgba(21, 28, 51, .3);
        border-radius: 4px;
        padding: 0 5px;
        display: inline-block;
        .userName {
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #85DAFF;
          line-height: 17px;
        }
        .barrage {
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #fff;
          line-height: 17px;
        }
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
  }
</style>
