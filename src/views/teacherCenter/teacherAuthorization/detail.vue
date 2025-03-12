<template>
  <formPage
    v-loading="loading"
    title="师资授权"
    sub-title="授权详情"
    @click="$router.push('/teacherCenter/teacherAuthorization/list')"
  >
    <div class="content">
      <el-form label-position="right" label-width="130px">
        <el-form-item prop="name">
          <span slot="label" class="userName">{{ tearchName }}</span>
          <span class="userType">{{ cooperateStatus | getOptionsValue(COOPERATION_TYPE) }}</span>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号授权书" prop="name">
              <div class="imgList">
                <showMore :file-list="accountAuthorization" />
              </div>
              <div v-if="accountAuthorization.length === 0" class="noDate">用户暂未上传图片/文件</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台身份证验证" prop="name">
              <div class="imgList">
                <showMore :file-list="platformAuthorization" />
              </div>
              <div v-if="platformAuthorization.length === 0" class="noDate">用户暂未上传图片/文件</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司授权书" prop="name">
              <div class="imgList">
                <showMore :file-list="companyAuthorization" />
              </div>
              <div v-if="companyAuthorization.length === 0" class="noDate">用户暂未上传图片/文件</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="肖像授权书" prop="name">
              <div class="imgList">
                <showMore :file-list="portraitAuthorization" />
              </div>
              <div v-if="portraitAuthorization.length === 0" class="noDate">用户暂未上传图片/文件</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程版权" prop="name">
              <div class="imgList">
                <showMore :file-list="courseCopyright" />
              </div>
              <div v-if="courseCopyright.length === 0" class="noDate">用户暂未上传图片/文件</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证正反面" prop="name">
              <div class="imgList">
                <showMore :file-list="idCardAuthorization" />
              </div>
              <div v-if="idCardAuthorization.length === 0" class="noDate">用户暂未上传图片/文件</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="其他授权" prop="name">
              <div class="imgList">
                <showMore :file-list="otherAuthorization" />
              </div>
              <div v-if="otherAuthorization.length === 0" class="noDate">用户暂未上传图片/文件</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <el-button
        v-permission="['web:teachAuthorDetail:export', permsList]"
        size="small"
        type="primary"
        @click="exportFile()"
      >一键导出</el-button>
      <el-button size="small" @click="goBack()">返回</el-button>
    </div>

    <!-- 文件导出进度条 -->
    <AppDialog v-model="progressDialog.visible" title="文件导出中，请不要关闭弹框" width="550px" height="auto">
      <div class="progressDialog overflowOuto">
        <div v-if="progressDialog.visible" style="padding: 10px">
          <el-progress :percentage="progressDialog.percentage" />
        </div>
        <div class="fileList">
          <!-- <div v-for="(item, index) in progressDialog.fileList" :key="index" class="fileSpan">
            <span class="fileTitle">{{ item.src }}</span>
            <span class="fileStatusIcon">
              <i
                :style="{color: item.status === 'success' ? '#67c23a' : '#F56C6C'}"
                :class="item.status === 'success' ? 'el-icon-circle-check' : 'el-icon-circle-close'"
              />
            </span>
          </div> -->
        </div>
      </div>
      <div slot="footer" />
    </AppDialog>
  </formPage>
</template>

<script>
import showMore from './showMore.vue'
import formPage from '../components/formPage'
import { authorizeInfo } from '@/api/tearchCenter'
import AppDialog from '@/components/AppDialog'
import { urlExportZip } from '@/utils/zip'
import { getDict } from '@/utils/index'
export default {
  components: {
    formPage,
    AppDialog,
    showMore
  },
  data() {
    return {
      COOPERATION_TYPE: [],
      loading: false,
      tearchName: '',
      cooperateStatus: '', // 合作状态
      accountAuthorization: [], // 账号授权书
      companyAuthorization: [], // 公司授权书
      courseCopyright: [], // 课程授权书
      idCardAuthorization: [], // 身份证正反面
      platformAuthorization: [], // 平台身份验证信息
      portraitAuthorization: [], // 肖像授权书
      otherAuthorization: [],
      progressDialog: {
        visible: false,
        percentage: 0,
        tips: '文件处理中',
        fileList: []
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  activated() {
    this.getDetail()
  },
  async mounted() {
    this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
    this.getDetail()
  },
  methods: {
    // 点击返回
    goBack() {
      // this.$router.back()
      if (window.history.length <= 1) {
        this.$router.push(`/teacherCenter/teacherAuthorization/list`)
      } else {
        this.$router.go(-1)
      }
    },
    // 获取详情数据
    getDetail() {
      this.tearchName = ''
      this.loading = true
      authorizeInfo(this.$route.params.id)
        .then((res) => {
          this.tearchName = res.data.teacherName
          this.cooperateStatus = res.data.cooperateStatus
          res.data.accountAuthorization && (this.accountAuthorization = res.data.accountAuthorization.split(','))
          res.data.companyAuthorization && (this.companyAuthorization = res.data.companyAuthorization.split(','))
          res.data.courseCopyright && (this.courseCopyright = res.data.courseCopyright.split(','))
          res.data.idCardAuthorization && (this.idCardAuthorization = res.data.idCardAuthorization.split(','))
          res.data.platformAuthorization && (this.platformAuthorization = res.data.platformAuthorization.split(','))
          res.data.portraitAuthorization && (this.portraitAuthorization = res.data.portraitAuthorization.split(','))
          res.data.otherAuthorization && (this.otherAuthorization = res.data.otherAuthorization.split(','))
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    exportFile() {
      const arr = []
      this.accountAuthorization.length &&
        this.accountAuthorization.map((v, index) => {
          arr.push({ src: v, name: `${this.tearchName}账号授权书_${index + 1}` })
        })
      this.companyAuthorization.length &&
        this.companyAuthorization.map((v, index) => {
          arr.push({ src: v, name: `${this.tearchName}公司授权书_${index + 1}` })
        })
      this.courseCopyright.length &&
        this.courseCopyright.map((v, index) => {
          arr.push({ src: v, name: `${this.tearchName}课程授权书_${index + 1}` })
        })
      this.idCardAuthorization.length &&
        this.idCardAuthorization.map((v, index) => {
          arr.push({ src: v, name: `${this.tearchName}身份证正反面_${index + 1}` })
        })
      this.platformAuthorization.length &&
        this.platformAuthorization.map((v, index) => {
          arr.push({ src: v, name: `${this.tearchName}平台身份验证信息_${index + 1}` })
        })
      this.portraitAuthorization.length &&
        this.portraitAuthorization.map((v, index) => {
          arr.push({ src: v, name: `${this.tearchName}肖像授权书_${index + 1}` })
        })
      this.otherAuthorization.length &&
        this.otherAuthorization.map((v, index) => {
          arr.push({ src: v, name: `${this.tearchName}其他授权_${index + 1}` })
        })
      if (arr.length === 0) {
        return this.$message.error('无数据可导出')
      }
      this.progressDialog = { visible: true, percentage: 0, tips: '文件处理中', fileList: [] }
      urlExportZip(arr, `${this.tearchName}授权信息`, (file, index, status) => {
        this.progressDialog.fileList.push({ src: file.src, status: status })
        this.progressDialog.percentage = parseInt((this.progressDialog.fileList.length / arr.length) * 100)
      })
        .then(() => {
          this.progressDialog.percentage = 100
          this.progressDialog.visible = false
          this.$notify.success({ title: '提示', message: '导出成功' })
        })
        .catch((err) => {
          console.log(err, '错误')
          this.progressDialog.visible = false
          this.progressDialog = {
            visible: false,
            percentage: 0,
            tips: '导出失败'
          }
          this.$notify.error({ title: '提示', message: '导出失败' })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 19px;
}
.imgList {
  display: flex;
  flex-wrap: wrap;
  width: 420px;
}
.footer {
  margin-top: 58px;
  text-align: center;
}
.userName {
  font-size: 20px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: rgba(51, 51, 51, 0.9);
  line-height: 28px;
  word-wrap: break-word;
}
.userType {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.noDate {
  width: 120px;
  height: 90px;
  border-radius: 4px;
  background: #fbfcfe;
  margin-right: 16px;
  margin-bottom: 16px;
  color: #999999;
  padding: 23px 18px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #999999;
  line-height: 22px;
  text-align: center;
}
.fileList {
  padding: 10px;
  .fileSpan {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #f5f7fa;
    padding: 8px;
    .fileTitle {
      flex: 1 0 0;
      padding-right: 10px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .fileStatusIcon {
      width: 20px;
    }
  }
}
.progressDialog {
  width: 550px;
  max-height: 300px;
}
</style>
