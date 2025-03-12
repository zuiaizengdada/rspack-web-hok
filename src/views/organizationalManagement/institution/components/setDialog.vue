<template>
  <div class="set-box">
    <el-form
      ref="Form"
      class="form"
      size="mini"
      :model="form"
      label-width="110px"
      :rules="rules"
    >
      <el-form-item v-if="config.isOptional === 1" label="是否开启" required>
        <el-switch
          v-model="isOpened"
          :active-value="1"
          :inactive-value="0"
          @change="handleChange"
        />
      </el-form-item>
      <template v-if="config.isOptional !== 1 || isOpened === 1">
        <el-form-item
          v-for="(item, index) in config.settingsValues"
          :key="index"
          :label="item.settingsColumnName"
          :prop="item.settingsColumnCode"
        >
          <el-input v-model="form[item.settingsColumnCode]" />
        </el-form-item>
      </template>
    </el-form>
    <div v-if="config.isVerifiable === 1" class="check">
      <el-button
        v-loading="loading"
        size="small"
        class="btn"
        plain
        @click="handleVerifySetting"
      >参数校准</el-button>
      <template v-if="finished">
        <span v-if="success">校准通过</span>
        <span v-else class="fail">校准不通过</span>
      </template>
    </div>
  </div>
</template>
<script>
import { verifySetting, saveSetting } from '@/api/organization/settings.js'
export default {
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      success: false,
      form: {},
      rules: {},
      finished: false,
      isOpened: 1
    }
  },
  mounted() {
    this.isOpened = this.config.isOpened || 0
    this.form = this.config.settingsValues.reduce((acc, cur) => {
      acc[cur.settingsColumnCode] = cur.value
      return acc
    }, {})
    this.rules = this.config.settingsValues.reduce((acc, cur) => {
      acc[cur.settingsColumnCode] = [
        {
          required: true,
          message: '请输入' + cur.settingsColumnName,
          trigger: 'blur'
        }
      ]
      return acc
    }, {})
    this.$nextTick(() => {
      this.$refs.Form.clearValidate()
    })
  },
  methods: {
    handleChange(v) {
      if (!v) {
        Object.keys(this.form).forEach(i => {
          this.form[i] = ''
        })
      }
    },
    getParams() {
      return {
        type: this.config.type === '2' ? 0 : 1,
        isFinished: 1,
        isOpened: this.isOpened,
        settingsDefId: this.config.settingsDefId,
        organizationId: this.config.organizationId,
        isVerifiable: this.config.isVerifiable,
        institutionalApplyId: this.config.institutionalApplyId,
        settingsValues: this.config.settingsValues.map(item => {
          return {
            ...item,
            value: this.form[item.settingsColumnCode]
          }
        })
      }
    },
    async handleVerifySetting() {
      await this.$refs.Form.validate()
      this.loading = true
      const { data } = await verifySetting(this.getParams()).finally(
        () => (this.finished = true)
      )
      this.loading = false
      this.success = data
    },
    async handleSaveSetting() {
      await this.$refs.Form.validate()
      if (this.config.isVerifiable === 1 && this.isOpened === 1) {
        await this.handleVerifySetting()
        if (!this.success) {
          this.$message.error('参数校验不通过')
          return
        }
      }
      await saveSetting(this.getParams())
      this.$emit('success')
      this.$message.success(`${this.title}已修改成功`)
    }
  }
}
</script>
<style lang="scss" scoped>
.set-box {
  padding: 25px;
  position: relative;

  .check {
    position: absolute;
    top: 110%;

    > span {
      margin-left: 15px;
      font-size: 14px;
      color: #10c400;
      &.fail {
        color: #f56c6c;
      }
    }
  }
}
</style>
