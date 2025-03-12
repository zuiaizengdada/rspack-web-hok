<template>
  <!-- 文件上传区域 -->
  <div class="file-upload">
    <!-- 标题 -->
    <div class="file-title">
      <img class="title-icon" src="@/assets/image/extract-title.png" alt="" />
    </div>

    <!-- 上传区域 -->
    <div class="upload-area">
      <!-- 上传输入框 -->
      <div class="upload-input-box">
        <!-- 文件输入框 -->
        <div class="upload-input">
          <div class="editable-container">
            <div
              ref="editableDiv"
              contenteditable="true"
              class="editable-div"
              @input="handleInput"
              @paste="handlePaste"
              @keydown="handleKeyDown"
            />
            <div v-if="!link" class="placeholder">
              请输入链接或拖动文件到这里上传
            </div>
          </div>
        </div>
        <!-- 文件操作 -->
        <div class="upload-options">
          <label for="file-upload-input">
            <div class="upload-icon-warpper">
              <el-tooltip
                effect="dark"
                content="上传文件"
                placement="top"
                popper-class="custom-zyq-prpper"
              >
                <svg-icon class="icon" icon-class="file-upload" />
              </el-tooltip>
            </div>
          </label>
          <input
            id="file-upload-input"
            type="file"
            style="display: none"
            @change="handleFileUpload"
          />
          <div class="send-icon-warpper">
            <div
              v-if="!link"
              class="disable-cursor"
              effect="dark"
              content="发送链接"
              placement="top"
              popper-class="custom-zyq-prpper"
            >
              <svg-icon
                class="icon disable-click"
                icon-class="send"
                @click="handleSend"
              />
            </div>

            <el-tooltip
              v-else
              effect="dark"
              content="发送链接"
              placement="top"
              popper-class="custom-zyq-prpper"
            >
              <svg-icon
                class="icon"
                :icon-class="link ? 'send_active' : 'send'"
                @click="handleSend"
              />
            </el-tooltip>
          </div>
        </div>

        <!-- 批量提取提示 -->
        <div v-if="isShowBatchExtractTip" class="batch-extract-tip">
          <span>使用【shift + 回车】换行，输入更多链接可批量提取内容</span>
          <span>|</span>
          <i
            class="el-icon-close"
            style="margin-top: 2px"
            @click="isShowBatchExtractTip = false"
          />
        </div>
      </div>
      <!-- 上传文件提示区域 -->
      <div class="upload-tip">
        <div class="tip-item">
          <svg-icon class="tip-item-icon" icon-class="_link" />
          <span>链接支持：</span>
          <div
            v-for="(item, index) in links"
            :key="item.name"
            style="display: flex; align-items: center"
            @click="handlePointClick"
          >
            <a
              :href="item.url"
              class="tip-item-name"
              target="_blank"
            >{{ item.name }}
            </a>
            <div
              v-if="index !== links.length - 1"
              style="
                width: 1px;
                height: 13px;
                background-color: #808080;
                margin: 0 5px;
              "
            />
          </div>
          <el-tooltip
            effect="dark"
            placement="bottom"
            popper-class="custom-zyq-prpper"
          >
            <div slot="content">
              <div class="tool-tip">
                <div
                  v-for="tip in tooltipTips"
                  :key="tip.icon"
                  class="tool-tip-item"
                >
                  <svg-icon class="tool-tip-item-icon" :icon-class="tip.icon" />
                  <p>{{ tip.content }}</p>
                </div>
              </div>
            </div>
            <svg-icon class="question" icon-class="q" />
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 自定义错误弹窗 -->
    <CustomDialog
      :visiable.sync="showCustomDialog"
      :is-more="true"
      content="最多同时上传5个文件，请重新选择"
    />
  </div>
</template>

<script>
import OSS from 'ali-oss'
import { getOssConfig } from '@/api/file'
import { createTask, uploadFailCallback } from '@/api/aigc/chatExtract'
import { links, tooltipTips, formatLimits, linkTypeRegxs } from './config'
import CustomDialog from '../custom-dialog.vue'
import { v4 as uuidv4 } from 'uuid'
import SparkMD5 from 'spark-md5'
import eventBus from '@/utils/eventBus'

export default {
  components: {
    CustomDialog
  },
  props: {
    // 文件上传列表
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 文件链接
      link: '',
      // 网页跳转
      links: [],
      // tooltipTips
      tooltipTips: [],
      // 最大上传文件数量
      maxFiles: 5,
      // ossConfig
      ossConfig: {},
      // 定义文件格式和大小的限制
      formatLimits: {},
      // 自定义错误弹窗
      showCustomDialog: false,
      // 各平台正则
      linkTypeRegxs: [],
      // 当前上传文件Id
      currentUploadingTaskId: '',
      // 阿里云oss
      client: null,
      // 取消上传
      cancel: false,
      // 是否展示批量提取提示
      isShowBatchExtractTip: true
    }
  },
  mounted() {
    // 初始化配置
    this.initConfig()
    eventBus.$on('WordExtractSend', ({ value }) => {
      this.link = value
      this.$refs.editableDiv.innerText = value
    })
  },
  methods: {
    // 初始化配置
    initConfig() {
      // oss配置
      this.setOssConfig()
      // 网页链接
      this.links = links
      // tooltipTips
      this.tooltipTips = tooltipTips
      // 文件格式和大小的限制配置
      this.formatLimits = formatLimits
      // 各平台正则
      this.linkTypeRegxs = linkTypeRegxs
    },

    // 设置ossConfig
    async setOssConfig() {
      const { code, data } = await getOssConfig()

      if (code === 1) {
        this.ossConfig = {
          region: 'oss-accelerate',
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          secure: true,
          bucket: data.ossBucket,
          ossBucketUrl: data.ossBucketUrl,
          ossEndPoint: data.ossEndPoint
        }

        this.client = new OSS(this.ossConfig)
      } else {
        this.$message({
          message: data.msg,
          type: 'warning',
          customClass: 'amap-sug-result'
        })
      }
    },
    // 输入链接
    handleInput(event) {
      this.link = event.target.innerText
    },
    // 复制文案去除背景等 提取纯文案
    handlePaste(event) {
      event.preventDefault()
      const text = event.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
    },
    // 根据文件名获取文件类型
    getFileType(fileName) {
      const extension = fileName.split('.').pop().toLowerCase()
      for (const [type, limits] of Object.entries(this.formatLimits)) {
        if (limits.extensions.includes(extension)) {
          return type
        }
      }
      return 'unknown' // 未知类型
    },
    // 埋点
    handlePointClick() {
      this.$uweb && this.$uweb.setAction('Event_Third_Party_Entry')
    },
    // 移除url参数
    removeUploadIdFromUrl(urlString) {
      // 使用正则表达式删除 URL 中的 `?uploadId=...` 查询参数
      return urlString.replace(/(\?|&)uploadId=[^&]+/, '')
    },
    // 上传阿里OSS
    async uploadOSS(file) {
      const client = new OSS(this.ossConfig)
      this.client = client

      // // 生成随机 UUID
      const fileUuid = uuidv4()
      // // 获取文件名称
      const fileName = file.name
      // 获取文件后缀
      const fileExtension = fileName.split('.').pop()
      // 文件类型
      const fileType = this.getFileType(file.name)
      // 获取当前日期
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      const uploadingFiles = JSON.parse(localStorage.getItem('uploadingFiles'))
      this.currentUploadingTaskId = fileUuid
      const uploadingFileInfo = {
        taskId: this.currentUploadingTaskId,
        title: fileName,
        taskStatus: 'UPLOADING',
        taskType: 'VIDEO'
      }
      uploadingFiles.unshift(uploadingFileInfo)
      localStorage.setItem('uploadingFiles', JSON.stringify(uploadingFiles))
      this.$emit('query')
      const options = {
        // 获取分片上传进度、断点和返回值。
        progress: (p, cpt, res) => {
          if (this.cancel) {
            client.cancel()
            this.cancel = false
          }

          if (p * 100 >= 100) {
            this.$message.success({
              message: `文件${file.name}上传完成`,
              type: 'success',
              customClass: 'amap-sug-result'
            })
          }
        },
        // 设置并发上传的分片数量。
        parallel: 4,
        // 设置分片大小。默认值为1 MB，最小值为100 KB。
        partSize: 1024 * 1024,
        // headers,
        // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
        meta: { year: 2020, people: 'test' },
        mime: 'text/plain'
      }

      const {
        res: { requestUrls, status }
      } = await client.multipartUpload(
        `/assistant/${fileType}/${year}/${month}/${day}/${fileUuid}.${fileExtension}`,
        file,
        {
          ...options
        }
      )

      const url = this.removeUploadIdFromUrl(requestUrls[0])

      if (status === 200) {
        let uploadingFiles = JSON.parse(localStorage.getItem('uploadingFiles'))

        uploadingFiles = uploadingFiles.filter(
          file => file.taskId !== this.currentUploadingTaskId
        )

        localStorage.setItem('uploadingFiles', JSON.stringify(uploadingFiles))
        this.$emit('query')
        return url
      } else {
        const data = {
          fileName
        }
        await uploadFailCallback(data)
        this.$message.error({
          message: `文件${file.name}上传失败`,
          type: 'error',
          customClass: 'amap-sug-result'
        })
      }
    },
    // 取消上传的方法
    uploadCancel() {
      this.cancel = true
    },
    // 检查上传文件格式和大小是否符合要求
    checkFileFormatAndSize(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size

        // 检查文件格式
        let isValidFormat = false
        for (const limits of Object.values(this.formatLimits)) {
          if (limits.extensions.includes(extension)) {
            isValidFormat = true
            // 检查文件大小
            if (fileSize > limits.maxSize) {
              this.$message({
                message: `文件 "${file.name}" 超过了 ${limits.type} 类型文件的大小限制，请重新选择`,
                type: 'warning',
                customClass: 'amap-sug-result'
              })

              return false
            }
          }
        }
        if (!isValidFormat) {
          this.$message({
            message: `文件 "${file.name}" 的格式不支持，请重新选择`,
            type: 'warning',
            customClass: 'amap-sug-result'
          })

          return false
        }
      }
      return true
    },
    handleKeyDown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        this.handleSend(event)
      }
    },
    async uploadFile(file) {
      // 上传阿里OSS 获取文件原始url
      const url = await this.uploadOSS(file)
      // 文件类型
      const fileType = this.getFileType(file.name)

      if (fileType === 'video') {
        this.$uweb?.setAction('Event_Update_File_Video')
      } else if (fileType === 'audio') {
        this.$uweb?.setAction('Event_Update_File_Audio')
      } else if (fileType === 'image') {
        this.$uweb?.setAction('Event_Update_File_Image')
      } else if (fileType === 'doc') {
        this.$uweb?.setAction('Event_Update_File_Doc')
      }

      // 文件名称
      const fileName = file.name
      // 计算文件md5并上传
      this.computeMD5AndUpload(file, url, fileType, fileName)
    },
    // 计算文件md5并上传
    computeMD5AndUpload(file, url, fileType, fileName) {
      const blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice
      const chunkSize = 2097152 // 2MB
      const chunks = Math.ceil(file.size / chunkSize)
      let currentChunk = 0
      const spark = new SparkMD5.ArrayBuffer()
      const fileReader = new FileReader()

      file.cmd5 = true // 文件状态为“计算md5...”

      fileReader.onload = e => {
        spark.append(e.target.result) // Append array buffer
        currentChunk++

        if (currentChunk < chunks) {
          loadNext()
        } else {
          const md5 = spark.end() // 得到md5

          this.createTaskAndRefresh(url, fileType, md5, fileName)
          spark.destroy() // 释放缓存
          file.uniqueIdentifier = md5 // 将文件md5赋值给文件唯一标识
          file.cmd5 = false // 取消计算md5状态
        }
      }

      fileReader.onerror = () => {
        console.warn('oops, something went wrong.')
        file.cancel()
      }

      const loadNext = () => {
        const start = currentChunk * chunkSize
        const end =
          start + chunkSize >= file.size ? file.size : start + chunkSize

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
      }

      loadNext()
    },
    // 手动点击按钮上传文件
    async handleFileUpload(event) {
      this.$uweb && this.$uweb.setAction('Event_Send_Link')
      // 获取选中的文件
      const files = event.target ? event.target.files : event

      // 上传文件数量是否超过1
      const isMoreThanOne = files.length > 1
      if (isMoreThanOne) {
        return this.$message({
          message: `最多上传1个文件，请重新选择`,
          type: 'warning',
          customClass: 'amap-sug-result'
        })
      }

      // 检查文件格式和大小是否符合要求
      const isValidFiles = this.checkFileFormatAndSize(files)
      if (!isValidFiles) return

      // 检查文件数量和提取中的文件数量之和是否超过限制
      const isMoreThanExtractingFiles =
        files.length +
          this.fileList.filter(file => file.taskStatus === 'WAITING').length >
        this.maxFiles
      if (isMoreThanExtractingFiles) {
        return this.$message({
          message: `最多同时存在${this.maxFiles}个正在进行中的任务，请等待任务完成后再添加`,
          type: 'warning',
          customClass: 'amap-sug-result'
        })
      }

      // 检查上传中的文件是否超过5个
      const isMoreThanUploadingFiles =
        JSON.parse(localStorage.getItem('uploadingFiles')).length >= 5
      if (isMoreThanUploadingFiles) {
        return this.$message({
          message: `最多同时上传5个文件，请等待上传完成后再添加`,
          type: 'warning',
          customClass: 'amap-sug-result'
        })
      }

      // 上传文件
      this.uploadFile(files[0])

      // 重置上传输入的值
      if (event.target) {
        event.target.value = ''
      }
      this.$uweb?.setAction('Event_ChatExtract_Sendlink')
    },
    // 判断链接是否是要求平台
    isLinkType(link) {
      return this.linkTypeRegxs.some(regx => regx.test(link))
    },
    // 文件链接上传按钮点击
    async handleSend(event) {
      this.$uweb && this.$uweb.setAction('Event_Send_Link')
      // 阻止默认的回车换行行为
      event.preventDefault()

      const isType = this.isLinkType(this.link)

      if (this.link.includes('douyin')) {
        this.$uweb?.setAction('Event_Send_Link_douyin')
      } else if (this.link.includes('xhs')) {
        this.$uweb?.setAction('Event_Send_Link_xiaohongshu')
      } else if (this.link.includes('kuaishou')) {
        this.$uweb?.setAction('Event_Send_Link_kuaishou')
      } else if (this.link.includes('toutiao')) {
        this.$uweb?.setAction('Event_Send_Link_toutiao')
      } else if (this.link.includes('weibo')) {
        this.$uweb?.setAction('Event_Send_Link_weibo')
      }

      if (!isType) {
        this.$message({
          message: '仅支持指定平台链接解析',
          type: 'error',
          customClass: 'amap-sug-result'
        })
        return
      }

      this.createTaskAndRefresh(this.link, 'link')
    },
    // 创建提取任务并刷新任务
    async createTaskAndRefresh(payload, taskType, fileMd5, fileName) {
      // 请求参数
      const data = {
        payload,
        taskType,
        fileMd5,
        fileName
      }
      // 创建提取任务
      const { code } = await createTask(data)

      if (code === 1) {
        this.$refs.editableDiv.innerText = ''
        this.link = ''
        // 重新获取任务列表
        this.$emit('query')
        this.$message({
          message: '创建提取任务成功',
          type: 'success',
          customClass: 'amap-sug-result'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.custom-zyq-prpper {
  z-index: 99999 !important;
}
</style>

<style scoped lang="scss">
@media (min-width: 941px) {
}

@media (min-width: 1233px) {
}

@media (min-width: 1920px) {
}
.disable-cursor {
  cursor: not-allowed !important;
}
.disable-click {
  pointer-events: none !important;
}

.file-upload {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 48px;

  .file-title {
    margin-bottom: 32px;

    .title-icon {
      width: 400px;
      -webkit-user-drag: none;
    }
  }

  .upload-area {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .upload-input-box {
      position: relative;
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 5px 12px;
      border: 1px solid #c7cace;
      border-radius: 8px;
      box-sizing: border-box;
      box-shadow: 0 5px 8px 0 #0000000f;
      background-color: #fff;
      margin-bottom: 20px;

      .upload-input {
        max-width: 100%;
        min-width: 70%;
        overflow: hidden;

        .editable-container {
          position: relative;
          font-size: 16px;

          .editable-div {
            width: 100%;
            height: 100%;
            max-height: 160px;
            min-height: 20px;
            white-space: pre-wrap;
            overflow: auto;
            outline: none;
          }

          .placeholder {
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            color: #c7cace;
            font-size: 16px;
          }
        }
      }

      .batch-extract-tip {
        position: absolute;
        top: -50px;
        left: 5px;
        font-size: 12px;
        color: #ffffff;
        padding: 10px 15px;
        background-color: #303133;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;

        &::after {
          content: '';
          position: absolute;
          bottom: -9px;
          left: 22px;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 6px solid #303133;
          transform: rotate(90deg);
        }
      }

      .upload-options {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-left: auto;
        gap: 10px;

        .upload-icon-warpper,
        .send-icon-warpper {
          padding: 5px;
          border-radius: 8px;

          .icon {
            cursor: pointer;
            font-size: 32px;
          }
        }
      }
    }

    .upload-tip {
      width: 60%;

      .tip-item {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #808080;

        &:not(:last-child) {
          margin-bottom: 16px;
        }

        &-icon {
          font-size: 20px;
          margin-right: 5px;
        }

        &-name {
          cursor: pointer;
          text-align: center;
          color: #0c6fff;
          padding: 0 5px;
          border-radius: 4px;

          // &:not(:last-of-type)::after {
          //   content: '';
          //   display: inline-block;
          //   width: 1px;
          //   height: 12px;
          //   background-color: #808080;
          //   transform: translateY(15%);
          //   margin-left: 5px;
          // }

          &:hover {
            background-color: #dbe9ff;
          }
        }

        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 12px;
        }

        .question {
          font-size: 15px;
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
  }
}

.tool-tip {
  width: 100%;
  padding: 8px;

  &-item {
    width: 100%;
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  &-item-icon {
    font-size: 20px;
  }

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 12px;
  }
}
</style>
