<template>
  <div v-loading="loading" class="goodsClickLog">
    <div class="goodsClickLogTitle">商品点击<i class="el-icon-close fr pointer" @click="close" /></div>
    <div class="myTable">
      <el-table style="widht: 566px" :data="list" :header-cell-style="{ background: '#F3F3F3' }" max-height="300px">
        <el-table-column prop="goodsName" label="商品名称" />
        <el-table-column prop="goodsPrice" label="商品原价" align="center">
          <template slot-scope="{ row }">
            {{ row.goodsPrice | filtersMoneyByZero }}
          </template>
        </el-table-column>
        <el-table-column prop="operateTime" label="点击时间" align="center">
          <template slot-scope="{ row }">
            {{ row.operateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { queryGoodsInfoClickCount } from '@/api/liveRoom/index.js'
export default {
  components: {},
  filters: {
    filterformLabel(val) {
      if (!val) { return 0 + '分钟' }
      if (val < 60000) {
        return Math.floor(val / 1000) + '秒'
      }
      return Math.floor(val / 1000 / 60) + '分钟'
    },
    filterliveStartTime(val) {
      if (!val) { return '' }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    return {
      loading: false,
      liveRoomId: '',
      studentId: '',
      list: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getDetail()
    })
  },
  methods: {
    close() {
      document.body.click()
    },
    getDetail() {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        studentId: this.studentId
      }
      queryGoodsInfoClickCount(data).then(res => {
        console.log(res)
        this.list = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.goodsClickLog {
  width: 600px;
  background: #FFFFFF;
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.2);
  border-radius: 10px;
  .goodsClickLogTitle {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    border-bottom: 1px solid #E7E7E7;
    height: 64px;
    line-height: 64px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .myTable {
    padding: 20px;
  }
}
</style>
