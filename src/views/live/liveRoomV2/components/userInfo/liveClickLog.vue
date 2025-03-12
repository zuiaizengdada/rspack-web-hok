<template>
  <div class="liveClickLog">
    <div class="liveClickLogTitle">
      <MTitle>本场商品点击（{{ total }}次）</MTitle>
    </div>
    <el-table
      :data="tableData"
      max-height="400px"
      style="
        width: 100%;
        margin-top: 14px;
        border-radius: 5px;
        overflow: hidden;
      "
      :header-cell-style="{ background: '#F7F7F7' }"
      border
    >
      <el-table-column prop="goodsName" label="商品名称" />
      <el-table-column
        prop="goodsPrice"
        label="商品原价"
        width="129"
        align="center"
      >
        <template slot-scope="{ row }">
          ￥{{ row.goodsPrice | filtersMoneyByZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="operateTime"
        label="点击时间"
        width="165"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.operateTime | renderTime }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="liveClickLogpage"
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
import moment from 'moment'
import { liveQueryGoodsInfoClickCount } from '@/api/liveRoom/liveRoom.js'
export default {
  filters: {
    renderTime(val) {
      if (!val) {
        return '--'
      }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
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
    this.currentPage = 1
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
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        studentId: this.userId
      }
      liveQueryGoodsInfoClickCount(data)
        .then(res => {
          console.log('获取本场商品点击记录', res)
          this.tableData = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.liveClickLog {
  padding-right: 15px;
}
.liveClickLogpage {
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
::v-deep .liveClickLogTitle {
  .MTitle .line {
    height: 12px;
    width: 2px;
    margin-right: 5px;
  }
}
</style>
