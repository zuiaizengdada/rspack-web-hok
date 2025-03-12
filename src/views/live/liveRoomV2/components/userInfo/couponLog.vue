<template>
  <div class="couponLog">
    <div class="couponLogTitle"><MTitle>本场领券记录（{{ total }}次）</MTitle></div>
    <el-table :data="tableData" max-height="400px" style="width: 100%;margin-top: 14px;border-radius: 5px;overflow: hidden;" :header-cell-style="{ background: '#F7F7F7' }" border>
      <el-table-column prop="couponName" label="优惠券名称" />
      <el-table-column prop="discountMethod" label="券类型" width="129" align="center">
        <template slot-scope="{ row }">
          {{ { 1: '满减券', 2: '直减券', 3: '折扣券' }[row.discountMethod] }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="领取时间" width="165" align="center">
        <template slot-scope="{ row }">
          {{ row.createTime | parseTime }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="couponLogpage"
      :current-page="currentPage"
      :pager-count="5"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total,prev,pager,next,jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { liveRoomCouponLog } from '@/api/liveRoom/liveRoom.js'
export default {
  components: {},
  props: {
    userId: {
      type: String,
      default: ''
    },
    liveRoomId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10
    }
  },
  mounted() {
    this.init()
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
      const data = {
        liveRoomId: this.liveRoomId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        studentId: this.userId
      }
      liveRoomCouponLog(data).then(res => {
        console.log('获取历史购买记录', res)
        this.tableData = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    init() {
      this.loading = true
      this.tableData = []
      this.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.couponLog {
  padding-right: 15px;
}
.couponLogpage {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
}
::v-deep {
  .el-table__header-wrapper {
    .has-gutter {
      .cell {
        font-size: 12px;
        color: #000000;
        font-weight: 400;
      }
    }
  }
  .el-table__row {
    .cell {
      font-size: 12px;
      color: #000000;
      font-weight: 400;
    }
  }
}
::v-deep .couponLogTitle {
  .MTitle .line {
    height: 12px;
    width: 2px;
    margin-right: 5px;
  }
}
</style>
