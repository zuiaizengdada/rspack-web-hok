<template>
  <base-dialog
    v-bind="$attrs"
    title="上传文件"
    class="oss-upload-container"
    :visible-footer="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :before-close="handleDialogClose"
    v-on="$listeners"
    @close="handleDialogClose"
    @cancel="handleDialogClose"
    @comfirm="dialogComfirm"
  >
    <div slot="content">
      <div class="header-box">
        <slot name="header" />
      </div>
      <upload v-bind="$attrs" class="mb-5" v-on="$listeners" @upload="updateChangeFile" />
      <div class="file-list">
        <oss-item
          v-for="item in uploadList"
          :key="item.key"
          :info="item"
          @close="ossColse"
          @success="ossSuccess"
          @start="ossStart"
          @pause="ossPause"
          @reload="ossReload"
          @cancel="ossCancel"
        />
      </div>
      <div class="footer-button flex justify-end mt-4">
        <el-button v-show="uploadErrorList.length" type="primary"> 重新上传失败文件 </el-button>
        <el-button v-show="uploadingList.length" @click="handleCancelAll"> 全部取消 </el-button>
      </div>
    </div>
  </base-dialog>
</template>
<script>
const _ = require('lodash')
import BaseDialog from '../BaseDialog.vue'
import Upload from './Upload.vue'
import OssItem from './OssItem'
import { getOssToken } from '@/api/qiniu'
export default {
  components: {
    BaseDialog,
    Upload,
    OssItem
  },
  inheritAttrs: false,
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      uploadList: [],
      uploadingList: [], // 上传中的队列
      uploadErrorList: [],
      unCompleteUploadList: [], // 未上传的队列
      index: -1 // 上传序号
    }
  },
  created() {
    this.initOssToken()
  },
  methods: {
    handleDialogClose() {
      if (this.uploadingList.length) {
        this.$confirm('还有未上传完的文件，确定要关闭弹窗吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('update:visible', false)
          Object.assign(this.$data, this.$options.data())
        })
      } else {
        this.$emit('update:visible', false)
        Object.assign(this.$data, this.$options.data())
      }
    },
    handleCancelAll() {
      this.$confirm('确定要全部取消正在上传的文件吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.uploadList.forEach((item) => {
          if (this.uploadingList.includes(item.index)) {
            item.status = 'cancel'
          }
        })
      })
    },
    dialogComfirm() {},
    updateChangeFile(file, name) {
      this.index = this.index + 1
      let status = ''
      if (this.uploadingList.length < this.limit) {
        this.uploadingList.push(this.index)
        status = 'uploading'
      } else {
        this.unCompleteUploadList.push(this.index)
        status = 'waiting'
      }
      // 将file 对象转为Object，有利于数据取值
      this.uploadList.push({
        key: Date.now(),
        status,
        index: this.index,
        name: name || file.name,
        size: file.size,
        file,
        percentage: 0
      })
    },
    updateUploadList(data) {
      console.log(this.data, 99999)
      if (data) {
        // 上传完成后，先删除上传中队列中的以上传完的
        const index = this.uploadingList.indexOf(data.index)
        this.uploadingList.splice(index, 1)
      }

      // 从未上传队列中获取第一个，移入到上传中队列中，根据序列号启动未上传将状态改为上传中， 并移除未上传队列中的第一个
      if (this.unCompleteUploadList.length) {
        this.uploadingList.push(this.unCompleteUploadList[0])
        this.uploadList[this.unCompleteUploadList[0]].status = 'uploading'
        this.unCompleteUploadList.splice(0, 1)
      } else {
        this.uploadingList = []
      }
    },
    ossColse(data) {
      const index = _.findIndex(this.uploadList, { index: data.index })
      this.uploadList.splice(index, 1)
    },
    ossSuccess(data) {
      this.updateUploadList(data)
      this.$emit('success', data)
    },
    ossStart(data) {
      if (this.uploadingList.length < this.limit) {
        const index = _.findIndex(this.uploadList, { index: data.index })
        this.uploadingList.push(data.index)
        this.uploadList[index].status = 'uploading'
      } else {
        this.unCompleteUploadList.push(data.index)
        // this.$message.warning('只能同时上传' + this.limit + '个文件,请稍等')
      }
    },
    ossReload(data) {
      this.ossStart(data)
    },
    // 暂停上传
    ossPause(data) {
      // 根据索引值，从上传中的队列移除该元素，放入到未上传队列的末尾，修改该元素的上传状态
      const index = this.uploadingList.indexOf(data.index)
      this.uploadingList.splice(index, 1)
      this.unCompleteUploadList.push(data.index)
      this.updateUploadList()
    },
    // 取消上传
    ossCancel(data) {
      // 根据索引值，删除上传中队列和渲染列表的元素
      const index = this.uploadingList.indexOf(data.index)
      const index2 = _.findIndex(this.uploadList, { index: data.index })
      this.uploadingList.splice(index, 1)

      this.uploadList.splice(index2, 1)
    },
    async initOssToken() {
      const { data } = await getOssToken()
      localStorage.setItem('ossToken', JSON.stringify(data))
    }
  }
}
</script>
