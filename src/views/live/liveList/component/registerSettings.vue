<template>
  <div v-loading="pageloading" class="registerSettings-page">
    <div>
      <registerMobile :img-list="imgList" :live-info="detail" :cover-img-url="form.coverImgUrl" />
    </div>
    <div class="registerSettings-form">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto" size="small">
        <el-form-item label="是否需要报名页" prop="applyPageFlag">
          <el-switch
            v-model="form.applyPageFlag"
            :disabled="isEdit || detail.feesType === 2"
            :active-value="1"
            :inactive-value="0"
            @change="onApplyPageFlagChange"
          />
        </el-form-item>
        <el-form-item label="直播封面" prop="coverImgUrl">
          <template>
            <upload
              key="MUpload"
              ref="MUpload"
              :disabled="isEdit"
              :width="160"
              :height="120"
              accept=".jpg,.jpeg,.png"
              :before-upload="beforeUpload"
              :max-length="1"
              :get-oss-c-onfig-api="getLiveOssCConfig"
              oss-teacher-folder="hok_liveRoom"
              @change="fileChange"
            />
            <div class="formTips" style="margin-left: 0px">建议图片比例16:9，支持 jpg、png 、jpeg格式，大小不超过2M，最佳分辨率750*420px。</div>
          </template>
        </el-form-item>
        <!-- <el-form-item v-if="form.applyPageFlag !== 0" label="是否允许直播结束报名" prop="applyPageFlag" label-width="160px">
          <el-switch
            v-model="form.applyLiveEnd "
            :disabled="isEdit || form.applyPageFlag === 0"
          />
        </el-form-item> -->
        <el-form-item label="上传报名详情页" class="marginBottom_0">
          <registerUpload ref="registerUpload" :is-edit="isEdit" @change="uploadChange" />
        </el-form-item>
        <el-form-item label="需要手机号或邮箱登录" prop="applyPhoneFlag">
          <el-switch
            v-model="form.applyPhoneFlag"
            :active-value="1"
            :disabled="isEdit || detail.feesType === 2"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item v-if="form.applyPhoneFlag === 1" label="关注公众号" prop="applyOfficialFlag">
          <el-radio-group v-model="form.applyOfficialFlag" :disabled="isEdit">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">打开</el-radio>
            <el-radio :label="2">强制关注</el-radio>
          </el-radio-group>
          <div v-if="[1,2].includes(form.applyOfficialFlag)" class="officialFlag-container marginTop_8">
            <el-form-item
              label="选择公众号"
              prop="applyOfficialId"
              :rules="{
                required: true, message: '请选择选择公众号', trigger: 'change'
              }"
              class="marginBottom_0 marginTop_16"
              label-width="95px"
            >
              <el-select v-model="form.applyOfficialId" clearable :disabled="isEdit" @change="officialListChange">
                <el-option
                  v-for="item in officialList"
                  :key="item.officialId"
                  :label="item.officialName"
                  :value="item.officialId+''"
                />
              </el-select>
              <img v-if="form.applyOfficialId" width="88px" height="88px" class="officialFlag-img" :src="selectQrcodeUrl" />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="消息通知">
          <el-checkbox-group v-model="msgType" :disabled="isEdit" @change="msgTypeChange">
            <el-checkbox label="1" :disabled="disablemsgType.includes('1')">短信通知</el-checkbox>
            <el-checkbox label="2" :disabled="msgTypeApplyOfficialDisable ">公众号通知</el-checkbox>
          </el-checkbox-group>
          <div v-if="msgType.length" class="officialFlag-container">
            <applyMsgs v-for="item in msgType" :key="item" :ref="`applyMsgsObj${item}`" :is-edit="isEdit" :config="applyMsgsObj[item]" :apply-official-id="form.applyOfficialId" :class="{'applyMsgs-line': msgType.length === 2}" />
          </div>
        </el-form-item>
        <el-form-item label="下一场直播预告">
          <el-button
            type="primary"
            size="small"
            :disabled="isEdit"
            @click="showAddLiveRoomDialog"
          >
            选择直播间
          </el-button>
          <div v-if="form.liveRoomTrailers.length > 0" class="labelLiveRoomList">
            <el-tag v-for="(item, index) in form.liveRoomTrailers" :key="index" class="m-r-16 labelLiveRoomList-item" size="small" :closable="!isEdit" @close="delLiveRoomLabel(item, index)">
              {{ item.name }} <span>{{ renderTearch(item.realityTeacherUserName) }}</span>  <span> {{ moment(item.startTime).format('YYYY-MM-DD HH:mm') }}</span>
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="registerSettings_footer">
      <el-button v-if="isEdit" key="edit" size="small" type="primary" plain @click="edit">编辑</el-button>
      <el-button v-else key="save" size="small" type="primary" @click="sure">保存</el-button>
      <el-button size="small" :disabled="isEdit" @click="clear">重置</el-button>
    </div>
    <addLiveRoomDialog :config="addLiveRoomDialogConfig" @select="handleLiveRoomSelect" />
  </div>
</template>

<script>
import { applyConfigDetailAjax, editApplyConfigAjax, officialListAjax } from '@/api/liveRoom/register'
import addLiveRoomDialog from './addLiveRoomDialog.vue'
import registerMobile from './registerMobile.vue'
import { getFileType } from '@/utils/index'
import registerUpload from './registerUpload/index.vue'
import applyMsgs from './applyMsgs.vue'
import { getLiveOssCConfig } from '@/api/liveRoom/index'
import moment from 'moment'
import upload from './upload.vue'
export default {
  components: {
    addLiveRoomDialog,
    registerMobile,
    registerUpload,
    applyMsgs,
    upload
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      getLiveOssCConfig,
      form: {
        applyPageFlag: 1,
        applyLiveEnd: false,
        applyImgUrl: '',
        applyPhoneFlag: 1,
        applyOfficialFlag: 0,
        applyOfficialId: '',
        liveRoomTrailers: [],
        applyMsgs: [],
        coverImgUrl: '' // 直播封面图
      },
      isEdit: false,
      rules: {},
      msgType: [],
      applyMsgsObj: {
        '1': {
          msgType: 1,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 1,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            isSent: 0
          }]
        },
        '2': {
          msgType: 2,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 1,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            isSent: 0
          }]
        }
      },
      addLiveRoomDialogConfig: {
        visible: false,
        title: '选择直播间',
        liveRoomId: '',
        chooseList: []
      },
      imgList: [], // 手机模型的图片
      officialList: [], // 公众号二维码
      selectQrcodeUrl: '', // 选中的公众号二维码链接
      pageloading: false,
      disabledMsgsObj: {}, // 禁止的通知消息
      disablemsgType: []
    }
  },
  computed: {
    msgTypeApplyOfficialDisable() {
      return !this.form.applyOfficialId || [0].includes(this.form.applyOfficialFlag) || this.disablemsgType.includes('2') || this.form.applyPhoneFlag === 0
    }
  },
  watch: {
    'form.applyPhoneFlag' (val) {
      if (val === 0) {
        !this.disablemsgType.includes('2') && (this.msgType = this.msgType.filter(item => item !== '2'))// 清空勾选的公众号通知
      }
    },
    'form.applyOfficialFlag' (val) {
      if (val === 0) {
        // this.form.applyOfficialId = ''
        !this.disablemsgType.includes('2') && (this.msgType = this.msgType.filter(item => item !== '2'))// 清空勾选的公众号通知
      }
    },
    'form.applyOfficialId' (val) {
      if (val === '') {
        !this.disablemsgType.includes('2') && (this.msgType = this.msgType.filter(item => item !== '2')) // 清空勾选的公众号通知
      }
    }
  },
  created() {
  },
  mounted() {
    console.log(this.detail, 'detail')
    this.init()
  },
  methods: {
    moment,
    // 初始化
    init() {
      this.applyConfigDetail()
      this.getOfficialList()
    },
    onApplyPageFlagChange(val) {
      if (val === 0) { this.form.applyLiveEnd = false }
    },
    // 获取报名设置详情
    applyConfigDetail() {
      this.pageloading = true
      this.initApplyMsgsObj()
      const liveRoomId = this.$route.params.id
      applyConfigDetailAjax({ liveRoomId }).then(async res => {
        if (res.code === 1) {
          const { applyImgUrl, applyMsgs, applyOfficialId, coverImgUrl } = res.data
          this.form = res.data
          // 回显报名详情页的图片
          if (applyImgUrl) {
            const applyImgUrlList = applyImgUrl.split(',').map(item => {
              return {
                url: item,
                status: 3
              }
            })
            this.$refs.registerUpload.setFileList(applyImgUrlList)
            // 回显手机模型的图片
            this.uploadChange(applyImgUrlList)
          }
          // 回显消息通知
          if (applyMsgs.length) {
            this.applyMsgsObj = this.handleGetApplyMsgs(applyMsgs)
          }
          // 回显公众号二维码
          if (applyOfficialId) {
            await this.getOfficialList()
            this.officialListChange(applyOfficialId)
          }
          if (coverImgUrl) {
            this.$refs.MUpload && this.$refs.MUpload.setFileList([{
              status: 3,
              url: coverImgUrl
            }])
          }
        }
      }).finally(() => {
        this.pageloading = false
      })
    },
    // 显示选择直播间dialog
    showAddLiveRoomDialog() {
      this.addLiveRoomDialogConfig.visible = true
      this.addLiveRoomDialogConfig.chooseList = this.form.liveRoomTrailers
      this.addLiveRoomDialogConfig.liveRoomId = this.$route.params.id
    },
    // 选择的直播间
    handleLiveRoomSelect(val) {
      console.log(val)
      val.forEach(item => {
        item.liveRoomId = item.id
      })
      this.form.liveRoomTrailers.push(...val)
      console.log(this.form.liveRoomTrailers)
    },
    // 删除选择的直播间
    delLiveRoomLabel(item, index) {
      this.form.liveRoomTrailers.splice(index, 1)
    },
    // 编辑 解除禁止状态
    edit() {
      this.isEdit = false
      this.$refs.MUpload && this.$refs.MUpload.setFileList([{
        status: 3,
        url: this.form.coverImgUrl
      }])
    },
    // 保存
    sure() {
      const v1 = new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) resolve()
        })
      })
      const v2 = new Promise((resolve, reject) => {
        this.$refs.applyMsgsObj1?.[0]?.validate((valid) => {
          if (valid) resolve()
        })
      })
      const v3 = new Promise((resolve, reject) => {
        this.$refs.applyMsgsObj2?.[0]?.validate((valid) => {
          if (valid) resolve()
        })
      })
      const promiseList = []
      promiseList.push(v1)
      this.msgType.includes('1') && promiseList.push(v2)

      this.msgType.includes('2') && promiseList.push(v3)

      Promise.all(promiseList).then(() => {
        const params = JSON.parse(JSON.stringify(this.form))
        params.liveRoomId = this.$route.params.id
        params.applyImgUrl = this.imgList.join(',')
        params.liveRoomTrailers = this.form.liveRoomTrailers.map(item => item.liveRoomId)
        params.applyMsgs = this.handleSureApplyMsgs()
        editApplyConfigAjax(params).then(res => {
          if (res.code === 1 && res.success === true) {
            this.isEdit = true
            this.applyConfigDetail()
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1500
            })
          }
        })
      })
    },
    // 重置
    clear() {
      this.form = {
        applyPageFlag: 1,
        applyImgUrl: '',
        applyPhoneFlag: 1,
        applyOfficialFlag: 0,
        applyOfficialId: '',
        liveRoomTrailers: [],
        applyMsgs: []
      }

      this.msgType = this.disablemsgType
      this.applyMsgsObj = Object.keys(this.disabledMsgsObj).length > 0 ? this.disabledMsgsObj
        : {
          '1': {
            msgType: 1,
            sendMsgFlag: 1,
            applyMsgs: [{
              timeType: 1,
              timeMinute: '',
              msgTemplateId: '',
              id: '',
              isSent: 0
            }]
          },
          '2': {
            msgType: 2,
            sendMsgFlag: 1,
            applyMsgs: [{
              timeType: 1,
              timeMinute: '',
              msgTemplateId: '',
              id: '',
              isSent: 0
            }]
          }
        }
      // this.msgType = []
      // this.applyMsgsObj = {
      //   '1': {
      //     msgType: 1,
      //     sendMsgFlag: 0,
      //     applyMsgs: [{
      //       timeType: 1,
      //       timeMinute: '',
      //       msgTemplateId: '',
      //       id: '',
      //       isSent: 0
      //     }]
      //   },
      //   '2': {
      //     msgType: 2,
      //     sendMsgFlag: 0,
      //     applyMsgs: [{
      //       timeType: 1,
      //       timeMinute: '',
      //       msgTemplateId: '',
      //       id: '',
      //       isSent: 0
      //     }]
      //   }
      // }
      this.imgList = []
      // this.officialList = []
      this.selectQrcodeUrl = ''
      this.$refs.registerUpload.setFileList([])
      this.form.coverImgUrl = 'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg'
      this.$refs.MUpload.setFileList([{
        status: 3,
        url: 'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg'
      }])
    },
    // 处理回显的消息通知参数
    handleGetApplyMsgs(list) {
      const applyMsgs1 = list.filter(item => item.msgType === 1)
      const applyMsgs2 = list.filter(item => item.msgType === 2)
      const msgType = []
      const applyMsgsObj = {}
      if (applyMsgs1.length > 0) {
        applyMsgsObj['1'] = {
          msgType: 1,
          sendMsgFlag: applyMsgs1[0].sendMsgFlag,
          applyMsgs: applyMsgs1
        }
        msgType.push('1')
      } else {
        applyMsgsObj['1'] = {
          msgType: 1,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 1,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            isSent: 0
          }]
        }
      }

      if (applyMsgs2.length > 0) {
        applyMsgsObj['2'] = {
          msgType: 2,
          sendMsgFlag: applyMsgs2[0].sendMsgFlag,
          applyMsgs: applyMsgs2
        }
        msgType.push('2')
      } else {
        applyMsgsObj['2'] = {
          msgType: 2,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 2,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            isSent: 0
          }]
        }
      }
      this.msgType = msgType // 回显消息类型多选

      const disabledMsgsObj = {} // 禁止的通知消息
      const disablemsgType = []
      const disabledMsgs1 = applyMsgs1?.filter(item => item.isSent === 1) || []
      const disabledMsgs2 = applyMsgs2?.filter(item => item.isSent === 1) || []
      if (disabledMsgs1.length > 0) {
        disabledMsgsObj['1'] = {
          msgType: 1,
          sendMsgFlag: applyMsgs1[0].sendMsgFlag,
          applyMsgs: disabledMsgs1
        }
        disablemsgType.push('1')
      } else {
        disabledMsgsObj['1'] = {
          msgType: 1,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 1,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            isSent: 0
          }]
        }
      }
      if (disabledMsgs2.length > 0) {
        disabledMsgsObj['2'] = {
          msgType: 2,
          sendMsgFlag: applyMsgs2[0].sendMsgFlag,
          applyMsgs: disabledMsgs2
        }
        disablemsgType.push('2')
      } else {
        disabledMsgsObj['2'] = {
          msgType: 2,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 2,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            isSent: 0
          }]
        }
      }
      this.disablemsgType = disablemsgType
      this.disabledMsgsObj = disabledMsgsObj
      return applyMsgsObj
    },
    // 处理提交的消息通知参数
    handleSureApplyMsgs() {
      const applyMsgs1 = this.$refs.applyMsgsObj1?.[0]?.getApplyMsgs()
      const applyMsgs2 = this.$refs.applyMsgsObj2?.[0]?.getApplyMsgs()
      const list = []
      applyMsgs1 && applyMsgs1.applyMsgs.reduce((pre, next) => {
        list.push({
          timeMinute: next.timeMinute || '',
          timeType: next.timeType,
          msgTemplateId: next.msgTemplateId || '',
          id: next.id || '',
          isSent: next.isSent,
          msgType: applyMsgs1.msgType,
          sendMsgFlag: applyMsgs1.sendMsgFlag
        })
        return pre
      }, [])
      applyMsgs2 && applyMsgs2.applyMsgs.reduce((pre, next) => {
        list.push({
          timeMinute: next.timeMinute || '',
          timeType: next.timeType,
          msgTemplateId: next.msgTemplateId || '',
          id: next.id || '',
          isSent: next.isSent,
          msgType: applyMsgs2.msgType,
          sendMsgFlag: applyMsgs2.sendMsgFlag
        })
        return pre
      }, [])

      return list
    },
    renderTearch(arr) {
      if (!arr) {
        return ''
      }
      const value = arr.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next}`)
        return pre
      }, '')
      return value
    },
    // 上传报名页图片change
    uploadChange(e) {
      const completeFileList = e.reduce((pre, next) => {
        next.status === 3 && pre.push(next.url)
        return pre
      }, [])
      this.imgList = completeFileList
    },
    // 获取公众号二维码
    getOfficialList() {
      return new Promise((resolve, reject) => {
        officialListAjax().then(res => {
          if (res.code === 1) {
            this.officialList = res.data
            resolve()
          }
        }).catch(() => {
          reject()
        })
      })
    },
    // 公众号change
    officialListChange(e) {
      // eslint-disable-next-line
      this.selectQrcodeUrl = this.officialList.find(item => item.officialId == e)?.qrcodeUrl
    },
    // 消息通知change
    msgTypeChange(e) {

    },
    beforeUpload(file) {
      // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2M!')
      }
      return isIMAGE && isLt2M
    },
    fileChange(res) {
      console.log(res, '上传文件改变触发')
      if (res.length > 0) {
        this.form.coverImgUrl = res[0].url
      }
    },
    initApplyMsgsObj() {
      this.applyMsgsObj = {
        '1': {
          msgType: 1,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 1,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            isSent: 0
          }]
        },
        '2': {
          msgType: 2,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 1,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            isSent: 0
          }]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .registerSettings-page {
    display: flex;
    position: relative;
    padding: 5px 0 80px 100px;
  }
  .officialFlag-container {
    border: 1px solid #E1E6ED;
    padding: 0px 16px 16px 16px;
    width: 468px;
     border-radius: 6px;
    position: relative;
    .officialFlag-img {
      margin-top: 12px;
       border: 1px solid #dcdcdc;
      border-radius: 4px;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.5) inset;
    }
  }
  .registerSettings-form {
    // height: calc(100vh - 440px);
    // overflow: hidden;
    // overflow-y: scroll;
    flex: 1;
    margin-left: 100px;
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .marginTop_8 {
    margin-top: 8px;
  }
  .marginBottom_0 {
    margin-bottom: 0px !important;
  }
  .marginTop_16 {
    margin-top: 16px;
  }
  .registerSettings_footer {
     position: absolute;
     bottom: -8px;
     left: 0;
     width: 100%;
    //  width: calc(100% - 17px);
     height: 50px;
     box-shadow: 0px -1px 4px 0px rgba(0,0,0,0.05);
     border-radius: 0px 0px 10px 10px;
     background-color: #fff;
     z-index: 9;
     text-align:center;
     display: flex;
     align-items: center;
     justify-content: center;
  }
  .labelLiveRoomList {
      margin-top: 16px;
      width: 448px;
      background: #FFFFFF;
      border-radius: 6px;
      border: 1px solid #E1E6ED;
      padding: 16px 16px 0 16px;
      display: flex;
      flex-direction: column;
      .labelLiveRoomList-item {
        margin-bottom: 16px;
        width: max-content;
      }
  }
  .applyMsgs-line:nth-child(odd) {
    border-bottom: 1px solid #E1E6ED;
    padding-bottom: 10px;
  }
  .formTips {
    margin-top: 8px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #999999;
    line-height: 20px;
  }
</style>
