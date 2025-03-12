<template>
  <!-- 新增师资 -->
  <formPage title="师资档案" sub-title="编辑IP" @click="handleHomePage">
    <div class="content">
      <el-form ref="ruleForm" label-width="110px" :model="form" :rules="rules">
        <el-form-item label="IP编号" prop="ID">
          {{ form.teacherId }}
        </el-form-item>
        <el-form-item label="IP姓名" prop="teacherName">
          <!-- <span v-if="!isDraft">{{ form.teacherName }}</span> -->
          <!-- <el-input v-else v-model="form.teacherName" size="small" maxlength="10" class="w-200" /> -->
          <!-- <SelectTeacherName v-model="form.teacherName" /> -->
          <el-input
            v-model="form.teacherName"
            size="small"
            maxlength="10"
            class="w-200"
            show-word-limit
            @blur="getAllLikeTeacher"
          />
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
          <div>
            <div v-if="!form.photoUrl">
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
                    <el-progress
                      :show-text="false"
                      :percentage="imgUploadObj.authProgress"
                    />
                  </div>
                  <div
                    v-else-if="imgUploadObj.status === 2"
                    class="image_poster"
                    @mouseenter="alignUploadShow = true"
                    @mouseleave="alignUploadShow = false"
                  >
                    <i
                      class="el-icon-error"
                      style="color: #f53f3f; font-size: 24px"
                    />
                    <div class="addimag_icon_error">上传失败</div>
                    <transition name="slide">
                      <div v-if="alignUploadShow" class="alignUploadShow">
                        <svg-icon
                          icon-class="alignUploadShow"
                          class="alignUploadIcon"
                        />
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
            </div>
            <div v-else>
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
            </div>
            <div class="tips m-t-20">
              <div>注：图片只可上传JPG或者PNG格式，大小限5M以下。</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="所属领域" prop="domains">
          <el-checkbox-group v-model="form.domains" style="width: 700px">
            <el-checkbox
              v-for="item in areaOption"
              :key="item.domainId"
              :label="item.domainId"
              :disabled="
                !form.domains.includes(item.domainId) &&
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
              placeholder="请输入讲师服务过的企业和品牌"
            />
            <div class="tips m-l-16">
              <div>示例:</div>
              <div>平安集团、友邦保险、上海市公安系统、虹口区妇联等</div>
              <div>腾讯、小米、三星、滴滴、JD等300多家头部企业及创业公司</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="过往课题">
          <div class="fl">
            <el-input
              v-model="form.courseware"
              style="width: 488px"
              type="textarea"
              maxlength="500"
              show-word-limit
              :autosize="{ minRows: 3 }"
              placeholder="请输入讲师曾经的课题，例：《熊猫罗盘》十大营销方法论"
            />
            <div class="tips m-l-16">
              <div>示例:</div>
              <div>《快速提升决策 洞察本质问题》</div>
              <div>《教练式领导力 成为职场沟通高手》</div>
            </div>
          </div>
        </el-form-item> -->
        <el-form-item label="评估视频">
          <videoUpload
            ref="videoUpload"
            style="width: 660px"
            :limit="limit"
            accept="video/mp4"
            :before-video-upload="beforeVideoUpload"
            @change="fileChange"
          />
          <div v-if="form.videoList.length === 0" class="tips">
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
            <el-button icon="el-icon-plus" size="small" @click="addlinkUrls" />
            <el-button
              v-if="form.linkUrls.length !== 1"
              icon="el-icon-minus"
              size="small"
              @click="delLinkUrls(index)"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="主页链接" prop="homepageLink">
          <el-input
            v-model="form.homepageLink"
            type="text"
            class="w-500"
            size="small"
            placeholder="请输入主页链接"
          />
        </el-form-item>
        <el-form-item label="是否需要评估" prop="assessFlag">
          <el-select
            v-model="form.assessFlag"
            :disabled="assessFlagDisabled"
            clearable
            placeholder="请谨慎选择，一旦生成档案将不可修改！"
          >
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
          <span v-if="!isDraft" class="text-tips">
            注：该字段一旦生成评估记录后不能再进行修改
          </span>
        </el-form-item>
        <el-form-item
          v-if="form.assessFlag === 1"
          label="参与评估人员"
          prop="assessUsers"
        >
          <el-select
            v-if="isDraft"
            v-model="groupId"
            class="w-300 m-b-20"
            clearable
            placeholder="选择分组"
            @change="handleGroupList"
          >
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            />
          </el-select>
          <div :class="{ assessBox: form.assessUsers.length > 0 }">
            <el-tag
              v-for="(tag, index) in form.assessUsers"
              :key="tag.userId"
              class="assessUsersView"
              :closable="
                canChange && (!tag.assessStatus || tag.assessStatus === 1)
              "
              @close="delAssessUsers(tag, index)"
            >
              {{ tag.userName }}
            </el-tag>
            <el-button
              v-if="canChange"
              size="mini"
              class="assessUsersView"
              @click="selectUser"
            >
              <i class="el-icon-plus el-icon--left" />添加评估人员
            </el-button>
          </div>
          <div v-if="form.assessUsers.length > 0" class="tips m-t-8">
            已选{{ form.assessUsers.length }}人
          </div>
        </el-form-item>
        <el-form-item
          v-if="form.assessFlag === 1"
          label="评估截止时间"
          prop="expiresDate"
        >
          <el-date-picker
            v-model="form.expiresDate"
            :disabled="!canChange && !isDraft"
            size="small"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            default-time="23:58:00"
          />
          <div class="tips">填写时间后，即通过通知对应的参与评估人员。</div>
        </el-form-item>
        <el-form-item
          v-if="form.assessFlag === 0"
          label="无需评估结果"
          prop="archivesAssessResult"
        >
          <el-select
            v-model="form.archivesAssessResult"
            class="text-color"
            style="width: 300px"
            clearable
            placeholder="请选择无需评估结果"
          >
            <el-option
              v-for="item in ASSESS_RESULT"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
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
      <el-button
        v-if="!isDraft"
        :loading="loading"
        size="small"
        type="primary"
        @click="validateForm(1)"
      >
        保存并更新档案
      </el-button>
      <template v-else>
        <el-button
          :loading="loading"
          size="small"
          type="primary"
          plain
          @click="saveDraft"
        >
          保存为草稿
        </el-button>
        <el-button
          :loading="loading"
          size="small"
          type="primary"
          @click="validateForm(2)"
        >
          保存并生成档案
        </el-button>
      </template>

      <el-button :loading="loading" size="small" @click="goBack()">
        取消
      </el-button>
    </div>
  </formPage>
</template>

<script>
import formPage from '../components/formPage'
import { mapGetters } from 'vuex'
import { uploadImg } from '@/api/file'
import AppMyImage from '@/components/AppMyImage'
import axios from 'axios'
import moment from 'moment'
import videoUpload from '../components/uploadVideo/index'
import {
  getTeacherDetail,
  teacherDraftDetail,
  getGroupNameList,
  getGroupDetail,
  teacherDraftUpdate,
  teacherUpdate,
  teacherAdd,
  searchTeacherNew,
  getCountByTeacherName
} from '@/api/tearchCenter/index'
import { getOptionsValue } from '@/filters'
import { ASSESS_TYPES, COOPERATION_TYPE, ASSESS_RESULT_OTHER } from '../enum'
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
      if (value && date <= nowDate && this.isDraft) {
        return callback('评估时间需大于当前时间')
      } else
      if (!value) {
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
      likeTeacher: [], // 类似师资
      pageIndex: 1,
      noMore: false,
      form: {
        linkUrls: [{ type: 2, url: '' }], // 网址数组
        teacherName: '', // IP姓名
        teacherId: '', // IP-ID
        photoUrl: '', // IP照片
        domains: [], // 所属领域
        experience: '', // IP资质
        serviceEnterprise: '', // 服务企业
        courseware: '', // 过往课题
        urls: [], // 评估视频或者网址url列表,
        expiresDate: '', // 评估截止时间
        videoList: [],
        assessUsers: [],
        assessFlag: '',
        archivesAssessResult: '',
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
      limit: 20,
      rules: {
        teacherName: [
          { required: true, message: '请输入IP姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        assessFlag: [
          { required: true, message: '请选择是否需要评估', trigger: 'change' }
        ],
        photoUrl: [{ required: true, message: '请选择IP照片' }],
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
            validator: checkAssessUsers,
            trigger: 'blur',
            type: 'array'
          }
        ],
        expiresDate: [
          { required: true, validator: checkExpiresDate, trigger: 'blur' }
        ],
        archivesAssessResult: [
          { required: true, message: '请选择无需评估结果', trigger: 'change' }
        ],
        homepageLink: [{ validator: checkLink, trigger: 'blur' }]
      },
      CancelToken: axios.CancelToken,
      userList: [],
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
      // canChange: true, // 评估人员和评估截止时间能否修改
      isDraft: false,
      assessFlagDisabled: false,
      historyTeacherName: ''
    }
  },
  computed: {
    ...mapGetters(['areaOption']),
    canChange() {
      // 已评估
      if (this.form.assessStatus === 3) {
        return false
      }
      // 需要评估
      if (this.form.assessFlag) {
        return true
      }
      return new Date(this.form.expiresDate).getTime() < new Date().getTime()
    }
  },
  watch: {
    'form.expiresDate'() {
      this.selectable()
    }
  },
  created() {
    this.getAreaList()
    this.form.teacherId = this.$route.params.id
    this.isDraft = this.$route.query?.draft ?? false
    this.getDetail()
  },
  mounted() {},
  methods: {
    getOptionsValue,
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
      if (this.form.teacherName === this.historyTeacherName) {
        return
      }
      const { data } = await getCountByTeacherName({ teacherName: this.form.teacherName })
      if (data > 0) {
        this.$message.error('该IP姓名已存在')
      }
    },
    async handleSearchTeacherName() {
      if (!this.form.teacherName && !this.form.photoUrl) {
        this.likeTeacher = []
        return
      }
      const { data } = await searchTeacherNew({
        name: this.form.teacherName ? this.form.teacherName : undefined,
        image: this.form.photoUrl ? this.form.photoUrl : undefined,
        'pageIndex': this.pageIndex,
        'pageSize': 20,
        'tenantId': JSON.parse(localStorage.getItem('orgInfo')).organizationId
      })
      this.likeTeacher.push(...data.items)
      this.noMore = this.likeTeacher.length >= data.total
    },
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
      if (this.form.videoList.length > 0) {
        const index = this.form.videoList.findIndex(v => v.status === 1)
        if (index > -1) {
          return this.$message.error('有文件还在上传~')
        }
      }
      if (this.isLink2Find) {
        this.$router.push(
          `/teacherCenter/findTeacher/list?teacherName=${this.form.teacherName}`
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
        name: `${this.$getUuiD(10)}.${
          this.$getFileType(selectFile.name).suffix
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
      const length = this.form.linkUrls.filter(v => v.type === 2).length
      if (length >= 20) {
        return this.$message.error(`不能再添加啦~`)
      }
      this.form.linkUrls.push({
        url: '',
        type: 2
      })
    },
    // 点击删除评估视频url地址
    delLinkUrls(index) {
      this.form.linkUrls.splice(index, 1)
    },
    // 点击添加评估人员
    selectUser() {
      const disabledUser = []
      this.form.assessUsers.map(v => {
        v.assessStatus === 2 && disabledUser.push(v.userId)
      })
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.assessUsers,
        disabledUser: disabledUser,
        maxlength: 100,
        success: res => {
          console.log(res, 'res')
          res.user.map(v => {
            v.userName = v.nickName
          })
          this.form.assessUsers = res.user
        }
      })
    },
    saveDraft() {
      if (this.form.videoList.length > 0) {
        const index = this.form.videoList.findIndex(v => v.status === 1)
        if (index > -1) {
          return this.$message.error('有文件还在上传~')
        }
      }
      if (!this.form.teacherName) {
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
      if (this.form.videoList.length > 0) {
        const index = this.form.videoList.findIndex(v => v.status === 1)
        if (index > -1) {
          return this.$message.error('有文件还在上传~')
        }
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.save(false)
        } else {
          return false
        }
      })
    },
    // type 保存为草稿 1 保存并生成档案 2 保存并更新档案 3
    async save(isDraft = false) {
      this.loading = true
      const assessUserIds = this.form.assessUsers?.map(v => v.userId) ?? []
      const mediaList =
        this.form.linkUrls
          ?.filter(i => i.url)
          ?.map(v => {
            return {
              platform: v.platform,
              type: v.type,
              url: v.url
            }
          }) ?? []
      this.form.videoList.length > 0 &&
        this.form.videoList.forEach(v => {
          v.status === 3 &&
            mediaList.push({
              platform: v.platform,
              type: v.type || 1,
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
        domains: this.form.domains, // 所属领域
        experience: this.form.experience, // IP资质
        expiresDate: !isAssessFlag ? this.form.expiresDate : undefined, // 评估截止时间
        teacherName: this.form.teacherName, // IP姓名
        teacherId: this.form.teacherId,
        assessFlag: this.form.assessFlag,
        photoUrl: this.form.photoUrl, // IP照片
        serviceEnterprise: this.form.serviceEnterprise, // 服务企业
        mediaList: mediaList, // 评估视频或网址url列表
        archivesAssessResult: isAssessFlag
          ? this.form.archivesAssessResult
          : '',
        recommendName: this.form.recommendName,
        homepageLink: this.form.homepageLink,
        fansNum: this.form.fansNum,
        homePageImage: this.form.homePageImage
      }
      const updateApi = isDraft
        ? teacherDraftUpdate
        : this.isDraft && !this.isLink2Find
          ? teacherAdd
          : teacherUpdate
      return new Promise((resolve, reject) => {
        updateApi(data)
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
    save2Link() {
      this.isLink2Find = true
      if (this.isDraft) {
        this.saveDraft()
      } else {
        this.validateForm(false)
      }
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
      this.form.videoList = res
    },
    getDetail() {
      this.loading = true
      const params = {
        teacherId: this.form.teacherId
      }
      const apiFn = this.isDraft ? teacherDraftDetail : getTeacherDetail
      apiFn(params)
        .then(res => {
          const domains = res.data.domains?.map(v => v.domainId) ?? []
          const assessUsers =
            res.data.assessUsers?.map(v => {
              return {
                userId: v.sysUserId,
                userName: v.userName,
                nickName: v.userName,
                assessStatus: v.assessStatus
              }
            }) ?? []
          const videoList = []
          const linkUrls = []
          res.data.urls.map(v => {
            if (v.type === 1 || [5, 4].includes(v.platform)) {
              videoList.push({
                file: '', // 文件对象
                name: '', // 文件名
                status: 3, // 状态
                authProgress: 0, // 进度
                poster: '', // 封面
                alignUploadShow: false, // 重新上传mask控制
                abortCheckpoint: null, // 中断点
                url: v.url, // 视频播放地址
                platform: v.platform,
                type: v.type
              })
            } else {
              linkUrls.push({
                platform: v.platform,
                type: v.type,
                url: v.url
              })
            }
          })
          this.historyTeacherName = res.data.teacherName
          const limitLength = videoList.filter(v => v.type === 3).length
          this.limit = limitLength + 20
          this.$refs.videoUpload.setFileList(videoList)
          this.form.teacherId = this.$route.params.id
          this.form.teacherName = res.data.teacherName
          this.form.photoUrl = res.data.photoUrl
          this.form.experience = res.data.experience
          this.form.courseware = res.data.courseware ?? ''
          this.form.serviceEnterprise = res.data.serviceEnterprise
          this.form.assessFlag = res.data.assessFlag
          this.form.videoList = videoList
          this.form.assessUsers = assessUsers
          this.form.expiresDate = res.data.expiresDate
          this.form.archivesAssessResult = res.data.archivesAssessResult
          this.form.recommendName = res.data.recommendName
          this.form.homepageLink = res.data.homepageLink
          this.form.assessStatus = res.data.assessStatus
          this.form.fansNum = res.data.fansNum
          this.form.homePageImage = res.data.homePageImage
          if (domains.length) {
            this.form.domains = domains
          }
          if (linkUrls.length === 0) {
            this.form.linkUrls = [{ type: 2, url: '' }]
          } else {
            this.form.linkUrls = linkUrls
          }
          // this.canChange = this.expiresDateDisabled()
          if (this.form.assessStatus === 3 || (!this.isDraft && this.form.assessUsers && this.form.assessUsers.some(i => i.assessStatus === 2))) {
            this.assessFlagDisabled = true
          }
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    // 点击
    beforeVideoUpload(file) {
      const isLt20G = file.size / 1024 / 1024 / 1024 < 20
      if (!isLt20G) {
        this.$message.error('视频大小限20G以内，MP4格式')
      }
      return isLt20G
    },
    // 截止评估时间禁用判断
    expiresDateDisabled() {
      if (typeof this.form.expiresDate === 'object') {
        return false
      }
      return new Date(this.form.expiresDate).getTime() < new Date().getTime()
    }

  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 20px;
  .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
  .text-tips {
    margin-left: 15px;
    color: #f53f3f;
  }
  .image_poster {
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
    .addimag_icon {
      font-size: 18px;
      margin-bottom: 13px;
    }
    &:hover {
      border-color: #0c6fff;
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
    color: #777777;
    font-family: "Microsoft YaHei";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    border-radius: 0 8px 0 4px;
    background: #F2F2F2;
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
}
</style>
