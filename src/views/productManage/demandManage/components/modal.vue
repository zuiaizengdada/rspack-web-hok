
<template>
  <el-dialog
    v-if="visible"
    :close-on-click-modal="false"
    :title="title"
    width="580px"
    class="dialog-container"
    :visible.sync="visible"
    @close="handleClose"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="所属IP" prop="teacherId">
        <el-select
          v-model="form.teacherId"
          clearable
          filterable
          remote
          :remote-method="remoteMethod"
          :loading="loading"
          placeholder="请选择老师"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属领域" prop="fieldId">
        <el-select v-model="form.fieldId" placeholder="请选择所属领域">
          <el-option
            v-for="item in domainList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="话题标题" prop="keyword">
        <el-input
          v-model="form.keyword"
          maxlength="50"
          show-word-limit
          placeholder="请输入话题标题"
        />
        <el-button
          :disabled="!form.teacherId || !form.fieldId"
          style="margin-top: 4px"
          :loading="generateKeywordLoding"
          @click="generateKeyword"
        >
          AI生成
        </el-button>
      </el-form-item>
      <el-form-item label="话题描述" prop="description">
        <el-input
          v-model="form.description"
          maxlength="500"
          show-word-limit
          type="textarea"
          :rows="4"
          placeholder="请输入话题描述"
        />
        <el-button
          :disabled="!form.teacherId || !form.fieldId || !form.keyword"
          style="margin-top: 4px"
          :loading="generateDescriptionLoding"
          @click="generateDescription"
        >AI生成</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">{{
          btnText
        }}</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { demandAdd, demandEdit } from '@/api/product/demand'
import { getTreeLabelById } from '@/utils/index'
import { teacherQueryByName } from '@/api/tearchCenter/index'
import { getDomainData } from '@/utils/getApiData'
import { getAIContent } from '@/api/aigc'
import { aiBusinessScenePage } from '@/api/aigc/standardIssueConfig'
export default {
  data() {
    const patrn = /[@#$^&￥]/im
    const validator = (rule, value, callback) => {
      if (!value) {
        callback('请输入话题标题')
      } else if (patrn.test(value)) {
        callback('不能输入特殊字符!')
      } else {
        callback()
      }
    }
    return {
      title: '新增话题',
      btnText: '保存并新增下一条',
      visible: false,
      form: {
        keyword: '',
        description: '',
        fieldId: '',
        teacherId: ''
      },
      loading: false,
      type: 'add',
      options: [],
      questionQueryReq: undefined,
      questionKeywordId: undefined,
      domainList: [],
      rules: {
        keyword: [{ required: true, validator, trigger: 'blur' }],
        fieldId: [
          { required: true, message: '请选择所属领域', trigger: 'change' }
        ],
        teacherId: [
          { required: true, message: '请选择所属IP', trigger: 'change' }
        ]
      },
      ruleTmpList: [],
      generateKeywordLoding: false,
      generateDescriptionLoding: false
    }
  },
  methods: {
    generateDescription(e) {
      e.preventDefault()
      this.$uweb && this.$uweb.setAction('Event_click_btn_generate_topic_describe')
      this.generateDescriptionLoding = true
      const teacher = this.options.find(
        item => item.value === this.form.teacherId
      )
      const domain = this.domainList.find(
        item => item.value === this.form.fieldId
      )
      let rTmp = this.ruleTmpList.find(item => item.id === '3').prompt
      rTmp = rTmp.replace('${TeacherName', teacher.label)
      rTmp = rTmp.replace('}', '')
      rTmp = rTmp.replace('${AreaName', domain.label)
      rTmp = rTmp.replace('}', '')
      rTmp = rTmp.replace('${TopicTitle', this.form.keyword)
      rTmp = rTmp.replace('}', '')
      getAIContent({ action: 'generation', question: rTmp })
        .then(res => {
          this.form.description = res.answer
          this.generateDescriptionLoding = false
        })
        .catch(() => {
          this.generateDescriptionLoding = false
        })
    },
    generateKeyword(e) {
      e.preventDefault()
      this.$uweb && this.$uweb.setAction('Event_click_btn_generate_topic_title')
      this.generateKeywordLoding = true
      const teacher = this.options.find(
        item => item.value === this.form.teacherId
      )
      const domain = this.domainList.find(
        item => item.value === this.form.fieldId
      )
      let rTmp = this.ruleTmpList.find(item => item.id === '1').prompt
      rTmp = rTmp.replace('${TeacherName', teacher.label)
      rTmp = rTmp.replace('}', '')
      rTmp = rTmp.replace('${AreaName', domain.label)
      rTmp = rTmp.replace('}', '')
      getAIContent({ action: 'generation', question: rTmp })
        .then(res => {
          this.generateKeywordLoding = false
          this.form.keyword = res.answer
        })
        .catch(() => {
          this.generateKeywordLoding = false
        })
    },
    async open({ type, row }) {
      this.reset()
      this.options = []

      await this.getTradeDomianList()
      this.visible = true
      this.type = type
      if (row && row.keyword) {
        this.form.keyword = row.keyword
      }
      if (row && row.questionQueryReq) {
        this.questionQueryReq = row.questionQueryReq
      }
      if (row && row.questionKeywordId) {
        this.questionKeywordId = row.questionKeywordId
      }
      if (type === 'edit') {
        this.form = JSON.parse(JSON.stringify(row))
        this.remoteMethod(row.teacherName)
      }
      const res = await aiBusinessScenePage({
        pageIndex: 1,
        pageSize: 1000
      })
      this.ruleTmpList = res.data.items
      const isAdd = type === 'add'
      this.title = isAdd ? '新增话题' : '编辑话题'
      this.btnText = isAdd ? '保存并新增下一条' : '保存'
    },
    async getTradeDomianList() {
      this.domainList = await getDomainData()
    },
    remoteMethod(queryString) {
      if (!queryString) {
        return
      }
      this.loading = true
      const params = {
        name: queryString
      }
      teacherQueryByName(params)
        .then(res => {
          this.options = res.data?.map(v => {
            return { label: v.teacherName, value: v.teacherId }
          })
          this.loading = false
        })
        .catch(() => {
          this.options = []
          this.loading = false
        })
    },
    reset() {
      this.form = {
        keyword: '',
        description: '',
        fieldId: '',
        teacherId: ''
      }
    },
    handleClose() {
      this.$emit('close')
      this.visible = false
    },
    async add() {
      const { fieldName } = this.getLabelById()
      const { code } = await demandAdd({
        ...this.form,
        questionQueryReq: this.questionQueryReq,
        questionKeywordId: this.questionKeywordId,
        fieldName
      })
      if (code === 1) {
        this.$notify.success('新增成功')
        this.form.keyword = ''
        this.form.description = ''
      }
    },
    getLabelById() {
      const fieldName = getTreeLabelById(this.domainList, this.form.fieldId)
      return {
        fieldName
      }
    },
    async edit() {
      const { fieldName } = this.getLabelById()
      const { code } = await demandEdit({
        ...this.form,
        demandId: this.form.id,
        fieldName
      })
      if (code === 1) {
        this.$notify.success('保存成功')
        this.$refs.ruleForm.resetFields()
        this.handleClose()
      }
    },
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.type === 'add') {
            this.add()
          } else {
            this.edit()
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table_wrap {
  height: 100%;
}
.tips {
  margin-right: 10px;
}
.dialog-container ::v-deep {
  .el-dialog {
    border-radius: 10px;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #e7e7e7;
    .el-dialog__title {
      font-weight: bold;
    }
  }
}
</style>
