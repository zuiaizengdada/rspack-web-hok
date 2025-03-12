<template>
  <div class="liveRoomPeople">
    <div class="liveRoomPeopleTitle">
      <span>直播间人数</span>
      <span>近1分钟刷新数据</span>
    </div>
    <div class="liveRoomPeopleContent">
      <div class="liveRoomPeopleView">
        <div>进入直播间人数</div>
        <div>{{ data.entryPeopleNum || 0 }}</div>
      </div>
      <div class="liveRoomPeopleView">
        <div>离开直播间人数</div>
        <div>{{ data.leavePeopleNum || 0 }}</div>
      </div>
      <div class="liveRoomPeopleView">
        <div>累计评论次数</div>
        <div>{{ data.commentOnTotalTimes || 0 }}</div>
      </div>
      <div class="liveRoomPeopleView">
        <div>人均评论次数</div>
        <div>{{ data.commentOnAvgTimes || 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          commentOnTotalTimes: 0, // 累计评论次数
          entryPeopleNum: 0, // 进入直播间人数
          leavePeopleNum: 0, // 离开直播间人数
          commentOnAvgTimes: 0 // 累计观看次数
        }
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    renderNum(data) {
      if (!data.commentOnTotalTimes) {
        return 0
      }
      const x = new BigNumber(data.commentOnTotalTimes)
      return x.idiv(data.watchTotalTimes).toNumber()
    }
  }
}
</script>

<style lang='scss' scoped>
.liveRoomPeople {
  width: 100%;
  height: 100%;
  padding: 24px 24px 0;
  .liveRoomPeopleTitle {
    display: flex;
    align-items: center;
    > span:nth-child(1) {
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #B6D4FF;
      line-height: 28px;
      margin-right: 10px;
    }
    > span:nth-child(2) {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #B6D4FF;
    }
  }
  .liveRoomPeopleContent {
    display: flex;
    flex-wrap: wrap;
    .liveRoomPeopleView {
      flex: 50% 0 0;
      margin-bottom: 20px;
      > div:nth-child(1) {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 22px;
        margin-bottom: 10px;
        padding-top: 14px;
      }
      > div:nth-child(2) {
        font-size: 28px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 32px;
        padding-bottom: 10px;
      }
    }
  }
}
</style>
