<template>
  <el-dialog title="跟进" :visible.sync="config.visible" width="500px" :destroy-on-close="true">
    <el-form ref="form" :model="form">
      <el-form-item
        label="跟进状态"
        :label-width="formLabelWidth"
        prop="status"
        :rules="{
          required: true, message: '请选择跟进状态'
        }"
      >
        <el-select v-model="form.status" style="width: 100%" clearable>
          <el-option v-for="item in statusList" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="跟进内容"
        :label-width="formLabelWidth"
        prop="content"
        :rules="{
          required: true, message: '跟进内容不能为空'
        }"
      >
        <el-input
          v-model="form.content"
          type="textarea"
          maxlength="300"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleOk">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getFollowCreate } from '@/api/deliver/studentManagement'
export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          row: ''
        }
      }
    }
  },
  data() {
    return {
      btnLoading: false,
      statusList: [
        { id: 1, name: '待定 ' },
        { id: 2, name: '确定不来' },
        { id: 3, name: '确定来' },
        { id: 4, name: '未接电话' }
      ],
      formLabelWidth: '80px',
      form: {
        content: '',
        status: ''
      }
    }
  },
  watch: {
    'config.row': {
      handler() {
        this.form = {
          content: '',
          status: this.config.row.status
        }
      },
      immediate: true
    }
  },
  methods: {
    // 提交数据
    async handleOk() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.btnLoading = true
          const res = await getFollowCreate({
            ...this.form,
            deliveryInfoId: this.config.row.deliveryInfoId,
            goodsId: this.config.row.goodsId,
            orderNo: this.config.row.orderNo
          })
          if (res?.code === 1) {
            this.$message.success('保存成功')
            this.handleClose()
            this.$emit('handleOk')
          }
          this.btnLoading = false
        }
      })
    },
    // 初始化数据
    init() {
      this.form = {
        content: '',
        status: ''
      }
    },
    // 关闭弹框
    handleClose() {
      this.$emit('update:config', { row: { ...this.config.row, ...this.form }, visible: false })
      this.init()
    }
  }
}
</script>
