
<template>
  <div v-loading="formLoading" class="form-container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="form-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/productManage/planManage' }">计划管理</el-breadcrumb-item>
      <el-breadcrumb-item>计划评审</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="ruleForm" :model="form" :rules="rules" inline label-width="100px">
      <el-form-item label="选题标题" prop="caseName">
        <el-input
          v-model.trim="form.caseName"
          maxlength="30"
          show-word-limit
          style="width: 488px"
          placeholder="请输入选题标题"
        />
      </el-form-item>
      <el-form-item label="选题类别" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">非带货</el-radio>
          <el-radio :label="2">带货</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所属领域" prop="fieldId" style="width: 340px">
        <el-select v-model="form.fieldId" clearable>
          <el-option
            v-for="item in domainList"
            :key="item.domainId"
            :label="item.domainName"
            :value="item.domainId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选题内容" prop="contents" class="contents">
        <div class="ppt-container">
          <div class="ppt-content">
            <el-button
              v-loading="contentLoading"
              icon="el-icon-plus"
              type="primary"
              plain
              class="ppt-btn"
              @click="openPPT"
            >编辑选题内容</el-button>
            <div v-if="contents.length" class="ppt-img">
              <ImagePreviewer
                style="width: 980px; height: 520px;border:1px solid #ccc"
                :src="contents[0]"
                :preview-src-list="contents"
                :scale-width="980"
                :scale-height="520"
              />
              <div>共添加了{{ contents.length }}个内容</div>
            </div>
          </div>
          <!-- <div class="ppt-review">
            <div class="ppt-review__text">
              <span class="ppt-review__label">老师评估结果：</span>
              <div class="ppt-review__status" :style="`background:${statusColor[form.teacherReviewStatus]} ;`" />
              <span class="ppt-review__value">{{ status[form.teacherReviewStatus] }}</span>
            </div>
            <div class="ppt-review__box">
              <span class="ppt-review__label">评语：</span>
              <span class="ppt-review__value">{{ form.teacherComments }}</span>
            </div>
          </div> -->
        </div>
        <div v-if="form.wordString" class="word-content">
          <i class="word-icn" />
          <span>
            <p>{{ form.wordName }}</p>
            <em @click="toViewTheWord">查看</em>
          </span>
        </div>
      </el-form-item>
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
        <span class="tips">注：输入关键词后回车，即增加一个关键词，最多限10个。</span>
        <div v-if="form.keywords.length > 0" class="bq-row">
          <span v-for="item in form.keywords" :key="item" class="bq-row-span">
            {{ item }}
            <i class="el-icon-close" @click="deleteKeyword(item)" />
          </span>
        </div>
      </el-form-item>
      <ppt-modal ref="pptModal" @change="handleChangeContents" />
    </el-form>
    <div class="form-footer">
      <div v-if="productReviewStatus[form.productReviewStatus]" class="form-footer-text">
        <span class="form-footer-label">上次审核状态：</span>
        <span class="form-footer-value">{{ productReviewStatus[form.productReviewStatus] }}</span>
      </div>
      <div class="form-footer-btn">
        <el-button type="primary" @click="handleReview('RETAIN')"> 保留，看下一个 </el-button>
        <el-button @click="handleReview('GIVE_UP')">放弃，看下一个</el-button>
      </div>
    </div>
    <div v-if="html2canvasFlag" class="html2canvas-cls">
      <div v-for="(item,index) in inputArray" :id="'child'+index" :key="index" :style="'background-image:url('+item+'); background-position: 0px '+ (-index*900) +'px; background-repeat: no-repeat; background-size: 1600px'" class="llsdd" />
    </div>
    <div v-if="viewWordFlag" class="word-vide-mask">
      <i class="el-icon-circle-close close-view-word" @click="viewWordFlag = false" />
      <div id="wordView" class="word-view" v-html="vHtml" />
    </div>
  </div>
</template>

<script>
var htmlToImage = require('html-to-image')
import OSS from 'ali-oss'
import { getOssToken } from '@/api/qiniu'
import { teacherQueryByName, getDomainList } from '@/api/tearchCenter/index'
import { caseDetail } from '@/api/product/case'
import { planProductReview, planCaseDetails, planProductCase } from '@/api/product/plan'
import { getTreeLabelById } from '@/utils/index'
import { getTeacherData } from '@/utils/getApiData'
import pptModal from './components/iframePPTModal'
import mammoth from 'mammoth'
export default {
  components: {
    pptModal
  },
  data() {
    return {
      vHtml: '',
      viewWordFlag: false,
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
        caseName: [{ required: true, message: '请输入选题标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择选题类别', trigger: 'change' }],
        fieldId: [{ required: true, message: '请选择所属领域', trigger: 'change' }],
        industryId: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
        demandId: [{ required: true, message: '请选择话题', trigger: 'change' }],
        keywords: [{ message: '请选择选题关键词', type: 'array' }],
        suitableTeachers: [{ required: true, message: '请选择适用老师', trigger: 'change' }],
        contents: [{ required: true, message: '请选择选题内容', type: 'array', trigger: 'change' }]
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
      }
    }
  },
  computed: {
    contents() {
      return this.form.contents || []
    }
  },
  created() {
    this.init()
  },
  methods: {
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
        .then((res) => {
          this.options = res.data.map((v) => {
            return { label: v.teacherName, value: v.teacherId }
          })
        })
        .catch(() => {
          this.options = []
        })
    },
    async init() {
      const query = this.$route.query
      this.options = []
      if (query.id) {
        if (query.isPlan) {
          this.title = '编辑选题'
          const { data } = await planCaseDetails({ planCaseId: query.id })
          this.form = data
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
      const domainList = await getDomainList()
      console.log('ccccccccc: ', domainList)
      this.teacherList = await getTeacherData()
      this.domainList = domainList.data
      // this.tradeList = trade
    },
    getLabelById() {
      const industryName = getTreeLabelById(this.tradeList, this.form.industryId)
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
      const { label } = this.teacherList.find((j) => j.value === this.form.suitableTeachers)
      const suitableTeachers = [{
        teacherId: this.form.suitableTeachers,
        teacherName: label
      }]
      // const { industryName, fieldName } = this.getLabelById()
      const size = this.form.contents.length > 1 ? 2 : 1
      return {
        ...this.form,
        fieldId: undefined, // 隐藏
        industryId: undefined, // 隐藏
        demandId: undefined, // 隐藏
        suitableTeachers,
        // industryName,
        // fieldName,
        size
      }
    },
    getDemandKeyword() {
      const data = this.options.find((i) => i.id === this.form.demandId)
      this.form.demandKeyword = data.keyword
    },
    close() {
      this.$router.back(-1)
    },
    async openPPT() {
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
      const titleName = this.form.caseName
      this.formLoading = false
      this.contentLoading = true
      if (type === 'insert') {
        this.$refs.pptModal.open({ data: this.form.pptString || JSON.stringify([]), type, titleName })
      } else {
        this.$refs.pptModal.open({ data: this.form.pptString || JSON.stringify([]), type })
      }
    },
    toViewTheWord() {
      this.readExcelFromRemoteFile(this.form.wordString)
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
      this.$nextTick(function() {
        for (let j = 0; j < this.inputArray.length; j++) {
          const id = 'child' + j
          var node = document.getElementById(id)
          const that = this
          htmlToImage.toPng(node)
            .then(async function (dataUrl) {
              const blob = that.dataURLtoBlob(dataUrl)
              const file = new File([blob], 'file', {
                type: blob.type,
                lastModified: Date.now()
              })
              const daysTime = new Date()
              const fileName = 'hok_product/pptsite/' + daysTime.getTime() + '.jpg'
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
              if (j === (that.inputArray.length - 1)) {
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
  padding: 20px 20px 0px 20px;
  border-radius: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
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
  .contents{
    flex: 1;
    min-width: 1000px;
    display: flex;
    .el-form-item__content{
      width: 100%;
    }
  }
  .el-form-item{
    margin-bottom: 10px;
  }
  .ppt-container {
    display: flex;
    width: 100%;
    .ppt-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .ppt-img {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        font-size: 12px;
        color: #999999;
      }
      .el-button {
        margin-bottom: 20px;
      }
    }
    .ppt-review {
      height: 400px;
      background: #f2f9ff;
      border-radius: 8px;
      border: 1px dashed #6da8ff;
      margin-left: 50px;
      flex: 1;
      padding: 20px;
      .ppt-review__text{
        align-items: center;
      }
      .ppt-review__text,.ppt-review__box {
        font-size: 14px;
        color: #777777;
        display: flex;

        .ppt-review__label {
          color: #333333;
        }
        .ppt-review__value{
          flex: 1;
        }
        .ppt-review__status {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-right: 5px;
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
    position: absolute;
    width: 96%;
    bottom: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    .form-footer-text {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #333333;
      margin-right:20px ;
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

.word-content {
  width: 100%;
  height: 42px;
  i {
    float: left;
    width: 41px;
    height: 42px;
    background-image: url(../../../assets/image/video/icn_docment.png);
    background-size: 100%;
    margin-right: 10px;
  }
  span {
    display: inline-block;
    p {
      max-width: 300px;
      line-height: 42px;
      margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      float: left;
    }
    em {
      float: left;
      line-height: 42px;
      font-style: normal;
      margin-right: 16px;
      font-size: 14px;
      color: #0C6FFF;
      cursor: pointer;
    }
  }
}

.word-vide-mask {
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  background-color: rgba(0,0,0,0.3);
  .word-view{
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
