<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="config.visible"
    :title="{ 1: '新增排班', 2: '编辑排班' }[config.type]"
    width="710px"
    :loading="loading"
    :footer-text="['保存', '取消']"
    height="auto"
    @success="sure"
    @close="cancelDialog"
  >
    <div v-loading="loading" class="addDialog overflowOuto">
      <div class="tips">
        <i class="el-icon-warning tipsIcon" />
        <div class="tipsContent">
          <div class="tipsTitle">注意</div>
          <div class="tipsMsg">
            <p>1、请正确填写【直播排班信息】，如直播时间、直播账号、直播人员填错，将影响直播人员的业绩统计，请慎重填写。</p>
            <p>2、系统仅会计算7天内的直播排班，请下播后及时录入排班信息，防止业绩丢失。</p>
          </div>
        </div>
      </div>
      <el-form
        ref="form"
        class="m-t-16"
        :model="form"
        label-width="auto"
        size="small"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="直播类型" prop="liveType">
              <el-select
                v-model="form.liveType"
                @change="onhandleliveTypeChange"
              >
                <el-option
                  v-for="(value, key) in liveTypeOption"
                  :key="key"
                  :label="value"
                  :value="Number(key)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.liveType === 2"
              label="直播老师"
              prop="liveTearch"
            >
              <TeacherSelect
                ref="teacherSelect"
                style="width: 194px"
                :default-id="form.liveTearch.userId"
                :value="form.liveTearch.userName"
                @selected="teacherSelect"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="flex">
            <el-form-item label="直播开始时间" prop="liveTimeFrom">
              <el-date-picker
                v-model="form.liveTimeFrom"
                style="width: 200px"
                type="datetime"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                :unlink-panels="true"
                @focus="currentTime = ''"
                @change="changeTimeOrZh"
              />
            </el-form-item>
            <el-form-item label="直播结束时间" prop="liveTimeTo" style="margin-left:30px;">
              <el-date-picker
                v-model="form.liveTimeTo"
                style="width: 200px"
                type="datetime"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"

                :unlink-panels="true"
                @focus="currentTime = ''"
              />
            </el-form-item>
          </div>
        </el-row>
        <el-row />
        <el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="直播渠道" prop="liveChannel">
                <el-select
                  v-model="form.liveChannel"
                  @change="onLiveChannelChange"
                >
                  <el-option
                    v-for="item in liveChannel"
                    :key="item.code"
                    :label="item.message"
                    :value="item.code"
                  >
                    <img style="float: left; margin-top: 3px; width: 16px; height: 16px; border-radius: 100%; display: inline-block; margin-right: 6px;" :src="item.imageUrl" />
                    <span style="float: left;line-height: 22px;">{{ item.message }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="直播间" prop="liveRoomId">
              <el-select v-model="form.liveRoomId" placeholder="请选择">
                <el-option
                  v-for="item in liveRoomOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item> -->
              <el-form-item
                v-if="form.liveChannel"
                label="直播账号"
                prop="liveAccount"
              >
                <liveAccountSelect
                  :params="{ expertChannel: form.liveChannel }"
                  style="width: 194px"
                  :live-time="liveTime"
                  :default-id="form.liveAccount.id"
                  :value="form.liveAccount.expertName"
                  @selected="liveAccountSelectFn"
                />
              </el-form-item>
              <el-form-item label="主播" prop="anchor">
                <AppUserSelect ref="anchorUserSelect" v-model="form.anchor" class="w-200" @change="changeUser" />
              </el-form-item>
              <el-form-item label="直播运营" prop="control">
                <!-- <el-tag
                  v-if="form.accountOperate.userId"
                  class="remindPersonListView"
                  closable
                  @click.native="selectUser('accountOperate')"
                  @close="delAssessUsers('accountOperate')"
                >{{ form.accountOperate.userName }}</el-tag>
                <el-button
                  v-else
                  size="mini"
                  class="remindPersonListView"
                  @click="selectUser('accountOperate')"
                ><i class="el-icon-plus el-icon--left" />请选择</el-button> -->
                <AppUserSelect ref="accountOperateUserSelect" v-model="form.accountOperate" class="w-200" @change="changeAccountOperate" />
              </el-form-item>
              <el-form-item label="直播大屏截图" prop="liveUrl">
                <template>
                  <template v-if="!form.liveUrl">
                    <el-upload
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
                      :src="form.liveUrl"
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
                      @success="(res) => changeImage(res)"
                    />
                  </template>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="直播渠道" prop="liveChannel" style="opacity:0;z-index:-1">
                <!-- <el-select
                  v-model="form.liveChannel"
                  @change="onLiveChannelChange"
                >
                  <el-option
                    v-for="item in liveChannel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <svg-icon :icon-class="item.icon" />
                    {{ item.label }}
                  </el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item
                v-if="form.liveChannel"
                label="账号运营"
                prop="expertName"
              >
                {{ form.liveAccount.operateName }}
              </el-form-item>
              <el-form-item label="中控" prop="control">
                <AppUserSelect ref="controlUserSelect" v-model="form.control" class="w-200" @change="changeControl" />
                <!-- <el-tag
                  v-if="form.control.userId"
                  class="remindPersonListView"
                  closable
                  @click.native="selectUser('control')"
                  @close="delAssessUsers('control')"
                >{{ form.control.userName }}</el-tag>
                <el-button
                  v-else
                  size="mini"
                  class="remindPersonListView"
                  @click="selectUser('control')"
                ><i class="el-icon-plus el-icon--left" />请选择</el-button> -->
              </el-form-item>
              <el-form-item label="投手" prop="advertise">
                <!-- <el-tag
                  v-if="form.advertise.userId"
                  class="remindPersonListView"
                  closable
                  @click.native="selectUser('advertise')"
                  @close="delAssessUsers('advertise')"
                >{{ form.advertise.userName }}</el-tag>
                <el-button
                  v-else
                  size="mini"
                  class="remindPersonListView"
                  @click="selectUser('advertise')"
                ><i class="el-icon-plus el-icon--left" />请选择</el-button> -->
                <AppUserSelect ref="advertiseUserSelect" v-model="form.advertise" class="w-200" @change="changeAdvertise" />
              </el-form-item>
              <el-form-item label="主编" prop="editorObject">
                <AppUserSelect ref="editorObjectUserSelect" v-model="form.editorObject" class="w-200" @change="changeEditorObject" />
                <!-- <el-tag
                  v-if="form.control.userId"
                  class="remindPersonListView"
                  closable
                  @click.native="selectUser('control')"
                  @close="delAssessUsers('control')"
                >{{ form.control.userName }}</el-tag>
                <el-button
                  v-else
                  size="mini"
                  class="remindPersonListView"
                  @click="selectUser('control')"
                ><i class="el-icon-plus el-icon--left" />请选择</el-button> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-row></el-form>
    </div>
  </AppDialog>
</template>

<script>
import { uploadImg } from '@/api/file'
import AppDialog from '@/components/AppDialog'
import TeacherSelect from './tearchSelect.vue'
import { liveTypeOption, liveRoomOption } from '../columns'
import liveAccountSelect from './liveAccountSelect.vue'
import { liveScheduleAdd, liveScheduleEdit, expertSnapshotData } from '@/api/order/performanceShare'
import moment from 'moment'
import minxinsAddDialog from './minxinsAddDialog'
import AppMyImage from '@/components/AppMyImage'
import axios from 'axios'
import AppUserSelect from '@/components/AppUserSelect'
export default {
  components: {
    AppDialog,
    TeacherSelect,
    AppUserSelect,
    liveAccountSelect,
    AppMyImage
  },
  mixins: [minxinsAddDialog],
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 1, // 1新增 2编辑
          row: {},
          visible: false
        }
      }
    },
    liveChannel: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    var liveTearchCheck = (rule, value, callback) => {
      if (!value.userId) {
        return callback(new Error('请选择直播老师'))
      } else {
        return callback()
      }
    }
    var anchorCheck = (rule, value, callback) => {
      if (!value.userId) {
        return callback(new Error('请选择主播'))
      } else {
        return callback()
      }
    }
    var liveAccountCheck = (rule, value, callback) => {
      if (!value.id) {
        return callback(new Error('请选择直播账号'))
      } else {
        return callback()
      }
    }
    var liveTimeFrom = (rule, value, callback) => {
      if (!value || !value[0] || !value[1]) {
        return callback(new Error('请选择直播开始时间'))
      } else {
        return callback()
      }
    }
    var liveTimeTo = (rule, value, callback) => {
      if (!value || !value[0] || !value[1]) {
        return callback(new Error('请选择直播结束时间'))
      } else {
        return callback()
      }
    }
    return {
      liveTime: '',
      CancelToken: axios.CancelToken,
      alignUploadShow: false,
      imgUploadObj: {
        // 文件上传对象
        file: '',
        name: '',
        status: 0, // 0: 无文件, 1: 文件上传中, 2: 文件上传失败, 3: 文件上传成功
        authProgress: 0,
        source: null
      },

      liveRoomOption,
      currentTime: '',
      liveTypeOption,
      loading: false,
      form: {
        liveUrl: '',
        liveType: '', // 直播类型
        liveTime: ['', ''], // 直播时间
        liveRoomId: '', // 直播间
        liveChannel: '', // 直播渠道
        liveTimeFrom: '',
        liveTimeTo: '',
        liveAccount: {
          operateName: '', // 直播账号(达人昵称)
          operateUid: '', // 达人Id
          expertId: '', // 账号运营uid
          expertName: '', // 账号运营姓名
          id: '' // 账号的主键id
        },
        anchor: { userName: '', userId: '' }, // 主播
        control: { userName: '', userId: '' }, // 中控
        accountOperate: { userName: '', userId: '' }, // 运营
        advertise: { userName: '', userId: '' }, // 投手
        editorObject: { userName: '', userId: '' },
        liveTearch: { userName: '', userId: '' } // 直播老师
      },
      rules: {
        liveUrl: [{ required: true, message: '请上传直播大屏截图', trigger: 'change' }],
        liveType: [
          { required: true, message: '请选择直播类型', trigger: 'change' }
        ],
        // liveRoomId: [
        //   { required: true, message: '请选择直播间', trigger: 'change' }
        // ],
        liveAccount: [
          { required: true, validator: liveAccountCheck, trigger: 'change' }
        ],
        anchor: [{ required: true, trigger: 'change', validator: anchorCheck }],
        liveTearch: [
          { required: true, trigger: 'change', validator: liveTearchCheck }
        ],
        liveTimeFrom: [
          { required: true, validator: liveTimeFrom, trigger: 'change' }
        ],
        liveTimeTo: [
          { required: true, validator: liveTimeTo, trigger: 'change' }
        ],
        liveChannel: [
          { required: true, message: '请选择直播渠道', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate: time => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            const minTime = moment(this.currentTime)
              .subtract(1, 'years')
              .valueOf()
            const maxTime = moment(this.currentTime).add(1, 'years').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      }
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        this.$refs.form && this.$refs.form.resetFields()
        if (this.config.type === 1) {
          this.form = {
            liveUrl: '',
            liveType: '', // 直播类型
            liveTime: ['', ''], // 直播时间
            liveRoomId: '', // 直播间
            liveChannel: '', // 直播渠道
            liveAccount: {
              operateName: '',
              operateUid: '',
              expertId: '',
              expertName: '',
              id: ''
            },
            anchor: { userName: '', userId: '' }, // 主播
            control: { userName: '', userId: '' }, // 中控
            accountOperate: { userName: '', userId: '' }, // 直播运营
            advertise: { userName: '', userId: '' }, // 投手
            editorObject: { userName: '', userId: '' }, // 主编
            liveTearch: { userName: '', userId: '' } // 直播老师
          }
          this.$nextTick(() => {
            this.$refs.anchorUserSelect.value = ''
            this.$refs.accountOperateUserSelect.value = ''
            this.$refs.controlUserSelect.value = ''
            this.$refs.advertiseUserSelect.value = ''
            this.$refs.editorObjectUserSelect.value = ''
          })
        } else {
          const detail = JSON.parse(JSON.stringify(this.config.row))
          console.log(detail, 'detail')
          this.form = {
            id: detail.id,
            liveUrl: detail.liveUrl,
            liveType: detail.liveType, // 直播类型
            liveTime: [detail.liveTimeFrom, detail.liveTimeTo], // 直播时间
            liveTimeFrom: detail.liveTimeFrom,
            liveTimeTo: detail.liveTimeTo,
            liveRoomId: detail.liveRoomId, // 直播间
            liveChannel: detail.liveChannel, // 直播渠道
            liveAccount: {
              operateName: detail.accountOperateName, // 运营姓名
              operateUid: detail.accountOperateUid, // 运营Id
              expertId: detail.liveExpertManId, // 达人id
              expertName: detail.liveAccount, // 达人昵称
              id: detail.liveExpertManId
            },
            anchor: { userName: detail.anchorName, userId: detail.anchorUid }, // 主播
            control: {
              userName: detail.controlName,
              userId: detail.controlUid
            }, // 中控
            accountOperate: {
              userName: detail.liveOperateName,
              userId: detail.liveOperateUid
            }, // 运营
            advertise: {
              userName: detail.advertiseName,
              userId: detail.advertiseUid
            }, // 投手
            editorObject: {
              userName: detail.editorName,
              userId: detail.editorId
            },
            liveTearch: {
              userName: detail.lecturerName,
              userId: detail.lecturerId
            } // 直播老师
          }
          this.$nextTick(() => {
            this.$refs.anchorUserSelect.value = detail.anchorName
            this.$refs.accountOperateUserSelect.value = detail.liveOperateName
            this.$refs.controlUserSelect.value = detail.controlName
            this.$refs.advertiseUserSelect.value = detail.advertiseName
            this.$refs.editorObjectUserSelect.value = detail.editorName
          })
          console.log(this.form, 'form')
        }
      },
      deep: true,
      immediate: true
    },
    'form.liveTimeFrom': {
      handler(val) {
        this.liveTime = val
      }
    }
  },
  mounted() {
    console.log('大蛇丸考核：', this.liveChannel)
  },
  methods: {
    cancelDialog() {
      this.clearData()
    },
    clearData() {
      this.form = {
        liveUrl: '',
        liveType: '', // 直播类型
        liveTime: ['', ''], // 直播时间
        liveRoomId: '', // 直播间
        liveChannel: '', // 直播渠道
        liveAccount: {
          operateName: '',
          operateUid: '',
          expertId: '',
          expertName: '',
          id: ''
        },
        anchor: { userName: '', userId: '' }, // 主播
        control: { userName: '', userId: '' }, // 中控
        accountOperate: { userName: '', userId: '' }, // 直播运营
        advertise: { userName: '', userId: '' }, // 投手
        editorObject: { userName: '', userId: '' },
        liveTearch: { userName: '', userId: '' } // 直播老师
      }
      this.$refs.anchorUserSelect.value = ''
      this.$refs.accountOperateUserSelect.value = ''
      this.$refs.controlUserSelect.value = ''
      this.$refs.advertiseUserSelect.value = ''
      this.$refs.editorObjectUserSelect.value = ''
      this.$refs.form.clearValidate()
    },
    changeAdvertise(res, info) {
      this.form.advertise.userId = info.userId
      this.form.advertise.userName = info.userName
    },
    changeEditorObject(res, info) {
      this.form.editorObject.userId = info.userId
      this.form.editorObject.userName = info.userName
    },
    changeControl(res, info) {
      this.form.control.userId = info.userId
      this.form.control.userName = info.userName
    },
    changeUser(res, info) {
      this.form.anchor.userId = info.userId
      this.form.anchor.userName = info.userName
    },
    changeAccountOperate(res, info) {
      this.form.accountOperate.userId = info.userId
      this.form.accountOperate.userName = info.userName
    },
    // 判断当前主播
    changeTimeOrZh() {
      const params = {
        time: this.form.liveTimeFrom,
        expertManId: this.form.liveAccount.id
      }
      expertSnapshotData(params).then(res => {
        if (res.code === 1 && res.data) {
          this.form.liveAccount = {
            operateName: res.data.operateName, // 运营姓名
            operateUid: res.data.operateUid, // 运营ID
            expertId: res.data.expertId, // 达人ID
            expertName: res.data.expertName, // 达人昵称
            id: res.data.id
          }
          this.$refs.form && this.$refs.form.validateField('liveAccount')
        }
      })
    },
    // 点击修改图片
    changeImage(res) {
      this.form.liveUrl = res
    },
    // 删除选中的老师图片
    delImage() {
      this.$nextTick(() => {
        this.imgUploadObj = {
          file: '',
          name: '',
          status: 0, // 0: 无文件, 1: 文件上传中, 2: 文件上传失败, 3: 文件上传成功
          authProgress: 0,
          source: null
        }
        this.form.liveUrl = null
        this.$forceUpdate()
      })
    },
    // 图片上传前的钩子函数
    beforeAvatarUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isLt5M
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
        name: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix}`,
        status: 1,
        authProgress: 0,
        source: this.CancelToken.source()
      }
      uploadImg(
        formData,
        (progressEvent) => {
          const authProgress = ((progressEvent.loaded / progressEvent.total) * 100) | 0
          // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          if (authProgress === 100) {
            this.imgUploadObj.authProgress = 99
          } else {
            this.imgUploadObj.authProgress = authProgress
          }
        },
        this.imgUploadObj.source.token
      )
        .then((res) => {
          this.imgUploadObj.authProgress = 100
          this.imgUploadObj.status = 3
          this.form.liveUrl = res.data.url
        })
        .catch(() => {
          console.log('失败')
          this.imgUploadObj.status = 2
        })
    },

    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const isValidLiveTime = this.validLiveTime()
          if (!isValidLiveTime) { return }
          this.loading = true
          const params = {
            advertiseUid: this.$refs.advertiseUserSelect.value === '' ? '' : this.form.advertise.userId,
            anchorUid: this.$refs.anchorUserSelect.value === '' ? '' : this.form.anchor.userId,
            controlUid: this.$refs.controlUserSelect.value === '' ? '' : this.form.control.userId,
            editorId: this.form.editorObject.userId,
            liveExpertManId: this.form.liveAccount.id,
            liveOperateUid: this.$refs.accountOperateUserSelect.value === '' ? '' : this.form.accountOperate.userId,
            liveRoomId: this.form.liveRoomId,
            liveTimeFrom: this.form.liveTimeFrom,
            liveTimeTo: this.form.liveTimeTo,
            liveType: this.form.liveType,
            lecturerId: this.form.liveTearch.userId,
            liveUrl: this.form.liveUrl
          }
          let apiFn
          if (this.config.type === 1) {
            apiFn = liveScheduleAdd
          } else if (this.config.type === 2) {
            params.id = this.form.id
            apiFn = liveScheduleEdit
          } else if (this.config.type === 3) {
            apiFn = liveScheduleAdd
          }
          apiFn(params)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
              this.$emit('success')
              this.clearData()
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击删除通知人员
    delAssessUsers(key) {
      this.form[key].userName = ''
      this.form[key].userId = ''
    },
    // 点击添加通知人员
    selectUser(key) {
      const checkUser = []
      if (this.form[key].userId && this.form[key].userName) {
        checkUser.push({
          userId: this.form[key].userId,
          nickName: this.form[key].userName
        })
      }
      this.$AddressBook({
        visible: true,
        multiple: false,
        checkUser,
        type: [1],
        success: res => {
          if (res.user.length > 0) {
            this.form[key].userName = res.user[0].nickName
            this.form[key].userId = res.user[0].userId
            this.$refs.form && this.$refs.form.validateField(key)
          }
        }
      })
    },
    // 选择直播老师
    teacherSelect(row) {
      this.form.liveTearch.userName = row.lecturerName
      this.form.liveTearch.userId = row.lecturerId
      this.$refs.form && this.$refs.form.validateField('liveTearch')
    },
    onhandleliveTypeChange() {
      this.form.liveTearch.userName = ''
      this.form.liveTearch.userId = ''
    },
    // 选择直播账号
    liveAccountSelectFn(row) {
      this.form.liveAccount = {
        operateName: row.operateName, // 运营姓名
        operateUid: row.operateUid, // 运营ID
        expertId: row.expertId, // 达人ID
        expertName: row.expertName, // 达人昵称
        id: row.id
      }
      this.$refs.form && this.$refs.form.validateField('liveAccount')
    },
    //  直播渠道改变触发
    onLiveChannelChange() {
      this.form.liveAccount = {
        operateName: '',
        operateUid: '',
        expertId: '',
        expertName: '',
        id: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addDialog {
  height: 600px;
  padding: 20px;
  .tips {
    width: 100%;
    padding: 10px;
    background: #fff2e6;
    border-radius: 8px;
    display: flex;
    .tipsIcon {
      width: 24px;
      color: #ff7d00;
      font-size: 24px;
    }
    .tipsContent {
      flex: 1;
      padding-left: 8px;
      .tipsTitle {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #ff7d00;
        line-height: 24px;
      }
      .tipsMsg {
        margin-top: 8px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ff7d00;
        line-height: 22px;
      }
    }
  }
}
.m-l-32 {
  margin-left: 32px;
}
.remindPersonListView {
  cursor: pointer;
}
::v-deep {
  .el-form-item__content .tearchInput {
    width: 194px !important;
  }
}

.image_poster {
  position: relative;
  width: 118px;
  height: 110px;
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
</style>
