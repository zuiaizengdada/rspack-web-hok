<template>
  <div v-if="Topping.show" class="toppingMsg">
    <div class="toppingMsgValue">
      <div class="line" />
      <AppAvatar
        :avatar="Topping.avatar"
        :name="Topping.nick"
        width="16"
        :no-name="true"
      />
      <div class="toppingMsgValueText text_hidden_1">
        <span class="toppingMsgNick">{{ Topping.nick }}：</span>
        <span v-html="filterContent(Topping.text)" />
      </div>
      <div class="closeBtn" @click="onhandleCancel">
        <i class="el-icon-close " title="取消置顶" />
      </div>
    </div>
  </div>
</template>

<script>
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { emojiMap } from '@/views/live/liveRoomV2/p3/component/Emoji/emoji.js'
import { mapState } from 'vuex'
export default {
  components: {
    AppAvatar
  },
  data() {
    return {
      timer: null
    }
  },
  computed: {
    ...mapState({
      Topping: state => state.im.Topping
    })
  },
  watch: {
    'Topping.show': {
      handler(val) {
        if (val) {
          this.downTIme()
        } else {
          this.clearTimer()
        }
      },
      deep: true,
      immediate: true
    }
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
    },
    onhandleCancel() {
      this.$store.dispatch('im/sendTsignalMessage', {
        data: '12',
        description: '取消置顶群消息',
        extension: {
          messageId: '', // 会话id
          text: '',
          avatar: '',
          nick: '',
          countdownTime: 0
        }
      }).then(() => {
        this.$store.commit('im/set_Topping', {
          id: '',
          show: false,
          text: '',
          avatar: '',
          nick: '',
          countdownTime: 0
        })
      })
    },
    // 倒计时20s后关闭弹框
    downTIme() {
      this.clearTimer()
      this.timer = setInterval(() => {
        this.onhandleCancel()
        this.clearTimer()
      }, 20000)
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style lang='scss' scoped>
.toppingMsg {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    z-index: 2;
    .toppingMsgValue {
        padding: 8px;
        border-radius: 5px;
        background: #ffffffe6;
        box-shadow: 0 2px 4px 0 #0000000d;
        display: flex;
        align-items: center;
        position: relative;
        .line {
          background: #ff3c37;
          position: absolute;
          top: 50%;
          left: 0;
          width: 2px;
          height: 16px;
          transform: translateY(-50%);
        }
        .toppingMsgValueText {
            margin-left: 3px;
            font-size: 12px;
            font-weight: bolder;
            color: #000000;
            flex: 1 0 0;
            .toppingMsgNick {
              font-size: 12px;
              color: #363636;
              font-weight: 400;
            }
        }
        .closeBtn {
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
            border-radius: 4px;
            &:hover {
                background: #ccc;
            }
        }
    }
}
</style>
