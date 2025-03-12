<template>
  <div
    class="chat-input-container"
    :style="{
      margin: isFullScreen() ? '0 0 16px 0' : '0 24px 16px 24px'
    }"
    @mousedown="allowTextSelection"
    @keydown="handleKeyupDiv"
  >
    <!-- 文件上传展示框 -->
    <div v-if="isShowFileUploadShow()" class="file-upload-show">
      <!-- 上传图片 -->
      <div v-if="fileList[0].type.includes('image')" class="img-box">
        <div v-if="fileLoding" class="mask">
          <img class="loading" src="@/assets/svg/file/loading.svg" />
        </div>
        <img class="upload-image no-drag" :src="fileImageUrl" />
        <el-tooltip
          effect="dark"
          content="不再围绕该文件提问"
          placement="top"
          popper-class="custom-zyq-prpper"
        >
          <!-- 删除文件图标 -->
          <img
            class="del-icon no-drag"
            src="@/assets/svg/file/guanbi-file.svg"
            @click="handleDeleteFileClick(0)"
          />
        </el-tooltip>
      </div>

      <template v-else>
        <!-- 上传文件卡片 -->
        <div v-for="(item, index) in fileList" :key="index" class="file-card">
          <el-tooltip
            effect="dark"
            content="不再围绕该文件提问"
            placement="top"
            popper-class="custom-zyq-prpper"
          >
            <!-- 删除文件图标 -->
            <img
              class="del-icon no-drag"
              src="@/assets/svg/file/guanbi-file.svg"
              @click="handleDeleteFileClick(index)"
            />
          </el-tooltip>
          <!-- 文件图标 -->
          <div class="file-icon no-drag">
            <div v-if="fileLoding" class="mask">
              <img class="loading" src="@/assets/svg/file/loading.svg" />
            </div>
            <img
              class="icon no-drag"
              :src="require(`@/assets/svg/file/${fileExtension}.svg`)"
            />
          </div>
          <!-- 文件信息 -->
          <div class="file-info">
            <!-- 文件标题 -->
            <div class="file-title">{{ item.name }}</div>
            <!-- 文件状态 上传中 -->
            <span v-if="fileLoding" class="file-status">上传中</span>
            <!-- 文件状态 上传失败 -->
            <span
              v-if="!fileLoding && fileLoadingStatus !== 'COMPLETED'"
              class="file-status"
            >上传失败</span>
            <!-- 文件详情 -->
            <span
              v-if="!fileLoding && fileLoadingStatus === 'COMPLETED'"
              class="file-detail"
            >{{ fileExtension }} {{ getfilesize(item.size) }}</span>
          </div>
        </div>
      </template>
    </div>
    <template v-if="isShowFileUploadShow()">
      <div style="width: 100%; display: flex; align-items: flex-end">
        <!-- 输入框 -->
        <el-input
          v-if="isShowInput"
          id="chat-input"
          ref="chatInputRefs"
          v-model="chatValue"
          type="textarea"
          :placeholder="getPleaceholder"
          style="border: none; flex: 1"
          resize="none"
          :maxlength="chatValueLimit"
          :autosize="{ minRows: 1, maxRows: 10 }"
          :disabled="getDisabledInput()"
          @keydown.native="handleKeyup"
          @input="handleChangeInput"
        />

        <div class="input-bottom flex flex-between">
          <div style="margin-left: 16px">
            <span
              v-if="getIsShowDouyinBZhangGuide"
              ref="msgUrlId"
              class="msg-url"
              @click="openGuide"
            >
              网站快捷入口：
              <span
                class="highlight-span pointer"
                @click="onhandleOpenThirdWeb(2)"
              >
                B站
              </span>
              <span
                class="highlight-span pointer"
                @click="onhandleOpenThirdWeb(1)"
              >
                抖音
              </span>
              <span
                class="highlight-span pointer"
                @click="onhandleOpenThirdWeb(3)"
              >
                小红书
              </span>
              <span
                class="highlight-span pointer"
                @click="onhandleOpenThirdWeb(4)"
              >
                快手
              </span>
              <span
                class="highlight-span pointer"
                @click="onhandleOpenThirdWeb(5)"
              >
                微博
              </span>
              <span
                class="highlight-span pointer"
                @click="onhandleOpenThirdWeb(6)"
              >
                今日头条
              </span>
            </span>
          </div>
          <div class="flex items-center">
            <span>{{ chatValue.length }}/{{ chatValueLimit }}</span>
            <label for="file-upload-input">
              <el-tooltip
                effect="dark"
                content="支持上传Word、Excel、PDF、PPT、音频、TXT、图片文件"
                placement="top"
                popper-class="custom-zyq-prpper"
              >
                <img
                  v-if="$store.state.ai.isScene.id === '1'"
                  src="@/assets/image/aigc/fileUpload.png"
                  alt=""
                  style="margin: 0 5px"
                />
              </el-tooltip>
            </label>
            <input
              id="file-upload-input"
              type="file"
              style="display: none"
              @change="handleFileUpload"
            />
            <img
              v-if="(!chatValue && !fileList.length) || fileLoding"
              src="@/assets/image/aigc/send-disabled.png"
              alt=""
            />
            <img
              v-if="(chatValue || fileList.length) && !fileLoding"
              src="@/assets/image/aigc/send.png"
              alt=""
              @click="send"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 输入框 -->
      <el-input
        v-if="isShowInput"
        id="chat-input"
        ref="chatInputRefs"
        v-model="chatValue"
        type="textarea"
        :placeholder="getPleaceholder"
        style="border: none"
        resize="none"
        :maxlength="chatValueLimit"
        :autosize="{ minRows: 2, maxRows: 10 }"
        :disabled="getDisabledInput()"
        @keydown.native="handleKeyup"
        @input="handleChangeInput"
      />

      <div class="input-bottom flex flex-between">
        <div style="margin-left: 16px">
          <span
            v-if="getIsShowDouyinBZhangGuide"
            ref="msgUrlId"
            class="msg-url"
            @click="openGuide"
          >
            网站快捷入口：
            <span
              class="highlight-span pointer"
              @click="onhandleOpenThirdWeb(2)"
            >
              B站
            </span>
            <span
              class="highlight-span pointer"
              @click="onhandleOpenThirdWeb(1)"
            >
              抖音
            </span>
            <span
              class="highlight-span pointer"
              @click="onhandleOpenThirdWeb(3)"
            >
              小红书
            </span>
            <span
              class="highlight-span pointer"
              @click="onhandleOpenThirdWeb(4)"
            >
              快手
            </span>
            <span
              class="highlight-span pointer"
              @click="onhandleOpenThirdWeb(5)"
            >
              微博
            </span>
            <span
              class="highlight-span pointer"
              @click="onhandleOpenThirdWeb(6)"
            >
              今日头条
            </span>
          </span>
        </div>
        <div class="flex items-center">
          <span>{{ chatValue.length }}/{{ chatValueLimit }}</span>
          <label for="file-upload-input">
            <el-tooltip
              effect="dark"
              content="支持上传Word、Excel、PDF、PPT、音频、TXT、图片文件"
              placement="top"
              popper-class="custom-zyq-prpper"
            >
              <img
                v-if="$store.state.ai.isScene.id === '1'"
                class="no-drag"
                src="@/assets/image/aigc/fileUpload.png"
                alt=""
                style="margin: 0 5px"
              />
            </el-tooltip>
          </label>
          <input
            id="file-upload-input"
            type="file"
            style="display: none"
            @change="handleFileUpload"
          />
          <img
            v-if="!chatValue"
            class="no-drag"
            src="@/assets/image/aigc/send-disabled.png"
            alt=""
          />
          <img
            v-else
            class="no-drag"
            src="@/assets/image/aigc/send.png"
            alt=""
            @click="send"
          />
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import douyinGuide from '@/assets/image/aigc/douyin-guide.png'
import bilibiliGuide from '@/assets/image/aigc/bilibili-guide.png'
import eventBus from '@/utils/eventBus'
import { getExtract } from '@/api/aigc'
import { fileUpload, getUploadStatusInfoByTaskId } from '@/api/aigc/file'
import { formatLimits } from './config'
import OSS from 'ali-oss'
import { getOssConfig } from '@/api/file'
import { v4 as uuidv4 } from 'uuid'
import SparkMD5 from 'spark-md5'

export default {
  inject: [
    'isFullScreen',
    'setChatMessage',
    'getChatMessageList',
    'getTypeAIList',
    'getWS',
    'createWS',
    'setDisabledInput',
    'getDisabledInput',
    'removeChatMessageItem',
    'setIndexChatCustomKeyMessage',
    'setIsAIEnd',
    'setTmpMessage',
    'getModelType',
    'resetSessionAI',
    'setModelType'
  ],
  props: {
    content: {
      type: String,
      default: ''
    },
    original: {
      type: String,
      default: ''
    },
    chatValueLimit: {
      type: Number,
      default: 5000
    },
    placeholder: {
      type: String,
      default: ''
    },
    conversationId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
      fileExtension: '',
      fileImageUrl: null,
      fileLoding: false,
      fileLoadingStatus: 'NULL',
      taskId: '',
      chatValue: '',
      timer: null,
      visibleInputRecommendTopic: false,
      assemblecontent: '',
      douyinGuide,
      bilibiliGuide,
      isShowGuide: false,
      typeOptions: {
        1: {
          type: 1,
          label: '抖音',
          Rule: [
            /https:\/\/v.douyin.com\/[a-zA-Z0-9]+/,
            // ps: https://www.douyin.com/channel/300205?modal_id=7283326510973357368
            /https:\/\/www.douyin.com\/channel\/[a-zA-Z0-9]+/,
            // ps: https://www.douyin.com/video/7305034949109878042
            /https:\/\/www.douyin.com\/video\/[a-zA-Z0-9]+/,
            // https://www.douyin.com/discover?modal_id=7310527175906708771
            /https:\/\/www.douyin.com\/discover\?modal_id=[a-zA-Z0-9]+/
          ]
        },
        2: {
          type: 2,
          label: 'B站',
          Rule: [
            /https:\/\/www.bilibili.com\/video\/[a-zA-Z0-9]+/,
            /https:\/\/b23.tv\/[a-zA-Z0-9]+/
          ]
        },
        3: {
          type: 3,
          label: '小红书',
          Rule: [/http:\/\/xhslink.com\/[a-zA-Z0-9]+/]
        },
        4: {
          type: 4,
          label: '快手',
          Rule: [/https:\/\/www.kuaishou.com\/[a-zA-Z0-9]+/]
        },
        5: {
          type: 5,
          label: '微博',
          Rule: [/https:\/\/weibo.com\/tv\/show\//]
        },
        6: {
          type: 6,
          label: '今日头条',
          Rule: [/https:\/\/www.toutiao.com\/video\//]
        }
      },
      // 阿里云oss
      client: null,
      // 取消上传
      cancel: false,
      // ossConfig
      ossConfig: {}
      // douyingRule: [
      //   /https:\/\/v.douyin.com\/[a-zA-Z0-9]+/,
      //   // ps: https://www.douyin.com/channel/300205?modal_id=7283326510973357368
      //   /https:\/\/www.douyin.com\/channel\/[a-zA-Z0-9]+/,
      //   // ps: https://www.douyin.com/video/7305034949109878042
      //   /https:\/\/www.douyin.com\/video\/[a-zA-Z0-9]+/,
      //   // https://www.douyin.com/discover?modal_id=7310527175906708771
      //   /https:\/\/www.douyin.com\/discover\?modal_id=[a-zA-Z0-9]+/
      // ],
      // bilibiliRule: [
      //   /https:\/\/www.bilibili.com\/video\/[a-zA-Z0-9]+/,
      //   /https:\/\/b23.tv\/[a-zA-Z0-9]+/
      // ]
    }
  },
  computed: {
    getDisabledValue() {
      return this.getDisabledInput()
    },
    getPleaceholder() {
      const list = this.getTypeAIList
      const isVideoExtract = list.find(
        item => item.checked && item.assistantType === 'VideoExtract'
      )
      const isImageGeneration = list.find(
        item => item.checked && item.assistantType === 'ImageGeneration'
      )

      return this.placeholder
        ? this.placeholder
        : isVideoExtract
          ? '请输入抖音、B站、小红书、快手、微博、今日头条视频链接（支持20分钟以内视频）'
          : isImageGeneration
            ? '欢迎使用AI图片生成,请输入图片描述'
            : this.$store.state.ai.isScene.id === '1'
              ? '请随时提问你想要了解的问题或直接上传文件'
              : '输入问题，Ctrl+Enter换行！'
    },
    getIsShowDouyinBZhangGuide() {
      return this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'VideoExtract'
      )
    },
    getIsShowImageGeneration() {
      return this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'ImageGeneration'
      )
    },
    // 热点助手是否显示
    getIsShowHotspot() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'Hotspot'
      )
    },
    isShowInput() {
      return true
    }
  },
  watch: {
    fileLoadingStatus: {
      handler(newValue, oldValue) {
        console.log(newValue, oldValue)
        if (
          newValue !== 'COMPLETED' &&
          newValue !== 'FAILED' &&
          newValue !== 'INVALID'
        ) {
          this.checkTaskStatus()
        } else {
          // 停止定时器
          clearInterval(this.timer)
          // 重置定时器为 null
          this.timer = null
          this.fileLoding = false
        }
      },
      immediate: true
    },
    content(val) {
      if (val) {
        this.chatValue = val
      }
    },
    getDisabledValue: {
      handler(val) {
        if (!val && this.$refs.chatInputRefs) {
          this.$nextTick(() => {
            this.$refs.chatInputRefs.focus()
          })
        }
      },
      immediate: true
    }
  },
  created() {
    document.addEventListener('click', this.closeShowGuide)
    eventBus.$on('aiSend', this.aiSend)
    eventBus.$on('templateSend', this.templateSend)
    this.setOssConfig()
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeShowGuide)
    eventBus.$off('aiSend', this.aiSend)
    eventBus.$off('templateSend', this.templateSend)
  },
  methods: {
    isShowFileUploadShow() {
      return this.$store.state.ai.isScene.id === '1' && this.fileList.length
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
    // 手动点击按钮上传文件
    async handleFileUpload(event) {
      this.$uweb?.setAction('Event_File_Upload_AI_Click')
      // 只能上传一个文件
      if (this.fileList.length > 0) {
        return this.$message({
          message: `最多只能上传1个文件`,
          type: 'warning',
          customClass: 'amap-sug-result'
        })
      }

      this.cancel = false
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
      // 上传文件
      this.uploadFile(files[0])

      // 重置上传输入的值
      if (event.target) {
        event.target.value = ''
      }
    },
    // 检查上传文件格式和大小是否符合要求
    checkFileFormatAndSize(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size

        // 检查文件格式
        let isValidFormat = false
        for (const limits of Object.values(formatLimits)) {
          if (limits.extensions.includes(extension)) {
            isValidFormat = true
            // 检查文件大小
            if (fileSize > limits.maxSize) {
              this.$message({
                message: `文件限制上传小于${limits.maxSize / 1024 / 1024}MB`,
                type: 'warning',
                customClass: 'amap-sug-result'
              })

              return false
            }
          }
        }
        if (!isValidFormat) {
          this.$message({
            message: `仅支持上传Word、Excel、PDF、音频、TXT、图片文件`,
            type: 'error',
            customClass: 'amap-sug-result'
          })

          return false
        }
      }
      return true
    },
    // 根据文件名获取文件类型
    getFileType(fileName) {
      const extension = fileName.split('.').pop().toLowerCase()

      return extension
    },
    getfilesize(size) {
      if (!size) return ''
      var num = 1024.0
      if (size < num) return size + 'B'
      if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + 'KB'
      if (size < Math.pow(num, 3)) {
        return (size / Math.pow(num, 2)).toFixed(2) + 'MB'
      } // M
      if (size < Math.pow(num, 4)) {
        return (size / Math.pow(num, 3)).toFixed(2) + 'G'
      } // G
      return (size / Math.pow(num, 4)).toFixed(2) + 'T' // T
    },
    createImageUrl(file) {
      const reader = new FileReader()
      reader.onload = e => {
        this.fileImageUrl = e.target.result
      }
      reader.readAsDataURL(file)
    },
    async uploadFile(file) {
      this.fileLoding = true
      if (file.type.includes('image')) {
        this.createImageUrl(file)
      }
      this.fileList.push(file)
      // 上传阿里OSS 获取文件原始url
      const url = await this.uploadOSS(file)
      this.fileUrl = url
      // 文件类型
      const fileType = this.getFileType(file.name)

      // if (fileType === 'video') {
      //   this.$uweb?.setAction('Event_Update_File_Video')
      // } else if (fileType === 'audio') {
      //   this.$uweb?.setAction('Event_Update_File_Audio')
      // } else if (fileType === 'image') {
      //   this.$uweb?.setAction('Event_Update_File_Image')
      // } else if (fileType === 'doc') {
      //   this.$uweb?.setAction('Event_Update_File_Doc')
      // }

      // 文件名称
      const fileName = file.name
      // 判断是否是图片
      const isImage = formatLimits.image.extensions.includes(fileType)

      if (!isImage) {
        // 计算文件md5并上传
        this.computeMD5AndUpload(file, url, fileType, fileName)
      } else {
        this.fileLoadingStatus = 'COMPLETED'
        this.fileLoding = false
        this.setModelType('2', 0)
      }
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
      // 文件类型`
      const fileType = this.getFileType(file.name)
      this.computedFileIcon(fileName)
      // 获取当前日期
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const options = {
        // 获取分片上传进度、断点和返回值。
        progress: (p, cpt, res) => {
          if (this.cancel) {
            client.cancel()
            this.cancel = false
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
        return url
      } else {
        this.$message.error({
          message: `文件${file.name}上传失败`,
          type: 'error',
          customClass: 'amap-sug-result'
        })
      }
    },
    // 检查任务状态并启动或停止轮询
    checkTaskStatus() {
      if (!this.timer) {
        // 启动轮询
        this.timer = setInterval(async () => {
          if (this.taskId) {
            const { code, data } = await getUploadStatusInfoByTaskId({
              taskId: this.taskId
            })
            if (code === 1) {
              this.fileLoadingStatus = data.taskStatus
            }
          }
        }, 500)
      }
    },
    // 移除url参数
    removeUploadIdFromUrl(urlString) {
      // 使用正则表达式删除 URL 中的 `?uploadId=...` 查询参数
      return urlString.replace(/(\?|&)uploadId=[^&]+/, '')
    },
    // 计算文件图标类型
    computedFileIcon(fileName) {
      const extension = fileName.split('.').pop().toLowerCase()
      this.fileExtension = extension
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

      fileReader.onload = async e => {
        spark.append(e.target.result) // Append array buffer
        currentChunk++

        if (currentChunk < chunks) {
          loadNext()
        } else {
          const md5 = spark.end() // 得到md5

          try {
            const { code, data } = await fileUpload({
              fileMd5: md5,
              fileType,
              fileUrl: url,
              fileName
            })

            if (code === 1) {
              const taskId = data
              this.taskId = taskId
              await getUploadStatusInfoByTaskId({
                taskId: this.taskId
              })
            }
            spark.destroy() // 释放缓存
            file.uniqueIdentifier = md5 // 将文件md5赋值给文件唯一标识
            file.cmd5 = false // 取消计算md5状态
          } catch (error) {
            this.fileList.splice(0, 1)
            this.fileLoadingStatus = 'NULL'
            this.fileLoding = false
          }
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
    handleDeleteFileClick(index) {
      this.$uweb?.setAction('Event_File_Upload_Delete_AI_Click')
      this.fileList.splice(index, 1)
      this.fileImageUrl = null
      if (this.fileLoding) {
        this.uploadCancel()
      }
      this.fileLoadingStatus = 'NULL'
      this.taskId = ''
      // 停止定时器
      clearInterval(this.timer)
      // 重置定时器为 null
      this.timer = null
      this.fileLoding = false
    },
    handleChangeInput(val) {
      this.$emit('changeInput', val)
    },
    // 取消上传的方法
    uploadCancel() {
      this.cancel = true
    },
    handleKeyupDiv(e) {
      if (
        this.getIsShowHotspot &&
        this.isShowTemplateRender &&
        e.keyCode === 13 &&
        !e.ctrlKey
      ) {
        e.stopPropagation()
        this.send()
      }
    },
    // 判断来源类型
    getType(text) {
      for (const key in this.typeOptions) {
        const flag = this.typeOptions[key].Rule.some(item => item.test(text))
        if (flag) {
          return this.typeOptions[key].type
        }
      }
    },
    openGuide(e) {
      if (
        this.$refs.promptGuidePopup &&
        this.$refs.promptGuidePopup.contains(e.target)
      ) {
        return
      }
      e.stopPropagation()
      this.isShowGuide = !this.isShowGuide
    },
    closeShowGuide(e) {
      // 判断点击是否在msgUrlId元素内
      if (
        this.$refs.msgUrlId &&
        !this.$refs.msgUrlId.contains(e.target) &&
        document.getElementsByClassName('el-image-viewer__wrapper').length < 1
      ) {
        this.isShowGuide = false
      }
    },
    /**
     * index 聊天纪录的下标
     * montageTxt 待拼接的文案  目前在视频文案提取中生成选题稿中使用
     */
    resetAnswer(index, montageTxt = '') {
      let userText = this.getChatMessageList[index - 1].text
      console.log('resetAnswer1------------', montageTxt)
      if (montageTxt) userText += montageTxt
      console.log('resetAnswer2------------', index, montageTxt, userText)
      this.removeChatMessageItem(index, 1)
      this.setChatMessage({
        type: 'ai',
        text: '',
        hasNew: false,
        tmpIsOk: false,
        isCollect: false,
        isLike: false,
        isNoLike: false,
        status: 'PENDING'
      })
      this.sendWS(userText, false, '', {
        task_id: this.taskId,
        format: this.fileExtension,
        file_url: this.fileUrl,
        file_name: this.fileList.length ? this.fileList[0].name : '',
        file_size: this.fileList.length
          ? this.getfilesize(this.fileList[0].size)
          : ''
      })
    },
    templateSend(val) {
      this.$emit('userInput')
      this.sendWS(JSON.parse(val), true, '', {})
    },
    aiSend(record) {
      this.chatValue = record.value
      this.send()
    },
    sendOther(value) {
      this.sendWS(value, false, '', {})
    },
    // 对话式发送 自己也会发送消息
    dialogue(text, isTemplate, mode) {
      this.setChatMessage({
        type: 'user',
        text: text
      })
      this.setChatMessage({
        type: 'ai',
        text: '',
        hasNew: false,
        tmpIsOk: false,
        isCollect: false,
        isLike: false,
        isNoLike: false,
        status: 'PENDING'
      })
      this.sendWS(text, isTemplate, mode, {})
    },
    // 禁止冒泡防止复制文本的时候进行拖动
    allowTextSelection(event) {
      // 取消事件冒泡，确保文本选择事件能够正常触发
      event.stopPropagation()
    },
    handleKeyup(e) {
      if (e.keyCode === 13 && !e.ctrlKey) {
        e.preventDefault()
        if (this.chatValue) {
          this.send()
        }
      }
      if (e.keyCode === 13 && e.ctrlKey) {
        const input = this.$refs.chatInputRefs.$el.querySelector(
          '.el-textarea__inner'
        )
        const start = input.selectionStart
        const end = input.selectionEnd
        this.chatValue =
          this.chatValue.substring(0, start) +
          '\n' +
          this.chatValue.substring(end)
        this.$nextTick(() => {
          input.focus()
          input.setSelectionRange(start + 1, start + 1)
        })
      }
    },
    videoSend() {
      // const isDY = this.douyingRule.some(item => item.test(this.chatValue))
      // const isBL = this.bilibiliRule.some(item => item.test(this.chatValue))
      const isDY = this.getType(this.chatValue)
      const isBL = this.getType(this.chatValue)
      const isWb = this.getType(this.chatValue)
      const isTt = this.getType(this.chatValue)

      if (!isDY && !isBL && !isWb && !isTt) {
        this.setIsAIEnd(true)
        this.setDisabledInput(false)
        this.$message({
          message:
            '目前只支持提取短视频内容，无法提取电视剧、电影、文本等内容。',
          type: 'error',
          customClass: 'amap-sug-result'
        })
        return
      }

      // 全是换行符则清空
      if (this.chatValue.replace(/\n/g, '').length === 0) {
        this.chatValue = ''
        this.setIsAIEnd(true)
        this.setDisabledInput(false)
        return
      }
      this.$uweb && this.$uweb.setAction('Event_video_copy_extraction')
      this.setChatMessage({
        type: 'user',
        text: this.chatValue
      })
      this.setChatMessage({
        type: 'ai',
        text: '',
        videoLoadText: '正在分析链接',
        hasNew: false,
        tmpIsOk: false,
        isCollect: false,
        isLike: false,
        isNoLike: false,
        status: 'PENDING'
      })

      // const header = isDY
      //   ? 'https://aisyk.hokkj.cn/douyin?url='
      //   : 'https://aisyk.hokkj.cn/douyin?url='
      // let url = ''
      // if (isDY) {
      //   const v1 = this.chatValue.match(this.douyingRule[0])
      //     ? this.chatValue.match(this.douyingRule[0])[0]
      //     : undefined
      //   const v2 = this.chatValue.match(this.douyingRule[1])
      //     ? this.chatValue.match(this.douyingRule[1])['input']
      //     : undefined
      //   url = v1 || v2
      // }
      // if (isBL) {
      //   const v1 = this.chatValue.match(this.bilibiliRule[0])
      //     ? this.chatValue.match(this.bilibiliRule[0])[0]
      //     : undefined
      //   const v2 = this.chatValue.match(this.bilibiliRule[1])
      //     ? this.chatValue.match(this.bilibiliRule[1])[0]
      //     : undefined
      //   url = v1 || v2
      // }
      this.setDisabledInput(true)
      this.setIsAIEnd(false)
      this.$emit('userInput')
      // const api =
      //   'https://aisyk.hokkj.cn/douyin?url=' +
      //   encodeURIComponent()
      getExtract({ oriUrl: this.chatValue })
        .then(res => {
          const tmp = res.data
          const tmpVideo = document.createElement('video')
          tmpVideo.src = tmp
          tmpVideo.addEventListener('loadedmetadata', () => {
            const videoDuration = tmpVideo.duration
            tmpVideo.remove()
            // 换算为分钟
            const videoDurationMin = Math.floor(videoDuration / 60)
            if (videoDurationMin > 20) {
              this.setIndexChatCustomKeyMessage(
                'text',
                this.getChatMessageList.length - 1,
                '视频时长超过20分钟，无法处理!'
              )
              this.setIndexChatCustomKeyMessage(
                'status',
                this.getChatMessageList.length - 1,
                'DONE'
              )
              this.setIsAIEnd(true)
              this.setDisabledInput(false)
              return
            }
            if (tmp) {
              this.setIndexChatCustomKeyMessage(
                'videoLoadText',
                this.getChatMessageList.length - 1,
                '文案提取中'
              )
              this.sendWS(
                JSON.stringify({ user: this.chatValue, url: tmp, status: 1 }),
                false,
                '',
                {}
              )
              // if (isDY) {
              //   /**
              //    * user 用户输入
              //    * url 视频链接
              //    * status 1-提取 2-改稿
              //    */
              //   this.sendWS(
              //     JSON.stringify({ user: this.chatValue, url: tmp, status: 1 })
              //   )
              // }
              // if (isBL) {
              //   if (!tmp.bvid) {
              //     this.setIndexChatCustomKeyMessage(
              //       'text',
              //       this.getChatMessageList.length - 1,
              //       '视频无法获取！'
              //     )
              //     this.setIndexChatCustomKeyMessage(
              //       'status',
              //       this.getChatMessageList.length - 1,
              //       'DONE'
              //     )
              //     this.setIsAIEnd(true)
              //     this.setDisabledInput(false)
              //     return
              //   }
              //   getBilibiliPlayurl(tmp).then(rr => {
              //     /**
              //      * user 用户输入
              //      * url 视频链接
              //      * status 1-提取 2-改稿
              //      */
              //     this.sendWS(
              //       JSON.stringify({
              //         user: this.chatValue,
              //         url: rr.data,
              //         status: 1
              //       })
              //     )
              //   })
              // }
            } else {
              this.setIndexChatCustomKeyMessage(
                'text',
                this.getChatMessageList.length - 1,
                '链接内容无法提取'
              )
              this.setIndexChatCustomKeyMessage(
                'status',
                this.getChatMessageList.length - 1,
                'DONE'
              )
              this.setIsAIEnd(true)
              this.setDisabledInput(false)
            }
          })
        })
        .catch(() => {
          this.setIndexChatCustomKeyMessage(
            'text',
            this.getChatMessageList.length - 1,
            '链接内容无法提取'
          )
          this.setIndexChatCustomKeyMessage(
            'status',
            this.getChatMessageList.length - 1,
            'DONE'
          )
          this.setIsAIEnd(true)
          this.setDisabledInput(false)
        })
    },
    hotspostSend() {},
    // 发送消息  isAddUser  是否添加用户信息
    async send(isAddUser = true) {
      this.$uweb && this.$uweb.setAction('Event_click_send_btn')
      if (this.getDisabledInput()) return

      this.setDisabledInput(true)
      if (this.getIsShowDouyinBZhangGuide) {
        this.videoSend()
        return
      }
      if (this.getIsShowHotspot) {
        this.hotspostSend()
        return
      }
      if (this.fileList.length) {
        if (isAddUser) {
          this.setChatMessage({
            type: 'user',
            text:
              this.chatValue.replace(/\n/g, '').length === 0
                ? '整理文件的核心内容'
                : this.chatValue,
            messageType: 'file',
            fileImageUrl: this.fileImageUrl,
            fileExtension: this.fileExtension,
            fileName: this.fileList[0].name,
            format: this.fileExtension,
            fileSize: this.getfilesize(this.fileList[0].size)
          })
        } else {
          this.setChatMessage({
            type: 'user',
            text: this.chatValue
          })
        }
      } else {
        if (isAddUser) {
          // 全是换行符则清空
          if (this.chatValue.replace(/\n/g, '').length === 0) {
            this.chatValue = ''
            this.setIsAIEnd(true)
            this.setDisabledInput(false)
            return
          }

          this.setChatMessage({
            type: 'user',
            text: this.chatValue
          })
        }
      }

      this.$emit('userInput')
      this.setChatMessage({
        type: 'ai',
        text: '',
        thinkingTxt: '',
        hasNew: false,
        tmpIsOk: false,
        isCollect: false,
        isLike: false,
        isNoLike: false,
        status: 'PENDING'
      })

      if (this.fileList.length) {
        if (this.chatValue) {
          this.$uweb?.setAction(
            'Event_File_Upload_Conversation_Plain_Text_File_AI_Click'
          )
        } else {
          this.$uweb?.setAction('Event_File_Upload_Conversation_AI_Click')
        }
        this.sendWS(
          this.chatValue.replace(/\n/g, '').length === 0
            ? '整理文件的核心内容'
            : this.chatValue,
          false,
          '',
          {
            task_id: this.taskId,
            format: this.fileExtension,
            file_url: this.fileUrl,
            file_name: this.fileList[0].name,
            file_size: this.getfilesize(this.fileList[0].size)
          }
        )
      } else {
        this.$uweb?.setAction(
          'Event_File_Upload_Conversation_Plain_Text_AI_Click'
        )
        this.sendWS(
          this.chatValue.replace(/\n/g, '').length === 0
            ? '整理文件的核心内容'
            : this.chatValue,
          false,
          '',
          {}
        )
      }
    },
    clearChatValue() {
      this.chatValue = ''
    },
    async sendWS(val, isTemplate = false, mode = '', params) {
      console.log('==========================================')
      this.setDisabledInput(true)
      this.setIsAIEnd(false)
      let ws = this.getWS()
      if (!ws || ws.readyState !== 1) {
        ws = await this.createWS()
        console.log('ws创建完成')
      }
      // 最后一条消息obj
      // const lastInfo =
      //   this.getChatMessageList[this.getChatMessageList.length - 1]
      ws.onmessage = event => {
        const info = {
          ...JSON.parse(event.data)
        }

        if (
          info.reply === 'check' &&
          info.conversation_id === 'check' &&
          info.status === 'CHECK' &&
          info.source === 'SYSTEM'
        ) {
          return
        }
        if (info.status === 'PENDING' || info.status === 'DONE') {
          if (this.getIsShowImageGeneration) {
            if (info.status === 'DONE') {
              // 判断info.reply 是不是图片链接
              if (
                !info.reply.includes('http') &&
                !info.reply.includes('https')
              ) {
                this.setIndexChatCustomKeyMessage(
                  'imgError',
                  this.getChatMessageList.length - 1,
                  info.reply
                )
              }
              this.setIndexChatCustomKeyMessage(
                'text',
                this.getChatMessageList.length - 1,
                info.reply
              )
              this.setIndexChatCustomKeyMessage(
                'status',
                this.getChatMessageList.length - 1,
                'DONE'
              )
              this.setIndexChatCustomKeyMessage(
                'source',
                this.getChatMessageList.length - 1,
                info.source
              )
              this.setIndexChatCustomKeyMessage(
                'tmpIsOk',
                this.getChatMessageList.length - 1,
                true
              )
              this.setIndexChatCustomKeyMessage(
                'id',
                this.getChatMessageList.length - 1,
                info.conversation_id
              )
            }

            this.setIsAIEnd(true)
            this.setDisabledInput(false)
          } else {
            // console.log(info, 'info222222222')
            info.applyType = info.type

            this.setTmpMessage(info)
          }
        }
        if (info.status === 'SENSITIVE') {
          this.removeChatMessageItem(this.getChatMessageList.length - 1, 1)

          this.setIndexChatCustomKeyMessage(
            'isSensitive',
            this.getChatMessageList.length - 1,
            true
          )
          this.setIndexChatCustomKeyMessage(
            'isSensitiveReply',
            this.getChatMessageList.length - 1,
            info.reply
          )
          this.setIsAIEnd(true)
          this.setDisabledInput(false)
          return
        }
      }
      ws.onclose = () => {}
      ws.onerror = () => {}
      const tmp = this.getTypeAIList.find(item => item.checked)
      // let notText = ''
      let tt = ''
      if (isTemplate) {
        await this.resetSessionAI()
        val.replaces.forEach(e => {
          // notText += e.replace_value || ''
          tt += e.replace_key + '：' + (e.replace_value || '') + '\n'
        })
        this.setChatMessage({
          type: 'user',
          text: tt,
          conversationId: this.conversationId
        })
        this.setChatMessage({
          type: 'ai',
          text: '',
          thinkingTxt: '',
          tmpIsOk: false,
          isCollect: false,
          isLike: false,
          hasNew: false,
          isNoLike: false,
          status: 'PENDING',
          conversationId: this.conversationId
        })
      }
      let us = isTemplate
        ? this.getIsShowDouyinBZhangGuide
          ? JSON.stringify({
            user: tt,
            url: '',
            status: 2
          })
          : ''
        : val

      if (us.includes('【原文内容】')) {
        us = us.replace('【原文内容】', this.original)
      }
      ws.send(
        JSON.stringify({
          user: us,
          user_msg: us,
          scene_id: tmp.type === 'AI' ? 1 : tmp.type,
          llm_type: this.getIsShowDouyinBZhangGuide ? 2 : this.getModelType(),
          qa_mode:
            tmp.type === 'AI' || !isTemplate ? mode || 'free' : 'compose',
          chat_template: isTemplate ? val : undefined,
          conversation_id: this.conversationId,
          task_id: params.task_id ?? '',
          format: params.format ?? '',
          file_url: params.file_url ?? '',
          file_name: params.file_name ?? '',
          file_size: params.file_size ?? ''
        })
      )

      this.$nextTick(() => {
        this.chatValue = ''
      })
    },
    onhandleOpenThirdWeb(type) {
      switch (type) {
        case 2:
          // 打开B站
          window.open('https://www.bilibili.com/', '_blank')
          break
        case 1:
          // 打开抖音
          window.open('https://www.douyin.com/', '_blank')
          break
        case 3:
          // 打开小红书
          window.open('https://www.xiaohongshu.com/', '_blank')
          break
        case 4:
          // 打开快手
          window.open('https://www.kuaishou.com/', '_blank')
          break
        case 5:
          // 打开微博
          window.open('https://weibo.com/', '_blank')
          break
        case 6:
          // 打开今日头条
          window.open('https://www.toutiao.com/', '_blank')
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.no-drag {
  -webkit-user-drag: none; /* Safari */
  -khtml-user-drag: none; /* Konqueror */
  -moz-user-drag: none; /* Firefox */
  -o-user-drag: none; /* Opera */
  user-drag: none;
}
.custom-zyq-prpper {
  z-index: 99999 !important;
}
::v-deep .el-textarea__inner {
  padding: 16px;
  color: #333;
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #d0d0d0;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }
}
::v-deep .is-disabled .el-textarea__inner {
  background-color: #fff;
}
.chat-input-container {
  background: #fff;
  border-radius: 5px;
  border: 1px solid #a3c6ff;
  position: relative;

  .file-upload-show {
    padding: 16px 16px 0;
    display: flex;
    overflow-x: auto;

    .img-box {
      position: relative;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;

      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba($color: #333333, $alpha: 0.5);
        z-index: 1000;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;

        .loading {
          width: 16px;
          height: 16px;
          display: flex;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }

      .upload-image {
        width: 100%;
        height: 100%;
        border-radius: 5px;
        object-fit: cover;
      }

      .del-icon {
        position: absolute;
        right: 5px;
        top: 5px;
        display: flex;
        width: 12px;
        height: 12px;
        z-index: 1100;
      }
    }

    .file-card {
      position: relative;
      border-radius: 8px;
      padding: 10px 25px 10px 10px;
      height: 54px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      gap: 10px;
      max-width: 260px;

      .del-icon {
        position: absolute;
        right: 5px;
        top: 5px;
        display: flex;
        width: 12px;
        height: 12px;
      }

      .file-icon {
        position: relative;
        min-width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        border-radius: 4px;

        .mask {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgba($color: #333333, $alpha: 0.5);
          z-index: 1000;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;

          .loading {
            width: 16px;
            height: 16px;
            display: flex;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        }

        .icon {
          display: flex;
          height: 20px;
          width: 20px;
        }
      }

      .file-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 5px;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        .file-title {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
          font-weight: 500;
          color: #333333;
        }
        .file-status,
        .file-detail {
          color: #999999;
          font-size: 12px;
        }
      }
    }
  }

  .input-bottom {
    padding-bottom: 13px;
    padding-right: 10px;
    .msg-url {
      position: relative;
      font-size: 14px;
      user-select: none;
      color: #a2a5a8;
      .highlight-text {
        color: #3a7fff;
        user-select: none;
        &:hover {
          background: rgba(20, 86, 240, 0.1);
        }
      }
      .prompt-guide-popup {
        width: 487px;
        height: 314px;
        background: #ffffff;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
        position: absolute;
        z-index: 2;
        top: -330px;
        left: -154px;
        padding: 0 12px;
        .arrow-up {
          position: absolute;
          top: 96.8%;
          left: 47.2%;
          transform: rotate(178deg);
        }
        .douyin-col,
        .bilibili-col {
          width: 50%;
          height: 100%;
          padding-top: 16px;
          .guide-title {
            font-size: 20px;
            color: #333333;
            font-weight: 500;
            margin-bottom: 14px;
            user-select: none;
          }
          .guide-douying-img,
          .guide-bilibili-img {
            width: 100%;
            height: 231px;
            border: 1px dashed #e8ebee;
            position: relative;
            cursor: pointer;
            .show-img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    span {
      font-size: 13px;
      color: #a2a5a8;
      margin-right: 8px;
    }
    img {
      width: 28px;
      height: 28px;
    }
    .template-icon {
      cursor: pointer;
      user-select: none;
      &:hover {
        span {
          color: #3a7fff;
        }
        .default-template {
          display: none;
        }
        .hover-template {
          display: block;
        }
      }
      .default-template {
        display: block;
      }
      .hover-template {
        display: none;
      }
      img {
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
      span {
        font-size: 14px;
        color: #838383;
      }
    }
    .hot-icon {
      cursor: pointer;
      user-select: none;
      &:hover {
        span {
          color: #3a7fff;
        }
        .default-hot {
          display: none;
        }
        .hover-hot {
          display: block;
        }
      }
      .default-hot {
        display: block;
      }
      .hover-hot {
        display: none;
      }
      img {
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
      span {
        font-size: 14px;
        color: #838383;
      }
    }
  }
  .recommend-topic {
    position: absolute;
    bottom: 100px;
    background: #fff;
    width: 100%;
    border-bottom: 1px solid #eee;
    z-index: 2;
  }
}

::v-deep .el-textarea__inner {
  border: none;
}
</style>
