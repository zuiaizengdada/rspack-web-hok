<template>
  <el-dialog
    width="550px"
    title="批量调整岗位"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <div class="tips-block">
      <i class="el-icon-warning" />
      <span>
        <p class="title">注意</p>
        <p>
          批量设置员工岗位，会同时给所有选中员工赋予新选择的岗位，一旦操作，不可撤销，请谨慎操作。
        </p>
      </span>
    </div>
    <el-form ref="formModal" :model="form" :rules="rules">
      <el-form-item label="请选择岗位" label-width="100px" prop="postId">
        <el-select v-model="form.postId" clearable filterable style="width: 100%;">
          <el-option
            v-for="item in postList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </el-dialog>
</template>
<script>
export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: { visible: { type: Boolean, default: false } },
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
      postList: []
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
      this.$refs.formModal.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form)
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
