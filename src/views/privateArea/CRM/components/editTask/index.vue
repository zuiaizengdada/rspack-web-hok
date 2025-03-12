<template>
  <el-drawer
    v-if="visibleDialog"
    title="任务详情"
    size="80%"
    :visible.sync="visibleDialog"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <div v-if="visible" v-loading="loading" class="warpBox">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">任务详情</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <!-- 步骤条 -->
      <div class="steps">
        <div
          v-for="(item, index) in tableList"
          :key="index"
          class="stepsView"
          :class="{ current: active === index + 1 }"
          @click="active = index + 1"
        >
          <span class="stepsIcon">{{ index + 1 }}</span>
          <span class="stepsText">{{ item }}</span>
        </div>
      </div>
      <!-- 表单内容 -->
      <div class="content overflowOuto">
        <Basic-info
          v-show="active === 1"
          ref="basicInfo"
          :loading="EditLoading"
          :rule-form="form"
          @save="handleSave"
          @saveTime="handleSaveTime"
          @success="getDetail()"
        />
        <Data-setting
          v-show="active === 2 && form.dataType === 1"
          ref="dataSetting"
          :course-type="form.courseType"
          :model-type="form.modelType"
          :data="form.orderTags"
          @save="handleSave"
        />
        <offlineTable
          v-show="active === 2 && [2, 4].includes(form.dataType)"
          ref="offlineTable"
          :task-id="form.id"
          :taskObjective="form.taskObjective"
          :data-type="form.dataType"
        />
        <receptionSetting
          v-show="active === 3 && form.dataType !== 1"
          ref="receptionSetting"
          :task-status="form.taskStatus"
          :taskObjective="form.taskObjective"
          :model-type="form.modelType"
          :data-type="form.dataType"
          type="edit"
        />
        <teamReceptionSetting
          v-show="active === 3 && form.dataType === 1"
          ref="teamReceptionSetting"
          :task-status="form.taskStatus"
          :model-type="form.modelType"
          :data-type="form.dataType"
          type="edit"
          @save="handleSave"
        />
        <reachSet
          v-show="active === 4 && form.dataType === 1"
          ref="reachSetRef"
          :task-status="form.taskStatus"
          type="edit"
        />
        <liveRoomSetting
          v-show="active === 5 || (form.dataType !== 1 && active === 4)"
          ref="liveRoomSetting"
          :class-id="form.classId"
          :task-status="form.taskStatus"
          :course-type="form.courseType"
          type="edit"
        />
        <automationSetting
          v-show="active === 6"
          ref="automationSetting"
          :task-id="form.id"
          type="edit"
          :data-type="form.dataType"
          @save="handleSave"
          @back="active = 5"
        />
      </div>
    </div>
  </el-drawer>
</template>
<script>
import DataSetting from './DataSetting'
import BasicInfo from './BasicInfo'
import offlineTable from './offlineTable'
import reachSet from '../reachSet'
import receptionSetting from '../receptionSetting/index'
import teamReceptionSetting from '../teamReceptionSetting/index'
import liveRoomSetting from '../liveRoomSetting/index'
import automationSetting from '../automationSetting/index'
import {
  saleTaskdetail,
  editSaleTask,
  updateRunTime
} from '@/api/privateArea/CRM'
import moment from 'moment'
export default {
  name: 'DetailTask',
  components: {
    reachSet,
    DataSetting,
    BasicInfo,
    offlineTable,
    receptionSetting,
    liveRoomSetting,
    automationSetting,
    teamReceptionSetting
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    loading: false,
    active: 1,
    form: {
      id: '',
      taskName: '',
      dataType: 1,
      tags: [],
      ad: 1, // 任务时间类型 1特定时间 2立即开始
      priority: '', // 优先级
      transformationPeriod: 8, // 转化周期
      goodsTypeList: [],
      time: ['', ''],
      conditionMode: 1,
      conditions: [],
      nextStartTime: '',
      nextEndTime: '',
      isAutoNewTask: 0,
      createdNextTask: false,
      taskObjective: 1, // 任务目的
      customers: [], // 客服
      taskStatus: '', // 任务状态
      orderTags: [], // 订单类型： 订单标签
      tableList: [], // 线下表格类型：表格数据
      lectureName: '',
      lectureIdList: [],
      taskReachAddRequests: [], // 触达设置
      smsSignatureName: '',
      smsSignatureId: '',
      callId: '',
      smsActionId: '',
      clueSourceDeptId: '',
      modelType: 1,
      staffAssignType: '',
      defaultStaffAssignType: ''
    },
    EditLoading: false
  }),
  computed: {
    tableList() {
      if (this.form.dataType !== 1) {
        return ['基本信息', '数据设置', '接待设置', '直播间设置']
      }
      return this.form.courseType === 1
        ? ['基本信息', '数据设置', '接待设置', '触达设置', '直播间设置']
        : [
          '基本信息',
          '数据设置',
          '接待设置',
          '触达设置',
          '直播间设置',
          '自动化设置'
        ]
    },
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.active = 1
          this.getDetail()
        } else {
          this.form = {
            id: '',
            taskName: '',
            dataType: 1,
            tags: [],
            ad: 1, // 任务时间类型 1特定时间 2立即开始
            priority: '', // 优先级
            transformationPeriod: 8, // 转化周期
            goodsTypeList: [],
            time: ['', ''],
            conditionMode: 1,
            nextStartTime: '',
            nextEndTime: '',
            isAutoNewTask: 0,
            createdNextTask: false,
            conditions: [],
            taskObjective: 1, // 任务目的
            taskStatus: '', // 任务状态
            customers: [], // 客服
            orderTags: [], // 订单类型： 订单标签
            tableList: [], // 线下表格类型：表格数据
            taskReachAddRequests: [], // 触达设置
            lectureName: '',
            lectureIdList: [],
            smsSignatureName: '',
            smsSignatureId: '',
            callId: '',
            smsActionId: '',
            clueSourceDeptId: '',
            modelType: 1,
            staffAssignType: '',
            defaultStaffAssignType: '',
            friendRemarks: []
          }
        }
      }
    },
    deep: true,
    immediate: true
  },
  mounted() {
    this.$uweb && this.$uweb.setAction('Event_salseTaskInfo_page')
  },
  methods: {
    // 点击关闭
    close() {
      this.$emit('update:visible', false)
    },
    handleSwitchover() {
      this.active = this.active === 1 ? 2 : 1
    },
    handleClose(done) {
      this.$emit('update:visible', false)
      this.$emit('success')
    },
    // 获取详情数据
    getDetail(loading = false) {
      if (!loading) this.loading = true
      saleTaskdetail(this.taskId)
        .then(res => {
          res.data.tags &&
            res.data.tags.map(v => {
              v.id = v.tagId
            })
          this.form = {
            id: res.data.id,
            taskName: res.data.taskName,
            dataType: res.data.dataType,
            tags: res.data.tags || [],
            ad: res.data.endTime ? 1 : 2, // 任务时间类型 1特定时间 2立即开始
            time: [
              res.data.startTime
                ? moment(res.data.startTime).format('YYYY-MM-DD HH:mm')
                : '',
              res.data.endTime
                ? moment(res.data.endTime).format('YYYY-MM-DD HH:mm')
                : ''
            ],
            taskObjective: res.data.taskObjective, // 任务目的
            customers: res.data.customers || [], // 客服
            taskStatus: res.data.taskStatus, // 任务状态
            priority: res.data.priority, // 优先级
            ruleType: res.data.ruleType, // 欢迎语类型
            conditionMode: res.data.conditionMode,
            goodsTypeList: res.data.goodsTypeList || [],
            transformationPeriod: res.data.transformationPeriod || 8, // 转化周期
            orderTags: res.data.orderTags || [],
            tableList: res.data.tableList || [],
            taskWelcomes: res.data.taskWelcomes || [],
            isLive: res.data.isLive,
            nextStartTime: res.data.nextStartTime,
            nextEndTime: res.data.nextEndTime,
            isAutoNewTask: res.data.isAutoNewTask,
            createdNextTask: res.data.createdNextTask,
            smsSignatureId: res.data.smsSignatureId,
            smsSignatureName: res.data.smsSignatureName,
            smsActionId: res.data.smsActionId,
            lectureName: res.data.lectureName,
            lectureIdList: res.data.lectureIdList,
            taskReachAddRequests: res.data.reachVoList || [], // 触达设置
            callId: res.data.callId,
            title: res.data.smsContent,
            defaultStaffAssignType: res.data.defaultStaffAssignType,
            staffAssignType: res.data.staffAssignType,
            modelType: res.data.modelType,
            deptName: res.data.deptName,
            clueSourceDeptId: res.data.clueSourceDeptId,
            friendRemarks: res.data.friendRemarks,
            courseType: res.data.courseType,
            classId: res.data.classId
          }
          console.log(this.form, 'this.form')
          if (res.data.conditions) this.form.conditions = res.data.conditions
          this.$nextTick(() => {
            this.$refs.basicInfo.setData(this.form)
            if (this.form.dataType === 1) {
              this.$refs.dataSetting.setData(this.form)
              this.$refs.reachSetRef.setData(this.form)
              this.$refs.teamReceptionSetting.setData(this.form)
            } else {
              this.$refs.offlineTable.setData(this.form)
              this.$refs.receptionSetting.setData(this.form)
            }
            this.$refs.liveRoomSetting.setData(this.form)
            this.$refs.automationSetting.setData(this.form)
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    async handleSaveTime(form) {
      this.EditLoading = true
      try {
        const { code } = await updateRunTime({
          taskId: form.id,
          startTime: form.time[0] ? form.time[0] + ':00' : '',
          endTime: form.time[1] ? form.time[1] + ':00' : ''
        })
        if (code === 1) {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.$refs.basicInfo && (this.$refs.basicInfo.ifEdit = false)
          this.getDetail()
        }
        this.EditLoading = false
      } catch {
        this.EditLoading = false
      }
    },
    handleSave(form) {
      this.EditLoading = true
      // const taskWelcomes = form?.taskWelcomes?.map(item => ({
      //   content: item.content
      // }))
      const taskWelcomes = form?.taskWelcomes
      const orderTagIds = form?.orderTags?.map(i => i.orderTagId) ?? []
      const tagIds = form?.tags?.map(i => i.id) ?? []
      const data = {
        id: form.id,
        startTime: form.time && form.time[0] ? form.time[0] + ':00' : '',
        endTime: form.time && form.time[1] ? form.time[1] + ':00' : '',
        taskWelcomes,
        taskObjective: form.taskObjective,
        taskName: form.taskName,
        priority: form.priority, // 优先级
        ruleType: form.ruleType, // 欢迎语类型
        nextStartTime: `${form.nextStartTime}:00`,
        nextEndTime: `${form.nextEndTime}:00`,
        goodsTypeList: form.goodsTypeList || [],
        isAutoNewTask: form.isAutoNewTask,
        conditionMode: form.conditionMode,
        conditions: form.conditions,
        transformationPeriod: form.transformationPeriod || 8, // 转化周期
        tagIds,
        dataType: form.dataType,
        orderTagIds,
        lectureIdList: form.lectureIdList,
        taskReachAddRequests: form.taskReachAddRequests,
        clueSourceDeptId: form.clueSourceDeptId,
        modelType: form.modelType,
        staffAssignType: form.staffAssignType,
        defaultStaffAssignType: form.defaultStaffAssignType
      }
      editSaleTask(data)
        .then(res => {
          this.EditLoading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.$refs.basicInfo && (this.$refs.basicInfo.ifEdit = false)
          this.getDetail()
        })
        .catch(() => {
          this.EditLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.warpBox {
  height: calc(100vh - 10px);
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #ffffff;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .steps {
    margin: 32px 20px 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eff2f6;
    .stepsView {
      display: flex;
      align-items: center;
      padding-bottom: 16px;
      margin-right: 20px;
      border-bottom: 1px solid #fff;
      cursor: pointer;
      .stepsIcon {
        margin-right: 8px;
        text-align: center;
        width: 20px;
        height: 20px;
        background: #ffffff;
        border: 1px solid #777777;
        border-radius: 50%;
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 400;
        color: #777777;
        line-height: 20px;
      }
      .stepsText {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
        line-height: 24px;
      }
    }
    .line {
      margin: 0 10px;
      width: 100px;
      height: 1px;
      background: #777777;
    }
    .current {
      border-bottom: 1px solid #0c6fff;
      .stepsIcon {
        border: 1px solid #0c6fff;
        color: #0c6fff;
      }
      .stepsText {
        font-weight: bold;
        color: #0c6fff;
      }
    }
  }
}
.content {
  flex: 1;
  padding: 34px 0;
  display: flex;
  flex-direction: column;
}
.demo-drawer__footer {
  border-top: 1px solid #e7e7e7;
  padding: 12px 21px;
  text-align: right;
}
</style>
