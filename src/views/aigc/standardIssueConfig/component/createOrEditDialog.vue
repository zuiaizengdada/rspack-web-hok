<!-- 新增问题配置弹窗 -->
<template>
  <div>
    <el-dialog
      :title="row.id ? '编辑问题' : '新增问题'"
      :visible.sync="visible"
      width="800px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="问题标题：" prop="title">
          <span v-if="row.id && row.questionType === 0">{{ form.title }}</span>
          <el-input
            v-else
            v-model="form.title"
            type="text"
            placeholder="请输入问题标题"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <!-- 自定义问题显示 -->
        <el-form-item
          v-if="(row.id && row.questionType === 1) || !row.id"
          label="组装名称："
          prop="assembleName"
        >
          <div class="flex">
            <el-input
              v-model="form.assembleName"
              type="text"
              placeholder="请输入组装名称"
              maxlength="20"
              show-word-limit
            />
          </div>
        </el-form-item>
        <template v-if="row.id && row.questionType === 0">
          <el-form-item
            v-for="(domain, index) in form.placeholders"
            :key="index + 'placeholders'"
            :label="index === 0 ? '组装名称：' : ' '"
            :prop="'placeholders.' + index + '.id'"
            :required="false"
          >
            <div class="flex">
              <span
                style="white-space: nowrap; margin-right: 12px; min-width: 70px"
              >{{ domain.placeholderName }}</span>
              <el-input
                v-model="domain.anotherName"
                style="flex: 1"
                maxlength="20"
                show-word-limit
              />
            </div>
          </el-form-item>
        </template>

        <el-form-item label="问题描述：" prop="describe">
          <!-- 文本域 -->
          <el-input
            ref="textarea"
            v-model="form.describe"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8 }"
            resize="none"
            maxlength="200"
            show-word-limit
            placeholder="请输入问题描述描述"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  aiProblemConfigAdd,
  aiProblemConfigEdit
} from '@/api/aigc/standardIssueConfig'
export default {
  model: {
    prop: 'visible',
    event: 'getVisible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return {
          title: undefined,
          describe: undefined,
          type: undefined,
          postId: undefined
        }
      }
    }
  },
  data() {
    return {
      form: {
        title: undefined,
        assembleName: undefined,
        describe: undefined,
        type: undefined
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入问题标题',
            trigger: 'change'
          }
        ],
        assembleName: [
          {
            required: true,
            message: '请输入组装名称',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  created() {
    if (this.row.id) {
      this.form.title = this.row.title
      if (this.row.questionType === 1) {
        this.form.assembleName = this.row.placeholders[0].placeholderName
        this.form.placeholderId = this.row.placeholders[0].placeholderId
      } else {
        this.form.placeholders = this.row.placeholders
      }
      this.form.describe = this.row.description
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$emit('submit', this.form)
          const data = {
            description: this.form.describe,
            placeholder: undefined,
            placeholders: undefined,
            title: this.form.title,
            id: this.row.id || undefined
          }
          if (this.row.id) {
            // 自定义问题编辑
            if (this.row.questionType === 1) {
              data.placeholders = [
                {
                  placeholderName: this.form.assembleName,
                  placeholderId: this.form.placeholderId
                }
              ]
            } else {
              data.placeholders = this.form.placeholders
            }
            await aiProblemConfigEdit(data)
          } else {
            // 自定义问题新增 只有自定义问题才能新增
            data.placeholder = {
              placeholderName: this.form.assembleName
            }
            await aiProblemConfigAdd(data)
          }
          this.$message.success('编辑成功')
          this.$emit('close')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
