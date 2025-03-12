<template>
  <!-- 关联任务线索 -->
  <div class="relatedTaskClues">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
      @change="change"
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
              :get-api-fn="getLiveRoomUserInfoByName"
              search-key="nickName"
              :value="formOpts.formData.userInfo.value.studentUserId"
              :label="formOpts.formData.userInfo.value.nickName"
              :props="{ label: 'name', value: 'uid' }"
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
      <template #taskName>
        <el-select
          v-model="formOpts.formData.taskId"
          remote
          filterable
          clearable
          :remote-method="getLiveRoomTaskList"
          placeholder="请输入"
          @change="searchFn()"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
    </HokSearchForm>
    <div class="relatedTaskCluesContent">
      <div class="myTable custom-table">
        <el-table
          v-loading="loading"
          height="100%"
          :data="list"
          :header-cell-style="{ background: '#EFF2F6', color: '#000' }"
          :cell-style="{ color: '#333' }"
        >
          <el-table-column prop="userName" label="学员昵称" align="center">
            <template slot-scope="{ row }">
              {{ filtersTextPhone(row.userName) }}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号码" width="160">
            <template slot-scope="{ row }">
              <watchPhoneNumber
                :phone-area-code="row.phoneAreaCode"
                :default-value="row.phone"
                :params="row"
                :user-id="row.userId"
                :onhandle-click="operationLogsWrite"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="watchLivePhonePhone"
            label="看播手机号"
            width="160"
          >
            <template slot-scope="{ row }">
              <watchPhoneNumber
                :phone-area-code="row.watchLivePhoneAreaCode"
                :default-value="row.watchLivePhonePhone"
                :params="row"
                :user-id="row.userId"
                :onhandle-click="operationLogsWrite2"
              />
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="120">
            <template slot-scope="{ row }">
              <watchPhoneNumber
                :default-value="row.email"
                :params="row"
                :user-id="row.userId"
                :get-api="operationLogsWriteEmail"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="clueFollowUserName"
            label="跟进人"
            align="center"
          />
          <el-table-column prop="taskName" label="任务名称" align="center" />
          <el-table-column
            prop="flowOrderStatus"
            label="导流订单状态"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ mapOrderStatus(row.orderStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="isAttendance" label="是否到课" align="center">
            <template slot-scope="{ row }">
              {{ row.isAttendance ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column prop="callStatus" label="外呼结果" align="center">
            <template slot-scope="{ row }">
              {{
                { 0: '未知', 1: '未接通', 2: '客服接通', 3: '双方接通' }[
                  row.callStatus
                ]
              }}
            </template>
          </el-table-column>
          <el-table-column prop="active" label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.watchLivePhonePhone"
                type="text"
                :loading="row.callLoading"
                @click="onhandleCall(row)"
              >外呼</el-button>
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
import { searchStudent, liveRoomTaskList } from '@/api/liveRoom/liveRoom.js'
import { relatedTaskCluesOpts } from '../../data'
import { deepClone } from '@/utils/FormGenerator/index'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import AppSelect from '@/components/AppSelect'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { filtersTextPhone } from '@/utils/index'
import { planWatchUserQuery } from '@/api/liveRoom/index'
import Dialog from '@/views/live/liveRoomV2/Dialog/index.js'
import { mapState } from 'vuex'
export default {
  components: {
    HokSearchForm,
    AppSelect,
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
        ...deepClone(relatedTaskCluesOpts(this.searchFn).form),
        operatorList: [
          { label: '搜索', fn: this.searchFn },
          { label: '重置', type: 'plain', fn: this.clearFn }
        ]
      },
      list: [],
      currentPage: 1,
      options: [],
      pageSize: 10,
      liveRoomId: this.$route.params.id,
      total: 0,
      ulist: [],
      ulistLoading: false,
      valueUserName: ''
    }
  },
  computed: {
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
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    getLiveRoomTaskList(val = '') {
      console.log(val, '1111')
      if (val) {
        liveRoomTaskList({
          liveRoomId: this.$route.params.id,
          taskName: val
        }).then(res => {
          this.options = res.data.map(m => ({
            label: m.taskName,
            value: m.taskId
          }))
        })
      } else {
        this.options = []
      }
    },
    mapOrderStatus(val) {
      const data = this.formOpts.optionsObj.orderStatus
      const lable = data.find(f => f.value === val)?.label || '-'
      return lable
    },
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    selectedStudentUserId(e) {
      this.formOpts.formData.userInfo.value.studentUserId = e.uid
      this.formOpts.formData.userInfo.value.nickName = e.name
      this.searchFn()
    },
    getLiveRoomUserInfoByName(params) {
      const data = {
        // pageIndex: params.current,
        // pageSize: params.size,
        name: params.nickName
      }
      return searchStudent(data).then(res => {
        return {
          items: res.data,
          total: res.data.length
        }
      })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    clearFn() {
      this.formOpts.formData = {
        ...deepClone(relatedTaskCluesOpts(this.searchFn).form.formData)
      }
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
        clueFollowUserId: this.formOpts.formData.teacherId,
        phone: this.formOpts.formData.userInfo.value.phone,
        email: this.formOpts.formData.userInfo.value.email,
        userId: this.formOpts.formData.userInfo.value.studentUserId,
        isAttendance: this.formOpts.formData.isAttendance,
        taskId: this.formOpts.formData.taskId,
        orderStatus: this.formOpts.formData.orderStatus,
        channelId: this.formOpts.formData.channelId,
        userSource: 1
      }
      planWatchUserQuery(data)
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
    change() {
      this.searchFn()
    },
    userInfoTypeChange() {
      this.formOpts.formData.userInfo.value = {
        phone: '',
        studentUserId: '',
        email: ''
      }
    },
    // 手机号埋点
    operationLogsWrite(params) {
      console.log(params)
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        id: params.id,
        queryType: 1,
        phoneNum: params.studentPhone,
        operationType: 105
      }
      return this.$store.dispatch('im/sysUserWrite', data)
    },
    // 看播手机号埋点
    operationLogsWrite2(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        id: params.id,
        queryType: 1,
        phoneNum: params.studentPhone,
        operationType: 106
      }
      return this.$store.dispatch('im/sysUserWrite', data)
    },
    operationLogsWriteEmail(params) {
      console.log(params)
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        queryType: 2,
        id: params.id,
        email: params.email,
        operationType: 105
      }
      return this.$store.dispatch('im/sysUserWrite', data)
    },
    onhandleCall(res) {
      console.log(res, 'res')
      res.callLoading = true
      this.operationLogsWrite(res)
        .then(phoneRes => {
          Dialog.open({
            type: 'Outbound',
            visible: true,
            phoneAreaCode: res.phoneAreaCode,
            phone: phoneRes.data,
            userName: res.userName,
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
        })
        .catch(() => {
          res.callLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.relatedTaskClues {
  height: 100%;
}

.relatedTaskClues {
  padding: 20px 0 0;
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
  .relatedTaskCluesContent {
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
    width: auto !important;
  }
  .hok-search-form {
    margin-bottom: 0;
  }
  .el-table::before {
    height: 0px;
  }
}
.pl10 {
  padding-left: 10px;
}
</style>
