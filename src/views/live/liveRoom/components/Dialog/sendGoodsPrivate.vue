<template>
  <AppDialog
    v-model="visible"
    title="推送商品"
    width="666px"
    :loading="loading"
    height="auto"
    :top="top"
    :drag="drag"
    :modal="false"
    @success="sure"
  >
    <div class="sendGoods">
      <div class="filterTop">
        <el-input v-model.trim="search.goodsName" size="small" class="w-200 m-r-10" placeholder="请输入商品名称" clearable @keyup.enter.native="searchFn" />
        <el-button type="primary" size="small" @click="searchFn">查询</el-button>
      </div>
      <div class="myTable">
        <el-table :data="list" height="230" @cell-click="cellClick">
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
          <el-table-column prop="goodsPrice" label="商品价格" width="130">
            <template slot-scope="{ row }">{{ row.goodsPrice | filtersMyMoney }}</template>
          </el-table-column>
          <el-table-column prop="goodsPromotionPrice" label="促销价格" width="130">
            <template slot-scope="{ row }">
              <template v-if="row.goodsType !== 5">
                ￥{{ row.goodsPromotionPrice | filtersMoney }}
              </template>
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
import { getGoodsPage } from '@/api/liveRoom/index'
import { filtersMoney } from '@/filters/index'
export default {
  filters: {
    filtersMyMoney: (res) => {
      if (!res) {
        return ''
      }
      return '￥' + filtersMoney(res)
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
      top: '114px',
      search: { goodsName: '' },
      list: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
      value: 5, // 选择停留时间
      liveRoomId: '',
      select: '',
      success: () => {}
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.select = ''
        val && this.searchFn()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 561) / 2 + 'px'
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
        liveRoomId: this.liveRoomId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        goodsName: this.search.goodsName,
        shelfStatus: 0
      }
      getGoodsPage(params).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    cellClick(row, column, cell, event) {
      this.select = row.goodsId
    },
    sure() {
      if (!this.select) {
        return this.$message.error('请选择商品')
      }
      console.log(this.value)
      // this.loading = true
      // const params = {
      //   goodsId: this.select,
      //   liveRoomId: this.liveRoomId,
      //   showTimeLength: this.value
      // }
      // pushGoodsEditInfo(params).then((res) => {
      //   console.log(res)
      //   this.loading = false
      //   this.success && this.success()
      // }).catch(() => {
      //   this.loading = false
      // })
    }
  }
}
</script>

<style lang='scss' scoped>
.sendGoods {
  height: 433px;
  padding: 20px 20px 12px;
  .filterTop {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
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
