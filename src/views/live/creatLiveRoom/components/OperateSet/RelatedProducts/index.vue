<template>
  <div class="container">
    <div class="flex items-center" style="margin-bottom:10px;">
      <el-button type="primary" size="mini" @click="handleClickAdd">选择</el-button>
      <!-- <p class="tips">注：你可以拖动以下商品进行排序操作</p> -->
    </div>
    <div v-show="relatedProductList.length" class="product-list">
      <div v-for="(item, index) in relatedProductList" :key="`liveList_sellGoodsContent_${index}`" v-dragging="{ item: item, list: relatedProductList, group: group }" class="flex items-center justify-between  product-item" :model="item">
        <div class="flex items-center">
          <el-image :src="item.coverVerticalUrl" class="image" />
          <div class="info">
            <p>{{ item.contentName }}</p>
            <span class="price">¥ {{ item.salePrice?formatPrice(item.salePrice):'免费' }}</span>
          </div>
        </div>
        <el-button type="danger" size="mini" @click="handleClickDelete(index)">删除</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getGoodsPage } from '@/api/liveRoom/index'
export default {
  data() {
    return {
      loading: false,
      relatedProductList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      btnLoading: false,
      draged: {},
      to: {},
      group: ''
    }
  },
  methods: {
    handleClickAdd() {
      // 做禁选
      this.btnLoading = true
      const params = {
        liveRoomId: '1',
        pageIndex: this.pageIndex,
        pageSize: 1000
        // shelfStatus: 0
      }
      getGoodsPage(params).then(_res => {
        // const check = res.data.items.reduce((pre, next) => {
        //   pre.push(next.goodsId)
        //   return pre
        // }, [])

        const check = []
        this.relatedProductList.forEach(item => {
          check.push(item.goodsId)
        })
        this.$SelectGoods({
          visible: true,
          multiple: true,
          goodsInfo: JSON.parse(JSON.stringify(this.relatedProductList)),
          // check,
          defaultValue: check,
          initSearch: {
            tagType: 5
          },
          tabList: [
            { id: '3', name: '普通专栏', api: '' },
            { id: '4', name: '大专栏', api: '' },
            { id: '5', name: '线下课', api: '' },
            { id: '7', name: '套餐课', api: '' },
            { id: '10', name: '直播课', api: '' }
          ],
          disabledFn: (row) => {
            // console.log(row, 'row')
            if (row.specId) {
              const obj = _res.data.items.find(v => { return (v.goodsSpecId === row.specId && v.goodsId === row.goodsId) })
              return Boolean(obj)
            }
            return row.saleType === 0
          },
          currentId: '3',
          success: (res) => {
            console.log(res, 'res')

            this.relatedProductList = JSON.parse(JSON.stringify(res))
            const _list = this.filterList()

            this.$emit('select', _list)
            // this.loading = true
            // const goodsInfoRequestList = res.reduce((pre, next) => {
            //   let goodsPrice = 0
            //   let goodsSpecPrice
            //   if (next.goodsType === 5 && next.onlineList.length > 0) {
            //     goodsPrice = 0
            //     // 线下课价格
            //     const onlineListPrice = next?.onlineList.map(item => item.salePrice).sort((a, b) => a - b)
            //     onlineListPrice.length === 1 ? goodsSpecPrice = `${onlineListPrice[0]}` : goodsSpecPrice = `${onlineListPrice[0]},${onlineListPrice[onlineListPrice.length - 1]}`
            //   } else if (next.goodsType !== 5) {
            //     goodsPrice = next.salePrice
            //   }
            //   pre.push({
            //     goodsId: next.goodsId,
            //     goodsImg: next.coverUrl || next.contentUrl,
            //     goodsName: next.contentName || next.goodsName,
            //     goodsPrice: goodsPrice,
            //     goodsPromotionPrice: goodsPrice,
            //     goodsSpecId: next.specId || '',
            //     goodsType: next.goodsType || 5,
            //     goodsSpecPrice
            //   })
            //   return pre
            // }, [])
            // const data = {
            //   liveRoomId: this.$route.params.id,
            //   goodsInfoRequestList
            // }
            // console.log(data)
            // addLiveRoomGoods(data).then(res => {
            //   this.loading = false
            //   this.getList()
            // }).catch(() => {
            //   this.loading = false
            // })
          }
        })
      }).catch(() => {
        this.loading = false
      })
    },
    handleClickDelete(index) {
      this.relatedProductList.splice(index, 1)
      const list = this.filterList()
      this.$emit('select', list)
    },
    filterList() {
      const _list = []
      this.relatedProductList.forEach(item => {
        _list.push({
          goodsId: item.goodsId,
          goodsImg: item.coverUrl,
          goodsName: item.contentName,
          goodsPromotionPrice: item.salePrice,
          goodsPrice: item.salePrice,
          goodsType: item.goodsType

        })
      })
      return _list
    },
    formatPrice(price) {
      const p = price / 100
      return p > 0 ? p.toFixed(2) : p
    }

  }
}
</script>
<style lang="scss" scoped>

.product-list{
  width:600px;
  border:1px solid rgba(231, 240, 255, 1);
  border-radius: 6px;

  .product-item{
    padding: 6px;
    border-bottom:1px solid rgba(231, 240, 255, 1);
    &:last-child{
      border-bottom:none;
    }
  }
  .image{
    width:54px;
    height:54px;
    margin-right:4px;
  }
  .info{
    p{
      font-size:14px;
      color:#333;
    }
    span{
      font-size:14px;
      color:#F53F3F
    }
  }
}
</style>
