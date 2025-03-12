<template>
  <div class="messageHeader">
    <template v-if="chatUser.type === 2">
      <div class="publicLiveRoom">
        <div class="publicLiveRoomTitle">
          <div class="publicLiveRoomTitleName">公共聊天室</div>
          <div class="publicLiveRoomTitlePeople">
            <svg-icon icon-class="zaixianrenshu" class-name="renshutiaozhengIcon" />
            <span class="liveRoomSum">邀约在线人数：{{ liveGroupDetail.realUserCount }}</span>
            <svg-icon icon-class="liveroomzongshu" class-name="renshutiaozhengIcon" />
            <span class="liveRoomSum">人气：{{ liveGroupDetail.currentOnlineCount }}</span>

            <el-tooltip class="item" effect="dark" content="V代表邀约人数/人气" placement="top-start">
              <svg-icon icon-class="question" class-name="renshutiaozhengIcon" />
            </el-tooltip>
            <!-- <svg-icon icon-class="zaixianrenshu" class-name="renshutiaozhengIcon" />
            <span class="liveRoomSum">在线人数：{{ liveGroupDetail.currentOnlineCount }}/{{ liveGroupDetail.adjustCount }}</span> -->
          </div>
        </div>
        <div class="renshutiaozheng">
          <el-tooltip effect="dark" placement="bottom">
            <div slot="content" v-html="'1、当勾选后，只展示邀约学员的发言。<br/>2、只对当前时刻之后的数据有影响。<br/>3、只对当前进入直播间的当前老师有影响。不影响其他老师'" />
            <el-checkbox :value="ifReadStudent" @change="onhandleifReadStudent">查看邀约学员发言</el-checkbox>
          </el-tooltip>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Dialog from '../Dialog/index.js'
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/liveRoom/im.js'
import moment from 'moment'
export default {
  filters: {
    renderTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  components: {},
  data() {
    return {
      userInfo: {
        liveRoomId: null,
        liveRoomName: null,
        markType: '',
        phoneNumber: null,
        recentPurchaseTime: null,
        registerTime: null,
        remarks: '',
        traineeName: null,
        traineePicUrl: null,
        wechatId: null
      }
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      liveRoomDetail: state => state.im.liveRoomDetail,
      leftList: state => state.im.leftList,
      liveGroupDetail: state => state.im.liveGroupDetail,
      ifReadStudent: state => state.im.ifReadStudent
    })
  },
  watch: {
    chatUser: {
      handler(val) {
        if (val.type === 1) {
          // this.getUserInfo(val.userId)
        }
      },
      deep: true,
      immediate: true
    },
    // 会话更新时触发
    'leftList': {
      handler(val) {
        if (this.chatUser.type === 1 && this.chatUser.userId) {
          const arr = this.leftList.myTrainees.concat(this.leftList.generalTrainees)
          const obj = arr.find(v => v.memberId === this.chatUser.userId)
          if (obj) {
            this.userInfo.remarks = obj.traineeRemark
            this.userInfo.traineeName = obj.memberName
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    // 点击人数调整
    onhandlePeopleEdit() {
      Dialog.open({
        visible: true,
        type: 'EditPeopleNumber',
        success: () => {
          Dialog.close()
        }
      })
    },
    getUserInfo(traineeId) {
      this.userInfo = {
        liveRoomId: null,
        liveRoomName: null,
        markType: '',
        phoneNumber: null,
        recentPurchaseTime: null,
        registerTime: null,
        remarks: '',
        traineeName: null,
        traineePicUrl: null,
        wechatId: null
      }
      getUserInfo({ traineeId, liveRoomId: this.liveRoomDetail.liveRoomId }).then(res => {
        console.log(res)
        this.userInfo = res.data
      })
    },
    onhandleifReadStudent(res) {
      this.$store.commit('im/set_ifReadStudent', res)

      this.$store.dispatch('im/refreshChatRecord')
      // setTimeout(() => {
      //   location.reload()
      // }, 200)
    }
  }
}
</script>

<style lang='scss' scoped>
.messageHeader {
  padding: 0 23px;
  background: #F5F5F5;
  border-bottom: 1px solid #E6E6E6;
  .publicLiveRoom {
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .publicLiveRoomTitle {
      display: flex;
      align-items: center;
      .publicLiveRoomTitleName {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 25px;
      }
      .publicLiveRoomTitlePeople {
        margin-left: 10px;
        font-size: 14px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #333333;
        line-height: 16px;
        .liveRoomSum {
          font-size: 14px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #333333;
          line-height: 16px;
          margin-right: 8px;
        }
      }
    }
  }
  .privateChat {
    padding-top: 8px;
    padding-bottom: 8px;
    .privateChatHeader {
      display: flex;
      align-items: center;
      .userName {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 25px;
      }
      .userLiveRoom {
        margin-left: 6px;
        padding: 0 6px;
        height: 20px;
        background: #E7F0FF;
        border-radius: 2px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0C6FFF;
        line-height: 20px;
      }
    }
    .privateForm {
      margin-top: 6px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .formItem {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-right: 20px;
        .formLabel {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 17px;
        }
        .formValue {
          margin-left: 4px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 17px;
        }
      }
    }
  }
}
.renshutiaozheng {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #0C6FFF;
  line-height: 20px;
  cursor: pointer;
}
.renshutiaozhengIcon {
  font-size: 16px;
  line-height: 20px;
  margin-right: 2px;
}
</style>
