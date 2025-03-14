<template>
  <!-- 直播带货 -->
  <div v-loading="loading" class="commerce-wrapper">
    <el-row
      type="flex"
      justify="space-between"
      style="align-items: center; margin-bottom: 20px"
    >
      <div class="title-commerce">
        <span>带货商品({{ total }})</span>
        <el-tooltip
          class="item"
          effect="dark"
          content="注：你可以拖动以下商品进行排序操作"
          placement="right"
        >
          <img
            class="wenhao-icon"
            src="@/assets/image/smartSales/roomdetail/wenhao.png"
            alt=""
          />
        </el-tooltip>
      </div>
      <div>
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          @click="selectGoods"
        >
          添加商品
        </el-button>
      </div>
    </el-row>

    <div
      v-for="(item, index) in list"
      :key="`liveList_sellGoodsContent_${index}`"
      v-dragging="{ item: item, list: list, group: group }"
      type="flex"
      justify="space-between"
      class="cme-row"
    >
      <div class="info-col">
        <div class="sort">
          <span>{{ item.sort }}</span>
        </div>
        <div
          class="img-gs"
          :style="{
            'background-image': 'url(' + item.goodsImg + ')'
          }"
        />
        <div class="lb-col-cme">
          <div class="lb-col-cme-1">
            {{ item.goodsName
            }}<el-tag v-if="item.goodsSpecName" size="small">{{
              item.goodsSpecName
            }}</el-tag>
          </div>
          <div class="lb-col-cme-2">
            添加时间：{{ item.shelfTime | filterTime }}
          </div>
          <div class="lb-col-cme-3">
            <unitPrice :price="item.goodsPromotionPrice" />
          </div>
        </div>
      </div>

      <div class="bt-col">
        <el-button
          type="text"
          :style="{
            color: item.shelfStatus === 0 ? 'red' : 'rgb(12, 111, 255)'
          }"
          @click="editShelfStatus(item)"
        >
          {{ { 1: '添加', 0: '移出购物列表' }[item.shelfStatus] }}
        </el-button>
        <el-button type="text" style="color: red" @click="onhandleRemove(item)">
          删除商品
        </el-button>
        <!-- <el-button
          v-share="
            `pages/courseDetails/online/index?id=${item.goodsId}&shopId=${organizationId}&liveId=${detail.liveRoomId}&shareUser=${shareUser}&active=1`
          "
          type="text"
          class="share-link"
        >
          分享链接
        </el-button> -->
      </div>
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
    <div v-if="list.length === 0" class="noData">
      <img src="~@/assets/image/noGoosCell.png" alt="" />
      <div class="noDataText">暂无添加商品</div>
    </div>
  </div>
</template>

<script>
import { getItem } from '@/utils/localStorage'
import {
  getGoodsPage,
  editShelfStatus,
  addLiveRoomGoods,
  editSortGoods,
  removeLiveRoomGoods
} from '@/api/liveRoom/index'
import moment from 'moment'
import unitPrice from './price.vue'
import { getLiveRoomInfo } from '@/api/liveRoom/index'
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
      group: '',
      detail: {}
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
  created() {
    this.group = this.getUuiD(8)
    this.getDetail()
  },
  mounted() {
    this.getList()
    const _this = this
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', res => {
      console.log('拖动', res)
      if (this.group !== res.value.group) {
        return
      }
      _this.draged = res.draged
      this.to = res.to
    })
    this.$dragging.$on('dragend', res => {
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
      editSortGoods(params)
        .then(res => {
          this.getList()
        })
        .catch(() => {
          this.getList()
        })
    })
  },
  methods: {
    // 获取详情数据
    getDetail() {
      const params = {
        liveRoomId: this.$route.params.id
      }
      getLiveRoomInfo(params)
        .then(res => {
          this.detail = { ...res.data }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    onEnd() {
      console.log()
    },
    getList() {
      this.loading = true
      const params = {
        liveRoomId: this.$route.params.id,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
        // shelfStatus: 0
      }
      getGoodsPage(params)
        .then(res => {
          this.list = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
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
      getGoodsPage(params)
        .then(res => {
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
            disabledFn: row => {
              console.log(row, 'row')
              if (row.specId) {
                const obj = res.data.items.find(v => {
                  return (
                    v.goodsSpecId === row.specId && v.goodsId === row.goodsId
                  )
                })
                return Boolean(obj)
              }
              return row.saleType === 0
            },
            currentId: '3',
            success: res => {
              console.log(res, 'res')
              this.loading = true
              const goodsInfoRequestList = res.reduce((pre, next) => {
                let goodsPrice = 0
                let goodsSpecPrice
                if (next.goodsType === 5 && next.onlineList.length > 0) {
                  goodsPrice = 0
                  // 线下课价格
                  const onlineListPrice = next?.onlineList
                    .map(item => item.salePrice)
                    .sort((a, b) => a - b)
                  onlineListPrice.length === 1
                    ? (goodsSpecPrice = `${onlineListPrice[0]}`)
                    : (goodsSpecPrice = `${onlineListPrice[0]},${
                      onlineListPrice[onlineListPrice.length - 1]
                    }`)
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
              addLiveRoomGoods(data)
                .then(res => {
                  this.loading = false
                  this.getList()
                })
                .catch(() => {
                  this.loading = false
                })
            }
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    getUuiD(randomLength) {
      return (
        Number(
          Math.random().toString().substr(2, randomLength) + Date.now()
        ).toString(36) +
        Math.floor(Math.random() * 10) +
        1
      )
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
          editShelfStatus(params)
            .then(res => {
              console.log(res)
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
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
          removeLiveRoomGoods(params)
            .then(res => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.commerce-wrapper {
  position: relative;
  margin-top: 20px;
  .title-commerce {
    height: 15px;
    border-left: 2px solid #065cff;
    display: flex;
    align-items: center;
    span {
      color: #000;
      font-size: 15px;
      font-weight: 600;
      margin-left: 6px;
      margin-right: 8px;
      letter-spacing: 1px;
    }
    .wenhao-icon {
      width: 16px;
      height: 16px;
    }
  }
  .cme-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 24px;
    cursor: move;
    border-radius: 6px 6px 0px 0px;
    background: rgba(218, 233, 255, 0.3);
    .info-col {
      flex: 1;
      display: flex;
      align-items: center;
      .sort {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: #a8cbff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        span {
          color: #fff;
          font-size: 16px;
        }
      }
      .img-gs {
        width: 60px;
        height: 60px;
        margin-right: 20px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position:center;
        background-color: #EFF2F6;
      }
      .lb-col-cme {
        font-family: 'Microsoft YaHei';
        .lb-col-cme-1 {
          color: #000;
          font-size: 15px;
          font-weight: 600;
        }
        .lb-col-cme-2 {
          color: #333;
          font-size: 12px;
          font-weight: 400;
        }
        .lb-col-cme-3 {
          margin-top: 3px;
        }
      }
    }
  }

  .bt-col {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  .footer {
    height: 68px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .noData {
    margin-top: 50px;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    > img {
      width: 296px;
      height: 142px;
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
</style>
