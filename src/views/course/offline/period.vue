<template>
  <div class="period_page_wrap">
    <!-- 期数管理 -->
    <el-button type="primary" @click="openAddPeriod">添加班期</el-button>
    <el-table class="m-t-20" :data="tableData" style="width: 100%" border>
      <el-table-column prop="action" label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="clickEditPeriod(row)">编辑</el-button>
          <el-button type="text" @click="delPeriod(row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="scheduleNum" label="班期">
        <template slot-scope="{ row }">
          {{ row.scheduleNum }}
        </template>
      </el-table-column>
      <el-table-column prop="scheduleStatusName" label="班期状态">
        <template slot-scope="{ row }">
          {{ row.scheduleStatusName }}
        </template>
      </el-table-column>
      <el-table-column prop="deliveryStartTime" label="交付时间">
        <template slot-scope="{ row }">
          {{ row.deliveryStartTime | filterDate }} - {{ row.deliveryEndTime | filterDate }}
        </template>
      </el-table-column>
    </el-table>
    <div class="m-t-20 table_footer">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹框层 -->
    <addSchedule :config="addScheduleConfig" @success="successFn('addScheduleConfig')" />
    <editSchedule :config="editScheduleConfig" @success="successFn('editScheduleConfig')" />
  </div>
</template>

<script>
import { getSchedulePage } from '@/api/deliver/assistant'
import { delDeliverySchedule } from '@/api/deliver/scheduleManagement'
import addSchedule from './addSchedule.vue'
import editSchedule from './editSchedule.vue'
export default {
  components: {
    addSchedule,
    editSchedule
  },
  data() {
    return {
      tableData: [
        {}
      ],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      id: '',
      addScheduleConfig: {
        visible: false,
        goodsId: ''
      },
      editScheduleConfig: {
        visible: false,
        scheduleStatus: '',
        goodsId: '',
        scheduleId: ''
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getList()
  },
  mounted() {},
  methods: {
    // 点击添加期数弹框
    openAddPeriod() {
      this.addScheduleConfig = {
        visible: true,
        goodsId: this.id
      }
    },
    // 点击编辑期数弹框
    clickEditPeriod(row) {
      console.log(row)
      this.editScheduleConfig = {
        visible: true,
        scheduleStatus: row.scheduleStatus,
        scheduleId: row.id,
        goodsId: this.id
      }
    },
    // 获取期数列表
    getList() {
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        goodsId: this.id
      }
      this.loading = true
      getSchedulePage(params).then(res => {
        this.tableData = res.data.records
        this.total = Number(res.data.total)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    successFn(key) {
      this.$notify.success({ title: '提示', message: '操作成功' })
      this[key].visible = false
      this.getList()
    },
    // 点击删除按钮删除班期
    delPeriod(val) {
      this.$delModal({
        tips: '确定要删除？',
        success: () => {
          this.loading = true
          delDeliverySchedule(val.id).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.loading = false
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.periodDialog {
  padding: 20px;
}
.table_footer {
  display: flex;
  justify-content: flex-end;
}
</style>
