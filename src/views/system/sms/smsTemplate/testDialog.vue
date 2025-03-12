<template>
  <AppDialog
    v-model="config.visible"
    title="测试"
    width="518px"
    :loading="loading"
    height="auto"
    :footer-text="['发送短信', '取消']"
    @success="sure"
  >
    <div v-loading="loading" class="detailDialog overflowOuto">
      <el-form ref="form" :model="form" size="small">
        <el-form-item
          label="签名"
          label-width="80px"
          prop="signatureName"
          :rules="[
            { required: true, message: '请选择签名', trigger: 'change' }
          ]"
        >
          <el-select v-model="form.signatureName" class="w-200">
            <el-option v-for="(item) in channelSignatureList" :key="item.id" :label="item.signatureName" :value="item.signatureName" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in form.phone"
          :key="index"
          label-width="80px"
          :prop="'phone.' + index + '.value'"
          :label="index === 0 ? '手机号' : ''"
          :rules="[
            {required: true, message: '手机号不能为空', trigger: 'blur'},
            { type: 'number', message: '请输入正确的手机格式', trigger: 'blur', min: 11 }
          ]"
        >
          <el-input v-model.trim="domain.value" class="w-200" placeholder="请输入" maxlength="11" @input="(e) => delNoNumber(e, domain)" />
          <div v-if="form.phone.length < 10" class="addPhoneBtn" @click="addPhoneFn"><i class="el-icon-plus" /></div>
          <div v-if="form.phone.length > 1" class="addPhoneBtn" @click="delPhoneFn(index)"><i class="el-icon-minus" /></div>
        </el-form-item>
        <el-form-item label="原短信模板" label-width="80px">
          {{ detail.channelTemplateContent }}
        </el-form-item>
        <div class="tips">短信模板参数完善（以下必填，单个参数最多不能超过30个字）</div>
        <el-form-item
          v-for="(keyword, index) in form.keyword"
          :key="keyword.paramName"
          label-width="120px"
          :prop="'keyword.' + index + '.paramValue'"
          :label="keyword.paramName"
          :rules="paramTypeReqsOptions[Number(keyword.paramType || 0)].rules || []"
        >
          <el-date-picker v-if="Number(keyword.paramType || 0) === 3" v-model="keyword.paramValue" value-format="yyyy-MM-dd HH:mm:ss" class="w-200" type="datetime" placeholder="选择日期时间" @change="(e) => onhandleInput(e, keyword)" />
          <el-input v-else v-model.trim="keyword.paramValue" class="w-200" placeholder="请输入" maxlength="30" @input="(e) => onhandleInput(e, keyword)" />
        </el-form-item>
        <div class="tips" style="margin-bottom: 8px">替换后短信内容</div>
        <div class="replaceText">
          <div v-html="form.replaceText" />
        </div>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getOptionsValueByKey } from '@/filters'
import { paramTypeReqsOptions } from './columns'
import { getDetailById, testSend, getChannelSignaturePage } from '@/api/system/sms.js'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          id: ''
        }
      }
    }
  },
  data() {
    return {
      paramTypeReqsOptions,
      loading: false,
      detail: {
        channelTemplateContent: '',
        id: 0
      },
      form: {
        phone: [{ value: '' }],
        keyword: [],
        replaceText: '',
        signatureName: ''
      },
      channelSignatureList: []
      // rules: {
      //   signatureName: [
      //     { required: true, message: '请选择签名', trigger: 'change' }
      //   ]
      // }
      // keyArr: []
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        this.form = {
          phone: [{ value: '' }],
          keyword: [],
          replaceText: '',
          signatureName: ''
        }
        this.$refs.form && this.$refs.form.clearValidate()
        val && this.getDetail()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    delNoNumber(e, domain) {
      let val = ''
      if (e) {
        val = Number(e.replace(/\D/g, ''))
      }
      domain.value = val
    },
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const phoneList = this.form.phone.reduce((pre, next) => { pre.push(next.value); return pre }, [])
          const params = {
            phoneList,
            signatureName: this.form.signatureName,
            templateId: this.config.id,
            paramList: this.form.keyword
          }
          testSend(params).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 点击添加手机号
    addPhoneFn() {
      this.form.phone.push({ value: '' })
    },
    delPhoneFn(index) {
      this.form.phone.splice(index, 1)
    },
    // 提取模板参数
    // 获取${}内容
    autoTestConten(str) {
      return str.match(/(?<=\$\{).*?(?=\})/ig)
    },
    // 数组去重
    noRepeat(arr) {
      var newArr = [...new Set(arr)] // 利用了Set结构不能接收重复数据的特点
      return newArr
    },
    getDetail() {
      this.loading = true
      this.keyArr = []
      return getDetailById(this.config.id).then(res => {
        this.detail = res.data
        this.loading = false
        this.form = {
          phone: [{ value: '' }],
          keyword: [],
          replaceText: this.detail.channelTemplateContent,
          signatureName: ''
        }
        this.keyArr = this.noRepeat(this.autoTestConten(this.detail.channelTemplateContent))
        if (res.data.paramTypes && res.data.paramTypes.length > 0) {
          this.form.keyword = res.data.paramTypes.reduce((pre, next) => {
            pre.push({
              paramName: next.paramName,
              paramValue: '',
              paramType: next.paramType
            })
            return pre
          }, [])
        }
        return this.getChannelPage()
      }).catch(() => {
        this.loading = false
      })
    },
    getReplaceText() {
      let str = this.detail.channelTemplateContent
      this.keyArr.map(v => {
        const value = getOptionsValueByKey('paramName', 'paramValue', v, this.form.keyword)
        const reg = new RegExp('(\\$\\{)(' + v + ')(\\})', 'g')
        value && (str = str.replace(reg, `<span style="font-size: 16px;color: #333;font-weight: bold;">${value}</span>`))
      })
      return str
    },
    onhandleInput() {
      this.form.replaceText = this.getReplaceText()
    },
    // 获取签名列表数据
    getChannelPage() {
      this.loading = true
      const params = {
        pageIndex: 1,
        pageSize: 99999999,
        channelId: this.detail.channelId,
        signatureName: ''
      }
      return getChannelSignaturePage(params).then(res => {
        console.log(' 获取渠道列表数据', res)
        this.channelSignatureList = res.data.items
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.detailDialog {
  padding: 16px;
  height: 465px;
  .addPhoneBtn {
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 1px dashed #DCDCDC;
    line-height: 32px;
    text-align: center;
    margin-left: 8px;
    border-radius: 4px;
    cursor: pointer;
    color: #333;
  }
  .tips {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    margin-left: 7px;
    margin-bottom: 16px;
  }
}
::v-deep {
  .el-form-item__label {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    font-weight: normal;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 16px;
  }
}
.replaceText {
  padding: 10px;
  background: #F7FBFF;
  border-radius: 8px;
}
</style>
