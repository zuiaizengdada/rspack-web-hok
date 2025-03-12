<template>
  <el-drawer
    :wrapper-closable="false"
    :title="label"
    :visible.sync="visible"
    direction="rtl"
    size="30%"
    @close="handleCloseClick"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <!-- 模板名称 -->
      <el-form-item label="模板名称" prop="templateTitle">
        <el-input
          v-model="form.templateTitle"
          maxlength="20"
          show-word-limit
          placeholder="请输入模板名称"
        />
      </el-form-item>

      <!-- 模板分类 -->
      <el-form-item label="模板分类" prop="templateClassifyId">
        <el-select
          v-model="form.templateClassifyId"
          placeholder="请选择模板分类"
          style="width: 100%"
        >
          <el-option
            v-for="item in templateCategoryList"
            :key="item.id"
            :label="item.classifyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <!-- 提示词内容 -->
      <el-form-item label="提示词内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          placeholder="请输入提示词内容"
          maxlength="2000"
          show-word-limit
          rows="28"
          resize="none"
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
  updateTemplateList,
  addTemplateList,
  queryTemplateListById,
  queryTemplateCategoryList
} from '@/api/aigc/callWord'
import { templateRules } from '../config'

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
        isSystem: true,
        userId: JSON.parse(localStorage.getItem('UserInfo')).userId,
        templateTitle: '',
        templateClassifyId: '',
        content: ''
      },
      // 提示语模板分类
      templateCategoryList: [],
      // 表单验证规则
      rules: {}
    }
  },
  computed: {
    label() {
      return this.form.id ? '修改提示词模板' : '新增提示词模板'
    }
  },
  mounted() {
    this.initConfig()
    this.setTemplateCategoryList()
  },
  methods: {
    // 初始化配置
    initConfig() {
      // 验证规则
      this.rules = templateRules
    },
    // 设置提示语模板分类下拉框
    async setTemplateCategoryList() {
      const params = {
        pageNum: 1,
        pageSize: 9999
      }

      const {
        code,
        data: { items }
      } = await queryTemplateCategoryList(params)

      if (code === 1) {
        this.templateCategoryList = items
      }
    },
    // 关闭弹窗
    handleCloseClick() {
      this.form = {
        isSystem: true,
        tenantId: JSON.parse(localStorage.getItem('orgInfo')).organizationId,
        userId: JSON.parse(localStorage.getItem('UserInfo')).userId,
        templateTitle: '',
        content: ''
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

      const { code, data } = await queryTemplateListById(params, type)

      if (code === 1) {
        this.form = { ...data, isSystem: type === 'system' }
      }
    },
    // 提交表单
    async handleSumbitClick() {
      await this.$refs.form.validate()

      let msg = '创建'
      if (this.form.id) {
        msg = '编辑'
        // 编辑
        await updateTemplateList(this.form)
      } else {
        // 添加
        await addTemplateList(this.form)
      }
      // 通知父组件更新页面
      this.$emit('update')
      // 添加成功提示信息
      this.$message.success(`${msg}提示词模板成功`)
      // 关闭对话框
      this.handleCloseClick()
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
