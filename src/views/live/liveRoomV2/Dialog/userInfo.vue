<template>
  <el-drawer :size="724" :visible.sync="visible" direction="rtl" :show-close="false" :with-header="false" :wrapper-closable="true" @opened="opened">
    <div class="closeIcon" @click="onHandleClose"><img class="closeIconImg" src="~@/assets/image/liveRoom/drawerClose.png" alt="" /></div>
    <div class="userInfo_page_wrap">
      <userInfo :user-id="userId" :live-room-id="liveRoomId" />
      <div class="userInfo_page_content">
        <div style="margin-top: 15px"><liveClickLog :user-id="userId" :live-room-id="liveRoomId" /></div>
        <div style="margin-top: 15px"><couponLog :user-id="userId" :live-room-id="liveRoomId" /></div>
        <div style="margin-top: 15px"><lectureRecords :user-id="userId" :live-room-id="liveRoomId" /></div>
        <div style="margin-top: 15px"><purchaseRecords :user-id="userId" :live-room-id="liveRoomId" /></div>
        <div style="margin-top: 15px; margin-bottom: 15px"><outboundCallRecord :user-id="userId" :live-room-id="liveRoomId" /></div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import userInfo from '@/views/live/liveRoomV2/components/userInfo/userInfo'
import liveClickLog from '@/views/live/liveRoomV2/components/userInfo/liveClickLog'
import couponLog from '@/views/live/liveRoomV2/components/userInfo/couponLog'
import lectureRecords from '@/views/live/liveRoomV2/components/userInfo/lectureRecords'
import purchaseRecords from '@/views/live/liveRoomV2/components/userInfo/purchaseRecords'
import outboundCallRecord from '@/views/live/liveRoomV2/components/userInfo/outboundCallRecord'
export default {
  components: {
    userInfo,
    liveClickLog,
    couponLog,
    lectureRecords,
    purchaseRecords,
    outboundCallRecord
  },
  data() {
    return {
      visible: false,
      liveRoomId: '',
      userId: ''
    }
  },
  watch: {
    visible() {}
  },
  mounted() {},
  methods: {
    onHandleClose() {
      this.visible = false
    },
    opened() {
    }
  }
}
</script>

<style lang='scss' scoped>
.closeIcon {
  position: fixed;
  top: 0;
  right: 724px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  .closeIconImg {
    width: 100%;
    height: 100%;
  }
}
.userInfo_page_wrap {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 13px 0 0 11px;
  .userInfoBox {}
  .userInfo_page_content {
    flex: 1 0 0;
    background: #fff;
    overflow: auto;
  }
}
</style>
