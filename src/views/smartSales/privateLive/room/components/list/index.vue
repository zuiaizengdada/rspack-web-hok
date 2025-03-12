<template>
  <!-- 所有直播间列表  -->
  <div class="live-wrapper">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
      style="margin-top: 20px"
    >
      <template #liveRoomCodeOrliveRoomName>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.liveRoomCodeOrliveRoomName"
            placeholder="请选择"
            style="width: 115px; border-right: 1px solid #dcdee1"
          >
            <el-option label="直播间ID" value="liveRoomCode" />
            <el-option label="直播名称" value="liveRoomName" />
          </el-select>
          <el-input
            v-model="formOpts.formData.liveRoomCodeOrliveRoomNameVal"
            style="padding-left: 8px"
            placeholder="请输入"
          />
        </div>
      </template>
      <template v-if="formOpts.formData.liveModel" #js>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.realityTeacherUserIdOrvideoTeacherId"
            placeholder="请选择"
            style="width: 115px; border-right: 1px solid #dcdee1"
          >
            <el-option label="真人讲师" value="realityTeacherUserId" />
            <el-option label="录播讲师" value="videoTeacherId" />
          </el-select>
          <el-select
            v-show="formOpts.formData.liveModel === 'PERSON_LIVE'"
            v-model="formOpts.formData.realityTeacherUserId"
            style="padding-left: 8px"
            filterable
            placeholder="请选择讲师"
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
          <AppSelect
            v-show="formOpts.formData.liveModel === 'AI_LIVE'"
            style="padding-left: 8px"
            class="filter_teacherSelect"
            :get-api-fn="getTeacherList"
            search-key="teacherName"
            :value="formOpts.formData.teacherId"
            :label="formOpts.formData.teacherName"
            :props="teacherObj"
            @selected="selectedTeacher"
          />
        </div>
      </template>
      <template #status>
        <el-select
          v-model="formOpts.formData.status"
          placeholder="请选择"
          clearable
          @change="searchFn()"
        >
          <el-option
            v-for="(item, key) in liveStateOption.filter(v => v.value !== '-1')"
            :key="key"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </template>
      <template #createUserId>
        <el-select
          v-model="formOpts.formData.createUserId"
          filterable
          placeholder="请选择创建人"
          clearable
          @change="searchFn()"
        >
          <el-option-group
            v-for="group in createOptions"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-option-group>
        </el-select>
      </template>
      <template #tutorTeacherUserId>
        <el-select
          v-model="formOpts.formData.tutorTeacherUserId"
          filterable
          placeholder="请选择"
          clearable
          @change="searchFn()"
        >
          <el-option-group
            v-for="group in tutorTeacherUserIdOptions"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-option-group>
        </el-select>
      </template>
      <template #time1ortime2>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.time1ortime2"
            placeholder="请选择"
            style="width: 115px; border-right: 1px solid #dcdee1"
          >
            <el-option label="开播时间" value="time1" />
            <el-option label="创建时间" value="time2" />
          </el-select>
          <el-date-picker
            v-model="formOpts.formData.time1ortime2Val"
            style="padding-left: 8px"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="searchFn()"
          />
        </div>
      </template>
      <template #type>
        <el-tooltip
          class="item"
          effect="dark"
          content="测试直播间创建后可删除，测试数据不纳入数据看板统计。正式直播间开播后不可删除。"
        >
          <i class="el-icon-info" style="font-size: 15px; margin-right: 6px" />
        </el-tooltip>
        <el-radio-group v-model="formOpts.formData.type" @change="searchFn()">
          <el-radio label="">全部</el-radio>
          <el-radio :label="1">正式</el-radio>
          <el-radio :label="2">测试</el-radio>
        </el-radio-group>
      </template>
      <template #feesType>
        <el-tooltip
          class="item"
          effect="dark"
          content="免费类型，所有用户可进入直播间，付费类型只有购买关联课程后的用户才能进入直播间"
        >
          <i class="el-icon-info" style="font-size: 15px; margin-right: 6px" />
        </el-tooltip>
        <el-radio-group
          v-model="formOpts.formData.feesType"
          @change="searchFn()"
        >
          <el-radio label="">全部</el-radio>
          <el-radio :label="1">免费</el-radio>
          <el-radio :label="2">付费</el-radio>
        </el-radio-group>
      </template>
    </HokSearchForm>

    <ZBTable
      ref="zbTableRef"
      key="liveLiveKey"
      :columns="columns"
      height="520px"
      :get-list="getList"
      is-left-bottom-slot
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:type="{ scope }">
        <span>
          {{ { 1: '正式', 2: '测试' }[scope.row.type] }}
        </span>
      </template>
      <template v-slot:feesType="{ scope }">
        <span>
          {{ { 1: '免费', 2: '付费' }[scope.row.feesType] }}
        </span>
      </template>
      <template v-slot:liveModel="{ scope }">
        <span
          :style="{
            color: scope.row.liveModel === 'AI_LIVE' ? '#00C313' : '#1989FA'
          }"
        >
          {{ scope.row.liveModel | getOptionsValue(liveModeOption) }}
        </span>
      </template>
      <template v-slot:teacherInfoDtoList="{ scope }">
        <span>
          <textShowMore :line-clamp="1" :text="renderTearch(scope.row)" />
        </span>
      </template>
      <template v-slot:startTime="{ scope }">
        <span>
          {{ moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>
      <template v-slot:liveDuration="{ scope }">
        <span>
          {{ renderLiveDuration(scope.row.liveDuration) }}
        </span>
      </template>
      <template v-slot:gmv="{ scope }">
        <span>
          {{ scope.row.gmv | filtersMoneyByZero }}
        </span>
      </template>
      <template v-slot:status="{ scope }">
        <div class="liveType" :class="`liveType${scope.row.status}`">
          <div style="display: flex; align-items: center; font-size: 11px">
            <svg-icon
              class-name="liveTypeicon"
              :icon-class="
                {
                  0: 'livenostart',
                  1: 'liveIng',
                  2: 'liveSuspend',
                  3: 'liveError',
                  9: 'audit_info'
                }[scope.row.status]
              "
            />{{ scope.row.status | getOptionsValue(liveStateOption) }}
          </div>
        </div>
      </template>
      <template v-slot:createTime="{ scope }">
        <span>
          {{ moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>

      <template v-slot:operate="{ scope }">
        <template v-if="canshowTools(scope.row)">
          <el-button
            v-permission="['btn:liveRoomlist:detail', permsList]"
            type="text"
            style="margin-right: 10px; margin-left: 0px"
            @click="onhandleDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-if="canShowGotoLiveRoom(scope.row)"
            v-permission="['btn:liveRoomlist:inviteLive', permsList]"
            type="text"
            style="margin-right: 10px; margin-left: 0px"
            @click="onhandleInvite(scope.row)"
          >
            邀课链接
          </el-button>
          <el-button
            v-if="canShowGotoLiveRoom(scope.row)"
            v-permission="['btn:liveRoomlist:enterLive', permsList]"
            type="text"
            style="margin-right: 10px; margin-left: 0px"
            @click="onhandleGotoLiveRoom(scope.row)"
          >
            进入直播
          </el-button>
        </template>

        <el-button
          v-permission="['btn:liveRoomlist:copyLive', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="onhandleCopyLive(scope.row)"
        >
          复制直播间
        </el-button>
        <el-button
          v-if="
            canshowTools(scope.row) &&
            (scope.row.type === 1
              ? scope.row.status === 0 &&
                scope.row.createUserId === userInfo.userId
              : scope.row.createUserId === userInfo.userId)
          "
          v-permission="['btn:liveRoomlist:delLive', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px; color: #f53f3f"
          @click="onhandleDel(scope.row)"
        >
          删除
        </el-button>
      </template>
      <template #footer>
        <!-- <el-button
          v-permission="['web:liveRoomlist:restart', permsList]"
          :loading="batchRestartLoading"
          size="small"
          type="text"
          @click="onhandleBatchRestart"
        >
          批量重启
        </el-button> -->
        <div />
      </template>
    </ZBTable>
    <InviteDialog :config="inviteConfig" @close="closeInviteDialog" />
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { columns, formConfig } from './columns'
import {
  liveStateOption,
  liveModeOption,
  renderTearch,
  renderLiveDuration
} from '../../columns'
import { getTeacherList } from '@/api/tearchCenter/index'
import { userNoPage } from '@/api/addressBookApi'
import AppSelect from '@/components/AppSelect/index.vue'
import {
  getLiveRoomList,
  delLiveRoom,
  canEnterLiveRoom,
  restartTask
} from '@/api/liveRoom/index'
import Dialog from '@/views/smartSales/privateLive/room/components/Dialog'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import textShowMore from '@/components/textShowMore/index2'
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'
import InviteDialog from '@/views/live/liveList/component/InviteDialog2.vue'
import {
  personSetUpRecordDetail,
  personSetUpRecordSave
} from '@/api/liveRoom/index'
import { setItem, getItem } from '@/utils/localStorage'
export default {
  components: {
    HokSearchForm,
    AppSelect,
    ZBTable,
    textShowMore,
    InviteDialog
  },
  data() {
    return {
      liveStateOption,
      liveModeOption,
      columns,
      formOpts: {
        ...formConfig,
        operatorList: []
      },
      enterLiveRoom: false,
      userArray: [],
      createOptions: [
        { label: '历史记录', options: [] },
        { label: '请选择', options: [] }
      ],
      tutorTeacherUserIdOptions: [
        { label: '历史记录', options: [] },
        { label: '请选择', options: [] }
      ],
      permsList: this.$route.meta.permsList || [],
      addConfig: {
        visible: false,
        type: 1
      },
      inviteConfig: {
        visible: false,
        row: {}
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      batchRestartLoading: false,
      multipleSelection: [],
      bindClickKeys: ['liveModel'],
      teacherObj: {
        label: 'teacherName',
        value: 'teacherId'
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission_routes']),
    ...mapState({
      ifAddLiveRoom: state => state.im.ifAddLiveRoom
    })
  },
  watch: {
    'formOpts.formData.liveModel': {
      handler(val) {
        if (val) {
          this.formOpts.fieldList[2].isHide = false
          this.formOpts.formData.realityTeacherUserIdOrvideoTeacherId =
            val === 'PERSON_LIVE' ? 'realityTeacherUserId' : 'videoTeacherId'
        } else {
          this.formOpts.formData.realityTeacherUserIdOrvideoTeacherId =
            'realityTeacherUserId'
          this.formOpts.fieldList[2].isHide = true
        }
      }
    },
    'formOpts.formData.realityTeacherUserIdOrvideoTeacherId': {
      handler(val) {
        if (val) {
          this.formOpts.formData.liveModel =
            val === 'realityTeacherUserId' ? 'PERSON_LIVE' : 'AI_LIVE'
        }
      }
    },
    'formOpts.formData.createUserId': {
      handler(val) {
        if (val) {
          personSetUpRecordSave({
            code: 'LIVE_ROOM_PAGE_CREATE_USER_QUERY',
            value: val
          })
        }
      }
    },
    'formOpts.formData.tutorTeacherUserId': {
      handler(val) {
        if (val) {
          personSetUpRecordSave({
            code: 'LIVE_ROOM_PAGE_ASSISTANT_TEACHER_QUERY',
            value: val
          })
        }
      }
    }
  },
  async created() {
    this.formOpts.formData = {
      liveRoomCodeOrliveRoomName: 'liveRoomName',
      liveRoomCodeOrliveRoomNameVal: '',
      liveRoomCode: undefined, // 直播间ID
      liveRoomName: undefined, // 直播名称
      liveModel: '',
      realityTeacherUserIdOrvideoTeacherId: 'realityTeacherUserId', // 讲师
      realityTeacherUserId: '', // 真人讲师
      videoTeacherId: '', // 录播讲师
      tutorTeacherUserId: undefined, // 助教
      teacherId: undefined,
      createUserId: undefined,
      teacherName: undefined,
      status: undefined, // 直播状态
      time1ortime2: 'time1',
      time1ortime2Val: [
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ],
      time1: '', // 开播时间
      time2: '', // 创建时间
      type: '', // 直播场景
      feesType: '' // 直播类型
    }
    this.loadUserNoPage()
    // 绑定change事件
    this.formOpts.fieldList.forEach(item => {
      if (this.bindClickKeys.includes(item.prop)) {
        item.eventHandler.change = () => {
          this.searchFn()
        }
      }
    })
    // 获取创建人历史选择记录
    personSetUpRecordDetail({ code: 'LIVE_ROOM_PAGE_CREATE_USER_QUERY' }).then(
      res => {
        const ls = res.data.map(m => ({
          nickName: m.value,
          userId: m.key
        }))
        this.createOptions[0].options = ls || []
      }
    )
    // 获取助教历史选择记录
    personSetUpRecordDetail({
      code: 'LIVE_ROOM_PAGE_ASSISTANT_TEACHER_QUERY'
    }).then(res => {
      const ls = res.data.map(m => ({
        nickName: m.value,
        userId: m.key
      }))
      this.tutorTeacherUserIdOptions[0].options = ls || []
    })
  },
  mounted() {
    const { reload } = this.$route.query
    const oldFormData = getItem(`hok_live_formData_${this.userInfo.userId}`)
    if (oldFormData) {
      this.formOpts.formData = JSON.parse(oldFormData)
    }
    if (reload && reload === 'true') {
      this.searchFn()
    }
    this.havDataStatistics = this.havDataStatisticsFn()
    console.log(this.havDataStatistics, 'this.havDataStatistics11')
    if (this.ifAddLiveRoom) {
      this.onhandleAdd()
      this.$store.commit('im/SET_ifAddLiveRoom', false)
    }
    this.setOperatorList()

    this.canEnterLiveRoom().then(() => {
      this.searchFn()
    })
  },
  methods: {
    moment,
    renderLiveDuration,
    renderTearch,
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
        this.permsList.includes('web:liveRoomlist:addLiveRoom')
      ) {
        arr.push({
          label: '创建直播间',
          fn: () => {
            this.openCreate()
          },
          className: ['right']
        })
      }
      // 搜索按钮
      this.$set(this.formOpts, 'operatorList', arr)

      // // 表格操作按钮 一个操作权限没有 删除操作栏
      // const btns = ['btn:liveRoomlist:copyLive', 'btn:liveRoomlist:detail', 'btn:liveRoomlist:inviteLive', 'btn:liveRoomlist:enterLive', 'btn:liveRoomlist:delLive']
      // if (!btns.some(item => this.permsList.includes(item))) {
      //   this.columns.pop()
      // }
    },
    openCreate() {
      this.$router.push({ path: '/privateLive/createNewLiveRoom' })
    },
    selectedTeacher(res) {
      this.formOpts.formData.teacherId = res.teacherId
      this.formOpts.formData.teacherName = res.teacherName
      this.searchFn()
    },
    // 判断是否有数据权限
    havDataStatisticsFn() {
      const obj = this.permission_routes?.find(v => v.path === '/live')
      if (obj && obj.children && obj.children.length > 0) {
        const o = obj.children.find(v => v.path === 'liveRoom')
        console.log(o, 'o')
        if (o && o.children && o.children.length > 0) {
          const p = o.children.find(v => v.path === '/live/liveDetail/:id')
          console.log(p, 'p')
          if (p && p.meta && p.meta.permsList && p.meta.permsList.length > 0) {
            return p.meta.permsList.includes('menu:liveDetail:dataStatistics')
          }
        }
      }
      return false
    },
    // 点击打开新增直播间
    async onhandleAdd() {
      const res = await this.$store.dispatch('user/viewingFlag', 'newLiveRoom')
      if (!res) {
        this.addConfig = {
          visible: true,
          type: 1
        }
      }
    },
    canEnterLiveRoom() {
      return canEnterLiveRoom().then(res => {
        this.enterLiveRoom = res.data
      })
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    // 点击批量重启按钮
    onhandleBatchRestart() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请至少选择一项')
      }
      console.log(this.multipleSelection)
      const liveRoomIds = this.multipleSelection.reduce((pre, next) => {
        pre.push(next.id)
        return pre
      }, [])
      this.batchRestartLoading = true
      const data = {
        liveRoomIds
      }
      restartTask(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.batchRestartLoading = false
        })
        .catch(() => {
          this.batchRestartLoading = false
        })
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {
          liveRoomCodeOrliveRoomName: 'liveRoomName',
          liveRoomCodeOrliveRoomNameVal: '',
          liveRoomCode: undefined, // 直播间ID
          liveRoomName: undefined, // 直播名称
          liveModel: '',
          realityTeacherUserIdOrvideoTeacherId: 'realityTeacherUserId', // 讲师
          realityTeacherUserId: '', // 真人讲师
          videoTeacherId: '', // 录播讲师
          tutorTeacherUserId: undefined, // 助教
          teacherId: undefined,
          createUserId: undefined,
          teacherName: undefined,
          status: undefined, // 直播状态
          time1ortime2: 'time1',
          time1ortime2Val: [
            moment().format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ],
          time1: '', // 开播时间
          time2: '', // 创建时间
          type: '', // 直播场景
          feesType: '' // 直播类型
        }
      }
      setItem(
        `hok_live_formData_${this.userInfo.userId}`,
        JSON.stringify(this.formOpts.formData)
      )
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        [this.formOpts.formData.liveRoomCodeOrliveRoomName]:
          this.formOpts.formData.liveRoomCodeOrliveRoomNameVal,
        [this.formOpts.formData.realityTeacherUserIdOrvideoTeacherId]:
          this.formOpts.formData.liveModel === 'PERSON_LIVE'
            ? this.formOpts.formData.realityTeacherUserId
            : this.formOpts.formData.liveModel === 'AI_LIVE'
            ? this.formOpts.formData.teacherId
            : undefined,
        [this.formOpts.formData.time1ortime2]:
          this.formOpts.formData.time1ortime2Val,
        type: this.formOpts.formData.type,
        feesType: this.formOpts.formData.feesType,
        createUserId: this.formOpts.formData.createUserId,
        liveModel: this.formOpts.formData.liveModel,
        realityTeacherUserId: this.formOpts.formData.realityTeacherUserId,
        status: this.formOpts.formData.status,
        tutorTeacherUserId: this.formOpts.formData.tutorTeacherUserId,
        videoTeacherName: this.formOpts.formData.teacherName
      }
      if (params.time1) {
        params.timeType = 0
        params.startTime =
          params.time1 && params.time1[0] ? params.time1[0] + ' 00:00:00' : ''
        params.endTime =
          params.time1 && params.time1[1] ? params.time1[1] + ' 23:59:59' : ''
      }
      if (params.time2) {
        params.timeType = 1
        params.startTime =
          params.time2 && params.time2[0] ? params.time2[0] + ' 00:00:00' : ''
        params.endTime =
          params.time2 && params.time2[1] ? params.time2[1] + ' 23:59:59' : ''
      }
      delete params.time1
      delete params.time2
      return getLiveRoomList(params)
    },
    // 点击删除
    onhandleDel(row) {
      this.$delModal({
        tips: `是否删除直播间，删除后，学员端将无法看到直播间！`,
        success: () => {
          const params = {
            liveRoomId: row.id,
            disabled: true
          }
          delLiveRoom(params).then(res => {
            this.searchFn()
          })
        },
        fail: () => {}
      })
    },
    // 点击复制直播间
    onhandleCopyLive(row) {
      console.log(row, '复制直播间')
      Dialog.open({
        type: 'CopyLiveRoom',
        visible: true,
        createUserName: this.userInfo.userName,
        createUserId: this.userInfo.userId,
        liveRoomId: row.id,
        success: res => {
          console.log(res, '复制直播间res')
          if (res && res.data.messageList && res.data.messageList.length > 0) {
            this.$message({
              showClose: true,
              type: 'warning',
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `<div style="font-size: 14px;color: #ff4949;line-height: 23px;">
                ${res.data.messageList.join('</br>')}
              </div>`
            })
          }
          this.searchFn()
        }
      })
    },
    // 点击进入直播间
    async onhandleGotoLiveRoom(row) {
      if (!this.canShowGotoLiveRoom(row)) {
        return this.$message.error('你暂无权限访问。')
      }
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'newEnterLiveRoom'
      )
      if (res) return
      // this.$router.push(`/liveRoom/${row.id}`)
      const { href } = this.$router.resolve({
        path: `/liveRoomV2/${row.id}`
      })
      console.log(href)
      window.open(href, '_blank')
    },
    closeInviteDialog() {
      this.inviteConfig.visible = false
    },
    onhandleInvite(row) {
      this.inviteConfig = {
        visible: true,
        row: {
          liveModel: row.liveModel,
          name: row.name,
          code: row.code,
          startTime: row.startTime,
          id: row.id
        }
      }
    },
    canShowGotoLiveRoom(row) {
      if (this.enterLiveRoom) {
        return true
      }
      if (!row.teacherInfoDtoList || row.teacherInfoDtoList.length === 0) {
        return false
      }
      const obj = row.teacherInfoDtoList.find(
        v => v.teacherId === this.userInfo.userId
      )
      return Boolean(obj)
    },
    // 点击详情
    onhandleDetail(row) {
      console.log('点击前往详情页面', this.$route)
      // this.$router.push(`/live/liveDetail/detail/${row.id}`)
      this.$router.push({ path: `/privateLive/room/detail/${row.id}`, query: { backPath: this.$route.path } })
    },
    // 判断能否展示列表操作栏
    canshowTools(row) {
      // 是否白名单
      if (this.enterLiveRoom) {
        return true
      }
      // 是否创建人
      if (row.createUserId === this.userInfo.userId) {
        return true
      }
      // 是否是该场直播的讲师和助教
      const obj = row.teacherInfoDtoList.find(
        v => v.teacherId === this.userInfo.userId
      )
      return Boolean(obj)
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
          this.createOptions[1].options = [...this.userArray]
          this.tutorTeacherUserIdOptions[1].options = [...this.userArray]
          // 筛选历史记录存在的数据
          if (
            this.createOptions[0].options &&
            this.createOptions[0].options.length
          ) {
            // 删除this.createOptions[1].options中的存在的数据
            this.createOptions[1].options =
              this.createOptions[1].options.filter(item => {
                return !this.createOptions[0].options.find(
                  v => v.userId === item.userId
                )
              })
          }
          if (
            this.tutorTeacherUserIdOptions[0].options &&
            this.tutorTeacherUserIdOptions[0].options.length
          ) {
            // 删除this.tutorTeacherUserIdOptions[1].options中的存在的数据
            this.tutorTeacherUserIdOptions[1].options =
              this.tutorTeacherUserIdOptions[1].options.filter(item => {
                return !this.tutorTeacherUserIdOptions[0].options.find(
                  v => v.userId === item.userId
                )
              })
          }
        })
        .catch(() => {})
    },
    getTeacherList(params) {
      console.log(params)
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherName: params.teacherName,
        serviceEnterprise: '',
        domainId: '',
        cooperateStatus: '',
        assessStatus: '',
        searchDateStart: '',
        searchDateEnd: '',
        createTimeBegin: '',
        createTimeEnd: '',
        assessResult: '',
        recommendName: '',
        createUserName: '',
        assessFlag: ''
      }
      return getTeacherList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.live-wrapper {
  position: relative;
  padding: 0 20px;
  .liveType,
  .liveMode {
    display: inline-block;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    padding: 0 8px;
    border-radius: 13px;
    font-size: 10px;
    font-family: MicrosoftYaHei;
    height: 24px;
    line-height: 24px;
    .liveTypeicon,
    .liveModeicon {
      width: 13px;
      height: 13px;
      font-size: 13px;
      margin-right: 4px;
    }
  }
  .liveType0 {
    background: #eef2f9;
    color: #717f99;
  }
  .liveType1 {
    background: #e7f0ff;
    color: #1778ff;
  }
  .liveType2 {
    background: #fff2e6;
    color: #ff7d00;
  }
  .liveType3 {
    background: #feecec;
    color: #f53f3f;
  }
  .liveType9 {
    background: #f5f5f5;
    color: #999999;
  }
}
::v-deep {
  .search-form-box {
    display: flex;
    flex-wrap: wrap;
  }

  .filter_teacherSelect {
    .tearchInput {
      width: 270px !important;
    }
  }
}
</style>
