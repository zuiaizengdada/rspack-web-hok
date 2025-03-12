<template>
  <!-- 解除合同 -->
  <formPage title="合同档案" sub-title="合同详情" @click="$router.push('/teacherCenter/contractFile/list')">
    <div class="content">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm" size="small">
        <el-form-item prop="tearchName">
          <span slot="label" class="userName">{{ $route.query.tearchName }}</span>
          <span class="userType">{{ $route.query.teacherId }}</span>
        </el-form-item>
        <el-form-item prop="contractTerminateTime" label="解除日期">
          <el-date-picker
            v-model="form.contractTerminateTime"
            type="date"
            placeholder="选择日期"
            style="width: 180px"
            :picker-options="pickerOptions"
            value-format="timestamp"
          />
          <div class="tips m-t-8" style="color: #f53f3f">注：解除日期，一旦确定将不可更改时间</div>
        </el-form-item>
        <el-form-item prop="teacherContractMediaList" label="解除合同附件">
          <upload ref="upload" @change="fileChange" />
          <div class="tips">注：图片文件jpg,png格式 大小限10M以内，PDF文件50M以内</div>
        </el-form-item>
        <el-form-item prop="settlementInterval" label="解除原因">
          <el-input
            v-model="form.settlementInterval"
            style="width: 488px"
            type="textarea"
            placeholder="请输入内容"
            maxlength="200"
            :rows="6"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button size="small" type="primary" @click="checkForm()">确定</el-button>
      <el-button size="small" @click="goBack">返回</el-button>
    </div>
  </formPage>
</template>

<script>
import formPage from '../components/formPage'
import { parseTime } from '@/utils/index'
import upload from '../components/upload.vue'
import { teacherContarctTerminateSave } from '@/api/tearchCenter/index'
const defaultForm = {
  tearchName: '', // 老师名称
  teacherId: '', // 老师id
  contractCode: '', // 合同编码
  contractTerminateTime: '', // 合同解除日期
  settlementInterval: '', // 解除原因
  teacherName: '', // 讲师姓名
  teacherContractMediaList: [] // fileUrl fileType文件类型 isHave是否有合同电子附件false【无】【有】
}
export default {
  components: {
    formPage,
    upload
  },
  data() {
    var checkFile = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('请上传附件'))
      } else {
        return callback()
      }
    }
    return {
      form: {
        tearchName: '', // 老师名称
        teacherId: '', // 老师id
        contractCode: '', // 合同编码
        contractTerminateTime: '', // 合同解除日期
        settlementInterval: '', // 解除原因
        teacherName: '', // 讲师姓名
        teacherContractMediaList: [] // fileUrl fileType文件类型 isHave是否有合同电子附件false【无】【有】
      },
      rules: {
        contractTerminateTime: [{ required: true, message: '请选择解除日期', trigger: 'blur' }],
        teacherContractMediaList: [{ required: true, validator: checkFile, trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate: (time) => {
          return this.disabledDate(time)
        }
      }
    }
  },
  activated() {
    console.log('123')
    this.form = JSON.parse(JSON.stringify(defaultForm))
    this.$refs.upload && this.$refs.upload.setFileList([])
  },
  created() {
    console.log('456')
    this.form = JSON.parse(JSON.stringify(defaultForm))
    this.$refs.upload && this.$refs.upload.setFileList([])
    if (!this.$route.query.contractEndTime) {
      this.goBack()
    }
    console.log(this.form)
  },
  mounted() {},
  methods: {
    // 点击返回
    goBack() {
      this.$router.back()
    },
    checkForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.sure()
        } else {
          return false
        }
      })
    },
    // 点击确定
    sure() {
      // 表单校验
      this.$delModal({
        tips: `合同解除日期为 ${parseTime(this.form.contractTerminateTime, '{y}-{m}-{d}')}一旦确定将不可更改时间`,
        success: () => {
          // console.log('删除')
          this.loading = true
          const teacherContractMediaList = []
          if (this.form.teacherContractMediaList.length > 0) {
            const obj = {
              '.jpg': 0,
              '.png': 1,
              '.pdf': 2
            }
            this.form.teacherContractMediaList.map((v) => {
              teacherContractMediaList.push({
                contractCode: this.$route.query.contractCode,
                fileType: obj[v.fileUrl.match(/.[^.]+$/)[0].toLowerCase()],
                fileUrl: v.fileUrl,
                haveTerminate: 1
              })
            })
          }
          const data = {
            contractCode: this.$route.query.contractCode,
            contractTerminateTime: this.form.contractTerminateTime,
            teacherContractMediaList: teacherContractMediaList,
            terminateReason: this.form.settlementInterval,
            teacherId: this.$route.query.teacherId
          }
          teacherContarctTerminateSave(data)
            .then((res) => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.$router.back()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 文件改变触发
    fileChange(fileList) {
      const teacherContractMediaList = []
      fileList.map((v) => {
        teacherContractMediaList.push({
          fileType: 1,
          fileUrl: v.photoUrl,
          isHave: true
        })
      })
      this.form.teacherContractMediaList = teacherContractMediaList
      console.log(this.form.teacherContractMediaList, 'this.form.teacherContractMediaList')
      this.$refs.form.validateField('teacherContractMediaList')
    },
    //
    disabledDate(time) {
      console.log()
      return time.getTime() > this.$route.query.contractEndTime
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 19px;
}
.footer {
  margin-top: 56px;
  text-align: center;
}
.userName {
  font-size: 20px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: rgba(51, 51, 51, 0.9);
  line-height: 28px;
}
.userType {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #999;
  line-height: 20px;
}
</style>
