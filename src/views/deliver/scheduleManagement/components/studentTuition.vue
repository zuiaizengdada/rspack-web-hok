<template>
  <div class="studentRecord">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      :pager-count="6"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="footer" />
      <template slot="amount" slot-scope="{ row }">
        ￥{{ row.amount | filtersMoneyByZero }}
      </template>
    </MPageLayout>
  </div>
</template>

<script>
import { getDeliveryStudentFeePage } from '@/api/deliver/studentManagement'
export default {
  components: {},
  props: {
    scheduleId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      slotArr: ['footer', 'amount', 'userPhone'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'userName', label: '学员姓名', type: 'text', align: 'center' },
          { prop: 'phone', label: '学员电话', type: 'text', align: 'center' },
          { prop: 'enrollmentUserName', label: '招生老师', type: 'text', align: 'center' },
          { prop: 'teachingAssistantName', label: '助教', type: 'text', align: 'center' },
          { prop: 'orderNo', label: '订单号', type: 'text', align: 'center' },
          { prop: 'payTimes', label: '支付时间', type: 'text', slotFn: (row) => row.payTimes && row.payTimes.join(','), align: 'center' },
          { prop: 'amount', label: '金额', type: 'slot', align: 'center' },
          { prop: 'orderTypeName', label: '订单类型', type: 'text', align: 'center' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 20
      },
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 获取列表分页数据
    getList() {
      console.log(this.scheduleId, 'this.scheduleId')
      this.loading = true
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        scheduleId: this.scheduleId
      }
      getDeliveryStudentFeePage(params).then(res => {
        this.loading = false
        this.config.tableData = res.data.records
        this.config.total = Number(res.data.total)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.studentRecord {
  height: 641px;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #E7E7E7;
  margin-bottom: 20px;
}
::v-deep {
  .tablePage  .page_header {
    height: 0px;
    min-height: 0px;
  }
  .page_content {
    padding-bottom: 0px!important;
  }
  .page_footer {
    padding: 17px 0!important;
  }
}
</style>
