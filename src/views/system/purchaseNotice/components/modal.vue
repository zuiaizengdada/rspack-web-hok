<template>
  <el-drawer
    :title="title"
    size="728px"
    :wrapper-closable="false"
    :visible.sync="visible"
    v-loading="loading"
  >
    <div class="flex flex-column" style="height: 100%">
      <div class="dialog-container">
        <el-form
          ref="form"
          :model="form"
          size="small"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="终端" prop="terminal">
            <el-select v-model="form.terminal" placeholder="请选择终端">
              <el-option
                v-for="item in terminalList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="课程类型" prop="goodsType">
            <el-select v-model="form.goodsType" placeholder="请选择课程类型">
              <el-option
                v-for="item in goodsTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <div
            v-for="(item, index) in form.purchaseNoticeList"
            :key="index"
            class="dialog-content"
          >
            <div class="dialog-box">
              <el-form-item
                label="图标"
                label-width="60px"
                :prop="'purchaseNoticeList.' + index + '.icon'"
                :rules="{
                  validator: (rule, value, callback) =>
                    validateIcon(item, value, callback),
                  trigger: 'change',
                  type: 'array'
                }"
              >
                <ImageUpload
                  v-model="form.purchaseNoticeList[index].icon"
                  :limit="1"
                  :is-lt="0.05"
                />
              </el-form-item>
              <el-form-item
                label="标题"
                label-width="60px"
                :prop="'purchaseNoticeList.' + index + '.title'"
                :rules="{
                  validator: (rule, value, callback) =>
                    validateTitle(item, value, callback),
                  message: '标题不能为空',
                  trigger: 'blur'
                }"
              >
                <el-input
                  v-model="form.purchaseNoticeList[index].title"
                  placeholder="请输入标题"
                  maxlength="30"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item
                label="内容"
                label-width="60px"
                :prop="'purchaseNoticeList.' + index + '.content'"
                :rules="{
                  validator: (rule, value, callback) =>
                    validateContent(item, value, callback),
                  trigger: 'change'
                }"
              >
                <uEditor
                  ref="AppUEditor"
                  v-if="visible"
                  :value.sync="form.purchaseNoticeList[index].content"
                />
              </el-form-item>
            </div>
            <div class="flex">
              <div class="icon-add icon" @click="handleAdd">
                <i class="el-icon-plus" />
              </div>
              <div
                v-if="form.purchaseNoticeList.length > 1"
                class="icon-reduce icon"
                @click="handleRemove(index)"
              >
                <i class="el-icon-minus" />
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" size="small" @click="submit">确 定</el-button>
        <el-button size="small" @click="visible = false">取 消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { purchaseAdd, purchaseEdit, purchaseDetail } from '@/api/system/index'
import ImageUpload from './ImageUpload'
import uEditor from './uEditor'
export default {
  components: {
    ImageUpload,
    uEditor
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        terminal: '',
        goodsType: '',
        purchaseNoticeList: [
          {
            content: '',
            title: '',
            icon: []
          }
        ]
      },
      terminalList: [
        {
          value: 1,
          label: '抖音小程序安卓'
        },
        {
          value: 2,
          label: '抖音小程序苹果'
        },
        {
          value: 3,
          label: '微信小程序安卓'
        },
        {
          value: 4,
          label: '安卓APP'
        },
        {
          value: 5,
          label: '苹果APP'
        },
        {
          value: 6,
          label: 'H5'
        }
      ],
      goodsTypes: [
        {
          value: 0,
          label: '图文'
        },
        {
          value: 1,
          label: '音频'
        },
        {
          value: 2,
          label: '视频'
        },
        {
          value: 3,
          label: '专栏'
        },
        {
          value: 4,
          label: '大专栏'
        },
        {
          value: 5,
          label: '线下课程'
        },
        {
          value: 7,
          label: '套餐课'
        },
        {
          value: 8,
          label: '直播课'
        }
      ],
      type: 'add',
      title: '新增',
      rules: {
        terminal: [
          { required: true, message: '请选择终端', trigger: 'change' }
        ],
        goodsType: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    open(row = {}, type = 'add') {
      this.reset()
      this.loading = true
      this.visible = true
      if (type === 'edit') {
        this.$nextTick(() => {
          this.getDetails(row.id)
        })
      }
      this.loading = false
      this.type = type
      this.title = type === 'add' ? '新增' : '编辑'
    },
    async getDetails(id) {
      const { data } = await purchaseDetail({ id })
      this.loading = false
      this.$nextTick(() => {
        this.form = {
          goodsType: data.goodsType,
          id: data.id,
          terminal: data.terminal,
          purchaseNoticeList: data.purchaseNoticeList.map(i => {
            console.log(i.content,'i.content');
            return {
              ...i,
              content: i.content,
              id: undefined,
              icon: [{ coverUrl: i.icon }]
            }
          })
        }
      })
    },
    validateTitle(item, value, callback) {
      if (
        (item.icon.length || item.content.replace(/<\/?.+?\/?>/g, '')) &&
        !value
      ) {
        callback(new Error('请输入标题'))
      } else {
        callback()
      }
    },
    validateContent(item, value, callback) {
      if (
        (item.icon.length || item.title) &&
        !value.replace(/<\/?.+?\/?>/g, '')
      ) {
        callback(new Error('请输入内容'))
      } else {
        callback()
      }
    },
    validateIcon(item, value, callback) {
      if (
        (item.content.replace(/<\/?.+?\/?>/g, '') || item.title) &&
        !item.icon.length
      ) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    },
    handleAdd() {
      this.form.purchaseNoticeList.push({
        content: '',
        title: '',
        icon: []
      })
    },
    handleRemove(index) {
      this.form.purchaseNoticeList.splice(index, 1)
    },
    reset() {
      this.form = {
        terminal: '',
        goodsType: '',
        purchaseNoticeList: [
          {
            content: '',
            title: '',
            icon: []
          }
        ]
      }
    },
    async add() {
      const purchaseNoticeList = this.form.purchaseNoticeList
        .filter(i => i.icon.length)
        .map(i => {
          return {
            ...i,
            icon: i.icon?.length ? i.icon[0].coverUrl : ''
          }
        })
      const { code } = await purchaseAdd({
        ...this.form,
        purchaseNoticeList
      })
      if (code === 1) {
        this.$message.success('新增成功')
        this.visible = false
        this.$emit('success')
      }
    },
    async edit() {
      const purchaseNoticeList = this.form.purchaseNoticeList
        .filter(i => i.icon.length)
        .map(i => {
          return {
            ...i,
            icon: i.icon?.length ? i.icon[0].coverUrl : ''
          }
        })
      const { code } = await purchaseEdit({
        ...this.form,
        purchaseNoticeList
      })
      if (code === 1) {
        this.$message.success('编辑成功')
        this.visible = false
        this.$emit('success')
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.type === 'add') {
            this.add()
          } else {
            this.edit()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  padding: 0 20px;
  flex: 1;
  overflow: auto;
  .dialog-box {
    width: 528px;
    border-radius: 4px;
    background: #fafafa;
    padding: 20px;
    margin-bottom: 10px;
  }
  .dialog-content {
    display: flex;
  }
  .icon {
    width: 32px;
    height: 32px;
    border: 1px dashed #66666685;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 16px;
    color: #666;
    border-radius: 4px;
    cursor: pointer;
  }
}

.dialog-footer {
  height: 60px;
  border-top: 1px solid #e7e7e7;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
</style>
