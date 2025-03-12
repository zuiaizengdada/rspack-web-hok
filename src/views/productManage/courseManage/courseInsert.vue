<template>
  <div class="live-content">
    <div class="brand-row">
      <span @click="$router.push({ path: '/productManage/courseManage/index' })">课件管理 > </span>
      <span class="title-row">{{ isUpdate ? '编辑课件' : '新增课件' }}</span>
    </div>
    <div class="course-from">
      <el-form
        ref="courseForm"
        :model="courseForm"
        :inline="true"
        :rules="rules"
        label-width="120px"
        class="demo-form-inline"
      >
        <el-row>
          <el-form-item label="课件IP" prop="teacherId">
            <el-select
              v-model="courseForm.teacherId"
              :disabled="isUpdate"
              filterable
              clearable
              placeholder="请选择"
              class="w-300"
              @change="chooseTheTeach"
            >
              <el-option
                v-for="item in teacherArray"
                :key="item.teacherId"
                :label="item.teacherName"
                :value="item.teacherId"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="课件名称" prop="coursewareName">
            <el-input v-model="courseForm.coursewareName" class="width-cls" maxlength="20" show-word-limit />
            <span class="tips-sp">注：限20字以内</span>
          </el-form-item>
        </el-row>
        <el-row v-for="(domain, index) in courseForm.coursewareOutline" :key="index">
          <el-form-item
            :label="index === 0 ? '课件大纲' : ''"
            :prop="'coursewareOutline.' + index + '.value'"
            :rules="{
              required: true,
              message: '课件大纲不能为空',
              trigger: 'blur'
            }"
            :class="index > 0 ? 'toright-cls' : ''"
          >
            <el-input v-model="domain.value" class="width-cls" maxlength="20" show-word-limit />
            <el-button class="icon-pl" @click="addOutline"><i class="el-icon-plus" /></el-button>
            <el-button
              v-if="courseForm.coursewareOutline.length > 1"
              class="icon-pl"
              @click="deleteOutline(domain)"
            ><i
              class="el-icon-minus"
            /></el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            ref="courseWare"
            label="课件上传"
            prop="coursewareUrl"
            class="up-load"
            style="padding-bottom: 15px"
          >
            <el-upload
              v-model="courseForm.coursewareUrl"
              v-loading="uploadFlag"
              class="upload-demo"
              action="#"
              accept="image/jpeg,image/png,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf"
              :on-change="handleChange"
              :http-request="fileRequest"
              :on-remove="handleRemove"
              :on-preview="toPreviewFile"
              :file-list="fileList"
              :auto-upload="true"
            >
              <div class="upload-block">
                <i class="el-icon-plus" />
                <span class="color-span" type="primary">点击上传附件</span>
                <span class="tips">注：可上传PPT、PDF、JPG、PNG文件、大小限制50M以内</span>
              </div>
            </el-upload>
            <div v-if="courseForm.coursewareUrl !== '' && courseForm.coursewareUrl !== null" class="upload-img-orfile">
              <div v-if="courseForm.coursewareUrl.indexOf('pdf') > 0" class="upload-file-cls" @click="toPreviewFile">
                <img src="@/assets/image/product/icon_pdfwenjian@2x.png" />
                <p>点击查看</p>
              </div>
              <div
                v-else-if="courseForm.coursewareUrl.indexOf('pptx') > 0"
                class="upload-file-cls"
                @click="toPreviewFile"
              >
                <img src="@/assets/image/product/ppt@2x.png" />
                <p>点击查看</p>
              </div>
              <ImagePreviewer v-else class="img-cls" :src="courseForm.coursewareUrl" :scale-width="120" :scale-height="90" @click="toPreviewFile" />
              <i class="el-icon-error right-delete" @click="deleteFiles" />
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="选择选题">
            <el-button
              type="primary"
              plain
              class="choose-anli"
              :disabled="courseForm.teacherId === ''"
              @click="handleBodyDialog"
            >选择选题</el-button>
            <span class="anli-sp">已选{{ courseForm.caseId.length }}个选题</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="课件关键词" prop="coursewareKeyword">
            <el-input
              v-model="courseForm.courseKeyword"
              class="width-cls"
              maxlength="20"
              show-word-limit
              @change="addKeyWord"
            />
            <span class="tips-sp">注：输入一个关键词后，按回车生产标签</span>
            <div v-if="courseForm.coursewareKeyword.length > 0" class="bq-row">
              <span v-for="(item, index) in courseForm.coursewareKeyword" :key="index" class="bq-row-span">
                {{ item }}
                <i class="el-icon-close" @click="deleteKeyword(item)" />
              </span>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="所属计划">
            <el-select v-model="courseForm.planId" placeholder="请选择" filterable clearable class="w-300">
              <el-option v-for="item in planArray" :key="item.planId" :label="item.planName" :value="item.planId" />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 100px" label="课件适用场景">
            <el-select v-model="courseForm.applySceneId" placeholder="请选择" filterable clearable class="w-300">
              <el-option v-for="item in usePlace" :key="item.id" :label="item.sceneName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="课件制作日期" prop="produceDate">
            <el-date-picker v-model="courseForm.produceDate" class="width-cls" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item style="margin-left: 100px" label="课件制作人" prop="producer">
            <el-input v-model="courseForm.producer" disabled class="width-cls" />
          </el-form-item>
        </el-row>
        <el-row style="text-align: center; margin-top: 20px; margin-bottom: 180px">
          <el-form-item>
            <el-button type="primary" @click="submitForm('courseForm')">保存</el-button>
            <el-button @click="resetForm('courseForm')">取消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="courseForm.coursewareUrl" alt="" />
    </el-dialog>
    <select-case-modal ref="modal" @submit="returnCaseChoosed" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { searchDeliveryData } from '@/api/product/setting'
import {
  insertCourseObj,
  getCourseDetailById,
  updateForCourseObj,
  getUserInfoForName
} from '@/api/product/courseManage'
import { teacherQueryByName } from '@/api/tearchCenter/index'
import { planTeacherDropdown } from '@/api/product/plan'
import { getOssConfig } from '@/api/file'
import selectCaseModal from '@/views/productManage/courseManage/components/SelectCaseModal/index'
const OSS = require('ali-oss')
const ossProdcutFolder = 'hok_product/video/'
export default {
  components: { selectCaseModal },
  data() {
    return {
      userNickName: '',
      uploadFlag: false,
      oldTeacherId: '',
      returnData: {},
      courseId: '',
      oss: '',
      dialogImageUrl: '',
      dialogVisible: false,
      disabledShow: false,
      usePlace: [],
      teacherArray: [],
      planArray: [],
      courseForm: {
        teacherId: '',
        coursewareName: '',
        coursewareOutline: [{ key: '23334324', value: '' }],
        coursewareKeyword: [],
        planId: '',
        applySceneId: '',
        produceDate: new Date(),
        producer: '',
        coursewareUrl: '',
        caseId: []
      },
      rules: {
        teacherId: [{ required: true, message: '请选择IP', trigger: 'change' }],
        coursewareKeyword: [{ required: true, message: '请添加课件关键字', trigger: 'blur' }],
        coursewareName: [{ required: true, message: '请输入课件名称', trigger: 'blur' }],
        produceDate: [{ required: true, message: '请选择课件制作日期', trigger: 'change' }],
        coursewareUrl: [{ required: true, message: '请上传课件' }]
      },
      fileList: [],
      isUpdate: false,
      config: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        secure: false,
        bucket: '',
        ossBucketUrl: '',
        ossEndPoint: ''
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.loadTearchList()
    this.loadSceneList()
    this.loadManagePlan()
    this.getOssConfig()
    this.loadUserInfo()
    this.courseId = this.$route.query.courseId
    if (this.courseId === undefined || this.courseId === '') {
      this.isUpdate = false
      this.courseForm.producer = this.userNickName
    } else {
      const that = this
      setTimeout(function () {
        that.loadData()
      }, 100)
      this.isUpdate = true
    }
  },
  created() {},
  methods: {
    // 获取oss配置
    getOssConfig() {
      this.loading = true
      getOssConfig()
        .then((res) => {
          this.config = {
            region: 'oss-accelerate',
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            secure: true,
            bucket: res.data.ossBucket,
            ossBucketUrl: res.data.ossBucketUrl,
            ossEndPoint: res.data.ossEndPoint
          }
          // eslint-disable-next-line no-undef
          // this.client = new OSS(this.config)
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('获取oss配置失败')
          this.loading = false
        })
    },
    loadUserInfo() {
      getUserInfoForName().then((res) => {
        if (res.success) {
          this.userNickName = res.data.nickName
          this.courseForm.producer = this.userNickName
        }
      })
    },
    loadData() {
      getCourseDetailById(this.courseId).then((res) => {
        if (res.success) {
          console.log(res)
          this.returnData = res.data
          if (this.returnData.coursewareUrl !== null) {
            if (
              this.returnData.coursewareUrl.indexOf('png') > 0 ||
              this.returnData.coursewareUrl.indexOf('jpg') > 0 ||
              this.returnData.coursewareUrl.indexOf('jpeg') > 0
            ) {
              this.isImg = true
            }
          }
          this.courseForm.teacherId = res.data.teacherId
          this.courseForm.coursewareName = res.data.coursewareName
          this.courseForm.planId = res.data.planId
          this.courseForm.produceDate = res.data.produceDate
          this.courseForm.applySceneId = res.data.applySceneId
          this.courseForm.coursewareKeyword = []
          if (res.data.coursewareKeyword !== '' && res.data.coursewareKeyword.indexOf(',') < 0) {
            this.courseForm.coursewareKeyword.push(res.data.coursewareKeyword)
          } else {
            this.courseForm.coursewareKeyword = res.data.coursewareKeyword.split(',')
          }

          this.courseForm.coursewareOutline = []
          this.courseForm.coursewareUrl = res.data.coursewareUrl
          this.courseForm.producer = res.data.producer
          this.courseForm.caseId = []
          res.data.caseInfo.forEach((value) => {
            const obj = {
              label: value.caseName,
              value: value.caseId
            }
            this.courseForm.caseId.push(obj)
          })
          res.data.coursewareOutline.forEach((value) => {
            const obj = {
              key: new Date().getTime() + value,
              value: value
            }
            this.courseForm.coursewareOutline.push(obj)
          })
          const str = res.data.coursewareUrl
          if (res.data.coursewareUrl !== null && res.data.coursewareUrl !== '') {
            const obj = {
              name: str.substring(str.lastIndexOf('/') + 1, str.length),
              url: res.data.coursewareUrl
            }
            this.fileList = []
            this.fileList.push(obj)
          }

          this.loadTearchList()
          this.loadSceneList()
          this.loadManagePlan()
        }
      })
    },
    loadManagePlan() {
      const param = {
        teacherId: this.courseForm.teacherId
      }
      planTeacherDropdown(param).then((res) => {
        if (res.success) {
          this.planArray = res.data.items
        }
      })
    },
    chooseTheTeach() {
      if (this.oldTeacherId === '') {
        this.courseForm.planId = ''
        this.loadManagePlan()
      } else if (this.oldTeacherId !== '' && this.oldTeacherId !== this.courseForm.teacherId) {
        this.courseForm.planId = ''
        this.loadManagePlan()
      }
      this.courseForm.caseId = []
    },
    loadSceneList() {
      const param = {
        pageIndex: 1,
        pageSize: 1000,
        sceneName: '',
        status: 1
      }
      searchDeliveryData(param).then((res) => {
        if (res.success) {
          this.usePlace = res.data.items
        }
      })
    },
    loadTearchList() {
      const params = {
        name: ''
      }
      teacherQueryByName(params).then((res) => {
        if (res.success) {
          this.teacherArray = res.data
        }
      })
    },
    addKeyWord() {
      if (this.courseForm.coursewareKeyword.length < 20) {
        this.courseForm.coursewareKeyword.push(this.courseForm.courseKeyword)
        this.courseForm.courseKeyword = ''
      } else {
        this.$message.error('课件关键词添加不能超过20个')
        return false
      }
    },
    deleteKeyword(item) {
      var index = this.courseForm.coursewareKeyword.indexOf(item)
      if (index !== -1) {
        this.courseForm.coursewareKeyword.splice(index, 1)
      }
    },
    addOutline() {
      if (this.courseForm.coursewareOutline.length >= 10) {
        this.$message.error('最多可添加10条课件大纲！')
        return false
      }
      this.courseForm.coursewareOutline.push({
        value: '',
        key: Date.now()
      })
    },
    deleteOutline(item) {
      var index = this.courseForm.coursewareOutline.indexOf(item)
      if (index !== -1) {
        this.courseForm.coursewareOutline.splice(index, 1)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            teacherId: this.courseForm.teacherId,
            coursewareName: this.courseForm.coursewareName,
            coursewareOutline: this.courseForm.coursewareOutline,
            coursewareKeyword: this.courseForm.coursewareKeyword,
            planId: this.courseForm.planId,
            applySceneId: this.courseForm.applySceneId,
            produceDate: this.courseForm.produceDate,
            producer: this.courseForm.producer,
            coursewareUrl: this.courseForm.coursewareUrl,
            caseId: this.courseForm.caseId,
            applySceneName: '',
            planName: '',
            teacherName: ''
          }
          params.coursewareOutline = []
          this.courseForm.coursewareOutline.forEach((value) => {
            params.coursewareOutline.push(value.value)
          })
          params.coursewareKeyword = ''
          this.courseForm.coursewareKeyword.forEach((value) => {
            params.coursewareKeyword += value + ','
          })
          params.coursewareKeyword = params.coursewareKeyword.substring(0, params.coursewareKeyword.length - 1)
          params.caseInfo = []
          params.caseId.forEach((value) => {
            const obj = {
              caseId: value.value,
              caseName: value.label
            }
            params.caseInfo.push(obj)
          })
          this.teacherArray.forEach((value) => {
            if (value.teacherId === params.teacherId) {
              params.teacherName = value.teacherName
            }
          })
          this.planArray.forEach((value) => {
            if (value.planId === params.planId) {
              params.planName = value.planName
            }
          })
          this.usePlace.forEach((value) => {
            if (value.id === params.applySceneId) {
              params.applySceneName = value.sceneName
            }
          })
          if (this.isUpdate) {
            params.id = this.returnData.id
            updateForCourseObj(params).then((res) => {
              this.$message.success('课件编辑成功！')
              const that = this
              setTimeout(function () {
                that.$router.push('/productManage/courseManage/index')
              }, 1000)
            })
          } else {
            insertCourseObj(params).then((res) => {
              if (res.success) {
                this.$message.success('课件新增成功！')
                const that = this
                setTimeout(function () {
                  that.$router.push('/productManage/courseManage/index')
                }, 1000)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$router.push('/productManage/courseManage/index')
    },
    async fileRequest(e, fileList) {
      this.oss = new OSS(this.config)
      const selectFile = e.file
      if (!selectFile) {
        this.$message.error('请先选择需要上传的文件!')
        return
      }
      const is10M = e.file.size / 1024 / 1024 < 50
      if (!is10M) {
        fileList.splice(0)
        this.courseForm.coursewareUrl = ''
        this.$message.error('上传的文件不能大于50MB!')
        return false
      }
      this.uploadFlag = true
      await this.oss.multipartUpload(ossProdcutFolder + e.file.name, e.file)
      this.courseForm.coursewareUrl = `${this.config.ossBucketUrl}${ossProdcutFolder}${e.file.name}`
      this.uploadFlag = false
      this.$refs.courseWare.clearValidate()
      // formData.append('file', selectFile)
    },
    handleChange(file, fileList) {
      this.ebsFileList = fileList
      this.ebsErrorImport = ''
      if (fileList.length > 1) {
        fileList.splice(0, 1)
        this.$message.info('只能上传一个文件,文件已替换！')
      }
      const is10M = file.size / 1024 / 1024 < 50
      if (!is10M) {
        fileList.splice(0)
        this.courseForm.coursewareUrl = ''
        this.$message.error('上传的文件不能大于50MB!')
        return false
      }
    },
    handleRemove(file, fileList) {
      fileList.splice(0)
      this.courseForm.coursewareUrl = ''
    },
    deleteFiles() {
      this.fileList.splice(0)
      this.courseForm.coursewareUrl = ''
    },
    toPreviewFile() {
      if (this.courseForm.coursewareUrl === '') {
        this.$message.error('正在上传中，请稍后预览！')
        return
      }

      if (
        this.courseForm.coursewareUrl.indexOf('png') > 0 ||
        this.courseForm.coursewareUrl.indexOf('jpg') > 0 ||
        this.courseForm.coursewareUrl.indexOf('jpeg') > 0
      ) {
        this.dialogVisible = true
      } else {
        window.open(this.courseForm.coursewareUrl, '_blank')
      }

      /* if (this.isUpdate) {
        if (
          this.courseForm.coursewareUrl.indexOf('png') > 0 ||
          this.courseForm.coursewareUrl.indexOf('jpg') > 0 ||
          this.courseForm.coursewareUrl.indexOf('jpeg') > 0
        ) {
          this.dialogVisible = true
        } else {
          if (this.courseForm.coursewareUrl === '') {
            this.$message.error('正在上传中，请稍后预览！')
            return
          }
          window.open(this.courseForm.coursewareUrl, '_blank')
        }
      } else {
        if (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png') {
          this.dialogVisible = true
        } else {
          if (this.courseForm.coursewareUrl === '') {
            this.$message.error('正在上传中，请稍后预览！')
            return
          }
          window.open(this.courseForm.coursewareUrl, '_blank')
        }
      } */
    },
    handleBodyDialog() {
      this.$refs.modal.open(this.courseForm.caseId, this.courseForm.teacherId)
    },
    returnCaseChoosed(data) {
      this.courseForm.caseId = data
    }
  }
}
</script>

<style lang="scss" scoped>
.live-content {
  width: 100%;
  min-width: 1200px;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
}
.brand-row {
  width: 100%;
  height: 40px;
  color: #777;
  font-size: 16px;
  border-bottom: 1px solid #eff2f6;
  span {
    cursor: pointer;
  }
}

.title-row {
  color: #333;
  font-weight: bold;
}

.course-from {
  width: 100%;
  padding-top: 20px;
  ::v-deep .el-input--medium .el-input__inner {
    padding-right: 50px;
  }
}

.demo-form-inline {
  width: 1100px;
}

.toright-cls {
  margin-left: 120px;
}

.width-cls {
  width: 300px;
}

.tips-sp {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}

.icon-pl {
  padding: 10px 10px;
  margin-left: 10px;
  color: #333;
}

.anli-sp {
  font-size: 14px;
  color: #777;
  margin-left: 10px;
}

.bq-row {
  width: 830px;
  padding: 15px 10px;
  margin-top: 10px;
  border: 1px dashed #9f9f9f;
  .bq-row-span {
    padding: 5px 10px;
    background: #dae9ff;
    margin-left: 10px;
    border-radius: 3px;
    color: #0c6fff;
    i {
      cursor: pointer;
    }
  }
}

.w-300 {
  width: 300px;
}
.choose-anli {
  background: none !important;
  border: 1px solid #0c6fff;
  color: #0c6fff;
}
.choose-anli:hover {
  background: #0c6fff !important;
}

.up-load {
  position: relative;
  width: 500px;
  ::v-deep .el-upload-list {
    float: right;
    display: none;
    margin-left: -120px;
    width: 120px;
    height: 90px;
    background: #fff;
    border: 1px solid #e1e6ed;
    z-index: 999;
  }
}
.upload-img-orfile {
  position: absolute;
  left: 130px;
  top: 0px;
  width: 120px;
  height: 90px;
  background: #fff;
  border: 1px solid #e1e6ed;
  text-align: center;
  .img-cls {
    width: 100%;
    height: 100%;
  }
  .upload-file-cls {
    width: 100%;
    height: 100%;
    text-align: center;
    cursor: pointer;
    img {
      width: 32px;
      margin-top: 10px;
      display: inline-block;
    }
    p {
      width: 100%;
      font-size: 12px;
      color: #0c6fff;
    }
  }
}
.upload-block {
  position: relative;
  float: right;
  width: 120px;
  height: 90px;
  background: #fbfcfe;
  border: 1px dashed #e1e6ed;
  margin-bottom: 15px;
  i {
    margin-top: 20px;
    color: #333;
    font-weight: 400;
  }
  .color-span {
    color: #0C6FFF;
    font-size: 12px;
    width: 100%;
    display: block;
  }
  .tips {
    position: absolute;
    font-size: 12px;
    color: #999;
    width: 400px;
    left: -44px;
    padding: 0;
    margin: 0;
    height: 20px;
    line-height: 20px;
    bottom: -29px;
    background: #fff;
    z-index: 2001;
  }
}
.right-delete {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 20px;
  cursor: pointer;
  color: #9e9e9e;
}
</style>
