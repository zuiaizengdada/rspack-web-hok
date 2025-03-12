<template>
  <el-drawer
    :wrapper-closable="false"
    :title="label"
    :visible.sync="visible"
    direction="rtl"
    @close="handleCloseClick"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <!-- 分类名称 -->
      <el-form-item label="分类名称" prop="classifyName">
        <el-input v-model="form.classifyName" placeholder="请输入分类名称" />
      </el-form-item>

      <!-- 分类权重 -->
      <el-form-item label="分类权重" prop="weight">
        <el-input
          v-model="form.weight"
          placeholder="请输入分类权重"
          type="number"
          :min="1"
        />
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button type="primary" @click="handleSumbitClick">确 定</el-button>
      <el-button @click="handleCloseClick">取 消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import {
  addTemplateCategoryList,
  updateTemplateCategoryList,
  queryTemplateCategoryListById
} from '@/api/aigc/callWord'
import { categoryRules } from '../config'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // form表单
      form: {
        classifyName: '',
        weight: ''
      },
      // 表单验证规则
      rules: {}
    }
  },
  computed: {
    label() {
      return this.form.templateId ? '修改提示词模板' : '新增提示词模板'
    }
  },
  mounted() {
    this.initConfig()
  },
  methods: {
    // 初始化配置
    initConfig() {
      // 验证规则
      this.rules = categoryRules
    },
    // 关闭弹窗
    handleCloseClick() {
      this.form = {
        classifyName: ''
      }
      this.$refs.form.resetFields()
      // 给父元素传值，关闭对话框
      this.$emit('updata:visible', false)
    },
    // 编辑功能，数据回显
    async getCustomTemplateDetail(id, type) {
      const params = {
        id
      }

      const { code, data } = await queryTemplateCategoryListById(params, type)

      if (code === 1) {
        this.form = data
      }
    },
    // 提交表单
    async handleSumbitClick() {
      await this.$refs.form.validate()
      let msg = '创建'
      if (this.form.id) {
        msg = '编辑'
        const params = {
          classifyName: this.form.classifyName,
          weight: this.form.weight,
          id: this.form.id
        }
        // 编辑
        await updateTemplateCategoryList(params)
      } else {
        const params = {
          ...this.form,
          weight: +this.form.weight
        }
        // 添加
        await addTemplateCategoryList(params)
      }
      // 通知父组件更新页面
      this.$emit('update')
      // 添加成功提示信息
      this.$message.success(`${msg}提示词分类成功`)
      // 关闭对话框
      this.handleCloseClick()
    },
    handleInput(value) {
      // 如果输入的值不在0到99之间，将其调整为有效范围
      if (value < 0) {
        this.form.weight = 0
      } else if (value > 99) {
        this.form.weight = 99
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-drawer__header {
    border-bottom: 1px solid #d8dce6 !important;

    padding-bottom: 20px;

    .el-dialog__close {
      font-weight: 500;
    }

    span {
      font-size: 16px !important;
      font-weight: 600;
    }
  }

  .el-drawer__body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 20px;
    padding-bottom: 20px;
  }
}

.dialog-footer {
  text-align: right;
}
</style>
