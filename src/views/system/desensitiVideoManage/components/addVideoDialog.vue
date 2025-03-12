<!-- 新增视频弹窗 -->
<template>
  <el-dialog
    :title="!!form.trainingVideoId ? '编辑培训视频' : '新增培训视频'"
    :visible.sync="dialogVisible"
    width="750px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="closeMe"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
    >
      <uploadVideo
        ref="uploadVideoRef"
        style="width: 100%; height: 170px; margin-bottom: 20px"
        @success="uploadSuccess"
        @clear="uploadClear"
      />
      <el-form-item label="视频名称" prop="videoName">
        <el-input
          v-model="form.videoName"
          placeholder="请输入视频名称"
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="是否必看" prop="mandatoryFlag">
        <el-radio-group
          v-model="form.mandatoryFlag"
          :disabled="!!form.trainingVideoId"
        >
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="绑定事件" prop="bindEventId">
        <el-select
          v-model="form.bindEventId"
          placeholder="请选择"
          style="width: 100%"
          filterable
          :disabled="!!form.trainingVideoId"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeMe">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import uploadVideo from '../components/uploadVideo/index.vue'
import {
  addTrainingVideo,
  updateTrainingVideo,
  getBindEvent
} from '@/api/trainingVideo'

export default {
  name: 'AddVideoDialog',
  components: {
    uploadVideo
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        videoName: '',
        videoUrl: '',
        posterUrl: '',
        size: 0,
        mandatoryFlag: 1,
        bindEventId: null,
        trainingVideoId: undefined,
        duration: 0
      },
      rules: {
        videoName: [
          { required: true, message: '请输入视频名称', trigger: 'change' }
        ],
        mandatoryFlag: [
          { required: true, message: '请选择是否必看', trigger: 'change' }
        ]
        // bindEventId: [
        //   { required: true, message: '请选择绑定事件', trigger: 'change' }
        // ]
      },
      options: []
    }
  },
  created() {
    this.getBindEvent()
    if (this.row.trainingVideoId) {
      this.form = { ...this.row }
      this.$nextTick(() => {
        this.$refs.uploadVideoRef.file.status = 'success'
        this.$refs.uploadVideoRef.percentage = 100
        this.$refs.uploadVideoRef.file.name = this.form.videoName
        this.$refs.uploadVideoRef.file.videoUrl = this.form.videoUrl
        this.$refs.uploadVideoRef.videoFirstimgsrc = this.form.posterUrl
        this.$refs.uploadVideoRef.file.size = this.form.size
        this.$refs.uploadVideoRef.file.duration = this.form.duration
        this.$refs.uploadVideoRef.isUpload = true
      })
    }
  },
  methods: {
    uploadClear() {
      this.form.videoName = ''
      this.form.videoUrl = ''
    },
    uploadSuccess({ url, name, videoFirstimgsrc, size, duration }) {
      this.form.videoName = name
      this.form.videoUrl = url
      this.form.posterUrl = videoFirstimgsrc
      this.form.size = size
      this.form.duration = duration
    },
    getBindEvent() {
      getBindEvent().then(res => {
        if (res.code === 1) {
          this.options = res.data.map(item => {
            return {
              value: item.bindEventId,
              label: item.bindEventName
            }
          })
        }
      })
    },
    closeMe() {
      this.$emit('update:dialogVisible', false)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    submitForm(formName) {
      if (!this.form.videoUrl) {
        this.$message({
          type: 'warning',
          message: '请上传视频'
        })
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          const api = this.form.trainingVideoId
            ? updateTrainingVideo
            : addTrainingVideo
          const params = { ...this.form }
          delete params.createBy
          delete params.createTime
          delete params.bindEventName
          delete params.videoFirstimgsrc
          if (params.trainingVideoId) {
            delete params.mandatoryFlag
            delete params.bindEventId
          }
          api(params).then(res => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.$emit('success')
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
