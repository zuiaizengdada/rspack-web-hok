<template>
  <formPage title="师资授权" sub-title="授权详情" @click="$router.push('/teacherCenter/teacherAuthorization/list')">
    <div v-loading="loading" class="content">
      <el-form v-if="!loading" label-position="right" label-width="130px">
        <el-form-item prop="name">
          <span slot="label" class="userName">{{ tearchName }}</span>
          <span class="userType">{{ $route.params.id }}</span>
        </el-form-item>
        <div class="tips c_red">
          <span class="c_red">
            注：以下授权书上传为jpg或png格式，图片大小限制10M以内，也可上传pdf文件，大小限制在50M以内。
          </span>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号授权书" prop="name">
              <upload
                ref="upload1"
                style="width: 420px"
                :limit="20"
                @change="(res) => fileChange(res, 'accountAuthorization')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证正反面" prop="name">
              <upload
                ref="upload6"
                style="width: 420px"
                :limit="2"
                @change="(res) => fileChange(res, 'idCardAuthorization')"
              />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司授权书" prop="name">
              <upload
                ref="upload2"
                style="width: 420px"
                :limit="20"
                @change="(res) => fileChange(res, 'companyAuthorization')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="肖像授权书" prop="name">
              <upload
                ref="upload3"
                style="width: 420px"
                :limit="20"
                @change="(res) => fileChange(res, 'portraitAuthorization')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程版权" prop="name">
              <upload
                ref="upload5"
                style="width: 420px"
                :limit="20"
                @change="(res) => fileChange(res, 'courseCopyright')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台身份证验证" prop="name">
              <upload
                ref="upload4"
                style="width: 420px"
                :limit="20"
                @change="(res) => fileChange(res, 'platformAuthorization')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="其他授权" prop="name">
              <upload
                ref="upload7"
                style="width: 420px"
                :limit="10"
                @change="(res) => fileChange(res, 'otherAuthorization')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <el-button size="small" type="primary" @click="save">保存</el-button>
      <el-button size="small" @click="goBack">取消</el-button>
    </div>
  </formPage>
</template>

<script>
import upload from '../components/upload.vue'
import formPage from '../components/formPage'
import { authorizeInfo, authorizeUpdate } from '@/api/tearchCenter'
export default {
  components: {
    upload,
    formPage
  },
  data() {
    return {
      loading: false,
      tearchName: '',
      accountAuthorization: [], // 账号授权书
      companyAuthorization: [], // 公司授权书
      courseCopyright: [], // 课程授权书
      idCardAuthorization: [], // 身份证正反面
      platformAuthorization: [], // 平台身份验证信息
      portraitAuthorization: [], // 肖像授权书
      otherAuthorization: []
    }
  },
  activated() {
    this.getDetail()
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    // 点击返回
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(`/teacherCenter/teacherAuthorization/list`)
      } else {
        this.$router.go(-1)
      }
    },
    fileChange(fileList, key) {
      this[key] = fileList
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

          const accountAuthorization = []
          this.accountAuthorization.map((v) => {
            accountAuthorization.push({
              file: '',
              name: '',
              status: 3,
              authProgress: 100,
              photoUrl: v,
              fileType: '',
              source: null,
              alignUploadShow: false
            })
          })
          this.accountAuthorization = accountAuthorization

          const companyAuthorization = []
          this.companyAuthorization.map((v) => {
            companyAuthorization.push({
              file: '',
              name: '',
              status: 3,
              authProgress: 100,
              photoUrl: v,
              fileType: '',
              source: null,
              alignUploadShow: false
            })
          })
          this.companyAuthorization = companyAuthorization

          const portraitAuthorization = []
          this.portraitAuthorization.map((v) => {
            portraitAuthorization.push({
              file: '',
              name: '',
              status: 3,
              authProgress: 100,
              photoUrl: v,
              fileType: '',
              source: null,
              alignUploadShow: false
            })
          })
          this.portraitAuthorization = portraitAuthorization

          const platformAuthorization = []
          this.platformAuthorization.map((v) => {
            platformAuthorization.push({
              file: '',
              name: '',
              status: 3,
              authProgress: 100,
              photoUrl: v,
              fileType: '',
              source: null,
              alignUploadShow: false
            })
          })
          this.platformAuthorization = platformAuthorization

          const courseCopyright = []
          this.courseCopyright.map((v) => {
            courseCopyright.push({
              file: '',
              name: '',
              status: 3,
              authProgress: 100,
              photoUrl: v,
              fileType: '',
              source: null,
              alignUploadShow: false
            })
          })
          this.courseCopyright = courseCopyright

          const idCardAuthorization = []
          this.idCardAuthorization.map((v) => {
            idCardAuthorization.push({
              file: '',
              name: '',
              status: 3,
              authProgress: 100,
              photoUrl: v,
              fileType: '',
              source: null,
              alignUploadShow: false
            })
          })
          this.idCardAuthorization = idCardAuthorization
          const otherAuthorization = []
          this.otherAuthorization.map((v) => {
            otherAuthorization.push({
              file: '',
              name: '',
              status: 3,
              authProgress: 100,
              photoUrl: v,
              fileType: '',
              source: null,
              alignUploadShow: false
            })
          })
          this.otherAuthorization = otherAuthorization
          this.$nextTick(() => {
            this.$refs.upload1 && this.$refs.upload1.setFileList(accountAuthorization)
            this.$refs.upload2 && this.$refs.upload2.setFileList(companyAuthorization)
            this.$refs.upload3 && this.$refs.upload3.setFileList(portraitAuthorization)
            this.$refs.upload4 && this.$refs.upload4.setFileList(platformAuthorization)
            this.$refs.upload5 && this.$refs.upload5.setFileList(courseCopyright)
            this.$refs.upload6 && this.$refs.upload6.setFileList(idCardAuthorization)
            this.$refs.upload7 && this.$refs.upload7.setFileList(otherAuthorization)
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击保存
    save() {
      if (
        this.$refs.upload1.getUploadFile() ||
        this.$refs.upload2.getUploadFile() ||
        this.$refs.upload3.getUploadFile() ||
        this.$refs.upload4.getUploadFile() ||
        this.$refs.upload5.getUploadFile() ||
        this.$refs.upload6.getUploadFile() ||
        this.$refs.upload7.getUploadFile()
      ) {
        return this.$message.error('还有文件在上传哦~')
      }
      this.loading = true
      const accountAuthorization = []
      if (this.accountAuthorization.length > 0) {
        this.accountAuthorization.map((v) => {
          v.status === 3 && accountAuthorization.push(v.photoUrl)
        })
      }
      const companyAuthorization = []
      if (this.companyAuthorization.length > 0) {
        this.companyAuthorization.map((v) => {
          v.status === 3 && companyAuthorization.push(v.photoUrl)
        })
      }
      const courseCopyright = []
      if (this.courseCopyright.length > 0) {
        this.courseCopyright.map((v) => {
          v.status === 3 && courseCopyright.push(v.photoUrl)
        })
      }
      const idCardAuthorization = []
      if (this.idCardAuthorization.length > 0) {
        this.idCardAuthorization.map((v) => {
          v.status === 3 && idCardAuthorization.push(v.photoUrl)
        })
      }
      const platformAuthorization = []
      if (this.platformAuthorization.length > 0) {
        this.platformAuthorization.map((v) => {
          v.status === 3 && platformAuthorization.push(v.photoUrl)
        })
      }
      const portraitAuthorization = []
      if (this.portraitAuthorization.length > 0) {
        this.portraitAuthorization.map((v) => {
          v.status === 3 && portraitAuthorization.push(v.photoUrl)
        })
      }
      const otherAuthorization = []
      if (this.otherAuthorization.length > 0) {
        this.otherAuthorization.map((v) => {
          v.status === 3 && otherAuthorization.push(v.photoUrl)
        })
      }
      const data = {
        accountAuthorization: accountAuthorization.join(','),
        companyAuthorization: companyAuthorization.join(','),
        courseCopyright: courseCopyright.join(','),
        idCardAuthorization: idCardAuthorization.join(','),
        platformAuthorization: platformAuthorization.join(','),
        portraitAuthorization: portraitAuthorization.join(','),
        otherAuthorization: otherAuthorization.join(','),
        teacherId: this.$route.params.id
      }
      authorizeUpdate(data)
        .then((res) => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.$router.back()
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 19px;
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
.tips {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
  margin-bottom: 32px;
  margin-left: 30px;
}
</style>
