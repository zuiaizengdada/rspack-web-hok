<template>
  <!-- 企微能力开放 -->
  <el-drawer
    :size="728"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    v-on="$listeners"
  >
    <div class="settingDrawer">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">{{ title }}</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div v-loading="loading" class="drawerContent overflowOuto">
        <el-form ref="form" :model="form" :rules="rules" label-width="102px">
          <el-form-item label="选择短信" prop="smsMsgTemplateId">
            <smsMsgTemplateSelect :sms-msg-template-id="form.smsMsgTemplateId" :sms-msg="form.smsMsg" @select="changeSmsTem" />
          </el-form-item>
          <el-form-item v-if="ifShow" label="企微账号" prop="corpUserList">
            <div>
              <selectWeChat :default-user="form.corpUserList" @selected="onhandleSelectWeChat" />
              <div class="tips m-b-16">企微账号离线时，将不再分配客户给此账号，一个任务必须至少有1个账号在线！</div>
              <div v-if="form.corpUserList.length > 0" class="weChatUserBox">
                <div v-for="(item, index) in form.corpUserList" :key="index" class="weChatUser">
                  <span class="userName text_hidden_1" :title="item.userName">{{ item.userName }}</span>
                  <span class="m-r-8">
                    <AppStatus :status="['', 'error', 'error', 'success'][item.onlineFlag]">
                      <span>
                        {{ ['', '没有', '离线', '在线'][item.onlineFlag] }}
                      </span>
                    </AppStatus>
                  </span>
                  <i class="el-icon-close labelDel" @click="delUser(item, index)" />
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item v-if="ifShow" label="企微打标签" prop="labelNameList">
            <div>
              <!-- <el-input v-model="labelInput" maxlength="10" :disabled="form.labelNameList.length >= 5" clearable class="w-200" @keyup.enter.native="addLabel" @input="delNoNumber" /> -->
              <LabelInput
                v-model="labelInput"
                maxlength="10"
                :disabled="form.labelNameList.length >= 5"
                @input="delNoNumber"
                @keyup.enter.native="addLabel"
                @select="labelSelect"
              />
              <div class="tips m-b-16" style="margin-top: 4px">单个标签文字不能超过10个字，最多可新增5个标签！</div>
              <div v-if="form.labelNameList.length > 0" class="labelNameList">
                <el-tag v-for="(item, index) in form.labelNameList" :key="index" class="m-r-16" size="small" closable @close="delLabel(item, index)">{{ item }}</el-tag>
              </div>
            </div>
          </el-form-item>
          <el-form-item v-if="ifShow" label="微信话术" prop="textMsg">
            <el-input v-model="form.textMsg" maxlength="200" type="textarea" show-word-limit style="width: 527px" autosize />
          </el-form-item>
          <el-form-item v-if="ifShow" label="二维码">
            <span class="inputValue">这里是班主任的二维码,以实际发送自动分配</span>
          </el-form-item>
          <el-form-item v-if="ifShow" label="音频" prop="">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="#"
              :limit="1"
              accept=".amr"
              :before-upload="beforeUpload"
              :http-request="onChangeRadio"
              :show-file-list="false"
            >
              <el-button slot="trigger" size="small" class="m-r-20">导入</el-button>
            </el-upload>
            <div class="tips">只能上传1个amr格式并且不大于10M的音频文件,音频时长必须大于20小于60秒!</div>
            <div class="file-list-box m-t-16">
              <div v-if="fileListStatus.status" class="file-list">
                <svg-icon icon-class="mar" class="marIcon" />
                <div class="fileName text_hidden_1">
                  <el-tag v-if="fileListStatus.status === 3" class="m-r-10" size="mini" type="danger">
                    (上传失败)
                  </el-tag>
                  <span class="fileNamevalue text_hidden_1">
                    {{ fileListStatus.name }}
                  </span>
                </div>
                <div class="file-list-del" @click="onRomveFileArray">
                  <i class="el-icon-error" />
                </div>
                <span class="authProgress" :style="{width: `${fileListStatus.authProgress}%`}" />
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="ss-material-box-footer">
        <el-button :loading="loading" size="small" type="primary" @click="sure">确定</el-button>
        <el-button :loading="loading" size="small" @click="close()">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import smsMsgTemplateSelect from './smsMsgTemplateSelect'
import selectWeChat from './selectWeChat'
import AppStatus from '@/components/AppStatus'
import { uploadAudio } from '@/api/file'
import axios from 'axios'
import { recallMsgDetail, recallMsgConfig } from '@/api/privateArea/recall'
import LabelInput from './labelinput'
var BenzAMRRecorder = require('benz-amr-recorder')

export default {
  components: {
    smsMsgTemplateSelect,
    selectWeChat,
    AppStatus,
    LabelInput
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    var validateCorpUser = (rule, value, callback) => {
      const arr = value.filter(v => v.onlineFlag === 3)
      if (arr.length === 0) {
        callback(new Error('至少有一个在线的企微账号'))
      } else {
        callback()
      }
    }
    var validateLabel = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('至少有一个标签'))
      } else {
        Array.from(new Set(value)).length < value.length
        // ES6去重方法
        const newArr = [...new Set(value)]
        if (newArr.length === value.length) {
          callback()
        } else {
          callback(new Error('标签不可重复'))
        }
      }
    }
    return {
      loading: false,
      form: {
        smsMsgTemplateId: '', // 短信模板编号
        corpUserList: [], // 企业微信账号列表
        labelNameList: [], // 设置用户标签
        smsMsg: '', // 手机消息 短信数据
        textMsg: '', // 文本消息 微信话术
        voiceMsgFileName: '', // 语音消息的文件名
        voiceUrl: '' // 语音消息
      },
      labelInput: '',
      rules: {
        smsMsgTemplateId: [
          { required: true, message: '请选择短信模板', trigger: 'blur' }
        ],
        corpUserList: [
          { validator: validateCorpUser, type: 'array', required: true }
        ],
        labelNameList: [
          { validator: validateLabel, type: 'array', required: true, trigger: 'blur' }
        ],
        textMsg: [
          { required: true, message: '请输入微信话术', trigger: 'blur' }
        ]
      },
      corpUserList: [],
      fileListStatus: {
        status: 0, // 0 无上传数据 1. 上传中 2.上传成功 3.上传失败
        name: '', // 文件名称
        authProgress: 0, // 上传进度
        source: null // 请求缓存
      },
      CancelToken: axios.CancelToken
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    ifShow() {
      // return this.form.smsMsg.includes('https://ap.hokkj.cn/ou/${userTaskId}')
      return true
    }
  },
  watch: {
    'visible'(val) {
      val && this.getDetail()
    }
  },
  mounted() {},
  methods: {
    delNoNumber(e) {
      this.labelInput = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    // 点击关闭
    close() {
      console.log('点击关闭')
      this.beforeClose()
      this.$emit('update:visible', false)
    },
    // 短信模板选择
    changeSmsTem(val) {
      console.log(val, '++++')
      this.form.smsMsgTemplateId = val.smsMsgTemplateId
      this.form.smsMsg = val.smsMsg
      this.$refs.form.validateField('smsMsgTemplateId')
    },
    // 选择企微账号
    onhandleSelectWeChat(res) {
      console.log(res)
      this.form.corpUserList = res
      this.$refs.form.validateField('corpUserList')
    },
    addLabel() {
      if (!this.labelInput) {
        return
      }
      this.form.labelNameList.push(this.labelInput)
      this.labelInput = ''
      this.$refs.form.validateField('labelNameList')
    },
    labelSelect(val) {
      this.form.labelNameList.push(val)
      this.labelInput = ''
      this.$refs.form.validateField('labelNameList')
    },
    onChangeRadio(e) {
      this.$refs.upload && this.$refs.upload.clearFiles()
      // 上传音频文件
      const selectFile = e.file
      if (!selectFile) {
        alert('请先选择需要上传的文件!')
        return
      }
      if (!/\.(amr)$/.test(selectFile.name)) {
        return this.$message.error('请上传允许的格式的文件amr!')
      }
      this.checkDuration(selectFile).then(() => {
        this.fileListStatus = {
          status: 1,
          name: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix}`,
          authProgress: 0,
          source: this.CancelToken.source()
        }
        const formData = new FormData()
        formData.append('file', selectFile)
        uploadAudio(formData, (progressEvent) => {
          const Progress = ((progressEvent.loaded / progressEvent.total) * 100) | 0
          if (Progress === 100) {
            this.fileListStatus.authProgress = 99
          } else {
            this.fileListStatus.authProgress = Progress
          }
        }, this.fileListStatus.source.token).then(res => {
          this.form.voiceUrl = res.data.url
          this.form.voiceMsgFileName = selectFile.name
          this.fileListStatus.authProgress = 100
          this.fileListStatus.status = 2
          console.log('成功')
          this.$refs.upload.clearFiles()
        }).catch(() => {
          this.$refs.upload.clearFiles()
          this.fileListStatus.name = selectFile.name
          this.fileListStatus.status = 3
        })
      })
    },
    beforeUpload(file) {
      console.log(file)
      // 限制上传文件大小 500M
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt10M
    },
    // 校验时长
    checkDuration(file) {
      var amr = new BenzAMRRecorder()
      return amr.initWithBlob(file).then(() => {
        const amrDuration = amr.getDuration()
        console.log(amrDuration, 'amrDuration')
        if (amrDuration <= 20 || amrDuration >= 60) {
          this.$message.error('音频时长必须大于20小于60秒!')
          return Promise.reject('音频时长必须大于20小于60秒!')
        } else {
          return true
        }
      })
    },
    // 点击删除音频
    onRomveFileArray() {
      if (this.fileListStatus.status === 1) {
        return this.fileListStatus.source.cancel('cancel')
      }
      this.fileListStatus = {
        status: 0,
        name: '',
        authProgress: 0,
        source: null
      }
      this.form.voiceMsgFileName = ''
      this.form.voiceUrl = ''
    },
    // 点击删除标签
    delLabel(item, index) {
      this.form.labelNameList.splice(index, 1)
    },
    // 点击删除企微账号
    delUser(item, index) {
      this.form.corpUserList.splice(index, 1)
    },
    beforeClose() {
      console.log('123')
      if (this.fileListStatus.status === 1) {
        this.fileListStatus.source.cancel('cancel')
      }
      this.form = {
        smsMsgTemplateId: '', // 短信模板编号
        corpUserList: [], // 企业微信账号列表
        labelNameList: [], // 设置用户标签
        smsMsg: '', // 手机消息 短信数据
        textMsg: '', // 文本消息 微信话术
        voiceMsgFileName: '', // 语音消息的文件名
        voiceUrl: '' // 语音消息
      }
      this.fileListStatus = {
        status: 0, // 0 无上传数据 1. 上传中 2.上传成功 3.上传失败
        name: '', // 文件名称
        authProgress: 0, // 上传进度
        source: null // 请求缓存
      }
      this.$refs.form && this.$refs.form.clearValidate()
    },

    sure() {
      if (this.fileListStatus.status === 1) {
        return this.$delModal({
          tips: `还有文件在上传中，确定提交?`,
          sureBtnBgColor: '#0C6FFF',
          success: () => {
            this.fileListStatus.source.cancel('cancel')
            this.send()
          }
        })
      } else {
        this.send()
      }
    },
    // 发送请求
    send() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 发送请求
          console.log('发送请求')
          this.loading = true
          const corpUserIdList = []
          this.form.corpUserList.forEach(e => {
            corpUserIdList.push(e.userId)
          })
          console.log(this.form.corpUserList)
          const data = {
            corpUserIdList,
            ...this.form
          }
          recallMsgConfig(data).then(res => {
            this.loading = true
            this.$notify({
              title: '提示',
              message: '提交成功',
              type: 'success'
            })
            this.close()
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取客服话术设置详情
    getDetail() {
      this.loading = true
      recallMsgDetail().then(res => {
        console.log(res)
        const corpUserList = []
        res.data.corpUserList && res.data.corpUserList.forEach(v => {
          corpUserList.push({
            userId: v.corpUserId,
            userName: v.userName,
            onlineFlag: v.onlineStatus
          })
        })
        this.loading = false
        this.form = {
          ...this.form,
          ...res.data,
          corpUserList
        }
        if (res.data.voiceUrl) {
          this.fileListStatus = {
            status: 2, // 0 无上传数据 1. 上传中 2.上传成功 3.上传失败
            name: res.data.voiceMsgFileName, // 文件名称
            authProgress: 100, // 上传进度
            source: null // 请求缓存
          }
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.settingDrawer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #FFFFFF;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .drawerContent {
    flex: 1 0 0;
    padding: 20px 20px 0;
    display: flex;
    flex-direction: column;
    .inputValue {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 22px;
    }
    .weChatUserBox {
      margin-top: 16px;
      width: 527px;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px dashed #979797;
      padding: 8px 16px;
      display: flex;
      flex-wrap: wrap;
      .weChatUser {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 144px;
        background: #E6F4FF;
        border-radius: 4px;
        padding: 0 8px;
        color: #999999;
        margin-right: 16px;
        margin-bottom: 8px;
        margin-top: 8px;
        .userName {
          width: 66px;
          color: #333;
        }
      }
    }
    .labelNameList {
      margin-top: 16px;
      width: 528px;
      background: #FFFFFF;
      border-radius: 6px;
      border: 1px dashed #979797;
      padding: 18px 16px;
    }
  }
  .ss-material-box-footer {
    padding-right: 18px;
    border-top: 1px solid #E7E7E7;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #999999;
  line-height: 20px;
}
.labelDel {
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.file-list-box {
  .file-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 528px;
    height: 44px;
    border-radius: 4px;
    border: 1px solid #EFF2F6;
    padding: 0 12px;
    position: relative;
    .marIcon {
      z-index: 2;
      font-size: 24px;
      margin-right: 12px;
    }
    .fileName {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
      width: 460px;
      z-index: 2;
      display: flex;
      align-items: center;
      .fileNamevalue {
        display: inline-block;
        max-width: 300px;
      }
    }
    .file-list-del {
      cursor: pointer;
      z-index: 2;
      .el-icon-error {
        color: #999999;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}

.authProgress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #0C6FFF;
  transition: width .3s initial;
}
</style>
