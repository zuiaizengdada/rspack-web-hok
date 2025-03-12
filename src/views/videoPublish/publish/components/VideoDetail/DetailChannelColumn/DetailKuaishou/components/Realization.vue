<template>
  <div v-if="hasShopCart">
    <slot name="kuaishouTit" class="mb-20" />
    <div>
      <el-radio-group v-model="radio" @change="changeRadio">
        <el-radio :label="0">不关联</el-radio>
        <el-radio :label="1">关联商品</el-radio>
      </el-radio-group>
      <div v-show="radio == 1" class="collectionSelect">
        <div class="goodsInput" @click="showGoodsPopup">
          {{ input }}
          <img v-if="input!=''" :src="close" class="clearGoods" @click="deleteGoods" />
        </div>
      </div>
      <WechatGoods :goods-list="goodsList" :visible="goodsFlag" :select-id="selectId" @close="goodsFlag = false" @succese="addGoods" />
    </div>
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
  name: 'Realization',
  components: {
    WechatGoods
  },
  mixins: [mixinsAllOperations],
  data() {
    return {
      radio: 0,
      input: '',
      value: '',
      goodsList: [],
      selectId: 0,
      hasShopCart: 1,
      goodsFlag: false,
      close
    }
  },
  inject: ['getMerchantToken', 'publishChannelData', 'channel'],
  computed: {
    merchantToken () {
      return this.getMerchantToken()
    }
  },
  watch: {
    'publishChannelData.activeData': {
      handler(newVal, oldVal) {

      }
    }
  },
  methods: {
    initData() {
      this.input = this.publishChannelData.activeData?.goodsRelevanceList?.yixiaoerName || ''
      this.selectId = this.publishChannelData.activeData?.goodsRelevanceList?.yixiaoerId || ''
      this.radio = this.publishChannelData.activeData?.isGoodsRelevance
      if (this.publishChannelData.activeData.account?.accountId) {
        // 是否有购物车
        const params1 = {
          platformId: this.channel.id,
          platformAccountCookie:
          this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          newVersion: this.allChannelSwitch[this.channel.id],
          platformAccountId:
          this.publishChannelData.activeData.account.platformAccountId,
          mediaTypeEnum: 'Article'
        }
        isUseNewClient(this.channel.id, 'get-account-privillege', this.publishChannelData.activeData.account.platformAccountId, '获取账号高权益').emit('get-account-privillege', JSON.stringify(params1), response => {
          const result = JSON.parse(response)
          this.hasShopCart = result?.dataBody?.hasShopCart || 0
          if (this.hasShopCart) {
            this.changeRadio(this.radio)
          }
        })
      }
    },
    // 删除商品
    deleteGoods() {
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'goodsRelevanceList', [])
      this.input = ''
      this.selectId = 0
    },
    // 添加商品
    addGoods(e) {
      // 选中的商品
      this.input = e.yixiaoerName
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'goodsRelevanceList', e)
      this.selectId = e.yixiaoerId
      this.goodsFlag = false
    },
    showGoodsPopup() {
      this.goodsFlag = true
    },
    changeRadio(e) {
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'isGoodsRelevance', e)
      // 选择了账号
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        const params = {
          platformId: this.channel.id,
          platformAccountCookie: this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
          newVersion: this.allChannelSwitch[this.channel.id],
          mediaTypeEnum: 'hVideo',
          dataType: 6, // 5小程序、6商品
          keyWord: '' // 小程序链接或者商品链接 必填
        }
        isUseNewClient(this.channel.id, 'get-minAppOrGoods', this.publishChannelData.activeData.account.platformAccountId, '购物车/小程序').emit('get-minAppOrGoods', JSON.stringify(params), response => {
          const data = JSON.parse(response)
          console.log(data, '商品')
          this.goodsList = data.dataBody
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goodsInput{
  margin-top: 12px;
  width: 100%;
  height: 32px;
  line-height: 32px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  padding:0 8px;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  .clearGoods{
    position: absolute;
    right: 8px;
    top: 8px;
  }
}
//  .el-select-dropdown__item{
//    height: 100px !important;
//    line-height: 100px !important;
//  }
//.selectList{
//  height: 48px !important;
//  line-height: 48px !important;
//}
.collectionSelect{
  margin-top: 12px;
}
.opt_box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  line-height: 100px;
  .goodsName,.goodsPrice{
    height: 50px;
    max-width: 420px;
    line-height: 50px;
  }
  .goodsName{
    width: 439px;
    font-size: 14px;
    font-weight: 400;
    //color: #333333;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .goodsPrice{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F53F3F;
  }
  img{
    width: 80px;
    height: 80px;
    border-radius: 4px;
    border: 1px solid #EDEEEE;
    margin-right: 10px;
  }
}
</style>
