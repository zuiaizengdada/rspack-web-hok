<template>
  <div class="detail-container">
    <detail-template type="tiktok" @delAccount="delAccount" @add="addAccount" @active="activeAccount">
      <div v-if="hasShopCart!=0 || hasMiniApp!=0" slot="detailSlot06" class="m-b-16">
        <el-radio-group v-model="tiktokLabel" @change="handleChange">
          <el-radio :label="1">添加地址</el-radio>
          <el-radio v-if="hasShopCart!=0" :label="2">添加购物车</el-radio>
          <el-radio v-if="hasMiniApp!=0" :label="3">添加小程序</el-radio>
        </el-radio-group>
      </div>
      <detail-address v-if="tiktokLabel == 1" slot="detailSlot06" :is-show-title="hasShopCart!=0&&hasShopCart!=0?false:true" class="mb-20" />
      <ShoppingCart v-if="tiktokLabel == 2" slot="detailSlot06" :is-show-title="false" />
      <MiniApp v-if="tiktokLabel == 3" slot="detailSlot06" :is-show-title="false" />
      <Hotspot slot="detailSlot06" />
      <Collection slot="detailSlot06" />
      <otherTerrace slot="detailSlot06" />
      <otherPreserve slot="detailSlot06" />
    </detail-template>
  </div>
</template>
<script>
import DetailTemplate from '../DetailTemplate/index.vue'
import Collection from './components/Collection.vue'
import Hotspot from './components/hotspot.vue'
import MiniApp from './components/miniApp.vue'
import ShoppingCart from './components/shoppingCart.vue'
import otherTerrace from './components/otherTerrace.vue'
import otherPreserve from './components/otherPreserve.vue'
import DetailAddress from '../DetailTemplate/DetailAddress.vue'
import { tiktokTemplateData } from '../constant'
import { isUseNewClient } from '@/utils'
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
export default {
  components: {
    DetailTemplate,
    Collection,
    Hotspot,
    ShoppingCart,
    otherTerrace,
    DetailAddress,
    MiniApp,
    otherPreserve
  },
  mixins: [mixinsAllOperations],
  inject: ['updatePublishChanelData', 'publishChannelData', 'updateActivePublishData', 'publishForm'],
  data() {
    return {
      tiktokLabel: 1,
      hasShopCart: 0,
      hasMiniApp: 0
    }
  },
  created() {
    // this.initData()
  },
  methods: {
    initData() {
      this.tiktokLabel = this.publishChannelData.activeData?.tiktokLabel || 1
      // 是否有购物车
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        const params = {
          platformId: this.channel.id,
          platformAccountCookie:
          this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          newVersion: this.allChannelSwitch[this.channel.id],
          platformAccountId:
          this.publishChannelData.activeData.account.platformAccountId,
          mediaTypeEnum: 'Article'
        }
        isUseNewClient(this.channel.id, 'get-account-privillege', this.publishChannelData.activeData.account.platformAccountId, '获取账号高权益').emit('get-account-privillege', JSON.stringify(params), response => {
          const result = JSON.parse(response)
          console.log(result, 'dy渠道获取账号高权益，是否有购物车')
          this.hasShopCart = result?.dataBody?.hasShopCart || 0
          this.hasMiniApp = result?.dataBody?.hasMiniApp || 0
        })
      }
    },
    handleChange(val) {
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'tiktokLabel', val)
    },
    // 添加账号
    addAccount(list) {
      console.log(this.publishForm, '添加账号list')
      const template = JSON.parse(JSON.stringify(tiktokTemplateData))
      const data = { ...template, ...this.publishForm }
      const _list = []
      list.forEach(item => {
        const copyData = JSON.parse(JSON.stringify(data))
        copyData.account = item
        _list.push(copyData)
      })
      this.updatePublishChanelData(_list)
    },
    // 删除账号
    delAccount() {

    },
    // 选中账号
    activeAccount(accountId) {
      this.updateActivePublishData(accountId)
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-container{
  height: 100%;
}
</style>
