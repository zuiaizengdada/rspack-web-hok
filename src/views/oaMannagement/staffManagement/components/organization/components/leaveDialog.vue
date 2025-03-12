<template>
  <el-dialog
    width="576px"
    title="离职"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="134px">
      <el-form-item label="离职人员" required> {{ row.name }} </el-form-item>
      <el-form-item label="离职类型" prop="departureType" required>
        <el-select
          v-model="form.departureType"
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in departureTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="离职时间" prop="departureDate" required>
        <el-date-picker
          style="width: 100%"
          v-model="form.departureDate"
          clearable
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="离职原因" prop="departureReason" required>
        <el-input
          v-model="form.departureReason"
          clearable
          type="textarea"
          :maxlength="100"
          show-word-limit
          :autosize="{ minRows: 6, maxRows: 6 }"
          placeholder="请输入原因"
        />
      </el-form-item>
      <el-form-item
        label="是否发放离职证明"
        prop="grantDepartureProof"
        required
      >
        <el-radio-group v-model="form.grantDepartureProof">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
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
import { employeeLeaveAjax } from '../../../../api/staff.js'
import { departureTypeOption } from '../../../options'
import moment from 'moment'

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
      form: {},
      rules: {
        departureType: [
          {
            required: true,
            message: '请选择离职类型',
            trigger: 'change'
          }
        ],
        departureDate: [
          {
            required: true,
            message: '请选择离职时间',
            trigger: 'change'
          }
        ],
        departureReason: [
          {
            required: true,
            message: '请输入离职原因',
            trigger: 'blur'
          }
        ],
        grantDepartureProof: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ]
      },
      postList: [],
      departureTypeOption,
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
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.form,
            departureDate: moment(this.form.departureDate).valueOf(),
            employeeId: this.row.employeeId
          }
          this.loading = true
          employeeLeaveAjax(params)
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
