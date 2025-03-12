<template>
  <div class="productRecord">
    <div class="myTable custom-table">
      <el-table v-loading="loading" height="100%" :data="list" :header-cell-style="{ background: '#EFF2F6', color: '#000' }" :cell-style="{ color: '#333' }">
        <el-table-column prop="goodsImg" width="100">
          <template slot-scope="{ row }">
            <ImagePreviewer :src="row.itemImageurl" fit="contain" class="videoImg" :preview-src-list="[row.itemImageurl]" />
          </template>
        </el-table-column>
        <el-table-column prop="itemName" label="名称" />
        <el-table-column prop="goodsPrice" label="商品价格" align="center">
          <template slot-scope="{ row }">￥{{ row.goodsPrice | filtersMoneyByZero }}</template>
        </el-table-column>
        <el-table-column prop="clickCount" label="点击次数" align="center" />
        <el-table-column prop="transactionsUserCount" label="成交人数" align="center" />
        <el-table-column prop="transactionsOrderCount" label="累计成交订单数" align="center" />
        <el-table-column prop="transactionsAmount" label="累计成交金额" align="center">
          <template slot-scope="{ row }">￥{{ row.transactionsAmount | filtersMoneyByZero }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" />
    <!-- <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
  </div>
</template>

<script>
import {
  getLiveRoomGoods
} from '@/api/liveRoom/liveRoom.js'
export default {
  components: {},
  data() {
    return {
      loading: false,
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getList()
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
      getLiveRoomGoods({
        liveRoomId: this.$route.params.id
      }).then(res => {
        console.log(res, '获取商品交易记录')
        this.list = res.data.goodsList
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.productRecord {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 15px 15px;
  .myTable {
    flex: 1 0 0;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid #F2F2F2;
  }
  // .pagination {
  //   height: 68px;
  //   min-height: 68px;
  //   max-height: 68px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: flex-end;
  // }
}
.videoImg {
  width: 70px;
  height: 70px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}
::v-deep {
  .hok-search-form {
    margin-bottom: 0;
  }
  .el-table::before {
    height: 0px;
  }
}
</style>
