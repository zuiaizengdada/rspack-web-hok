<template>
  <el-dialog
    v-if="visible"
    title="保存问卷"
    width="550px"
    :visible.sync="visible"
  >
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="问卷名称:" prop="questionnaireName">
        <el-input
          v-model="form.questionnaireName"
          show-word-limit
          maxlength="100"
        />
      </el-form-item>
      <el-form-item label="有效期类型:" prop="validType">
        <el-radio-group v-model="form.validType">
          <el-radio :label="1">长期有效</el-radio>
          <el-radio :label="2">按时间</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="form.validType === 2"
        label="有效期:"
        prop="datePicker"
      >
        <el-date-picker
          v-model="form.datePicker"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addQuestionnaire } from '@/api/questionnaire'
export default {
  data() {
    return {
      form: {
        questionnaireName: '',
        validType: '',
        datePicker: [],
        startTime: undefined,
        endTime: undefined,
        questionnaireContext: ''
      },
      visible: false,
      rules: {
        questionnaireName: [
          { required: true, message: '请输入问卷名称', trigger: 'blur' }
        ],
        validType: [
          { required: true, message: '请选择有效期类型', trigger: 'change' }
        ],
        datePicker: [
          {
            type: 'array',
            required: true,
            message: '请选择有效期',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    init(json) {
      this.visible = true
      this.form.questionnaireContext = json
    },
    handleDateChange(val) {
      this.form.startTime = val[0]
      this.form.endTime = val[1]
    },
    handleClose() {
      this.reset()
      this.visible = false
    },
    reset() {
      this.form = {
        questionnaireName: '',
        validType: '',
        datePicker: [],
        startTime: undefined,
        endTime: undefined,
        questionnaireContext: ''
      }
    },
    async onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { code } = await addQuestionnaire(this.form)
          if (code === 1) {
            this.visible = false
            this.$notify.success('保存成功')
            this.reset()
            this.$emit('clear')
            // todoRouter--------
            // this.$router.push('/privateArea/questionnaire/list')
            this.$router.push('/yxgj/questionnaire/list')
          }
        }
      })
    }
  }
}
</script>

<style></style>
