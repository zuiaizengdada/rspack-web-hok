<template>
  <div>
    <div class="entertainment">
      参与活动
    </div>
    <div class="entertainment-select">
      <el-select v-model="value" filterable placeholder="请输入活动关键词" style="width: 100%;height: 32px" @change="handlerChange">
        <el-option
          :key="0"
          :label="'不参与活动'"
          :value="0"
        />
        <el-option
          v-for="item in options"
          :key="item.yixiaoerId"
          :label="item.yixiaoerName"
          :value="item.yixiaoerId"
        />
      </el-select>
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
  data() {
    return {
      value: 0,
      options: []
    }
  },
  watch: {
    'channel.accountData': {
      handler(val) {
        this.initData()
      },
      deep: true
    }
  },
  methods: {
    async initData() {
      this.options = []
      this.value = 0
      console.log('活动1111')
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        const params = {
          platformId: this.channel.id,
          platformAccountCookie: this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          newVersion: this.allChannelSwitch[this.channel.id],
          platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
          mediaTypeEnum: 1, // 0 图文  1 视频
          keyword: this.value
        }
        console.log(params, '参加活动')
        isUseNewClient(this.channel.id, 'get-activity-list', this.publishChannelData.activeData.account.platformAccountId, '图文或视频可参入的活动').emit('get-activity-list', JSON.stringify(params), response => {
          const { dataBody } = JSON.parse(response)
          console.log(JSON.parse(response), '查询活动')
          dataBody.forEach((item) => {
            item.yixiaoerId = item.yixiaoerId || item.hokId
            item.yixiaoerName = item.yixiaoerName || item.hokName
          })
          this.options = dataBody
          if (dataBody) {
            this.value = this.publishChannelData.activeData?.isJoinActivity && this.publishChannelData.activeData?.isJoinActivity[0]?.yixiaoerId || ''
          }
        })
      }
    },
    handlerChange(e) {
      console.log(this.options, e, 111111111)
      if (this.options) {
        const list = this.options.filter((item) => {
          return (item.yixiaoerId) === e
        })
        this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'isJoinActivity', list)
      }
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
