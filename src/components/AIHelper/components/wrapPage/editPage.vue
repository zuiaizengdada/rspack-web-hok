<template>
  <div class="addPage">
    <div class="addPage_header">
      <div class="goBackBtn">
        <i
          class="el-icon-arrow-left"
          style="margin-right: 17px; line-height: 17px; font-size: 17px"
          @click="$emit('closePage')"
        />
        <span @click="$emit('closePage')">编辑私有助手</span>
        <div v-if="form.isPrivate" class="isPrivateBtn">
          <img
            class="rightsItemIcon"
            src="@/assets/image/aigc/lock_c.png"
          />私密
        </div>
        <div v-else class="isPrivateBtn">
          <img
            class="rightsItemIcon"
            src="@/assets/image/aigc/global_c.png"
          />公开
        </div>
      </div>
      <div class="publicbtn" :loading="loading" @click="onhandlePublic">
        发布
      </div>
    </div>
    <div v-loading="pageLoading" class="addPage_content">
      <div class="addPage_content_form">
        <!-- 头像区域 -->
        <div class="addPage_avatar">
          <avatarCropper v-model="form.icon" />
        </div>
        <el-form
          ref="ruleForm"
          :model="form"
          :rules="rules"
          label-position="top"
          label-width="auto"
          class="demo-ruleForm"
        >
          <el-form-item label="助手名称" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入内容"
              maxlength="20"
              show-word-limit
              style="width: 747px"
            />
          </el-form-item>
          <el-form-item label="功能描述" prop="description">
            <el-input
              v-model="form.description"
              placeholder="请输入功能描述，简要介绍助手功能"
              maxlength="50"
              show-word-limit
              style="width: 747px"
            />
          </el-form-item>
          <el-form-item label="助手分类" prop="categoryId">
            <el-select
              v-model="form.categoryId"
              :placeholder="`${form.categoryId}请选择助手分类`"
              style="width: 747px"
            >
              <template v-for="item in categoryList">
                <el-option
                  :key="item.categoryId"
                  :label="item.name"
                  :value="item.categoryId"
                  style="width: 747px"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="提示词" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              resize="none"
              maxlength="10000"
              show-word-limit
              style="width: 747px"
              placeholder="请输入Prompt，使用中括号【】 代表用户输入内容。eg：作为一名文案优化师，请对文章【文章内容】进行润色，要求：【文案润色要求】"
            />
            <div class="formTips">
              注意：使用中括号【】代表用户输入内容，最多支持10个
            </div>
          </el-form-item>
          <el-form-item label="知识库">
            <template slot="label">
              <span>知识库</span>
              <span class="form_label_tips">
                上传资料文档，可基于文档内容和AI助手进行聊天互动。
              </span>
            </template>
            <fileUpload
              ref="fileUpload"
              :limit="10 - form.fileList.length"
              accept="*"
              :before-video-upload="beforeVideoUpload"
              @change="fileChange"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <publicDialog
      :config="publicConfig"
      :loading="loading"
      @close="closeFn()"
    />
  </div>
</template>

<script>
import avatarCropper from './avatarCropper.vue'
import fileUpload from '../uploadFile/index'
import publicDialog from './publicDialog.vue'
import {
  updateAssistant,
  getAssistantDetails,
  assistantcategoryListApi
} from '@/api/aigc/index.js'
export default {
  components: {
    avatarCropper,
    fileUpload,
    publicDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visbile: false,
          type: 'editPage',
          row: {}
        }
      }
    }
  },
  data() {
    var checkContent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入提示词'))
      } else {
        callback()
      }
    }
    return {
      pageLoading: false,
      categoryList: [],
      loading: false,
      form: {
        templateId: '',
        categoryId: '',
        content: '',
        description: '',
        icon: '',
        isPrivate: true,
        fileList: [],
        title: ''
      },
      rules: {
        title: [{ required: true, message: '请输入助手名称', trigger: 'blur' }],
        content: [{ validator: checkContent, required: true, trigger: 'blur' }],
        categoryId: [
          { required: true, message: '请选择助手分类', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入功能描述', trigger: 'blur' }
        ]
      },
      publicConfig: {
        visible: false,
        row: {}
      }
    }
  },
  watch: {
    'config.visbile': {
      handler(val) {
        if (val) {
          this.getDetail(this.config.row.id)
        }
      },
      immediate: true
    }
  },
  created() {
    this.getassistantcategoryList()
  },
  mounted() {},
  methods: {
    //  获取助手分类
    async getassistantcategoryList() {
      try {
        const { data, success } = await assistantcategoryListApi({
          pageSize: 100
        })
        if (success) {
          this.categoryList = data.items || []
        }
      } catch (error) {
        console.log(error)
      }
    },
    fileChange(res) {
      console.log(res)
      const arr = []
      res.map(v => {
        arr.push(v.url)
      })
      this.form.fileList = arr
    },
    beforeVideoUpload(file) {
      const suffix = this.$getFileType(file.name).suffix
      const ifFileType = [
        'doc',
        'docx',
        'pdf',
        'txt',
        'excel',
        'xlsx',
        'xls'
      ].includes(suffix)
      if (!ifFileType) {
        this.$message.error({
          message: '请上传支持的文件格式',
          customClass: 'amap-sug-result'
        })
        return false
      }
      const isLt20G = file.size / 1024 / 1024 < 5
      if (!isLt20G) {
        this.$message.error({
          message: '文件最大不超过5M',
          customClass: 'amap-sug-result'
        })
        return false
      }
      return isLt20G && ifFileType
    },
    // 点击发布按钮
    onhandlePublic() {
      if (this.loading) {
        return
      }
      if (this.$refs.fileUpload.getUploadFile()) {
        console.log(this.$refs.fileUpload.getUploadFile())
        return this.$message.error({
          message: '有文件正在上传',
          customClass: 'amap-sug-result'
        })
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.publicConfig = {
            visible: true,
            row: {
              icon: this.form.icon,
              title: this.form.title,
              describe: this.form.description,
              categoryId: this.form.categoryId
            },
            success: () => {
              this.editAi(this.form)
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeFn() {
      this.publicConfig = {
        visible: false,
        row: {}
      }
    },
    editAi() {
      this.loading = true
      const data = {
        content: this.form.content,
        description: this.form.description,
        categoryId: this.form.categoryId,
        icon: this.form.icon,
        isPrivate: this.form.isPrivate,
        knowledge: this.form.fileList,
        templateId: this.form.templateId,
        title: this.form.title
      }
      updateAssistant(data)
        .then(res => {
          this.$emit('success')
          this.publicConfig.visible = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getDetail(templateId) {
      this.pageLoading = true
      const data = {
        templateId: templateId
      }
      getAssistantDetails(data)
        .then(res => {
          console.log('打开编辑私有助手', res)
          const obj = res.data
          this.form = {
            content: obj.content,
            description: obj.description,
            categoryId: obj.categoryId,
            icon: obj.icon,
            isPrivate: obj.isPrivate,
            fileList: obj.knowledge || [],
            templateId: obj.templateId,
            title: obj.title
          }
          const arr = obj.knowledge.reduce((pre, next) => {
            pre.push({
              status: 3, // 状态
              authProgress: 100, // 进度
              url: next // 视频播放地址
            })
            return pre
          }, [])
          this.$refs.fileUpload && this.$refs.fileUpload.setFileList(arr)
          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.addPage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 800px;
  .addPage_header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 21px 25px;
    .goBackBtn {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #313233;
      line-height: 22px;
      cursor: pointer;
    }
    .publicbtn {
      padding: 0 24px;
      height: 40px;
      background: #5696ff;
      border-radius: 6px;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 40px;
      cursor: pointer;
    }
    .isPrivateBtn {
      margin-left: 20px;
      color: #313233;
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      display: flex;
      justify-content: center;
      color: #333;
      line-height: 24px;
      cursor: context-menu;
      > .rightsItemIcon {
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
    }
    .isActive {
      background: #00b42a;
    }
  }
  .addPage_content {
    flex: 1 0 0;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #d8d8d8;
      transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    .addPage_content_form {
      margin: 0 auto;
      width: 750px;
    }
    .addPage_avatar {
      padding-top: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 32px;
    }
    .formTips {
      margin-top: 8px;
      font-size: 12px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
    }
  }
}
.form_label_tips {
  font-size: 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
  margin-left: 8px;
}
</style>
