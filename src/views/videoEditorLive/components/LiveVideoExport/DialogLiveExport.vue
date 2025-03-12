<template>
  <el-dialog title="导出视频" :visible.sync="visibleDialog" width="610px">
    <el-form ref="form" :model="form" size="mini" label-width="110px" :rules="formRules">
      <el-form-item label="导出菜单地址：">
        <p style="color:#D9D9D9">直播管理/视频列表</p>
      </el-form-item>
      <el-form-item label="视频IP：" prop="teacherId">
        <el-select v-model="form.teacherId" placeholder="请选择" style="width:310px" :remote-method="remoteMethod" remote filterable reserve-keyword>
          <el-option
            v-for="item in teacherList"
            :key="item.teacherId"
            :label="item.teacherName"
            :value="item.teacherId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="视频名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入视频名称" style="width:310px" />
      </el-form-item>
      <el-form-item label="帧速率：" prop="speed">
        <el-select v-model="form.speed" style="width:310px" placeholder="请选择帧速率">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <p class="flex justify-end mt-2">
          <el-button :loading="loading" type="primary" @click="handleClickSave('form')">生成新的视频</el-button>
          <el-button @click="handleClickCancel">取消</el-button>
        </p>

      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { teacherQueryByName } from '@/api/tearchCenter/index'
import { operateClipsVideoCompose } from '../../api/live'
export default {
  inject: ['video'],
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      teacherList: [],
      loading: false,
      form: {
        teacherId: '',
        name: '',
        speed: ''
      },
      options: [
        { value: 30, label: 30 },
        { value: 40, label: 40 },
        { value: 50, label: 50 },
        { value: 60, label: 60 }
      ],
      formRules: {
        // teacherId: [
        //   { required: true, message: '请选择IP', trigger: 'change' }
        // ],
        name: [
          { required: true, message: '请输入视频名称', trigger: 'blur' }
        ],
        speed: [
          { required: true, message: '请选择帧速率', trigger: 'change' }
        ]
      }
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
    }
  },
  methods: {
    handleClickCancel() {
      this.visibleDialog = false
      this.$refs['form'].resetFields()
    },
    async handleClickSave(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true
          const projectId = this.$route.query.projectId
          const videoId = this.video.detail.id
          const params = {
            fps: this.form.speed,
            projectId,
            teacherId: this.form.teacherId,
            videoId,
            videoName: this.form.name
          }
          operateClipsVideoCompose(params).then(res => {
            if (res.code === 1) {
              this.handleClickCancel()
            }
            this.loading = false
          }).catch(err => {
            console.log(err)
            this.loading = false
            // this.$message.error(err.message)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async remoteMethod(query) {
      const res = await teacherQueryByName({
        name: query
      })
      this.teacherList = res.data
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog{
    background:#1E1F1E;
    color:#D9D9D9;
}
::v-deep .el-dialog__header{
     border-bottom:1px solid #000;
     padding-bottom:20px;
}
::v-deep .el-dialog__title{
    color:#DEDEDE;
    font-weight: bold;
    font-size:16px;
    line-height: 24px;
}
::v-deep .el-dialog__headerbtn .el-dialog__close{
    font-size:20px;
}

::v-deep .el-form-item__label{
    color:#999;
}
::v-deep .el-input--mini .el-input__inner{
    background:#232324 ;
    border-color:#4D4D4D;
    color:#fff
}
</style>
