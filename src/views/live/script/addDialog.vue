<template>
  <AppDialog
    v-model="config.visible"
    :title="{1: '新增备课内容', 2: '编辑备课内容'}[config.type]"
    width="588px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div class="addDialog overflowOuto">
      <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules">
        <el-form-item label="备课内容名称" prop="coursewareName">
          <el-input v-model="form.coursewareName" style="width: 450px" placeholder="请输入" clearable maxlength="40" show-word-limit />
        </el-form-item>
        <el-form-item label="关联类型" prop="refType">
          <template v-if="config.type === 2">
            {{ {1: '关联视频课件', 2: '关联剧本'}[form.refType] }}
          </template>
          <el-radio-group v-else v-model="form.refType">
            <el-radio :label="1">关联视频课件</el-radio>
            <el-radio :label="2" disabled>关联剧本</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="config.type === 1 && orgModules.enableLecturer" label="选择讲师" prop="tearch">
          <template v-if="config.type === 2 && orgModules.enableLecturer">
            {{ form.teacherName }}
          </template>
          <AppSelect v-else :get-api-fn="getTeacherList" search-key="teacherName" :value="form.teacherId" :label="form.teacherName" :props="{label: 'teacherName', value: 'teacherId' }" @selected="selectedTeacher" />
        </el-form-item>
        <el-form-item label="关联视频课件" prop="refVideoId">
          <template v-if="config.type === 2">
            {{ form.refName }}
          </template>
          <AppSelect v-else :get-api-fn="getVideoList" search-key="videoName" :value="form.refVideoId" :label="form.refName" :props="{label: 'videoName',value: 'videoId'}" @selected="selectedVideo" />
        </el-form-item>
        <el-form-item v-if="form.refVideoId" label="视频时长" prop="duration">
          {{ form.duration | filterTime }}
        </el-form-item>
        <el-form-item label="可编辑人员" prop="editPerpon">
          <el-button type="primary" @click="addAssistant">选择</el-button>
          <span class="m-l-10">注：最多可添加20人。</span>
          <div>
            <div :class="{ assessBox: form.editPerpon.length > 0 }">
              <el-tag
                v-for="(tag, index) in form.editPerpon"
                :key="tag.userId"
                class="remindPersonListView"
                :closable="!(createUserInfo.userId === tag.userId)"
                @close="delAssistant(tag, index)"
              >{{ tag.userName }}</el-tag>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" style="width: 450px" type="textarea" placeholder="请输入内容" maxlength="100" show-word-limit />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getTeacherList } from '@/api/tearchCenter/index'
import AppSelect from '@/components/AppSelect/index'
import { mapGetters } from 'vuex'
import { getVideoList } from '@/api/liveRoom/script'
import { addCourseware, editCourseware, coursewareDetail } from '@/api/liveRoom/courseware'
export default {
  components: {
    AppDialog,
    AppSelect
  },
  filters: {
    filterTime(value) {
      if (!value || typeof value !== 'number') {
        return '00:00:00'
      } else {
        const result = parseInt(value)
        const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
        const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
        const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
        return h + ':' + m + ':' + s
      }
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false
        }
      }
    },
    createUserInfo: {
      type: Object,
      default: () => {
        return {
          userId: '',
          userName: ''
        }
      }
    }
  },
  data() {
    return {
      form: {
        coursewareName: '', // 备课内容名称
        refType: 1, // 关联类型
        teacherName: '', // 关联老师姓名
        teacherId: '', // 关联老师Id
        refName: '', // 关联视频名称
        refVideoId: '', // 关联视频id
        duration: '', // 视频时长
        editPerpon: [], // 可编辑人员
        remark: '' // 备注
      },
      rules: {
        coursewareName: [{ required: true, message: '请输入备课内容名称', trigger: 'blur' }],
        refType: [{ required: true, message: '请输入关联类型', trigger: 'blur' }],
        refVideoId: [{ required: true, message: '请选择关联视频课件', trigger: 'blur' }]
      },
      loading: false,
      videoList: []
    }
  },
  computed: {
    ...mapGetters(['orgModules'])
  },
  watch: {
    'config.visible': {
      handler(val) {
        this.rules.refVideoId[0].required = this.config.type !== 2
        this.form = {
          coursewareName: '', // 备课内容名称
          refType: 1, // 关联类型
          teacherName: '', // 关联老师姓名
          teacherId: '', // 关联老师Id
          refName: '', // 关联视频名称
          refVideoId: '', // 关联视频id
          duration: '', // 视频时长
          editPerpon: [this.createUserInfo],
          remark: '' // 备注
        }
        if (this.config.type === 2) {
          this.loading = true
          coursewareDetail(this.config.row.coursewareId).then(res => {
            if (res.data.operateWhiteList.length === 0) {
              res.data.operateWhiteList = [{ userId: this.createUserInfo.userId, userName: this.createUserInfo.userName }]
            }
            res.data.operateWhiteList.map(v => {
              v.nickName = v.userName
            })
            this.form = {
              coursewareName: res.data.coursewareName, // 备课内容名称
              refType: 1, // 关联类型
              teacherName: res.data.videoDetail.teacherName, // 关联老师姓名
              teacherId: res.data.videoDetail.teacherId, // 关联老师Id
              refName: res.data.videoDetail.videoName, // 关联视频名称
              refVideoId: res.data.videoDetail.refVideoId, // 关联视频id
              coursewareId: res.data.coursewareId,
              duration: res.data.videoDetail.duration, // 视频时长
              editPerpon: res.data.operateWhiteList || [],
              remark: res.data.remark // 备注
            }
            this.$refs.form && this.$refs.form.clearValidate()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
        this.$refs.form && this.$refs.form.clearValidate()
      }
    }
  },
  mounted() {},
  methods: {
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // console.log('')
          this.config.type === 1 ? this.onAdd() : this.onEdit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onAdd() {
      this.loading = true
      const userIds = this.form.editPerpon.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const data = {
        refVideoId: this.form.refVideoId,
        refType: this.form.refType,
        remark: this.form.remark,
        coursewareName: this.form.coursewareName,
        userIds: userIds
      }
      addCourseware(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.$router.push({ path: `/live/prepareLessons/${res.data}` })
        this.$emit('success')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onEdit() {
      this.loading = true
      const userIds = this.form.editPerpon.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const data = {
        remark: this.form.remark,
        coursewareId: this.form.coursewareId,
        coursewareName: this.form.coursewareName,
        userIds
      }
      editCourseware(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.$emit('success')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getTeacherList(params) {
      console.log(params)
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherName: params.teacherName,
        serviceEnterprise: '',
        domainId: '',
        cooperateStatus: '',
        assessStatus: '',
        searchDateStart: '',
        searchDateEnd: '',
        createTimeBegin: '',
        createTimeEnd: '',
        assessResult: '',
        recommendName: '',
        createUserName: '',
        assessFlag: ''
      }
      return getTeacherList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    getVideoList(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherId: this.form.teacherId,
        covertStatus: 2, // 1-转码中 2-转码成功 3-转码失败
        status: 1, // 1:启用 2禁用
        videoName: params.videoName
      }
      return getVideoList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    selectedTeacher(res) {
      console.log(res)
      this.form.teacherId = res.teacherId
      this.form.teacherName = res.teacherName
    },
    selectedVideo(res) {
      console.log(res)
      this.form.refVideoId = res.videoId
      this.form.refName = res.videoName
      this.form.duration = res.duration
      this.$refs.form.validateField('refVideoId')
    },
    addAssistant() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        disabledUser: [this.createUserInfo.userId],
        checkUser: this.form.editPerpon,
        maxlength: 20,
        success: (res) => {
          res.user.map(v => {
            v.userName = v.nickName
          })
          this.form.editPerpon = res.user
        }
      })
    },
    delAssistant(tag, index) {
      this.form.editPerpon.splice(index, 1)
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .el-form-item__label {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}
.addDialog {
  height: 341px;
  padding: 20px;
}
.assessBox {
  margin-top: 16px;
  width: 450px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
}
.remindPersonListView {
  margin-right: 16px;
  margin-bottom: 16px;
}
</style>
