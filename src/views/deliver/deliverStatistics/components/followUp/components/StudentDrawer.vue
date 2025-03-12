<template>
  <el-drawer
    title="学员列表"
    :visible="visible"
    size="800px"
    class="drawerBox"
    @close="handleClose"
  >
    <div v-loading="loading" class="tableBox">
      <!-- 跟进记录 -->
      <el-table :data="data" :header-cell-style="{ background: '#f5f5f5'}" height="300">
        <el-table-column prop="userName" label="学员名称" width="130" :show-overflow-tooltip="true" />
        <el-table-column prop="userPhone" label="学员电话" width="130" />
        <el-table-column prop="lecturerNameList" label="IP">
          <template slot-scope="{row}">
            {{ row.lecturerNameList&& row.lecturerNameList.join(',') }}
          </template>
        </el-table-column>
        <el-table-column prop="orderTypeName" label="订单类型" />
        <el-table-column prop="goodsName" label="课程名称" :show-overflow-tooltip="true" width="100" />
        <el-table-column prop="scheduleNum" label="班期" :show-overflow-tooltip="true" width="120" />
        <el-table-column prop="courseWorkStatus" label="作业状态">
          <template slot-scope="{ row }">
            {{ $getdictName('COURSE_WORK_STATUS',row.courseWorkStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="deliveryStatusName" label="交付状态" />
        <el-table-column prop="goodsTotalFee" label="课程金额(元)" width="110">
          <template slot-scope="{row}">
            {{ filtersMoneyByZero(row.goodsTotalFee) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="120" :show-overflow-tooltip="true" />
        <el-table-column prop="viewTime" label="累计观看时长" width="110">
          <template slot-scope="{row}">
            {{ (row.goodsType === 5 && !row.viewTime)?'': filterTime(row.viewTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="sessionCount" label="场次">
          <template slot-scope="{row}">
            {{ row.scheduleNum ? row.sessionCount : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="signedCount" label="已签到次数" width="110">
          <template slot-scope="{ row }">
            <span :class="row.signedCount&&row.signedCount > 0 ? 'a_link' : ''" @click="handleClickSignDetail(row)">
              {{ row.signedCount || 0 }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="channelSourceName" label="渠道来源" width="120" />
        <el-table-column prop="enrollmentUserName" label="招生老师" />
        <el-table-column prop="enrollmentDeptName" label="招生部门" width="110" :show-overflow-tooltip="true" />
        <el-table-column prop="headteacherUserName" label="班主任" />
        <el-table-column prop="assistantUserName" label="助教" width="120" :show-overflow-tooltip="true" />
        <el-table-column prop="largePFlag" label="来源大6P">
          <template slot-scope="{row}">
            {{ row.largePFlag === 1 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="balanceFee" label="订单余额(元)" width="110">
          <template slot-scope="{row}">
            {{ filtersMoneyByZero(row.balanceFee) }}
          </template>
        </el-table-column>
        <el-table-column prop="discountsFee" label="优惠金额(元)" width="110">
          <template slot-scope="{row}">
            {{ filtersMoneyByZero(row.discountsFee) }}
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="110" :show-overflow-tooltip="true" />

        <el-table-column prop="deliveryTime" label="交付日期" width="120" :show-overflow-tooltip="true" />
        <el-table-column prop="shiftStatusName" label="转课状态" />
        <el-table-column prop="orderCreateTime" label="订单创建时间" width="140" />
        <el-table-column prop="statusName" label="跟进状态" />
        <el-table-column prop="content" label="跟进内容" width="110" :show-overflow-tooltip="true" />
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 签到记录弹框 -->
    <signDetailDialog :config="signDetailConfig" />
  </el-drawer>
</template>

<script>
import {
  getDeliveryPage
} from '@/api/deliver/studentManagement'
import signDetailDialog from '@/views/deliver/studentManagement/components/signDetailDialog.vue'
import { filtersMoneyByZero, filterTime } from '@/filters/index'
export default {
  components: {
    signDetailDialog
  },
  props: {
    param: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    // 签到记录弹框
    signDetailConfig: {
      visible: false,
      scheduleId: '' // 班期编号
    },
    filtersMoneyByZero,
    filterTime,
    data: [],
    currentPage: 1,
    total: 0,
    pageSize: 10,
    loading: false
  }),
  watch: {
    visible() {
      if (this.visible) this.init()
    }
  },
  methods: {
    // 点击打开签到详情弹框
    handleClickSignDetail(row) {
      this.signDetailConfig = {
        visible: true,
        scheduleId: row.scheduleId,
        deliveryInfoId: row.deliveryInfoId
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
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
    init() {
      this.currentPage = 1
      this.total = 0
      this.data = []
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        ...this.param
      }
      getDeliveryPage(params).then(res => {
        this.data = res.data.records
        this.total = Number(res.data.total)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tableBox{
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
}
.pagination {
  margin-bottom: 10px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.reasonContent {
  display: flex;
  justify-content: space-between;
}
</style>

