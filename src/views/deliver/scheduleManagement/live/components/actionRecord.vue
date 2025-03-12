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
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="footer" />
      <template slot="userPhone" slot-scope="{ row }">
        <tablePhoneItem
          v-model="row.userPhone"
          :row-data="{ userId: row.userId }"
          :phone-area-code="row.phoneAreaCode"
          type="userId"
        />
      </template>
      <template slot="email" slot-scope="{ row }">
        <tableEmailItem
          v-model="row.email"
          :row-data="{ userId: row.userId }"
          type="user"
        />
      </template>
    </MPageLayout>
  </div>
</template>

<script>
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
import { getAuditlog } from '@/api/deliver/scheduleManagement'
export default {
  components: {
    tablePhoneItem,
    tableEmailItem
  },
  props: {
    scheduleId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      slotArr: ['footer', 'userPhone', 'email'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'changes', label: '操作内容', type: 'text' },
          { prop: 'userName', label: '操作人', type: 'text' },
          { prop: 'createdAt', label: '操作时间', type: 'text', width: 140 }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false
    }
  },
  mounted() {
    this.init()
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
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        current: this.config.currentPage,
        scheduleId: this.scheduleId,
        size: this.config.pageSize
      }
      getAuditlog(params)
        .then(res => {
          console.log(res)
          this.loading = false
          this.config.tableData = res.data.records
          this.config.total = Number(res.data.total)
        })
        .catch(() => {
          this.loading = false
        })
    },
    init() {
      this.config.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.studentRecord {
  padding: 0 20px;
  height: 100%;
}
::v-deep {
  .tablePage .page_content {
    padding-bottom: 0px !important;
  }
  .tablePage .page_footer {
    padding: 17px 0 !important;
  }
}
</style>
