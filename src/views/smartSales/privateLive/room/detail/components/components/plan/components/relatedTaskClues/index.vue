<template>
  <!-- 关联任务线索  -->
  <div>
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    >
      <template #clueFollowUserId>
        <m-select
          v-model="formOpts.formData.clueFollowUserId"
          filterable
          placeholder="请选择跟进人"
          clearable
          style="width: 100%"
          :dict-list="userArray"
          :param="{ value: 'userId', label: 'nickName' }"
          @change="searchFn()"
        />
      </template>

      <template #keyword>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.keyword"
            placeholder="请选择"
            style="width: 115px; border-right: 1px solid #dcdee1"
          >
            <el-option label="手机号" value="phone" />
            <el-option label="学员昵称" value="userName" />
            <el-option label="邮箱" value="email" />
          </el-select>
          <el-input
            v-model="formOpts.formData.keywordVal"
            style="padding-left: 8px"
            placeholder="请输入"
          />
          <!-- <el-select
            v-else
            v-model="valueUserName"
            placeholder="请选择"
            remote
            filterable
            clearable
            style="padding-left: 8px"
            :remote-method="getLiveRoomUserInfoByName"
            :loading="ulistLoading"
            @change="selectedStudentUserId"
          >
            <el-option
              v-for="item in ulist"
              :key="item.uid"
              :label="item.name"
              :value="item.uid"
            />
          </el-select> -->
          <!-- <AppSelect
            v-else
            class="usersl"
            style="padding-left: 8px"
            :get-api-fn="getLiveRoomUserInfoByName"
            search-key="nickName"
            :value="formOpts.formData.userId"
            :label="formOpts.formData.userName"
            :props="userNameObj"
            @selected="selectedStudentUserId"
          /> -->
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
    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:phone="{ scope }">
        <watchPhoneNumber
          :phone-area-code="scope.row.phoneAreaCode"
          :default-value="scope.row.phone"
          :params="scope.row"
          :user-id="scope.row.userId"
          :onhandle-click="operationLogsWrite"
        />
      </template>
      <template v-slot:watchLivePhonePhone="{ scope }">
        <watchPhoneNumber
          :phone-area-code="scope.row.watchLivePhoneAreaCode"
          :default-value="scope.row.watchLivePhonePhone"
          :params="scope.row"
          :user-id="scope.row.userId"
          :onhandle-click="operationWatchLiveLogsWrite"
        />
      </template>
      <template v-slot:email="{ scope }">
        <watchPhoneNumber
          :default-value="scope.row.email"
          :params="scope.row"
          :user-id="scope.row.userId"
          :get-api="operationLogsWriteEmail"
        />
      </template>
      <template v-slot:orderStatus="{ scope }">
        {{ mapOrderStatus(scope.row.orderStatus) }}
      </template>
      <template v-slot:isAttendance="{ scope }">
        {{ scope.row.isAttendance ? '是' : '否' }}
      </template>
      <template v-slot:callStatus="{ scope }">
        {{
          scope.row.callStatus === 1
            ? '呼叫失败'
            : scope.row.callStatus === 2
              ? '呼叫中'
              : scope.row.callStatus === 3
                ? '通话中'
                : scope.row.callStatus === 5
                  ? '呼叫成功'
                  : '-'
        }}
      </template>
      <template v-slot:operate="{ scope }">
        <el-button type="text" @click="onhandleCall(scope.row)">
          外呼
        </el-button>
      </template>
    </ZBTable>
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { sysUserWrite } from '@/api/liveRoom/setting.js'
// import { liveOperationType } from '../../../../../../columns'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns, formConfig } from './columns'
import {
  planWatchUserQuery,
  getLiveRoomInfo,
  // getLiveRoomUserInfoByName,
  liveRoomTaskList,
  searchStudent
} from '@/api/liveRoom/index'
import { userNoPage } from '@/api/addressBookApi'
import Dialog from '@/views/live/liveRoomV2/Dialog/index.js'
// import AppSelect from '@/components/AppSelect'
export default {
  components: { ZBTable, HokSearchForm, watchPhoneNumber },
  data() {
    return {
      columns,
      formOpts: {
        ...formConfig,
        operatorList: [
          {
            label: '查询',
            bind: { plain: true },
            fn: () => {
              this.searchFn()
            }
          },
          {
            label: '重置',
            type: 'plain',
            fn: () => {
              this.searchFn(true)
            }
          }
        ]
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      userNameObj: {
        label: 'nickName',
        value: 'userId'
      },
      liveRoomDetail: {},
      userArray: [],
      options: [],
      bindClickKeys: ['isAttendance', 'orderStatus', 'channelId'],
      ulist: [],
      valueUserName: '',
      ulistLoading: false
    }
  },
  created() {
    this.getDetail()
    this.loadUserNoPage()

    // 绑定change事件
    this.formOpts.fieldList.forEach(item => {
      if (this.bindClickKeys.includes(item.prop)) {
        item.eventHandler.change = () => {
          this.searchFn()
        }
      }
    })
    this.tableConfig.pageSize = 10
    this.formOpts.formData = {
      clueFollowUserId: undefined, //  	跟进人
      keywordVal: undefined, //
      keyword: 'phone', //
      isAttendance: 2, //  	是否到课
      taskName: undefined, //  	任务名称
      orderStatus: '' //  	订单状态
    }
    this.$nextTick(() => {
      this.searchFn()
    })
  },
  methods: {
    getLiveRoomTaskList(val = '') {
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
    selectedStudentUserId(e) {
      const info = this.ulist.find(f => f.uid === e)
      this.formOpts.formData.userId = e || undefined
      this.formOpts.formData.userName = info && info.name ? info.name : undefined
      this.searchFn()
    },
    getLiveRoomUserInfoByName(params) {
      const data = {
        name: params
      }
      this.ulistLoading = true
      return searchStudent(data)
        .then(res => {
          this.ulistLoading = false
          this.ulist = [...res.data]
        })
        .catch(() => {
          this.ulistLoading = false
        })
    },
    // 获取详情数据
    getDetail() {
      const params = {
        liveRoomId: this.$route.params.id
      }
      getLiveRoomInfo(params)
        .then(res => {
          this.liveRoomDetail = { ...res.data }
        })
        .catch(() => {})
    },
    onhandleCall(res) {
      console.log(res)
      if (res.phone && res.phoneAreaCode !== '86') {
        this.$message.warning('暂不支持国外号码')
        return
      }
      this.callLoading = true
      Dialog.open({
        type: 'Outbound',
        visible: true,
        userId: res.userId,
        liveRoomDetail: this.liveRoomDetail,
        fail: () => {
          this.callLoading = false
        },
        // 通过结束 res 1：等待中 2: 呼叫中 3: 通话中 4: 已结束
        success: res => {},
        // 用户主动挂断通话
        hangUp: () => {
          this.callLoading = false
        },
        // 用户主动取消通话
        cancelCall: () => {
          this.callLoading = false
        }
      })
    },
    mapOrderStatus(val) {
      const data = this.formOpts.optionsObj.orderStatus
      const lable = data.find(f => f.value === val)?.label || '-'
      return lable
    },
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        queryType: 2,
        id: params.id,
        email: params.email,
        operationType: 105
      }
      return sysUserWrite(data)
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    loadUserNoPage() {
      const params = {
        deptId: '',
        nickName: '',
        status: 0
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    operationWatchLiveLogsWrite(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        id: params.id,
        queryType: 1,
        phoneNum: params.studentPhone,
        operationType: 106
      }
      return sysUserWrite(data)
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        id: params.id,
        queryType: 1,
        phoneNum: params.studentPhone,
        operationType: 105
      }
      return sysUserWrite(data)
    },
    orderStatusChange(e) {
      console.log(e)
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {
          clueFollowUserId: undefined, //  	跟进人
          keywordVal: undefined, //
          keyword: 'phone', //
          isAttendance: 2, //  	是否到课
          taskName: undefined, //  	任务名称
          orderStatus: '' //  	订单状态
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      if (this.formOpts.formData.keyword !== 'userName') {
        this.formOpts.formData.userId = undefined
        this.formOpts.formData.userName = undefined
      }
      const params = {
        liveRoomId: this.$route.params.id,
        ...this.tableConfig,
        ...this.formOpts.formData,
        [this.formOpts.formData.keyword]: this.formOpts.formData.keywordVal,
        userSource: 1
      }
      delete params.keyword
      delete params.keywordVal
      return planWatchUserQuery(params)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .usersl {
    .tearchInput {
      width: 295px !important;
    }
  }
}
</style>
