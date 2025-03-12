<template>
  <div class="personalInfo-container">
    <div class="personalInfo-avatar">
      <div
        class="upload-view"
        @mouseenter="maskdShow = true"
        @mouseleave="maskdShow = false"
      >
        <AppAvatar
          class="header-avatar"
          :name="info.name"
          width="120"
          :avatar="info.avatar"
          :no-name="true"
          v-if="info.avatar"
        />
        <img v-else :src="emptyAvatarPng" class="emptyAvatar" />
        <div v-if="maskdShow" class="maskdShow">
          <el-upload
            ref="uploadFile"
            action="#"
            class="personalInfo-upload"
            :before-upload="beforeUpload"
            :limit="1"
            :multiple="false"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="onChangeFile"
            :on-remove="handleRemove"
          >
            <span class="maskdAginText" v-if="info.avatar"
              ><i class="el-icon-refresh" style="font-size: 22px"></i
            ></span>
            <span class="maskdText" v-else>上传</span>
          </el-upload>
          <span class="uploadLine"></span>
          <span
            class="maskdDownText"
            v-if="info.avatar"
            @click="handleMaskdDown"
            ><i class="el-icon-download" style="font-size: 22px"></i
          ></span>
        </div>
      </div>

      <div v-if="avatarhover" class="upload-text">上传</div>
      <div class="personalInfo-avatarName">{{ info.name }}</div>
    </div>
    <div class="personalInfo-content">
      <el-row>
        <el-col :span="7">
          <div class="personalInfo-item">
            <img :src="companyNameIcon" />
            <div>{{ info.companyName }}</div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="personalInfo-item">
            <img :src="departmentIcon" />
            <div>{{ info.deptName }}</div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="personalInfo-item">
            <img :src="positionIcon" />
            <div>{{ info.positionName }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <template v-if="info.employeeType === 0">
          <el-col :span="7">
            <div class="personalInfo-item">
              <img :src="timeIcon" />
              <div>
                预计入职时间
                {{ getTime(info.expectedEntryTime, '-', '-') }}
              </div>
            </div>
          </el-col>
        </template>
        <template v-if="info.employeeType === 1">
          <el-col :span="7">
            <div class="personalInfo-item">
              <img :src="timeIcon" />
              <div>入职时间 {{ getTime(info.entryDate, '-', '-') }}</div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="personalInfo-item">
              <img :src="timeIcon" />
              <div>
                预计转正时间
                {{ getTime(info.expectedRegularDate, '-', '-') }}
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="personalInfo-item">
              <img :src="timeIcon" />
              <div>工龄 {{ convertWorkExperience(info.workAge) }}</div>
            </div>
          </el-col>
        </template>
        <template v-if="info.employeeType === 2">
          <el-col :span="7">
            <div class="personalInfo-item">
              <img :src="timeIcon" />
              <div>入职时间 {{ getTime(info.entryDate, '-', '-') }}</div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="personalInfo-item">
              <img :src="timeIcon" />
              <div>转正时间 {{ getTime(info.regularDate, '-', '-') }}</div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="personalInfo-item">
              <img :src="timeIcon" />
              <div>工龄 {{ convertWorkExperience(info.workAge) }}</div>
            </div>
          </el-col>
        </template>
        <template v-if="info.employeeType === 3">
          <el-col :span="7">
            <div class="personalInfo-item">
              <img :src="timeIcon" />
              <div>入职时间 {{ getTime(info.entryDate, '-', '-') }}</div>
            </div>
          </el-col>
          <el-col :span="7">
            <div v-if="info.regularDate" class="personalInfo-item">
              <img :src="timeIcon" />
              <div>转正时间 {{ getTime(info.regularDate, '-', '-') }}</div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="personalInfo-item">
              <img :src="timeIcon" />
              <div>离职时间 {{ getTime(info.departureDate, '-', '-') }}</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="personalInfo-item">
              <img :src="timeIcon" />
              <div>在职时长 {{ (info.workAge / 12).toFixed(1) }}年</div>
            </div>
          </el-col>
        </template>
      </el-row>
      <el-row>
        <el-col :span="7">
          <div class="personalInfo-item">
            <img :src="phoneIcon" />
            <div>{{ info.phone }}</div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="personalInfo-item">
            <img :src="mailboxIcon" />
            <div>{{ info.email }}</div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="personalInfo-item">
            <img :src="addressIcon" />
            <div>{{ info.address }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-button
      v-if="canEdit"
      class="personalInfo-editbtn"
      @click="editPersonalInfoDialog"
    >
      <div class="editbtn-container">
        <img :src="editIcon" class="editbtn" /><span>&nbsp;编辑</span>
      </div>
    </el-button>
    <personalInfoDialog
      :visible.sync="personalInfoDialogVisiable"
      :info="info"
      :detailBaseInfo="detailBaseInfo"
      v-if="personalInfoDialogVisiable"
      @close="personalInfoDialogVisiable = false"
      @success="handlePersonalInfoSuccessDialog"
    >
    </personalInfoDialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import companyNameIcon from '@/assets/image/oa/companyName.png'
import personalInfoDialog from './personalInfoDialog.vue'
import addressIcon from '@/assets/image/oa/address.png'
import departmentIcon from '@/assets/image/oa/department.png'
import mailboxIcon from '@/assets/image/oa/mailbox.png'
import phoneIcon from '@/assets/image/oa/phone.png'
import positionIcon from '@/assets/image/oa/position.png'
import timeIcon from '@/assets/image/oa/time.png'
import { employeeModifyAvatarAjax } from '@/views/oaMannagement/api/staff.js'
import { uploadFile } from '@/api/file'
import emptyAvatarPng from '@/assets/image/oa/emptyAvatar.png'
import { downLink } from '@/utils/index'
import { convertWorkExperience } from '@/views/oaMannagement/utils/common'
import editIcon from '@/assets/image/oa/edit.png'

import moment from 'moment'
export default {
  components: {
    AppAvatar,
    personalInfoDialog
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          name: '',
          companyName: '',
          deptName: '',
          positionId: '',
          expectedEntryTime: '',
          phone: '',
          email: '',
          address: ''
        }
      }
    },
    detailBaseInfo: {
      type: Object,
      default: () => {}
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      avatarhover: false,
      addressIcon,
      departmentIcon,
      mailboxIcon,
      phoneIcon,
      positionIcon,
      timeIcon,
      companyNameIcon,
      personalInfoDialogVisiable: false,
      fileList: [],
      emptyAvatarPng,
      editIcon,
      maskdShow: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    moment,
    convertWorkExperience,
    getTime(time, x, y, z) {
      return time ? moment(time).format(`YYYY${x}MM${y}DD${z || ''}`) : ''
    },
    editPersonalInfoDialog() {
      this.personalInfoDialogVisiable = true
    },
    handlePersonalInfoSuccessDialog() {
      this.personalInfoDialogVisiable = false
      this.$emit('refresh')
    },
    onChangeFile(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.raw)
      const isUpload = this.beforeUpload(file)
      if (isUpload) {
        uploadFile(formData)
          .then(res => {
            if (res.code === 1) {
              //   this.fileList = fileList
              // this.$refs.uploadFile.clearFiles()
              const params = {
                avatar: res.data.url,
                personnelBaseInfoId: this.info.personnelBaseInfoId
              }
              employeeModifyAvatarAjax(params).then(res2 => {
                if (res2.code === 1) {
                  this.$emit('avatarRefresh')
                }
              })
            }
          })
          .catch(() => {
            this.$message.error('头像上传失败')
          })
      } else {
        this.handleRemove()
        this.$refs.uploadFile.clearFiles()
      }
    },
    handleRemove() {
      // this.fileList.splice(0)
    },
    //头像下载
    handleMaskdDown() {
      if (!this.info.avatar) return
      downLink(this.info.avatar, this.info.name + '头像')
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      const isTypeAllowed = /\.(png|jpg|PNG|JPG)$/i.test(file.name)
      if (!isTypeAllowed) {
        this.$message.error('只能上传 png,jpg 格式的文件！')

        return false
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB！')

        return false
      }

      return isLt10M && isTypeAllowed
    }
  }
}
</script>

<style lang="scss" scoped>
.personalInfo-container {
  display: flex;
  padding: 20px;
  height: 208px;
  background: #f5f9ff;
  position: relative;
  border-radius: 10px;
  margin-bottom: 16px;
  border: 1px solid #f2f2f2;
}
.personalInfo-avatar {
  margin-right: 60px;
  .personalInfo-upload {
    // cursor: pointer;
    // pointer-events: none;
  }
  .personalInfo-avatarName {
    color: #000000;
    font-size: 20px;
    font-weight: 600;
    font-family: '微软雅黑';
    text-align: center;
  }
}
.personalInfo-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
  .personalInfo-item {
    display: flex;
    align-items: center;
    width: 200px;
    font-weight: 400;
    color: #000000;
    font-family: '微软雅黑';
    font-size: 14px;
    img {
      width: 16px;
      height: 16px;
      margin-right: 12px;
    }
  }
}

.personalInfo-editbtn {
  position: absolute;
  width: 90px;
  height: 32px;
  top: 20px;
  right: 20px;
  border-color: #0c6fff;
  color: #0c6fff;
  .editbtn-container {
    display: flex;
    align-items: center;
    margin-top: -2px;
  }
}
.upload-view {
  width: 120px;
  height: 120px;
  background: #e8e8e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  .emptyAvatar {
    width: 58px;
    height: 58px;
    opacity: 0.6;
  }
  .maskdShow {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    background: #606060b3;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    color: #fff;
    .maskdText {
      width: 120px;
      height: 120px;
      display: inline-block;
      text-align: center;
      line-height: 120px;
    }
    .maskdAginText {
      position: absolute;
      top: 50%;
      left: 30%;
      transform: translate(-50%, -50%);
    }
    .maskdDownText {
      position: absolute;
      top: 50%;
      left: 70%;
      transform: translate(-50%, -50%);
      display: inline-block;
      cursor: pointer;
    }
    .uploadLine {
      width: 1px;
      height: 22px;
      background-color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  //   ::v-deep .app-avatar img{
  //    width: 58px !important;
  //    height: 58px !important;
  //    min-height: 58px !important;
  //    opacity: 0.6
  // }
}

.upload-text {
  font-size: 14px;
  color: #fff;
  background: #606060b3;
  width: 120px;
  height: 120px;
  position: absolute;
  top: 0;
  left: 0;
}
.editbtn {
  width: 16px;
  height: 16px;
}
</style>
