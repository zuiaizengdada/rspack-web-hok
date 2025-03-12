<template>
  <div class="otherPreserveContent m-b-20">
    <div class="otherPreserveName">允许他人保存视频<span v-if="overSize"><el-tooltip
      class="item-tips"
      effect="dark"
      placement="bottom"
    >
      <div slot="content" class="content-cls">
        <p>如果视频大于400M，不允许他人保存视频</p>
      </div>
      <img :src="wenhaoImg" style="float: right; margin-left: 5px; margin-top: 3px; cursor: pointer;" />
    </el-tooltip></span></div>
    <div class="otherPreserveSelect">
      <el-radio-group v-model="radio" @change="handlerChange">
        <el-radio :label="1" :disabled="overSize">允许</el-radio>
        <el-radio :label="0">不允许</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import wenhaoImg from '@/assets/image/account/icn_wenhao.svg'

export default {
  mixins: [mixinsAllOperations],
  data() {
    return {
      wenhaoImg,
      radio: 1,
      overSize: false
    }
  },
  methods: {
    async initData() {
      console.log(this.video, '视频的信息666')
      this.radio = this.publishChannelData.activeData?.isOtherSave
      const videoSize = (this.video.data?.size / 1024 / 1024).toFixed(2)
      if (videoSize > 400) {
        this.overSize = true
        this.radio = 0
        this.updataPublishActiveData(this.publishChannelData.activeData.account?.accountId, 'isOtherSave', this.radio)
      }
    },
    handlerChange() {
      this.updataPublishActiveData(this.publishChannelData.activeData.account?.accountId, 'isOtherSave', this.radio)
    }
  }
}
</script>

<style lang="scss" scoped>
.otherPreserveContent{
  margin-top: 20px;
  .otherPreserveName{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
    display: flex;
    align-items: center;
  }
  .otherPreserveSelect{
    margin-top: 12px;
  }
}

</style>
