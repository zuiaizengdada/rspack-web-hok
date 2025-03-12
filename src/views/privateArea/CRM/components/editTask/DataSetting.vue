<template>
  <el-form
    ref="ruleForm"
    :model="form"
    :rules="rules"
    label-width="120px"
    class="form-container"
  >
    <div class="dataSettingHeader">
      <div class="dataSettingHeaderTitle">数据类型：订单</div>
      <div class="dataSettingTips">
        接入订单数据进入此任务并执行打电话和发短信的操作，若数据量过大承接不了，及时关闭任务。
      </div>
    </div>
    <el-form-item v-if="modelType === 2" label="线索来源部门" required>
      <el-button
        v-if="form.clueSourceDeptId === 0"
        style="margin-bottom: 10px"
        type="primary"
        size="mini"
        @click="selectDept"
        >选择部门</el-button
      >
      <div v-else>
        <el-tag>{{ deptName }}</el-tag>
      </div>
    </el-form-item>
    <el-form-item label="线索接量方式" prop="conditionMode">
      <el-radio-group
        v-model="form.conditionMode"
        :disabled="true"
        @change="handleConditionMode"
      >
        <el-radio
          v-for="item in condition_type"
          :key="item.value"
          :label="item.value"
          >{{ item.label }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <commodity
      v-if="form.conditionMode === 1"
      ref="commodityRef"
      :data-list.sync="form.conditions"
      :task-id="form.id"
      type="EDIT"
      :task-status="form.taskStatus"
    />
    <goodsTable
      v-if="form.conditionMode === 2"
      ref="goodsTableRef"
      :data-list.sync="form.conditions"
      :task-id="form.id"
      type="EDIT"
      :task-status="form.taskStatus"
      :course-type="courseType"
    />
    <div v-if="form.conditionMode === 3" style="padding: 0 20px">
      <el-checkbox-group
        v-model="form.goodsTypeList"
        @change="handleGoodsTypeList"
      >
        <el-checkbox :label="2">视频</el-checkbox>
        <el-checkbox :label="1">音频</el-checkbox>
        <el-checkbox :label="3">专栏</el-checkbox>
        <el-checkbox :label="4">大专栏</el-checkbox>
        <el-checkbox :label="7">套餐课</el-checkbox>
      </el-checkbox-group>
    </div>
  </el-form>
</template>
<script>
import {
  callList,
  taskCallAI,
  taskCallSms,
  updateTaskClueGoodsType
} from '@/api/privateArea/toolbox'
import { getChannelSignaturePageV2 } from '@/api/system/sms'
import commodity from '../commodity/index'
import goodsTable from '../goodsTable/index'
export default {
  name: 'DataSetting',
  components: {
    commodity,
    goodsTable
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    modelType: {
      type: Number,
      default: 1
    },
    courseType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      checkList: [],
      condition_type: [],
      form: {
        lectureName: '',
        smsActionId: '',
        lectureIdList: '',
        callId: '',
        smsSignatureId: '',
        conditionMode: 1,
        conditions: [],
        smsSignatureName: '',
        id: '',
        title: '',
        taskStatus: '',
        clueSourceDeptId: ''
      },
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        callId: [{ required: true, message: '请选择', trigger: 'change' }],
        smsSignatureId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        conditionMode: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      callTaskOptions: [],
      signOptions: [],
      deptName: ''
    }
  },
  created() {
    this.condition_type =
      this.courseType === 1
        ? [this.$getDictList('CONDITION_TYPE').find(item => item.value === 2)]
        : this.$getDictList('CONDITION_TYPE')
  },
  methods: {
    handleAddCondition() {},
    setData(form = {}) {
      this.form = form
      this.deptName = form.deptName
      this.getCallTask()
      this.getSignOptions()
      this.$nextTick(() => {
        if (form.conditionMode === 1) this.$refs.commodityRef.initData(form)
        if (form.conditionMode === 2) this.$refs.goodsTableRef.initData(form)
      })
      this.condition_type =
        this.courseType === 1
          ? [this.$getDictList('CONDITION_TYPE').find(item => item.value === 2)]
          : this.$getDictList('CONDITION_TYPE')
    },
    async handleGoodsTypeList(value) {
      if (!value.length) return
      const { code } = await updateTaskClueGoodsType({
        taskId: this.form.id,
        goodsTypeList: value
      })
      if (code === 1) this.$message.success('修改成功')
    },
    handleConditionMode(value) {
      this.$nextTick(() => {
        if (value === 1) this.$refs.commodityRef.initData(this.form)
        if (value === 2) this.$refs.goodsTableRef.initData(this.form)
      })
    },
    selectDept() {
      this.$AddressBook2({
        visible: true,
        multiple: false,
        type: [0],
        checkUser: [],
        success: res => {
          if (res.dept.length) {
            this.form.clueSourceDeptId = res.dept[0].deptId
            this.form.deptName = res.dept[0].name
            this.$emit('save', this.form)
          }
        }
      })
    },
    async getCallTask() {
      const { data } = await callList()
      this.callTaskOptions = data
    },
    async getSignOptions() {
      const { data } = await getChannelSignaturePageV2()
      this.signOptions = data ?? []
    },
    async handleChangeSmsSignature(val) {
      const data = this.signOptions.find(i => i.id === val)
      this.form.smsSignatureName = data?.signatureName ?? ''
      const params = {
        taskId: this.form.id,
        smsActionId: this.form.smsActionId,
        smsSignatureId: this.form.smsSignatureId,
        smsSignatureName: this.form.smsSignatureName
      }
      const { code } = await taskCallSms(params)
      if (code === 1) {
        this.$message.success('修改成功')
      }
    },
    async handleChangeAI() {
      const params = {
        taskId: this.form.id,
        callId: this.form.callId
      }
      const { code } = await taskCallAI(params)
      if (code === 1) {
        this.$message.success('修改成功')
      }
    },
    async changeSmsTem(current) {
      this.form.title = current.title
      this.form.smsActionId = current.actionId
      const params = {
        taskId: this.form.id,
        smsActionId: this.form.smsActionId,
        smsSignatureId: this.form.smsSignatureId,
        smsSignatureName: this.form.smsSignatureName
      }
      const { code } = await taskCallSms(params)
      if (code === 1) {
        this.$message.success('修改成功')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.form-container {
  padding: 0 20px;
}
.dataSettingHeader {
  width: 688px;
  padding: 20px;
  background: #f2f9ff;
  border-radius: 8px;
  margin-bottom: 32px;
  .dataSettingHeaderTitle {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #333333;
    line-height: 20px;
  }
  .dataSettingTips {
    margin-top: 16px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #f53f3f;
    line-height: 20px;
  }
}
.reception-replace-btn {
  background: #fff;
  color: #0c6fff;
  border: 1px solid #0c6fff;
}
.labelValue {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  margin-right: 11px;
}
.labelTips {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #777777;
  line-height: 17px;
}
.tagBox {
  margin-top: 6px;
  display: flex;
  margin-right: 10px;
  margin-bottom: 10px;
  min-height: 24px;
  .tagView {
    height: 24px;
    line-height: 24px;
    background: #e7f0ff;
    border-radius: 4px;
    border: 1px solid #dae9ff;
    padding: 0 16px;
    font-size: 12px;
    font-weight: 400;
    color: #0c6fff;
    line-height: 20px;
    margin-right: 10px;
  }
}
</style>
