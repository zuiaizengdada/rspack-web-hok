<!-- 新增面试 -->
<template>
  <el-dialog
    title="修改"
    :visible.sync="visible"
    width="576px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="post" :model="post" :rules="rules" label-width="120px">
      <el-form-item label="入职公司" class="form-item" prop="entryCompanyId">
        <el-select
          v-model="post.entryCompanyId"
          clearable
          filterable
          placeholder="请选择入职公司"
          style="width: 100%"
          @change="flieListChange"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在部门" prop="entryDepartmentName">
        <el-input
          v-model="post.entryDepartmentName"
          style="width: calc(100% - 78px)"
          :disabled="true"
        />
        <el-button style="width: 68px" class="m-l-10" @click="selectDept"
          >选择</el-button
        >
      </el-form-item>
      <el-form-item label="岗位" class="form-item" prop="positionId">
        <!-- 岗位 -->
        <el-select
          v-model="post.positionId"
          clearable
          filterable
          placeholder="请选择岗位"
          style="width: 100%"
          @change="flieListChange"
        >
          <el-option
            v-for="item in jobList"
            :key="item.jobId"
            :label="item.jobName"
            :value="item.jobId"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="预计入职时间"
        class="form-item"
        prop="expectedEntryTime"
      >
        <el-date-picker
          v-model="post.expectedEntryTime"
          value-format="timestamp"
          type="date"
          placeholder="选择日期时间"
          style="width: 100% !important"
        />
      </el-form-item>
      <el-form-item
        label="合同协议"
        class="form-item"
        prop="contractIds"
        v-if="[1, 2].includes(post.entryRegisterAuditStatus)"
      >
        <el-select
          v-model="post.contractIds"
          clearable
          filterable
          disabled
          multiple
          placeholder="请选择合同协议"
          style="width: 100%"
        >
          <el-option
            v-for="item in contractIdsList"
            :key="item.id"
            :label="item.fileName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="公司制度"
        class="form-item"
        prop="companySystemIds"
        v-if="[1, 2].includes(post.entryRegisterAuditStatus)"
      >
        <el-select
          v-model="post.companySystemIds"
          clearable
          filterable
          disabled
          multiple
          placeholder="请选择公司制度"
          style="width: 100%"
        >
          <el-option
            v-for="item in companySystemIdsList"
            :key="item.id"
            :label="item.fileName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { jobNoPageList } from '@/views/system/positionManagement/api/job'
import { queryCompanyPageList } from '@/api/businessAdmin/talentFile'
import { hasValue } from '@/utils/index'

export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      companyList: [],
      userList: [],
      post: {
        contractIds: [],
        companySystemIds: []
      },
      jobList: [],
      rules: {
        entryCompanyId: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur'
          }
        ],
        entryDepartmentName: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur'
          }
        ],
        positionId: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur'
          }
        ],
        contractIds: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur'
          }
        ],
        companySystemIds: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur'
          }
        ],
        expectedEntryTime: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const todayTimestamp = new Date().setHours(0, 0, 0, 0)

              if (value < todayTimestamp) {
                callback(new Error('只能选中大于今天的日期'))
              }
              callback()
            }
          }
        ]
      },
      companySystemIdsList: [],
      contractIdsList: []
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  async mounted() {
    const res = await this.getJobList()

    if (res.some(item => item.jobId === +this.row.positionId)) {
      if (this.row.id) {
        this.post = { ...this.row }
      }
    } else {
      if (this.row.id) {
        this.post = { ...this.row, positionId: '' }
      }
    }
    this.post.companySystemIds =
      this.post.companySystemList.map(item => item.id) || []
    this.post.contractIds =
      this.post.contractAgreementList.map(item => item.id) || []
    console.log(this.post, '+++++++++')
    this.getCompanyPageList()
    this.getJobList()
    this.flieListChange()
  },
  methods: {
    getFileList(fileType) {
      const params = {
        ...(hasValue(this.post.positionId) && {
          positionIds: [this.post.positionId]
        }),
        ...(hasValue(this.post.entryCompanyId) && {
          companyIds: [parseInt(this.post.entryCompanyId)]
        }),
        ...(hasValue(this.post.entryDepartmentId) && {
          departmentIds: [this.post.entryDepartmentId]
        }),
        fileType,
        status: 1
      }
      this.$store
        .dispatch('oaManage/getfileFollowConditionList', params)
        .then(res => {
          if (fileType === 1) {
            this.contractIdsList = res || []
          } else if (fileType === 2) {
            this.companySystemIdsList = res || []
          }
        })
    },
    flieListChange() {
      this.getFileList(1)
      this.getFileList(2)
    },
    async entryCompanyIdChange(val) {
      this.companyId = val
      const dept = await this.getDeptData(this.companyId)
      this.deptOptions = dept
    },
    async getCompanyPageList() {
      const params = {
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await queryCompanyPageList(params)
      if (res) {
        this.companyList = res.data.items.filter(item => item.status === 0)
      }
    },
    // 点击选择部门
    selectDept() {
      const _this = this
      this.$AddressBook({
        type: [0],
        visible: true,
        multiple: false,
        checkDept: [
          {
            name: _this.post.entryDepartmentName,
            deptId: _this.post.entryDepartmentId
          }
        ],
        checkUserIds: [],
        success: res => {
          console.log(res)
          if (res.dept.length > 0) {
            _this.$set(this.post, 'entryDepartmentName', res.dept[0].name)
            _this.$set(this.post, 'entryDepartmentId', res.dept[0].id)
            this.flieListChange()
          }
        }
      })
    },
    async getJobList() {
      const res = await jobNoPageList()

      this.jobList = res.data

      return this.jobList
    },
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.post.validate(valid => {
        if (valid) {
          const params = {
            ...this.post
          }
          if (![1, 2].includes(params.entryRegisterAuditStatus)) {
            delete params.companySystemIds
            delete params.contractIds
          }
          this.$emit('submit', params)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}

::v-deep .el-dialog__title {
  font-size: 16px;
  font-weight: 500;
}

.dialog-footer {
  text-align: right !important;
}

.el-textarea__inner::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.el-textarea__inner::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}
.el-textarea__inner::-webkit-scrollbar-track {
  background-color: transparent;
}

.innerbox {
  max-height: 150px;
  overflow: auto;
}

// 滚动条整体样式
.innerbox::-webkit-scrollbar {
  width: 6px;
}
// 滚动条内嵌滑块
.innerbox::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
// 滚动条边角
.innerbox::-webkit-scrollbar-corner {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
