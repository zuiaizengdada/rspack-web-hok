<template>
  <div class="sysTempForm">
    <el-form ref="form" :model="form" size="small" label-width="auto" class="sysTempFormView overflowOuto" :rules="rules">
      <el-form-item label="模板名称" prop="templateName">
        <el-input v-model="form.templateName" class="w_488" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="模板类型" prop="smsTypeId">
        <el-select v-model="form.smsTypeId" class="w_488" placeholder="请选择" @change="smsTypeIdChange">
          <el-option v-for="(item) in smsTypeOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <div>
          <LabelInput
            ref="LabelInput"
            v-model="labelInput"
            maxlength="30"
            show-word-limit
            :disabled="form.tags.length >= 5"
            @keyup.enter.native="addLabel"
            @select="labelSelect"
          />
          <span class="tips">注：输入一个关键词后，按回车生成标签</span>
        </div>
        <div v-if="form.tags.length > 0" class="labelNameList w_488">
          <el-tag v-for="(item, index) in form.tags" :key="index" class="m-r-16" size="small" closable @close="delLabel(item, index)">{{ item.name }}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="模板内容" prop="content" style="margin-bottom: 16px;">
        <el-button :disabled="!form.smsTypeId" @click="onClickInsertCode">插入参数</el-button>
        <div style="position: relative;" class="m-t-16">
          <el-input ref="msgContent" v-model="form.content" :rows="3" class="w_488" type="textarea" maxlength="500" show-word-limit :disabled="!form.smsTypeId" />
          <span class="tips" v-html="tips" />
        </div>
      </el-form-item>
      <el-form-item v-if="form.smsTypeId === 3">
        <el-select v-model="reply" placeholder="请选择" style="width: 109px;">
          <el-option label="拒收请回复R" value="拒收请回复R" />
          <!-- <el-option label="退订回N" value="退订回N" /> -->
        </el-select>
        <span v-if="form.smsTypeId === 3" class="tips">营销推广短信在末尾必须加上退订说明才能过审。</span>
      </el-form-item>
      <el-form-item label="参数">
        <el-form-item
          v-for="(paramTypeReqs, index) in form.paramTypeReqs"
          :key="paramTypeReqs.paramName"
          label-width="120px"
          :prop="'paramTypeReqs.' + index +'.paramType'"
          :label="paramTypeReqs.paramName"
          :rules="{required: true, message: '不能为空', trigger: 'change'}"
          style="margin-bottom: 16px;"
        >
          <el-select v-model="paramTypeReqs.paramType" style="width: 368px" placeholder="请选择" :disabled="form.smsTypeId === 1">
            <template v-for="item in paramTypeReqsOptions">
              <el-option
                v-if="!(Number(item.value) === 0 && form.smsTypeId !== 1)"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              />
            </template>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="form.smsTypeId && type === '1'" label="渠道商申请" prop="channelIds">
        <el-checkbox-group v-model="form.channelIds" class="w_488">
          <el-checkbox v-for="(item) in canShowSmsChannelList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="场景链接" prop="sceneLink">
        <el-input v-model="form.sceneLink" class="w_488" maxlength="200" show-word-limit />
        <span class="tips">渠道商选择阿里时，场景链接必填，可以是公众号，网址等…</span>
      </el-form-item>
      <el-form-item label="场景说明" prop="sceneDescription">
        <el-input v-model="form.sceneDescription" class="w_488" type="textarea" maxlength="500" show-word-limit />
        <span class="tips">渠道商选择阿里时，场景说明必填。</span>
      </el-form-item>
    </el-form>
    <div class="sysTempFormFooter">
      <el-button size="small" type="primary" :loading="loading" @click="sure">提交</el-button>
      <el-button size="small" :loading="loading" @click="goback()">取消</el-button>
    </div>

    <!-- 弹框层 -->
    <InsertCodeDialog :config="InsertCodeDialogConfig" @success="onhandleInsertCodeFn" />
  </div>
</template>

<script>
import LabelInput from './labelinput.vue'
import { smsTypeOption } from '../channelProvider/columns'
import InsertCodeDialog from './InsertCodeDialog.vue'
import { getSmsChannelList, addSmsTemplate, updateSmsChannelTemplate, getDetailById } from '@/api/system/sms.js'
import { paramTypeReqsOptions } from './columns'
export default {
  components: {
    LabelInput,
    InsertCodeDialog
  },
  props: {
    type: {
      type: [String, Number],
      default: '1' // 1新增 2编辑
    }
  },
  data() {
    var validateSceneLink = (rule, value, callback) => {
      if (this.form.channelIds.includes(this.aliSmsChannelId) && !value) {
        return callback('请输入场景链接')
      } else {
        return callback()
      }
    }
    var validateSceneDescription = (rule, value, callback) => {
      if (!value) {
        return callback('请输入场景说明')
      } else {
        return callback()
      }
    }
    var validateContent = (rule, value, callback) => {
      if (!value) {
        return callback('请输入模板内容')
      }
      // 校验是否有大括号
      if (/[\[\]【】]/g.test(value)) {
        return callback('模板中不允许有大括号【】[]')
      }
      // 校验参数是否合法
      const obj = this.keyArr.find(v => !/^[a-zA-Z]+$/.test(v))
      if (typeof obj !== 'undefined') {
        return callback(`参数名不合法：参数格式只能为英文`)
      }
      // if () {
      //   return callback('参数格式错误：参数名请使用英文或者数字')
      // }
      callback()
    }
    return {
      loading: false,
      paramTypeReqsOptions,
      smsTypeOption,
      labelInput: '',
      form: {
        templateName: '', // 模板名称
        smsTypeId: '', // 模板类型
        tags: [], // 标签
        content: '', // 模板内容
        paramTypeReqs: [], // 参数
        sceneLink: '', // 场景链接
        sceneDescription: '', // 场景说明
        channelIds: []// 渠道商申请
      },
      reply: '拒收请回复R',
      tips: '签名+内容不超过70字算1条，<br/>超过每67字算1条。模版类型为验证码时，参数只能为4-6位数字；<br/>模版中不允许有大括号；参数需使用${英文字符}，例如${name}',
      InsertCodeDialogConfig: {
        visible: false
      },
      SmsChannelList: [], // 渠道商列表数据（全部启用的渠道商）
      rules: {
        templateName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        smsTypeId: [
          { required: true, message: '请选择模板类型', trigger: 'change' }
        ],
        content: [
          { required: true, validator: validateContent, trigger: 'blur' }
        ],
        channelIds: [
          { type: 'array', required: true, message: '请至少选择一个渠道商', trigger: 'change' }
        ],
        sceneLink: [
          { required: false, validator: validateSceneLink, trigger: 'blur' }
        ],
        sceneDescription: [
          { required: true, validator: validateSceneDescription, trigger: 'blur' }
        ]
      },
      aliSmsChannelId: '', // 阿里的渠道商id
      keyArr: []
    }
  },
  computed: {
    canShowSmsChannelList() {
      const arr = []
      this.SmsChannelList.map(v => {
        v.name === '阿里云' && (this.aliSmsChannelId = v.id)
        v.smsTypeVos && (
          v.smsTypeVos.map(e => {
            e.id === this.form.smsTypeId && arr.push(v)
          })
        )
      })
      return arr
    }
  },
  watch: {
    'form.channelIds': {
      handler(val) {
        if (val.includes(this.aliSmsChannelId)) {
          this.rules.sceneLink[0].required = true
        } else {
          this.rules.sceneLink[0].required = false
        }
        this.$refs.form && this.$refs.form.validateField(['sceneLink'])
      },
      deep: true,
      immediate: true
    },
    'form.content': {
      handler(val) {
        this.keyArr = this.noRepeat(this.autoTestConten(val))
        // 参数处理，paramTypeReqs中有原属性保留其数据类型
        const oldArr = JSON.parse(JSON.stringify(this.form.paramTypeReqs))
        const nexArr = []
        this.keyArr.map(v => {
          const obj = {
            paramName: v,
            paramType: this.form.smsTypeId === 1 ? 0 : 1
          }
          const paramName = oldArr.find(e => e.paramName === v)
          paramName && (obj.paramType = paramName.paramType)
          nexArr.push(obj)
        })
        this.form.paramTypeReqs = nexArr
        this.$refs.form && this.$refs.form.validateField('content')
      },
      deep: true,
      immediate: false
    }
  },
  mounted() {
    this.aliSmsChannelId = ''
    this.getSmsChannelList().then(() => {
      if (this.$route.params.id) {
        this.getDetail()
      }
    })
  },
  methods: {
    getDetail() {
      this.loading = true
      getDetailById(this.$route.params.id).then(res => {
        res.data.channelName === '阿里云' && (this.aliSmsChannelId = res.data.channelId)
        this.form = {
          templateName: res.data.templateName || '', // 模板名称
          smsTypeId: Number(res.data.smsTypeId), // 模板类型
          tags: res.data.tagList || [], // 标签
          paramTypeReqs: res.data.paramTypes || [], // 参数
          content: res.data.channelTemplateContent || '', // 模板内容
          sceneLink: res.data.sceneLink || '', // 场景链接
          sceneDescription: res.data.sceneDescription || '', // 场景说明
          channelIds: res.data.channelId ? [res.data.channelId] : [], // 渠道商申请
          standardTemplateId: res.data.standardTemplateId
        }
        // 如果模板类型为营销推广，则需要提取【拒收请回复R|回TD退订字段】
        if (this.form.smsTypeId && this.form.smsTypeId === 3) {
          const arr = res.data.channelTemplateContent.match(/(.*)(拒收请回复R|回TD退订)$/)
          if (arr) {
            this.form.content = arr[1]
            this.reply = arr[2]
          }
        }

        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.clearValidate()
        })
        // this.detail = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增标签触发
    addLabel() {
      if (!this.labelInput) {
        return
      }
      if (this.form.tags.length >= 5) {
        return this.$message.error('最多只能设置5个标签')
      }
      this.$refs.LabelInput && this.$refs.LabelInput.cancel()
      const obj = this.form.tags.find(v => v.name === this.labelInput)
      if (!obj) {
        this.form.tags.push({ name: this.labelInput, id: '' })
        this.labelInput = ''
        this.$refs.form.validateField('labelNameList')
      } else {
        this.labelInput = ''
        this.$refs.form.validateField('labelNameList')
      }
    },
    // 标签选择触发
    labelSelect(val) {
      const obj = this.form.tags.find(v => v.name === val.name)
      if (!obj) {
        this.form.tags.push({ name: val.name, id: val.id })
      }
    },
    // 删除标签
    delLabel(item, index) {
      this.form.tags.splice(index, 1)
    },
    // 点击取消按钮返回列表页面
    goback() {
      this.$router.replace('/system/systemSms/smsTemplate')
    },
    // 插入代码回调
    onhandleInsertCodeFn(val) {
      this.form.content += val.paramCode
      this.$refs.msgContent && this.$refs.msgContent.focus()
      this.InsertCodeDialogConfig.visible = false
    },
    // 点击插入代码按钮
    onClickInsertCode() {
      this.InsertCodeDialogConfig.visible = true
    },
    // 获取渠道商
    getSmsChannelList() {
      const params = {
        pageIndex: 1,
        pageSize: 99999,
        activeFlag: 2
      }
      return getSmsChannelList(params).then(res => {
        this.SmsChannelList = res.data.items
      })
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
    // 模板类型改变触发: 模板置为验证码，要将paramType全部置为'0', 非验证码类型要将paramType为'0'的置为'1'
    smsTypeIdChange() {
      for (const key in this.form.paramTypeReqs) {
        if (this.form.smsTypeId === 1) {
          this.form.paramTypeReqs[key].paramType = 0
        } else {
          this.form.paramTypeReqs[key].paramType === 0 && (this.form.paramTypeReqs[key].paramType = 1)
        }
      }
    },
    // 点击提交按钮提交数据
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const data = {
            ...this.form
          }
          if (data.smsTypeId === 3) {
            data.content += this.reply
          }
          // 编辑的时候不需要渠道商列表
          if (this.type === '2') {
            delete data.channelIds
          }
          const apiFn = this.type === '1' ? addSmsTemplate : updateSmsChannelTemplate
          apiFn(data).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.goback()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.sysTempForm {
  height: 100%;
  display: flex;
  flex-direction: column;
  .sysTempFormView {
    flex: 1 0 0;
    padding: 20px;
    overflow: auto;
    .labelNameList {
      margin-top: 16px;
      background: #FFFFFF;
      border-radius: 6px;
      border: 1px dashed #979797;
      padding: 18px 16px;
    }
    .tips {
      width: 400px;
      position: absolute;
      bottom: 0;
      margin-left: 8px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #999999;
      line-height: 20px;
    }
  }
  .sysTempFormFooter {
    padding-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.w_488 {
  width: 488px;
}
::v-deep {
  .el-form-item__content {
    position: relative;
  }
  .labelInput {
    width: 488px!important;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 32px;
  }
  .el-form-item__label {
    word-wrap: break-word;
  }
}
</style>
