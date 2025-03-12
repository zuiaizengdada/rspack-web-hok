<template>
  <div>
    <AppDialog
      v-if="config.visible"
      v-model="config.visible"
      :title="config.dialogType === 'ADD' ? '新增备课内容' : '编辑备课内容'"
      width="600px"
      :loading="submitLoading"
      height="auto"
      @success="sure"
      @close="handleClose"
    >
      <div class="addDialog overflowOuto">

        <el-form ref="form" class="m-t-20" :model="form" label-width="auto" size="small" :rules="rules">
          <el-form-item label="备课时间" prop="sendTime">
            <el-input ref="palyTime" v-model="form.sendTime" class="w-300" placeholder="请输入" @blur.stop="handleBlurPlayTime" @keyup.enter.native="handleBlurPlayTime" />
          </el-form-item>
          <el-form-item label="备课类型">
            <div class="flex">
              <div v-for="item in tabOptions" :key="item.value" class="tab-item" :class="{ active: item.active }" @click="selectTab(item)">
                {{ item.label }}
              </div>
            </div>
          </el-form-item>
          <template v-if="form.type === 4">
            <el-form-item label="提问内容" prop="userName">
              <el-input v-model="form.userName" class="el_input_p20" style="width: 436px" placeholder="谁提出" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item label="" prop="question">
              <el-input v-model="form.question" type="textarea" style="width: 436px" placeholder="请输入问题描述" maxlength="200" :autosize="{minRows: 6, maxRows: 6}" show-word-limit />
            </el-form-item>
            <el-form-item label="回答内容" prop="answer">
              <el-input v-model="form.answer" placeholder="请输入回答内容" type="textarea" style="width: 436px" maxlength="200" :autosize="{minRows: 2, maxRows: 6}" show-word-limit />
            </el-form-item>
          </template>
          <el-form-item v-else label="备课内容" prop="content">
            <el-input v-model="form.content" placeholder="请输入备课内容" type="textarea" style="width: 436px" maxlength="200" :autosize="{minRows: 6, maxRows: 12}" show-word-limit />
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { addMark, updateMark } from '@/api/liveRoom/courseware'
import moment from 'moment'
const tabOptions = [
  {
    label: '学员提问',
    value: 1,
    active: false
  },
  {
    label: '师生互动',
    value: 2,
    active: false
  },
  {
    label: '助教答疑',
    value: 3,
    active: false
  },
  {
    label: '一对一答疑',
    value: 4,
    active: false
  }
]
const defaultForm = {
  sendTime: '00:00:01', // 发送时间
  content: '',
  type: 5,
  userName: undefined,
  question: undefined,
  coursewareConfigId: undefined,
  userId: undefined,
  answer: undefined
}
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: true,
          data: {},
          dialogType: 'ADD',
          duration: 0
        }
      }
    }
  },
  data() {
    var checkSendTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入发送时间'))
      } else if (value === '00:00:00') {
        return callback(new Error('发送时间不能为0秒'))
      } else {
        callback()
      }
    }
    return {
      tabOptions,
      submitLoading: false,
      form: { ...defaultForm },
      rules: {
        sendTime: [
          {
            required: true,
            message: '请选择备课时间',
            trigger: 'blur',
            validator: checkSendTime
          }
        ],
        content: [
          { required: true, message: '请输入备课内容', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入提问人姓名', trigger: 'blur' }
        ],
        question: [
          { required: true, message: '请输入提问内容', trigger: 'blur' }
        ]
        // answer: [
        //   { required: true, message: '请输入回答内容', trigger: 'blur' }
        // ]
      }
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        // 是否编辑
        if (val && this.config.dialogType === 'EDIT') {
          Object.assign(this.form, { ...this.config.data, answer: this.config.data.type === 4 ? this.config.data.content : '' })
          this.tabOptions.forEach(v => {
            if (v.value === this.form.type) {
              v.active = true
            } else {
              v.active = false
            }
          })
        } else {
          this.form = { ...defaultForm }
          this.tabOptions.forEach(v => {
            v.active = false
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    handleOk() {
      this.$emit('handleOk')
    },
    init() {
      this.form = {}
    },
    handleClose() {
      if (this.config.dialogType === 'ADD') this.$emit('handleOk')
    },
    handleBlurPlayTime() {
      const total = this.formatPrTime(this.form.sendTime)
      if (total || total === 0) {
        // this.updateVideoSeekTime(total, '播放时间修改')
        this.form.sendTime = this.getFormatHMS(total * 1000)
      }
      return
      // this.isEditPlayTime = false
    },
    // 时间转秒
    formatPrTime(val) {
      const isValid = this.volidFormatTime(val)
      if (isValid) {
        const list = val.split(':').reverse()
        for (let i = 0; i < list.length; i++) {
          if (!list[i]) {
            list[i] = '00'
          }
        }
        const mss = Number(list[0]) || 0
        const ss = list.length > 1 ? Number(list[1]) * 60 : 0
        const ms = list.length > 2 ? Number(list[2]) * 3600 : 0
        // const hs = list.length > 3 ? Number(list[3]) * 3600 : 0
        const total = mss + ss + ms
        return total
      } else {
        this.form.sendTime = '00:00:01'
      }
    },
    volidFormatTime(val) {
      let isValid = true
      if (val.includes(':')) {
        const list = val.split(':')
        list.forEach(item => {
          isValid = !isNaN(Number(item))
        })
      } else {
        isValid = !isNaN(Number(val))
      }
      return isValid
    },
    // 接收豪秒的单位
    getFormatHMS(val) {
      return moment.utc(val).format('HH:mm:ss')
    },
    // 确认框
    async sure() {
      await this.$refs.form.validate()
      const sendTime = this.formatPrTime(this.form.sendTime)
      if (sendTime > this.config.duration) {
        return this.$message.error('备课时间不能大于视频时长')
      }
      this.submitLoading = true
      // 新增
      const Pro = this.config.dialogType === 'ADD' ? addMark : updateMark
      const params = {
        ...this.form,
        content: this.form.type === 4 ? this.form.answer : this.form.content,
        sendTime,
        coursewareId: this.$route.params.id
      }
      const res = await Pro(params).finally(() => {
        this.submitLoading = false
      })
      this.$message.success('操作成功')
      this.$emit('success', {
        ...params,
        coursewareConfigId: res.data

      })
    },
    selectTab(item) {
      item.active = !item.active
      this.tabOptions.forEach(v => {
        if (v.value !== item.value) {
          v.active = false
        }
      })
      const current = this.tabOptions.find(i => i.active) || {}
      this.form.type = current.value || 5
      if (this.form.type === 4) {
        this.form.question = this.form.content || this.form.question
      } else {
        this.form.content = this.form.question || this.form.content
      }
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
  .el_input_p20 {
    > input {
      padding-right: 45px;
    }
  }
}
.addDialog {
  height: 431px;
  padding: 20px;
  padding-bottom: 0;
}
::v-deep .el-checkbox__input {
  display: none;
}
.tab-item {
  width: 100px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  margin-right: 12px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #0c6fff;
  color: #0c6fff;
  cursor: pointer;
  &.active {
    background: #0c6fff;
    color: #fff;
  }
}
</style>
