<template>
  <div>
    <slot name="kuaishouTit" class="mb-20" />
    <div>
      <el-checkbox-group v-model="checkList" @change="handlerChange">
        <div>
          <el-checkbox label="1">
            <div class="ck-details">
              <span class="ck-details-con">
                允许别人跟我拍同框
              </span>
              <span>
                时长15分钟以内的作品支持拍同框
              </span>
            </div>
          </el-checkbox>
          <el-checkbox label="2">
            <span class="ck-details-con">不允许下载此作品</span>
          </el-checkbox>
        </div>
        <div class="m-t-12">
          <el-checkbox label="3">
            <span class="ck-details-con">作品在同城不显示</span>
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'

export default {
  name: 'Individualization',
  components: {},
  mixins: [mixinsAllOperations],
  data() {
    return {
      checkList: []
    }
  },
  methods: {
    initData() {
      this.checkList = this.publishChannelData.activeData?.personalizedSettingType || []
    },
    handlerChange() {
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'personalizedSettingType', this.checkList)
    }
  }
}
</script>

<style lang="scss" scoped>
.ck-details{
  :nth-child(2){
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
  }
}
.ck-details-con{
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
}
</style>
