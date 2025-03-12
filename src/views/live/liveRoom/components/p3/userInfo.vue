<template>
  <!-- 用户信息 -->
  <div class="pageWrap">
    <liveRoomDetail />
    <div class="userInfo">
      <div class="tab">
        <div class="tabView" :class="{current: tabIndex === 1}" @click="tabIndex = 1">听课记录</div>
        <div class="tabView" :class="{current: tabIndex === 2}" @click="tabIndex = 2">购买记录</div>
      </div>
      <div class="p-t-20  userInfoContent">
        <classAttendanceRecord v-if="tabIndex === 1" />
        <PurchaseRecord v-if="tabIndex === 2" />
      </div>
    </div>
  </div>
</template>

<script>
import liveRoomDetail from './liveRoomSeeting/liveRoomDetail.vue'
import PurchaseRecord from './liveRoomSeeting/PurchaseRecord.vue'
import classAttendanceRecord from './liveRoomSeeting/classAttendanceRecord.vue'
export default {
  components: {
    liveRoomDetail,
    classAttendanceRecord,
    PurchaseRecord
  },
  data() {
    return {
      tabIndex: 1
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.pageWrap {
  // height: 100%;
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  .userInfo {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 19px;
    .tab {
      margin: 0 24px;
      width: 320px;
      display: flex;
      border-radius: 4px;
      border: 1px solid #D8DCE6;
      overflow: hidden;
      height: 40px;
      .tabView {
        text-align: center;
        flex: 1 0 0;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 40px;
        cursor: pointer;
      }
      .current {
        color: #fff;
        background: #0C6FFF;
        border-radius: 4px;
      }
    }
  }
  .userInfoContent {
    flex: 1 0 0;
  }
}
</style>
