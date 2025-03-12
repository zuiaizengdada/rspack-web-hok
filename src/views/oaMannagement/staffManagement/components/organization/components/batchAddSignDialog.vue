<template>
  <el-dialog
    width="550px"
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item
        label="签署员工"
        key="personnelBaseInfoIds"
        label-width="100px"
        prop="personnelBaseInfoIds"
        v-if="showName"
      >
        {{ nameList }}
      </el-form-item>
      <el-form-item
        label="合同&协议"
        key="contractIds"
        label-width="100px"
        prop="contractIds"
        v-if="showFile"
      >
        <el-select
          v-model="form.contractIds"
          clearable
          multiple
          filterable
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
        key="companySystemIds"
        label="公司制度"
        label-width="100px"
        v-if="showCompany"
        prop="companySystemIds"
      >
        <el-select
          v-model="form.companySystemIds"
          clearable
          filterable
          multiple
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
import { batchAddSignAjax } from '@/views/oaMannagement/api/staff.js'
// import { queryCompanyPageList } from '@/api/businessAdmin/talentFile'
// import { hasValue } from '@/utils/index'
export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: ''
    },
    showName: {
      type: Boolean,
      default: true
    },
    showFile: {
      type: Boolean,
      default: true
    },
    showCompany: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '批量添加签署'
    },
    filterFileByInfoId: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        contractIds: [],
        companySystemIds: [],
        positionIds: [],
        companyIds: [],
        departmentIds: [],
        personnelBaseInfoIds: []
      },
      rules: {},
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
    },
    nameList() {
      return this.selectList.map(item => item.name).join('、')
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.form = {
        contractIds: [],
        companySystemIds: [],
        positionIds: this.selectList.map(item => item.positionIds).flat(),
        companyIds: this.selectList.map(item => item.companyId),
        departmentIds: this.selectList.map(item => item.departmentId),
        ...(this.filterFileByInfoId && {
          personnelBaseInfoIds: this.selectList.map(
            item => item.personnelBaseInfoId
          )
        })
      }
      console.log(this.form, this.filterFileByInfoId)
      this.flieListChange()
    },
    contractList() {
      const params = {}
      this.$store.dispatch('oaManage/getContractList', params).then(res => {
        this.companyAgreementList = res
        this.contractAgreementList = res
      })
    },
    getFileList(fileType) {
      const params = {
        positionIds: this.form.positionIds,
        companyIds: this.form.companyIds,
        departmentIds: this.form.departmentIds,
        personnelBaseInfoIds: this.form.personnelBaseInfoIds,
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
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            companySystemIds: this.form.companySystemIds,
            contractIds: this.form.contractIds,
            personnelBaseInfoIds: this.selectList.map(
              item => item.personnelBaseInfoId
            )
          }
          console.log(this.selectList, '444')
          this.loading = true
          batchAddSignAjax(params)
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
