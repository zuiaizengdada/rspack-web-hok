<!-- 新增分类弹窗 -->
<template>
  <div>
    <el-dialog
      :title="title"
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
        <el-form-item label="坐席号码:">
          <span>{{ form.oldPhone }}</span>
        </el-form-item>
        <el-form-item label="被叫号码:" prop="phone">
          <el-input
            v-model="form.phone"
            maxlength="11"
            placeholder="请输入被叫号码"
            show-word-limit
          />
          <el-link
            v-if="isCountLimitObj.reachLimit"
            type="danger"
            :underline="false"
          >
            当前号码当天已呼叫{{ isCountLimitObj.calledCount }}次，超过{{
              isCountLimitObj.limitCount
            }}
            次将不可呼叫！
          </el-link>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" :loading="loading" @click="call">
          呼叫
        </el-button>
        <el-button size="small" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { countPhoneCnable } from '@/api/privateArea/outboundSeats'
import eventBus from '@/utils/eventBus'
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
        phone: undefined,
        oldPhone: undefined
      },
      title: '测试呼叫',
      rules: {
        phone: [
          { required: true, message: '请输入被叫号码', trigger: 'change' },
          {
            pattern:
              /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'bulr'
          }
        ]
      },
      loading: false,
      visibleCallPhone: false,
      isCountLimitObj: {},
      phoneNumber: ''
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
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.form.oldPhone = this.row.bindPhone
      } else {
        this.isCountLimitObj = {}
      }
    }
  },
  methods: {
    async getIsCountLimit() {
      const res = await countPhoneCnable(this.form.phone)
      this.isCountLimitObj = { ...res.data }
    },
    call() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.phoneNumber = this.form.phone
          await this.getIsCountLimit()
          if (this.isCountLimitObj.reachLimit) return

          eventBus.$emit('handleTestCall', {
            id: this.row.id,
            phone: this.phoneNumber
          })
          // this.handleClose()
        }
      })
    },
    handleClose() {
      this.form = {
        phone: undefined
      }
      this.$refs.form.resetFields()
      this.$emit('close')
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
