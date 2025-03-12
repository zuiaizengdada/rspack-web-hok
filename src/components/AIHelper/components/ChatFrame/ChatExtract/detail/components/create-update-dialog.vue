<template>
  <el-dialog
    :title="showTitle"
    width="40%"
    :visible="dialogShow"
    @close="handleClose"
  >
    <el-form ref="form" label-width="100px" :model="form" :rules="rules">
      <el-form-item class="templateTitle" label="模板标题" prop="templateTitle">
        <el-input
          v-model="form.templateTitle"
          show-word-limit
          placeholder="请输入模板标题"
        />
      </el-form-item>
      <el-form-item label="提示词内容" prop="content">
        <el-input
          id="textarea_id"
          v-model="form.content"
          rows="15"
          maxlength="2000"
          show-word-limit
          type="textarea"
          resize="none"
          placeholder="请输入提示词内容"
          @input="handleInput"
        />
      </el-form-item>
      <el-row type="flex" justify="end">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { rules } from '../config'
import {
  addTemplateList,
  updateTemplateList,
  queryTemplateListById
} from '@/api/aigc/callWord'
export default {
  props: {
    dialogShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // form表单
      form: {
        isSystem: false,
        tenantId: JSON.parse(localStorage.getItem('orgInfo')).organizationId,
        userId: JSON.parse(localStorage.getItem('UserInfo')).userId,
        templateTitle: '',
        content: ''
      },
      // 验证规则
      rules: {}
    }
  },
  computed: {
    showTitle() {
      return this.form.id ? '编辑我的模板' : '新增我的模板'
    }
  },
  mounted() {
    this.initConfig()
  },
  methods: {
    // 初始化配置
    initConfig() {
      // 验证规则
      this.rules = rules
    },
    handleInput(event) {
      this.$nextTick(() => {
        const textarea = document.getElementById('textarea_id')
        textarea.scrollTop = textarea.scrollHeight
      })
    },
    // 点击关闭需要做的事情1.表单清空；2.移出校验结果；3.通知父组件关闭对话框。
    handleClose() {
      this.form = {
        isSystem: false,
        tenantId: JSON.parse(localStorage.getItem('orgInfo')).organizationId,
        userId: JSON.parse(localStorage.getItem('UserInfo')).userId,
        templateTitle: '',
        content: ''
      }
      this.$refs.form.resetFields()
      // 给父元素传值，关闭对话框
      this.$emit('updata:dialogShow', false)
    },
    // 对话框确定
    async handleConfirm() {
      // 表单校验通过再执行之后的
      await this.$refs.form.validate()

      let msg = '创建'
      if (this.form.id) {
        msg = '编辑'
        console.log(this.form)
        // 编辑
        await updateTemplateList(this.form)
      } else {
        // 添加
        await addTemplateList(this.form)
      }
      // 通知父组件更新页面
      this.$emit('update', this.form)
      // 添加成功提示信息
      this.$message({
        message: `${msg}我的模板成功`,
        type: 'success',
        customClass: 'amap-sug-result'
      })
      // 关闭对话框
      this.handleClose()
    },
    // 编辑功能，数据回显
    async getCustomTemplateDetail(id, type) {
      const params = {
        id
      }
      const { code, data } = await queryTemplateListById(params, type)
      if (code === 1) {
        this.form = { ...data, isSystem: type === 'system' }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.templateTitle {
  position: relative;
  .limit-word {
    position: absolute;
    right: 10px;
    color: #909399;
    font-size: 12px;
  }
}

::v-deep {
  .el-dialog__header {
    border-bottom: 1px solid #d8dce6 !important;

    .el-dialog__title {
      font-size: 16px !important;
      font-weight: 600;
    }
  }

  .el-dialog__body {
    padding: 20px !important;
  }
}
</style>
