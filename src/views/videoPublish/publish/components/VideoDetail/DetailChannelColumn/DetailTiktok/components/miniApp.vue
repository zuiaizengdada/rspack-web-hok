<template>
  <div class="shopContent">
    <el-select
      v-model="value"
      style="width: 100%"
      filterable
      remote
      reserve-keyword
      clearable
      placeholder="请输入小程序链接"
      :remote-method="remoteMethod"
      :loading="loading"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="`${item.name}${item.rawData.summary?' • '+item.rawData.summary:''}`"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import { isUseNewClient, isNewClient } from '@/utils'

export default {
  name: 'MiniApp',
  mixins: [mixinsAllOperations],
  props: {
    isShowTitle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      options: [],
      value: ''
    }
  },
  methods: {
    initData() {
      // 是否有购物车
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        this.value = this.publishChannelData.activeData?.miniApp?.id || ''
        this.options = this.publishChannelData.activeData?.miniApp != null ? [this.publishChannelData.activeData?.miniApp] : []
        // 兼容历史数据
        if (this.options.length > 0 && (this.options[0].id || this.options[0].yixiaoerId)) {
          this.options.forEach(item => {
            item.id = item.yixiaoerId || item.id
            item.name = item.yixiaoerName || item.name
          })
        }
      }
    },
    remoteMethod(query) {
      // 是否有购物车
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        const params = {
          platformId: this.channel.id,
          platformAccountCookie: this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
          newVersion: this.allChannelSwitch[this.channel.id],
          mediaTypeEnum: 'MiniVideo', // Video横版、 MiniVideo竖版
          dataType: 5, // 5小程序 、6购物车
          keyWord: query // 小程序链接
        }
        isUseNewClient(this.channel.id, 'get-minAppOrGoods', this.publishChannelData.activeData.account.platformAccountId, '购物车/小程序').emit('get-minAppOrGoods', JSON.stringify(params), response => {
          const result = JSON.parse(response)
          const arr = []
          result.dataBody.forEach(item => {
            if (isNewClient(this.channel.id)) {
              const obj = {
                id: item.hokId,
                name: item.hokName
              }
              arr.push({ ...item, ...obj })
            } else {
              const obj = {
                id: item.yixiaoerId,
                name: item.yixiaoerName
              }
              arr.push({ ...item, ...obj })
            }
          })
          this.options = arr
          console.log('小程序', result)
        })
      }
    },
    // 选中了之后
    handleChange(val) {
      let arr = []
      arr = this.options.filter(item => item.id === val)
      if (arr.length > 0) {
        this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'miniApp', arr[0])
      } else {
        this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'miniApp', null)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
