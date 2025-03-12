<template>
  <AppDialog
    v-model="visible"
    title="选择商品"
    width="750px"
    :loading="withdrawPushGoodsLoading"
    height="auto"
    :top="top"
    :footer-text="['确定', '取消']"
    @success="sure"
  >
    <div class="sendGoods">
      <div class="filterTop">
        <div>
          <el-input v-model.trim="search.goodsName" size="small" class="w-200 m-r-10" placeholder="请输入商品名称" clearable @keyup.enter.native="searchFn" />
          <el-button type="primary" size="small" @click="searchFn">查询</el-button>
        </div>
        <el-button icon="el-icon-plus" type="primary" size="small" @click="selectGoods">上架商品</el-button>
      </div>
      <div class="myTable" :style="{height: chatType === 2 ? '298px' : '360px' }">
        <el-table v-loading="loading" :data="list" :height="chatType === 2 ? 250 : 312" @cell-click="cellClick">
          <el-table-column width="50">
            <template slot-scope="{ row }">
              <el-radio v-model="select" :label="row.goodsId"><span /></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称">
            <template slot-scope="{ row }">
              <div class="ImageViewer">
                <div class="imgUrl">
                  <ImagePreviewer style="width: 100%; height: 100%;" :src="row.goodsImg" fit="contain" :preview-src-list="[row.goodsImg]" />
                </div>
                <span class="m-l-10">
                  {{ row.goodsName }}
                  <el-tag v-if="row.goodsType === 5" size="small">线下课</el-tag>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsPromotionPrice" label="商品原价" width="130">
            <template slot-scope="{ row }">
              <template v-if="row.goodsType === 5">{{ row.goodsSpecPrice | filtersSpecPriceMoney }}</template>
              <template v-else>{{ row.goodsPromotionPrice | filtersMyMoney }}</template>
            </template>
          </el-table-column>
          <el-table-column v-if="chatType === 2" prop="showQuotaVal" label="商品展示名额">
            <template slot-scope="{ row }">
              <!-- <div class="showQuotaRadio-container">
                <div v-if="row.showQuotaRadio === -1" class="showQuotaRadio-item">
                  <span>不限名额，学员端不展示名额</span>
                </div>
                <div v-if="row.showQuotaRadio === 1" class="showQuotaRadio-itemcenter">
                  <span>限名额{{ row.showQuotaVal }}个</span>
                </div>
                <div v-if="row.showQuotaRadio === 0" class="showQuotaRadio-item">
                  <span>已抢光，学员端不能购买</span>
                </div>
              </div> -->
              <el-radio-group v-model="row.showQuotaRadio">
                <div class="showQuotaRadio-container">
                  <div class="showQuotaRadio-item">
                    <el-radio :label="-1">不限名额，学员端不展示名额</el-radio>
                  </div>
                  <div class="showQuotaRadio-itemcenter">
                    <el-radio :label="1">限名额&nbsp;
                      <el-input v-model="row.showQuotaVal" placeholder="最大输入999" style="width: 138px" size="small" @focus="() => { row.showQuotaRadio = 1}" @input="delShowQuotaNumber($event, row)">
                        <el-button slot="append" icon="el-icon-minus" size="mini" @click="() => { row.showQuotaRadio = 1, row.showQuotaVal > 1 && row.showQuotaVal--}" />
                      </el-input> &nbsp;个
                    </el-radio>
                  </div>
                  <div class="showQuotaRadio-item">
                    <el-radio :label="0">已抢光，学员端不能购买</el-radio>
                  </div>
                </div>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :pager-count="5"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getGoodsPage, withdrawPushGoods, addLiveRoomGoods } from '@/api/liveRoom/index'
import { filtersMoney } from '@/filters/index'

export default {
  filters: {
    filtersMyMoney: (res) => {
      if (!res) {
        return ''
      }
      return '￥' + filtersMoney(res)
    },
    // 线下课商品价格
    filtersSpecPriceMoney: (res) => {
      if (!res) {
        return ''
      }
      const list = res.split(',')
      if (list.length === 1) {
        return '￥' + filtersMoney(list[0])
      } else {
        return `￥${filtersMoney(list[0])}-￥${filtersMoney(list[1])}`
      }
    }
  },
  components: {
    AppDialog
  },
  data() {
    return {
      drag: true,
      visible: false,
      loading: false,
      sureLoading: false,
      withdrawPushGoodsLoading: false,
      top: '114px',
      search: { goodsName: '' },
      list: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
      chatType: 2,
      value: 1, // 选择停留时间
      liveRoomId: '',
      options: [
        // { label: '5秒', value: 5 },
        { label: '10秒', value: 10 },
        { label: '30秒', value: 30 },
        { label: '60秒', value: 60 },
        { label: '120秒', value: 120 },
        { label: '180秒', value: 180 }
      ],
      select: '',
      success: () => {}
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.$nextTick(() => {
          val && this.searchFn().then(() => {
            if (this.list.length > 0 && !this.select) {
              this.select = this.list[0].goodsId
            }
          })
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 561) / 2 + 'px'
  },
  methods: {
    // 限制只能输入英文和数字
    delNumber(e) {
      if (Number(e) < 1) {
        this.value = 1
        return
      }
      if (Number(e) > 180) {
        this.value = 180
        return
      }
      this.value = e.replace(/[^0-9]/g, '')
    },
    // 商品余额显示
    delShowQuotaNumber(e, row) {
      if (e === '') {
        row.showQuotaVal = ''
        return
      }
      if (Number(e) < 1) {
        row.showQuotaVal = 1
        return
      }
      if (Number(e) > 999) {
        row.showQuotaVal = 999
        return
      }
      row.showQuotaVal = e.replace(/[^0-9]/g, '')
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
    getList() {
      this.loading = true
      const params = {
        liveRoomId: this.liveRoomId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        goodsName: this.search.goodsName,
        shelfStatus: 0
      }
      return getGoodsPage(params).then(res => {
        // 重置为不限名额
        // res.data.items?.forEach((item) => { item.showQuotaRadio = -1; item.showQuotaVal = '' })
        // 群聊回显名额
        if (this.chatType === 2) {
          res.data?.items && this.handleShowQuotaVal(res.data.items)
        }
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchFn() {
      this.currentPage = 1
      return this.getList()
    },
    cellClick(row, column, cell, event) {
      this.select = row.goodsId
    },
    sure() {
      if (this.loading) {
        return
      }
      if (!this.select) {
        return this.$message.error('请选择商品')
      }
      console.log(this.select)
      const obj = this.list.find(v => v.goodsId === this.select)
      console.log(obj)
      if (obj) {
        this.success && this.success(obj)
      } else {
        return this.$message.error('获取商品详情失败')
      }
      this.visible = false
    },
    onhandleWithdraw() {
      this.$delModal({
        tips: '确定撤回正在推送的商品?',
        success: () => {
          this.withdrawPushGoodsLoading = true
          const data = {
            liveRoomId: this.liveRoomId
          }
          withdrawPushGoods(data).then(res => {
            this.$notify.success({
              title: '提示',
              message: '操作成功'
            })
            this.withdrawPushGoodsLoading = false
          }).catch(() => {
            this.withdrawPushGoodsLoading = false
          })
        }
      })
    },
    close() {
      this.visible = false
    },
    // 处理商品余额显示
    handleShowQuota() {
      const obj = this.list.find(v => v.goodsId === this.select)
      if (obj.showQuotaRadio === -1 || obj.showQuotaRadio === 0) {
        return obj.showQuotaRadio
      } else {
        return obj.showQuotaVal
      }
    },
    selectGoods() {
      // 做禁选
      const params = {
        liveRoomId: this.liveRoomId,
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
            { id: '5', name: '线下课', api: '' }
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
              liveRoomId: this.liveRoomId,
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
    // 处理商品余额回显
    handleShowQuotaVal(data) {
      data.forEach((item) => {
        if (item.showQuota === -1 || item.showQuota === 0) {
          item.showQuotaRadio = item.showQuota
          item.showQuotaVal = ''
        } else if (item.showQuota > 0) {
          item.showQuotaRadio = 1
          item.showQuotaVal = item.showQuota
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.sendGoods {
  height: 375px;
  padding: 20px 20px 12px;
  .filterTop {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    justify-content: space-between;
  }
  .myTable {
    width: 100%;
    height: 278px;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid #CBCFD3;
    overflow: hidden;
    .pagination {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: right;
    }
  }
  .sendGoodsFooter {
    padding: 20px 0;
    display: flex;
    align-items: center;
    .c_F53F3F {
      color: #F53F3F;
    }
    .sendGoodsFooterTxt {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      margin-right: 10px;
    }
  }
  .showQuotaRadio-itemcenter {
    padding: 8px 0;
  }
   .showQuotaRadio-itemcenter ::v-deep .el-input__inner {
    padding: 0 0 0 10px;
  }
  .showQuotaRadio-itemcenter ::v-deep .el-input__inner::placeholder {
    font-size: 12px;
  }
  .showQuotaRadio-item ::v-deep .el-radio__label, .showQuotaRadio-itemcenter ::v-deep .el-radio__label{
    font-size: 13px !important;
  }
}
.ImageViewer {
  display: flex;
  align-items: center;
  .imgUrl {
    background: #fafafa;
    width: 80px;
    height: 60px;
    max-width: 80px;
    min-width: 80px;
  }
}
</style>
