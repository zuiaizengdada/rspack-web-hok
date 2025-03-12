<template>
  <!-- 报名列表 -->
  <div class="userRecords">
    <div class="search">
      <!-- <label class="searchLabel">手机号码<el-input v-model.trim="search.phone" clearable size="small" class="w-200 m-r-20 m-l-8" placeholder="请输入手机号码" @keyup.enter.native="searchFn" /></label> -->
      <selectTelEmail v-model="search.userInfo" class="m-r-10" @onChange="searchFn" />
      <label class="searchLabel">邀请人
        <el-select v-model="search.sysUserId" size="small" class="w-200 m-r-10 m-l-10" filterable placeholder="请选择邀请人" clearable @change="searchFn">
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </label>
      <label class="searchLabel">是否到课
        <el-select v-model="search.classAttendance" size="small" clearable placeholder="请选择" class="w-200 m-r-10 m-l-8" @change="searchFn" @clear="searchFn">
          <el-option v-for="item in classAttendanceOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </label>
      <label class="searchLabel m-l-10">
        <el-checkbox v-model="search.onlyInviteStudent" class="m-r-20" @change="searchFn">仅查看邀约学员</el-checkbox>
      </label>
      <el-button type="primary" size="small" @click="searchFn">查询</el-button>
      <el-button size="small" @click="clear">重置</el-button>
      <el-button v-permission="['web:liveDetail:registerListExport', permsList]" size="small" class="btn_primary fr" :loading="exportLoading" @click="handleExport">导出表格</el-button>
    </div>
    <el-table v-loading="loading" :data="list" :header-cell-style="{ background: '#f5f5f5' }" class="m-t-20">
      <el-table-column prop="headPicture" label="学员头像">
        <template slot-scope="{ row }">
          <AppAvatar :name="row.nickName" :avatar="row.headPicture" width="36" :no-name="true" />
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="学员昵称" :show-overflow-tooltip="true">
        <template slot-scope="{ row }">
          {{ filtersTextPhone(row.nickName) }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号码">
        <template slot-scope="{ row }">
          <watchPhoneNumber :phone-area-code="row.phoneAreaCode" :default-value="row.phone" :params="row" :user-id="row.studentId" :get-api="operationLogsWrite" />
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
        <template slot-scope="{ row }">
          <watchPhoneNumber :default-value="row.email" :params="row" :user-id="row.studentId" :get-api="operationLogsWriteEmail" />
        </template>
      </el-table-column>
      <el-table-column prop="sysUserName" label="邀请人" :show-overflow-tooltip="true" />
      <el-table-column prop="createTime" label="报名时间">
        <template slot-scope="{ row }">
          {{ row.createTime | filterTime }}
        </template>
      </el-table-column>
      <el-table-column prop="classAttendance" label="是否到课">
        <template slot-scope="{ row }">
          {{ row.classAttendance | getOptionsValue(classAttendanceOption) }}
        </template>
      </el-table-column>
    </el-table>
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
</template>

<script>
import { applyRecordPageAjax, exportApplyRecordAjax } from '@/api/liveRoom/register.js'
import { userNoPage } from '@/api/addressBookApi'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import moment from 'moment'
import { liveOperationType, classAttendanceOption } from '@/views/live/columns.js'
import { filtersTextPhone } from '@/utils/index'
import selectTelEmail from '@/views/live/component/selectTelEmail'
export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    },
    filterlistenClassTime(val) {
      if (!val) { return 0 + '分钟' }
      if (val < 60000) {
        return Math.floor(val / 1000) + '秒'
      }
      return Math.floor(val / 1000 / 60) + '分钟'
    }
  },
  components: {
    AppAvatar,
    watchPhoneNumber,
    selectTelEmail
  },
  data() {
    return {
      search: {
        sysUserId: '',
        phone: '',
        userInfo: {
          label: 'tel',
          value: { tel: '', Email: '' }
        },
        onlyInviteStudent: true
      },
      loading: false,
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      userArray: [],
      exportLoading: false,
      permsList: this.$route.meta.permsList || [],
      classAttendanceOption
    }
  },
  created() {
    this.loadUserNoPage()
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
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
      this.list = []
      const params = {
        liveRoomId: this.$route.params.id,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        sysUserId: this.search.sysUserId,
        // phone: this.search.phone,
        phone: this.search.userInfo.value.tel,
        email: this.search.userInfo.value.Email,
        classAttendance: this.search.classAttendance,
        onlyInviteStudent: this.search.onlyInviteStudent
      }
      applyRecordPageAjax(params).then(res => {
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
    // 重置
    clear() {
      this.search = {
        sysUserId: '',
        phone: '',
        userInfo: {
          label: 'tel',
          value: { tel: '', Email: '' }
        },
        onlyInviteStudent: true
      }
      this.searchFn()
    },
    // 导出
    handleExport() {
      const params = {
        ...this.search,
        liveRoomId: this.$route.params.id

      }
      this.exportLoading = true
      exportApplyRecordAjax(params).then(res => {
        var newWin = window.open('loading page', '_self')
        newWin.location.href = res.data // 成功 重定向到目标页面
      }).finally(() => {
        this.exportLoading = false
      })
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        phoneNum: params.phone,
        operationType: liveOperationType.type3
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 邮箱
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        phoneNum: params.phone,
        queryType: 2,
        email: params.email,
        operationType: liveOperationType.type3
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.search {
  .searchLabel {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
}
.pagination {
  margin-top: 10px;
  text-align: right;
}
</style>
