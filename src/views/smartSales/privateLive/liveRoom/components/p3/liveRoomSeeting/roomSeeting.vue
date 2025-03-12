<template>
  <div class="roomSeeting">
    <div class="roomSeetingTitle">直播间设置</div>
    <div class="roomSeetingContent">
      <div v-if="liveRoomDetail.liveModel === 'AI_LIVE'" class="roomSeetingForm">
        <div class="roomSeetingFormLabel">不允许学员进入教室看同一个视频</div>
        <div><el-switch v-model="form.isRepeatedViewing" :disabled="liveRoomDetail.status === 9" :active-value="false" :inactive-value="true" @change="liveRoomChangeRepeatedViewing" /></div>
      </div>
      <div class="roomSeetingForm">
        <div class="roomSeetingFormLabel">全员禁言</div>
        <div><el-switch v-model="form.isShutUp" :disabled="liveRoomDetail.status === 9" :active-value="1" :inactive-value="0" @change="liveRoomChange('isShutUp')" /></div>
      </div>
      <!-- <div class="roomSeetingForm">
        <div class="roomSeetingFormLabel">允许学生发图片</div>
        <div><el-switch v-model="form.isAllowSendPic" :disabled="form.isShutUp === 1 || liveRoomDetail.status === 9" :active-value="1" :inactive-value="0" /></div>
      </div> -->
      <div class="roomSeetingForm">
        <div class="roomSeetingFormLabel">显示系统消息</div>
        <div><el-switch v-model="form.isShowNotice" :disabled="liveRoomDetail.status === 9" :active-value="1" :inactive-value="0" @change="liveRoomChange('isShowNotice')" /></div>
      </div>
      <div v-if="liveRoomDetail.liveModel === 'AI_LIVE' && liveRoomDetail.status === 1" class="roomSeetingForm">
        <div class="roomSeetingFormLabel">允许学员连麦</div>
        <div><el-switch v-model="form.isVoiceChat" :disabled="liveRoomDetail.status === 9" :active-value="1" :inactive-value="0" @change="liveRoomChange('isVoiceChat')" /></div>
      </div>

      <div class="roomSeetingForm">
        <div class="roomSeetingFormLabel">显示在线人数</div>
        <div><el-switch v-model="form.isShow" :disabled="liveRoomDetail.status === 9" @change="liveRoomChange('isShow')" /></div>
      </div>

      <div class="roomSeetingForm">
        <div class="roomSeetingFormLabel">显示购物车</div>
        <div><el-switch v-model="form.showShoppingCart" :disabled="liveRoomDetail.status === 9" @change="liveRoomChange('showShoppingCart')" /></div>
      </div>

      <div class="roomSeetingForm">
        <div class="roomSeetingFormLabel">显示点赞</div>
        <div><el-switch v-model="form.showLikeIcon" :disabled="liveRoomDetail.status === 9" @change="liveRoomChange('showLikeIcon')" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { editGroupInfo } from '@/api/liveRoom/im.js'
export default {
  components: {},
  data() {
    return {
      form: {
        isRepeatedViewing: true, // 是否重复观看
        isShutup: 0,
        isAllowSendPic: 0,
        isShowNotice: 0,
        isVoiceChat: 0, // 是否允许学员连麦
        isShow: false, // 显示在线人数
        showShoppingCart: false, // 显示购物车
        showLikeIcon: true // 显示点赞
      },
      liveRoomId: this.$route.params.id
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  watch: {
    liveRoomDetail: {
      handler(val) {
        console.log('改变', val)
        this.form = {
          isRepeatedViewing: val.liveRoomIntelligentInfo.isRepeatedViewing,
          isShutUp: val.isShutUp || 0,
          isAllowSendPic: val.isAllowSendPic || 0,
          isShowNotice: val.isShowNotice || 0,
          isVoiceChat: val.isVoiceChat ? 1 : 0,
          isShow: val.isShow || false,
          showShoppingCart: val.showShoppingCart || false,
          showLikeIcon: val.showLikeIcon
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    liveRoomChange(key) {
      console.log(this.form, key)
      const obj = {
        isRepeatedViewing: 'isRepeatedViewing',
        isShutUp: 'isShutUp',
        isAllowSendPic: 'allowSendPic',
        isShowNotice: 'displaySysMessage',
        isVoiceChat: 'isVoiceChat',
        showShoppingCart: 'showShoppingCart',
        isShow: 'showOnlineNum'
      }

      const mykey = obj[key]
      const params = {
        groupId: this.liveRoomDetail.groupId,
        liveRoomId: this.liveRoomId,
        ...(mykey && { [mykey]: !!(this.form[key]) })
      }
      if (mykey === 'isRepeatedViewing') {
        params.videoId = this.liveRoomDetail.liveRoomIntelligentInfo.videoId
        params.isRepeatedViewing = this.form[key]
      }
      // 操作类型
      const operationType = {
        showLikeIcon: 1
      }
      if (['showLikeIcon'].includes(key)) {
        params.action = !!(this.form[key])
        params.operationType = operationType[key]
      }
      editGroupInfo(params).then((res) => {
        this.$store.commit('im/SET_liveRoomDetailByKey', { data: this.form[key], key: key })
      })
    },
    liveRoomChangeRepeatedViewing(res) {
      console.log(res, 'res')
      if (!res) {
        this.$delModal({
          tips: '一旦不允许，则这个学员进任何直播间都看不了这个视频',
          success: () => {
            // this.$emit('delHandle', node.data)
            this.liveRoomChange('isRepeatedViewing')
          },
          fail: () => {
            console.log('取消')
            this.$store.commit('im/set_isRepeatedViewing', true)
            this.form.isRepeatedViewing = true
          }
        })
      } else {
        this.liveRoomChange('isRepeatedViewing')
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.roomSeeting {
  padding: 19px 24px;
  .roomSeetingTitle {
    font-weight: bold;
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    color: #333333;
    line-height: 25px;
  }
  .roomSeetingContent {
    margin-top: 16px;
    .roomSeetingForm {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;
      .roomSeetingFormLabel {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
    }
  }
}
</style>
