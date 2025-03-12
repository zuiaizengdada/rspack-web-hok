<template>
  <AppDialog
    v-model="visible"
    title="批量导入"
    width="540px"
    :loading="loading"
    height="auto"
    :top="top"
    @beforeClose="onhandleCancel"
  >
    <div v-loading="loading" class="exportScript overflowOuto">
      <div class="stepNav">
        <div :class="{active: active > 0}" class="stepItem">
          <div class="circular" />
          上传文档
        </div>
        <div class="line" />
        <div :class="{active: active > 1}" class="stepItem">
          <div class="circular" />
          导入数据
        </div>
        <div class="line" />
        <div :class="{active: active > 2}" class="stepItem">
          <div v-if="active < 3 && status === 0" class="circular" />
          <i v-if="status === 2" class="el-icon-success m-r-10" style="font-size: 16px;color: #0C6FFF;" />
          <i v-if="status === 1" class="el-icon-error m-r-10" style="font-size: 16px;color: #F64141;" />
          <span :style="{color: {0: '#777777', 1: '#F53F3F', 2: '#0C6FFF'}[status]}">{{ status === 1 ? '失败' : '完成' }}</span>
        </div>
      </div>
      <template v-if="active === 1">
        <el-form v-if="visible" ref="form" :model="form" :rules="rules" label-width="80px" size="mini" class="add-form">
          <el-form-item label="选择分类" :prop="form.sceneType === 3 ? 'groupName' :'groupId'">
            <div class="flex">
              <el-select v-model="form.sceneType" :disabled="isEditForm" style="width:127px; margin-right:10px">
                <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
              <template v-if="form.sceneType === 1">
                <el-select
                  v-model="form.groupId"
                  style="font-size: 14px"
                  class="select-teacher"
                  filterable
                  clearable
                  remote
                  :remote-method="ipQueryByName"
                  :popper-append-to-body="false"
                  placeholder="请选择IP老师"
                  :disabled="isEditForm"
                  @change="ipChange"
                >
                  <el-option
                    v-for="item in ipOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
              <template v-else-if="form.sceneType === 2">
                <el-select
                  v-model="form.groupId"
                  style="font-size: 14px"
                  class="select-teacher"
                  filterable
                  clearable
                  remote
                  :remote-method="videoQueryByName"
                  :popper-append-to-body="false"
                  placeholder="请搜索选择视频素材"
                  :disabled="isEditForm"
                  @change="ipChange"
                >
                  <el-option
                    v-for="item in ipOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
              <template v-else-if="form.sceneType === 3">
                <el-input v-model="form.groupName" placeholder="请输入分组名称" :disabled="isEditForm" />
              </template>
            </div>
          </el-form-item>

          <div class="m-t-16 downUrl">
            <span class="tips">导入模板下载</span>
            <span v-loading="downloading" class="m-r-10" @click="getImportFileUrl">导入模板.excel</span>
            <svg-icon icon-class="down" @click="getImportFileUrl" />
          </div>
          <div class="m-t-20 tips m-b-16">选择需要导入的数据文件<span class="remake">注：导入文件为Excle文件，最大导入为1000条。</span></div>
          <upload
            ref="MUpload"
            width="160"
            height="120"
            accept=".xlsx, .xlsm, .xls"
            :before-upload="beforeUpload"
            :max-length="1"
            :upload-show-arr="['重新上传', '查看文件']"
            oss-teacher-folder="hok_liveRoom"
            @onClick="onOpenUrl"
            @change="fileChange"
          />

        </el-form>
      </template>
      <template v-if="active === 2 || active === 3">
        <div class="exportPercent">
          <div class="exportPercentLeft">
            <img src="~@/assets/image/excel.png" alt="" style="width: 48px;height: 48px;" />
          </div>
          <div class="exportPercentRight">
            <el-progress :percentage="percent" :color="status === 1 ? '#F53F3F' : '#0C6FFF'" />
            <div v-if="status === 0" class="exportPercentText">数据导入中{{ percent }}%</div>
            <div v-else-if="status === 1" class="exportErrorIcon"><i class="el-icon-error" /> 数据导入失败 {{ errMessage }}</div>
            <div v-if="status === 2" class="exportSuccessIcon">
              <i class="el-icon-success" /> 数据导入完成
            </div>
            <div v-if="status !== 0 && !errMessage" class="exportErrorTips">
              <span style="color: #0C6FFF">{{ sucessNum }}</span><span>条成功</span>,
              <span style="color: #F53F3F" class="exportErrorIcon">{{ failNum }}</span><span>条失败</span>
            </div>
            <div v-if="errorLink" class="exportErrorTips">下载错误报告，查看失败原因</div>
            <div v-if="errorLink" class="downErrorExcel m-t-10">
              <span class="errorExcelName">{{ excelName }}</span>
              <div class="downErrorBtn" @click="downError">
                <svg-icon icon-class="down" />
                下载
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div slot="footer" class="exportScriptFooter">
      <el-button v-if="active === 1" size="small" type="primary" :loading="loading" @click="onhandleStrtExport">开始导入</el-button>
      <el-button size="small" :loading="loading" @click="onhandleCancel">
        {{ active === 1 ? '取消' : '关闭' }}
      </el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import upload from '@/components/AppUploadView/upload.vue'
import { getFileType } from '@/utils/index'
import axios from 'axios'
import { sensitiveImportApi, getVideoInfo } from '@/api/liveRoom/sensitive.js'
import { teacherQueryByName } from '@/api/tearchCenter'

import moment from 'moment'
export default {
  components: {
    AppDialog,
    upload
  },
  data() {
    return {
      loading: false,
      visible: false,
      value: '',
      active: 1,
      top: '114px',
      downloading: false,
      source: null,
      CancelToken: axios.CancelToken,
      percent: 100,
      scriptId: '',
      status: 0, // 0无状态 1失败 2成功
      url: '',
      file: null,
      excelName: '',
      errorLink: '',
      failNum: 0,
      limit: 0,
      offset: 0,
      sucessNum: 0,
      form: {
        'groupId': '',
        'groupName': '',
        'sceneType': 1
      },
      options: [
        // { label: '通用敏感词', value: 0 },
        { label: 'IP老师', value: 1 },
        { label: '视频名称', value: 2 },
        { label: '分组名称', value: 3 }
      ],
      ipOptions: [],
      rules: {},
      isEditForm: false,
      errMessage: '', // 错误提示
      oldSceneType: '', // 传入的敏感词类型
      success: () => {}
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        this.init()
      },
      deep: true,
      immediate: true
    },
    'form.sceneType': {
      handler(val) {
        if (val) {
          const rule = {}
          if (val === 3) {
            rule['groupName'] = [
              { required: true, message: '请输入分组名称', trigger: 'blur' }
            ]
          } else {
            rule['groupId'] = [
              { required: true, message: `请选择${val === 1 ? 'IP老师' : '视频名称'}`, trigger: 'change' }
            ]
          }
          this.rules = rule
          this.form.groupId = ''
          this.form.groupName = ''
          this.ipOptions = []
          this.$nextTick(() => {
            this.$refs?.form?.clearValidate(['groupName', 'groupId'])
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 450) / 2 + 'px'
  },
  methods: {
    openDialog(data) {
      this.form = {
        'groupId': '',
        'groupName': '',
        'sceneType': data.sceneType
      }
      this.oldSceneType = data.sceneType
      this.errMessage = ''
      this.visible = true
    },
    init() {
      this.url = ''
      this.$refs.MUpload && this.$refs.MUpload.setFileList([])
    },
    sure() {
      this.visible = false
      this.success && this.success(this.value)
    },
    beforeUpload(file) {
      const type = getFileType(file.name).suffix
      const isExcel = ['xls', 'xlsx'].includes(type)
      if (!isExcel) {
        this.$message.error(`仅支持上传xls,xlsx文件!`)
      }
      return isExcel
    },
    fileChange(res) {
      console.log(res, 'res')
      if (res.length > 0) {
        this.url = res[0].url
        this.file = res[0].file
      }
    },
    // 点击查看文件
    onOpenUrl(res) {
    //   console.log(res, 'res')
      const url = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.url
      window.open(url)
    },
    // 点击开始导入按钮
    onhandleStrtExport() {
      console.log('点击开始导入')
      const that = this
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if (!that.url) {
          return that.$message.error('请选择文件')
        }
        that.active = 1
        that.source = that.CancelToken.source()
        const formData = new FormData()
        formData.append('file', that.file)
        if (that.form.groupId) formData.append('groupId', that.form.groupId)
        formData.append('groupName', that.form.groupName)
        formData.append('sceneType', that.form.sceneType)
        sensitiveImportApi(formData,
          (progressEvent) => {
            const percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0
            // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
            if (percent === 100) {
              that.percent = 99
            } else {
              that.percent = percent
            }
            console.log(percent, '进度')
          },
          that.source.token
        ).then(res => {
          that.percent = 100
          if (res.data.failFile) {
            that.active = 2
            console.log('上传失败')
            const arr = res.data.failFile.split('/')
            if (arr.length > 0) {
              that.excelName = arr[arr.length - 1]
            }
            that.errorLink = res.data.failFile
            that.sucessNum = res.data.successCount
            that.failNum = res.data.failCount
            that.status = 2
          } else {
            that.active = 2
            console.log(res, '上传成功')
            that.success && that.success()
            that.errorLink = ''
            that.sucessNum = res.data.successCount
            that.failNum = res.data.failCount
            that.status = 2
          }
          this.$emit('search')
        }).catch((err) => {
          console.log(err, 'err')
          that.active = 3
          console.log('上传失败')
          this.errMessage = err.message
          that.errorLink = ''
          that.status = 1
        })
      })
    },
    // 点击取消按钮
    onhandleCancel() {
      if (this.source) {
        // 取消上一次发出的请求
        this.source.cancel('cancel')
      }
      this.form = {
        'groupId': '',
        'groupName': '',
        'sceneType': 1
      }
      this.visible = false
      this.active = 1
      this.status = 0
      this.success && this.success()
    },
    // 获取导入脚本模板URL
    getImportFileUrl() {
      this.downloading = true
      var newWin = window.open('loading page', '_self')
      newWin.location.href = 'https://hok-o.oss-cn-beijing.aliyuncs.com/edata-live/%E6%95%8F%E6%84%9F%E8%AF%8D%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx' // 成功 重定向到目标页面
      this.downloading = false
    },
    getCurrentTime() {
      return moment().format('YYYYMMDD')
    },
    // 点击下载错误报告
    downError() {
      var newWin = window.open('loading page', '_self')
      newWin.location.href = this.errorLink // 成功 重定向到目标页面
    },
    // IP
    ipQueryByName(query) {
      teacherQueryByName({ name: query }).then(res => {
        this.ipOptions = res.data.map(item => {
          return {
            value: item.teacherId,
            label: item.teacherName
          }
        })
      })
    },
    // 视频素材
    videoQueryByName(query) {
      getVideoInfo({ name: query }).then(res => {
        this.ipOptions = res.data.map(item => {
          return {
            value: item.videoId,
            label: item.videoName
          }
        })
      })
    },
    ipChange(value) {
      if (value) {
      // 处理选择变化的逻辑
        const obj = this.ipOptions.find(item => item.value === value)
        this.form.groupName = obj.label
        // 你可以在这里添加更多的逻辑
      } else {
        this.form.groupName = ''
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.add-form{
  margin-top: 20px;
}
::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #FBFCFE;
      width: 160px;
      height: 120px;
    }
  }
}
.exportScript {
    height: 332px;
    padding: 20px;
    .stepNav {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
        line-height: 24px;
        .line {
            width: 100px;
            height: 1px;
            background: #777777;
            margin-left: 10px;
            margin-right: 10px;
        }
        .stepItem {
            display: flex;
            align-items: center;
            .circular {
                margin-right: 10px;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border:1px solid #E7E9EC;
                background: #fff;
            }
        }
        .active {
            color: #0C6FFF;
            .circular {
                border: 5px solid #0C6FFF;
            }
        }
    }
    .tips {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
        padding-right: 10px;
    }
    .remake {
        margin-left: 8px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
    }
    .downUrl {
       font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0C6FFF;
        line-height: 22px;
        cursor: pointer;
    }
}
.exportScriptFooter {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px;
}
.m-b-16 {
    margin-bottom: 16px;
}
.exportPercent {
  margin-top: 18px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #EFF2F6;
  display: flex;
  padding: 20px;
  .exportPercentLeft {
    width: 48px;
  }
  .exportPercentRight {
    padding-top: 17px;
    flex: 1 0 0;
    padding-left: 20px;
    .exportPercentText {
      margin-top: 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
    .exportErrorIcon {
      margin-top: 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #F53F3F;
    }
    .exportErrorTips {
      margin-top: 10px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
    .downErrorExcel {
      background: #FEECEC;
      border-radius: 4px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .errorExcelName {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #F53F3F;
        line-height: 22px;
        flex: 1 0 0;
      }
      .downErrorBtn {
        width: 60px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0C6FFF;
        line-height: 22px;
        cursor: pointer;
      }
    }
    .exportSuccessIcon {
      margin-top: 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #00B42A;
      line-height: 20px;
    }
  }
}
</style>
