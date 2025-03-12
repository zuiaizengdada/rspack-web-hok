<template>
  <el-form
    ref="form"
    v-loading="loading"
    :model="form"
    size="small"
    :rules="rules"
    inline
    label-width="160px"
    label-position="right"
  >
    <el-form-item label="手机号" prop="phoneNumber">
      <el-input
        v-model="form.phoneNumber"
        placeholder="请输入手机号"
        clearable
        maxlength="11"
        @input="e => delNumber(e, 'phoneNumber')"
      />
    </el-form-item>
    <el-form-item label="卡胚编码尾号" prop="embryoEndNumber">
      <el-input
        v-model="form.embryoEndNumber"
        :maxlength="30"
        placeholder="请输入卡胚编码尾号"
        clearable
      />
    </el-form-item>
    <el-form-item label="通信公司" prop="communicationCompany">
      <el-select
        v-model="form.communicationCompany"
        clearable
        placeholder="请选择通信公司"
      >
        <el-option
          v-for="item in communicationCompanyList"
          :key="item.label"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="开卡人" prop="issuerId">
      <el-select
        v-model="form.issuerId"
        filterable
        clearable
        placeholder="请输入开卡人"
        :remote-method="remoteMethodIssuer"
        remote
        @change="handleChangeIssuer"
      >
        <el-option
          v-for="item in issuerOptions"
          :key="item.userId"
          :value="item.userId"
          :label="`${item.nickName} (${item.deptName})`"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      :required="form.state === 0"
      label="使用人"
      prop="occupantUserId"
    >
      <el-select
        v-model="form.occupantUserId"
        filterable
        clearable
        placeholder="请输入使用人"
        :remote-method="remoteMethodOccupantUser"
        remote
        @change="handleChangeOccupantUser"
      >
        <el-option
          v-for="item in occupantUserOptions"
          :key="item.userId"
          :value="item.userId + ''"
          :label="`${item.nickName} (${item.deptName})`"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="开卡地" prop="addressArr">
      <AppAreaSelect
        ref="cascader"
        v-model="form.addressArr"
        :maxlevel="1"
        @change="handleChangeCity"
      />
    </el-form-item>
    <el-form-item label="使用人编号">
      <el-input v-model="form.occupantUserId" disabled />
    </el-form-item>
    <el-form-item label="使用部门" prop="occupantDeptName">
      <!-- <el-cascader
        v-model="form.occupantDeptIdList"
        :options="deptTreeArray"
        :props="{ checkStrictly: true }"
        clearable
        @change="changeCascader"
      /> -->
      <el-input v-model="form.occupantDeptName" disabled />
    </el-form-item>
    <el-form-item
      :required="form.state === 0"
      label="领用日期"
      prop="occupantDate"
    >
      <el-date-picker
        v-model="form.occupantDate"
        clearable
        :picker-options="occupantDateOptions"
        placeholder="请选择领用日期"
      />
    </el-form-item>
    <el-form-item label="原使用人" prop="originalOccupantUserId">
      <el-select
        v-model="form.originalOccupantUserId"
        filterable
        placeholder="请输入原使用人"
        clearable
        :remote-method="remoteMethodOriginalOccupantUser"
        remote
        @change="changeHandleOriginalOccupantUser"
      >
        <el-option
          v-for="item in originalOccupantUserOptions"
          :key="item.userId"
          :value="item.userId + ''"
          :label="item.nickName"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="使用状态" prop="state">
      <el-select
        v-model="form.state"
        placeholder="请选择使用状态"
        clearable
        @change="changeHandleState"
      >
        <el-option
          v-for="item in stateList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="form.remark"
        clearable
        type="textarea"
        :maxlength="100"
        :autosize="{ minRows: 2, maxRows: 5 }"
        placeholder="请输入备注"
      />
    </el-form-item>
    <div class="flex justify-end" style="width: 100%">
      <el-button size="small" :loading="loading" @click="handleClickCancel">
        取消
      </el-button>
      <el-button
        size="small"
        type="primary"
        :loading="loading"
        @click="handleClickSubmit"
      >
        确定
      </el-button>
    </div>
  </el-form>
</template>
<script>
import { communicationCompanyList, stateList } from '../../constants'
import { deptTree, userNoPage } from '@/api/addressBookApi'
import moment from 'moment'
import AppAreaSelect from '@/components/AppTemplate/AppAreaSelect/index'

export default {
  components: { AppAreaSelect },
  props: {
    editForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const validOccupantUserId = (rule, value, callback) => {
      if (this.form.state === 0) {
        if (!value) {
          callback(new Error('请输入使用人'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validOccupantDate = (rule, value, callback) => {
      if (this.form.state === 0) {
        if (!value) {
          callback(new Error('请选择领用日期'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      form: {
        embryoEndNumber: '', // 卡胚编码尾号
        communicationCompany: '', // 通信公司
        issuerName: '', // 开卡人
        issuerId: '', // 开卡人编号
        occupantDeptId: '', // 使用部门ID
        occupantDeptName: '', // 使用部门名称
        occupantDate: '', // 领用日期
        occupantUserId: '', // 使用人ID
        occupantUserName: '', // 使用人
        originalOccupantUserId: '', // 原使用人ID
        originalOccupantUserName: '', // 原使用人名称
        phoneNumber: '', // 手机号
        state: undefined, // 使用状态:0-使用中、1-未使用、2-闲置、3-已注销
        remark: '', // 备注
        provinceCode: '',
        cityCode: '',
        addressArr: []
      },
      rules: {
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        embryoEndNumber: [
          { required: true, message: '请输入卡胚编码尾号', trigger: 'blur' }
        ],
        communicationCompany: [
          { required: true, message: '请选择通信公司', trigger: 'change' }
        ],
        occupantDeptId: [
          { required: true, message: '请选择使用部门', trigger: 'change' }
        ],
        issuerId: [
          { required: true, message: '请输入开卡人', trigger: 'change' }
        ],
        occupantUserId: [{ validator: validOccupantUserId, trigger: 'change' }],
        occupantDate: [{ validator: validOccupantDate, trigger: 'change' }],
        state: [
          { required: true, message: '请选择使用状态', trigger: 'change' }
        ],
        addressArr: [
          { required: true, message: '请选择开卡地', trigger: 'change' }
        ]
      },
      occupantDeptIdList: [],
      communicationCompanyList,
      stateList,
      originalOccupantUserOptions: [],
      occupantUserOptions: [],
      issuerOptions: [],
      deptTreeArray: [],
      loading: false,
      occupantDateOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted() {
    this.loading = false
    this.getDeptTree()
    if (this.editForm.cardId !== null && this.editForm.cardId !== undefined) {
      // 编辑
      this.form = {
        ...this.editForm,
        occupantDate: this.editForm.occupantDate
          ? moment(this.editForm.occupantDate).format('YYYY-MM-DD')
          : undefined,
        addressArr: this.editForm.provinceName
          ? [this.editForm.provinceName, this.editForm.cityName]
          : []
      }
      this.setAllUserList()
    }
  },
  methods: {
    handleChangeCity(value) {
      if (value.length === 0) return
      const options = this.$refs.cascader?.$refs.cascader?.options
      const parent = options.find(option => option.value === value[0])
      const current = parent.children.find(option => option.value === value[1])
      this.form.cityCode = current.id
      this.form.provinceCode = parent.id
    },
    changeHandleState(val) {
      this.$nextTick(() => {
        this.$refs.form.validateField('occupantUserId')
        this.$refs.form.validateField('occupantDate')
      })
    },
    // 设置所有user option
    setAllUserList() {
      userNoPage().then(res => {
        if (res.code === 1) {
          this.originalOccupantUserOptions = res.data
        }
      })

      userNoPage().then(res => {
        if (res.code === 1) {
          this.issuerOptions = res.data
          this.occupantUserOptions = res.data
          if (this.editForm.occupantUserId) {
            this.handleChangeOccupantUser(this.editForm.occupantUserId)
          }
        }
      })
    },
    async remoteMethodIssuer(query) {
      const res = await userNoPage({ nickName: query })
      this.issuerOptions = res.data
    },
    async remoteMethodOccupantUser(query) {
      const res = await userNoPage({ nickName: query, status: 0 })
      this.occupantUserOptions = res.data
    },
    async remoteMethodOriginalOccupantUser(query) {
      const res = await userNoPage({ nickName: query })
      this.originalOccupantUserOptions = res.data
    },
    changeHandleOriginalOccupantUser(value) {
      const obj =
        this.originalOccupantUserOptions.find(item => item.userId === value) ||
        {}
      this.form.originalOccupantUserName = obj.nickName
    },
    async getDeptTree() {
      const res = await deptTree()
      const list = this.encapsulateData(res.data)
      this.deptTreeArray = list
    },
    handleChangeOccupantUser(val) {
      const obj =
        this.occupantUserOptions.find(item => item.userId === val) || {}
      this.form.occupantDeptId = obj.deptId
      this.form.occupantDeptName = obj.deptName
      this.form.occupantUserName = obj.nickName
    },
    handleChangeIssuer(val) {
      this.issuerOptions.forEach(item => {
        if (val === item.userId) {
          this.form.issuerName = item.nickName
        }
      })
    },
    changeCascader(val) {
      this.form.occupantDeptId =
        this.form.occupantDeptIdList[this.form.occupantDeptIdList.length - 1]
      // this.form.occupantDeptName=
    },
    encapsulateData(array) {
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        // array[i].disabled = true
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
      return array
    },
    handleClickCancel() {
      this.$emit('cancel')
    },
    handleClickSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const form = Object.assign({}, this.form)
          form.occupantDate = form.occupantDate
            ? moment(form.occupantDate).format('YYYY-MM-DD')
            : undefined
          const addressArr = form.addressArr
          if (addressArr.length) {
            form.provinceName = addressArr[0]
            form.cityName = addressArr[1]
          }
          delete form.addressArr
          this.loading = true
          this.$emit('submit', {
            form,
            success: () => {
              this.loading = false
            }
          })
        }
      })
    },
    // 只输入数字
    delNumber(e, key) {
      this.form[key] = e.replace(/[^0-9]/g, '')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-select,
::v-deep .el-date-editor,
::v-deep .el-input,
::v-deep .el-textarea {
  width: 240px !important;
}
</style>
