<template>
  <div class="outbound" :class="{noPhone: !item.phoneNumber || !canCall}" :style="{background: getOptionsValueByKey('value','background',active,list), color: getOptionsValueByKey('value','color',active,list), 'border-color': getOptionsValueByKey('value','border',active,list)}" @click.stop="onhandClick">
    <img v-if="item.phoneNumber && canCall" class="outboundIcon" :src="getOptionsValueByKey('value','img',active,list)" alt="" />
    <img v-else class="outboundIcon" src="~@/assets/image/liveRoom/call_grayed.png" alt="" />
    <span>{{ getOptionsValueByKey('value','label',active,list) }}</span>
  </div>
</template>

<script>
import { getOptionsValueByKey } from '@/filters/index.js'
import img1 from '@/assets/image/liveRoom/call_failed.png'
import img2 from '@/assets/image/liveRoom/calling_in_progress.png'
import img3 from '@/assets/image/liveRoom/dial.png'
import Dialog from '@/views/live/liveRoomV2/Dialog/index.js'
import { mapState } from 'vuex'
export default {
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    canCall: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      active: 1,
      list: [
        // { label: '拨打', value: 1, background: '#EAFFDD', color: '#26C04D', border: '#C9F6B4', img: img3 },
        // { label: '呼叫中', value: 2, background: '#FFF2E3', color: '#FF4A4A', border: '#FFE6C9', img: img2 },
        // { label: '呼叫失败', value: 3, background: '#FFE3E3', color: '#FF4A4A', border: '#FFC9C9', img: img1 },
        // { label: '通话中', value: 4, background: '#FFE3E3', color: '#FF4A4A', border: '#FFC9C9', img: img1 }
        { label: '拨打', value: 0, background: '#EAFFDD', color: '#26C04D', border: '#C9F6B4', img: img3 },
        { label: '呼叫失败', value: 1, background: '#FFE3E3', color: '#FF4A4A', border: '#FFC9C9', img: img1 },
        { label: '呼叫中', value: 2, background: '#FFF2E3', color: '#FF4A4A', border: '#FFE6C9', img: img2 },
        { label: '通话中', value: 3, background: '#FFF2E3', color: '#FF4A4A', border: '#FFE6C9', img: img2 },
        { label: '呼叫成功', value: 5, background: '#EAFFDD', color: '#26C04D', border: '#C9F6B4', img: img3 },
        { label: '未知', value: null, background: '#FFE3E3', color: '#FF4A4A', border: '#FFC9C9', img: img1 }
      ]
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  watch: {
    'item.callStatus': {
      handler(val) {
        this.active = val || 0
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    getOptionsValueByKey,
    onhandClick() {
      if (!this.item.phoneNumber || !this.canCall) {
        return
      }
      if (this.loading) true
      this.loading = true
      if (this.active !== 2 || this.active !== 3) {
        Dialog.open({
          type: 'Outbound',
          visible: true,
          userId: this.item.memberId,
          liveRoomDetail: this.liveRoomDetail,
          fail: () => {
            this.active = 1
            this.loading = false
          },
          // 通过结束 res 1：等待中 2: 呼叫中 3: 通话中 4: 已结束
          success: (res) => {
            if (res === 3) {
              this.active = 3
            } else {
              this.active = 2
            }
            // if (res === 'cancel') {
            //   this.active === 3 ? this.active = 1 : this.active = 0
            //   this.loading = false
            // } else {
            //   this.active = res
            // }
          },
          // 用户主动挂断通话
          hangUp: () => {
            this.active = 0
            this.loading = false
          },
          // 用户主动取消通话
          cancelCall: () => {
            this.active = this.item.callStatus || 0
            this.loading = false
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.outbound {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 27px;
    line-height: 27px;
    text-align: center;
    font-family: "PingFang SC";
    font-size: 12px;
    border-radius: 15px;
    padding: 0 8px;
    border: 1px solid;
    cursor: pointer;
    .outboundIcon {
        width: 13px;
        height: 13px;
        margin-right: 2px;
    }
}
.noPhone {
  border: 1px solid #F2F2F2!important;
  background: #FFF!important;
  color: #C2C5CC !important;
  cursor: not-allowed;
}
</style>
