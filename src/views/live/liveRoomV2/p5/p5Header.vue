<template>
  <div class="p5_box_header">
    <div class="p5_box_header_left">营销工具</div>
    <el-popover v-model="visible" placement="bottom-end" width="432" trigger="manual">
      <toolsBarSetting :live-tool-bar="getLiveToolBar()" :marketing-toolbar="getMarketingToolbar()" @success="success" @cancal="cancal" />
      <div slot="reference" class="p5_box_header_right" @click="onhandleClickSetting">
        <img class="p5_box_header_right_img" src="~@/assets/image/liveRoom/live_setting_icon.png" alt="" />
        <div class="p5_box_header_right_btn">设置</div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import toolsBarSetting from './toolsBarSetting.vue'
// import Dialog from '@/views/live/liveRoomV2/Dialog/index.js'
export default {
  components: {
    toolsBarSetting
  },
  inject: ['getLiveToolBar', 'getMarketingToolbar', 'setLiveToolBar', 'setMarketingToolbar'],
  data() {
    return {
      visible: false
    }
  },
  mounted() {},
  methods: {
    cancal() {
      console.log('点击取消')
      this.visible = false
    },
    success(res) {
      console.log('点击确定')
      this.setLiveToolBar(res.liveToolBar)
      this.setMarketingToolbar(res.marketingToolbar)
      this.visible = false
    },
    // 点击设置按钮打开设置弹框
    onhandleClickSetting(e) {
      console.log(e, 'e')
      this.visible = true
      // Dialog.open({
      //   type: 'ToolsBarSetting',
      //   visible: true,
      //   liveToolBar: this.getLiveToolBar(),
      //   marketingToolbar: this.getMarketingToolbar(),
      //   success: (res) => {
      //     this.setLiveToolBar(res.liveToolBar)
      //     this.setMarketingToolbar(res.marketingToolbar)
      //   }
      // })
    }
  }
}
</script>

<style lang='scss' scoped>
.p5_box_header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 15px 10px;
    background: #fff;
    .p5_box_header_left {
      color: #000000;
      font-family: "Microsoft YaHei";
      font-size: 16px;
      font-style: normal;
      font-weight: bolder;
      line-height: 16px;
    }
    .p5_box_header_right {
      color: #000000;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: Normal;
      line-height: 15px;
      display: flex;
      align-items: center;
      .p5_box_header_right_img {
        width: 15px;
        height: 15px;
        margin-right: 4px;
        cursor: pointer;
      }
      .p5_box_header_right_btn {
        cursor: pointer;
        &:hover {
          color: #0C6FFF;
        }
      }
    }
}
</style>
