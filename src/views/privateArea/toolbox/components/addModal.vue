<template>
  <!-- 新增/编辑收款渠道 -->
  <AppDialog
    v-if="visible"
    v-model="visible"
    :title="title"
    width="480px"
    height="360px"
    :loading="loading"
    @success="send"
  >
    <div class="payChannelDialog overflowOuto">
      <!-- 新增/编辑收款渠道 -->
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="110px" size="small">
        <el-form-item label="外呼任务名称" prop="name">
          <el-input
            v-model="form.name"
            style="width: 296px"
            maxlength="60"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">老师专用</el-radio>
            <el-radio :label="2">通用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="IP老师" prop="lectureIdList">
          <teacherSelect
            ref="teacherSelect"
            v-model="form.lectureIdList"
            multiple
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="对应任务" prop="callCompanyId">
          <el-select
            v-model="form.callCompanyId"
            placeholder="请选择"
            filterable
            @change="handleChange"
          >
            <el-option
              v-for="item in companyOptions"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="callId">
          <el-select
            v-model="form.callId"
            :disabled="!form.callCompanyId"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in callOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            active-value="1"
            inactive-value="2"
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import teacherSelect from '@/components/AppTemplate/teacherSelect/index'
import { companyList, companyTaskList, callAdd, callUpdate, callInfo } from '@/api/privateArea/toolbox'
export default {
  components: {
    AppDialog,
    teacherSelect
  },
  data() {
    return {
      form: {
        name: '',
        type: 1,
        lectureIdList: [],
        callCompanyId: '',
        callId: '',
        status: '1',
        id: undefined
      },
      companyOptions: [],
      callOptions: [],
      type: 1,
      title: '新增外呼模版',
      visible: false,
      rules: {
        name: [
          { required: true, message: '请输入外呼任务名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        callCompanyId: [
          { required: true, message: '请选择对应机构', trigger: 'change' }
        ],
        callId: [
          { required: true, message: '请选择对应任务', trigger: 'change' }
        ],
        lectureIdList: [
          { type: 'array', required: true, message: '请选择IP老师', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      loading: false
    }
  },
  mounted() {},
  methods: {
    async open(row, type) {
      this.reset()
      this.getCompanyList()
      this.type = type
      this.title = type === 1 ? '新增外呼模版' : '外呼模版设置'

      if (type === 2) {
        const { data } = await callInfo(row.id)
        this.form = {
          name: data.name,
          type: data.type,
          lectureIdList: data.lectureIdList,
          callCompanyId: data.callCompanyId,
          callId: data.callTaskId,
          status: data.status,
          id: data.id
        }
        this.visible = true
        this.getCompanyTaskList()
      }
      this.visible = true
    },
    reset() {
      this.form = {
        name: '',
        type: 1,
        lectureIdList: [],
        callCompanyId: '',
        callId: '',
        status: '1',
        id: undefined
      }
    },
    async getCompanyList() {
      try {
        const { data } = await companyList()
        this.companyOptions = data
      } catch (e) {
        console.log(e)
        this.companyOptions = []
      }
    },
    handleChange() {
      this.getCompanyTaskList()
      this.form.callId = ''
    },
    async getCompanyTaskList() {
      try {
        if (!this.form.callCompanyId) return
        const { data } = await companyTaskList({
          companyId: this.form.callCompanyId
        })
        this.callOptions = data
      } catch (e) {
        this.callOptions = []
      }
    },
    successFn() {
      this.$emit('success')
      this.$notify.success({ title: '提示', message: '操作成功' })
      this.visible = false
    },
    send() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type === 1) {
            this.add()
          } else {
            this.edit()
          }
        } else {
          return false
        }
      })
    },
    add() {
      this.loading = true
      const params = JSON.parse(JSON.stringify(this.form))
      if (params.type === 2) {
        params.lectureIdList = undefined
      }
      callAdd(params)
        .then(res => {
          this.loading = false
          this.successFn()
        }).catch(() => {
          this.loading = false
        })
    },
    edit() {
      this.loading = true
      const params = JSON.parse(JSON.stringify(this.form))
      if (params.type === 2) {
        params.lectureIdList = undefined
      }
      callUpdate(params)
        .then(res => {
          this.loading = false
          this.successFn()
        }).catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.payChannelDialog {
  height: 518px;
  padding: 16px;
  box-sizing: border-box;
  .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
}
</style>
