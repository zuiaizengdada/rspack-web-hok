<template>
  <!-- 实际看播用户  -->
  <div>
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    >
      <template #teacherId>
        <el-select
          v-model="formOpts.formData.teacherId"
          size="small"
          filterable
          placeholder="请选择邀请人"
          clearable
          @change="searchFn()"
        >
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </template>
      <template #keyword>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.keyword"
            placeholder="请选择"
            style="width: 115px; border-right: 1px solid #dcdee1"
            @change="searchFn()"
          >
            <el-option label="手机号" value="studentPhone" />
            <el-option label="学员昵称" value="userName" />
            <el-option label="邮箱" value="email" />
          </el-select>
          <el-input
            v-if="formOpts.formData.keyword !== 'userName'"
            v-model="formOpts.formData.keywordVal"
            style="padding-left: 8px"
            placeholder="请输入"
          />

          <AppSelect
            v-else
            class="usersl"
            style="padding-left: 8px"
            :get-api-fn="getLiveRoomUserInfoByName"
            search-key="nickName"
            :value="formOpts.formData.studentUserId"
            :label="formOpts.formData.nickName"
            :props="userNameObj"
            @selected="selectedStudentUserId"
          />
        </div>
      </template>
      <template #time4>
        <el-input
          v-model="formOpts.formData.listenClassStartTime"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 135px"
          @input="delNumber($event, 'listenClassStartTime')"
        />
        -
        <el-input
          v-model="formOpts.formData.listenClassEndTime"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 135px"
          @input="delNumber($event, 'listenClassEndTime')"
        />
      </template>
      <template #time2>
        <el-input
          v-model="formOpts.formData.playbackListenClassStart"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 135px"
          @input="delNumber($event, 'playbackListenClassStart')"
        />
        -
        <el-input
          v-model="formOpts.formData.playbackListenClassEnd"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 135px"
          @input="delNumber($event, 'playbackListenClassEnd')"
        />
      </template>
      <template #time3>
        <el-input
          v-model="formOpts.formData.totalListenClassStart"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 135px"
          @input="delNumber($event, 'totalListenClassStart')"
        />
        -
        <el-input
          v-model="formOpts.formData.totalListenClassEnd"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 135px"
          @input="delNumber($event, 'totalListenClassEnd')"
        />
      </template>
    </HokSearchForm>
    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
      @sort-change="sortChange"
    >
      <template v-slot:studentAvatarUrl="{ scope }">
        <AppAvatar
          :name="scope.row.studentName"
          :avatar="scope.row.studentAvatarUrl"
          width="36"
          :no-name="true"
        />
        <span v-if="!scope.row.studentAvatarUrl">-</span>
      </template>
      <template v-slot:studentPhone="{ scope }">
        <watchPhoneNumber
          :phone-area-code="scope.row.phoneAreaCode"
          :default-value="scope.row.studentPhone"
          :params="scope.row"
          :user-id="scope.row.studentId"
          :get-api="operationLogsWrite"
        />
        <span v-if="!scope.row.studentPhone">-</span>
      </template>
      <template v-slot:email="{ scope }">
        <watchPhoneNumber
          :default-value="scope.row.email"
          :params="scope.row"
          :user-id="scope.row.studentId"
          :get-api="operationLogsWriteEmail"
        />
        <span v-if="!scope.row.email">-</span>
      </template>
    </ZBTable>
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns, formConfig } from './columns'
import { liveOperationType, userTypeOption } from '../../../../columns'
import {
  getUserRecordPageV2,
  getLiveRoomUserInfoByName,
  userRecordPageImport
} from '@/api/liveRoom/index'
import { userNoPage } from '@/api/addressBookApi'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import moment from 'moment'
import AppSelect from '@/components/AppSelect'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    ZBTable,
    HokSearchForm,
    watchPhoneNumber,
    AppSelect,
    AppAvatar
  },
  data() {
    return {
      userTypeOption,
      moment,
      columns,
      formOpts: {
        ...formConfig,
        operatorList: []
      },
      permsList: this.$route.meta.permsList || [],
      userNameObj: {
        label: 'nickName',
        value: 'userId'
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      userArray: [],
      orderStatusList: [],
      bindClickKeys: [
        'isAttendClass',
        'isFinishClass',
        'isWatchPlayback',
        'userType',
        'existInviteTeacher'
      ],
      exportLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    // 绑定change事件
    this.formOpts.fieldList.forEach(item => {
      if (this.bindClickKeys.includes(item.prop)) {
        item.eventHandler.change = () => {
          this.searchFn()
        }
      }
    })
    this.loadUserNoPage()
    this.setOperatorList()
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    setOperatorList() {
      const arr = [
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
      if (
        this.permsList &&
        this.permsList.includes('btn:liveDetail:userRecordsExport')
      ) {
        arr.push({
          label: '导出记录',
          type: 'plain',
          bind: {
            loading: this.exportLoading
          },
          fn: () => {
            this.onhandleExport()
          },
          className: ['right']
        })
      }

      this.$set(this.formOpts, 'operatorList', arr)
    },
    // 点击导出记录
    onhandleExport() {
      this.exportLoading = true
      const data = {
        ...this.tableConfig,
        ...this.formOpts.formData,
        liveRoomId: this.$route.params.id,
        firstEntryStartTime:
          this.formOpts.formData.time1 && this.formOpts.formData.time1[0]
            ? moment(this.formOpts.formData.time1[0]).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            : undefined,
        firstEntryEndTime:
          this.formOpts.formData.time1 && this.formOpts.formData.time1[1]
            ? moment(this.formOpts.formData.time1[1]).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            : undefined,
        listenClassStartTime:
          this.formOpts.formData.listenClassStartTime &&
          parseInt(this.formOpts.formData.listenClassStartTime) * 60 * 1000,
        listenClassEndTime:
          this.formOpts.formData.listenClassEndTime &&
          parseInt(this.formOpts.formData.listenClassEndTime) * 60 * 1000,
        playbackListenClassStart:
          this.formOpts.formData.playbackListenClassStart &&
          parseInt(this.formOpts.formData.playbackListenClassStart) * 60 * 1000,
        playbackListenClassEnd:
          this.formOpts.formData.playbackListenClassEnd &&
          parseInt(this.formOpts.formData.playbackListenClassEnd) * 60 * 1000,
        totalListenClassStart:
          this.formOpts.formData.totalListenClassStart &&
          parseInt(this.formOpts.formData.totalListenClassStart) * 60 * 1000,
        totalListenClassEnd:
          this.formOpts.formData.totalListenClassEnd &&
          parseInt(this.formOpts.formData.totalListenClassEnd) * 60 * 1000
      }
      userRecordPageImport(data)
        .then(res => {
          window.open(res.data)
          this.exportLoading = false
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    sortChange({ column, prop, order }) {
      this.tableConfig.sortBy =
        prop === 'listenClassTime'
          ? 1
          : prop === 'playbackListenClassTime'
          ? 2
          : 3
      this.tableConfig.sortType =
        order === 'ascending' ? 2 : order === 'descending' ? 1 : undefined

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
    },
    selectedStudentUserId(e) {
      this.formOpts.formData.studentUserId = e.userId
      this.formOpts.formData.nickName = e.nickName
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
    // 限制只能输入英文和数字
    delNumber(e, type) {
      this.formOpts.formData[type] = e.replace(/[^0-9]/g, '')
    },
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
          teacherId: undefined, // 邀请人
          keywordVal: undefined, //
          keyword: 'studentPhone', //
          isAttendClass: '', // 是否到课
          isFinishClass: '', // 是否完课
          isWatchPlayback: '', // 是否看回看
          userType: undefined, // 是否游客
          time1: undefined, // 首次进入时间
          time2: undefined, // 回看听课时长
          time3: undefined, // 总听课时长
          existInviteTeacher: true // 仅查看邀约学员
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      if (this.formOpts.formData.keyword !== 'userName') {
        this.formOpts.formData.studentUserId = undefined
        this.formOpts.formData.nickName = undefined
      }
      const params = {
        ...this.tableConfig,
        ...this.formOpts.formData,
        liveRoomId: this.$route.params.id,
        [this.formOpts.formData.keyword]: this.formOpts.formData.keywordVal,
        firstEntryStartTime:
          this.formOpts.formData.time1 && this.formOpts.formData.time1[0]
            ? moment(this.formOpts.formData.time1[0]).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            : undefined,
        firstEntryEndTime:
          this.formOpts.formData.time1 && this.formOpts.formData.time1[1]
            ? moment(this.formOpts.formData.time1[1]).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            : undefined,
        listenClassStartTime:
          this.formOpts.formData.listenClassStartTime &&
          parseInt(this.formOpts.formData.listenClassStartTime) * 60 * 1000,
        listenClassEndTime:
          this.formOpts.formData.listenClassEndTime &&
          parseInt(this.formOpts.formData.listenClassEndTime) * 60 * 1000,
        playbackListenClassStart:
          this.formOpts.formData.playbackListenClassStart &&
          parseInt(this.formOpts.formData.playbackListenClassStart) * 60 * 1000,
        playbackListenClassEnd:
          this.formOpts.formData.playbackListenClassEnd &&
          parseInt(this.formOpts.formData.playbackListenClassEnd) * 60 * 1000,
        totalListenClassStart:
          this.formOpts.formData.totalListenClassStart &&
          parseInt(this.formOpts.formData.totalListenClassStart) * 60 * 1000,
        totalListenClassEnd:
          this.formOpts.formData.totalListenClassEnd &&
          parseInt(this.formOpts.formData.totalListenClassEnd) * 60 * 1000
      }
      delete params.keyword
      delete params.keywordVal
      return new Promise((resolve, reject) => {
        delete params.time1
        getUserRecordPageV2(params)
          .then(res => {
            const resTmp = res
            resTmp.data.items.forEach(item => {
              item.applyTime = this.filterTime(item.applyTime)
              item.firstEntryTime = this.filterTime(item.firstEntryTime)
              item.lastDepartureTime = this.filterTime(item.lastDepartureTime)
              item.listenClassTime = this.filterlistenClassTime(
                item.listenClassTime
              )
              item.playbackListenClassTime = this.filterlistenClassTime(
                item.playbackListenClassTime
              )
              item.totalListenClassTime = this.filterlistenClassTime(
                item.totalListenClassTime
              )
              item.userType = userTypeOption.find(
                f => f.value === item.userType
              ).label
              item.isAttendClass = item.isAttendClass ? '是' : '否'
              item.isFinishClass = item.isFinishClass ? '是' : '否'
              item.isWatchPlayback = item.isWatchPlayback ? '是' : '否'
              item.isApply = item.isApply === 1 ? '是' : '否'
            })
            resolve(resTmp)
          })
          .catch(() => {
            reject()
          })
      })
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
