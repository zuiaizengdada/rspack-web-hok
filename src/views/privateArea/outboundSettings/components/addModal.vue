<template>
  <!-- 新增/编辑收款渠道 -->
  <AppDialog
    v-model="visible"
    :title="title"
    width="680px"
    height="450px"
    :loading="loading"
    @success="send"
  >
    <div class="payChannelDialog overflowOuto">
      <!-- 新增/编辑收款渠道 -->
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="110px" size="small">
        <el-form-item
          label="机构名称"
          prop="tenantId"
        >
          <el-select
            v-model="form.tenantId"
            placeholder="请选择机构"
            filterable
            @change="handleOrgChange"
          >
            <el-option
              v-for="item in companyOptions"
              :key="item.organizationId"
              :label="item.name"
              :value="item.organizationId"
            />
          </el-select>
        </el-form-item>
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
        <el-form-item v-if="form.type === 1 && form.tenantId" label="IP老师" prop="lectureIdList">
          <el-select
            v-model="form.lectureIdList"
            filterable
            multiple
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in lectureIdOptions"
              :key="item.lecturerId"
              :label="item.lecturerName"
              :value="item.lecturerId"
            />
          </el-select>
        </el-form-item>
        <template v-if="form.tenantId">
          <el-form-item
            v-for="(list, index) in form.callAddCompanyTypeRequests"
            :key="index"
            :label="index === 0 ? '对应任务':''"
            required
          >
            <el-col :span="9">
              <el-form-item
                :prop="'callAddCompanyTypeRequests.' + index + '.companyType'"
                style="margin-bottom:0px"
                :rules="{
                  required: true, message: '机构不能为空', trigger: 'change'
                }"
              >
                <el-select
                  v-model="list.companyType"
                  placeholder="请选择机构任务"
                  filterable
                  @change="handleChange(list)"
                >
                  <el-option
                    v-for="item in companyTypeOptions"
                    :key="item.companyType"
                    :disabled="isDisabled(item.companyType)"
                    :label="item.companyName"
                    :value="item.companyType"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="9">
              <el-form-item
                :prop="'callAddCompanyTypeRequests.' + index + '.callId'"
                style="margin-bottom:0px"
                :rules="{
                  required: true, message: '呼叫任务不能为空', trigger: 'change'
                }"
              >
                <el-select
                  v-model="list.callId"
                  :disabled="!list.companyType"
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in list.callOptions"
                    :key="item.id"

                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="6">
              <el-button class="icon-pl" @click="addCall"><i class="el-icon-plus" /></el-button>
              <el-button
                v-if="form.callAddCompanyTypeRequests.length > 1"
                class="icon-pl"
                @click="deleteCall(index)"
              ><i
                class="el-icon-minus"
              /></el-button>
            </el-col>
          </el-form-item>
        </template>
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
import { companyList, lecturerInfo, callOrgInfo, companyTaskList, callAdd, callUpdate, callInfo } from '@/api/privateArea/toolbox'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      form: {
        name: '',
        type: 1,
        lectureIdList: [],
        callAddCompanyTypeRequests: [{
          companyType: '',
          callId: '',
          callOptions: []
        }],
        tenantId: '',
        status: '1',
        id: undefined
      },
      companyOptions: [],
      companyTypeOptions: [],
      callOptions: [],
      type: 1,
      title: '新增外呼模版',
      visible: false,
      rules: {
        tenantId: [
          { required: true, message: '请选择外呼机构', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入外呼任务名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        lectureIdList: [
          { type: 'array', required: true, message: '请选择IP老师', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      loading: false,
      lectureIdOptions: []
    }
  },
  mounted() {},
  methods: {
    async open(row, type) {
      this.reset()
      this.getCompanyList()
      this.type = type
      this.title = type === 1 ? '新增外呼模版' : '外呼模版设置'
      // 编辑
      if (type === 2) {
        const { data } = await callInfo(row.id)
        const callAddCompanyTypeRequests = data.callTaskCallList.map(i => {
          return {
            companyType: i.companyType,
            callId: i.callTaskId,
            callOptions: []
          }
        }) ?? [{
          companyType: '',
          callId: '',
          callOptions: []
        }]
        this.form = {
          name: data.name,
          type: data.type,
          lectureIdList: data.lectureIdList ?? [],
          callAddCompanyTypeRequests,
          status: data.status,
          id: data.id,
          tenantId: data.tenantId
        }
        await this.getCompanyTypeList()
        this.getLectureIdList()
        callAddCompanyTypeRequests.forEach(item => {
          this.getCompanyTaskList(item)
        })
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    isDisabled(id) {
      return this.form.callAddCompanyTypeRequests.map(i => i.companyType).includes(id)
    },
    reset() {
      this.companyOptions = []
      this.companyTypeOptions = []
      this.form = {
        name: '',
        type: 1,
        lectureIdList: [],
        callAddCompanyTypeRequests: [{
          companyType: '',
          callId: '',
          callOptions: []
        }],
        tenantId: '',
        status: '1',
        id: undefined
      }
    },
    handleOrgChange() {
      this.form.callAddCompanyTypeRequests = [
        {
          companyType: '',
          callId: '',
          callOptions: []
        }
      ]
      this.form.lectureIdList = []
      this.getCompanyTypeList()
      this.getLectureIdList()
    },
    async getLectureIdList() {
      try {
        const { data } = await lecturerInfo({
          tenantId: this.form.tenantId
        })
        this.lectureIdOptions = data
      } catch (e) {
        console.log(e)
        this.lectureIdOptions = []
      }
    },
    addCall() {
      this.form.callAddCompanyTypeRequests.push({
        companyType: '',
        callId: '',
        callOptions: []
      })
    },
    deleteCall(index) {
      this.form.callAddCompanyTypeRequests.splice(index, 1)
    },
    async getCompanyList() {
      try {
        const { data } = await callOrgInfo()
        this.companyOptions = data
      } catch (e) {
        console.log(e)
        this.companyOptions = []
      }
    },
    async getCompanyTypeList() {
      try {
        const { data } = await companyList({
          tenantId: this.form.tenantId
        })
        this.companyTypeOptions = data
      } catch (e) {
        console.log(e)
        this.companyTypeOptions = []
      }
    },
    handleChange(item) {
      this.getCompanyTaskList(item)
      item.callId = ''
    },
    async getCompanyTaskList(item) {
      try {
        const itemInfo = this.companyTypeOptions.find(i => i.companyType === item.companyType)
        if (!itemInfo.id) return
        const { data } = await companyTaskList({
          companyId: itemInfo.id
        })
        // eslint-disable-next-line require-atomic-updates
        item.callOptions = data
      } catch (e) {
        // eslint-disable-next-line require-atomic-updates
        item.callOptions = []
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
      const callAddCompanyTypeRequests = this.form.callAddCompanyTypeRequests.map(item => {
        return {
          companyType: item.companyType,
          callId: item.callId
        }
      })
      const params = JSON.parse(JSON.stringify(this.form))
      params.callAddCompanyTypeRequests = callAddCompanyTypeRequests
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
      const callAddCompanyTypeRequests = this.form.callAddCompanyTypeRequests.map(item => {
        return {
          companyType: item.companyType,
          callId: item.callId
        }
      })
      const params = JSON.parse(JSON.stringify(this.form))
      params.callAddCompanyTypeRequests = callAddCompanyTypeRequests
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
  height: 448px;
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
