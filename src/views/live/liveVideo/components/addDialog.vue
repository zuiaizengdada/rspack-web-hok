<template>
  <div>
    <AppDialog
      v-if="config.visible"
      v-model="config.visible"
      title="上传视频"
      width="580px"
      :loading="submitLoading"
      height="auto"
      @success="sure"
      @close="handleClose"
    >
      <div class="addDialog overflowOuto">
        <div class="errorTips">
          <i class="el-icon-warning-outline" />
          上传视频中请勿关闭浏览器，否则会导致上传失败！
        </div>
        <el-form
          ref="form"
          v-loading="loading"
          class="m-t-20"
          :model="form"
          label-width="auto"
          size="small"
          :rules="rules"
        >
          <el-form-item label="视频课件管理" prop="videoName">
            <el-input v-model="form.videoName" maxlength="40" show-word-limit class="el_input_p40" />
          </el-form-item>
          <el-form-item label="上传视频" prop="url">
            <upload
              :is-lt="10"
              :src.sync="form.url"
              :disabled="config.dialogType === 'EDIT'"
              :is-md5="true"
              @onChangeFile="handleFile"
            />
          </el-form-item>
          <el-form-item v-if="orgModules.enableLecturer" label="关联讲师" prop="teacherId">
            <m-select
              v-model="form.teacherId"
              style="width: 200px"
              :default-name="form.teacherName"
              remote
              :request="teacherQueryByName"
              :param="{ value: 'teacherId', label: 'teacherName' }"
            />
            <span class="m-l-10" style="color: #F53F3F;font-size: 14px;line-height: 22px;font-weight: 400;">注: 讲师是指师资档案的讲师。</span>
          </el-form-item>
          <el-form-item label="视频标签" prop="labels">
            <m-select
              v-model="form.labels"
              placeholder="最多选择10个视频标签"
              :multiple-limit="10"
              style="width: 100%"
              multiple
              allow-create
              filterable
              default-first-option
              :request="getVideoLabels"
              :param="{ value: 'label', label: 'label' }"
              @change="handleTabelChange"
            />
            <div class="tagText">注：可输入自定义标签按回车键生成新标签(最多选择10个视频标签)</div>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>
    <uploadProgress :config="progressConfig" @Ok="handleOk" />
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog' // getLabels
import { getSignature } from '@/api/liveVideo'
import upload from '@/components/AppUploadTx'
import uploadProgress from './uploadProgress.vue'
import { teacherQueryByName } from '@/api/tearchCenter/index'
import { mapGetters } from 'vuex'
import {
  getVideoLabels,
  getVideoDetail,
  saveVideoModify,
  videoNameIsExist,
  videoIsExist
} from '@/api/liveVideo'
export default {
  components: {
    AppDialog,
    upload,
    uploadProgress
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          data: {},
          dialogType: 'ADD'
        }
      }
    }
  },
  data() {
    const patrn = /[\/\\:*?"<>|”“&]/im
    const validator = (rule, value, callback) => {
      if (!value) {
        callback('请输入视频名称')
      } else if (patrn.test(value)) {
        callback('名称不能包含\\ / : * ? " <> | ”“&特殊字符。')
      } else {
        callback()
      }
    }
    return {
      teacherQueryByName,
      getVideoLabels,
      loading: false,
      submitLoading: false,
      form: {
        videoName: '', // 视频名称
        url: '', // 视频url
        tearchrName: '', // 关联讲师名称
        teacherId: '', // 关联讲师id
        labels: [], // 视频标签
        file: '',
        md5: ''
      },
      rules: {
        videoName: [
          { required: true, validator, trigger: 'blur' }
        ],
        url: [{ required: true, message: '请上传视频', trigger: 'blur' }]
        // teacherId: [
        //   { required: true, message: '请选择关联讲师', trigger: 'blur' }
        // ]
      },
      progressConfig: {
        visible: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'orgModules'
    ])
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (!val) return this.init()
        // 是否编辑
        if (val && this.config.dialogType === 'EDIT') this.getVideoDetail()
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    async getVideoDetail() {
      this.loading = true
      try {
        const res = await getVideoDetail(this.config.data.id)
        if (res.code === 1) {
          this.form = {
            ...res.data,
            labels: res?.data?.labels?.map(item => item.label)
          }
        }

        this.loading = false
      } catch {
        this.loading = false
      }
    },
    handleOk() {
      this.$emit('handleOk')
    },
    init() {
      this.form = {
        videoName: '', // 视频名称
        url: '', // 视频url
        tearchrName: '', // 关联讲师名称
        teacherId: '', // 关联讲师id
        labels: [], // 视频标签
        file: '',
        md5: ''
      }
    },
    async handleFile(file, md5) {
      this.form.file = file
      this.form.md5 = md5
    },
    // 验证视频名称和md5是否重复
    // async existAll() {
    //   const feathOne = videoNameIsExist({ videoName: this.form.videoName })
    //   const feathTwo = videoIsExist({ md5: this.form.md5 })
    //   try {
    //     const res = await Promise.all([feathOne, feathTwo])
    //     this.submitLoading = false
    //     if (res[0].code === 1 && res[0].data) {
    //       this.$message('视频名称重复')
    //       return
    //     }
    //     if (res[1].code === 1 && res[1].data) {
    //       this.$message('上传视频重复')
    //       return
    //     }
    //     return true
    //   } catch {
    //     this.submitLoading = false
    //     return
    //   }
    // },
    handleClose() {
      if (this.config.dialogType === 'ADD') this.$emit('handleOk')
    },
    // 确认框
    async sure() {
      await this.$refs.form.validate()
      this.submitLoading = true
      // 新增
      if (this.config.dialogType === 'ADD') {
        if (!this.form.file || !this.form.md5) {
          return this.$message('视频正在上传中')
        }
        // 是否视频重复
        const resData = await videoNameIsExist({ videoName: this.form.videoName })
        if (resData.code === 1 && resData.data) {
          this.$message.error('该视频名称已存在，请进行修改！')
          this.submitLoading = false
          return
        }
        const res = await videoIsExist({ md5: this.form.md5 })
        this.submitLoading = false
        // 是否视频重复
        if (res.code === 1 && res.data) {
          this.$message.error('视频已存在，请勿重复上传！')
          return
        }
        this.txUpload()
        return
      }
      // 编辑
      this.saveEditFeath()
    },

    async saveEditFeath() {
      const param = {
        ...this.form,
        labels: this.form.labels?.map(item => ({
          label: item
        }))
      }
      this.submitLoading = true
      try {
        const res = await saveVideoModify(param)
        this.submitLoading = false
        if (res.code === 1) this.$emit('handleOk', 'EDIT')
      } catch {
        this.submitLoading = false
      }
    },
    handleTabelChange(value) {
      const isMsg = value.some(item => item.length > 10)
      isMsg && this.$message('标签最大长度为10')
      this.form.labels = value?.filter(item => item.length <= 10) || []
    },
    // 初始化腾讯云上传 TcVod
    txUpload() {
      this.progressConfig = {
        // eslint-disable-next-line new-cap
        tcVod: new window.TcVod.default({
          getSignature: this.queryGetSignature // 前文中所述的获取上传签名的函数
        }),
        data: {
          mediaFile: this.form.file, // 媒体文件（视频或音频或图片），类型为 File
          mediaName: this.form.videoName
        },
        visible: true
      }
    },
    // 生成签名
    async queryGetSignature() {
      const res = await getSignature({
        labels: this.form.labels?.map(item => ({
          label: item
        })) || [],
        md5: this.form.md5,
        teacherId: this.form.teacherId,
        videoName: this.form.videoName
      })
      return res.data
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-form-item__label {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
   .el_input_p40 {
    > input {
      padding-right: 45px;
    }
  }
}
::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fbfcfe;
      width: 200px;
      height: 150px;
    }
  }
}
.addDialog {
  height: 431px;
  padding: 20px;
  .errorTips {
    width: 100%;
    padding: 8px 20px;
    background: rgba(254, 236, 236, 0.4);
    border-radius: 6px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #f53f3f;
    line-height: 22px;
  }
}
.tagText{
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
}
</style>
