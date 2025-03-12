<!-- 新增提示词弹窗 -->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="750px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="提示词的名称"
            show-word-limit
            :maxlength="20"
          />
        </el-form-item>
        <el-form-item label="功能描述" prop="name">
          <el-input
            v-model="form.name"
            placeholder="功能描述"
            show-word-limit
            :maxlength="20"
          />
        </el-form-item>
        <el-form-item label="提示词" prop="describe" class="textarea-s">
          <!-- 文本域 -->
          <el-input
            ref="textarea"
            v-model="form.describe"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 8 }"
            resize="none"
            maxlength="200"
            show-word-limit
            placeholder="请输入Prompt,使用中括号【】代表用户输入内容。eg:作为一名文案优化师,请对文章【文章内容】进行润色,要求:【文案润色要求】"
          />
          <!-- <div class="btn-s">
            <el-button size="mini" plain @click="addDescribe">
              插入编辑内容
            </el-button>
          </div> -->
        </el-form-item>
        <el-form-item label="提示词分类" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择"
            style="width: 100%"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="关联助手" prop="sessionTemplateIds">
          <el-select
            v-model="form.sessionTemplateIds"
            multiple
            remote
            filterable
            placeholder="选择关联助手"
            style="width: 100%"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in aiList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          v-loading="loading"
          type="primary"
          @click="submit"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { aiPromptWordAdd, aiPromptWordUpdate } from '@/api/aigc/cueWord'
import { aiPromptWordTypePage } from '@/api/aigc/cueWordType'
import { getAISessionList } from '@/api/aigc'
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
          id: undefined,
          name: undefined,
          describe: undefined,
          type: undefined,
          sessionTemplateIds: undefined
        }
      }
    }
  },
  data() {
    return {
      title: '新增提示词',
      loading: false,
      form: {
        name: undefined,
        describe: '',
        type: undefined,
        typeId: '',
        sessionTemplateIds: undefined
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入提示词名称',
            trigger: 'change'
          }
        ],
        describe: [
          {
            required: true,
            message: '请输入提示词',
            trigger: 'change'
          }
        ]
        // type: [
        //   {
        //     required: true,
        //     message: '请选择提示词分类',
        //     trigger: 'blur'
        //   }
        // ],
      },
      typeList: [],
      aiList: []
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
    this.getAISessionList()
    this.getWordTypeList()
    if (this.row.id) {
      this.form.name = this.row.title
      this.form.describe = this.row.content
      this.form.type = this.row.typeId
      this.form.typeId = this.row.typeId
      this.form.sessionTemplateIds = this.row.sessionTemplates.map(
        m => m.sessionTemplateId
      )
      this.title = '编辑提示词'
    } else {
      this.form.name = undefined
      this.form.describe = ''
      this.form.type = undefined
      this.form.typeId = ''
      this.form.sessionTemplateIds = undefined
      this.title = '新增提示词'
    }
  },
  methods: {
    getAISessionList() {
      getAISessionList().then(res => {
        this.aiList = res.data.map(m => ({
          label: m.title,
          value: m.sessionTemplateId
        }))
      })
    },
    addDescribe() {
      const oldIndex = this.$refs.textarea.$refs.textarea.selectionStart
      this.form.describe =
        this.form.describe.substring(0, oldIndex) +
        '[]' +
        this.form.describe.substring(oldIndex)
      this.$nextTick(() => {
        // 设置光标位置
        this.$refs.textarea.$refs.textarea.selectionStart = oldIndex + 1
        this.$refs.textarea.$refs.textarea.selectionEnd = oldIndex + 1
        this.$refs.textarea.$refs.textarea.focus()
      })
    },
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form)
          if (this.row.id) {
            this.submitEdit()
          } else {
            this.submitAdd()
          }
        }
      })
    },
    submitAdd() {
      this.loading = true
      aiPromptWordAdd({
        content: this.form.describe,
        title: this.form.name,
        type: this.form.type,
        sessionTemplateIds: this.form.sessionTemplateIds
      })
        .then(() => {
          this.$message.success('编辑成功')
          this.loading = false
          setTimeout(() => {
            this.$emit('close')
          }, 1000)
        })
        .catch(() => {
          this.loading = false
        })
    },
    submitEdit() {
      this.loading = true
      console.log(this.form, 1111)
      aiPromptWordUpdate({
        content: this.form.describe,
        title: this.form.name,
        typeId: this.form.type,
        id: this.row.id,
        sessionTemplateIds: this.form.sessionTemplateIds
      })
        .then(() => {
          this.$message.success('编辑成功')
          this.loading = false
          setTimeout(() => {
            this.$emit('close')
          }, 1000)
        })
        .catch(() => {
          this.loading = false
        })
    },
    async getWordTypeList() {
      // 获取提示词分类列表
      const data = await aiPromptWordTypePage({ pageIndex: 1, pageSize: 100 })
      this.typeList = data.data.items
    }
  }
}
</script>
<style lang="scss" scoped>
.textarea-s {
  position: relative;
  .btn-s {
    position: absolute;
    bottom: -2px;
    left: 16px;
    &:hover {
      cursor: pointer;
    }
  }
}
::v-deep .el-button--mini {
  padding: 4px 6px;
}
::v-deep .textarea-s {
  .el-form-item__content {
    position: relative;
    .el-textarea {
      .el-textarea__inner {
        padding-bottom: 30px;
      }
    }
  }
}
</style>
