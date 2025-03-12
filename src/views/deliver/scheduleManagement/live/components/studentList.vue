<template>
  <div class="studentRecord">
    <div class="header-btn">
      <el-input
        v-model.trim="search.user.value"
        size="small"
        style="
          width: 300px;
          height: 32px;
          margin-right: 20px;
          margin-bottom: 20px;
        "
        :placeholder="`请输入学员${
          { userName: '姓名', userPhone: '电话', email: '邮箱' }[
            search.user.label
          ]
        }`"
        clearable
      >
        <el-select
          slot="prepend"
          v-model="search.user.label"
          style="width: 80px"
          placeholder="请选择"
        >
          <el-option label="电话" value="userPhone" />
          <el-option label="邮箱" value="email" />
          <el-option label="姓名" value="userName" />
        </el-select>
      </el-input>

      <el-input
        v-model="search.saleUserName"
        style="width: 300px; height: 32px; margin-right: 20px"
        placeholder="请输入内容"
      >
        <template slot="prepend">销售跟进人</template>
      </el-input>

      <el-input
        v-model="search.orderNo"
        style="width: 300px; height: 32px; margin-right: 20px"
        placeholder="请输入内容"
      >
        <template slot="prepend">订单号</template>
      </el-input>

      <!-- 1.待交付，2.交付中，3.延期交付，4锁定交付，5已交付，6已关闭 -->
      <div
        class="custom-select flex items-center rounded"
        style="
          border: 1px solid rgb(220, 223, 230);
          margin-right: 20px;
          width: 300px;
          overflow: hidden;
        "
      >
        <div
          class="px-5 text-sm h-full flex items-center"
          style="
            background-color: rgb(245, 247, 250);
            color: rgb(144, 147, 153);
            height: 32px;
            font-size: 13px;
            border-right: 1px solid rgb(220, 223, 230);
          "
        >
          交付状态
        </div>
        <el-select
          v-model="search.deliveryStatus"
          style="border: 0"
          size="small"
          type="sm"
          class="flex-1"
          placeholder="请选择"
        >
          <el-option label="待交付" value="1" />
          <el-option label="交付中" value="2" />
          <el-option label="延期交付" value="3" />
          <el-option label="锁定交付" value="4" />
          <el-option label="已交付" value="5" />
          <el-option label="已关闭" value="6" />
        </el-select>
      </div>

      <el-button
        type="primary"
        size="small"
        style="margin-left: 10px"
        @click="handleSubmit"
      >
        查询
      </el-button>
      <el-button size="small" @click="handleClose">重置</el-button>
    </div>
    <dynamicTable
      ref="table"
      :key="index"
      v-model="tableData"
      class="tableList"
      :columns="columns"
      :get-list-api="getList"
      :if-index="true"
      :checkbox="true"
      row-key="scheduleId"
      @selectionChange="handleSelectionChange"
    >
      <!-- <template slot="index" slot-scope="{ row }">
        <div>
          {{ row.index }}
        </div>
      </template> -->
      <template slot="statusName" slot-scope="{ row }">
        <div>
          <svg-icon icon-class="audio" />
          {{ row.statusName }}
        </div>
      </template>
      <template slot="deliveryStatus" slot-scope="{ row }">
        <deliveryStatusSpan :current="row" />
      </template>
      <template slot="userPhone" slot-scope="{ row }">
        <tablePhoneItem
          v-model="row.userPhone"
          :row-data="{ uid: row.userId }"
          :phone-area-code="row.phoneAreaCode"
          type="user"
        />
      </template>
      <template slot="email" slot-scope="{ row }">
        <tableEmailItem
          v-model="row.email"
          :row-data="{ userId: row.userId }"
          type="user"
        />
      </template>
    </dynamicTable>
    <airborneDialog
      ref="airborneDialog"
      @addAirborneStudentSuccess="addAirborneStudentSuccess"
    />
    <div class="bottomLeftAction">
      <el-button
        class="border"
        style="border-color: #0c6fff; color: #0c6fff; font-size: 14px"
        @click="openBatchAdjustScheduleDialog"
        v-permission="['web:myClass:batchAdjust', permsList]"
      >
        调整班级
      </el-button>
    </div>
    <BatchAdjustScheduleDialog
      :config="config"
      type="live"
      @success="onSuccess"
    />
    <!-- <AppDialog
      v-model="config.visible"
      title="调整班级"
      width="648px"
      height="auto"
      @success="sure"
    >
      <div class="p-20">
        <el-form>
          <el-form-item label="课程名称:" class="mb-0" label-width="90px">
            <p>课程名称名称名称</p>
          </el-form-item>
          <el-form-item label="原属班期:" class="mb-0" label-width="90px">
            <p>1001期</p>
          </el-form-item>
          <el-form-item label="班期状态:" class="mb-0" label-width="90px">
            <p>已开班</p>
          </el-form-item>
          <el-form-item label="开班时间:" class="mb-0" label-width="90px">
            <p>2024-01-01 10:00:00</p>
          </el-form-item>
          <el-form-item label="更换到班期:" class="mb-0" label-width="90px">
            <el-select v-model="form.originalSchedule" placeholder="请选择">
              <el-option label="选项1" value="选项1" />
              <el-option label="选项2" value="选项2" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog> -->
  </div>
</template>

<script>
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
import {
  deliveryInfoExportV2,
  getLiveDeliveryPage
} from '@/api/deliver/scheduleManagement'
import dynamicTable from '@/components/DynamicTable/table'
import airborneDialog from './airborneDialog'
// import deliveryStatusSpan from '../../../../components/deliveryStatusSpan'
import deliveryStatusSpan from '../../../components/deliveryStatusSpan'
// import AppDialog from '@/components/AppDialog'
import BatchAdjustScheduleDialog from '@/views/deliver/studentManagement/components/batchAdjustScheduleDialog'

export default {
  components: {
    tablePhoneItem,
    dynamicTable,
    airborneDialog,
    tableEmailItem,
    deliveryStatusSpan,
    BatchAdjustScheduleDialog
  },
  props: {
    scheduleId: {
      type: [Number, String],
      default: ''
    },
    current: {
      type: Object,
      default: () => {}
    },
    type: {
      type: [Number, String],
      default: 1
    },
    permsList: {
      type: Array,
      default: () => []
    },
    goodsId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      index: 1,
      search: {
        user: { label: 'userPhone', value: '' }, // 学员搜索
        saleUserName: '', // 销售跟进人
        orderNo: '', // 订单号
        deliveryStatus: '' // 状态
      },
      config: {
        visible: false,
        goodsId: this.current.goodsId,
        scheduleId: this.current.id,
        goodsName: this.current.scheduleNum
      },
      form: {
        originalSchedule: ''
      },
      columns: [
        // { prop: 'index', label: '序号', type: 'slot', width: '60px' },
        { prop: 'userName', label: '学员姓名', fixed: 'left', type: 'text' },
        { prop: 'userPhone', label: '学员电话', type: 'slot', width: '170px' },
        { prop: 'deliveryStatus', label: '交付状态', type: 'slot' },
        { prop: 'goodsName', label: '课程名称', type: 'text' },
        { prop: 'enrollmentUserName', label: '招生老师', type: 'text' },
        { prop: 'saleUserName', label: '销售跟进人', type: 'text', width: 100 },
        { prop: 'joinClassTime', label: '入班时间', type: 'text', width: 140 },
        { prop: 'deliveryTime', label: '交付时间', type: 'text', width: 140 },
        {
          prop: 'balanceFee',
          label: '订单余额',
          type: 'text',
          slotFn: row => {
            return (row.balanceFee / 100)?.toFixed(2)
          }
        },
        {
          prop: 'discountsFee',
          label: '优惠金额',
          type: 'text',
          slotFn: row => {
            return (row.discountsFee / 100)?.toFixed(2)
          }
        },
        { prop: 'orderNo', label: '订单编号', type: 'text', width: 220 }
      ],
      status: [],
      tableData: [],
      loading: false,
      selectedIds: []
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.table.onRefresh()
    },
    handleClose() {
      this.search = {
        user: { label: 'userPhone', value: '' } // 学员搜索
      }
      this.$refs.table.onRefresh()
    },
    async handleDownload() {
      const { data } = await deliveryInfoExportV2({
        // goodsId: this.current.goodsId,
        scheduleNum: this.current.scheduleNum
      })
      var newWin = window.open('loading page', '_self')
      newWin.location.href = data // 成功 重定向到目标页面
    },
    handleAddSchedule() {
      this.$refs.airborneDialog.open({
        scheduleId: this.scheduleId,
        ...this.current
      })
    },
    // 新增空降学员成功
    addAirborneStudentSuccess() {
      this.index++
      this.$refs.table.getList()
    },
    // 获取列表数据
    getList(params) {
      const data = {
        current: params.pageIndex,
        size: params.pageSize,
        scheduleId: this.scheduleId,
        [this.search.user.label]: this.search.user.value || undefined,
        saleUserName: this.search.saleUserName || undefined,
        orderNo: this.search.orderNo || undefined,
        deliveryStatus: this.search.deliveryStatus || undefined
      }
      // 这里type固定为 3
      return getLiveDeliveryPage(this.type, data).then(res => {
        res.data.items = res.data.records || []
        return res
      })
    },
    handleSelectionChange(selection) {
      this.selectedIds = selection
    },
    sure() {
      console.log('sure', this.selectedIds)
    },
    openBatchAdjustScheduleDialog() {
      if (this.selectedIds.length === 0) {
        this.$message.warning('请先选择学员')
        return
      }
      this.config.userList = this.selectedIds
      this.config.visible = true
    },
    onSuccess() {
      this.config.visible = false
      this.$refs.table.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.studentRecord ::v-deep {
  padding: 20px 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .tableList {
    height: calc(100vh - 100px);
  }
  .student-header {
    height: 70px;
    display: flex;
    align-items: center;
  }
  .filter-container {
    padding: 0px;
  }
  .header-btn {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    // align-items: center;
    // padding: 10px 0;
    padding-bottom: 20px;
    .rightBtn {
      display: flex;
      align-items: center;
    }
    .primary {
      color: #ffffff;
      background-color: #0c6fff !important;
      border-color: #0c6fff;
    }
  }
  .bottomLeftAction {
    position: absolute;
    left: 20px;
    bottom: 30px;
  }
}
::v-deep {
  .tablePage .page_content {
    padding-bottom: 0px !important;
  }
  .tablePage .page_footer {
    padding: 17px 0 !important;
  }
}

.custom-select {
  ::v-deep {
    .el-input__inner {
      border: 0;
    }
    .el-input {
      //margin-top: -2px;
    }
  }
}
</style>
