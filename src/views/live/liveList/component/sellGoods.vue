<template>
  <!-- 直播带货 -->
  <div class="sellGooods">
    <div class="sellGoodsTitle">
      <div class="sellGoodsTitleText m-r-10">
        带货商品（{{ total }}）
        <span style="color: #F53F3F">注：你可以拖动以下商品进行排序操作</span>
      </div>
      <el-button icon="el-icon-plus" type="primary" size="small" @click="selectGoods">添加商品</el-button>
    </div>
    <div v-loading="loading" class="sellGoodsContent">
      <div v-for="(item, index) in list" :key="`liveList_sellGoodsContent_${index}`" v-dragging="{ item: item, list: list, group: group }" class="goodsList" :model="item">
        <div class="goodsSort">
          {{ item.sort }}
        </div>
        <img class="m-r-10" style="width:100px; height: 75px;border-radius: 4px;background: #F5F7FA;object-fit: contain;" :src="item.goodsImg" />
        <div class="goodsDetail">
          <div class="goodsName text_hidden_1">{{ item.goodsName }}<el-tag v-if="item.goodsSpecName" size="small">{{ item.goodsSpecName }}</el-tag></div>
          <div class="sellTime">
            <svg-icon class-name="size-icon" icon-class="time_grey" />
            <span class="sellTimeText">添加时间：</span>
            <span>{{ item.shelfTime | filterTime }}</span>
          </div>
          <div class="goodsPrice">
            <el-tag v-if="item.goodsType === 5" size="small">线下课</el-tag>
            <template v-else>
              <unitPrice :price="item.goodsPromotionPrice" />
            </template>
          </div>
        </div>
        <div class="goodsBtn">
          <el-button type="text" :style="{color: item.shelfStatus === 0 ? 'red' : 'rgb(12, 111, 255)'}" @click="editShelfStatus(item)">{{ {1: '添加', 0: '移出购物列表'}[item.shelfStatus] }}</el-button>
          <el-button type="text" style="color: red" @click="onhandleRemove(item)">删除商品</el-button>
          <el-button v-share="`pages/courseDetails/${item.goodsType ===8?'live':'online'}/index?id=${item.goodsId}&shopId=${organizationId}&liveId=${detail.liveRoomId}&shareUser=${shareUser}&active=1`" type="text" class="share-link">分享链接</el-button>
        </div>
      </div>

      <div v-if="list.length === 0" class="noData">
        <img src="~@/assets/image/noGoosCell.png" alt="" />
        <div class="noDataText">暂无添加商品</div>
      </div>

      <div v-if="list.length !== 0" class="footer">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getItem } from '@/utils/localStorage'
import { getGoodsPage, editShelfStatus, addLiveRoomGoods, editSortGoods, removeLiveRoomGoods } from '@/api/liveRoom/index'
import moment from 'moment'
import unitPrice from './price.vue'
export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: { unitPrice },
  props: {
    detail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      btnLoading: false,
      draged: {},
      to: {},
      group: ''
    }
  },
  computed: {
    organizationId() {
      return getItem('orgInfo').organizationId
    },
    shareUser() {
      return getItem('UserInfo').userId
    }
  },
  mounted() {
    this.getList()
    const _this = this
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', (res) => {
      console.log('拖动', res)
      if (this.group !== res.value.group) {
        return
      }
      _this.draged = res.draged
      this.to = res.to
    })
    this.$dragging.$on('dragend', (res) => {
      console.log(res, '拖动结束')
      if (this.group !== res.group) {
        return
      }
      if (this.list.length === 1) {
        return
      }
      const params = {
        id: _this.draged.id,
        newSort: _this.to.sort,
        oldSort: _this.draged.sort
      }
      editSortGoods(params).then(res => {
        this.getList()
      }).catch(() => {
        this.getList()
      })
    })
  },
  created() {
    this.group = this.getUuiD(8)
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        liveRoomId: this.$route.params.id,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
        // shelfStatus: 0
      }
      getGoodsPage(params).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    selectGoods() {
      // 做禁选
      this.btnLoading = true
      const params = {
        liveRoomId: this.$route.params.id,
        pageIndex: this.pageIndex,
        pageSize: 1000
        // shelfStatus: 0
      }
      getGoodsPage(params).then(res => {
        const check = res.data.items.reduce((pre, next) => {
          pre.push(next.goodsId)
          return pre
        }, [])
        this.$SelectGoods({
          visible: true,
          multiple: true,
          check,
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
            console.log(row, 'row')
            if (row.specId) {
              const obj = res.data.items.find(v => { return (v.goodsSpecId === row.specId && v.goodsId === row.goodsId) })
              return Boolean(obj)
            }
            return row.saleType === 0
          },
          currentId: '3',
          success: (res) => {
            console.log(res, 'res')
            this.loading = true
            const goodsInfoRequestList = res.reduce((pre, next) => {
              let goodsPrice = 0
              let goodsSpecPrice
              if (next.goodsType === 5 && next.onlineList.length > 0) {
                goodsPrice = 0
                // 线下课价格
                const onlineListPrice = next?.onlineList.map(item => item.salePrice).sort((a, b) => a - b)
                onlineListPrice.length === 1 ? goodsSpecPrice = `${onlineListPrice[0]}` : goodsSpecPrice = `${onlineListPrice[0]},${onlineListPrice[onlineListPrice.length - 1]}`
              } else if (next.goodsType !== 5) {
                goodsPrice = next.salePrice
              }
              pre.push({
                goodsId: next.goodsId,
                goodsImg: next.coverUrl || next.contentUrl,
                goodsName: next.contentName || next.goodsName,
                goodsPrice: goodsPrice,
                goodsPromotionPrice: goodsPrice,
                goodsSpecId: next.specId || '',
                goodsType: next.goodsType || 5,
                goodsSpecPrice
              })
              return pre
            }, [])
            const data = {
              liveRoomId: this.$route.params.id,
              goodsInfoRequestList
            }
            console.log(data)
            addLiveRoomGoods(data).then(res => {
              this.loading = false
              this.getList()
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 商品上移出购物列表
    editShelfStatus(item) {
      this.$delModal({
        tips: `是否确认${item.shelfStatus === 0 ? '移出购物列表' : '添加'}`,
        success: () => {
          this.loading = true
          const params = {
            id: item.id,
            shelfStatus: item.shelfStatus === 0 ? 1 : 0
          }
          editShelfStatus(params).then(res => {
            console.log(res)
            this.loading = false
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
    },
    // 点击移除商品
    onhandleRemove(item) {
      this.$delModal({
        tips: `是否确认移除该商品`,
        success: () => {
          this.loading = true
          const params = {
            id: item.id
          }
          removeLiveRoomGoods(params).then(res => {
            this.loading = false
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.sellGooods {
  .sellGoodsTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 80px;
    .sellGoodsTitleText {
      // margin-left: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      .tips {
        margin-left: 8px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #F53F3F;
      }
    }
  }
  .sellGoodsContent {
    margin-top: 20px;
    margin-left: 85px;
    .goodsList {
      padding: 40px 20px 20px;
      display: flex;
      align-items: center;
      cursor: move;
      border-bottom: 1px solid #F5F5F5;
      border-left: 1px solid #F5F5F5;
      border-right: 1px solid #F5F5F5;
      &:hover {
        background: #E7F0FF;
        border-radius: 4px;
      }
      .goodsSort {
        width: 60px;
        text-align: center;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
      .goodsDetail {
        flex: 1 0 0;
        height: 75px;
        // display: flex;
        .goodsName {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 22px;
        }
        .sellTime {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333;
          line-height: 20px;
          margin: 5px 0;
          .sellTimeText {
            color: #666;
            margin: 0 2px;
          }
        }
        .goodsPrice {
          display: flex;
          align-items: flex-end;
          .crossedPrice{
            margin-left: 10px;
            text-decoration:line-through;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 17px;
          }
        }
      }
      .goodsBtn {
        width: 100px;
        ::v-deep button{
          padding: 5px 0;
        }
      }
      &:nth-child(1) {
        border-top: 1px solid #F5F5F5;
      }
    }
    // .goodsList + .goodsList {
    //   border-top: 1px solid #F5F5F5;
    // }
    .footer {
      height: 68px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .noData {
      margin-top: 89px;
      margin-bottom: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      > img {
        width: 386px;
        height: 222px;
      }
      .noDataText {
        margin-top: 16px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
      }
    }
  }
}
</style>
