<template>
  <el-dialog title="生成链接" :visible.sync="visible" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="mini">
      <el-form-item
        label="链接域名"
        prop="domainId"
        :label-width="formLabelWidth"
      >
        <el-select
          v-model="form.domainId"
          placeholder="请选择链接域名"
          style="width: 100%"
        >
          <el-option
            v-for="item in DomainList"
            :key="item.id"
            :label="item.url"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="关联落地页"
        prop="landingPageId"
        :label-width="formLabelWidth"
      >
        <el-select
          v-model="form.landingPageId"
          placeholder="请选择关联落地页"
          style="width: 100%"
        >
          <el-option
            v-for="item in LandingPageList"
            :key="item.landingPageId"
            :label="item.pageName"
            :value="item.landingPageId"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="link" label="可用地址" :label-width="formLabelWidth">
        {{ link }}
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSure">生成链接</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createLandingPageLink,
  getDomainList,
  getLandingPageList
} from '@/api/privateArea/toolbox'
export default {
  name: 'CreateUrlDialog',
  props: {
    landingPageId: {
      type: [Number, String],
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    form: {
      url: '',
      path: ''
    },
    formLabelWidth: '100px',
    rules: {
      domainId: [
        { required: true, message: '请选择链接域名', trigger: 'blur' }
      ],
      landingPageId: [
        { required: true, message: '请选择关联落地页', trigger: 'blur' }
      ]
    },
    link: '',
    DomainList: [],
    LandingPageList: []
  }),
  watch: {
    visible: {
      handler(val) {
        this.$refs.form && this.$refs.form.clearValidate()
        val && this.init()
      },
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const data = {
            domainId: this.form.domainId,
            landingPageId: this.form.landingPageId
          }
          createLandingPageLink(data)
            .then(res => {
              this.link = res.data
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    init() {
      this.link = ''
      this.form = {
        domainId: '',
        landingPageId: this.landingPageId
      }
      this.getList()
    },
    getList() {
      getDomainList().then(res => {
        this.DomainList = res.data
      })
      getLandingPageList().then(res => {
        this.LandingPageList = res.data
      })
    }
  }
}
</script>
