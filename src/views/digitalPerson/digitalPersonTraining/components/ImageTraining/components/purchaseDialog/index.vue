<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="730px"
    title="确认采购"
    :before-close="dialogBeforeClose"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="IP">
        <teacherInput
          ref="teacherInput"
          v-model="form.teacherId"
          attribute="teacherId"
        />
      </el-form-item>
      <el-form-item label="可用声音" prop="dynamicTags">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag.value"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag.label }}
        </el-tag>
        <el-select
          v-if="inputVisible"
          ref="saveTagInput"
          v-model="inputValue"
          filterable
          placeholder="请选择"
          class="input-new-tag"
          size="small"
          @change="handleInputConfirm"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput"
        >
          + 选择声音
        </el-button>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="submit">确认采购</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
    <BalanceNotTipsDialog
      v-model="balanceNotTipsDialog"
      :msg="balanceNotTipsDialogMsg"
    />
  </el-dialog>
</template>
<script>
import {
  confirmPurchase,
  getTeacherVoicesByOrg
} from '@/api/aiVideoManage/training'
import { getVoicesByOrg } from '@/api/aiVideoManage'
// import { checkPackageOrderBalance } from '@/api/aiVideoManage/setMealModule'
import teacherInput from '@/views/digitalPerson/imageManage/components/teacherSelect/index'
import BalanceNotTipsDialog from '@/views/digitalPerson/digitalPersonTraining/components/balanceNotTipsDialog/index.vue'
export default {
  name: 'PurchaseDialog',
  components: {
    teacherInput,
    BalanceNotTipsDialog
  },
  model: {
    prop: 'visible',
    event: 'update:visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const validateDynamicTags = (rule, value, callback) => {
      if (this.dynamicTags.length === 0) {
        callback(new Error('请选择可用声音'))
      } else {
        callback()
      }
    }
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      form: {
        teacherId: '',
        voiceIds: []
      },
      rules: {
        dynamicTags: [
          {
            required: true,
            validator: validateDynamicTags,
            trigger: 'change'
          }
        ]
      },
      options: [],
      balanceNotTipsDialog: false,
      balanceNotTipsDialogMsg: ''
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.form.teacherId = ''
        this.dynamicTags = []
        this.getVoicesByOrg()
      }
    },
    'form.teacherId'(val) {
      if (val) {
        getTeacherVoicesByOrg({ teacherId: val }).then(res => {
          if (res.data) {
            this.dynamicTags = res.data.map(item => {
              return {
                label: item.name,
                value: item.voiceId
              }
            })
          }
        })
      }
    }
  },
  methods: {
    getVoicesByOrg() {
      getVoicesByOrg().then(res => {
        this.options = res.data.map(item => {
          return {
            label: item.name,
            value: item.voiceId
          }
        })
      })
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      const isExist =
        this.dynamicTags.filter(m => m.value === inputValue).length > 0
      if (inputValue && !isExist) {
        const info = this.options.find(m => m.value === inputValue)
        this.dynamicTags.push({ ...info })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    dialogBeforeClose() {
      this.$emit('update:visible', false)
    },
    async submit() {
      // const res = await checkPackageOrderBalance({ type: 1 })
      // if (res.data && res.data.length) {
      //   this.balanceNotTipsDialog = true
      //   this.balanceNotTipsDialogMsg = res.data
      //   return
      // }
      this.$refs['form'].validate(valid => {
        if (valid) {
          confirmPurchase({
            id: this.row.id,
            teacherId: this.form.teacherId || undefined,
            voiceIds: this.dynamicTags.map(m => m.value)
          }).then(res => {
            this.$message.success('采购成功')
            this.$emit('sumbit')
            this.dialogBeforeClose()
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 140px;
  margin-left: 10px;
  vertical-align: bottom;
}
::v-deep {
  .el-dialog__header {
    .el-dialog__title {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }
  .el-dialog__body {
    padding: 20px;
  }
  .el-form-item__label {
    font-weight: 600;
    color: #000;
    padding-left: 0 !important;
    padding-bottom: 0 !important;
    padding-right: 20px !important;
  }
}
</style>
