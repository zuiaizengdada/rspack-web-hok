<!-- 新增弹窗 -->
<template>
  <div>
    <el-dialog
      :title="row.id ? '编辑' : '新增'"
      :visible.sync="visible"
      width="550px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        size="small"
      >
        <el-form-item label="选择人员:" prop="name">
          <el-button type="primary" @click="openUser"> 请选择 </el-button>
          <!-- v-if="!form.name"
          <span v-else class="link-c" @click="openUser">{{ form.name }}</span>
           -->
        </el-form-item>
        <el-form-item label="坐席姓名:">
          <span style="user-select: none">{{ form.displayName }}</span>
        </el-form-item>
        <el-form-item v-if="isShowCode" label="绑定手机:" prop="phone">
          <el-input
            v-model="form.phone"
            maxlength="11"
            placeholder="请输入绑定手机"
            show-word-limit
          />
          <el-link type="info" :underline="false">
            坐席外呼使用的手机号码，非外显号码
          </el-link>
        </el-form-item>
        <el-form-item
          v-if="isShowCode && !isBinding"
          label="验证码:"
          prop="code"
        >
          <div class="flex flex_middle">
            <el-input
              v-model="form.code"
              placeholder="请输入验证码"
              style="width: 120px"
            />
            <el-button type="text" style="margin-left: 6px" @click="sendCode">{{
              codeTitle
            }}</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" :loading="loading" @click="handleClose">
          取 消
        </el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          @click="submit"
        >
          {{ submitTxt }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  callAgentAdd,
  callAgentCode,
  agentVerify,
  callAgentEdit,
  verifyBefore,
  selectDeptByUserIds
} from '@/api/privateArea/outboundSeats'

export default {
  model: {
    prop: 'visible',
    event: 'getVisible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        name: undefined,
        displayName: '请选择人员',
        phone: undefined,
        userId: undefined
      },
      rules: {
        name: [{ required: true, message: '请选择人员', trigger: 'change' }],
        phone: [
          { required: true, message: '请输入绑定手机', trigger: 'change' },
          {
            pattern:
              /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[\d]))\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'bulr'
          }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'change' }]
      },
      loading: false,
      submitTxt: '确 定',
      codeTitle: '获取验证码',
      interval: null,
      isBinding: true
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    },
    isShowCode() {
      return !this.row.id
    }
  },
  watch: {
    isShowCode(val) {
      if (!val) {
        if (this.interval) {
          clearInterval(this.interval)
        }
        this.codeTitle = '获取验证码'
      }
    }
  },
  created() {
    if (this.row.id) {
      this.form = {
        name: this.row.userName || undefined,
        displayName: this.row.deptName
          ? this.row.deptName + '/' + this.row.userName
          : '请选择人员',
        phone: this.row.bindPhone || undefined,
        userId: this.row.userId || undefined
      }
      this.codeTitle = '获取验证码'
    }
  },
  methods: {
    async sendCode() {
      if (
        this.form.phone === undefined ||
        !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[\d]))\d{8}$/.test(
          this.form.phone
        )
      ) {
        this.$refs.form.validate()
        return
      }
      if (this.codeTitle !== '获取验证码') {
        this.$refs.form.validate()
        return
      }

      const vb = await verifyBefore({ phone: this.form.phone })
      if (vb.data) {
        this.$message.info('该手机号已验证，无需获取验证码')
        this.isBinding = true
        return
      }
      await callAgentCode({
        bindPhone: this.form.phone,
        channelAgentId: this.form.channelAgentId
      })
        .then(() => {
          let num = 60
          this.interval = setInterval(() => {
            if (num > 0) {
              this.codeTitle = num - 1 + 's后重新获取'
              num--
            } else {
              clearInterval(this.interval)
              this.codeTitle = '获取验证码'
            }
          }, 1000)
        })
        .catch(() => {})
    },
    openUser() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        disabledUser: [],
        success: async res => {
          console.log(res)
          this.form.name = res.user[0].nickName
          this.form.userId = res.user[0].userId
          const info = await selectDeptByUserIds([this.form.userId])
          console.log(info, 'info')
          this.form.displayName = info.data[0].deptName + '/' + res.user[0].name
          if (!this.row.id) {
            const params = {
              agentId: this.row.id || undefined,
              userId: this.form.userId
            }
            const addInfo = await callAgentAdd(params)
            this.form.channelAgentId = addInfo.data.channelAgentId
            this.form.phone = addInfo.data.userPhone || ''
            const vb = await verifyBefore({ phone: this.form.phone })
            this.isBinding = vb.data
          }
        }
      })
    },
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          if (this.row.id) {
            callAgentEdit({
              agentId: this.row.id,
              userId: this.form.userId
            })
              .then(() => {
                this.loading = false
                this.$message.success('操作成功')
                this.handleClose()
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            const vb = await verifyBefore({ phone: this.form.phone })
            this.isBinding = vb.data
            if (!this.isBinding && !this.form.code) {
              this.$nextTick(() => {
                this.loading = false
              })
              return
            }
            agentVerify({
              bindPhone: this.form.phone,
              channelAgentId: this.form.channelAgentId,
              userId: this.form.userId,
              verifyCode: this.form.code || undefined
            })
              .then(() => {
                this.loading = false
                this.$message.success('操作成功')
                this.handleClose()
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.textarea-s {
  position: relative;
  .btn-s {
    position: absolute;
    bottom: -6px;
    left: 16px;
    &:hover {
      cursor: pointer;
    }
  }
}
.link-c {
  user-select: none;
  cursor: pointer;
  &:hover {
    color: #2c82ff;
  }
}
::v-deep .textarea-s {
  .el-form-item__content {
    position: relative;
    .el-textarea {
      .el-textarea__inner {
        padding-bottom: 20px;
      }
    }
  }
}
</style>
