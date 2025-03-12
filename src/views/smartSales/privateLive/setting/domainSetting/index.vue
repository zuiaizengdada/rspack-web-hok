<template>
  <div class="domainSetting">
    <div class="domainSettingTitle">主域名设置</div>

    <div class="m-t-10 domainSettingContent">
      <div class="m-r-10">当前链接主域名：{{ form.domainUrl }}</div>
      <div>
        <el-button size="small" type="primary" :loading="loading" @click="onhandleClickChange">更新域名</el-button>
      </div>
    </div>

    <div class="domainSettingTitle m-t-20">二级域名设置</div>
    <div class="domainSettingTitle-tip m-t-20">
      <i class="el-icon-warning-outline fs-16" />
      注：二级域名可以设置最多20个，且必须有两个，名称不能重复。
    </div>

    <el-form ref="dynamicValidateForm" :model="form" label-width="0" size="small">
      <el-form-item
        v-for="(subdomains, index) in form.subdomains"
        :key="index"
        :prop="'subdomains.' + index + '.value'"
        :rules="{required: true, validator: (rule, value, callback) => validateSubdomains(rule, value, callback, index), trigger: 'blur'}"
      >
        <el-input v-model="subdomains.value" class="w-300 m-r-20" size="small" :disabled="!ifEdit">
          <template slot="prepend">https://</template>
          <template slot="append">.{{ form.domainUrl }}</template>
        </el-input>
        <el-input v-model="subdomains.shortLinkDomain" placeholder="请输入短链域名" class="w-200 m-r-10" :disabled="!ifEdit" clearable />
        <el-button v-if="ifEdit && form.subdomains.length < 20" type="primary" icon="el-icon-plus" circle size="small" @click="addSubdomains" />
        <el-button v-if="ifEdit && form.subdomains.length > 2" type="danger" icon="el-icon-delete" circle size="small" @click="delSubdomains(index)" />
      </el-form-item>
    </el-form>

    <div class="m-t-20">
      <el-button v-if="!ifEdit" :loading="loading" size="small" type="primary" @click="onhandleEdit">编辑</el-button>
      <el-button v-if="ifEdit" :loading="loading" size="small" type="primary" @click="onhandleSave">保存</el-button>
      <el-button v-if="ifEdit" :loading="loading" size="small" @click="onhandleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getLiveRoomOrgConfig, saveTwoDomainConfig } from '@/api/liveRoom/setting.js'
import Dialog from '@/views/live/Dialog/index.js'
export default {
  components: {},
  data() {
    return {
      loading: false,
      ifEdit: false,
      form: {
        domainUrl: '',
        domainUrlId: '',
        subdomains: [{ value: '', id: '', level: 2, shortLinkDomain: '' }]
      },
      // 数据源
      defaultForm: {
        domainUrl: '',
        domainUrlId: '',
        subdomains: [{ value: '', id: '', level: 2, shortLinkDomain: '' }]
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    validateSubdomains(rule, value, callback, index) {
      if (value === '') {
        return callback(new Error('二级域名不能为空'))
      }
      const i = this.form.subdomains.findIndex(v => v.value === value)
      console.log(i, 'index')
      if (i !== -1 && i !== index) {
        return callback(new Error('二级域名不能重复'))
      } else {
        return callback()
      }
    },
    getDetail() {
      this.loading = true
      getLiveRoomOrgConfig().then(res => {
        this.form = {
          domainUrl: '',
          domainUrlId: '',
          subdomains: []
        }
        res.data.map(v => {
          if (v.level === 1) {
            this.form.domainUrl = v.domainUrl
            this.form.domainUrlId = v.id || ''
          }
          v.level === 2 && (this.form.subdomains.push({ value: v.domainUrl, id: v.id, level: v.level, shortLinkDomain: v.shortLinkDomain }))
        })
        if (this.form.subdomains.length === 0) {
          this.form.subdomains.push({ value: '', id: '', level: '', shortLinkDomain: '' })
        }
        this.defaultForm = JSON.parse(JSON.stringify(this.form))
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addSubdomains() {
      this.form.subdomains.push({ value: '', id: '', level: 2, shortLinkDomain: '' })
    },
    delSubdomains(index) {
      this.form.subdomains.splice(index, 1)
    },
    // 点击编辑按钮
    onhandleEdit() {
      this.ifEdit = true
    },
    // 点击取消按钮
    onhandleCancel() {
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.ifEdit = false
    },
    // 点击保存按钮
    onhandleSave() {
      this.$refs.dynamicValidateForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const data = []
          this.form.subdomains.map(v => {
            data.push({
              id: v.id,
              domainUrl: v.value,
              level: 2,
              shortLinkDomain: v.shortLinkDomain
            })
          })
          saveTwoDomainConfig(data).then(res => {
            this.getDetail()
            this.ifEdit = false
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 点击更新主域名
    onhandleClickChange() {
      Dialog.open({
        visible: true,
        type: 'ChangeDomain',
        value: this.form.domainUrl,
        id: this.form.domainUrlId,
        success: () => {
          Dialog.close()
          this.getDetail()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.domainSetting {
  padding: 20px 40px;
  .domainSettingTitle {
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }
  .domainSettingContent {
    color: rgb(96, 98, 102);
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  .domainSettingTitle-tip {
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
}
</style>
