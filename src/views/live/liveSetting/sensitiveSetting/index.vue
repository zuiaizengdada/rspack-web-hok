<template>
  <div v-loading="loading" class="page_wrap">
    <div class="sensitive-tip">
      <i class="el-icon-warning-outline fs-16" />
      添加聊天敏感词后，用户发送包含敏感词的聊天信息将无法被其他人正常看到 ( 新增敏感词即时生效 )
    </div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="敏感词拦截类型:" prop="filtrationType" class="m-b-0">
        <el-radio-group v-model="form.filtrationType" :disabled="isEdit">
          <div class="filtrationType-container">
            <div class="filtrationType-item">
              <el-radio :label="1">敏感词所有人不可见</el-radio>
              <span class="form-tip">当发言内容命中发敏感词后，消息所有人不可见</span>
            </div>
            <div class="filtrationType-item">
              <el-radio :label="2">敏感词仅自己可见</el-radio>
              <span class="form-tip">当发言内容命中发敏感词后，消息将仅发言人可见</span>
            </div>
            <div class="filtrationType-item">
              <el-radio :label="3" disabled>敏感词带 * 可见</el-radio>
              <span class="form-tip">当发言内容有字或者词命中敏感词时将替换为 * 发送 ( 需在第三方本地审核中设置 )</span>
            </div>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="过滤手机号:" prop="filtrationPhoneNum" class="m-b-10">
        <el-switch
          v-model="form.filtrationPhoneNum"
          active-color="#13ce66"
          inactive-color="#9c9c9c"
          :disabled="isEdit"
          class="m-r-10"
        />
        <span class="form-tip">开启后，针对11位的手机号，中间4位数字替换为 * 字符</span>
      </el-form-item>
      <el-form-item label="对特殊角色生效:" prop="workToSpeRole">
        <el-switch
          v-model="form.workToSpeRole"
          class="m-r-10"
          active-color="#13ce66"
          inactive-color="#9c9c9c"
          :disabled="isEdit"
        />
        <span class="form-tip">开启后，讲师、助教的发言若包含手机号，也会经过敏感词过滤</span>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isEdit" key="edit" plain type="primary" size="small" @click="edit">编辑</el-button>
        <el-button v-else key="save" type="primary" size="small" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSensitiveSettingsAjax, upDateSensitiveSettingsAjax } from '@/api/liveRoom/setting'

export default {
  data() {
    return {
      form: {
        filtrationType: 1,
        filtrationPhoneNum: false,
        workToSpeRole: false
      },
      loading: false,
      isEdit: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getSensitiveSettings()
    },
    // 查询敏感词设置
    getSensitiveSettings() {
      this.loading = true
      getSensitiveSettingsAjax().then(res => {
        if (res.code === 1) {
          this.form = res.data
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 修改敏感词设置
    upDateSensitiveSettings() {
      const params = this.form
      return upDateSensitiveSettingsAjax(params)
    },
    submitForm() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          const { data, code } = await this.upDateSensitiveSettings()
          this.loading = false
          if (code === 1 && data === true) {
            this.isEdit = true
            this.getSensitiveSettings()
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1500
            })
          }
        } else {
          return false
        }
      })
    },
    // 编辑 解除禁止状态
    edit() {
      this.isEdit = false
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: calc(100vh - 169px)!important;
  padding: 20px 20px 0 20px;
}
.sensitive-tip {
  background: #FEECEC99;
  border-radius: 6px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #F53F3F;
  width: max-content;
  height: 38px;
  line-height: 38px;
  padding: 0 20px;
  margin-bottom: 16px;
}
.filtrationType-container {
  margin-top: 10px;
}
.filtrationType-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  .el-radio {
    margin-right: 10px !important;
  }
}
.form-tip {
  color: #999;
  position: relative;
  font-size: 14px;
}
.m-r-10 {
  margin-right: 10px;
}
.fs-16 {
  font-size: 16px;
}
.m-b-0 {
  margin-bottom: 0px;
}
.m-b-10 {
  margin-bottom: 10px;
}
</style>
