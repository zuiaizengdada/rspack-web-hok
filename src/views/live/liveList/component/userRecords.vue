<template>
  <!-- 用户记录 -->
  <div class="userRecords">
    <div class="search">
      <el-row>
        <label class="searchLabel">邀请人
          <el-select v-model="search.teacherId" size="small" class="w-200 m-r-10 m-l-10" filterable placeholder="请选择邀请人" clearable @change="searchFn">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </label>

        <label class="searchLabel">跟进人
          <el-select v-model="search.followUserId" size="small" clearable filterable placeholder="请选择" class="m-r-10 m-l-10" @change="searchFn" @clear="searchFn">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </label>

        <!-- <label class="searchLabel">手机号
          <el-input v-model="search.phone" class="w-200 m-r-10 m-l-10" size="small" clearable @input="delNumber($event, 'phone')" @clear="searchFn" @keyup.enter.native="searchFn" />
        </label>

        <label class="searchLabel">学员昵称
          <AppSelect
            class="w-200 m-r-10 m-l-10"
            :get-api-fn="getLiveRoomUserInfoByName"
            search-key="nickName"
            :value="search.studentUserId"
            :label="search.nickName"
            :props="{
              label: 'nickName',
              value: 'userId'
            }"
            @selected="selectedStudentUserId"
          />
        </label> -->
        <selectTelEmail v-model="search.userInfo" :options="['tel', 'Email', 'userName']" class="m-r-10" size="small" @onChange="searchFn" />

      </el-row>
      <el-row>
        <label class="searchLabel">是否到课
          <el-select v-model="search.isAttendClass" size="small" clearable placeholder="请选择" style="width:100px" class="m-r-10 m-l-10" @change="onChangeIsAttendClass" @clear="searchFn">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </label>

        <label class="searchLabel">是否完课
          <el-select v-model="search.isFinishClass" size="small" clearable placeholder="请选择" style="width:100px" class="m-r-10 m-l-10" @change="onChangeIsFinishClass" @clear="searchFn">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </label>

        <label class="searchLabel">是否看回放
          <el-select v-model="search.isWatchPlayback" size="small" clearable placeholder="请选择" style="width:100px" class="m-r-10 m-l-10" @change="searchFn" @clear="searchFn">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </label>

        <label class="searchLabel">是否游客
          <el-select v-model="search.userType" size="small" clearable placeholder="请选择" style="width:100px" class="m-r-10 m-l-10" @change="searchFn" @clear="searchFn">
            <el-option v-for="item in userTypeOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </label>

        <label class="searchLabel">首次进入时间
          <el-date-picker
            v-model="search.time"
            type="datetimerange"
            class="m-r-10 m-l-10"
            size="small"
            style="width: 300px"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </label>
      </el-row>
      <el-row>
        <label class="searchLabel">直播听课时长
          <el-input
            v-model="search.listenClassStartTime"
            placeholder="请输入"
            clearable
            size="small"
            class="w-100 m-l-10"
            @input="delNumber($event, 'listenClassStartTime')"
          />
          -
          <el-input
            v-model="search.listenClassEndTime"
            placeholder="请输入"
            clearable
            size="small"
            class="w-100 m-r-10"
            @input="delNumber($event, 'listenClassEndTime')"
          />
          <!-- <el-input v-model="search.listenClassTime" class="w-200 m-r-10 m-l-10" size="small" clearable @input="delNumber" @clear="searchFn" @keyup.enter.native="searchFn" /> -->
        </label>
        <label class="searchLabel">回放听课时长
          <el-input
            v-model="search.playbackListenClassStart"
            placeholder="请输入"
            clearable
            size="small"
            class="w-100 m-l-10"
            @input="delNumber($event, 'playbackListenClassStart')"
          />
          -
          <el-input
            v-model="search.playbackListenClassEnd"
            placeholder="请输入"
            clearable
            size="small"
            class="w-100 m-r-10"
            @input="delNumber($event, 'playbackListenClassEnd')"
          />
          <!-- <el-input v-model="search.listenClassTime" class="w-200 m-r-10 m-l-10" size="small" clearable @input="delNumber" @clear="searchFn" @keyup.enter.native="searchFn" /> -->
        </label>
        <label class="searchLabel">总听课时长
          <el-input
            v-model="search.totalListenClassStart"
            placeholder="请输入"
            clearable
            size="small"
            class="w-100 m-l-10"
            @input="delNumber($event, 'totalListenClassStart')"
          />
          -
          <el-input
            v-model="search.totalListenClassEnd"
            placeholder="请输入"
            clearable
            size="small"
            class="w-100 m-r-10"
            @input="delNumber($event, 'totalListenClassEnd')"
          />
          <!-- <el-input v-model="search.listenClassTime" class="w-200 m-r-10 m-l-10" size="small" clearable @input="delNumber" @clear="searchFn" @keyup.enter.native="searchFn" /> -->
        </label>
        <label class="searchLabel m-r-20">
          <el-checkbox v-model="search.existInviteTeacher" class="m-b-10" @change="searchFn">仅查看邀约学员</el-checkbox>
        </label>
        <label class="searchLabel m-r-20">
          <el-checkbox v-model="search.followerClue" class="m-b-10" @change="searchFn">查看所有跟进人线索</el-checkbox>
        </label>
      </el-row>

      <el-button class="m-r-10" type="primary" size="small" :loading="exportLoading" @click="searchFn">查询</el-button>
      <el-button v-permission="['web:liveDetail:sync', permsList]" class="btn_primary" size="small" :loading="syncLoading" @click="onhandleSync">手动同步线索</el-button>
      <el-button v-permission="['web:liveDetail:userRecordsExport', permsList]" class="fr btn_primary" size="small" @click="onhandleExport">导出记录</el-button>
    </div>
    <el-table v-loading="loading" :data="list" :header-cell-style="{ background: '#f5f5f5' }" class="m-t-20" @sort-change="handleSortChange">
      <el-table-column prop="teacherName" label="邀请人" />
      <el-table-column prop="studentAvatarUrl" label="学员头像">
        <template slot-scope="{ row }">
          <AppAvatar :name="row.studentName" :avatar="row.studentAvatarUrl" width="36" :no-name="true" />
        </template>
      </el-table-column>
      <el-table-column prop="studentName" label="学员昵称" :show-overflow-tooltip="true">
        <template slot-scope="{ row }">{{ filtersTextPhone(row.studentName) }}</template>
      </el-table-column>
      <el-table-column prop="studentPhone" label="手机号码" width="120">
        <template slot-scope="{ row }">
          <watchPhoneNumber
            :phone-area-code="row.phoneAreaCode"
            :default-value="row.studentPhone"
            :params="row"
            :user-id="row.studentId"
            :get-api="operationLogsWrite"
          />
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="120">
        <template slot-scope="{ row }">
          <watchPhoneNumber
            :default-value="row.email"
            :params="row"
            :user-id="row.studentId"
            :get-api="operationLogsWriteEmail"
          />
        </template>
      </el-table-column>
      <el-table-column prop="followUserName" label="跟进人" />
      <el-table-column prop="userType" label="是否游客" align="center">
        <template slot-scope="{ row }">
          {{ row.userType | getOptionsValue(userTypeOption) }}
        </template>
      </el-table-column>
      <el-table-column prop="firstEntryTime" label="首次进入时间" width="140">
        <template slot-scope="{ row }">
          {{ row.firstEntryTime | filterTime }}
        </template>
      </el-table-column>
      <el-table-column prop="lastDepartureTime" label="最后离开时间" width="140">
        <template slot-scope="{ row }">
          {{ row.lastDepartureTime | filterTime }}
        </template>
      </el-table-column>
      <el-table-column prop="listenClassTime" label="直播听课时长(分)" align="center" sortable="custom" width="160">
        <template slot-scope="{ row }">
          {{ row.listenClassTime | filterlistenClassTime }}
        </template>
      </el-table-column>
      <el-table-column prop="playbackListenClassTime" label="回放听课时长(分)" align="center" sortable="custom" width="160">
        <template slot-scope="{ row }">
          {{ row.playbackListenClassTime | filterlistenClassTime }}
        </template>
      </el-table-column>
      <el-table-column prop="totalListenClassTime" label="总听课时长(分)" align="center" sortable="custom" width="160">
        <template slot-scope="{ row }">
          {{ row.totalListenClassTime | filterlistenClassTime }}
        </template>
      </el-table-column>
      <el-table-column prop="isAttendClass" label="是否到课" align="center">
        <template slot-scope="{ row }">
          {{ row.isAttendClass ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="isFinishClass" label="是否完课" align="center">
        <template slot-scope="{ row }">
          {{ row.isFinishClass ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="isWatchPlayback" label="是否看回放" align="center">
        <template slot-scope="{ row }">
          {{ row.isWatchPlayback ? '是' : '否' }}
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
import { getUserRecordPage, userRecordPageImport, getLiveRoomUserInfoByName, recordCluePull } from '@/api/liveRoom/index.js'
import { userNoPage } from '@/api/addressBookApi'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { liveOperationType, userTypeOption } from '@/views/live/columns.js'
import { filtersTextPhone } from '@/utils/index'
// import AppSelect from '@/components/AppSelect'
import selectTelEmail from '@/views/live/component/selectTelEmail'
import moment from 'moment'
export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
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
    // AppSelect,
    selectTelEmail
  },
  data() {
    return {
      exportLoading: false,
      search: {
        userInfo: {
          label: 'tel',
          value: { tel: '', Email: '', userName: { userId: '', nickName: '' } }
        },
        teacherId: '',
        time: [],
        sortBy: '',
        sortType: '',
        listenClassStartTime: '',
        listenClassEndTime: '',
        playbackListenClassStart: '',
        playbackListenClassEnd: '',
        totalListenClassStart: '',
        totalListenClassEnd: '',
        userType: '',
        phone: '',
        existInviteTeacher: true,
        followerClue: true,
        isAttendClass: '',
        isFinishClass: '',
        isWatchPlayback: '',
        studentUserId: '',
        nickName: '',
        followUserId: ''
      },
      loading: false,
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      userArray: [],
      permsList: this.$route.meta.permsList || [],
      userTypeOption,
      syncLoading: false,
      timeout: null,
      waitTime: 10,
      ifCanClick: true
    }
  },
  created() {
    this.loadUserNoPage()
  },
  destroyed() {
    clearInterval(this.timeout)
    this.timeout = null
    this.ifCanClick = true
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    onChangeIsFinishClass(res) {
      console.log(res, 'res')
      if (res) {
        this.search.isAttendClass = true
      }
      this.searchFn()
    },
    onChangeIsAttendClass(res) {
      if (res === false) {
        this.search.isFinishClass = false
      }
      this.searchFn()
    },
    selectedStudentUserId(e) {
      this.search.studentUserId = e.userId
      this.search.nickName = e.nickName
      this.searchFn()
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
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    // 限制只能输入英文和数字
    delNumber(e, type) {
      this.search[type] = e.replace(/[^0-9]/g, '')
    },
    // 点击导出记录
    onhandleExport() {
      this.exportLoading = true
      const data = {
        liveRoomId: this.$route.params.id,
        teacherId: this.search.teacherId,
        firstEntryStartTime: this.search.time && this.search.time.length > 0 ? (this.search.time[0] + ':00') : '',
        firstEntryEndTime: this.search.time && this.search.time.length > 0 ? (this.search.time[1] + ':59') : '',
        // studentPhone: this.search.phone,
        studentPhone: this.search.userInfo.value.tel,
        email: this.search.userInfo.value.Email,
        userType: this.search.userType,
        listenClassStartTime: this.search.listenClassStartTime && parseInt(this.search.listenClassStartTime) * 60 * 1000,
        listenClassEndTime: this.search.listenClassEndTime && parseInt(this.search.listenClassEndTime) * 60 * 1000,
        playbackListenClassStart: this.search.playbackListenClassStart && parseInt(this.search.playbackListenClassStart) * 60 * 1000,
        playbackListenClassEnd: this.search.playbackListenClassEnd && parseInt(this.search.playbackListenClassEnd) * 60 * 1000,
        totalListenClassStart: this.search.totalListenClassStart && parseInt(this.search.totalListenClassStart) * 60 * 1000,
        totalListenClassEnd: this.search.totalListenClassEnd && parseInt(this.search.totalListenClassEnd) * 60 * 1000,
        existInviteTeacher: this.search.existInviteTeacher,
        followerClue: this.search.followerClue,
        isAttendClass: this.search.isAttendClass,
        isFinishClass: this.search.isFinishClass,
        isWatchPlayback: this.search.isWatchPlayback,
        // studentUserId: this.search.studentUserId,
        studentUserId: this.search.userInfo.value.userName.userId,
        followUserId: this.search.followUserId
      }
      userRecordPageImport(data).then(res => {
        window.open(res.data)
        this.exportLoading = false
      }).catch(() => {
        this.exportLoading = false
      })
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
        teacherId: this.search.teacherId,
        firstEntryStartTime: this.search.time && this.search.time.length > 0 ? (this.search.time[0] + ':00') : '',
        firstEntryEndTime: this.search.time && this.search.time.length > 0 ? (this.search.time[1] + ':59') : '',
        // studentPhone: this.search.phone,
        studentPhone: this.search.userInfo.value.tel,
        email: this.search.userInfo.value.Email,
        userType: this.search.userType,
        listenClassStartTime: this.search.listenClassStartTime && parseInt(this.search.listenClassStartTime) * 60 * 1000,
        listenClassEndTime: this.search.listenClassEndTime && parseInt(this.search.listenClassEndTime) * 60 * 1000,
        playbackListenClassStart: this.search.playbackListenClassStart && parseInt(this.search.playbackListenClassStart) * 60 * 1000,
        playbackListenClassEnd: this.search.playbackListenClassEnd && parseInt(this.search.playbackListenClassEnd) * 60 * 1000,
        totalListenClassStart: this.search.totalListenClassStart && parseInt(this.search.totalListenClassStart) * 60 * 1000,
        totalListenClassEnd: this.search.totalListenClassEnd && parseInt(this.search.totalListenClassEnd) * 60 * 1000,
        existInviteTeacher: this.search.existInviteTeacher,
        followerClue: this.search.followerClue,
        isAttendClass: this.search.isAttendClass,
        isFinishClass: this.search.isFinishClass,
        isWatchPlayback: this.search.isWatchPlayback,
        // studentUserId: this.search.studentUserId,
        studentUserId: this.search.userInfo.value.userName.userId,
        followUserId: this.search.followUserId
      }
      if (this.search.sortBy) params.sortBy = this.search.sortBy
      if (this.search.sortType) params.sortType = this.search.sortType
      getUserRecordPage(params).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSortChange(val) {
      console.log(val, '点击排序触发')
      this.search.sortBy = {
        'listenClassTime': 1,
        'playbackListenClassTime': 2,
        'totalListenClassTime': 3
      }[val.prop]
      if (val.order === 'descending') {
        this.search.sortType = 1
      } else if (val.order === 'ascending') {
        this.search.sortType = 2
      } else {
        this.search.sortType = ''
        this.search.sortBy = ''
      }
      this.getList()
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
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        phoneNum: params.studentPhone,
        operationType: liveOperationType.type4
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        queryType: 2,
        email: params.email,
        operationType: liveOperationType.type4
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 点击手动同步按钮
    onhandleSync() {
      if (!this.ifCanClick) {
        return this.$message.error(`点击太频繁了，请${this.waitTime}秒后再点击`)
      }
      this.debounce(this.onSync)
    },
    onSync() {
      if (this.syncLoading) {
        return
      }
      this.syncLoading = true
      const data = {
        liveRoomId: this.$route.params.id
      }
      recordCluePull(data).then(res => {
        this.syncLoading = false
        this.$message.success({ message: '手动同步成功！' })
      }).catch(() => {
        this.syncLoading = false
      })
    },
    debounce(func) {
      this.ifCanClick = false
      func()
      clearInterval(this.timeout)
      this.timeout = null
      this.timeout = setInterval(() => {
        this.waitTime--
        if (this.waitTime <= 0) {
          clearInterval(this.timeout)
          this.timeout = null
          this.waitTime = 10
          this.ifCanClick = true
        }
      }, 1000)
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
    display: inline-block;
    margin-bottom: 10px;
  }
}
.pagination {
  margin-top: 10px;
  text-align: right;
}
.w-250 {
  width: 250px;
}
.w-100 {
  width: 100px;
}
</style>
