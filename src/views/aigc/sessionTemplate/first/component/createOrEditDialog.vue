<!-- 新增会话模板弹窗 -->
<template>
  <div>
    <el-dialog
      :title="row.id ? '编辑助手' : '新建助手'"
      :visible.sync="visible"
      width="890px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :loading="loading"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="助手名称" prop="name" style="width: 92%">
          <el-input
            v-model="form.name"
            placeholder="请输入助手名称"
            show-word-limit
            class="name-s"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="功能描述" prop="description" style="width: 92%">
          <el-input
            v-model="form.description"
            placeholder="请输入功能描述，简要介绍助手功能"
            maxlength="50"
            class="description-s"
            show-word-limit
          />
        </el-form-item>
        <!-- <el-form-item label="助手分类" prop="categoryId" style="width: 92%">
          <el-select
            v-model="form.categoryId"
            placeholder="请选择助手分类"
            style="width: 100%"
          >
            <template v-for="item in categoryList">
              <el-option
                :key="item.categoryId"
                :label="item.name"
                :value="item.categoryId"
              />
            </template>
          </el-select>
        </el-form-item> -->
        <el-form-item label="Prompt" prop="content" style="width: 92%">
          <!-- 文本域 -->
          <el-input
            ref="textarea"
            v-model="form.content"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            resize="none"
            maxlength="2000"
            show-word-limit
            placeholder="请输入Prompt，使用中括号【】 代表用户输入内容。eg：作为一名文案优化师，请对文章【文章内容】进行润色，要求：【文案润色要求】"
          />
          <div>
            <el-tag type="warning">
              注意：使用中括号【】代表用户输入内容，最多支持10个
            </el-tag>
          </div>
        </el-form-item>

        <!-- <draggable
          v-model="form.issueIds"
          handle=".drag"
          animation="1000"
          @start="isDraggable = true"
          @update="isDraggable = true"
          @end="isDraggable = false"
        >
          <el-form-item
            v-for="(domain, index) in form.issueIds"
            :key="index + 'issueIds'"
            :label="index === 0 && !isDraggable ? '提示问题' : ' '"
            :prop="'issueIds.' + index + '.id'"
            :required="index === 0 && !isDraggable"
            :rules="{
              validator: validatorIssueIds,
              trigger: 'change'
            }"
          >
            <div class="drag-div">
              <el-select
                v-model="domain.id"
                placeholder="请选择提示问题"
                style="width: 30%"
                clearable
                filterable
                @change="handleIssueChange(domain.id, index)"
              >
                <el-option
                  v-for="(item, ii) in issueList"
                  :key="item.title + ii + 'issue' + domain.id"
                  :label="item.title"
                  :value="item.id"
                  :disabled="item.disabled"
                />
              </el-select>
              <el-input
                v-model="domain.name"
                class="issue-input"
                :disabled="!domain.id"
                style="width: 42%"
              />
              <el-checkbox v-model="domain.checked" class="checkbox-checked">
                必答题
              </el-checkbox>
              <div class="drag-img">
                <img
                  v-if="form.issueIds.length > 1"
                  class="drag drag-show"
                  src="@/assets/image/aigc/drag-select.png"
                  alt=""
                >
                <img
                  v-if="form.issueIds.length > 1"
                  class="drag drag-hide"
                  src="@/assets/image/aigc/drag-d.png"
                  alt=""
                >
              </div>
              <img
                v-if="form.issueIds.length > 1"
                class="delete-issue"
                src="@/assets/image/aigc/closeIssue.png"
                alt=""
                @click="deleteIssue(index, domain.id)"
              >
            </div>
          </el-form-item>
        </draggable>
        <el-form-item>
          <el-button @click="addIssue"> 新增提示问题 </el-button>
        </el-form-item> -->
        <!-- <draggable
          v-model="form.issueGuideIds"
          handle=".drag"
          animation="1000"
          @start="isDraggable2 = true"
          @update="isDraggable2 = true"
          @end="isDraggable2 = false"
        >
          <el-form-item
            v-for="(domain, index) in form.issueGuideIds"
            :key="index"
            :label="index === 0 && !isDraggable2 ? '引导问题' : ' '"
            :prop="'issueGuideIds.' + index + '.id'"
            :rules="{
              validator: validatorIssueGuideIds,
              trigger: 'change'
            }"
          >
            <div class="drag-div">
              <el-input
                v-model="domain.content"
                placeholder="请输入引导问题"
                style="width: 83.5%"
              />
              <div class="drag-img">
                <img
                  v-if="form.issueGuideIds.length > 1"
                  class="drag drag-show"
                  src="@/assets/image/aigc/drag-select.png"
                  alt=""
                >
                <img
                  v-if="form.issueGuideIds.length > 1"
                  class="drag drag-hide"
                  src="@/assets/image/aigc/drag-d.png"
                  alt=""
                >
              </div>
              <img
                v-if="form.issueGuideIds.length > 0"
                class="delete-issue"
                src="@/assets/image/aigc/closeIssue.png"
                alt=""
                @click="deleteIssueGuideId(index)"
              >
            </div>
          </el-form-item>
        </draggable>
        <el-form-item :label="form.issueGuideIds.length === 0 ? '引导问题' : ' '">
          <el-button @click="addIssueGuideId"> 新增引导问题 </el-button>
        </el-form-item> -->
        <el-form-item
          label="助手图标"
          prop="imgUrl"
          style="width: 92%"
          class="relative"
        >
          <div v-if="form.imgUrl" class="image-block">
            <el-image :src="form.imgUrl" class="image" fit="contain" />
            <p class="bg" />
            <i class="el-icon-delete-solid" @click="handleClickDelete" />
          </div>
          <el-upload
            v-else
            v-loading="uploadFlag"
            action="#"
            :before-upload="beforeAvatarUpload"
            :http-request="fileRequest"
          >
            <i slot="default" class="el-icon-plus" />
            <div slot="tip" class="el-upload__tip">
              注：图标只可上传JPG或者PNG格式，大小限5M以下。
            </div>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="排序" prop="sort" style="width: 92%">
          <el-input-number
            v-model="form.sort"
            controls-position="right"
            :min="0"
            :max="999"
          />
          <div>
            <el-tag type="warning">注意：从0开始，数字越小越靠前</el-tag>
          </div>
        </el-form-item> -->

        <el-form-item label="知识库">
          <div class="form_label_tips">
            上传资料文档，可基于文档内容和AI助手进行聊天互动。
          </div>
          <fileUpload
            ref="fileUpload"
            :limit="10 - form.fileList.length"
            accept="*"
            :before-video-upload="beforeVideoUpload"
            @change="fileChange"
          />
        </el-form-item>

        <el-form-item label="助手状态" prop="isEnabled" style="width: 92%">
          <el-switch v-model="form.isEnabled" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="btnLoading" @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submit">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  aiSessionTemplateAdd,
  aiSessionTemplateUpdate,
  aiProblemConfigPage
} from '@/api/aigc/standardIssueConfig'
import { assistantcategoryListApi } from '@/api/aigc/index.js'
import fileUpload from './uploadFile/index'
import { getOssConfig } from '@/api/file'
// import draggable from 'vuedraggable'
// import _ from 'lodash'
const OSS = require('ali-oss')
const ossProdcutFolder = 'hok_product/video/'

export default {
  components: {
    fileUpload
  },
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
      default: () => {}
    }
  },
  data() {
    // const validatorIssueGuideIds = (rule, value, callback) => {
    //   const info = this.form.issueGuideIds.find(item => item.id === value)
    //   if (!info.content) {
    //     callback(new Error('请填写引导问题'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatorIssueIds = (rule, value, callback) => {
    //   const list = _.filter(this.form.issueIds, { id: value })
    //   if (list.length > 1) {
    //     callback(new Error('提示问题不能重复'))
    //   }
    //   // this.form.issueIds.forEach(item => {
    //   //   console.log(value, item.id, 11111)
    //   //   if (item.id === value) {
    //   //     callback(new Error('提示问题不能重复'))
    //   //   }
    //   // })
    //   if (!value) {
    //     callback(new Error('请选择提示问题'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      // validatorIssueGuideIds,
      // validatorIssueIds,
      categoryList: [],
      form: {
        name: undefined,
        description: undefined,
        type: undefined,
        // categoryId: undefined,
        imgUrl: undefined,
        content: '',
        sort: 0,
        isDeleted: true,
        fileList: []
        // issueIds: [{ id: '', checked: false, description: '', name: '' }],
        // issueGuideIds: [{ id: 100, content: '' }]
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入助手名称',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '请输入Prompt',
            trigger: 'blur'
          }
        ],
        // categoryId: [
        //   {
        //     required: true,
        //     message: '请选择助手分类',
        //     trigger: 'blur'
        //   }
        // ],
        description: [
          {
            required: true,
            message: '请输入功能描述',
            trigger: 'blur'
          }
        ]
        // imgUrl: [
        //   {
        //     required: true,
        //     message: '请上传模板图标',
        //     trigger: 'change'
        //   }
        // ]
      },
      // issueList: [],
      config: {},
      loading: false,
      uploadFlag: false,
      disabled: false,
      isDraggable: false,
      isDraggable2: false,
      btnLoading: false
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
  mounted() {
    // this.getStandardIssueConfigList()
    this.getOssConfig()
    this.getassistantcategoryList()
    if (this.row.id) {
      console.log(this.row, '111')
      this.form = {
        ...this.row,
        // issueIds: this.row.issueList.map(m => ({
        //   ...m,
        //   checked: m.isMust === '1'
        // })),
        // issueGuideIds: [...this.row.jobNameList],
        fileList: this.row.knowledge || [],
        name: this.row.title,
        imgUrl: this.row.icon,
        isEnabled: Number(this.row.isEnabled) === 1
      }
      const arr = this.form.fileList.reduce((pre, next) => {
        pre.push({
          status: 3, // 状态
          authProgress: 100, // 进度
          url: next // 视频播放地址
        })
        return pre
      }, [])
      this.$nextTick(() => {
        this.$refs.fileUpload && this.$refs.fileUpload.setFileList(arr)
      })
    }
    console.log('row-----------', this.row)
  },
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
        this.$message.error('请上传支持的文件格式')
        return false
      }
      const isLt20G = file.size / 1024 / 1024 < 5
      if (!isLt20G) {
        this.$message.error('文件最大不超过5M')
        return false
      }
      return isLt20G && ifFileType
    },
    handleClickDelete() {
      this.form.imgUrl = ''
      // this.$forceUpdate()
    },
    // 获取oss配置
    getOssConfig() {
      this.loading = true
      getOssConfig()
        .then(res => {
          this.config = {
            region: 'oss-accelerate',
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            secure: true,
            bucket: res.data.ossBucket,
            ossBucketUrl: res.data.ossBucketUrl,
            ossEndPoint: res.data.ossEndPoint
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('获取oss配置失败')
          this.loading = false
        })
    },
    async fileRequest(e, fileList) {
      this.oss = new OSS(this.config)
      this.uploadFlag = true
      await this.oss.multipartUpload(ossProdcutFolder + e.file.name, e.file)
      this.form.imgUrl = `${this.config.ossBucketUrl}${ossProdcutFolder}${e.file.name}`
      this.uploadFlag = false
    },
    // handleIssueChange(id, index) {
    //   this.issueList.forEach(item => {
    //     if (item.id === id) {
    //       this.form.issueIds[index].description = item.description
    //       this.form.issueIds[index].id = item.id
    //     }
    //   })
    // },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG或者PNG 格式!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
        return false
      }
      // return (isJPG || isPNG) && isLt5M
    },
    // deleteIssueGuideId(index) {
    //   this.form.issueGuideIds.splice(index, 1)
    // },
    // addIssueGuideId() {
    //   this.form.issueGuideIds.push({
    //     id: this.form.issueGuideIds.length + 1,
    //     content: ''
    //   })
    // },
    // deleteIssue(index, id) {
    //   this.form.issueIds.splice(index, 1)
    //   this.issueList.forEach(item => {
    //     if (item.id === id) {
    //       item.disabled = false
    //     }
    //   })
    // },
    // addIssue() {
    //   this.form.issueIds.push({
    //     // index: this.form.issueIds.length + 1,
    //     checked: false,
    //     id: '',
    //     description: '',
    //     name: ''
    //   })
    // },
    handleClose() {
      this.$emit('close')
    },
    submit() {
      if (this.$refs.fileUpload.getUploadFile()) {
        console.log(this.$refs.fileUpload.getUploadFile())
        return this.$message.error('有文件正在上传')
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.content) {
            const regex = /\【.*?\】/g
            const matches = this.form.content.match(regex)
            const count = matches ? matches.length : 0
            if (count > 10) {
              this.$message.warning(
                '使用中括号【】代表用户输入内容，最多支持10个'
              )
              return
            }
          }
          this.btnLoading = true
          if (this.row.id) {
            this.submitEdit()
          } else {
            this.submitAdd()
          }
        }
      })
    },
    submitEdit() {
      const params = {
        content: this.form.content,
        description: this.form.description,
        // categoryId: this.form.categoryId,
        // jobNameList: this.form.issueGuideIds,
        icon: this.form.imgUrl,
        // issueList: this.form.issueIds,
        title: this.form.name,
        id: this.form.id,
        sort: this.form.sort,
        knowledge: this.form.fileList,
        isEnabled: this.form.isEnabled ? 1 : 0
      }
      aiSessionTemplateUpdate(params)
        .then(() => {
          this.$emit('success')
          this.$message.success('编辑成功')
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    submitAdd() {
      console.log(this.form, 2222)

      const params = {
        content: this.form.content,
        description: this.form.description,
        // categoryId: this.form.categoryId,
        // jobNameList: this.form.issueGuideIds,
        icon: this.form.imgUrl,
        knowledge: this.form.fileList,
        // issueList: this.form.issueIds,
        title: this.form.name,
        sort: this.form.sort,
        isEnabled: this.form.isEnabled ? 1 : 0
      }

      aiSessionTemplateAdd(params)
        .then(() => {
          this.$emit('success')
          this.$message.success('添加成功')
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    async getStandardIssueConfigList() {
      const params = {
        pageIndex: this.currentPage,
        pageSize: 100
      }
      const data = await aiProblemConfigPage(params)
      this.issueList = data.data.items
      console.log(this.issueList, 9999)
    }
  }
}
</script>
<style lang="scss" scoped>
.drag-div {
  display: flex;
  align-items: center;
  width: 100%;
}
.drag-img {
  &:hover {
    .drag-show {
      display: inherit;
    }
    .drag-hide {
      display: none;
    }
  }
}
.drag-show {
  display: none;
}
.drag-hide {
  display: inherit;
}
.drag {
  width: 20px;
  height: 20px;
  margin-left: 5px;
}
.delete-issue {
  width: 20px;
  height: 20px;
  margin-left: 6px;
  &:hover {
    cursor: pointer;
  }
}
::v-deep .el-upload--text {
  width: 80px;
  height: 80px;
  line-height: 80px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  font-size: 20px;
  &:hover {
    border: 1px dashed #0c6fff;
    color: #0c6fff;
  }
}
::v-deep .issue-input {
  .el-input__inner {
    background-color: #fff;
  }
  .el-input .is-disabled {
  }
}
::v-deep .checkbox-checked {
  margin-left: 16px;
  .el-checkbox__label {
    padding-left: 4px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #a2a5a8;
  }
}
.image-block {
  width: 80px;
  height: 80px;
  position: relative;
  .image {
    width: 100%;
    height: 100%;
  }
  i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    font-size: 20px;
    cursor: pointer;
    color: #fff;
    display: none;
  }
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    z-index: 1;
  }
  &:hover {
    .bg {
      display: block;
    }
    i {
      display: block;
    }
  }
}
::v-deep .el-textarea__inner {
  padding: 16px;
  color: #333;
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #d0d0d0;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }
}
::v-deep {
  .name-s,
  .description-s {
    .el-input input {
      padding-right: 40px;
    }
  }
}
</style>
