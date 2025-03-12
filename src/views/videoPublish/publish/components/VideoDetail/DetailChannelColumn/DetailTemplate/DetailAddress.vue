<template>
  <div class="address-container">
    <template-title v-if="isShowTitle" title="添加地址" />
    <video-address :address-list="addressList" :address-id="addressId" @changeAddress="changeAddress" @changeList="changeList" />
    <p v-if="activeAccountFail" class="error-tips">账号已失效，重新登录后可获取</p>
  </div>
</template>
<script>
import VideoAddress from '../../../Common/Address.vue'
import TemplateTitle from './TemplateTitle.vue'
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import { isUseNewClient } from '@/utils'
export default {
  components: {
    TemplateTitle,
    VideoAddress
  },
  mixins: [mixinsAllOperations],
  props: {
    isShowTitle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      addressList: [],
      addressId: ''

    }
  },
  inject: ['alginLoginClient'],
  watch: {
    'channel.accountData': {
      handler(val) {
        this.initData()
      },
      deep: true
    }
  },
  methods: {
    changeAddress(e) {
      console.log(e, 88888888)
      const list = this.addressList.filter((item) => {
        return (item.poi_id) === e
      })
      this.addressId = e
      if (e === '') {
        this.initData()
      }
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'address', list)
    },
    async initData() {
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        this.addressList = []
        this.addressId = ''
        var data = {
          key: 'KSPBZ-V5L33-5EM3D-35N5X-DIY66-CRF7J' // 密钥
        }
        var url = 'https://apis.map.qq.com/ws/location/v1/ip' // 腾讯地理位置信息接口
        data.output = 'jsonp' // 解决跨域问题
        this.$jsonp(url, data).then((res) => {
          let queryName = `${res.result.ad_info.city}${res.result.ad_info.district}`
          // 默认进来有缓存过的地址用缓存地址查询
          if (this.publishChannelData.activeData?.address[0]?.poi_name) {
            queryName = this.publishChannelData.activeData?.address[0]?.poi_name
          }
          const params = {
            platformId: this.channel.id,
            platformAccountCookie: this.publishChannelData.activeData.account.cookie,
            platformAccountToken: this.merchantToken,
            newVersion: this.allChannelSwitch[this.channel.id],
            platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
            keyWord: queryName
          }
          console.log(params, '地址的列表')
          isUseNewClient(this.channel.id, 'get-position', this.publishChannelData.activeData.account.platformAccountId, '获取地理位置').emit('get-position', JSON.stringify(params), (response) => {
            const result = JSON.parse(response)
            console.log(result, '地址的列表yixiaoer')
            if (result.messageType === '0') {
              result.dataBody.forEach((item) => {
                if (!item.poi_id) {
                  item['poi_id'] = item.poiClassifyId
                }
                if (!item.poi_name) {
                  item['poi_name'] = item.poiName
                }
              })
              this.addressList = result.dataBody
            }
          })
          this.addressId = this.publishChannelData.activeData?.address[0]?.poi_id || ''
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    // 地址搜索
    changeList(keyword) {
      const params = {
        platformId: this.channel.id,
        platformAccountCookie: this.publishChannelData.activeData.account.cookie,
        platformAccountToken: this.merchantToken,
        platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
        newVersion: this.allChannelSwitch[this.channel.id],
        keyWord: keyword
      }
      console.log(params, '地址的列表')
      isUseNewClient(this.channel.id, 'get-position', this.publishChannelData.activeData.account.platformAccountId, '获取地理位置').emit('get-position', JSON.stringify(params), (response) => {
        const result = JSON.parse(response)
        console.log(result, '地址的列表yixiaoer')
        // this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'get-position', 'remark': '获取地理位置' })
        if (result.messageType === '0') {
          result.dataBody.forEach((item) => {
            if (!item.poi_id) {
              item['poi_id'] = item.poiClassifyId
            }
            if (!item.poi_name) {
              item['poi_name'] = item.poiName
            }
          })
          this.addressList = result.dataBody
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.error-tips{
  color:#f53f3f;
  font-size:14px;
  line-height: 24px;
  span{
    color:#0C6FFF;
    padding:0 2px;
    cursor: pointer;
  }
}
</style>
