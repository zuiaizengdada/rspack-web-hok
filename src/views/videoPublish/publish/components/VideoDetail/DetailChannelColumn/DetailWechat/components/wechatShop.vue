<template>
  <div v-if="hasShopCart == 1">
    <div class="goodsName">商品</div>
    <div class="goodsInput" @click="showGoodsPopup">
      {{ input }}
      <img v-if="input!=''" :src="close" class="clearGoods" @click.stop="deleteGoods" />
    </div>
    <WechatGoods
      :goods-list="goodsList"
      :visible="goodsFlag"
      @close="goodsFlag = false"
      @succese="addGoods"
    />
    <p v-if="activeAccountFail" class="error-tips">
      账号已失效，重新登录后可获取
    </p>
  </div>
</template>

<script>
import close from '@/assets/svg/videoManga/close_icon.svg'
import WechatGoods from './WechatGoods'
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import { isUseNewClient } from '@/utils'

export default {
  name: 'WechatShop',
  components: {
    WechatGoods
  },
  mixins: [mixinsAllOperations],
  data() {
    return {
      input: '',
      goodsFlag: false,
      selectId: 0,
      hasShopCart: 1,
      goodsList: [],
      close
    }
  },
  methods: {
    async initData() {
      this.input =
        this.publishChannelData.activeData?.shoppingGoods?.yixiaoerName || ''
      this.selectId =
        this.publishChannelData.activeData?.shoppingGoods?.yixiaoerId || ''
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        // 是否有购物车
        const params1 = {
          platformId: this.channel.id,
          newVersion: this.allChannelSwitch[this.channel.id],
          platformAccountCookie:
            this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          platformAccountId:
            this.publishChannelData.activeData.account.platformAccountId,
          mediaTypeEnum: 'Article'
        }
        isUseNewClient(this.channel.id, 'get-account-privillege', this.publishChannelData.activeData.account.platformAccountId, '获取账号高权益').emit('get-account-privillege', JSON.stringify(params1), response => {
          const result = JSON.parse(response)
          if (result.messageType === '0') {
            this.hasShopCart = result?.dataBody?.hasShopCart || 0
          }
        }
        )

        // const params = {
        //   platformId: this.channel.id,
        //   platformAccountCookie: this.publishChannelData.activeData.account.cookie,
        //   platformAccountToken: this.merchantToken,
        //   platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
        //   mediaTypeEnum: 'hVideo',
        //   dataType: 6, // 5小程序、6商品
        //   keyWord: '' // 小程序链接或者商品链接 必填
        // }
        // window.videoPublishSocket.emit('get-minAppOrGoods', JSON.stringify(params), response => {
        //   const data = JSON.parse(response)
        //   this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'get-minAppOrGoods', 'remark': '购物车/小程序' })
        //   console.log(data, '商品')
        //   this.goodsList = data.dataBody
        // })
      }
    },
    // 删除商品
    deleteGoods() {
      this.updataPublishActiveData(
        this.publishChannelData.activeData.account.accountId,
        'shoppingGoods',
        []
      )
      this.input = ''
      this.selectId = 0
    },
    showGoodsPopup() {
      this.goodsFlag = true
    },
    // 添加商品
    addGoods(e) {
      // 选中的商品
      this.input = e.yixiaoerName
      this.updataPublishActiveData(
        this.publishChannelData.activeData.account.accountId,
        'shoppingGoods',
        e
      )
      this.selectId = e.yixiaoerId
      this.goodsFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
.goodsName {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
}
.goodsInput {
  margin-top: 12px;
  width: 100%;
  height: 32px;
  line-height: 32px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  padding: 0 8px;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  .clearGoods {
    position: absolute;
    right: 8px;
    top: 8px;
  }
}

.error-tips {
  color: #f53f3f;
  font-size: 14px;
  line-height: 24px;
  padding-top: 4px;
  span {
    color: #0c6fff;
    padding: 0 2px;
    cursor: pointer;
  }
}
</style>
