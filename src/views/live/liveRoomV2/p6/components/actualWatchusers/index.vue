<template>
  <!-- 实际看播用户 -->
  <div class="actualWatchusers">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    >
      <template #userInfo>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.userInfo.label"
            class="two-min-select w102"
            placeholder="请选择"
            @change="userInfoTypeChange"
          >
            <el-option
              v-for="item in formOpts.formData.userInfo.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <template v-if="formOpts.formData.userInfo.label === 'phone'">
            <el-input
              v-model="formOpts.formData.userInfo.value.phone"
              class="pl10"
              placeholder="请输入手机号"
              clearable
            />
          </template>
          <template
            v-else-if="formOpts.formData.userInfo.label === 'studentUserId'"
          >
            <AppSelect
              class="pl10"
              style="width: 100%"
              :get-api-fn="getLiveRoomUserInfoByName"
              search-key="nickName"
              :value="formOpts.formData.userInfo.value.studentUserId"
              :label="formOpts.formData.userInfo.value.nickName"
              :props="{ label: 'nickName', value: 'userId' }"
              @selected="selectedStudentUserId"
            />
          </template>
          <template v-if="formOpts.formData.userInfo.label === 'email'">
            <el-input
              v-model="formOpts.formData.userInfo.value.email"
              class="pl10"
              placeholder="请输入邮箱"
              clearable
              @keyup.enter.native="searchFn"
            />
          </template>
        </div>
      </template>
    </HokSearchForm>
    <!-- <el-row type="flex" justify="end" style="width: 100%; margin-bottom: 20px">
      <el-button size="small" :loading="exportLoading" @click="onhandleExport">导出记录</el-button>
    </el-row> -->
    <div class="actualWatchusersContent">
      <div class="myTable custom-table">
        <el-table
          v-loading="loading"
          height="100%"
          :data="list"
          :header-cell-style="{ background: '#EFF2F6', color: '#000' }"
          :cell-style="{ color: '#333' }"
          @sort-change="handleSortChange"
        >
          <el-table-column prop="teacherName" label="邀请人" />
          <el-table-column prop="studentAvatarUrl" label="学员头像">
            <template slot-scope="{ row }">
              <AppAvatar
                :name="row.studentName"
                :avatar="row.studentAvatarUrl"
                width="36"
                :no-name="true"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="studentName"
            label="学员昵称"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="{ row }">{{
              filtersTextPhone(row.studentName)
            }}</template>
          </el-table-column>
          <el-table-column prop="studentPhone" label="手机号码" width="160">
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
          <!-- <el-table-column prop="followUserName" label="跟进人" /> -->
          <el-table-column prop="userType" label="是否游客" align="center">
            <template slot-scope="{ row }">
              {{ { 1: '否', 2: '是' }[row.userType] }}
            </template>
          </el-table-column>
          <el-table-column prop="isApply" label="是否报名" align="center">
            <template slot-scope="{ row }">
              {{ { 0: '否', 1: '是' }[row.isApply] }}
            </template>
          </el-table-column>

          <el-table-column
            prop="applyTime"
            label="报名时间"
            align="center"
            width="140"
          >
            <template slot-scope="{ row }">
              {{ row.applyTime | filterTime }}
            </template>
          </el-table-column>

          <el-table-column
            prop="speakCount"
            label="发言次数"
            align="center"
            sortable="custom"
            width="120"
          />
          <el-table-column
            prop="goodsClickNum"
            label="点击商品次数"
            sortable="custom"
            width="130"
            align="center"
          />
          <el-table-column
            prop="orderCount"
            label="下单次数"
            align="center"
            width="120"
            sortable="custom"
          />
          <el-table-column
            prop="firstEntryTime"
            label="首次进入时间"
            width="140"
          >
            <template slot-scope="{ row }">
              {{ row.firstEntryTime | filterTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="lastDepartureTime"
            label="最后离开时间"
            width="140"
          >
            <template slot-scope="{ row }">
              {{ row.lastDepartureTime | filterTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="listenClassTime"
            label="直播听课时长(分)"
            align="center"
            sortable="custom"
            width="160"
          >
            <template slot-scope="{ row }">
              {{ row.listenClassTime | filterlistenClassTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="playbackListenClassTime"
            label="回放听课时长(分)"
            align="center"
            sortable="custom"
            width="160"
          >
            <template slot-scope="{ row }">
              {{ row.playbackListenClassTime | filterlistenClassTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="totalListenClassTime"
            label="总听课时长(分)"
            align="center"
            sortable="custom"
            width="160"
          >
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
          <!-- <el-table-column
            prop="isWatchPlayback"
            label="是否看回放"
            align="center"
            width="140"
          >
            <template slot-scope="{ row }">
              {{ row.isWatchPlayback ? '是' : '否' }}
            </template>
          </el-table-column> -->
          <el-table-column prop="active" label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.studentPhone"
                type="text"
                :loading="row.callLoading"
                @click="onhandleCall(row)"
              >
                外呼
              </el-button>
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
import {
  getLiveRoomUserInfoByName,
  getUserRecordPageV2,
  userRecordPageImport
} from '@/api/liveRoom/index.js'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { deepClone } from '@/utils/FormGenerator/index'
import { liveOperationType, userTypeOption } from '@/views/live/columns.js'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { actualWatchusersOpts } from '../../data'
import Dialog from '@/views/live/liveRoomV2/Dialog/index.js'
import { filtersTextPhone } from '@/utils/index'
import AppSelect from '@/components/AppSelect'
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'
export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
    },
    filterlistenClassTime(val) {
      if (!val) {
        return 0 + '分钟'
      }
      if (val < 60000) {
        return Math.floor(val / 1000) + '秒'
      }
      return Math.floor(val / 1000 / 60) + '分钟'
    }
  },
  components: {
    HokSearchForm,
    AppSelect,
    AppAvatar,
    watchPhoneNumber
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
      loading: false,
      formOpts: {
        ...deepClone(actualWatchusersOpts(this.searchFn).form),
        operatorList: [
          // { label: '搜索', fn: this.searchFn },
          // { label: '重置', type: 'plain', fn: this.clearFn },
          // { label: '导出记录', type: 'plain', loading: false, fn: this.onhandleExport }
        ]
      },
      userInfoType: {
        value: 'phone',
        options: [
          { label: '手机号', value: 'phone' },
          { label: '学员昵称', value: 'studentUserId' },
          { label: '邮箱', value: 'email' }
        ]
      },
      search: {
        sortBy: '',
        sortType: ''
      },
      // exportLoading: false,

      list: [],
      userTypeOption,
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  inject: ['permsList'],
  computed: {
    ...mapGetters(['permission_routes']),
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  watch: {
    userArray: {
      handler(val) {
        this.formOpts.optionsObj.teacherId = val
      },
      deep: true,
      immediate: true
    },
    permsList: {
      handler(val) {
        if (val.length > 0) {
          this.setOperatorList()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.setOperatorList()
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    setOperatorList() {
      const arr = [
        { label: '搜索', fn: this.searchFn },
        { label: '重置', type: 'plain', fn: this.clearFn }
      ]
      if (this.permsList.includes('btn:liveRoomV2:activeProfile:export')) {
        arr.push({
          label: '导出记录',
          type: 'plain',
          loading: false,
          fn: this.onhandleExport
        })
      }

      this.$set(this.formOpts, 'operatorList', arr)
    },
    onhandleExport() {
      this.$set(this.formOpts.operatorList[2], 'loading', true)
      // this.exportLoading = true
      const data = {
        liveRoomId: this.$route.params.id,
        teacherId: this.formOpts.formData.teacherId,
        studentPhone: this.formOpts.formData.userInfo.value.phone,
        email: this.formOpts.formData.userInfo.value.email,
        userType: this.formOpts.formData.userType,
        isApply: this.formOpts.formData.isApply,
        existInviteTeacher: this.formOpts.formData.existInviteTeacher,
        followerClue: this.formOpts.formData.followerClue,
        isAttendClass: this.formOpts.formData.isAttendClass,
        isFinishClass: this.formOpts.formData.isFinishClass,
        isWatchPlayback: this.formOpts.formData.isWatchPlayback,
        studentUserId: this.formOpts.formData.userInfo.value.studentUserId,
        followUserId: this.formOpts.formData.followUserId
      }
      userRecordPageImport(data)
        .then(res => {
          window.open(res.data)
          this.$set(this.formOpts.operatorList[2], 'loading', false)
          // this.exportLoading = false
        })
        .catch(() => {
          this.$set(this.formOpts.operatorList[2], 'loading', false)
          // this.exportLoading = false
        })
    },
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    clearFn() {
      this.formOpts.formData = {
        ...deepClone(actualWatchusersOpts(this.searchFn).form.formData)
      }
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
      this.list = []
      const params = {
        liveRoomId: this.$route.params.id,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        teacherId: this.formOpts.formData.teacherId,
        studentPhone: this.formOpts.formData.userInfo.value.phone,
        email: this.formOpts.formData.userInfo.value.email,
        userType: this.formOpts.formData.userType,
        isApply: this.formOpts.formData.isApply,
        existInviteTeacher: this.formOpts.formData.existInviteTeacher,
        followerClue: this.formOpts.formData.followerClue,
        isAttendClass: this.formOpts.formData.isAttendClass,
        isFinishClass: this.formOpts.formData.isFinishClass,
        isWatchPlayback: this.formOpts.formData.isWatchPlayback,
        studentUserId: this.formOpts.formData.userInfo.value.studentUserId,
        followUserId: this.formOpts.formData.followUserId
      }
      if (this.search.sortBy) params.sortBy = this.search.sortBy
      if (this.search.sortType) params.sortType = this.search.sortType
      getUserRecordPageV2(params)
        .then(res => {
          res.data.items.map(v => {
            v.callLoading = false
          })
          this.list = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSortChange(val) {
      console.log(val, '点击排序触发')
      this.search.sortBy = {
        listenClassTime: 1,
        playbackListenClassTime: 2,
        totalListenClassTime: 3,
        speakCount: 4,
        goodsClickNum: 5,
        orderCount: 6
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
    onhandleCall(res) {
      console.log(res, 'res')
      res.callLoading = true
      Dialog.open({
        type: 'Outbound',
        visible: true,
        userId: res.studentId,
        liveRoomDetail: this.liveRoomDetail,
        fail: () => {
          res.callLoading = false
        },
        // 通过结束 res 1：等待中 2: 呼叫中 3: 通话中 4: 已结束
        success: res => {},
        // 用户主动挂断通话
        hangUp: () => {
          res.callLoading = false
        },
        // 用户主动取消通话
        cancelCall: () => {
          res.callLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.actualWatchusers {
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
  .actualWatchusersContent {
    flex: 1 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    .myTable {
      flex: 1 0 0;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid #f2f2f2;
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
    width: 100% !important;
  }
  .hok-search-form {
    margin-bottom: 0;
  }
  .el-table::before {
    height: 0px;
  }

  /**改变边框颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border,
  .custom-table.el-table--group {
    border: 1px solid #eff2f6 !important;
  }
  /**改变表格内竖线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border td,
  .custom-table.el-table--border th,
  .custom-table.el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-right: 1px solid #eff2f6 !important;
  }
  /**改变合并单元格横线颜色===》.custom-table指定上面的类id */
  .custom-table .el-table--border th.el-table__cell {
    border-bottom: 1px solid #eff2f6;
  }
  /**改变表格内常规行线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table td,
  .custom-table.el-table th.is-leaf {
    border-bottom: 1px solid #eff2f6 !important;
  }
  .custom-table .el-table th.el-table__cell.is-leaf,
  .el-table td.el-table__cell {
    border-bottom: 1px solid #eff2f6 !important;
  }
}
.pl10 {
  padding-left: 10px;
}
</style>
