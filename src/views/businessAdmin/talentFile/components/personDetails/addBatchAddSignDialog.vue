<template>
  <el-dialog
    width="550px"
    :title="`编辑${form.name}在职信息`"
    :visible.sync="visible"
    inline
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <el-form ref="formModal" :model="form" :rules="rules">
      <el-form-item label="合同协议" class="form-item" prop="contractIds">
        <el-select
          v-model="form.contractIds"
          clearable
          filterable
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
          v-model="form.companySystemIds"
          clearable
          filterable
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
    <template slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" :loading="loading">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>
<script>
import { jobNoPageList } from '@/views/system/positionManagement/api/job'
import {
  queryCompanyPageList,
  editBaseInfoAjax
} from '@/api/businessAdmin/talentFile'
export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    info: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: { postId: undefined },
      rules: {
        postId: [
          {
            required: true,
            message: '请选择岗位',
            trigger: 'change'
          }
        ]
      },
      postList: [],
      jobList: [],
      companyList: [],
      companySystemIdsList: [],
      contractIdsList: [],
      loading: false
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  created() {
    this.form = {
      ...this.info
    }
    this.getCompanyPageList()
    this.getJobList()
  },
  methods: {
    submit() {
      this.$refs.formModal.validate(valid => {
        if (valid) {
          console.log(this.form)
          const params = {
            address: this.form.address,
            companyId: this.form.companyId,
            deptId: this.form.deptId,
            email: this.form.email,
            expectedEntryTime: this.form.expectedEntryTime,
            personnelBaseInfoId: this.form.personnelBaseInfoId,
            phone: this.form.phone,
            positionId: this.form.positionId
          }
          this.loading = true
          editBaseInfoAjax(params)
            .then(res => {
              if (res.code === 1) {
                this.$emit('success')
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    closeDialog() {
      this.$emit('close')
    },
    async getCompanyPageList() {
      const params = {
        pageIndex: 1,
        pageSize: 1000
      }
      queryCompanyPageList(params).then(res => {
        if (res.code === 1) {
          this.companyList = res.data.items.filter(item => item.status === 0)
        }
      })
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
            name: _this.form.entryDepartmentName,
            deptId: _this.form.entryDepartmentId
          }
        ],
        checkUserIds: [],
        success: res => {
          console.log(res)
          if (res.dept.length > 0) {
            _this.$set(this.form, 'entryDepartmentName', res.dept[0].name)
            _this.$set(this.form, 'entryDepartmentId', res.dept[0].id)
          }
        }
      })
    },
    getJobList() {
      jobNoPageList().then(res => {
        if (res.code === 1) {
          this.jobList = res.data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 10px;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}
.tips-block {
  width: 100%;
  padding: 20px;
  background: #f7f8f9;
  border-radius: 8px;
  margin-bottom: 20px;
  i {
    float: left;
    font-size: 22px;
    margin-right: 15px;
    margin-top: 3px;
    color: #f18649;
  }
  span {
    width: 425px;
    display: inline-block;
    color: #f18649;
    .title {
      font-size: 16px;
      margin-bottom: 8px;
    }
  }
}
</style>
