<template>
  <!-- 关联任务线索  -->
  <div>
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    >
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

          <!-- v-if="formOpts.formData.keyword !== 'userName'" -->
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
          v-if="scope.row.phone"
          :phone-area-code="scope.row.phoneAreaCode"
          :default-value="scope.row.phone"
          :params="scope.row"
          :user-id="scope.row.userId"
          :onhandle-click="operationLogsWrite"
        />
        <span v-else>-</span>
      </template>
      <template v-slot:email="{ scope }">
        <watchPhoneNumber
          v-if="scope.row.email"
          :default-value="scope.row.email"
          :params="scope.row"
          :user-id="scope.row.userId"
          :onhandle-click="operationLogsWriteEmail"
        />
        <span v-else>-</span>
      </template>
      <template v-slot:orderStatus="{ scope }">
        {{ mapOrderStatus(scope.row.orderStatus) }}
      </template>
      <template v-slot:isAttendance="{ scope }">
        {{ scope.row.isAttendance ? '是' : '否' }}
      </template>
      <template v-slot:operate="{ scope }">
        <el-button type="text" style="color: #f53f3f" @click="del(scope.row)">
          删除
        </el-button>
        <el-button
          v-if="scope.row.phone && scope.row.phoneAreaCode === '86'"
          type="text"
          @click="onhandleCall(scope.row)"
        >
          外呼
        </el-button>
      </template>
    </ZBTable>
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import {
  planWatchUserQuery,
  deleteImportUser,
  getLiveRoomInfo,
  getLiveRoomUserInfoByName
} from '@/api/liveRoom/index'
// import { liveOperationType } from '../../../../../../columns'
// import { getItem } from '@/utils/localStorage'
import { sysUserWrite } from '@/api/liveRoom/setting.js'
import { columns, formConfig } from './columns'
import Dialog from '@/views/live/liveRoomV2/Dialog/index.js'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { userNoPage } from '@/api/addressBookApi'
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
      userNameObj: {
        label: 'nickName',
        value: 'userId'
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      bindClickKeys: ['isAttendance'],
      userArray: []
    }
  },
  created() {
    this.getDetail()
    this.loadUserNoPage()
    this.formOpts.formData = {
      keywordVal: undefined, //
      keyword: 'phone', //   学员昵称,手机号，邮箱
      isAttendance: 2, //  	是否到课
      userId: '',
      userName: ''
    } // 绑定change事件
    this.formOpts.fieldList.forEach(item => {
      if (this.bindClickKeys.includes(item.prop)) {
        item.eventHandler.change = () => {
          this.searchFn()
        }
      }
    })
    this.$nextTick(() => {
      this.searchFn()
    })
  },
  methods: {
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
      this.formOpts.formData.userId = e.userId
      this.formOpts.formData.userName = e.nickName
      this.searchFn()
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
      this.callLoading = true
      if (res.phone && res.phoneAreaCode !== '86') {
        this.$message.warning('暂不支持国外号码')
        return
      }
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
    del(row) {
      this.$delModal({
        tips: `是否删除该用户！`,
        success: () => {
          deleteImportUser({
            id: row.id,
            liveRoomId: this.$route.params.id
          }).then(() => {
            this.searchFn()
          })
        },
        fail: () => {}
      })
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {
          keywordVal: undefined, //
          keyword: 'phone', //   学员昵称,手机号，邮箱
          isAttendance: 2, //  	是否到课
          userId: '',
          userName: ''
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      if (this.formOpts.formData.keyword !== 'userName') {
        this.formOpts.formData.userId = undefined
        this.formOpts.formData.userName = undefined
      }
      console.log(this.formOpts.formData, 'vvvvvvvv')
      const params = {
        liveRoomId: this.$route.params.id,
        ...this.tableConfig,
        ...this.formOpts.formData,
        [this.formOpts.formData.keyword]: this.formOpts.formData.keywordVal,
        // userName: this.formOpts.formData.userName || undefined,
        userSource: 2
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
