<template>
  <!-- 领取记录弹框 -->
  <AppDialog
    v-model="visible"
    title="领取记录"
    width="1280px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="couponRecord">
      <div>
        <el-checkbox
          v-model="search.onlyInviteStudent"
          class="m-b-10"
          @change="searchFn"
        >仅查看邀约学员</el-checkbox>
      </div>
      <div class="filterHeader">
        <div style="display: flex; flex-wrap: wrap">
          <span class="formLabel">手机号码</span>
          <el-input
            v-model.trim="search.mobilePhone"
            class="w-200 m-r-20"
            size="small"
            clearable
            @keyup.enter.native="searchFn"
            @input="delNumber"
            @clear="searchFn"
          />
          <span class="formLabel">邮箱</span>
          <el-input
            v-model.trim="search.email"
            class="w-200 m-r-20"
            size="small"
            clearable
            @keyup.enter.native="searchFn"
            @clear="searchFn"
          />
          <span class="formLabel">使用状态</span>
          <el-select
            v-model="search.applyStatus"
            placeholder="请选择"
            clearable
            size="small"
            class="w-150 m-r-20"
            @change="searchFn"
          >
            <el-option label="未使用" :value="0" />
            <el-option label="已使用" :value="1" />
          </el-select>
          <span class="formLabel">优惠券ID</span>
          <el-input
            v-model.trim="search.couponNo"
            class="w-200 m-r-20"
            size="small"
            clearable
            @keyup.enter.native="searchFn"
            @clear="searchFn"
          />

          <div>
            <span class="formLabel">邀请人</span>
            <el-select
              v-model="search.inviteTeacherId"
              size="small"
              class="w-200 m-r-10 m-l-10 m-t-10"
              filterable
              placeholder="请选择邀请人"
              clearable
              @change="searchFn"
            >
              <el-option
                v-for="item in userArray"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </div>
          <div class="m-t-10">
            <el-button
              size="small"
              type="primary"
              @click="searchFn"
            >查询</el-button>
            <el-button
              size="small"
              class="btn_primary"
              :loading="exportLoading"
              @click="onhandleExportGetLog"
            >导出</el-button>
          </div>
        </div>

        <!-- <el-button size="small" class="m-l-20" style="margin-left: 16px" @click="clearFn">重置</el-button> -->
      </div>
      <el-table
        height="520"
        :header-cell-style="{
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#333',
          'font-weight': 700,
          'letter-spacing': '1px'
        }"
        :class="{ myTable: true, 'el-table-null': !list.length }"
        :data="list"
      >
        <el-table-column prop="couponUserName" label="用户昵称" width="140">
          <template slot-scope="{ row }">
            {{ filtersTextPhone(row.couponUserName) }}
          </template>
        </el-table-column>
        <el-table-column prop="couponUserPhone" label="手机号码" width="180">
          <template slot-scope="{ row }">
            <watchPhoneNumber
              :phone-area-code="row.phoneAreaCode"
              :default-value="row.couponUserPhone"
              :params="row"
              :user-id="row.couponUserId"
              :get-api="operationLogsWrite"
            />
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="220">
          <template slot-scope="{ row }">
            <watchPhoneNumber
              v-if="row.email"
              :default-value="row.email"
              :params="row"
              :user-id="row.couponUserId"
              :get-api="operationLogsWriteEmail"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="inviteTeacherNames" label="邀请人" />
        <el-table-column prop="createTime" label="领取时间" width="160">
          <template slot-scope="{ row }">
            {{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column prop="couponNo" label="优惠券ID" width="180" />
        <el-table-column
          prop="userCouponNo"
          label="用户优惠券编码"
          width="140"
        />
        <el-table-column prop="couponName" label="优惠券名称" width="140" />
        <el-table-column prop="discountMethod" label="券类型">
          <template slot-scope="{ row }">
            {{ row.discountMethod | getOptionsValue(couponDiscountMethodType) }}
          </template>
        </el-table-column>
        <el-table-column prop="applyStatus" label="使用状态">
          <template slot-scope="{ row }">
            <AppStatus :status="['error', 'success'][row.applyStatus]">
              <span>
                {{ ['未使用', '已使用'][row.applyStatus] }}
              </span>
            </AppStatus>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :pager-count="5"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import {
  liveRoomCouponGetLog,
  liveRoomCouponexportGetLog
} from '@/api/liveRoom/index.js'
import {
  couponDiscountMethodType,
  liveOperationType
} from '@/views/live/columns.js'
import { getOptionsValueByKey } from '@/filters/index'
import AppStatus from '@/components/AppStatus'
import { userNoPage } from '@/api/addressBookApi'
import AppDialog from '@/components/AppDialog'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { filtersTextPhone } from '@/utils/index'

export default {
  components: {
    AppDialog,
    AppStatus,
    watchPhoneNumber
  },
  data() {
    return {
      couponDiscountMethodType,
      top: '114px',
      loading: false,
      exportLoading: false,
      liveRoomId: '',
      search: {
        email: '',
        onlyInviteStudent: true,
        applyStatus: '',
        couponNo: '',
        mobilePhone: '',
        inviteTeacherId: ''
      },
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      userArray: [],
      visible: false
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.currentPage = 1
          this.total = 0
          this.list = []
          this.getList()
        } else {
          this.currentPage = 1
          this.total = 0
          this.list = []
          this.checks = []
        }
      },
      deep: true
    }
  },
  mounted() {
    this.loadUserNoPage()
    this.top = Math.abs(window.innerHeight - 740) / 2 + 'px'
  },
  methods: {
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    // 限制只能输入英文和数字
    delNumber(e) {
      this.search.mobilePhone = e.replace(/[^0-9]/g, '')
    },
    getOptionsValueByKey,
    sure() {},
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
        applyStatus: this.search.applyStatus,
        couponNo: this.search.couponNo,
        mobilePhone: this.search.mobilePhone,
        inviteTeacherId: this.search.inviteTeacherId,
        email: this.search.email,
        onlyInviteStudent: this.search.onlyInviteStudent
      }
      liveRoomCouponGetLog(data)
        .then(res => {
          this.list = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    clearFn() {
      this.search = {
        email: '',
        phone: '',
        status: '',
        id: ''
      }
      this.searchFn()
    },
    onhandleExportGetLog() {
      this.exportLoading = true
      const data = {
        liveRoomId: this.liveRoomId,
        applyStatus: this.search.applyStatus, // 使用状态 0-未使用 1-已使用
        couponNo: this.search.couponNo, // 优惠券id
        inviteTeacherId: this.search.inviteTeacherId, // 邀请老师id
        mobilePhone: this.search.mobilePhone, // 手机号码
        onlyInviteStudent: this.search.onlyInviteStudent // 仅查看邀约用户
      }
      liveRoomCouponexportGetLog(data)
        .then(res => {
          var newWin = window.open('loading page', '_blank')
          newWin.location.href = res.data // 成功 重定向到目标页面
          this.exportLoading = false
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.couponUserId,
        queryType: 2,
        email: params.email,
        operationType: liveOperationType.type4
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.couponUserId,
        phoneNum: params.couponUserPhone,
        operationType: liveOperationType.type6
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.couponRecord {
  padding: 20px 32px;
  .filterHeader {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .formLabel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 32px;
      margin-right: 8px;
    }
  }
  .myTable {
    width: 100%;
    margin-top: 20px;
  }
  .pagination {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
::v-deep .myTable {
  width: 100%;
  border-left: 1px solid #eff2f6;
  border-right: 1px solid #eff2f6;
  border-radius: 6px;
  .el-table-null {
    border-bottom: 1px solid #eff2f6;
  }
  .el-table th.el-table__cell.is-leaf {
    border-bottom: none;
  }
  .el-table td.el-table__cell {
    border-bottom-color: #eff2f6;
  }
  .el-table::before {
    width: 0 !important;
    height: 0 !important;
  }
  .el-table__header-wrapper {
    .el-table__header {
      th {
        border-bottom: none;
        .cell {
          color: #000;
          font-family: 'Microsoft YaHei';
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
        }
      }
    }
  }
  .el-table__body {
    .el-table__row {
      .el-table__cell {
        .cell {
          color: #333;
        }
      }
    }
  }
}
</style>
