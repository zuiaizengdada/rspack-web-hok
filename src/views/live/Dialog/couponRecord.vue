<template>
  <!-- 领取记录弹框 -->
  <AppDialog
    v-model="visible"
    title="领取记录"
    width="1300px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="couponRecord">
      <div><el-checkbox v-model="search.onlyInviteStudent" class="m-b-10" @change="searchFn">仅查看邀约学员</el-checkbox></div>
      <div class="filterHeader">
        <div class="fl">
          <!-- <span class="formLabel">手机号码</span>
          <el-input v-model.trim="search.mobilePhone" class="w-200 m-r-20" size="small" clearable @keyup.enter.native="searchFn" @input="delNumber" @clear="searchFn" /> -->
          <selectTelEmail v-model="search.userInfo" class="m-r-10" @onChange="searchFn" />
          <span class="formLabel">使用状态</span>
          <el-select v-model="search.applyStatus" placeholder="请选择" clearable size="small" class="w-150 m-r-20" @change="searchFn">
            <el-option label="未使用" :value="0" />
            <el-option label="已使用" :value="1" />
          </el-select>
          <span class="formLabel">优惠券ID</span>
          <el-input v-model.trim="search.couponNo" class="w-200 m-r-20" size="small" clearable @keyup.enter.native="searchFn" @clear="searchFn" />

          <span class="formLabel">邀请人</span>
          <el-select v-model="search.inviteTeacherId" size="small" class="w-200 m-r-10 m-l-10" filterable placeholder="请选择邀请人" clearable @change="searchFn">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </div>
        <div class="fl">
          <el-button size="small" type="primary" @click="searchFn">查询</el-button>
          <el-button size="small" class="btn_primary" :loading="exportLoading" @click="onhandleExportGetLog">导出</el-button>
        </div>
        <!-- <el-button size="small" class="m-l-20" style="margin-left: 16px" @click="clearFn">重置</el-button> -->
      </div>
      <el-table class="myTable" height="502" :header-cell-style="{ background: '#F3F3F3' }" border :data="list">
        <el-table-column prop="couponUserName" label="用户昵称">
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

        <el-table-column prop="inviteTeacherNames" label="邀请人" />
        <el-table-column prop="createTime" label="领取时间" width="160">
          <template slot-scope="{ row }">
            {{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column prop="couponNo" label="优惠券ID" />
        <el-table-column prop="userCouponNo" label="用户优惠券编码" width="140" />
        <el-table-column prop="couponName" label="优惠券名称" />
        <el-table-column prop="discountMethod" label="券类型" width="80">
          <template slot-scope="{ row }">
            {{ row.discountMethod | getOptionsValue(couponDiscountMethodType) }}
          </template>
        </el-table-column>
        <el-table-column prop="applyStatus" label="使用状态" width="80">
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
import { liveRoomCouponGetLog, liveRoomCouponexportGetLog } from '@/api/liveRoom/index.js'
import { couponDiscountMethodType, liveOperationType } from '@/views/live/columns.js'
import { getOptionsValueByKey } from '@/filters/index'
import AppStatus from '@/components/AppStatus'
import { userNoPage } from '@/api/addressBookApi'
import AppDialog from '@/components/AppDialog'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import selectTelEmail from '@/views/live/component/selectTelEmail'
import { filtersTextPhone } from '@/utils/index'

export default {
  components: {
    AppDialog,
    AppStatus,
    watchPhoneNumber,
    selectTelEmail
  },
  data() {
    return {
      couponDiscountMethodType,
      top: '114px',
      loading: false,
      exportLoading: false,
      liveRoomId: '',
      search: {
        userInfo: {
          label: 'tel',
          value: { tel: '', Email: '' }
        },
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
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
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
        // mobilePhone: this.search.mobilePhone,
        mobilePhone: this.search.userInfo.value.tel,
        email: this.search.userInfo.value.Email,
        inviteTeacherId: this.search.inviteTeacherId,
        onlyInviteStudent: this.search.onlyInviteStudent
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
    clearFn() {
      this.search = {
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
      liveRoomCouponexportGetLog(data).then(res => {
        var newWin = window.open('loading page', '_blank')
        newWin.location.href = res.data // 成功 重定向到目标页面
        this.exportLoading = false
      }).catch(() => {
        this.exportLoading = false
      })
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
    },
    // 邮箱埋点
    operationLogsWriteEmail(params) {
      console.log('111')
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.couponUserId,
        queryType: 2,
        email: params.email,
        operationType: liveOperationType.type6
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.couponRecord {
  height: 652px;
  padding: 20px;
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
    margin-top: 10px;
    height: 502px;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid #CBCFD3;
    overflow: hidden;
  }
  .pagination {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
</style>
