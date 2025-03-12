<template>
  <!-- 批量上传作业弹框 -->
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
        <div class="ss-material-box-header-title">批量上传作业</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent overflowOuto">
        <div class="alertTips">已上传作业的不能再批量上传作业，作业只能上传pdf,doc,docx,ppt,pptx,xls,xlsx格式，单文件不能超过10M，最多支持10个文件同时上传</div>
        <uploadCoureWork v-for="item in config.userList" :id="item.deliveryInfoId" :key="item.deliveryInfoId" :config="item" />
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
import uploadCoureWork from './uploadCoureWork.vue'
import { getOssToken } from '@/api/qiniu'

export default {
  components: {
    uploadCoureWork
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
      if (!val) {
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
    async initOssToken() {
      const { data } = await getOssToken()
      localStorage.setItem('ossToken', JSON.stringify(data))
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
.btn_close {
  transform: rotate(180deg);
}
.alertTips {
    background: #FFF2E6;
    border-radius: 4px;
    padding: 10px 16px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #FF7D00;
    line-height: 22px;
    margin-bottom: 32px;
    margin-top: 20px;
  }
</style>
