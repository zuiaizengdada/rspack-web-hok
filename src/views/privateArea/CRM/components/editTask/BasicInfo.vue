<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    class="form-container"
  >
    <el-form-item label="任务名称：" prop="taskName">
      <span v-if="!isEditName">{{ ruleForm.taskName }}</span>
      <el-input
        v-else
        v-model="ruleForm.taskName"
        maxlength="50"
        show-word-limit
        style="width: 800px"
      />
      <template v-if="ruleForm.taskStatus !== '4'">
        <el-button
          v-if="!isEditName"
          type="text"
          @click="handleEditName"
        >编辑</el-button>
        <template v-else>
          <el-button
            :loading="loading"
            class="m-l-10"
            size="small"
            type="primary"
            @click="handleSaveName"
          >保存</el-button>
          <el-button
            :loading="loading"
            class="m-l-10"
            size="small"
            @click="isEditName = false"
          >取消</el-button>
        </template>
      </template>
    </el-form-item>
    <el-form-item label="标签：" prop="labelNameList">
      <template v-if="closable">
        <labelInput
          v-model.trim="labelInput"
          maxlength="10"
          :disabled="ruleForm.tags.length >= 5"
          @input="delNoNumber"
          @select="labelSelect"
        />
        <div class="textContent m-b-16" style="margin-top: 12px">
          单个标签不能超过10个字且最多新增5个标签！此处标签，当客户添加了员工企微，同步给客户企微打上对应标签
        </div>
      </template>
      <div v-if="ruleForm.tags.length > 0" class="labelNameList">
        <el-tag
          v-for="(item, index) in ruleForm.tags"
          :key="index"
          class="m-r-16"
          size="small"
          :closable="closable && ruleForm.tags.length > 1"
          @close="delLabel(item, index)"
        >{{ item.tagName }}</el-tag>
      </div>
    </el-form-item>
    <el-form-item label="数据来源：" prop="dataType">
      {{ { 1: '订单', 2: '线下表格', 4: '信息流表单' }[ruleForm.dataType] }}
    </el-form-item>
    <el-form-item
      v-if="ruleForm.dataType === 1"
      label="订单课程："
      prop="courseType"
    >
      <el-radio-group :value="ruleForm.courseType" disabled>
        <el-radio :label="1">直播课</el-radio>
        <el-radio :label="0">录播课</el-radio>
      </el-radio-group>
      <span style="margin-left: 5px">保存后不允许编辑</span>
    </el-form-item>
    <el-form-item label="优先级：" prop="priority">
      <m-select
        v-model="ruleForm.priority"
        style="max-width: 200px"
        :disabled="ruleForm.taskStatus === '4'"
        dict-key="PRIORITY_STATUS"
        @change="handlePriorityChange"
      />
      <span> 同时满足任务的线索，优先进入优先级高的任务</span>
    </el-form-item>
    <el-form-item label="任务时间：" prop="time" class="myTime">
      <template v-if="ruleForm.ad === 1">
        <template v-if="ifEdit">
          <el-date-picker
            v-model="time[0]"
            :disabled="disabledFn()"
            :picker-options="pickerOptions1"
            size="small"
            style="width: 170px"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          />
          <span class="m-l-10 m-r-10">至</span>
          <el-date-picker
            v-model="time[1]"
            :picker-options="pickerOptions2"
            size="small"
            style="width: 170px"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          />
          <el-button
            :loading="loading"
            class="m-l-10"
            size="small"
            type="primary"
            @click="onhandleSaveTime"
          >保存</el-button>
          <el-button
            :loading="loading"
            class="m-l-10"
            size="small"
            @click="ifEdit = false"
          >取消</el-button>
        </template>
        <template v-else>
          {{ ruleForm.time[0] }} 至 {{ ruleForm.time[1] }}
          <el-button
            v-if="ruleForm.taskStatus !== '4'"
            type="text"
            @click="onhandleEdit"
          >编辑</el-button>
        </template>
      </template>
      <template v-else> 立即执行 </template>
    </el-form-item>
    <el-form-item label="任务目的：" prop="name">
      {{ ruleForm.taskObjective | getOptionsValue(taskObjectiveOption) }}
    </el-form-item>
    <el-form-item
      label="企微备注："
      prop="iboxFriendRemarks "
      class="formItem"
      :class="{ 'is-required': ruleForm.taskObjective === 1 }"
    >
      <div class="formText">
        （
        <span>注：</span>可通过<span>拖拽</span>修改备注名的显示顺序，单个好友备注名最长不能超过20字
        ）
      </div>
      <draggable
        :list="iboxFriendRemarks"
        tag="div"
        draggable=".draggle"
        v-bind="{
          animation: 500,
          handle: '.draggle'
        }"
        :move="handleMove"
      >
        <div
          v-for="(item, index) in iboxFriendRemarks"
          :key="index"
          class="draggle"
        >
          <el-form-item v-if="item.friendRemarkType !== 3">
            <div class="itemFlex">
              <el-checkbox
                v-model="item.isTick"
                :disabled="!isEditFriendRemark"
                :label="friendRemarkLabel[item.friendRemarkType]"
              />
              <div>
                最长
                <el-input-number
                  v-if="isEditFriendRemark"
                  v-model="item.length"
                  size="mini"
                  :controls="false"
                  :max="20"
                  :min="0"
                />
                <span v-else>{{ item.length }}</span>
                字
              </div>
            </div>
          </el-form-item>

          <el-form-item v-if="item.friendRemarkType === 3">
            <div class="itemFlex">
              <el-checkbox
                v-model="item.isTick"
                :disabled="!isEditFriendRemark"
                label="客户手机号"
              />
              <div class="minW">最长11个字</div>
            </div>
          </el-form-item>
        </div>
      </draggable>
      <template v-if="ruleForm.taskStatus !== '4'">
        <el-button
          v-if="!isEditFriendRemark"
          type="text"
          @click="handleEditFriendRemark"
        >编辑</el-button>
        <template v-else>
          <el-button
            :loading="loading"
            class="m-l-10"
            size="small"
            type="primary"
            @click="handleSaveFriendRemark"
          >保存</el-button>
          <el-button
            :loading="loading"
            class="m-l-10"
            size="small"
            @click="isEditFriendRemark = false"
          >取消</el-button>
        </template>
      </template>
    </el-form-item>
    <el-form-item label="欢迎语：" prop="taskWelcomes">
      <el-radio-group
        v-model="ruleForm.ruleType"
        :disabled="[2, 4].includes(ruleForm.dataType)"
        @change="handleRuleForm"
      >
        <el-radio :label="1">默认规则</el-radio>
        <el-radio :label="2">自定义规则</el-radio>
      </el-radio-group>
      <div v-show="ruleForm.ruleType === 1" class="cardBoxWarp">
        <div>
          <div class="wxTitle">
            <div class="titleText">场景类型</div>
          </div>
          <div class="textOne">场景一：</div>
          <div class="textTwo">
            一个订单单个商品，按拼接内容发送，内容包含商品名称，学习链接，资料链接，物流和发票等链接。
          </div>
          <div class="textOne">场景二：</div>
          <div class="textTwo">一个订单多个商品</div>
          <welcomeMessageSettings
            ref="welcomeDefaultMessageSettings"
            class="welBox"
            :task-id="ruleForm.id"
            :hide-title="true"
            :is-add="false"
            @handleFocus="btnActive = 1"
            @change="getTaskWelcomes"
            @sort="getTaskWelcomesSort"
          />
        </div>
        <div>
          <div class="wxTitle">
            <div class="titleText">微信预览效果</div>
            <div class="btnBox">
              <div
                v-for="(item, index) in btnList"
                :key="index"
                :class="{ activeBtn: index === btnActive }"
                @click="btnActive = index"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <phoneMsg :data-list="defaultDataList" />
        </div>
      </div>
      <div
        v-show="ruleForm.ruleType === 2"
        class="cardBoxWarp"
      >
        <welcomeMessageSettings
          ref="welcomeMessageSettings"
          :type-tour="false"
          :task-id="ruleForm.id"
          class="welBox"
          :hide-title="true"
          @change="getTaskWelcomes"
          @sort="getTaskWelcomesSort"
        />

        <div>
          <div class="wxTitle">
            <div class="titleText">微信预览效果</div>
          </div>
          <phoneMsg :data-list="customizeDataList" />
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { taskObjectiveOption } from '../../columns'
import welcomeMessageSettings from './welcomeMessageSettings'
import labelInput from '../AddTask/labelinput'
import phoneMsg from '../phoneMsg'
import moment from 'moment'
import draggable from 'vuedraggable'
import {
  saleTaskUpdate,
  saleTaskUpdateFriendRemark,
  taskWelcomUpdateContent,
  taskWelcomResort
} from '@/api/privateArea/CRM'
const initCustomTaskWelcomesContent =
  '老板，您的眼光真不错，您购买的课程已经放到您的学习中心-已购课程中！您可以根据自己的实际情况，点击下方链接登录查看学习！【学习中心】点击链接：https://hokvv.cn/BDXfqy'
export default {
  name: 'BasicInfo',
  components: {
    welcomeMessageSettings,
    phoneMsg,
    labelInput,
    draggable
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var checkTime = (rule, value, callback) => {
      if (this.ruleForm.ad === 2) {
        return callback()
      } else {
        if (!this.time || !this.time[0] || !this.time[1]) {
          return callback('请选择时间')
        }
        if (
          new Date(this.ruleForm.time[0]).getTime() >= Date.now() &&
          this.time[0] < moment().format('YYYY-MM-DD HH:mm')
        ) {
          return callback('开始时间需要大于当前时间')
        }
        if (this.time[1] < moment().format('YYYY-MM-DD HH:mm')) {
          return callback('结束时间需要大于当前时间')
        }
        if (this.time[1] < this.time[0]) {
          return callback('结束时间需要大于开始时间')
        }
        return callback()
      }
    }
    return {
      ifloading: false,
      rules: {
        time: [{ required: true, validator: checkTime, trigger: 'change' }]
      },
      btnList: ['场景一', '场景二'],
      btnActive: 0,
      taskWelcomesRadio: 1,
      taskWelcomesList: [],
      ruleForm: {
        taskName: '',
        dataType: 1,
        ruleType: 1,
        tags: [],
        ad: 1, // 任务时间类型 1特定时间 2立即开始
        time: ['', ''],
        taskStatus: '',
        taskObjective: 1, // 任务目的
        orderTags: [], // 订单类型： 订单标签
        tableList: [], // 线下表格类型：表格数据
        taskWelcomes: []
      },
      iboxFriendRemarks: [
        { friendRemarkType: 1, isTick: false, length: undefined },
        { friendRemarkType: 2, isTick: false, length: undefined },
        { friendRemarkType: 3, isTick: false, length: 11 },
        { friendRemarkType: 4, isTick: false, length: undefined }
      ],
      labelInput: '',
      closable: false,
      pickerOptions1: {
        disabledDate: time => {
          if (!this.time[1]) {
            // 先限制今天之前
            return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
          }
          // 先限制今天之前
          return (
            time.getTime() >= new Date(this.time[1]).getTime() ||
            time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
          )
        }
      },
      pickerOptions2: {
        disabledDate: time => {
          if (!this.time[0]) {
            // 先限制今天之前
            return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
          }
          return (
            new Date(moment(time).format('YYYY-MM-DD')).getTime() <
              new Date(moment(this.time[0]).format('YYYY-MM-DD')).getTime() ||
            time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
          )
        }
      },
      ifEdit: false,
      time: ['', ''],
      isEditFriendRemark: false,
      contentId: '',
      friendRemarkLabel: {
        1: '来源IP老师',
        2: '微信昵称',
        4: '任务名称'
      },
      isEditName: false
    }
  },
  computed: {
    taskObjectiveOption() {
      if (this.ruleForm.dataType !== 2) {
        return taskObjectiveOption
      } else {
        return [...taskObjectiveOption, { label: '只分配线索', value: 2 }]
      }
    },
    defaultDataList() {
      const taskWelcomes = this.taskWelcomesList || []
      const newTaskWelcomes = taskWelcomes.filter(item => !item.content)
      if (this.btnActive === 0) {
        const data = [
          {
            content: initCustomTaskWelcomesContent
          },
          ...(newTaskWelcomes || [])
        ]
        return data
      }
      if (this.btnActive === 1) {
        if (!taskWelcomes[0]?.content) {
          const data = [
            {
              content: initCustomTaskWelcomesContent
            },
            ...(newTaskWelcomes || [])
          ]
          return data
        }
      }
      return this.taskWelcomesList || []
    },
    customizeDataList() {
      const contentList = this.taskWelcomesList?.filter(i => i.content) ?? []
      return [
        { content: contentList[0]?.content ?? '' },
        ...(this.ruleForm.taskWelcomes?.filter(i => i.type) ?? [])
      ]
    }
  },
  methods: {
    onhandleEdit() {
      this.time = JSON.parse(JSON.stringify(this.ruleForm.time))
      this.ifEdit = true
    },
    handleMove() {
      return this.isEditFriendRemark
    },
    delLabel(item, index) {
      this.ruleForm.tags.splice(index, 1)
      this.update()
    },
    update() {
      const tagIds = this.ruleForm.tags.map(i => i.id)
      saleTaskUpdate({
        id: this.ruleForm.id,
        tagIds
      })
    },
    delNoNumber() {},
    labelSelect(res) {
      this.labelInput = ''
      const index = this.ruleForm.tags.findIndex(v => v.id === res.id)
      if (index === -1) {
        this.ruleForm.tags.push(res)
        this.$refs.ruleForm.clearValidate('tags')
        this.update()
      }
      // index === -1 && this.$emit('addTags', res)
      // this.$refs.ruleForm && this.$refs.ruleForm.validateField('tags')
    },
    setData(form) {
      this.ruleForm = form
      this.iboxFriendRemarks = form.friendRemarks ?? [
        { friendRemarkType: 1, isTick: false, length: undefined },
        { friendRemarkType: 2, isTick: false, length: undefined },
        { friendRemarkType: 3, isTick: false, length: 11 },
        { friendRemarkType: 4, isTick: false, length: undefined }
      ]
      this.closable = ['1', '2', '3'].includes(form.taskStatus)
      const contentList = form?.taskWelcomes?.filter(i => i.content) ?? []
      let refName = 'welcomeMessageSettings'
      if (form.ruleType === 1) {
        refName = 'welcomeDefaultMessageSettings'
        // 跟新发送信息样式
        this.taskWelcomesList = form?.taskWelcomes
      } else {
        this.taskWelcomesList = form?.taskWelcomes
        this.$refs.welcomeDefaultMessageSettings.form.content =
          initCustomTaskWelcomesContent
      }
      if (contentList.length) {
        this.$refs[refName].form.content = contentList[0]?.content ?? ''
        this.contentId = contentList[0].id
      }
      this.$refs[refName].items = form?.taskWelcomes?.filter(i => i.type) ?? []
    },
    onhandleSaveTime() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('saveTime', {
            ...this.ruleForm,
            time: this.time
          })
        } else {
          return false
        }
      })
    },
    onhandleSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('save', {
            ...this.ruleForm,
            time: this.time
          })
        } else {
          return false
        }
      })
    },
    async handleRuleForm() {
      let refName = 'welcomeMessageSettings'
      if (this.ruleForm.ruleType === 1) {
        refName = 'welcomeDefaultMessageSettings'
      }
      const items = this.$refs[refName].getItems()
      this.getTaskWelcomes(items)
    },
    getTaskWelcomes(taskWelcomes) {
      this.ruleForm.taskWelcomes = taskWelcomes
      let refName = 'welcomeMessageSettings'
      if (this.ruleForm.ruleType === 1) {
        refName = 'welcomeDefaultMessageSettings'
        // 跟新发送信息样式
        this.taskWelcomesList = taskWelcomes
      }
      this.$refs[refName].validate(async valid => {
        if (valid) {
          const params = taskWelcomes.find(i => i.content)
          const { code } = await taskWelcomUpdateContent({
            ...params,
            id: this.contentId,
            ruleType: this.ruleForm.ruleType
          })
          if (code === 1) {
            this.$emit('save', this.ruleForm)
          }
        }
      })
    },
    getTaskWelcomesSort(arr) {
      const items = arr.map((i, index) => {
        const obj = {
          id: i.id,
          sort: index
        }
        if (i.content) {
          obj.id = this.contentId
        }
        return obj
      })
      taskWelcomResort(items)
    },
    handleTransformationPeriodBlur() {
      this.$refs.welcomeMessageSettings.validate(valid => {
        if (valid) {
          this.$emit('save', this.ruleForm)
        }
      })
    },
    handlePriorityChange() {
      this.$refs.welcomeMessageSettings.validate(valid => {
        if (valid) {
          this.$emit('save', this.ruleForm)
        }
      })
    },
    disabledFn() {
      return new Date(this.ruleForm.time[0]).getTime() < Date.now()
    },
    async handleSaveFriendRemark() {
      if (this.ruleForm.taskObjective === 1) {
        const len = this.iboxFriendRemarks?.filter(item => item.isTick).length
        if (!len) {
          return this.$message.error(`企微备注至少勾选一项！`)
        }
      }
      const iboxFriendRemarks = this.iboxFriendRemarks?.find(
        item => item.isTick && !item?.length
      )
      if (iboxFriendRemarks) {
        const map = {
          1: '来源IP老师',
          2: '微信昵称',
          3: '客户手机号',
          4: '任务名称'
        }
        return this.$message.error(
          `${map[iboxFriendRemarks.friendRemarkType]} 请设置备注字数！`
        )
      }
      const total = this.iboxFriendRemarks.reduce((a, b) => {
        return b.isTick ? a + b.length : a
      }, 0)
      if (total > 20) {
        return this.$message.error('好友备注名总长度不能超过20！')
      }
      const { code } = await saleTaskUpdateFriendRemark({
        friendRemarks: this.iboxFriendRemarks,
        taskId: this.ruleForm.id
      })
      if (code === 1) {
        this.$message.success('保存成功')
        this.isEditFriendRemark = false
      }
    },
    handleEditFriendRemark() {
      this.isEditFriendRemark = true
    },
    handleEditName() {
      this.isEditName = true
    },
    handleSaveName() {
      this.$emit('save', this.ruleForm)
      this.isEditName = false
    }
  }
}
</script>
<style lang="scss" scoped>
.form-container ::v-deep {
  padding: 0 20px;
  .reply-right {
    padding: 20px 0px;
  }

  .wxTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  .titleText {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    padding-left: 9px;
    line-height: 1.5;
    border-left: 3px solid #0c6fff;
    // margin-bottom: 10px;
  }
  .textOne {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    margin-bottom: 12px;
  }
  .textTwo {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    margin-bottom: 12px;
  }
  .btnBox {
    display: flex;
    background: #f0f0f0;
    padding: 2px;
    border-radius: 4px;
    line-height: 1;
    > div:nth-of-type(1) {
      margin-right: 4px;
    }
    > div {
      font-size: 14px;
      font-weight: 400;
      padding: 3px;
      border-radius: 4px;
      line-height: 1.3;
      cursor: pointer;
    }
  }
  .wxBox {
    width: 244px;
    height: 424px;
    background: url('../../../../../assets/image/bgshell.png') no-repeat 100%
      100%;
    background-size: 100% 100%;
  }
  .activeBtn {
    background: #fff;
    color: #0c6fff;
  }
  .formItem {
    position: relative;
    .formText {
      left: 280px;
      color: #999999;
      position: absolute;
      > span {
        color: rgb(245, 146, 146);
      }
    }
  }
  .itemFlex {
    display: flex;
    align-items: center;
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background-color: #0c6fff;
      border-color: #0c6fff;
    }
    .el-checkbox__input.is-disabled.is-checked + span.el-checkbox__label {
      color: #0c6fff;
    }
    .minW {
      width: 116px;
    }
    > div:nth-last-of-type(1) {
      margin-left: 20px;
      color: #999999;
      > span {
        color: rgb(245, 146, 146);
      }
    }
    > label {
      width: 140px;
    }
    .el-input-number {
      width: 60px;
      margin: 0 5px;
    }
  }
  .cardBoxWarp {
    background: #fafafa;
    border-radius: 8px;
    display: flex;
    padding: 12px;
    > div:nth-of-type(1) {
      flex: 1;
      margin-right: 22px;
    }
  }
  .textContent {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
    margin-top: -10px;
  }
  .labelNameList {
    margin-top: 16px;
    width: 528px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px dashed #979797;
    padding: 18px 16px;
  }
  ::v-deep {
    .myTime {
      label {
        height: 32px;
        line-height: 32px;
        color: #777777;
      }
    }
  }
  .myElRadio {
    line-height: 32px;
    // height: 32px;
    // width: 100%;
  }
  .myElRadiotextContent {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
    margin-left: 17px;
  }
  .weChatUserBox {
    margin-top: 16px;
    width: 527px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px dashed #979797;
    padding: 8px 16px;
    display: flex;
    flex-wrap: wrap;
    .weChatUser {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      background: #e6f4ff;
      border-radius: 4px;
      padding: 0 8px;
      color: #999999;
      margin-right: 16px;
      margin-bottom: 8px;
      margin-top: 8px;
      .userName {
        width: 66px;
        color: #333;
      }
    }
  }
  .labelDel {
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
