<template>
  <div class="">
    <!-- <el-button type="text" @click="changeFollowUser">部分邀约</el-button>
    <el-button type="text" @click="changeFollowUser">全部邀约</el-button> -->
    <el-button
      v-if="type === 'my'"
      v-permission="[permissionKey[0], permsList]"
      :disabled="multipleSelection.length === 0"
      type="text"
      @click="handleDialogVisible"
    >意向变更</el-button>
    <el-button
      v-permission="[permissionKey[1], permsList]"
      :disabled="multipleSelection.length === 0"
      type="text"
      @click="changeFollowUser"
    >更换跟进人</el-button>
    <el-button
      v-permission="[permissionKey[2], permsList]"
      :loading="downLoading"
      :disabled="!multipleSelection.length"
      type="text"
      @click="downPartExcel"
    >部分导出</el-button>
    <el-button
      v-permission="[permissionKey[3], permsList]"
      :loading="downLoading"
      type="text"
      @click="downExcel"
    >全部导出</el-button>
    <el-button
      v-permission="[permissionKey[4], permsList]"
      :loading="downLoading"
      type="text"
      @click="handleCodes"
    >群发信息</el-button>
    <el-dialog
      title="发送状态"
      :visible.sync="dialogTableVisible"
      width="400px"
    >
      {{ codeMsg }}
    </el-dialog>
    <rateDialog
      :visible.sync="rateVisible"
      :dialog-data="dialogData"
      :query="getRateQuery"
      @handleOk="handleOk"
    />
    <smsDrawer :visible.sync="smsDrawerVisible" :multiple-selection="multipleSelection" @handleOk="handleSmsOk" />

    <!-- 变更意向弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      @close="dialogVisible = false"
    >
      <m-select
        v-model="intentId"
        :dict-list="intentConfigPage"
        :clearable="false"
        :param="{ value: 'id', label: 'name' }"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleIntent"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 以下用户在同一个任务中被分配给了多人，必须归属到同一个人名下 -->
    <el-dialog
      :visible.sync="dialogAllocationVisible"
      width="620px"
      :close-on-click-modal="false"
      title="以下用户在同一个任务中被分配给了多人，必须归属到同一个人名下"
      @close="dialogAllocationVisible = false"
    >
      <div class="allocation-list">
        <div v-for="(item, index) in userBeforeList" :key="index" class="allocation-item">
          <div class="allocation-item-top">客户：{{ item.phone }}</div>
          <div class="allocation-item-c">
            <el-radio-group v-model="item.value">
              <el-radio v-for="i in item.followUserInfoList" :key="i.followUserId" :label="i.followUserId">{{ i.followUserName }}</el-radio>
            </el-radio-group></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAllocationVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditFollowUserDirect"
        >确认分配</el-button>
      </span>
    </el-dialog></div></el-dialog>
  </div>
</template>

<script>
import {
  editFollowUser,
  downCluePartPageList,
  clueSendMsgBatch,
  editFollowUserSpeed,
  updateIntentConfig,
  editFollowUserBefore,
  editFollowUserDirect
} from '@/api/privateArea/clue'
import { setTime } from './utils.js'
import rateDialog from '@/components/rateDialog'
import smsDrawer from '@/views/privateArea/clue/components/smsDrawer.vue'
import { exportCluePageList, exportUrlId } from '@/api/privateArea/CRM'
import moment from 'moment'

const searchType = {
  all: 1,
  my: 2,
  department: 3
}
export default {
  components: {
    rateDialog,
    smsDrawer
  },
  props: {
    intentConfigPage: {
      type: Array,
      default: () => []
    },
    multipleSelection: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    listLoading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'all'
    },
    search: {
      type: Object,
      default: () => {
        return {
          clueType: '', // 线索类型1订单 2线下表格
          createTime: ['', ''], // 分配时间
          externalUserTagIds: '', // 企微标签Id
          followRecordTypes: [], // 跟进状态1-已加个微待通过、2-不需要、3-在忙、4-未接、5-意向客户、6-未知
          isAddQwAndGw: '',
          deptIdList: [],
          repeatBuy: '',
          hasReceiverAddress: '',
          followUserId: '', // 跟进人伏羲云用户userId
          addGwStartTime: '',
          addGwEndTime: '',
          addQwStartTime: '',
          addQwEndTime: '',
          lastFollowTime: ['', ''], // 跟进时间
          taskIdList: '', // 任务Id
          taskName: '',
          remark: '', // 微信备注名
          teacherId: '',
          teacherName: '',
          user: { label: 'userName', value: '' } // 学员搜索
          // phone: '', // 手机号
          // userName: '' // 用户名
        }
      }
    },
    permissionKey: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    dialogVisible: false,
    intentId: '',
    rateVisible: false,
    smsDrawerVisible: false, //
    codeMsg: '',
    dialogTableVisible: false,
    permsList: this?.$route?.meta?.permsList || [],
    downLoading: false,
    rateId: '',
    dialogData: {
      title: '线索分配',
      warningTitle: '系统正在分配线索中，请勿关闭浏览器窗口！',
      textCenter: '线索分配中'
    },
    selectUser: {},
    dialogAllocationVisible: false,
    userBeforeList: [],
    followUserParams: {}
  }),
  created() {
    this.permsList = this?.$route?.meta?.permsList
    console.log(this.permsList)
  },
  methods: {
    handleOk(smsSort) {
      this.$emit('refreshList', smsSort)
    },
    handleDialogVisible() {
      this.dialogVisible = true
      this.intentId = ''
    },
    async handleIntent() {
      const { code, data } = await updateIntentConfig({
        clueId: this.multipleSelection?.map(item => item.id) || [],
        intentId: this.intentId
      })
      if (code === 1) {
        this.dialogVisible = false
        this.$message.success(`已成功更新${data}条，刷新当前页面数据`)
        this.intentId = ''
        this.$emit('refreshList')
      }
    },
    // 点击更换更进人
    changeFollowUser() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        minlength: 1,
        isShowSelect: true,
        type: [1],
        success: res => {
          if (res.user.length > 0) {
            this.selectUser = res
            const clueIds = this.multipleSelection.reduce((pre, next) => {
              pre.push(next.id)
              return pre
            }, [])
            this.$emit('update:listLoading', true)
            const data = {
              clueIds,
              followUserId: res.user[0].userId,
              qwInheritType: res.qwInheritType,
              qwInheritDelayDay: res.qwInheritDelayDay
            }
            this.followUserParams = data
            editFollowUserBefore(data).then(res => {
              if (res.data.length > 0) {
                this.dialogAllocationVisible = true
                this.userBeforeList = res.data.map(i => ({ ...i, value: i.followUserInfoList[0].followUserId }))
                this.$emit('update:listLoading', false)
              } else {
                this.handleEditFollowUser()
              }
            }).catch(() => {
              this.$emit('update:listLoading', false)
            })
          }
        }
      })
    },
    async handleFollowUser() {
      const clueIds = this.multipleSelection.reduce((pre, next) => {
        pre.push(next.id)
        return pre
      }, [])
      await editFollowUser({
        clueIds,
        followUserId: this.selectUser.user[0].userId,
        qwInheritType: this.selectUser.qwInheritType,
        qwInheritDelayDay: this.selectUser.qwInheritDelayDay
      }
      )
    },
    async downPartExcel() {
      if (!this.multipleSelection?.length) {
        return this.$message.warning('请勾选相应线索进行导出')
      }
      const { code, data } = await downCluePartPageList({
        ids: this.multipleSelection.map(item => item.id),
        searchType: searchType[this.type]
      })
      if (code === 1) {
        this.getExport(data)
      }
    },
    getRateQuery() {
      return editFollowUserSpeed({ uniqueId: this.rateId })
    },
    handleCodes() {
      if (!this.multipleSelection?.length) {
        return this.$message.warning('请勾选相应线索进行发送！')
      }
      if (
        this.multipleSelection.length === 1 &&
        this.multipleSelection[0].isAddQw
      ) {
        return this.$message.warning('已经加上企业微信，不能再次发送！')
      }
      this.smsDrawerVisible = true
    },
    handleSmsOk(smsSort) {
      this.clueSendMsgBatch(smsSort)
    },
    async clueSendMsgBatch(smsSort) {
      this.codeMsg = '正在发送中，请勿关闭页面！'
      this.dialogTableVisible = true
      try {
        const { code, msg, data } = await clueSendMsgBatch({
          clueIdList: this.multipleSelection.map(item => item.id),
          smsSort
        })
        if (code === 1) {
          this.codeMsg = `发送完成，共成功提交${data}条信息！单个用户1天只能人工手动发送一条信息，直播报名类型线索不能发送，请勿重复点击发送！`
        } else {
          this.codeMsg = msg
        }
      } catch {
        this.codeMsg = '服务器报错,信息发送失败！'
        setTimeout(() => {
          this.dialogTableVisible = false
        }, 1000)
      }

      setTimeout(() => {
        this.dialogTableVisible = false
      }, 30000)
    },
    downExcel() {
      const startCreateTime =
        this.search.createTime && this.search.createTime[0]
          ? this.search.createTime[0] + ' 00:00:00'
          : ''
      const endCreateTime =
        this.search.createTime && this.search.createTime[1]
          ? this.search.createTime[1] + ' 23:59:59'
          : ''
      const params = {
        searchType: searchType[this.type],
        [this.search.user.label]: this.search.user.value,
        [this.search.wxKey.label]: this.search.wxKey.value,
        isAddQwAndGw: this.search.isAddQwAndGw,
        clueType: this.search.clueType || 0,
        startCreateTime,
        endCreateTime,
        ...setTime(this.search.time),
        refundStatus: this.search.refundStatus,
        startLastFollowTime: this.search.lastFollowTime
          ? this.search.lastFollowTime[0]
          : '',
        endLastFollowTime: this.search.lastFollowTime
          ? this.search.lastFollowTime[1]
          : '',
        externalUserTagIds: this.search.externalUserTagIds,
        followRecordTypes: this.search.followRecordTypes || [],
        deptIdList: this.search.deptIdList,
        repeatBuy: this.search.repeatBuy,
        hasReceiverAddress: this.search.hasReceiverAddress,
        followUserId: this.search.followUserId,
        goodsId: this.search.goodsId,
        taskIdList: this.search.taskIdList,
        teacherId: this.search.teacherId,
        orderStatus: this.search.orderStatus,
        orderNo: this.search.orderNo,
        channelId: this.search.channelId,
        isAvailable: this.search.isAvailable,
        intentIdList: this.search.intentIdList || []
      }
      const hasDays = !startCreateTime || !endCreateTime
      const startTime = moment(startCreateTime)
      const endTime = moment(endCreateTime)
      // if (!this.search.taskId) return this.$message.error('请选择具体任务')
      // 时间差
      const days = endTime.diff(startTime, 'days')
      if (hasDays || days > 30) {
        this.$message.error(
          '请选择分配时间，且分配时间区间必须在一月内的数据才能导出！'
        )
        this.downLoading = false
        return
      }
      this.downLoading = true
      exportCluePageList(params)
        .then(res => {
          this.getExport(res.data)
          // window.location = res.data
        })
        .catch(() => {
          this.downLoading = false
        })
    },
    getExport(id) {
      this.downLoading = true
      this.timer = setInterval(async () => {
        const { data } = await exportUrlId(id)
        if (data) {
          window.location = data
          clearInterval(this.timer)
          this.downLoading = false
        }
      }, 1000)
    },
    async handleEditFollowUserDirect() {
      const directRequestList = this.userBeforeList.map(i => ({ platformUserId: i.platformUserId, followUserId: i.value }))
      const res = await editFollowUserDirect({
        ...this.followUserParams,
        directRequestList
      })
      this.rateId = res.data
      this.$emit('update:listLoading', false)
      this.rateVisible = true
      this.dialogAllocationVisible = false
      this.$message.success(`操作成功`)
      // this.$emit('refreshList')
    },
    async handleEditFollowUser() {
      editFollowUser(this.followUserParams)
        .then(res => {
          this.rateId = res.data
          this.$emit('update:listLoading', false)
          this.rateVisible = true
          this.dialogAllocationVisible = false
          this.$message.success(`操作成功`)
          // this.$emit('refreshList')
        })
        .catch(() => {
          this.$emit('update:listLoading', false)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  .el-dialog__title {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000;
  }
  border-bottom: 1px solid #e7e7e7;
}
::v-deep .el-dialog__body {
  padding: 20px 20px;
}
.allocation-list{
  max-height: 615px;
  overflow-y: auto;
}
.allocation-item{
  border-radius: 8px 8px;
  border: 1px solid #EFF2F6;
}
.allocation-item-top{
  line-height: 40px;
  background: #EFF2F6;
  padding:0 10px;
}
.allocation-item-c{
  padding: 10px;
}
</style>
