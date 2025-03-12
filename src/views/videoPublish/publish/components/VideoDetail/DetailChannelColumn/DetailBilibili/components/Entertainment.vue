<template>
  <div>
    <slot name="kuaishouTit" class="mb-20" />
    <div class="entertainment-select">
      <el-select v-model="value" filterable placeholder="请选择参与的活动" style="width: 100%;height: 32px" @change="handleChangeOption">
        <el-option
          :key="0"
          :label="'不参与活动'"
          :value="0"
        />
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.nameValue"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="tips m-t-12">
      提示：请确保该账号还有参与活动的资格
    </div>
    <p v-if="activeAccountFail" class="error-tips">账号已失效，重新登录后可获取</p>
  </div>
</template>

<script>
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import { isUseNewClient } from '@/utils'

export default {
  name: 'Entertainment',
  mixins: [mixinsAllOperations],
  inject: ['updataPublishActiveData'],
  data() {
    return {
      value: '',
      options: []
    }
  },
  methods: {
    async initData() {
      this.options = []
      if (this.publishChannelData.activeData?.account?.platformAccountId) {
        const params = {
          platformId: this.channel.id,
          platformAccountCookie: this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          newVersion: this.allChannelSwitch[this.channel.id],
          platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
          mediaTypeEnum: 'MiniVideo' // 0 图文  1 视频
        }
        isUseNewClient(this.channel.id, 'get-activity-list', this.publishChannelData.activeData.account.platformAccountId, '图文或视频可参入的活动').emit('get-activity-list', JSON.stringify(params), response => {
          const { dataBody } = JSON.parse(response)
          console.log('活动列表', dataBody)
          this.options = dataBody
          const joinActivities = this.publishChannelData.activeData?.joinActivities || []
          console.log(joinActivities, '活动')
          this.value = joinActivities.length > 0 ? joinActivities[0].id : []
        })
      }
    },
    handleChangeOption(val) {
      console.log(val, '选择了活动')
      const arr = this.options.filter(e => e.id === val)
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'joinActivities', arr)
    }
  }
}
</script>

<style lang="scss" scoped>
.entertainment{
  font-size: 16px;
  font-weight: 400;
  color: #333333;
}
.entertainment-select{
  margin-top: 12px;
}
.tips{
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
}
.error-tips{
  color:#f53f3f;
  font-size:14px;
  line-height: 24px;
  padding-top:4px;
  span{
    color:#0C6FFF;
    padding:0 2px;
    cursor: pointer;
  }
}
</style>
