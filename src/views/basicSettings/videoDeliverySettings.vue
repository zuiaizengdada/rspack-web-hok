<template>
  <MCard>
    <div class="videoDeliverySettings">视频交付设置</div>
    <div class="form">
      <div class="tips">{{ tips }}</div>
      <el-form ref="form" :rules="rule" :model="form" label-width="100px">
        <el-form-item label="交付规则" prop="time">
          <span slot="label" class="formLabel">交付规则</span>
          <span class="formValue m-r-4">累计观看</span>
          <el-input v-model="form.time" style="width: 116px" size="small" :disabled="!ifEdit" @input="(e) => delNoNumber(e, 'time')">
            <span slot="append">分钟</span>
          </el-input>
          <span class="formValue m-l-4">自动交付</span>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!ifEdit" :loading="loading" size="small" @click="ifEdit = true">编辑</el-button>
          <template v-else>
            <el-button :loading="loading" type="primary" size="small" @click="save">保存</el-button>
            <el-button :loading="loading" size="small" @click="handleCancel">取消</el-button>
          </template>
        </el-form-item>
      </el-form>
    </div>
  </MCard>
</template>

<script>
import { getVideoLivery, setVideoLivery } from '@/api/deliver/baseSeeting'
export default {
  components: {},
  data() {
    var checkTime = (rule, value, callback) => {
      if (!Number(value) || Number(value) >= 120) {
        return callback(new Error('请输入大于0小于120的正整数'))
      }
      callback()
    }
    return {
      tips: '适用课程：价格超过1000元的普通专栏，大专栏',
      form: {
        time: ''
      },
      rule: {
        time: [{ required: true, validator: checkTime, trigger: 'blur' }]
      },
      ifEdit: false,
      defaultValue: '',
      loading: false
    }
  },
  mounted() {
    this.defaultValue = ''
    this.form.time = this.defaultValue
    this.getDetail()
    console.log('123')
  },
  methods: {
    // 点击取消
    handleCancel() {
      this.$refs.form.clearValidate()
      this.form.time = this.defaultValue
      this.ifEdit = false
    },
    // 点击保存
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('123')
          const params = {
            num: this.form.time
          }
          this.loading = true
          setVideoLivery(params).then(res => {
            this.loading = false
            this.$notify({ title: '提示', message: '操作成功' })
            this.ifEdit = false
            this.getDetail()
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    delNoNumber(e, key) {
      this.form[key] = e.replace(/\D/g, '')
    },
    // 获取视频交付设置
    getDetail() {
      this.loading = true
      getVideoLivery().then(res => {
        console.log(res, '获取视频交付设置')
        this.form.time = res.data || ''
        this.defaultValue = res.data || ''
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .el-input-group__append, .el-input-group__prepend {
    padding: 0 10px;
  }
}
.videoDeliverySettings {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 24px;
  padding-bottom: 20px;
  margin: 0 20px;
  border-bottom: 1px solid #E7E7E7;
}
.form {
  padding: 20px;
  .tips {
    background: #FFF2E6;
    border-radius: 4px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #FF7D00;
    line-height: 22px;
    padding: 9px 16px;
    margin-bottom: 16px;
  }
}
.formLabel {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
  font-weight: 500;
}
.formValue {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.m-l-4 {
  margin-left: 4px;
}
.m-r-4 {
  margin-right: 4px;
}
</style>
