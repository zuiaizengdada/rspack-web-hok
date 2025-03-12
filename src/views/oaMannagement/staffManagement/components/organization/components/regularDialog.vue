<template>
  <el-dialog
    width="576px"
    title="转正"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="转正人员" label-width="100px" required>
        {{ row.name }}
      </el-form-item>
      <el-form-item
        label="转正时间"
        label-width="100px"
        prop="regularTime"
        required
      >
        <el-date-picker
          v-model="form.regularTime"
          clearable
          style="width: 100%"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item
        label="转正薪资"
        label-width="100px"
        prop="regularSalary"
        required
      >
        <el-input-number
          v-model="form.regularSalary"
          :min="0"
          :controls="false"
          :precision="2"
          style="width: 100%"
          placeholder="请输入"
        >
        </el-input-number>
        <span class="item-append">元</span>
        <!-- <el-input v-model="form.regularSalary" clearable placeholder="请输入">
          <template slot="append">元</template>
        </el-input> -->
      </el-form-item>

      <el-form-item label="备注" label-width="100px" prop="remark">
        <el-input
          v-model="form.remark"
          clearable
          type="textarea"
          :maxlength="100"
          show-word-limit
          :autosize="{ minRows: 6, maxRows: 6 }"
          placeholder="请输入备注"
        />
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
import { employeeRegularAjax } from '../../../../api/staff.js'
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
        regularTime: [
          { required: true, message: '请选择转正时间', trigger: 'change' }
        ],
        regularSalary: [
          { required: true, message: '请输入转正薪资', trigger: 'blur' }
        ]
      },
      postList: [],
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
            regularTime: moment(this.form.regularTime).valueOf(),
            employeeId: this.row.employeeId
          }
          this.loading = true
          employeeRegularAjax(params)
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
    init() {
      this.form = {
        regularTime: '',
        regularSalary: this.row.agreedRegularSalary,
        remark: ''
      }
    }
  },
  created() {
    this.init()
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
::v-deep .el-input-number .el-input__inner {
  text-align: left;
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
.item-append {
  position: absolute;
  top: 0;
  right: 10px;
}
</style>
