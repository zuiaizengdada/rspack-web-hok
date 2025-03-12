<template>
  <div class="studentRecord">
    <div class="header-btn">
      <div class="leftBtn">
        <el-button
          v-if="[2, 3].includes(current.scheduleStatus)"
          v-permission="['web:studentList:add', permsList]"
          type="primary"
          size="small"
          class="primary"
          @click="handleAddSchedule"
        >新增空降学员</el-button>
        <el-button
          v-permission="['web:studentList:export', permsList]"
          type="primary"
          size="small"
          @click="handleDownload"
        >导出学员列表</el-button>
      </div>
      <div class="rightBtn">
        <el-input
          v-model.trim="search.user.value"
          size="small"
          style="width: 220px"
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
        <el-button
          type="primary"
          size="small"
          style="margin-left: 10px"
          @click="handleSubmit"
        >查询</el-button>
        <el-button size="small" @click="handleClose">重置</el-button>
      </div>
    </div>
    <dynamicTable
      ref="table"
      :key="index"
      v-model="tableData"
      class="tableList"
      :columns="columns"
      :get-list-api="getList"
    >
      <template slot="statusName" slot-scope="{ row }">
        <div>
          <svg-icon icon-class="audio" />
          {{ row.statusName }}
        </div>
      </template>
      <template slot="deliveryStatusName" slot-scope="{ row }">
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
  </div>
</template>

<script>
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
import {
  deliveryPage,
  deliveryInfoExportV2
} from '@/api/deliver/scheduleManagement'
import dynamicTable from '@/components/DynamicTable/table'
import airborneDialog from './airborneDialog'
import deliveryStatusSpan from '../../components/deliveryStatusSpan'
export default {
  components: {
    tablePhoneItem,
    dynamicTable,
    airborneDialog,
    tableEmailItem,
    deliveryStatusSpan
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
        user: { label: 'userPhone', value: '' } // 学员搜索
      },
      columns: [
        { prop: 'userName', label: '学员姓名', fixed: 'left', type: 'text' },
        { prop: 'userPhone', label: '学员电话', type: 'slot', width: '170px' },
        { prop: 'email', label: '学员邮箱', type: 'slot', width: '170px' },
        { prop: 'deliveryStatusName', label: '交付状态', type: 'slot' },
        { prop: 'enrollmentUserName', label: '招生老师', type: 'text' },
        { prop: 'assistantUserName', label: '助教', type: 'text' },
        { prop: 'headteacherUserName', label: '班主任', type: 'text' },
        { prop: 'inTime', label: '入班时间', type: 'text', width: 140 },
        { prop: 'deliveryTime', label: '交付时间', type: 'text', width: 140 }
      ],
      status: [],
      tableData: [],
      loading: false
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
        [this.search.user.label]: this.search.user.value || undefined
      }
      return deliveryPage(data).then(res => {
        res.data.items = res.data.records || []
        return res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.studentRecord ::v-deep {
  padding: 0 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
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
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
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
