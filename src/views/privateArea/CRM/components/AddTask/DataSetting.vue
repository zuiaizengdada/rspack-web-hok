<template>
  <div class="dataSetting">
    <el-form
      ref="ruleForm"
      label-width="120px"
      :model="ruleForm"
      :rules="rules"
      class="ruleForm"
    >
      <div class="dataSettingHeader">
        <div class="dataSettingHeaderTitle">数据类型：订单</div>
        <div class="dataSettingTips">
          接入订单数据进入此任务并执行打电话和发短信的操作，若数据量过大承接不了，及时关闭任务。
        </div>
      </div>
      <el-form-item
        v-if="modelType === 2"
        label="线索来源部门："
        prop="clueSourceDeptId"
      >
        <el-button
          v-if="!assessDept.length"
          style="margin-bottom: 10px"
          type="primary"
          size="mini"
          @click="selectDept"
        >选择部门</el-button>
        <div v-else>
          <el-tag
            v-for="item in assessDept"
            :key="item.deptId"
            closable
            @close="delAssessDept"
          >{{ item.name }}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="线索接量方式" prop="conditionMode">
        <el-radio-group
          v-model="ruleForm.conditionMode"
          :disabled="ruleForm.dataType !== 1"
          @change="handleConditionMode"
        >
          <el-radio
            v-for="item in filteredConditionType"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <commodity
        v-if="ruleForm.conditionMode === 1"
        ref="commodityRef"
        :data-list.sync="ruleForm.conditions"
        :task-id="ruleForm.old"
        :rule-form.sync="ruleForm"
        @updateRuleId="updateRuleId"
      />
      <goodsTable
        v-if="ruleForm.conditionMode === 2"
        ref="goodsTableRef"
        :task-id="ruleForm.old"
        :course-type="courseType"
        @updateRuleId="updateRuleId"
        @update:dataList="handleGoodsList"
      />
      <div v-if="ruleForm.conditionMode === 3" style="padding: 0 20px">
        <el-checkbox-group v-model="ruleForm.goodsTypeList">
          <el-checkbox :label="2">视频</el-checkbox>
          <el-checkbox :label="1">音频</el-checkbox>
          <el-checkbox :label="3">专栏</el-checkbox>
          <el-checkbox :label="4">大专栏</el-checkbox>
          <el-checkbox :label="7">套餐课</el-checkbox>
        </el-checkbox-group>
      </div>
    </el-form>
    <!-- 按钮 -->
    <div class="drawer__footer">
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
  </div>
</template>
<script>
import { getOrderTagList } from '@/api/privateArea/CRM'
import { callList } from '@/api/privateArea/toolbox'
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
    loading: {
      type: Boolean,
      default: false
    },
    modelType: {
      type: Number,
      default: 1
    },
    initFrom: {
      type: Object,
      default: () => ({
        courseType: 1
      })
    },
    courseType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      condition_type: [],
      rules: {
        labels: [
          { required: true, message: '请选择订单标签', trigger: 'change' }
        ],
        lectureIdList: [
          {
            type: 'array',
            required: true,
            message: '请选择IP老师',
            trigger: 'change'
          }
        ],
        // callId: [
        //   { required: true, message: '请选择AI外呼', trigger: 'change' }
        // ],
        clueSourceDeptId: [
          { required: true, message: '请选择线索来源部门', trigger: 'change' }
        ],
        // smsActionId: [
        //   { required: true, message: '请选择短信模板', trigger: 'change' }
        // ],
        smsSignatureId: [
          { required: true, message: '请选择签名', trigger: 'change' }
        ]
      },
      ruleForm: {
        labels: [],
        title: '',
        callId: '',
        conditionMode: 1,
        goodsTypeList: [],
        conditions: [],
        smsActionId: '',
        lectureIdList: [],
        smsSignatureId: '',
        smsSignatureName: '',
        clueSourceDeptId: '',
        deptName: ''
      },
      callTaskOptions: [],
      options: [],
      signOptions: [],
      myloading: false,
      assessDept: []
    }
  },
  computed: {
    filteredConditionType() {
      if (this.ruleForm.courseType === 1) {
        return this.condition_type.filter(item => item.value === 2)
      }
      return this.condition_type
    }
  },
  watch: {
    'ruleForm.courseType': {
      handler(val) {
        if (val === 1) {
          this.ruleForm.conditionMode = 2
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getList()
    this.getSignOptions()
    this.getCallTask()
    this.condition_type = this.$getDictList('CONDITION_TYPE')
  },
  methods: {
    handleGoodsList(value) {
      this.ruleForm.goodsIds = value.map(item => item.goodsId)
      this.ruleForm.goodsName = value.map(item => item.goodsName)
    },
    handleConditionMode(value) {
      this.$nextTick(() => {
        if (value === 1) this.$refs.commodityRef.initData(this.ruleForm)
        if (value === 2) this.$refs.goodsTableRef.initData(this.ruleForm)
      })
    },
    setData(form = {}) {
      this.ruleForm = form
      const data = this.assessDept[0] ?? {}
      if (form.clueSourceDeptId && !data?.deptId) {
        this.assessDept = [
          {
            name: form.deptName,
            deptId: form.clueSourceDeptId
          }
        ]
      }
      this.$nextTick(() => {
        if (form.conditionMode === 1) this.$refs.commodityRef.initData(form)
        if (form.conditionMode === 2) this.$refs.goodsTableRef.initData(form)
      })
      this.getCallTask()
      this.getSignOptions()
    },
    async getCallTask() {
      const { data } = await callList()
      this.callTaskOptions = data
    },
    async getSignOptions() {
      const { data } = await getChannelSignaturePageV2()
      this.signOptions = data ?? []
    },
    selectDept() {
      this.$AddressBook2({
        visible: true,
        multiple: false,
        type: [0],
        checkUser: [],
        success: res => {
          this.assessDept = res.dept
          if (res.dept.length) {
            this.ruleForm.clueSourceDeptId = res.dept[0].deptId
            this.ruleForm.deptName = res.dept[0].name
            this.$refs.ruleForm.clearValidate('clueSourceDeptId')
          }
        }
      })
    },
    delAssessDept() {
      this.assessDept = []
      this.ruleForm.clueSourceDeptId = ''
      this.ruleForm.deptName = ''
    },
    handleNextStep() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (
            (this.ruleForm.conditionMode === 1 ||
              this.ruleForm.conditionMode === 2) &&
            !this.ruleForm.id
          ) {
            this.$message.error('请添加商品')
            return
          }
          if (
            this.ruleForm.conditionMode === 3 &&
            !this.ruleForm.goodsTypeList.length
          ) {
            this.$message.error('请勾选商品类型')
            return
          }
          console.log(this.ruleForm)
          this.$emit('nextStep', this.ruleForm)
        } else {
          return false
        }
      })
    },
    updateRuleId(id) {
      this.ruleForm.id = id
      this.$emit('update:initFrom', { ...this.initForm, id })
    },
    changeSmsTem(current) {
      this.ruleForm.title = current.title
      this.ruleForm.smsActionId = current.actionId
    },
    handleChangeSmsSignature(val) {
      const data = this.signOptions.find(i => i.id === val)
      this.ruleForm.smsSignatureName = data?.signatureName ?? ''
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    onhandleBackStep() {
      this.$emit('backStep')
    },
    getList() {
      this.myloading = true
      getOrderTagList()
        .then(res => {
          res.data.forEach(v => {
            v.tips = v.description
            v.value = v.id
            v.label = v.tagName
          })
          this.options = res.data
          this.myloading = false
        })
        .catch(() => {
          this.myloading = false
        })
    }
  }
}
</script>
<style scoped lang="scss">
.dataSetting {
  height: 100%;
  display: flex;
  flex-direction: column;
  .ruleForm {
    flex: 1 0 0;
    padding: 0 20px;
    overflow: auto;
  }
  .drawer__footer {
    border-top: 1px solid #e7e7e7;
    padding: 12px 21px;
    text-align: left;
  }
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
</style>
