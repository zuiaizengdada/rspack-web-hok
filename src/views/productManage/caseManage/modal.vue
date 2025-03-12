
<template>
  <div v-loading="formLoading" class="form-container">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="form-breadcrumb"
    >
      <el-breadcrumb-item
        :to="{ path: '/productManage/caseManage/index' }"
      >选题管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item v-if="!isReview" label="所属IP" prop="suitableTeachers">
        <el-select
          v-model="form.suitableTeachers"
          clearable
          filterable
          remote
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 488px"
          placeholder="请选择老师"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <span class="tips">老师个数不限</span> -->
      </el-form-item>

      <el-form-item label="所属领域" prop="fieldId">
        <el-select
          v-model="form.fieldId"
          style="width: 300px"
          placeholder="请选择所属领域"
        >
          <el-option
            v-for="item in domainList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选题标题" prop="caseName">
        <div style="display: flex; align-items: center">
          <el-input
            v-model.trim="form.caseName"
            maxlength="50"
            show-word-limit
            style="width: 488px"
            placeholder="请输入选题标题"
          />
          <el-button
            :disabled="
              !form.suitableTeachers || !form.fieldId
            "
            style="margin-left: 4px"
            :loading="caseNameLoading"
            @click="generateCaseName"
          >AI生成</el-button>
        </div>
      </el-form-item>
      <el-form-item label="选题类别" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">非带货</el-radio>
          <el-radio :label="2">带货</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- <el-form-item label="所属行业" prop="industryId">
        <el-cascader
          v-model="form.industryId"
          style="width: 300px"
          placeholder="请选择所属行业"
          :options="tradeList"
          :props="{ emitPath: false }"
          clearable
        />
      </el-form-item> -->
      <el-form-item label="选题内容" prop="contents">
        <div class="ppt-container">
          <div class="ppt-content">
            <el-button
              v-loading="contentLoading"
              type="primary"
              plain
              class="ppt-btn"
              @click="openPPT"
            >在线PPT编辑</el-button>
            <el-button
              type="primary"
              plain
              class="ppt-btn"
              @click="toUploadWord"
            >上传WORD文件</el-button>
            <div v-if="contents.length" class="ppt-img">
              <ImagePreviewer
                class="ppt-image"
                :src="contents[0]"
                :preview-src-list="contents"
                :scale-width="320"
                :scale-height="180"
              />
              共添加了{{ contents.length }}个内容
            </div>
            <div v-if="uploadInfo.name" class="file-block">
              <i class="file-cls-img" />
              <span>
                <p>{{ uploadInfo.name }}</p>
                <em @click="toViewTheWord">查看</em>
                <i @click="deleteUploadFile">删除</i>
              </span>
            </div>
          </div>
          <!-- <div v-if="isReview" class="ppt-review">
            <div class="ppt-review__text">
              <span class="ppt-review__label">老师评估结果：</span>
              <div class="ppt-review__status" :style="`background:${statusColor[form.teacherReviewStatus]} ;`" />
              <span>{{ status[form.teacherReviewStatus] }}</span>
            </div>
            <div class="ppt-review__text">
              <span class="ppt-review__label">评语：</span>
              <span>{{ form.teacherComments }}</span>
            </div>
          </div> -->
        </div>
      </el-form-item>
      <!-- <el-form-item label="选择选题" prop="demandId">
        <el-select
          v-model="form.demandId"
          filterable
          remote
          reserve-keyword
          placeholder="请选择选题"
          style="width: 488px"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="getDemandKeyword"
        >
          <el-option v-for="item in options" :key="item.id" :label="item.keyword" :value="item.id">
            <span>{{ item.keyword }}</span>
            <span style="margin-left: 80px; color: #8492a6; font-size: 13px">{{ item.description }}</span>
          </el-option>
        </el-select>
        <span class="tips">根据选题关键词进行检索，且只能选择其中一个选题。</span>
      </el-form-item> -->
      <el-form-item label="选题关键词" prop="keywords">
        <el-input
          v-model="form.wareKeyword"
          class="width-cls"
          maxlength="10"
          show-word-limit
          style="width: 488px"
          placeholder="请选择选题关键词"
          @change="addKeyWord"
        />
        <span
          class="tips"
        >注：输入关键词后回车，即增加一个关键词，最多限10个。</span>
        <div v-if="form.keywords.length > 0" class="bq-row">
          <span v-for="item in form.keywords" :key="item" class="bq-row-span">
            {{ item }}
            <i class="el-icon-close" @click="deleteKeyword(item)" />
          </span>
        </div>
      </el-form-item>
      <ppt-modal ref="pptModal" @change="handleChangeContents" />
    </el-form>
    <div v-show="!isReview" class="form-footer-btn">
      <el-button
        :disabled="contentLoading"
        type="primary"
        @click="handleSubmit"
      >保存</el-button>
      <el-button
        v-if="type === 'add'"
        :disabled="contentLoading"
        type="primary"
        @click="handleSubmitAndNext"
      >保存并新增下一个</el-button>
      <el-button @click="close">取消</el-button>
    </div>
    <div v-show="isReview" class="form-footer">
      <div
        v-if="productReviewStatus[form.productReviewStatus]"
        class="form-footer-text"
      >
        <span class="form-footer-label">上次审核状态：</span>
        <span class="form-footer-value">{{
          productReviewStatus[form.productReviewStatus]
        }}</span>
      </div>
      <div class="form-footer-btn">
        <el-button type="primary" @click="handleReview('RETAIN')">
          保留，看下一个
        </el-button>
        <el-button @click="handleReview('GIVE_UP')">放弃，看下一个</el-button>
      </div>
    </div>
    <div v-if="html2canvasFlag" class="html2canvas-cls">
      <div
        v-for="(item, index) in inputArray"
        :id="'child' + index"
        :key="index"
        :style="
          'background-image:url(' +
            item +
            '); background-position: 0px ' +
            -index * 900 +
            'px; background-repeat: no-repeat; background-size: 1600px'
        "
        class="llsdd"
      />
    </div>
    <el-dialog
      class="upload-word"
      title="上传文件"
      :close-on-click-modal="false"
      :visible.sync="visibleDialogOssUpload"
      width="820px"
      :before-close="handleClose"
    >
      <el-upload
        ref="rebateUpload"
        class="upload-demo"
        drag
        :limit="1"
        :multiple="false"
        accept=".doc, .docx"
        action="ossBeforeUpload"
        :upload-info="uploadInfo"
        :before-upload="ossBeforeUpload"
        :on-exceed="uploadExceed"
        @success="ossUploadSuccess"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text"><em>点击/拖拽上传文件</em></div>
      </el-upload>
      <span slot="footer" class="dialog-footer" />
    </el-dialog>
    <div v-if="viewWordFlag" class="word-vide-mask">
      <i
        class="el-icon-circle-close close-view-word"
        @click="viewWordFlag = false"
      />
      <div id="wordView" class="word-view" v-html="vHtml" />
    </div>
  </div>
</template>

<script>
var htmlToImage = require('html-to-image')
import OSS from 'ali-oss'
import { mapGetters } from 'vuex'
import { getOssToken } from '@/api/qiniu'
import { teacherQueryByName } from '@/api/tearchCenter/index'
import {
  caseDetail,
  caseAdd,
  caseEdit,
  checkTitle,
  uploadFile,
  findUserOrigin
} from '@/api/product/case'
import {
  planProductReview,
  planCaseDetails,
  planProductEdit,
  planProductCase
} from '@/api/product/plan'
import { getTreeLabelById } from '@/utils/index'
import { getTeacherData } from '@/utils/getApiData'
import { getDomainData } from '@/utils/getApiData'
import pptModal from './components/iframePPTModal'
import mammoth from 'mammoth'
import { getAIContent } from '@/api/aigc'
import { aiBusinessScenePage } from '@/api/aigc/standardIssueConfig'

export default {
  components: {
    pptModal
  },
  data() {
    const validateCaseName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入标题'))
      } else {
        const query = this.$route.query
        console.log('@@@@@@@@@@@@@@@@@@@: ', query.id)
        if (query.id) {
          callback()
        } else {
          const params = {
            name: value
          }
          checkTitle(params).then(res => {
            if (res.data) {
              callback(new Error('标题重复，请修改标题'))
            } else {
              callback()
            }
          })
        }
      }
    }
    const validatePPTOrWord = (rule, value, callback) => {
      if (
        (value && value.length > 0) ||
        (this.uploadInfo && Object.keys(this.uploadInfo).length !== 0)
      ) {
        callback()
      } else {
        callback(new Error('请添加PPT内容或者上传WORD文件内容'))
      }
    }
    return {
      vHtml: '',
      viewWordFlag: false,
      userForPPTObj: {
        userName: '',
        partName: ''
      },
      uploadInfo: {},
      visibleDialogOssUpload: false,
      contentLoading: false,
      oss: {},
      html2canvasFlag: false,
      inputArray: [],
      title: '新增选题',
      form: {
        caseName: '',
        type: 1,
        fieldName: '',
        fieldId: '',
        industryId: '',
        industryName: '',
        contents: [],
        content: '',
        size: 1,
        demandId: '',
        keywords: [],
        suitableTeachers: '',
        pptString: undefined,
        demandKeyword: '',
        wareKeyword: ''
      },
      productReviewStatus: {
        RETAIN: '审核保留',
        GIVE_UP: '审核放弃'
      },
      domainList: [],
      tradeList: [],
      teacherList: [],
      options: [],
      type: 'add',
      isReview: false,
      formLoading: false,
      loading: false,
      pageSize: 1,
      pageIndex: 1,
      isLast: false,
      rules: {
        caseName: [
          { required: true, validator: validateCaseName, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择选题类别', trigger: 'change' }
        ],
        fieldId: [
          { required: true, message: '请选择所属领域', trigger: 'change' }
        ],
        industryId: [
          { required: true, message: '请选择所属行业', trigger: 'change' }
        ],
        demandId: [
          { required: true, message: '请选择选题', trigger: 'change' }
        ],
        keywords: [{ message: '请选择选题关键词', type: 'array' }],
        suitableTeachers: [
          { required: true, message: '请选择所属IP', trigger: 'change' }
        ],
        contents: [
          { required: true, validator: validatePPTOrWord, trigger: 'change' }
        ]
      },
      status: {
        WAIT: '',
        RETAIN: '保留',
        GIVE_UP: '放弃'
      },
      statusColor: {
        RETAIN: '#00b42a',
        GIVE_UP: '#F53F3F',
        WAIT: ''
      },
      ruleTmpList: [],
      caseNameLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    contents() {
      return this.form.contents || []
    }
  },
  created() {
    this.init()
    this.loadUserInfoData()
  },
  methods: {
    generateCaseName(e) {
      e.preventDefault()
      this.$uweb && this.$uweb.setAction('Event_click_btn_generate_selected_topic_title')
      this.caseNameLoading = true
      const teacher = this.options.find(
        item => item.value === this.form.suitableTeachers
      )
      const domain = this.domainList.find(
        item => item.value === this.form.fieldId
      )
      let rTmp = this.ruleTmpList.find(item => item.id === '2').prompt
      rTmp = rTmp.replace('${TeacherName', teacher.label)
      rTmp = rTmp.replace('}', '')
      rTmp = rTmp.replace('${AreaName', domain.label)
      rTmp = rTmp.replace('}', '')
      getAIContent({ action: 'generation', question: rTmp })
        .then(res => {
          this.caseNameLoading = false
          this.form.caseName = res.answer
        })
        .catch(() => {
          this.caseNameLoading = false
        })
    },
    loadUserInfoData() {
      findUserOrigin(this.userInfo.userId).then(res => {
        this.userForPPTObj.userName = this.userInfo.nickName
        this.userForPPTObj.partName = res.data.deptName
      })
    },
    toViewTheWord() {
      this.readExcelFromRemoteFile(this.uploadInfo.url)
      this.viewWordFlag = true
    },
    readExcelFromRemoteFile: function (url) {
      var vm = this
      var xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function () {
        if (xhr.status === 200) {
          mammoth
            .convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) })
            .then(function (resultObject) {
              vm.$nextTick(() => {
                // document.querySelector("#wordView").innerHTML =
                //   resultObject.value;
                vm.vHtml = resultObject.value
              })
            })
        }
      }
      xhr.send()
    },
    deleteUploadFile() {
      this.uploadInfo = {}
      if (this.$refs['rebateUpload']) {
        this.$refs['rebateUpload'].clearFiles() // 清除文件
      }
    },
    ossUploadSuccess(data) {
      console.log('ddddddddddsssssssssssssss:', data)
    },
    uploadExceed(files, fileList) {
      const isLt60G = files[0].size / 1024 / 1024 < 15
      if (!isLt60G) {
        this.$message.error('上传文件大小不能超过 15M!')
        return
      }
      const testmsg = files[0].name.substring(
        files[0].name.lastIndexOf('.') + 1
      )
      if (testmsg !== 'doc' && testmsg !== 'docx') {
        this.$message.error('请上传word文件')
        return
      }
      this.$set(fileList[0], 'raw', files[0])
      this.$set(fileList[0], 'name', files[0].name)
      console.log('fukessssss: ', files[0])
      this.$refs['rebateUpload'].clearFiles() // 清除文件
      this.$refs['rebateUpload'].handleStart(files[0]) // 选择文件后的赋值方法
      var formData = new FormData()
      formData.append('file', files[0])
      this.uploadInfo.name = files[0].name
      uploadFile(formData).then(res => {
        console.log('rrrrrrrrr:', res)
        this.uploadInfo.url = res.data.url
        this.$message.success('文件上传成功')
        this.$refs.ruleForm.validateField('contents')
      })
    },
    ossBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        // const GIGABYTE = Math.pow(1, 3)
        // const MAX_SIZE = 15 * GIGABYTE
        const isLt60G = file.size / 1024 / 1024 < 15
        if (!isLt60G) {
          this.$message.error('上传文件大小不能超过 15M!')
          reject()
        }
        const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        if (testmsg !== 'doc' && testmsg !== 'docx') {
          reject()
          this.$message.error('请上传word文档！')
          return
        }
        console.log('sssssss:', file)
        this.uploadInfo.name = file.name
        var formData = new FormData()
        formData.append('file', file)
        uploadFile(formData).then(res => {
          console.log('rrrrrrrrr:', res)
          this.uploadInfo.url = res.data.url
          this.$message.success('文件上传成功')
          this.$refs.ruleForm.validateField('contents')
        })
        /* file.type.includes('video') || file.type.includes('audio') ? this.getFileAVDes(file) : ''
        file.type.includes('image') ? this.getFileImg(file) : ''
        !file.type.includes('video') && !file.type.includes('audio') && !file.type.includes('image') ? this.getFileDes(file) : ''
        if (this.coverStatus) {
          const filePath = file.name // 文件路径
          const index = filePath.lastIndexOf('.') // 获取最后一个.的位置
          const documentName = filePath.substr(0, index)
          const params = {
            documentName,
            id: this.selectCatalog.id
          }
          this.checkFile(
            params,
            function (res) {
              if (res) {
                reject(isLt60G && !res)
              } else {
                resolve(isLt60G && !res)
              }
            },
            file
          )
        } else {
          this.coverStatus = true
          resolve(isLt60G)
        }*/
      })
      // 返回false不会自动上传
    },
    toUploadWord() {
      this.visibleDialogOssUpload = true
    },
    handleClose() {
      this.visibleDialogOssUpload = false
    },
    async initOssToken() {
      const { data } = await getOssToken()
      this.oss = data
    },
    remoteMethod(queryString) {
      if (!queryString) {
        return
      }
      const params = {
        name: queryString
      }
      teacherQueryByName(params)
        .then(res => {
          this.options = res.data.map(v => {
            return { label: v.teacherName, value: v.teacherId }
          })
        })
        .catch(() => {
          this.options = []
        })
    },
    async init() {
      const query = this.$route.query
      const res = await aiBusinessScenePage({
        pageIndex: 1,
        pageSize: 1000
      })
      this.ruleTmpList = res.data.items
      this.options = []
      if (query.id) {
        if (query.isPlan) {
          this.title = '编辑选题'
          const { data } = await planCaseDetails({ planCaseId: query.id })
          this.form = data
          if (this.form.wordString) {
            this.uploadInfo.name = this.form.wordName
            this.uploadInfo.url = this.form.wordString
          }
        } else if (query.isReview) {
          this.title = '评审选题'
          const params = {
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            planId: query.id
          }
          const { data } = await planProductCase(params)
          this.form = data.items[0]
          this.isLast = data.isLast
          this.isReview = true
        } else {
          this.title = '编辑选题'
          const { data } = await caseDetail({ caseId: query.id })
          this.form = data
          if (this.form.wordString) {
            this.uploadInfo.name = this.form.wordName
            this.uploadInfo.url = this.form.wordString
          }
        }
      }
      this.remoteMethod(this.form.suitableTeachers[0]?.teacherName)
      this.form.suitableTeachers = this.form.suitableTeachers[0]?.teacherId

      this.visible = true
      this.type = query.id ? 'edit' : 'add'
      this.getTradeDomianList()
    },
    addKeyWord() {
      if (this.form.keywords.length < 10) {
        const keyword = [...this.form.keywords, this.form.wareKeyword]
        this.form.keywords = [...new Set(keyword)]
        this.form.wareKeyword = ''
      } else {
        this.$message.error('选题关键词添加不能超过10个')
        return false
      }
    },
    deleteKeyword(item) {
      var index = this.form.keywords.indexOf(item)
      if (index !== -1) {
        this.form.keywords.splice(index, 1)
      }
    },
    async getTradeDomianList() {
      // const trade = await getTradeData()
      const domainList = await getDomainData()
      this.teacherList = await getTeacherData()
      this.domainList = domainList
      // this.tradeList = trade
    },
    getLabelById() {
      const industryName = getTreeLabelById(
        this.tradeList,
        this.form.industryId
      )
      const fieldName = getTreeLabelById(this.domainList, this.form.fieldId)
      return {
        industryName,
        fieldName
      }
    },
    reset() {
      this.form = {
        caseName: '',
        type: 1,
        fieldName: '',
        fieldId: '',
        industryId: '',
        industryName: '',
        contents: [],
        content: '',
        size: 1,
        demandId: '',
        keywords: [],
        suitableTeachers: '',
        pptString: '',
        demandKeyword: '',
        wareKeyword: ''
      }
    },
    getParams() {
      const { label } = this.teacherList.find(
        j => j.value === this.form.suitableTeachers
      )
      const suitableTeachers = [
        {
          teacherId: this.form.suitableTeachers,
          teacherName: label
        }
      ]
      const fieldNamed = getTreeLabelById(this.domainList, this.form.fieldId)
      // const { industryName, fieldName } = this.getLabelById()
      const size = this.form.contents.length > 1 ? 2 : 1
      return {
        ...this.form,
        industryId: undefined, // 隐藏
        demandId: undefined, // 隐藏
        suitableTeachers,
        wordString: this.uploadInfo.url,
        wordName: this.uploadInfo.name,
        // industryName,
        fieldName: fieldNamed,
        size
      }
    },
    getDemandKeyword() {
      const data = this.options.find(i => i.id === this.form.demandId)
      this.form.demandKeyword = data.keyword
    },
    close() {
      this.$router.back(-1)
    },
    async add() {
      const params = this.getParams()
      const { code } = await caseAdd(params)
      if (code === 1) {
        this.$notify.success('新增成功')
        this.$router.back(-1)
      }
    },
    async edit() {
      const params = this.getParams()
      const query = this.$route.query
      let code = null
      if (query.isPlan) {
        const res = await planProductEdit({
          ...params,
          planCaseId: this.$route.query.id
        })
        code = res.code
      } else {
        console.log('dsfd;: ', this.uploadInfo)
        this.uploadInfo.url &&
          (this.uploadInfo.wordString = this.uploadInfo.url)
        if (this.uploadInfo.wordString === undefined) {
          params.wordName = ''
          params.wordString = ''
        }
        const res = await caseEdit(params)
        code = res.code
      }
      if (code === 1) {
        this.$notify.success('保存成功')
        this.$router.back(-1)
      }
    },
    handleSubmitAndNext() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const params = this.getParams()
          const { code } = await caseAdd(params)
          if (code === 1) {
            this.$notify.success('新增成功')
            if (this.$refs['rebateUpload']) {
              this.$refs['rebateUpload'].clearFiles()
            }
            this.uploadInfo = {}
            this.form = {
              caseName: '',
              type: 1,
              fieldName: '',
              fieldId: this.form.fieldId,
              industryId: '',
              industryName: '',
              contents: [],
              content: '',
              size: 1,
              demandId: '',
              keywords: this.form.keywords,
              suitableTeachers: this.form.suitableTeachers,
              pptString: '',
              demandKeyword: '',
              wareKeyword: ''
            }
          }
        } else {
          return false
        }
      })
    },
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.type === 'add') {
            this.add()
          } else {
            this.edit()
          }
        } else {
          return false
        }
      })
    },
    async openPPT() {
      this.loadUserInfoData()
      const query = this.$route.query
      this.formLoading = true
      if (!this.form.pptString) {
        if (query.isPlan || query.isReview) {
          console.log(this.type)
        } else {
          if (this.type === 'edit') {
            const res = await caseDetail({ caseId: query.id, pptString: true })
            this.form.pptString = res?.data?.pptString || JSON.stringify([])
          }
        }
      }
      const type = this.form.pptString ? 'edit' : 'insert'
      const userForppt = this.userForPPTObj
      console.log('before: ::::::  : ', this.userForPPTObj)
      const titleName = this.form.caseName
      this.formLoading = false
      this.contentLoading = true
      if (type === 'insert') {
        this.$refs.pptModal.open({
          data: this.form.pptString || JSON.stringify([]),
          type,
          titleName,
          userForppt
        })
      } else {
        this.$refs.pptModal.open({
          data: this.form.pptString || JSON.stringify([]),
          type,
          titleName,
          userForppt
        })
      }
    },
    dataURLtoBlob(dataURI) {
      const byteString = atob(dataURI.split(',')[1])
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], { type: mimeString })
    },
    handleChangeContents(data) {
      if (data === 'close') {
        this.contentLoading = false
        return
      }
      this.form.pptString = ''
      this.form.contents = []
      const objData = JSON.parse(data)
      this.form.pptString = JSON.stringify(objData.data)
      this.html2canvasFlag = true
      this.inputArray = []
      for (let i = 0; i < objData.imgNums; i++) {
        this.inputArray.push(objData.imgSrc)
      }
      this.initOssToken()
      this.$nextTick(function () {
        for (let j = 0; j < this.inputArray.length; j++) {
          const id = 'child' + j
          var node = document.getElementById(id)
          const that = this
          htmlToImage
            .toPng(node)
            .then(async function (dataUrl) {
              const blob = that.dataURLtoBlob(dataUrl)
              const file = new File([blob], 'file', {
                type: blob.type,
                lastModified: Date.now()
              })
              const daysTime = new Date()
              const fileName =
                'hok_product/pptsite/' + daysTime.getTime() + '.jpg'
              const oss = new OSS({
                region: 'oss-accelerate',
                accessKeyId: that.oss.accessKeyId,
                accessKeySecret: that.oss.accessKeySecret,
                bucket: that.oss.ossBucket,
                secure: true
              })
              await oss.multipartUpload(fileName, file, {})
              const imgSrc = `${that.oss.ossBucketUrl}${fileName}`
              console.log('sss~~~~~~~~~~~~~~~~~~~:', imgSrc)
              that.form.contents.push(imgSrc)
              that.$refs.ruleForm.validateField('contents')
              if (j === that.inputArray.length - 1) {
                // eslint-disable-next-line require-atomic-updates
                that.contentLoading = false
              }
            })
            .catch(function (error) {
              console.error('oops, something went wrong!', error)
            })
        }
      })
      // this.form.contents = data?.map((i) => i.imgSrc)
    },
    async handleReview(status) {
      const { code } = await planProductReview({
        productReviewStatus: status,
        caseName: this.form.caseName,
        contents: this.form.contents,
        demandId: this.form.demandId,
        demandKeyword: this.form.demandKeyword,
        fieldId: this.form.fieldId,
        fieldName: this.form.fieldName,
        industryId: this.form.industryId,
        industryName: this.form.industryName,
        pptString: this.form.pptString,
        wordName: this.form.wordName,
        wordString: this.form.wordString,
        keywords: this.form.keywords,
        planCaseId: this.form.planCaseId,
        size: this.form.size,
        type: this.form.type
      })
      const query = this.$route.query
      if (code === 1) {
        if (this.isLast) {
          this.$alert('该计划下所有选题已评审，点击确定返回计划管理', '提示', {
            confirmButtonText: '确定',
            callback: () => {
              this.$router.push('/productManage/planManage/index')
            }
          })
          return
        }
        this.pageIndex += 1
        const params = {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          planId: query.id
        }
        const { data } = await planProductCase(params)
        this.form = data.items[0]
        this.isLast = data.isLast
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container ::v-deep {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .ppt-image {
    width: 320px;
    height: 180px;
    border: 1px solid #ccc;
    margin-right: 10px;
  }
  .form-breadcrumb {
    .el-breadcrumb__inner,
    .el-breadcrumb__inner a {
      font-weight: 800 !important;
    }
    .el-breadcrumb__inner.is-link {
      color: #777777;
    }
    .el-breadcrumb__inner {
      color: #333;
    }
    margin-bottom: 40px;
    font-size: 16px;
  }
  .el-form {
    overflow: auto;
  }
  .bq-row {
    width: 830px;
    padding: 15px 10px;
    margin-top: 10px;
    border: 1px dashed #979797;
    border-radius: 6px;
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
  .width-cls {
    width: 300px;
  }
  .ppt-btn.el-button.el-button--primary {
    background: #fff;
  }
  .el-button--primary.is-plain:hover,
  .el-button--primary.is-plain:focus {
    background: #1890ff;
    border-color: #1890ff;
    color: #ffffff;
  }
  .el-icon-plus {
    font-weight: 900;
  }
  .el-tag.el-tag--info {
    background-color: #e7f0ff;
    border-color: #dae9ff;
    color: #0c6fff;
  }
  .el-select .el-tag__close.el-icon-close {
    background-color: #e7f0ff;
    color: #3c8bff;
    font-size: 16px;
  }
  .form-editor {
    display: flex;
    align-items: flex-end;
    i {
      font-size: 24px;
      color: #f43c4a;
      margin-left: 16px;
      cursor: pointer;
    }
  }
  .tips {
    color: #999999;
    font-size: 12px;
    margin-left: 18px;
  }
  .form-editor__btn {
    display: flex;
    justify-content: flex-end;
    width: 700px;
    margin-top: 16px;
  }
  .ppt-container {
    display: flex;
    .ppt-content {
      width: 500px;
      .el-button {
        float: left;
        margin-bottom: 20px;
        margin-right: 5px;
      }
    }
    .ppt-review {
      height: 228px;
      background: #f2f9ff;
      border-radius: 8px;
      border: 1px dashed #6da8ff;
      margin-left: 50px;
      flex: 1;
      padding: 20px;
      .ppt-review__text {
        font-size: 14px;
        color: #777777;
        display: flex;
        align-items: center;
        .ppt-review__label {
          color: #333333;
        }
        .ppt-review__status {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
      }
    }
  }
  .form-footer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
  }
  .form-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .form-footer-text {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #333333;
      .form-footer-label {
        color: #777777;
        font-size: 16px;
      }
    }
  }
}
.html2canvas-cls {
  width: 1600px;
  height: 1200px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  .llsdd {
    width: 1600px;
    height: 900px;
  }
}

::v-deep .el-dialog__wrapper {
  display: flex;
  padding: 24px;
  .el-dialog {
    border-radius: 10px;
    margin: auto !important;
    .el-dialog__header {
      border-bottom: 1px solid #ececec;
      .el-dialog__title {
        font-weight: bold;
        font-size: 16px;
      }
    }
    .el-dialog__footer {
      display: none;
    }
  }
}

::v-deep .el-upload {
  width: 100%;
}
::v-deep .el-upload-dragger {
  width: 100% !important;
  background: #fbfcfe;
}

::v-deep .el-upload-list__item {
  padding: 20px;
  border: 1px solid #eff2f6;
}

.file-block {
  float: left;
  width: 100%;
  height: 50px;
  .file-cls-img {
    float: left;
    width: 41px;
    height: 42px;
    background-image: url(../../../assets/image/video/icn_docment.png);
    background-size: 100%;
    margin-right: 10px;
  }
  span {
    float: left;
    line-height: 42px;
    p {
      float: left;
      width: 200px;
      font-size: 14px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 16px;
    }
    em {
      font-style: normal;
      margin-right: 16px;
      font-size: 14px;
      color: #0c6fff;
      cursor: pointer;
    }
    i {
      font-style: normal;
      color: #f53f3f;
      font-size: 14px;
      cursor: pointer;
    }
  }
}

.word-vide-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.3);
  .word-view {
    position: absolute;
    left: 30%;
    top: 2%;
    width: 40%;
    height: 96%;
    padding: 20px;
    background: #fff;
    overflow-y: auto;
  }
  .close-view-word {
    position: absolute;
    font-size: 24px;
    top: 3%;
    left: 68%;
    width: 28px;
    height: 28px;
    cursor: pointer;
    z-index: 999999;
  }
}
</style>
