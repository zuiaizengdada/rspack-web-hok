<template>
  <div class="pdfView-container">
    <div class="pdfView-title" v-if="showTitle">
      <span>{{ title }}</span>
      <el-popover
        placement="left-start"
        width="200"
        :disabled="disabledTitleHover"
        trigger="hover"
        :content="titleHover"
      >
        <div slot="reference" v-if="type === 'resume' && showAddBtn">
          <el-upload
            ref="pdfCardViewUploadFile"
            action="#"
            :before-upload="beforeUpload"
            :limit="1"
            :multiple="false"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="onChangeFile"
          >
            <i
              class="el-icon-plus"
              style="font-size: 16px; cursor: pointer"
            ></i>
          </el-upload>
        </div>
        <i
          v-else-if="showAddBtn"
          class="el-icon-plus"
          slot="reference"
          style="font-size: 16px; cursor: pointer"
          @click="handleTitleClick"
        ></i>
      </el-popover>
    </div>
    <pdfCard
      v-for="(item, index) in list"
      :key="type + index"
      :type="type"
      :url="handleUrl(item)"
      :content="item"
      @del="handleDel(item)"
      :name="handleTtile(item)"
      :date="handleTDate(item)"
      :showBrowseBtn="true"
      :showDelBtn="showDelBtn"
      :showDownBtn="handleDownBtn(item)"
    >
      <template
        v-if="
          type === 'file' &&
          (item.sealStatus === 2 || item.employeeSignStatus === 1)
        "
      >
        <img
          :src="item.sealStatus === 2 ? stampedPng : signedPng"
          class="fileImg"
        />
      </template>
    </pdfCard>
  </div>
</template>
<script>
// eslint-disable-next-line
import pdfCard from './pdfCard.vue'
import { handleShowFileUrlByStatus } from '@/views/oaMannagement/utils/common'
import { uploadFile } from '@/api/file'
import stampedPng from '@/assets/image/oa/stamped.png'
import signedPng from '@/assets/image/oa/signed.png'

export default {
  components: {
    pdfCard
  },
  props: {
    showTitle: {
      type: Boolean,
      default: true
    },
    disabledTitleHover: {
      type: Boolean,
      default: true
    },
    titleHover: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    },
    showDelBtn: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    showAddBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stampedPng,
      signedPng
    }
  },
  methods: {
    handleUrl(item) {
      if (this.type === 'resume') {
        return item.resumeUrl
      } else if (this.type === 'file') {
        return handleShowFileUrlByStatus(item)
      }
      return item.url
    },
    handleTtile(item) {
      if (this.type === 'file') {
        return item.fileName
      }
      return item.name
    },
    handleTDate(item) {
      if (this.type === 'file' && item.sealStatus === 2) {
        return item.sealTime
      } else if (this.type === 'file' && item.employeeSignStatus === 1) {
        return item.employeeSignTime
      }
      return item.date
    },
    handleDownBtn(item) {
      if (this.type === 'file' && !item.canDownload) {
        return false
      }
      return true
    },
    handleTitleClick(data) {
      console.log(data, 55)
      this.$emit('add', data)
    },
    handleDel(item) {
      this.$emit('del', item)
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      const isTypeAllowed = /\.(xls|csv|xlsx|txt|doc|docx|pdf|png|jpg)$/i.test(
        file.name
      )
      if (!isTypeAllowed) {
        this.$message.error(
          '只能上传 xls,csv,xlsx,txt,doc,docx,pdf,png,jpg 格式的文件！'
        )

        return false
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB！')

        return false
      }

      return isLt10M && isTypeAllowed
    },
    onChangeFile(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.raw)
      const isUpload = this.beforeUpload(file)
      if (isUpload) {
        uploadFile(formData)
          .then(res => {
            if (res.code === 1) {
              this.handleTitleClick({
                fileUrl: res.data.url,
                fileList: fileList
              })
            }
            this.$refs.pdfCardViewUploadFile.clearFiles()
          })
          .catch(() => {
            console.log(file.name + '上传失败')
            this.$refs.socialSecurityCardUploadFile.clearFiles()
          })
      } else {
        this.$refs.pdfCardViewUploadFile.clearFiles()
      }
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.pdfView-container {
  width: 341px;
  border-radius: 10px;
  background-color: #fff;
  .pdfView-title {
    height: 44px;
    width: 100%;
    background: linear-gradient(57deg, #d6edff 0%, #c7ddff 100%);
    border-radius: 10px 10px 0 0;
    line-height: 44px;
    font-size: 14px;
    font-weight: 600;
    font-family: '微软雅黑';
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .fileImg {
    width: 62px;
    height: 62px;
    position: absolute;
    right: 58px;
  }
}
</style>
