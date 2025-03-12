<template>
  <!-- 领券记录 -->
  <div class="couponRecord">
    <HokSearchForm :form-opts="formOpts" :ref-obj.sync="formOpts.ref" class="pd20" @change="change">
      <template #userInfo>
        <div class="flex pl-2">
          <el-select v-model="formOpts.formData.userInfo.label" class="two-min-select w102" placeholder="请选择" @change="userInfoTypeChange">
            <el-option v-for="item in formOpts.formData.userInfo.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <template v-if="formOpts.formData.userInfo.label === 'phone'">
            <el-input v-model="formOpts.formData.userInfo.value.phone" class="pl10" placeholder="请输入手机号" clearable />
          </template>
          <template v-else-if="formOpts.formData.userInfo.label === 'studentUserId'">
            <AppSelect
              class="pl10"
              :get-api-fn="getLiveRoomUserInfoByName"
              search-key="nickName"
              :value="formOpts.formData.userInfo.value.studentUserId"
              :label="formOpts.formData.userInfo.value.nickName"
              :props="{label: 'nickName',value: 'userId'}"
              @selected="selectedStudentUserId"
            />
          </template>
          <template v-if="formOpts.formData.userInfo.label === 'email'">
            <el-input v-model="formOpts.formData.userInfo.value.email" class="pl10" placeholder="请输入邮箱" clearable @keyup.enter.native="searchFn" />
          </template>
        </div>
      </template>
    </HokSearchForm>
    <div class="couponRecordContent">
      <div class="myTable custom-table">
        <el-table v-loading="loading" height="100%" :data="list" :header-cell-style="{ background: '#EFF2F6', color: '#000' }" :cell-style="{ color: '#333' }">
          <el-table-column prop="couponUserName" label="用户昵称" align="center">
            <template slot-scope="{ row }">
              {{ filtersTextPhone(row.couponUserName) }}
            </template>
          </el-table-column>
          <el-table-column prop="couponUserPhone" label="手机号码">
            <template slot-scope="{ row }">
              <watchPhoneNumber :phone-area-code="row.phoneAreaCode" :default-value="row.couponUserPhone" :params="row" :user-id="row.couponUserId" :get-api="operationLogsWrite" />
            </template>
          </el-table-column>

          <el-table-column prop="email" label="邮箱">
            <template slot-scope="{ row }">
              <watchPhoneNumber :default-value="row.email" :params="row" :user-id="row.couponUserId" :get-api="operationLogsWriteEmail" />
            </template>
          </el-table-column>

          <el-table-column prop="inviteTeacherNames" label="邀请人" align="center" />
          <el-table-column prop="createTime" label="领取时间" width="160" align="center">
            <template slot-scope="{ row }">
              {{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </template>
          </el-table-column>
          <el-table-column prop="couponNo" label="优惠券ID" align="center" />
          <el-table-column prop="userCouponNo" label="用户优惠券编码" align="center" />
          <el-table-column prop="couponName" label="优惠券名称" align="center" />
          <el-table-column prop="discountMethod" label="券类型" align="center">
            <template slot-scope="{ row }">
              {{ row.discountMethod | getOptionsValue(couponDiscountMethodType) }}
            </template>
          </el-table-column>
          <el-table-column prop="applyStatus" label="使用状态" width="120">
            <template slot-scope="{ row }">
              <AppStatus :status="['error', 'success'][row.applyStatus]">
                <span>
                  {{ ['未使用', '已使用'][row.applyStatus] }}
                </span>
              </AppStatus>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="pagination"
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
</template>

<script>
import { getLiveRoomUserInfoByName, liveRoomCouponGetLog } from '@/api/liveRoom/index.js'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { deepClone } from '@/utils/FormGenerator/index'
import { liveOperationType, couponDiscountMethodType } from '@/views/live/columns.js'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { couponRecordOpts } from '../../data'
import AppSelect from '@/components/AppSelect'
import AppStatus from '@/components/AppStatus'
import { filtersTextPhone } from '@/utils/index'
export default {
  components: {
    HokSearchForm,
    AppSelect,
    watchPhoneNumber,
    AppStatus
  },
  props: {
    userArray: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      couponDiscountMethodType,
      loading: false,
      formOpts: {
        ...deepClone(couponRecordOpts(this.searchFn).form),
        operatorList: [
          { label: '搜索', fn: this.searchFn },
          { label: '重置', type: 'plain', fn: this.clearFn }
        ]
      },
      list: [],
      currentPage: 1,
      pageSize: 10,
      liveRoomId: this.$route.params.id,
      total: 0
    }
  },
  watch: {
    userArray: {
      handler(val) {
        this.formOpts.optionsObj.inviteTeacherId = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    clearFn() {
      this.formOpts.formData = { ...deepClone(couponRecordOpts(this.searchFn).form.formData) }
      this.searchFn()
    },
    userInfoTypeChange() {
      this.formOpts.formData.userInfo.value = {
        phone: '',
        studentUserId: '',
        email: ''
      }
    },
    getLiveRoomUserInfoByName(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        nickName: params.nickName
      }
      return getLiveRoomUserInfoByName(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    selectedStudentUserId(e) {
      console.log(e)
      this.formOpts.formData.userInfo.value.studentUserId = e.userId
      this.formOpts.formData.userInfo.value.nickName = e.nickName
      this.searchFn()
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
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        liveRoomId: this.liveRoomId,
        applyStatus: this.formOpts.formData.applyStatus,
        couponNo: this.formOpts.formData.couponNo,
        mobilePhone: this.formOpts.formData.userInfo.value.phone,
        userId: this.formOpts.formData.userInfo.value.studentUserId,
        inviteTeacherId: this.formOpts.formData.inviteTeacherId,
        email: this.formOpts.formData.userInfo.value.email,
        onlyInviteStudent: this.formOpts.formData.existInviteTeacher
      }
      liveRoomCouponGetLog(data).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.couponUserId,
        phoneNum: params.studentPhone,
        operationType: liveOperationType.type6
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 邮箱埋点
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.couponUserId,
        queryType: 2,
        email: params.email,
        operationType: liveOperationType.type6
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    change() {
      this.searchFn()
    }
  }
}
</script>

<style lang='scss' scoped>
.couponRecord {
  padding: 10px 15px 0;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  .two-min-select {
    flex-shrink: 0;
    box-sizing: border-box;
    border-right: 1px solid #dcdee1;
    &.w102 {
      width: 102px !important;
    }
  }
  .couponRecordContent {
    flex: 1 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    .myTable {
      flex: 1 0 0;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid #F2F2F2;
    }
    .pagination {
      height: 68px;
      min-height: 68px;
      max-height: 68px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
::v-deep {
  .tearchInput {
    width: auto!important;
  }
  .hok-search-form {
    margin-bottom: 0;
  }
  .el-table::before {
    height: 0px;
  }
}
::v-deep {
  /**改变边框颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border, .custom-table.el-table--group {
      border: 1px solid #EFF2F6!important;
  }
  /**改变表格内竖线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border  td, .custom-table.el-table--border th, .custom-table.el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
      border-right: 1px solid #EFF2F6!important;
  }
  /**改变合并单元格横线颜色===》.custom-table指定上面的类id */
  .custom-table .el-table--border th.el-table__cell {
      border-bottom: 1px solid #EFF2F6;
  }
  /**改变表格内常规行线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table  td, .custom-table.el-table th.is-leaf  {
      border-bottom: 1px solid #EFF2F6!important;
  }
  .custom-table .el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell {
    border-bottom: 1px solid #EFF2F6!important;
  }
}
.pl10 {
  padding-left: 10px;
}
</style>
