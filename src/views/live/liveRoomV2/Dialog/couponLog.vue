<template>
  <div v-loading="loading" class="couponLog" @click.stop>
    <div class="couponLogTitle">优惠券<i class="el-icon-close fr pointer" @click="close" /></div>
    <div class="myTable">
      <el-table style="width: 566px" :data="list" :header-cell-style="{ background: '#F3F3F3' }" max-height="300px">
        <el-table-column prop="couponNo" label="优惠券ID" />
        <el-table-column prop="couponName" label="券名称" />
        <el-table-column prop="createTime" label="领取时间" align="center">
          <template slot-scope="{ row }">
            {{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { queryCouponRecords } from '@/api/liveRoom/index.js'
export default {
  components: {},
  data() {
    return {
      loading: false,
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
      console.log('获取优惠券领取记录', this.liveRoomId, this.studentId)
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        studentId: this.studentId
      }
      queryCouponRecords(data).then(res => {
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
.couponLog {
  width: 600px;
  background: #FFFFFF;
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.2);
  border-radius: 10px;
  .couponLogTitle {
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
