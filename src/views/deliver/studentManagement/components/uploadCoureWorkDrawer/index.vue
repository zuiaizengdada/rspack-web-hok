<template>
  <!-- 上传作业弹框 -->
  <el-drawer
    :size="728"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    :before-close="handleDialogClose"
    v-on="$listeners"
  >
    <div v-if="visible" v-loading="loading" class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">上传作业</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent overflowOuto">
        <uploadHead :completed-list="completedList" :student-info="studentInfo" @clear="clearCompletedList" />
        <upload ref="uploadWork" v-bind="$attrs" class="upload" v-on="$listeners" @upload="updateChangeFile" />
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
      </div>
    </div>
  </el-drawer>
<!--
   <div class="footer-button flex justify-end mt-4">
     <el-button v-show="uploadErrorList.length" type="primary"> 重新上传失败文件 </el-button>
     <el-button v-show="uploadingList.length" @click="handleCancelAll"> 全部取消 </el-button>
    </div> -->
</template>
<script>
const _ = require('lodash')
import Upload from './upload'
import OssItem from './OssItem'
import { getOssToken } from '@/api/qiniu'
import { getCourseWorkDetailAjax, commitCourseWorkAjax, addCourseWorkAjax, deliveryCourseWorkAjax } from '@/api/deliver/studentManagement'
import uploadHead from './uploadHead.vue'

export default {
  components: {
    Upload,
    OssItem,
    uploadHead
  },
  inheritAttrs: false,
  props: {
    limit: {
      type: Number,
      default: 10
    },
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      uploadList: [
        // { file: null, name: '大白测试文件', status: 'waiting', key: 1, authProgress: 10, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 'uploading', key: 2, authProgress: 0, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 'error', key: 3, authProgress: 50, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 'pause', key: 4, authProgress: 75, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 'success', key: 5, authProgress: 100, fileType: 'img', poster: '', url: '' }
      ],
      uploadingList: [], // 上传中的队列
      uploadErrorList: [],
      unCompleteUploadList: [], // 未上传的队列
      index: -1, // 上传序号
      loading: false,
      show: true,
      completedList: []
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
    studentInfo() {
      return {
        userName: this.config.userName || '未知',
        userPhone: this.config.userPhone
      }
    }

  },
  watch: {
    visible(val) {
      if (val) {
        this.getCourseWorkDetail()
      } else {
        this.uploadList = []
        this.$emit('close')
      }
    }
  },
  created() {
    this.initOssToken()
  },
  methods: {
    // 点击关闭
    close() {
      this.$emit('update:visible', false)
    },
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
        key: Date.now() + Math.random(),
        status,
        index: this.index,
        name: name || file.name,
        size: file.size,
        file,
        percentage: 0
      })
    },
    updateUploadList(data) {
      if (data) {
        // 上传完成后，先删除上传中队列中的以上传完的
        const index = this.uploadingList.indexOf(data.index)
        this.uploadingList.splice(index, 1)
        // 上传完成后，删除上传列队中的已完成列队
        const index2 = _.findIndex(this.uploadList, { index: data.index })
        this.uploadList.splice(index2, 1)
        // this.uploadList.splice(index, 1)

        // 上传完成后，更新已上传作业列队
        // this.completedList.push({
        //   fileName: data.name,
        //   fileUrl: data.src
        // })
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
    async ossSuccess(data) {
      const isSuccessAddCourseWork = await this.addCourseWork(data)
      if (isSuccessAddCourseWork) {
        this.updateUploadList(data)
        this.$emit('success', data)
      }
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
      this.$refs.uploadWork.detFileMd5List()
    },
    async initOssToken() {
      const { data } = await getOssToken()
      localStorage.setItem('ossToken', JSON.stringify(data))
    },
    // 获取学员作业数据
    getCourseWorkDetail() {
      this.loading = true
      getCourseWorkDetailAjax(this.id).then(res => {
        this.loading = false
        this.completedList = res.data.fileInfoVoList || []
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交上传作业 data为要更新的list file为要上传的文件
    commitCourseWork(data, file) {
      return new Promise((resolve, reject) => {
        const commitData = {
          fileInfoVoList: data || this.completedList,
          deliveryInfoId: this.id
        }
        commitCourseWorkAjax(commitData).then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getCourseWorkDetail()
          resolve(true)
        }).catch((err) => {
          // 提示文件重复 删除列队中已重复的文件
          if (/文件重复/.test(err)) {
            this.$refs.uploadWork.detFileMd5List()
            this.updateUploadList(file)
          }
          reject(false)
        })
      })
    },
    // 新增作业
    addCourseWork(data) {
      const fileInfoVo = {
        fileName: data.name,
        fileUrl: data.src
      }
      return new Promise((resolve, reject) => {
        const addData = {
          fileInfoVoList: [fileInfoVo],
          deliveryInfoId: this.id
        }
        addCourseWorkAjax(addData).then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getCourseWorkDetail()
          resolve(true)
        }).catch((err) => {
          // 提示文件重复 删除列队中已重复的文件
          if (/文件重复/.test(err)) {
            this.$refs.uploadWork.detFileMd5List()
            this.updateUploadList(data)
          }
          reject(false)
        })
      })
    },
    // 删除已上传作业
    clearCompletedList(item) {
      this.$confirm(`是否确认删除-${item.fileName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.uploadWork.detFileMd5List()
        deliveryCourseWorkAjax(item.courseWorkId).then(() => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getCourseWorkDetail()
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.drawerBody {
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
    padding: 0 20px;

    .tabView {
      padding: 0 20px;
    }
  }
}
.upload {
  margin:20px 0;
}
.file-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  > div {
    transition: all 0.2s;
  }
}
.btn_close {
  transform: rotate(180deg);
}
</style>
