<template>
  <div class="warpBox">
    <div class="warpContent">
      <div class="titleText">
        单个手机号码 电话每天最多打2次，短信每天最多发3条。
      </div>
      <div class="addBox">
        <div>触达规则</div>
        <!-- 仅在规则数量少于配置时显示新增规则按钮 -->
        <el-button
          v-if="list.length < actionConfig.length"
          size="mini"
          type="primary"
          :disabled="disabled"
          @click="handleAddModel"
        ><i class="el-icon-plus" /> 新增规则</el-button>
      </div>
      <div class="centent">
        <!-- 遍历规则列表 -->
        <div v-for="(item, index) in list" :key="index + item">
          <div class="cardText">
            <span>规则{{ index + 1 }}</span>
            <!-- 删除规则的按钮，仅在规则数量大于1时可见 -->
            <span
              v-show="list.length > 1 && form.taskStatus !== '4'"
              @click="handleDel(index)"
            >删除</span>
          </div>
          <div class="itemBox">
            <div class="title">触达条件</div>
            <div class="selectBox">
              <span>*分配后未退款且</span>
              <m-select
                v-model="item.defineType"
                dict-key="ADD_WECHAT_STATUS"
                style="width: 200px"
                size="mini"
                :disabled="disabled"
                @change="handleDefineType(index)"
              />
              <m-select
                v-model="item.actionId"
                :dict-list="actionConfig"
                :param="{ value: 'id', label: 'actionName' }"
                style="width: 200px; margin-left: 10px"
                size="mini"
                :disabled="disabled"
                @change="handleChangeAI(index)"
                @visible-change="handleVisibleChange"
              />
              <el-button
                v-if="
                  permsList.includes('web:myTask:timeConfigDrawer') ||
                    permsList.includes('web:deptTask:timeConfigDrawer') ||
                    permsList.includes('web:AllTask:timeConfigDrawer')
                "
                type="primary"
                size="mini"
                style="margin-left: 10px"
                @click="handleTimeConfig"
              >触达时间配置</el-button>
            </div>
          </div>
          <div class="itemBox">
            <div class="title">执行动作</div>
            <span>AI外呼</span>
            <m-select
              v-model="item.callId"
              :disabled="disabled"
              filterable
              size="mini"
              placeholder="请选择"
              style="width: 200px"
              :dict-list="callTaskOptions"
              :param="{ value: 'id', label: 'name' }"
              @change="handleChangeAI(index)"
            />
            <span class="text">外呼时间段早8点至晚9点</span>
          </div>
          <el-form
            ref="ruleForm"
            :model="form"
            :rules="rules"
            label-width="140px"
            class="form-container"
          >
            <el-form-item label="*短信模板" prop="smsActionId">
              <smsMsgTemplate
                v-model="item.smsActionId"
                :sms-signature-id.sync="item.smsSignatureId"
                :sms-signature-name.sync="item.smsSignatureName"
                :btn-disabled="disabled"
                :sms-msg="item.smsContent"
                @update="update(index)"
                @handleSmsSignature="handleSmsSignature(index)"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="type === 'add'" class="drawer__footer">
      <el-button
        :loading="loading"
        size="small"
        @click="onhandleBackStep"
      >上一步</el-button>
      <el-button
        :loading="loading"
        size="small"
        type="primary"
        @click="handleNextStep"
      >下一步</el-button>
    </div>
    <TimeConfigDrawer
      v-model="timeConfigVisible"
      :visible.sync="timeConfigVisible"
    />
  </div>
</template>

<script>
const itemObj = {
  defineType: '',
  actionId: '',
  callId: '',
  smsContent: '',
  smsActionId: '',
  smsSignatureId: ''
}

const msgList = {
  defineType: '请选择触达条件是否加微！',
  actionId: '请选择触达时间！',
  smsActionId: '请选择短信模板！',
  smsSignatureId: '请选择短信模板签名！'
}

import smsMsgTemplate from '../smsMsgTemplate/index'
import { callList } from '@/api/privateArea/toolbox'
import {
  getActionConfigList,
  putTaskOrderChange,
  removeTaskOrderChange
} from '@/api/privateArea/CRM'
import { getChannelSignaturePageV2 } from '@/api/system/sms'
import TimeConfigDrawer from './components/TimeConfigDrawer'

export default {
  components: {
    smsMsgTemplate,
    TimeConfigDrawer
  },
  props: {
    type: {
      type: String,
      default: 'edit'
    }
  },
  data: () => ({
    actionConfigList: [], // 动作配置列表
    list: [{ ...itemObj }], // 规则列表
    form: {}, // 表单数据
    callTaskOptions: [], // 呼叫任务选项
    signOptions: [], // 短信签名选项
    rules: {}, // 表单验证规则
    loading: false, // 加载状态
    timeConfigVisible: false, // 触达时间配置弹窗
    permsList: [] // 初始化为空数组
  }),
  computed: {
    actionConfig() {
      // 计算可用的动作配置
      if (this.list.length && this.actionConfigList.length) {
        const list = this.actionConfigList.map(item => ({
          ...item,
          disabled: this.list.some(n => n.actionId === item.id) // 判断该动作是否被禁用
        }))
        return list || this.actionConfigList
      }
      return this.actionConfigList
    },
    disabled() {
      return this.form.taskStatus === '4' || this.type === 'detail'
    }
  },

  created() {
    this.permsList = this.$route?.meta?.permsList || []
    this.initDataQuery() // 初始化数据查询
  },
  activated() {
    this.initDataQuery() // 组件激活时重新初始化数据
  },
  methods: {
    handleVisibleChange(visible) {
      if (visible) {
        this.getActionConfigList()
      }
    },
    async putTaskOrderChange(index) {
      // 提交任务规则的变化
      const obj = this.list[index]
      const msgKey = Object.keys(msgList)?.find(item => !obj[item])
      if (msgKey) return this.$message.warning(msgList[msgKey]) // 显示警告信息

      // 满足要求发送请求
      const { code, data } = await putTaskOrderChange({
        ...this.list[index],
        taskId: this.form.id
      })
      if (code === 1) {
        if (data) this.list[index].id = data
        this.$message.success('修改成功') // 提示修改成功
      }
    },
    async getActionConfigList() {
      // 获取动作配置列表
      const { code, data } = await getActionConfigList()
      if (code === 1 && data?.length) this.actionConfigList = data || []
    },
    handleDel(index) {
      // 删除指定的规则
      if (this.list.length === 1) {
        return this.$message.warning('最少保留一条触达规则！') // 至少保留一条规则
      }
      if (this.type === 'add') {
        this.list.splice(index, 1) // 从列表中删除规则
        return
      }
      this.removeTaskOrderChange(index)
    },
    async removeTaskOrderChange(index) {
      const item = this.list[index]
      const { code } = await removeTaskOrderChange({
        id: item.id,
        taskId: this.form.id
      })
      if (code === 1) {
        this.list.splice(index, 1) // 从列表中删除规则
        this.$message.success('删除成功！')
        return
      }
    },
    handleAddModel() {
      // 添加新的规则
      this.list.push({
        ...itemObj,
        defineType: this.list[0]?.defineType || '',
        smsSignatureId: this.list[0]?.smsSignatureId || '',
        smsSignatureName: this.list[0]?.smsSignatureName || ''
      })
    },
    listMsg() {
      // 检查规则列表中的每一项是否符合要求
      let result = null
      for (let i = 0; i < this.list.length; i++) {
        const obj = this.list[i]
        const msgKey = Object.keys(msgList)?.find(item => !obj[item])
        if (msgKey) {
          result = true
          this.$message.warning(`第${i + 1}条规则，${msgList[msgKey]}`) // 显示警告信息
          break
        }
      }
      return result
    },
    onhandleBackStep() {
      // 处理上一步操作
      const isMsg = this.listMsg()
      if (isMsg) return // 如果有警告信息则不执行
      this.$emit('backStep', {
        ...this.ruleForm,
        taskReachAddRequests: this.list // 传递规则列表
      })
    },
    handleNextStep() {
      // 处理下一步操作
      const isMsg = this.listMsg()
      if (isMsg) return // 如果有警告信息则不执行
      this.$emit('nextStep', {
        ...this.ruleForm,
        taskReachAddRequests: this.list // 传递规则列表
      })
    },
    handleTimeConfig() {
      this.timeConfigVisible = true
    },
    handleALLDefineType(index, key) {
      const items = this.list[index]
      if (this.list.length > 1) {
        this.list.forEach(item => {
          item[key] = items[key]
        })
      }
    },
    handleDefineType(index) {
      this.handleALLDefineType(index, 'defineType')
      this.handleChangeAI(index)
    },
    async handleChangeAI(index) {
      // 处理AI选择变化
      if (this.type === 'add') return // 如果是添加模式则不执行
      this.putTaskOrderChange(index) // 提交任务规则的变化
    },
    handleSmsSignature(index) {
      // 处理短信签名变化
      this.handleALLDefineType(index, 'smsSignatureName')
      this.handleALLDefineType(index, 'smsSignatureId')
    },
    async initDataQuery() {
      // 初始化数据查询
      await Promise.all([
        this.getActionConfigList(),
        this.getCallTask(),
        this.getSignOptions()
      ])
    },
    setData(form) {
      // 设置表单数据
      if (!form) return
      this.list = form.taskReachAddRequests || [] // 设置规则列表
      this.form = form // 设置表单数据
    },
    // async changeSmsTem(current, index) {
    //   // 更改短信模板
    //   this.list[index].smsContent = current.title // 更新短信内容
    //   this.list[index].smsActionId = current.actionId // 更新短信动作ID
    // },
    update(index) {
      if (this.type === 'add') return // 如果是添加模式则不执行
      this.putTaskOrderChange(index) // 提交任务规则的变化
    },
    async getSignOptions() {
      // 获取短信签名选项
      const { data } = await getChannelSignaturePageV2()
      this.signOptions = data ?? [] // 设置短信签名选项
    },
    async getCallTask() {
      // 获取呼叫任务选项
      const { data } = await callList()
      this.callTaskOptions = data // 设置呼叫任务选项
    }
  }
}
</script>

<style lang="scss" scoped>
.warpBox::v-deep {
  height: 100%;
  display: flex;
  flex-direction: column;
  > div:nth-of-type(1) {
    height: calc(100vh - 200px);
    overflow-y: scroll;
    padding: 0 20px;
  }
  .drawer__footer {
    border-top: 1px solid #e7e7e7;
    padding: 12px 21px;
    text-align: left;
  }
  .centent {
    margin-left: 75px;
    .form-container {
      margin-top: 16px;
    }
    .itemBox {
      display: flex;
      align-items: center;
      margin-top: 16px;
      > .title {
        margin-right: 20px;
      }
      > span {
        margin-right: 10px;
        color: #000000;
        font-size: 16px;
        font-weight: 400;
      }
      .text {
        color: #999999;
        font-size: 12px;
        margin-left: 10px;
        margin-right: 0;
      }
    }
    > div {
      border: 0 solid #979797;
      background: #fafafa;
      padding: 20px;
      margin-top: 10px;
    }
    .cardText {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      line-height: 1;
      > span:nth-of-type(2) {
        color: #f1330d;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
      }
    }
    .title {
      color: #000000;
      font-size: 16px;
      font-weight: 700;
      line-height: 1;
    }
    .selectBox {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 1;
      > span {
        margin-right: 20px;
      }
    }
  }
  .titleText {
    color: #f53f3f;
    font-size: 14px;
    font-weight: 400;
    padding: 20px;
    border-radius: 8px;
    background: #fff6f2;
  }
  .addBox {
    display: flex;
    align-items: center;
    margin-top: 20px;
    > div:nth-of-type(1) {
      color: #333333;
      font-size: 14px;
      font-weight: 400;
      margin-right: 8px;
      &:before {
        content: '*';
        color: red;
        margin-right: 4px;
      }
    }
  }
}
</style>
