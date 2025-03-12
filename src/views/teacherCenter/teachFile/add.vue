<template>
  <!-- 新增师资 -->
  <formPage v-loading="loading" title="IP档案" sub-title="新增IP" @click="handleHomePage">
    <div class="content">
      <el-form ref="ruleForm" label-width="110px" :model="form" :rules="rules">
        <el-form-item label="IP姓名" prop="name">
          <!-- <el-input v-model="form.name" size="small" maxlength="10" class="w-200" :disabled="nameDisabled" /> -->
          <!-- <SelectTeacherName v-model="form.name" @search="handleSearchTeacherName" /> -->
          <el-input
            v-model="form.name"
            size="small"
            maxlength="10"
            class="w-200"
            show-word-limit
            @blur="getAllLikeTeacher"
          />
          <div class="tips m-t-8">注：请填写真实姓名，10字内</div>
        </el-form-item>
        <el-form-item v-if="likeTeacher.length" label="">
          <div class="like" style="max-width: 1440px">
            <div class="tips1">根据您的输入，在已有师资中找到类似师资，如下：</div>
            <div v-infinite-scroll="loadAllLikeTeacher" class=" flex flex-wrap">
              <div
                v-for="item in likeTeacher"
                :key="item.teacherId"
                class="like-teacher-item"
                @click="handleToDetail(item)"
              >
                <div>
                  <div class="like-photoUrl"><img :src="item.photoUrl" alt="" class="like-photoUrl" /></div>
                  <div class="like-teacherName live-teacherName1">{{ item.teacherName }}- {{ item.orgName }}</div>
                  <div class="like-teacherName">{{ getOptionsValue(item.cooperateStatus, COOPERATION_TYPE) }}</div>
                  <div class="like-teacherName">
                    <span v-if="item.assessStatus === 3">{{ (+item.assessResult / 100) + '分' }} </span>
                    <span v-else-if="item.assessStatus === 4">{{ getOptionsValue(+item.assessResult, ASSESS_RESULT_OTHER)
                    }} </span>
                    <span v-if="[3, 4].includes(item.assessStatus) && [1, 2, 3].includes(item.assessStatus)"> - </span>
                    <span v-if="[1, 2, 3].includes(item.assessStatus)"> {{ getOptionsValue(item.assessStatus,
                                                                                           ASSESS_TYPES) }}</span>
                  </div>
                  <div class="like-teacherName">支持做的次数：{{ item.sustainNum }}</div>
                  <div class="like-teacherName">创建人:{{ item.createUserName }} </div>
                  <div class="like-teacherName">创建时间:{{ parseTime(new Date(item.createTime).getTime(), '{y}-{m}-{d}
                  {h}:{i}') }} </div>
                  <div v-if="item.openSeaPool || item.followUpPool" class="like-teacherName">{{ item.openSeaPool ? '公海池'
                    : '跟进池' }}</div>
                </div>
                <div v-if="item.cooperateStatus===9" class="like-black">黑名单</div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="IP照片" prop="photoUrl">
          <template>
            <template v-if="!form.photoUrl">
              <el-upload
                ref="refUpload"
                action="#"
                :limit="1"
                accept="image/png,image/jpg,image/jpeg"
                :http-request="getImgUrl"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
              >
                <div style="width: 118px; height: 135px">
                  <div v-if="imgUploadObj.status === 0" class="image_poster">
                    <i class="el-icon-plus addimag_icon" />
                    <span>点击上传图片</span>
                  </div>
                  <div v-else-if="imgUploadObj.status === 1">
                    <div>图片上传中...</div>
                    <el-progress :show-text="false" :percentage="imgUploadObj.authProgress" />
                  </div>
                  <div
                    v-else-if="imgUploadObj.status === 2"
                    class="image_poster"
                    @mouseenter="alignUploadShow = true"
                    @mouseleave="alignUploadShow = false"
                  >
                    <i class="el-icon-error" style="color: #f53f3f; font-size: 24px" />
                    <div class="addimag_icon_error">上传失败</div>
                    <transition name="slide">
                      <div v-if="alignUploadShow" class="alignUploadShow">
                        <svg-icon icon-class="alignUploadShow" class="alignUploadIcon" />
                        <div>重新上传</div>
                      </div>
                    </transition>
                  </div>
                  <div v-else class="image_poster">
                    <i class="el-icon-plus addimag_icon" />
                    <span>点击上传图片</span>
                  </div>
                </div>
              </el-upload>
            </template>
            <template v-else>
              <AppMyImage
                :src="form.photoUrl"
                style="width: 118px; height: 135px"
                :options="{
                  width: 750,
                  fixed: true,
                  option: {
                    fixed: true,
                    fixedNumber: [7, 8],
                    fixedBox: false
                  }
                }"
                @close="delImage()"
                @success="res => changeImage(res)"
              />
            </template>
            <div class="tips m-t-20">
              <div>注：图片只可上传JPG或者PNG格式，大小限5M以下。</div>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="所属领域" prop="domains">
          <el-checkbox-group v-model="form.domains" style="width: 700px">
            <el-checkbox
              v-for="item in areaOption"
              :key="item.domainId"
              :label="item.domainId"
              :disabled="!form.domains.includes(item.domainId) &&
                form.domains.length >= 3
              "
            >
              {{ item.domainName }}
            </el-checkbox>
          </el-checkbox-group>
          <div class="tips">注：所属领域最多可选3个</div>
        </el-form-item>
        <el-form-item label="IP资质" prop="experience">
          <div class="fl">
            <el-input
              v-model="form.experience"
              style="width: 488px"
              type="textarea"
              maxlength="500"
              show-word-limit
              :autosize="{ minRows: 3 }"
              placeholder="请输入IP资质"
            />
            <div class="tips m-l-16">
              <div>示例:</div>
              <div>商业模式专家</div>
              <div>博商企业利润增长训练战营特聘导师</div>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="服务企业" prop="serviceEnterprise">
          <div class="fl">
            <el-input
              v-model="form.serviceEnterprise"
              style="width: 488px"
              type="textarea"
              maxlength="500"
              show-word-limit
              :autosize="{ minRows: 3 }"
              placeholder="请输入IP服务过的企业和品牌"
            />
            <div class="tips m-l-16">
              <div>示例:</div>
              <div>平安集团、友邦保险、上海市公安系统、虹口区妇联等</div>
              <div>腾讯、小米、三星、滴滴、JD等300多家头部企业及创业公司</div>
            </div>
          </div>
        </el-form-item> -->
        <!-- <el-form-item label="过往课题">
          <div class="fl">
            <el-input
              v-model="form.courseware"
              style="width: 488px"
              type="textarea"
              maxlength="500"
              show-word-limit
              :autosize="{ minRows: 3 }"
              placeholder="请输入IP曾经的课题，例：《熊猫罗盘》十大营销方法论"
            />
            <div class="tips m-l-16">
              <div>示例:</div>
              <div>《快速提升决策 洞察本质问题》</div>
              <div>《教练式领导力 成为职场沟通高手》</div>
            </div>
          </div>
        </el-form-item> -->
        <el-form-item label="评估视频">
          <videoUpload style="width: 660px" :limit="20" accept="video/mp4" @change="fileChange" />
          <div v-if="videoUrls.length === 0" class="tips">
            注：大小限20G以内，格式为mp4
          </div>
          <!-- <div style="margin-bottom: 16px">
            <el-button size="small" type="primary" @click="save2Link">保存并寻找视频</el-button>
          </div> -->
          <el-form-item
            v-for="(item, index) in form.linkUrls"
            :key="index"
            style="margin-bottom: 16px"
            :prop="'linkUrls.' + index + '.url'"
            :rules="{
              validator: validateUrl,
              trigger: 'blur'
            }"
          >
            <el-input
              v-model.trim="item.url"
              type="text"
              class="m-r-8"
              style="width: 600px"
              size="small"
              placeholder="请输入视频地址"
            />
            <el-button v-if="form.linkUrls.length < 20" icon="el-icon-plus" size="small" @click="addlinkUrls" />
            <el-button
              v-if="form.linkUrls.length !== 1"
              icon="el-icon-minus"
              size="small"
              @click="delLinkUrls(index)"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="主页链接" prop="homepageLink">
          <el-input v-model.trim="form.homepageLink" type="text" class="w-500" size="small" placeholder="请输入主页链接" />
        </el-form-item>
        <el-form-item label="是否需要评估" prop="assessFlag">
          <el-select v-model="form.assessFlag" class="text-color w-300" clearable placeholder="请谨慎选择，一旦生成档案将不可修改！">
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
          <span
            class="text-tips"
          >注：该字段一旦生成评估记录后不能再进行修改</span>
        </el-form-item>

        <el-form-item v-if="form.assessFlag === 1" label="参与评估人员" prop="assessUsers">
          <el-select v-model="groupId" class="w-300 m-b-20" clearable placeholder="选择分组" @change="handleGroupList">
            <el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.id" />
          </el-select>
          <div :class="{ assessBox: form.assessUsers.length > 0 }">
            <el-tag
              v-for="(tag, index) in form.assessUsers"
              :key="tag.userId"
              class="assessUsersView"
              closable
              @close="delAssessUsers(tag, index)"
            >{{ tag.userName }}</el-tag>
            <el-button size="mini" class="assessUsersView" @click="selectUser"><i
              class="el-icon-plus el-icon--left"
            />添加评估人员</el-button>
          </div>
          <div v-if="form.assessUsers.length > 0" class="tips m-t-8">
            已选{{ form.assessUsers.length }}人
          </div>
        </el-form-item>
        <el-form-item v-if="form.assessFlag === 1" label="评估截止时间" prop="expiresDate">
          <el-date-picker
            v-model="form.expiresDate"
            size="small"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            default-time="23:59:00"
          />
          <div class="tips">填写时间后，即通过通知对应的参与评估人员。</div>
        </el-form-item>
        <el-form-item v-if="form.assessFlag === 0" label="无需评估结果" prop="assessResult">
          <el-select v-model="form.assessResult" style="width: 300px" clearable placeholder="请选择无需评估结果">
            <el-option v-for="item in ASSESS_RESULT" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="IP推荐人">
          <el-input
            v-model="form.recommendName"
            type="text"
            maxlength="10"
            show-word-limit
            class="w-200"
            size="small"
            placeholder="请输入IP推荐人"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <!-- <el-button
        v-if="!isDraft"
        :loading="loading"
        size="small"
        type="primary"
        @click="validateForm"
      >保存</el-button> -->
      <!-- <template v-else> -->
      <el-button :loading="loading" size="small" type="primary" @click="saveDraft">保存为草稿</el-button>
      <el-button :loading="loading" size="small" type="primary" @click="validateForm">保存并生成档案</el-button>
      <!-- </template> -->
      <el-button :loading="loading" size="small" @click="goBack()">取消</el-button>
    </div>
  </formPage>
</template>

<script>
import formPage from '../components/formPage'
import { mapGetters } from 'vuex'
import { uploadImg } from '@/api/file'
import AppMyImage from '@/components/AppMyImage'
// import SelectTeacherName from '@/components/SelectTeacherName'
import axios from 'axios'
import {
  teacherAdd,
  teacherDraftAdd,
  getGroupNameList,
  getGroupDetail,
  searchTeacherNew,
  getCountByTeacherName
} from '@/api/tearchCenter/index'
import moment from 'moment'
import videoUpload from '../components/uploadVideo/index'
import { ASSESS_TYPES, COOPERATION_TYPE, ASSESS_RESULT_OTHER } from '../enum'
import { getOptionsValue } from '@/filters'
import { parseTime } from '@/utils/index'
export default {
  components: {
    formPage,
    AppMyImage,
    videoUpload
  },
  data() {
    var checkAssessUsers = (rule, value, callback) => {
      if (!this.form.assessUsers.length) {
        return callback(new Error('请选择评估人员!'))
      } else {
        return callback()
      }
    }
    var checkExpiresDate = (rule, value, callback) => {
      const date = new Date(value).getTime()
      const nowDate = new Date().getTime()
      if (this.canChange) {
        return callback()
      }
      if (value && date <= nowDate) {
        return callback('评估时间需大于当前时间')
      } else if (!value) {
        return callback(new Error('请选择评估时间!'))
      } else {
        return callback()
      }
    }
    const reg = /(http|https):\/\/([\w.]+\/?)\S*/i
    // const reg = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
    const validateUrl = (rule, value, callback) => {
      if (value === '') {
        return callback()
      } else if (!reg.test(value)) {
        callback('请输入正确的网址')
      } else {
        return callback()
      }
    }
    const checkLink = (rule, value, callback) => {
      if (value === '') {
        return callback()
      } else if (!reg.test(value)) {
        callback('请输入正确的网址')
      } else {
        return callback()
      }
    }
    return {
      ASSESS_RESULT_OTHER,
      ASSESS_TYPES,
      COOPERATION_TYPE,
      parseTime,
      form: {
        linkUrls: [{ type: 2, url: '' }], // 网址数组
        name: '', // IP姓名
        photoUrl: '', // IP照片
        domains: [], // 所属领域
        experience: '', // IP资质
        serviceEnterprise: '', // 服务企业
        courseware: '', // 过往课题
        urls: [], // 评估视频或者网址url列表,
        expiresDate: '', // 评估截止时间
        assessUsers: [], // 参与评估人员用户列表
        assessFlag: '',
        assessResult: '',
        recommendName: '',
        homepageLink: ''
      },
      groupId: '',
      groupList: [],
      validateUrl,
      ASSESS_RESULT: [
        { label: '博商在做', value: 5 },
        { label: '对手在做', value: 6 },
        { label: '不考虑合作', value: 7 },
        { label: '不符合', value: 8 },
        { label: '黑名单', value: 9 },
        { label: '合作失败', value: 10 },
        { label: '其他', value: 11 }
      ],
      userList: [],
      videoUrls: [], // 用户上传的视频数组
      rules: {
        name: [
          { required: true, message: '请输入IP姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        assessFlag: [
          { required: true, message: '请选择是否需要评估', trigger: 'change' }
        ],
        photoUrl: [
          { required: true, message: '请选择IP照片', trigger: 'blur' }
        ],
        domains: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个所属领域',
            trigger: 'change'
          }
        ],
        experience: [
          { required: true, message: '请输入IP资质', trigger: 'blur' }
        ],
        serviceEnterprise: [
          { required: true, message: '请输入服务企业', trigger: 'blur' }
        ],
        assessUsers: [
          {
            required: true,
            message: '请选择参与评估人员',
            validator: checkAssessUsers,
            trigger: 'blur',
            type: 'array'
          }
        ],
        expiresDate: [
          {
            required: true,
            validator: checkExpiresDate,
            trigger: 'blur'
          }
        ],
        assessResult: [
          { required: true, message: '请选择无需评估结果', trigger: 'change' }
        ],
        homepageLink: [{ validator: checkLink, trigger: 'blur' }]
      },
      CancelToken: axios.CancelToken,
      imgUploadObj: {
        // 文件上传对象
        file: '',
        name: '',
        status: 0, // 0: 无文件, 1: 文件上传中, 2: 文件上传失败, 3: 文件上传成功
        authProgress: 0,
        source: null
      },
      alignUploadShow: false,
      loading: false,
      isLink2Find: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000
        },
        selectableRange: '00:00:00 - 23:59:59'
      },
      isDraft: false,
      auditTeacherId: '',
      nameDisabled: false,
      likeTeacher: [], // 类似师资
      pageIndex: 1,
      noMore: false
    }
  },
  computed: {
    ...mapGetters(['areaOption'])
  },
  watch: {
    'form.expiresDate'() {
      this.selectable()
    }
  },
  created() {
    this.getAreaList()
  },
  mounted() {
    // console.log(this.$route.params.param)
    if ((JSON.stringify(this.$route.params) === '{}') === false) {
      this.form.name = this.$route.params.param.name
      this.auditTeacherId = this.$route.params.param.id
      if (this.$route.params.param.urls?.length) {
        this.form.linkUrls = []
        this.$route.params.param.urls.map(v => {
          this.form.linkUrls.push({ type: 2, url: v })
        })
      }
      this.nameDisabled = true
    } else if ((JSON.stringify(this.$route.query) === '{}') === false) {
      this.form.name = this.$route.query.name
      this.form.name = this.$route.query.name
      this.$route.query.urls?.length
        ? (this.form.linkUrls[0].url = this.$route.query.urls)
        : ''
    }
  },
  methods: {
    getOptionsValue,
    // 获取领域数据
    async getAreaList() {
      const { data } = await getGroupNameList()
      this.groupList = data ?? []
      await this.$store.dispatch('option/getAreaOption')
    },
    handleHomePage() {
      if (!this.isDraft) {
        this.$router.push('/teacherCenter/teachFile/list')
      } else {
        this.$router.push('/teacherCenter/teachFile/list?draft=true')
      }
    },
    async handleGroupList() {
      if (!this.groupId) {
        const userList = this.userList.map(i => i.sysUserId)
        this.form.assessUsers = this.form.assessUsers.filter(
          i => !userList.includes(i.userId)
        )
        return
      }
      const { data } = await getGroupDetail(this.groupId)
      this.userList = data.userList || []
      this.form.assessUsers = this.userList.map(i => {
        return {
          userId: i.sysUserId,
          userName: i.userName,
          nickName: i.userName
        }
      })
    },
    // 点击返回
    goBack() {
      if (this.videoUrls.length > 0) {
        const index = this.videoUrls.findIndex(v => v.status === 1)
        if (index > -1) {
          return this.$message.error('有文件还在上传~')
        }
      }
      if (this.isLink2Find) {
        this.$router.push(
          `/teacherCenter/findTeacher/list?teacherName=${this.form.name}`
        )
        return
      }
      this.$router.back()
    },
    // 删除选中的老师图片
    delImage() {
      this.imgUploadObj = {
        file: '',
        name: '',
        status: 0, // 0: 无文件, 1: 文件上传中, 2: 文件上传失败, 3: 文件上传成功
        authProgress: 0,
        source: null
      }
      this.form.photoUrl = ''
      this.getAllLikeTeacher()
    },
    // 点击修改图片
    changeImage(res) {
      this.form.photoUrl = res
    },
    // 点击上传图片
    getImgUrl(e) {
      if (!e) {
        return
      }
      const selectFile = e.file
      const formData = new FormData()
      formData.append('file', selectFile)
      this.imgUploadObj = {
        file: selectFile,
        name: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix
        }`,
        status: 1,
        authProgress: 0,
        source: this.CancelToken.source()
      }
      uploadImg(
        formData,
        progressEvent => {
          const authProgress =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0
          // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          if (authProgress === 100) {
            this.imgUploadObj.authProgress = 99
          } else {
            this.imgUploadObj.authProgress = authProgress
          }
        },
        this.imgUploadObj.source.token
      )
        .then(res => {
          this.imgUploadObj.authProgress = 100
          this.imgUploadObj.status = 3
          this.form.photoUrl = res.data.url
          this.getAllLikeTeacher()
        })
        .catch(() => {
          console.log('失败')
          this.imgUploadObj.status = 2
          // 失败后重新上传
          this.$refs.refUpload && this.$refs.refUpload.clearFiles()
          this.imgUploadObj = {
            file: '',
            name: '',
            status: 0, // 0: 无文件, 1: 文件上传中, 2: 文件上传失败, 3: 文件上传成功
            authProgress: 0,
            source: null
          }
          this.form.photoUrl = ''
        })
    },
    // 点击添加评估视频url地址
    addlinkUrls() {
      this.form.linkUrls.push({
        type: 2,
        url: ''
      })
    },
    // 点击删除评估视频url地址
    delLinkUrls(index) {
      this.form.linkUrls.splice(index, 1)
    },
    // 点击添加评估人员
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.assessUsers,
        maxlength: 100,
        success: res => {
          res.user.map(v => {
            v.userName = v.nickName
          })
          this.form.assessUsers = res.user
        }
      })
    },
    saveDraft() {
      if (this.videoUrls.length > 0) {
        const index = this.videoUrls.findIndex(v => v.status === 1)
        if (index > -1) {
          return this.$message.error('有文件还在上传~')
        }
      }
      if (!this.form.name) {
        this.$message.error('IP姓名不能为空')
        return
      }
      this.save(true)
    },
    // 点击删除评估人员
    delAssessUsers(tag, index) {
      this.form.assessUsers.splice(index, 1)
    },
    // 图片上传前的钩子函数
    beforeAvatarUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isLt5M
    },
    // 点击保存按钮
    validateForm() {
      if (this.videoUrls.length > 0) {
        const index = this.videoUrls.findIndex(v => v.status === 1)
        if (index > -1) {
          return this.$message.error('有文件还在上传~')
        }
      }
      this.$delModal({
        tips: '请确认该IP资料完整，同时生成正式档案！',
        iconClass: 'icon_warning',
        sureBtnBgColor: '#0C6FFF',
        success: () => {
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              this.save(false)
            } else {
              return false
            }
          })
        }
      }).catch(() => { })
    },
    async save(isDraft = false) {
      this.loading = true
      const domains = []
      if (this.form?.domains?.length > 0) {
        this.form.domains.map(v => {
          const obj = this.areaOption.find(e => e.domainId === v)
          domains.push(obj.domainId)
        })
      }
      const assessUserIds = []
      if (this.form?.assessUsers?.length > 0) {
        this.form.assessUsers.map(v => {
          assessUserIds.push(v.userId)
        })
      }
      const mediaList = []
      this.form?.linkUrls?.length > 0 &&
        this.form.linkUrls.map(v => {
          v.url !== '' &&
            mediaList.push({
              type: v.type,
              url: v.url
            })
        })
      this.videoUrls?.length > 0 &&
        this.videoUrls.map(v => {
          v.status === 3 &&
            mediaList.push({
              type: 1,
              url: v.url
            })
        })

      const isAssessFlag = this.form.assessFlag === 0
      if (!isAssessFlag && !mediaList.length && !isDraft) {
        this.$message.error('评估视频不能为空')
        this.loading = false
        return
      }
      const data = {
        assessUserIds: !isAssessFlag ? assessUserIds : [], // 参与评估人员用户列表
        courseware: this.form.courseware, // 过往课题
        domains, // 所属领域
        experience: this.form.experience, // IP资质
        expiresDate: !isAssessFlag ? this.form.expiresDate : undefined, // 评估截止时间
        teacherName: this.form.name, // IP姓名
        assessFlag: this.form.assessFlag,
        photoUrl: this.form.photoUrl, // IP照片
        serviceEnterprise: this.form.serviceEnterprise, // 服务企业
        mediaList: mediaList, // 评估视频或网址url列表
        archivesAssessResult: isAssessFlag ? this.form.assessResult : '',
        recommendName: this.form.recommendName,
        homepageLink: this.form.homepageLink
      }
      this.auditTeacherId ? (data['auditTeacherId'] = this.auditTeacherId) : ''
      const addApi = isDraft ? teacherDraftAdd : teacherAdd
      return new Promise((resolve, reject) => {
        addApi(data)
          .then(res => {
            this.$notify.success('提交成功')
            this.goBack()
            this.loading = false
            resolve()
          })
          .catch(err => {
            this.loading = false
            reject(err)
          })
      })
    },
    // 可选的时间范围
    selectable() {
      const date = moment(this.form.expiresDate).startOf('day').format('x')
      const nowDate = moment().startOf('day').format('x')
      // 如果选择的是今天 则需要禁用已经过去的时间节点
      if (date <= nowDate) {
        // 默认选择的最新时间 是当前时间的两分钟后 （留出2分钟的富裕时间）
        this.pickerOptions.selectableRange = `${moment()
          .add(2, 'minutes')
          .format('HH:mm:ss')} - 23:59:59`
        // eslint-disable-next-line brace-style
      }
      // 如果是以后的日期，则不需要禁用时间节点
      else {
        this.pickerOptions.selectableRange = '00:00:00 - 23:59:59'
      }
    },
    // 上传视频改变时触发
    fileChange(res) {
      this.videoUrls = res
    },
    save2Link() {
      this.isLink2Find = true
      this.saveDraft()
    },
    tearchSearch() {
      this.handleSearchTeacherName()
    },
    loadAllLikeTeacher() {
      if (!this.noMore) {
        this.pageIndex++
        this.handleSearchTeacherName()
      }
    },
    getAllLikeTeacher() {
      this.pageIndex = 1
      this.noMore = false
      this.likeTeacher = []
      this.handleSearchTeacherName()
      this.getCountByName()
    },
    async getCountByName() {
      const { data } = await getCountByTeacherName({ teacherName: this.form.name })
      if (data > 0) {
        this.$message.error('该IP姓名已存在')
      }
    },
    async handleSearchTeacherName() {
      if (!this.form.name && !this.form.photoUrl) {
        this.likeTeacher = []
        return
      }
      const { data } = await searchTeacherNew({
        name: this.form.name ? this.form.name : undefined,
        image: this.form.photoUrl ? this.form.photoUrl : undefined,
        'pageIndex': this.pageIndex,
        'pageSize': 20,
        'tenantId': JSON.parse(localStorage.getItem('orgInfo')).organizationId
      })
      this.likeTeacher.push(...data.items)
      this.noMore = this.likeTeacher.length >= data.total
    },
    handleToDetail(item) {
      if (item.isCurrentTeacher) {
        const { href } = this.$router.resolve({
          path: `/teacherCenter/teachFile/detail/${item.teacherId}`
        })
        window.open(href, '_blank')
      } else if (item.followUpPool || item.openSeaPool) {
        const { href } = this.$router.resolve({
          path: `/teacherCenter/teacherSharing?teacherRealName=${item.teacherRealName}&poolType=${item.followUpPool ? '1' : '2'}`
        })
        window.open(href, '_blank')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content ::v-deep {
  padding-top: 20px;

  .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }

  .tips1 {
    color: #000;
    font-size: 12px;
    line-height: 24px;
    margin-top: 12px;
    margin-left: 12px;
    font-weight: bold;
  }

  .text-tips {
    margin-left: 15px;
    color: #f53f3f;
  }

  .text-color {
    input {
      &::-webkit-input-placeholder {
        color: #777;
      }
    }
  }

  .image_poster {
    position: relative;
    width: 118px;
    height: 135px;
    background: #fbfcfe;
    border-radius: 4px;
    border: 1px dashed #dcdcdc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0c6fff;
    line-height: 20px;
    cursor: pointer;
    overflow: hidden;

    .addimag_icon {
      font-size: 18px;
      margin-bottom: 13px;
    }

    &:hover {
      border-color: #0c6fff;
    }

    .addimag_icon_error {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #f53f3f;
      line-height: 22px;
    }

    .alignUploadShow {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 2;
      background: #fbfcfe;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .alignUploadIcon {
        font-size: 24px;
      }
    }
  }

  .assessBox {
    width: 503px;
    box-sizing: border-box;
    padding: 18px 16px 2px;
    height: auto;
    background: #ffffff;
    border-radius: 6px;
    border: 1px dashed #979797;

    .assessUsersView {
      margin-right: 16px;
      margin-bottom: 16px;
    }
  }
}

.footer {
  margin-top: 4px;
  text-align: center;
}

.slide-enter-active {
  animation-name: slideInUp;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}

.slide-leave-active {
  animation-name: slideOutDown;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}

@keyframes slideInUp {
  0% {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translateZ(0);
  }
}

@keyframes slideOutDown {
  0% {
    transform: translateZ(0);
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
}

.delay-leave-active {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.like-teacher-item {
  border-radius: 8px;
  background: #FFF;
  width: 188px;
  margin: 8px;
  padding: 12px;
  text-align: center;
  font-size: 12px;
  color: #3c3c3c;
  position: relative;

  .like-teacherName {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #515151;
    text-align: left;
    line-height: 20px;
    font-size: 12px;
  }

  .live-teacherName1 {
    color: #000;
    margin-top: 10px;
    font-weight: bold;
  }

  .like-black {
    color: #ff2020;
    font-family: "Microsoft YaHei";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    border-radius: 0 8px 0 4px;
    background: #FFF1F1;
    padding: 0 5px;
    position: absolute;
    right: 0;
    top: 0;
  }
}

.like {
  max-height: 333px;
  overflow-y: auto;
  background: #F1F7FF;
  border-radius: 8px;
}

.like-photoUrl {
  width: 88px;
  height: 88px;
  flex-shrink: 0;
  border-radius: 50%;
  margin: 0 auto;
  object-fit: contain;
  background: #f2f2f2;
}
</style>
