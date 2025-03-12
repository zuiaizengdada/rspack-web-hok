<template>
  <div class="detail-page">
    <div class="title">基本信息</div>
    <el-row>
      <el-col class="text-l" :span="3">公司全称：</el-col>
      <el-col class="text-r" :span="8">{{ info.companyName }}</el-col>
      <el-col class="text-l" :span="3">公司简称：</el-col>
      <el-col class="text-r" :span="8">{{ info.companyAbbreviation }}</el-col>
    </el-row>
    <el-row>
      <el-col class="text-l" :span="3">姓名：</el-col>
      <el-col class="text-r" :span="8">{{ info.name }}</el-col>
      <el-col class="text-l" :span="3">手机号：</el-col>
      <el-col class="text-r" :span="8"><Phone :default-value="JSON.stringify(info.phone)" /></el-col>
    </el-row>
    <el-row>
      <el-col class="text-l" :span="3">企业代码：</el-col>
      <el-col class="text-r" :span="8">{{ info.enterpriseCode }}</el-col>
      <el-col class="text-l" :span="3">入驻模块：</el-col>
      <el-col class="text-r" :span="8">{{ info.packageName }}</el-col>
    </el-row>
    <div class="title">入驻需求</div>
    <el-form ref="Form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="机构标识" prop="companyEnglishAbbreviation">
        <el-input
          v-model.number="form.companyEnglishAbbreviation"
          class="w-300"
          placeholder="请输入机构标识"
          maxlength="20"
          :show-word-limit="true"
        />
      </el-form-item>
      <el-form-item label="管理员姓名" prop="administratorName">
        <el-input
          v-model.number="form.administratorName"
          class="w-300"
          placeholder="请输入管理员姓名"
          maxlength="50"
          :show-word-limit="true"
        />
      </el-form-item>
      <el-form-item label="管理员手机号" prop="administratorPhone">
        <el-input
          v-model.number="form.administratorPhone"
          class="w-300"
          placeholder="请输入管理员手机号"
          maxlength="11"
          :show-word-limit="true"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Phone from '@/components/watchPhoneNumber/index.vue'
import { beforeApproved } from '@/api/organization/settings.js'
import { rules } from './columns'
export default {
  components: {
    Phone
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        companyEnglishAbbreviation: '',
        administratorName: '',
        administratorPhone: ''
      },
      rules: rules()
    }
  },
  methods: {
    submit() {
      this.$refs.Form.validate(async valid => {
        if (valid) {
          this.$confirm(`确认审核通过吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              await beforeApproved({
                ...this.form,
                id: this.info.id,
                phone: this.info.phone
              })
              this.$emit('success')
            })
            .catch(() => { })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-page {
  width: 100%;
}

.title {
  line-height: 28px;
  position: relative;
  padding-left: 24px;
  font-weight: 600;
  font-size: 14px;
  color: #333333;
  margin: 10px 0;
}

.title1 {
  font-weight: normal;
}

.el-row {
  >div {
    padding: 5px 0;
  }
}

.text-l {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 28px;
  text-align: right;
}

.text-r {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 28px;
  word-break: break-all;
  white-space: pre-wrap;
  text-align: left;
}
</style>
