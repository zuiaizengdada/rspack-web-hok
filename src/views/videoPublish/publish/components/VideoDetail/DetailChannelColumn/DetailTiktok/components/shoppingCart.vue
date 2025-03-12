<template>
  <div v-if="hasShopCart == 1" class="shopContent">
    <div v-if="isShowTitle" class="addShopCart">添加购物车</div>
    <div>
      <el-input v-model="input2" placeholder="这里是商品的链接地址">
        <div slot="suffix" class="addLink" @click="addCommodity">添加链接</div>
      </el-input>
      <p v-if="errMsg" class="errMsg">{{ errMsg }}</p>
    </div>
    <div v-if="commodityList != ''" class="commodityList">
      <div class="commodityFont">已添加商品：</div>
      <div class="goodsList">
        <div
          v-for="(item, index) in commodityList"
          :key="index"
          class="commodityDetails fl"
        >
          <div class="">
            <img :src="item.image[0]" class="goodsImg" />
          </div>
          <div class="goodsContent">
            <div>
              <div class="goodsTit">
                <span class="goodsSales">小店</span>
                <span class="goodsName">{{ item.name }}</span>
              </div>
              <div class="goodsSlug">短标题：{{ item.shortTitle }}</div>
            </div>
            <div>
              <div class="goodsBottom">
                <span class="goodsPrice">
                  <span>每单赚<span class="priceTips">￥</span><span class="price1">{{ item.bonus }}</span></span>
                  <span
                    style="margin-left: 10px"
                  >售价<span class="priceTips1">￥</span><span class="price2">{{ item.price }}</span></span>
                </span>
                <span>
                  <span class="goodsEdit" @click="editGoods(item)">编辑</span>
                  <span class="goodsDelete" @click="deleteGoods(index)">移除</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="activeAccountFail" class="error-tips">账号已失效，重新登录后可获取</p>
    <addCommodity
      :visible="showACflag"
      :title="title"
      :goods-list="goodsList"
      @close="showACflag = false"
      @succese="succeseAddGoods"
    />
  </div>
</template>

<script>
import addCommodity from './addCommodity'
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import { isUseNewClient, isNewClient } from '@/utils'
export default {
  name: 'ShoppingCart',
  components: {
    addCommodity
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
      input2: '',
      // https://haohuo.jinritemai.com/ecommerce/trade/detail/index.html?id=3590638389155769010&origin_type=604
      commodityList: [],
      goodsList: [],
      errMsg: '',
      imgSrc: '',
      hasShopCart: 1, // 是否有购物车
      title: '添加商品',
      showACflag: false
    }
  },
  methods: {
    initData() {
      this.commodityList = this.publishChannelData.activeData?.shoppingCarGoodList || []
      // 兼容历史数据
      if (this.commodityList.length > 0 && this.commodityList[0].id) {
        this.commodityList.forEach(item => {
          item.id = item.yixiaoerId || item.id
          item.name = item.yixiaoerName || item.name
          item.price = item.yixiaoerPrice || item.price
          item.image = item.yixiaoerImage || item.image
          item.bonus = item.yixiaoerBonuns || item.bonus
        })
      }
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
          this.hasShopCart = result?.dataBody?.hasShopCart || 0
        })
      }
    },
    // 编辑商品
    editGoods(item) {
      this.goodsList = [item]
      this.title = '编辑商品'
      this.showACflag = true
    },
    succeseAddGoods(e) {
      if (this.commodityList.length < 1) this.commodityList.push(e)
      this.commodityList.forEach(item => {
        if (!item.id || item.id !== e.id) {
          this.commodityList.push(e)
        }
      })
      this.showACflag = false
      console.log(this.commodityList, '添加商品')
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'shoppingCarGoodList', this.commodityList)
    },
    // 删除商品
    deleteGoods(index) {
      this.commodityList.splice(index, 1)
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'shoppingCarGoodList', this.commodityList)
    },
    addCommodity() {
      if (this.input2 === '') {
        this.errMsg = '请输入商品链接'
        return
      }
      const params = {
        platformId: this.channel.id,
        platformAccountCookie:
          this.publishChannelData.activeData.account.cookie,
        platformAccountToken: this.merchantToken,
        newVersion: this.allChannelSwitch[this.channel.id],
        platformAccountId:
          this.publishChannelData.activeData.account.platformAccountId,
        mediaTypeEnum: 'hVideo',
        dataType: 6, // 5小程序、6商品
        keyWord: this.input2 // 小程序链接或者商品链接 必填
      }
      isUseNewClient(this.channel.id, 'get-account-privillege', this.publishChannelData.activeData.account.platformAccountId, '获取账号高权益').emit('get-account-privillege', JSON.stringify(params), response => {
        const result = JSON.parse(response)
        console.log('账号权益', result)
      })
      console.log(params, '购物测')
      isUseNewClient(this.channel.id, 'get-minAppOrGoods', this.publishChannelData.activeData.account.platformAccountId, '购物车/小程序').emit(
        'get-minAppOrGoods',
        JSON.stringify(params),
        rs => {
          const result = JSON.parse(rs)
          console.log(result, '购物车原始数据')
          if (result.messageType === '0') {
            // this.goodsList = result.dataBody
            const arr = []
            result.dataBody.forEach(item => {
              if (isNewClient(this.channel.id)) {
                arr.push({
                  id: item.hokId,
                  name: item.hokName,
                  price: item.hokPrice,
                  image: item.hokImage,
                  bonus: item.hokBonus,
                  shortTitle: item.shortTitle,
                  platImage: item.platImage,
                  rawData: item.rawData
                })
              } else {
                const obj = {
                  id: item.yixiaoerId,
                  name: item.yixiaoerName,
                  price: item.yixiaoerPrice,
                  image: item.yixiaoerImage,
                  bonus: item.yixiaoerBonuns,
                  shortTitle: item.shortTitle,
                  platImage: item.platImage,
                  rawData: item.rawData
                }
                arr.push({ ...item, ...obj })
              }
            })
            this.goodsList = arr
            console.log(this.showACflag, '添加商品弹窗')
            this.errMsg = ''
            this.showACflag = true
          } else {
            const errMsg = result.errorInfo || result.message
            this.errMsg = errMsg
            console.log(this.errMsg)
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  padding-right: 70px;
}
.goodsList {
  display: flex;
  flex-direction: column;
}
.shopContent {
  display: flex;
  flex-direction: column;
  .goodsImg {
    width: 100px;
    height: 100px;
  }
  .errMsg{
    color:#f53f3f;
    font-size:14px;
    line-height: 24px;
    padding-top:4px;
  }
  .addShopCart {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    margin-bottom: 12px;
  }
  .addLink {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0c6fff;
    cursor: pointer;
    height: 100%;
    line-height: 36px;
    margin-right: 4px;
  }
  .commodityList {
    display: flex;
    align-items: flex-start;
    margin-top: 12px;
    .commodityFont {
      width: 84px;
      height: 24px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
    }
    .commodityDetails {
      width: 474px;
      background: #fafafa;
      border-radius: 4px;
      padding: 10px;
      box-sizing: border-box;
      .goodsContent {
        margin-left: 10px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .goodsBottom {
          display: flex;
          justify-content: space-between;
          .goodsEdit,
          .goodsDelete {
            background: #ffffff;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 400;
            padding: 4px 10px;
            box-sizing: border-box;
            font-family: PingFangSC-Regular, PingFang SC;
            cursor: pointer;
          }
          .goodsEdit {
            border: 1px solid #0c6fff;
            color: #0c6fff;
          }
          .goodsDelete {
            border: 1px solid #f53f3f;
            color: #f53f3f;
            margin-left: 10px;
          }
        }
        .goodsPrice {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          .priceTips1 {
            font-size: 12px;
            font-weight: 400;
            color: #333333;
          }
          .priceTips,
          .price1 {
            color: #f53f3f;
          }
          .price1,
          .price2 {
            font-size: 16px;
          }
        }
      }
      .goodsSlug {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
        margin-top: 8px;
      }
      .goodsTit {
        .goodsName {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
        .goodsSales {
          border-radius: 2px;
          border: 1px solid #0c6fff;
          padding: 2px 8px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #0c6fff;
        }
      }
    }
  }
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
