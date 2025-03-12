<template>
  <el-drawer
    title="新增任务"
    size="80%"
    :visible.sync="visibleDialog"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="false"
    :close-on-press-escape="false"
  >
    <div v-if="visible" v-loading="loading" class="warpBox">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">新增任务</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <!-- 步骤条 -->
      <div class="steps">
        <div
          v-for="(item, index) in tableList"
          :key="index"
          class="stepsView"
          :class="{ current: active === item }"
        >
          <span class="stepsIcon">{{ index + 1 }}</span>
          <span class="stepsText">{{ item }}</span>
          <div v-if="index !== tableList.length - 1" class="line" />
        </div>
      </div>
      <!-- 表单内容 -->
      <div class="content">
        <Basic-info
          v-show="active === '基本信息'"
          ref="basicInfo"
          :taskcopy-id="taskcopyId"
          @addTags="addTags"
          @courseTypeChange="val => (form.courseType = val)"
          @nextStep="data => handleNext(data, '数据设置')"
        />
        <Data-setting
          v-show="active === '数据设置' && form.dataType === 1"
          ref="dataSetting"
          :loading="loading"
          :init-form="form"
          :model-type="modelType"
          :course-type="form.courseType"
          @nextStep="data => handleNext(data, '接待设置')"
          @backStep="handleBackStep('基本信息')"
        />
        <offlineTable
          v-show="active === '数据设置' && [2, 4].includes(form.dataType)"
          ref="offlineTable"
          :data-type="form.dataType"
          :task-id="tableTaskId"
          @taskIdChange="tableTaskIdChange"
          :taskObjective="form.taskObjective"
          @backStep="handleBackStep('基本信息')"
          @nextStep="data => handleNext(data, '接待设置')"
        />
        <receptionSetting
          v-show="active === '接待设置' && form.dataType !== 1"
          ref="receptionSetting"
          :data-type="form.dataType"
          :update-task-id="form.id"
          :taskObjective="form.taskObjective"
          :model-type="modelType"
          @taskIdChange="taskIdChange"
          @nextStep="data => handleNext(data, '直播间设置')"
          @backStep="handleBackStep('数据设置')"
        />
        <teamReceptionSetting
          v-show="active === '接待设置' && form.dataType === 1"
          ref="teamReceptionSetting"
          :task-status="form.taskStatus"
          :data-type="form.dataType"
          :model-type="modelType"
          @taskIdChange="taskIdChange"
          @nextStep="data => handleNext(data, '触达设置')"
          @backStep="handleBackStep('数据设置')"
        />
        <reachSet
          v-show="active === '触达设置' && form.dataType === 1"
          ref="reachSetRef"
          :task-status="form.taskStatus"
          type="add"
          @backStep="handleBackStep('接待设置')"
          @nextStep="data => handleNext(data, '直播间设置')"
        />
        <liveRoomSetting
          v-show="active === '直播间设置'"
          ref="liveRoomSetting"
          type="add"
          :course-type="form.courseType"
          :taskcopy-id="taskcopyId"
          :class-id="form.classId"
          @backStep="
            handleBackStep(form.dataType === 1 ? '触达设置' : '接待设置')
          "
          @save="handleSave"
          @addForm="addForm"
          @nextStep="data => handleNext(data, '自动化设置')"
        />
        <automationSetting
          v-show="
            active === '自动化设置' &&
            form.dataType === 1 &&
            form.courseType === 0
          "
          ref="automationSetting"
          :task-id="form.id"
          type="add"
          :data-type="form.dataType"
          @save="handleSave"
          @addForm="addForm"
          @back="handleBackStep('直播间设置')"
        />
      </div>
    </div>
  </el-drawer>
</template>
<script>
import DataSetting from './DataSetting'
import BasicInfo from './BasicInfo'
import offlineTable from './offlineTable'
import automationSetting from '../automationSetting/index'
import teamReceptionSetting from '../teamReceptionSetting/index'
import {
  saleTaskAdd,
  saleTaskdetail,
  saleTaskdetailCopy
} from '@/api/privateArea/CRM'
import reachSet from '../reachSet'
import { modelQuery } from '@/api/privateArea/revealTask'
import receptionSetting from '../receptionSetting/index'
import liveRoomSetting from '../liveRoomSetting/index'
import moment from 'moment'
export default {
  name: 'AddTask',
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
    taskcopyId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    loading: false,
    drawer: false,
    active: '基本信息',
    form: {
      id: '',
      taskName: '',
      priority: '', // 优先级
      transformationPeriod: 8, // 转化周期
      dataType: 1,
      time: ['', ''],
      ruleType: 1,
      conditionMode: 1,
      goodsTypeList: [],
      conditions: [],
      sysUsers: [], // 客服
      tags: [], // 标签
      ad: 1,
      taskObjective: 1, // 任务目的
      taskWelcomes: [],
      tempTaskId: undefined,
      isLive: true,
      endTime: '',
      labels: [],
      title: '',
      nextStartTime: '',
      nextEndTime: '',
      isAutoNewTask: 0,
      callTaskId: '',
      smsActionId: '',
      lectureIdList: [],
      smsSignatureId: '',
      smsSignatureName: '',
      clueSourceDeptId: '',
      defaultStaffAssignType: '',
      staffAssignType: '',
      courseType: 1
    },
    taskId: '',
    tableTaskId: '',
    modelType: 1
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
        if (val && this.taskcopyId) {
          this.active = '基本信息'
          this.getDetail()
        }
        if (val && !this.taskcopyId) {
          this.active = '基本信息'
          this.form = {
            taskName: '',
            id: '',
            priority: '', // 优先级
            transformationPeriod: 8, // 转化周期
            dataType: 1,
            time: ['', ''],
            sysUsers: [], // 客服
            tags: [], // 标签
            ruleType: 1, // 欢迎语类型
            conditionMode: 1,
            goodsTypeList: [],
            conditions: [],
            ad: 1,
            taskObjective: 1, // 任务目的
            taskWelcomes: [],
            tempTaskId: undefined,
            isLive: true,
            endTime: '',
            labels: [],
            nextStartTime: '',
            nextEndTime: '',
            isAutoNewTask: 0,
            title: '',
            callTaskId: '',
            smsActionId: '',
            lectureIdList: [],
            smsSignatureId: '',
            smsSignatureName: '',
            clueSourceDeptId: '',
            defaultStaffAssignType: '',
            staffAssignType: '',
            iboxFriendRemarks: [],
            courseType: 1
          }
        }
        this.getType()
      }
    }
  },
  mounted() {
    this.$uweb && this.$uweb.setAction('Event_salseTaskAdd_page')
  },
  methods: {
    getDetail() {
      this.loading = true
      saleTaskdetail(this.taskcopyId)
        .then(res => {
          saleTaskdetailCopy(res.data.id).then(n => {
            this.form = {
              id: n.data,
              old: res.data.id,
              taskName: '',
              dataType: res.data.dataType,
              tags: [],
              ad: res.data.endTime ? 1 : 2, // 任务时间类型 1特定时间 2立即开始
              time: [],
              nextStartTime:
                res.data.time && res.data.time[1]
                  ? res.data.time[1] + ':00'
                  : '',
              nextEndTime: '',
              isAutoNewTask: res.data.isAutoNewTask,
              priority: res.data.priority, // 优先级
              transformationPeriod: res.data.transformationPeriod || 8, // 转化周期
              taskObjective: res.data.taskObjective, // 任务目的
              customers: res.data.customers || [], // 客服
              taskStatus: '', // 任务状态
              ruleType: res.data.ruleType || 1, // 欢迎语类型
              conditionMode: res.data.conditionMode || 1,
              goodsTypeList: res.data.goodsTypeList || [],
              conditions: res.data.conditions || [],
              // orderTags: res.data.orderTags || [],
              labels: res.data.orderTags || [],
              tableList: res.data.tableList || [],
              taskWelcomes: res.data.taskWelcomes ?? [],
              isLive: res.data.isLive,
              smsSignatureId: res.data.smsSignatureId,
              smsSignatureName: res.data.smsSignatureName,
              smsActionId: res.data.smsActionId,
              lectureName: res.data.lectureName,
              lectureIdList: res.data.lectureIdList || [],
              callId: res.data.callId,
              title: res.data.smsContent,
              modelType: res.data.modelType,
              taskReachAddRequests: res.data.reachVoList || [], // 触达设置
              defaultStaffAssignType: res.data.defaultStaffAssignType,
              staffAssignType: res.data.staffAssignType,
              deptName: res.data.deptName,
              clueSourceDeptId: res.data.clueSourceDeptId,
              friendRemarks: res.data.friendRemarks,
              courseType: res.data.courseType ?? 1,
              classId: res.data.classId
            }
            this.$nextTick(() => {
              this.$refs.basicInfo.setData(this.form)
              if (this.form.dataType === 1) {
                this.$refs.dataSetting.setData(this.form)
                this.$refs.reachSetRef.setData(this.form)
                // this.$refs.teamReceptionSetting.setData(this.form)
              } else {
                this.$refs.offlineTable.setData(this.form)
                // this.$refs.receptionSetting.setData(this.form)
              }
              this.$refs.automationSetting.setData(this.form)
              // this.$refs.liveRoomSetting.setData(this.form)
            })
            this.loading = false
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    async getType() {
      const { data } = await modelQuery()
      this.modelType = data.type
    },
    addForm(data) {
      this.form = {
        ...this.form,
        ...data
      }
    },
    handleNext(data, next) {
      this.form = {
        ...this.form,
        ...data
      }
      console.log(this.form, 'this.form')
      console.log(
        this.$refs.liveRoomSetting.configData,
        'this.$refs.liveRoomSetting.configData'
      )
      if (this.form.time && this.form.time[1] && this.form.time[0]) {
        const startTime = new Date(this.form.time[0])
        const endTime = new Date(this.form.time[1])
        // 计算时间间隔
        const interval = endTime.getTime() - startTime.getTime()
        // 定义新的开始时间和结束时间
        this.form.nextStartTime = this.form.time[1]
        if (!this.form.nextEndTime) {
          this.form.nextEndTime = moment(
            new Date(endTime.getTime() + interval).toISOString()
          ).format('YYYY-MM-DD HH:mm')
        }
      }
      if (this.form.id) {
        this.$refs.teamReceptionSetting.taskId = this.form.id
      }
      this.$refs.automationSetting.setData(this.form)
      if (this.form.courseType !== 1) {
        this.$refs.liveRoomSetting.setData(this.form)
      } else {
        this.$refs.liveRoomSetting.configData.classForm.goodsIdList =
          this.form.goodsIds
        this.$refs.liveRoomSetting.configData.goodsName = this.form.goodsName
        this.$refs.liveRoomSetting.configData.classForm.className =
          this.form.taskName
        if (this.taskcopyId) {
          this.$refs.liveRoomSetting.getTempClassId()
        }
        this.$refs.liveRoomSetting.configData.classForm.classOpeningTime =
          new Date(this.form.time[1])
        this.$refs.liveRoomSetting.configData.minClassOpeningTime = new Date(
          this.form.time[0]
        )
        // this.$refs.liveRoomSetting.materialVo.materialFrameUrl
        this.$refs.liveRoomSetting.configData.classForm.capacityQuantity = [
          ...this.$refs.teamReceptionSetting.$refs.receptionTable.tableData,
          ...this.$refs.teamReceptionSetting.$refs.teamTable.tableData
        ].reduce((pre, next) => {
          pre += next.maxClueNum
          return pre
        }, 0)
        this.$refs.liveRoomSetting.configData.minCapacityQuantity = [
          ...this.$refs.teamReceptionSetting.$refs.receptionTable.tableData,
          ...this.$refs.teamReceptionSetting.$refs.teamTable.tableData
        ].reduce((pre, next) => {
          pre += next.maxClueNum
          return pre
        }, 0)
      }
      if (this.form.dataType === 1) {
        this.$refs.dataSetting.setData(this.form)
        this.$refs.teamReceptionSetting.setData(this.form)
      } else {
        this.$refs.receptionSetting.setData(this.form)
      }
      this.active = next
    },
    handleBackStep(value) {
      this.active = value
    },
    taskIdChange(res) {
      this.taskId = res
    },
    tableTaskIdChange(res) {
      this.tableTaskId = res
    },
    // 点击关闭
    close() {
      this.$emit('update:visible', false)
    },
    handleClose(done) {
      this.$emit('update:visible', false)
    },
    handleNextStep() {
      this.$refs.basicInfo.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.active = 2
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addTags(res) {
      this.form.tags.push(res)
    },
    handleSave(form, courseType) {
      if (!this.taskId) {
        return this.$message.error('保存失败')
      }
      if (this.dataType === 2 && !this.tableTaskId) {
        return this.$message.error('表格数据')
      }
      this.loading = true
      const tagIds = this.form.tags.reduce((pre, next) => {
        pre.push(next.id)
        return pre
      }, [])
      // const orderTagIds = this.form.labels
      const friendRemarks = this.form.iboxFriendRemarks
      this.form.taskWelcomes.forEach(item => delete item.id)
      const params = {
        dataType: this.form.dataType, // 数据类型
        endTime:
          this.form.time && this.form.time[1] ? this.form.time[1] + ':00' : '', // 结束时间
        // orderTagIds, // 订单标签id
        startTime:
          this.form.time && this.form.time[0] ? this.form.time[0] + ':00' : '', // 开始时间
        tagIds, // 标签id
        priority: this.form.priority, // 优先级
        transformationPeriod: this.form.transformationPeriod || 8, // 转化周期
        tableTaskId: this.tableTaskId,
        nextStartTime: this.form?.nextStartTime
          ? `${this.form.nextStartTime}:00`
          : '',
        nextEndTime: this.form?.nextEndTime
          ? `${this.form.nextEndTime}:00`
          : '',
        isAutoNewTask: this.form.isAutoNewTask,
        conditionMode: this.form.conditionMode,
        taskReachAddRequests: this.form.taskReachAddRequests,
        goodsTypeList: this.form.goodsTypeList || [],
        ruleType: this.form.ruleType || 1, // 欢迎语类型
        conditions: this.form.conditions,
        taskName: this.form.taskName, // 任务名称
        taskObjective: this.form.taskObjective, // 任务目的
        goodsIdListTempTaskId: this.form.id,
        taskWelcomes:
          this.form.ruleType === 1
            ? this.form.taskWelcomes
            : this.form.taskWelcomesTwo,
        isLive: form.isLive,
        lives: form.isLive ? form.lives : [],
        assignment: this.form.assignment,
        tempTaskId: this.taskId,
        callId: this.form.callId,
        smsActionId: this.form.smsActionId,
        smsSignatureId: this.form.smsSignatureId,
        smsSignatureName: this.form.smsSignatureName,
        clueSourceDeptId: this.form.clueSourceDeptId,
        modelType: this.modelType,
        staffAssignType: this.form.staffAssignType,
        defaultStaffAssignType: this.form.defaultStaffAssignType,
        friendRemarks,
        courseType: this.form.courseType,
        classId: courseType === 1 ? form : this.form.classId
      }
      const isAfterNow =
        params.startTime && new Date(params.startTime).getTime() > Date.now()
      if (!isAfterNow && params.dataType === 1) {
        this.$message.error('计划开始时间必须大于现在的时间')
        this.loading = false
        return
      }
      if (params.dataType === 1) {
        params.lectureIdList = this.form.lectureIdList || []
      } else {
        params.conditionMode = 1
      }
      console.log(params, 'params123')
      saleTaskAdd(params)
        .then(res => {
          this.loading = false
          this.$message.success('新增任务成功')
          this.$emit('success')
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.warpBox {
  height: 100vh;
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
    .stepsView {
      display: flex;
      align-items: center;
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
      width: 60px;
      height: 1px;
      background: #777777;
    }
    .current {
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
  padding-top: 34px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 108px);
  overflow: hidden;
  // padding:34px 20px;
}
</style>
