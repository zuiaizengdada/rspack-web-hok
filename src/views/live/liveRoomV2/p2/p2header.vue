<template>
  <div class="p2_box_header">
    <div class="p2_box_header_left">
      <div class="form_item"><img src="~@/assets/image/liveRoom/invitation_icon.png" class="v_icon" />
        <span class="form_label">邀约在线人数：</span>
        <span class="form_value">{{ liveGroupDetail.realUserCount || 0 }}</span>
      </div>
      <div class="form_item bd-l"><img src="~@/assets/image/liveRoom/heatLive.png" class="v_icon" />
        <span class="form_label">人气：</span>
        <span class="form_value">{{ liveGroupDetail.currentOnlineCount }}</span>
      </div>
    </div>
    <div class="p2_box_header_right">
      <el-popover placement="bottom-end" width="300" trigger="click" :tabindex="99999">
        <div slot="reference" class="live_setting_btn">
          <img class="live_setting_icon" src="~@/assets/image/liveRoom/live_setting_icon.png" alt="" />
          <span>直播间设置</span>
        </div>
        <div>
          <liveRoomSetting />
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import liveRoomSetting from './liveRoomSetting.vue'
import { mapState } from 'vuex'
export default {
  components: {
    liveRoomSetting
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      liveGroupDetail: state => state.im.liveGroupDetail
    })
  },
  mounted() {},
  methods: {
    onhandleClick() {
      this.$emit('onClick')
    }
  }
}
</script>

<style lang='scss' scoped>
.p2_box_header {
  height: 48px;
  max-height: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ebebeb;
  padding: 0 8px 0 19px;
  .p2_box_header_left {
    display: flex;
    .form_item {
      display: flex;
      align-items: center;
      padding-right: 15px;
      &.bd-l{
        position: relative;
        &::before{
          content: '';
          height: 12px;
          width: 1px;
          background: #DCDEE1;
          position: absolute;
          top: 50%;
          left: -0.5px;
          transform: translateY(-50%);
        }
      }
      .v_icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        margin-right: 5px;
      }
      .form_label {
        color: #999999;
        font-family: "Microsoft YaHei UI";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px;
      }
      .form_value {
        color: #000000;
        font-family: "Microsoft YaHei UI";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px;
      }
    }
    .form_item + .form_item {
      /* border-left: 1px solid #DCDEE1; */
      padding-left: 15px;
    }
  }
  .p2_box_header_right {
    .live_setting_btn {
      padding: 0 5px;
      height: 28px;
      line-height: 29px;
      flex-shrink: 0;
      border-radius: 5px;
      border: 1px solid #DCDEE1;
      background: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      cursor: pointer;
      .live_setting_icon {
        width: 15px;
        height: 15px;
        margin-right: 2px;
      }
      &:hover {
        border: 1px solid #409eff;
      }
    }
  }
}
</style>
