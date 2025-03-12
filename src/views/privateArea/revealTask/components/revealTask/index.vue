<template>
  <div class="warpBox">
    <el-drawer
      v-bind="$attrs"
      :visible="visible"
      size="880px"
      :wrapper-closable="false"
      :title="current.goodsTypeName"
      direction="rtl"
      @close="visible = false"
    >
      <el-tabs v-model="activeName" class="tabsList">
        <el-tab-pane
          label="1 基本信息"
          name="1"
          :disabled="true"
        ><basicInfo
          :form.sync="state"
          @handleStop="handleStop"
        /></el-tab-pane>
        <el-tab-pane
          label="2 分配设置"
          name="2"
          :disabled="true"
        >
          <setAllocation
            v-if="status === 1"
            ref="setAllocationRef"
            :form.sync="state"
            :data="current"
            @handleStop="handleStop"
          />
          <setAllocationTeam
            v-else
            ref="setAllocationTeam"
            @success="setState"
          />
        </el-tab-pane>
        <el-tab-pane
          label="3 触达设置"
          name="3"
          :disabled="true"
        ><ruleReach
          :form.sync="state"
          @handleStop="handleStop"
          @handleOk="handleOk"
        /></el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>
<script>
const itemObj = {
  defineType: '',
  actionId: '',
  callId: '',
  smsTitle: '',
  smsActionId: '',
  smsSignatureId: ''
}
import basicInfo from './basicInfo'
import ruleReach from './ruleReach'
import setAllocation from './setAllocation'
import setAllocationTeam from './setAllocationTeam'
import { getGoodsTypeTaskDetail, addTask, sourceDeptDetail, orderSourceDeptAdd } from '@/api/privateArea/revealTask'
export default {
  components: {
    basicInfo,
    setAllocation,
    setAllocationTeam,
    ruleReach
  },
  data() {
    return {
      state: {
        enabled: 0,
        receptionStaffTempTaskId: '',
        smsSignatureName: '',
        smsActionId: '',
        taskWelcomes: [],
        taskReachAddRequests: [],
        tags: [],
        lecturerTag: 1,
        smsSignatureId: '',
        smsContent: '',
        callId: '',
        reachType: 2,
        allocationType: 2,
        taskId: '',
        name: '',
        deptId: '',
        iboxFriendRemarks: []
      },
      activeName: '1',
      current: {},
      visible: false,
      status: 1, // 开启 团队模式 1 不开启 2 开启
      type: 'add'
    }
  },
  methods: {
    async init(row, status = 1) {
      this.reset()
      this.status = status
      this.visible = true
      this.type = !row ? 'edit' : 'add'
      // 新增
      if (!row) return
      this.current = row
      let res = {}
      if (status === 1) {
        const { code, data } = await getGoodsTypeTaskDetail({
          goodsType: row.goodsType
        })
        if (code === 1) {
          res = data
        }
      } else {
        const { code, data } = await sourceDeptDetail(row.id)
        if (code === 1) {
          res = data
        }
      }
      const {
        enabled,
        receptionStaffTempTaskId,
        smsSignatureName,
        smsActionId,
        allocationType,
        taskWelcomes,
        tags,
        lecturerTag,
        callId,
        smsSignatureId,
        smsContent,
        reachType,
        id,
        deptName,
        deptId,
        reachVoList,
        friendRemarks
      } = res
      this.state = {
        enabled,
        receptionStaffTempTaskId,
        smsSignatureName,
        smsActionId,
        smsSignatureId,
        callId,
        smsContent,
        taskReachAddRequests: reachVoList || [{ ...itemObj }],
        lecturerTag: lecturerTag || 1,
        taskWelcomes: taskWelcomes || [],
        tags: tags || [],
        allocationType: allocationType || 2,
        reachType: reachType || 2,
        taskId: id,
        name: deptName ?? '',
        deptId,
        iboxFriendRemarks: friendRemarks ?? [
          { friendRemarkType: 1, isTick: false, length: undefined },
          { friendRemarkType: 2, isTick: false, length: undefined },
          { friendRemarkType: 3, isTick: false, length: 11 },
          { friendRemarkType: 4, isTick: false, length: undefined }
        ]
      }
      console.log(this.state)
    },
    setState(data) {
      this.state = {
        ...this.state,
        ...data
      }
      this.handleStop(data.step)
    },
    reset() {
      this.activeName = '1'
      this.state = {
        enabled: 0,
        receptionStaffTempTaskId: '',
        smsSignatureName: '',
        smsActionId: '',
        taskWelcomes: [],
        tags: [],
        lecturerTag: 1,
        smsSignatureId: '',
        smsContent: '',
        callId: '',
        reachType: 2,
        allocationType: 2,
        taskId: '',
        name: '',
        deptId: '',
        iboxFriendRemarks: []
      }
    },
    handleStop(value) {
      if (value === 2) {
        // 开启了团队模式
        if (this.status === 2) {
          this.$nextTick(() => {
            this.$refs.setAllocationTeam.init(this.state)
          })
        } else {
          this.$nextTick(() => {
            this.$refs.setAllocationRef.init(this.current)
          })
        }
      }
      this.activeName = `${value}`
    },
    async handleOk() {
      const tagIds = this.state?.tags?.map(item => item.tagId) || []
      const taskReachRequests = this.state?.taskReachAddRequests?.map(item => ({
        ...item,
        businessType: this.status === 1 ? 2 : 3
      }))
      const api = this.status === 1 ? addTask : orderSourceDeptAdd
      const friendRemarks = this.state?.iboxFriendRemarks
      const { code } = await api({
        ...this.state,
        tagIds,
        taskReachRequests,
        goodsType: this.current.goodsType,
        friendRemarks
      })
      if (code === 1) {
        this.$message.success('保存成功！')
        this.$emit('success')
        this.visible = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.warpBox::v-deep {
  .el-tabs__nav {
    margin-left: 25px;
  }
  .el-tabs__item.is-active {
    color: #0c6fff !important;
  }
  .el-drawer__header {
    margin-bottom: 0;
  }
}
</style>
