<template>
  <div v-loading="loading" class="groupDrawer">
    <el-form
      ref="Form"
      class="form"
      size="mini"
      :model="form"
      label-width="110px"
      :rules="rules"
    >
      <h2>基本信息</h2>
      <el-form-item label="入驻类型" prop="type">
        <el-radio-group v-model="form.type" @change="handleChangeType">
          <el-radio :label="1">企业</el-radio>
          <!-- <el-radio :label="2">个人</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="info.status === 1"
        :label="form.type === 1 ? '机构全称' : '团队全称'"
        prop="companyName"
      >
        <el-input
          v-model.number="form.companyName"
          maxlength="50"
          :show-word-limit="true"
        />
      </el-form-item>
      <el-form-item
        v-else-if="info.status === 2"
        :label="form.type === 1 ? '机构全称' : '团队全称'"
        prop="name"
      >
        <el-input
          v-model.number="form.name"
          maxlength="50"
          :show-word-limit="true"
        />
      </el-form-item>
      <el-form-item
        :label="form.type === 1 ? '机构简称' : '团队简称'"
        prop="companyAbbreviation"
      >
        <el-input
          v-model.number="form.companyAbbreviation"
          maxlength="20"
          :show-word-limit="true"
        />
      </el-form-item>
      <el-form-item label="入驻模块" prop="packageId" required>
        <el-checkbox-group v-model="packageId" @change="handleChangePackage">
          <el-checkbox
            v-for="item in packageList"
            :key="item.id"
            :label="item.id"
          >{{ item.packageName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <template v-if="info.status === 0">
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model.number="form.name"
            maxlength="50"
            :show-word-limit="true"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model.number="form.phone"
            maxlength="11"
            :show-word-limit="true"
          />
        </el-form-item>
      </template>
      <div class="flex">
        <el-form-item label="LOGO" class="upload-item" prop="bigLogo">
          <div>
            <Upload
              ref="BigUpload"
              width="160"
              height="120"
              accept=".jpg,.jpeg,.png"
              :before-upload="beforeUpload"
              :max-length="1"
              @onClick="onClick"
              @change="fileChange"
            />
            <div class="tips">尺寸320*60</div>
          </div>
          <div class="tips">支持格式jpg/png/jpeg格式图片大小不超过5M。</div>
        </el-form-item>
        <el-form-item label-width="0" class="upload-item" prop="smallLogo">
          <div>
            <Upload
              ref="SmallUpload"
              width="160"
              height="120"
              accept=".jpg,.jpeg,.png"
              :before-upload="beforeUpload"
              :max-length="1"
              @onClick="onClick1"
              @change="fileChange1"
            />
            <div class="tips">尺寸100*100</div>
          </div>
        </el-form-item>
      </div>
      <el-form-item
        v-if="form.type === 1"
        label="营业执照"
        class="upload-item"
        prop="businessLicense"
      >
        <Upload
          ref="BusinessUpload"
          width="160"
          height="120"
          accept=".jpg,.jpeg,.png"
          :before-upload="beforeUpload"
          :max-length="1"
          @onClick="onClick2"
          @change="fileChange2"
        />
        <div class="tips">支持格式jpg、png、jpeg。大小不超过5M。</div>
      </el-form-item>
      <el-form-item
        v-if="form.type === 1"
        label="企业代码"
        prop="enterpriseCode"
      >
        <el-input v-model.number="form.enterpriseCode" />
      </el-form-item>
      <template v-if="info.status === 1">
        <h2>入驻需求</h2>
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
      </template>
    </el-form>
    <div class="drawer__footer">
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
      <el-button size="small" @click="$emit('close')">取 消</el-button>
    </div>
  </div>
</template>
<script>
import {
  beforeUpdateOrganization,
  updateOrganization,
  listPackages
} from '@/api/organization/settings.js'
import Upload from '@/components/AppUploadView/upload'
import { getLiveOssCConfig } from '@/api/liveRoom/index'
import { getFileType } from '@/utils/index'
import { rules } from './columns'
export default {
  components: {
    Upload
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: '1' // 1 申请 2 已入驻
    }
  },
  data() {
    return {
      loading: false,
      packageId: [],
      form: {
        checkList: [],
        administratorName: '',
        administratorPhone: '',
        bigLogo: '',
        businessLicense: '',
        companyAbbreviation: '',
        companyEnglishAbbreviation: '',
        companyName: '',
        enterpriseCode: '',
        name: '',
        packageId: '',
        phone: '',
        smallLogo: '',
        type: ''
      },
      getLiveOssCConfig,
      rules: rules(),
      packageList: []
    }
  },
  computed: {
    id() {
      return this.type === '1' ? this.info.id : this.info.organizationId
    }
  },
  watch: {
    info: {
      handler(val) {
        this.loading = true
        Object.assign(this.form, val)
        this.$nextTick(() => {
          if (this.info.packageId) {
            this.packageId = this.info.packageId.split(',').map(i => Number(i))
          }
          if (this.$refs.BusinessUpload && val.businessLicense) {
            this.$refs.BusinessUpload.setFileList([
              {
                status: 3,
                url: val.businessLicense
              }
            ])
          }
          if (this.$refs.SmallUpload && val.smallLogo) {
            this.$refs.SmallUpload.setFileList([
              {
                status: 3,
                url: val.smallLogo
              }
            ])
          }
          if (this.$refs.BigUpload && val.bigLogo) {
            this.$refs.BigUpload.setFileList([
              {
                status: 3,
                url: val.bigLogo
              }
            ])
          }
          this.loading = false
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getPackages()
  },
  methods: {
    async getPackages() {
      const res = await listPackages({ isPlatform: false })
      this.packageList = res.data
    },
    beforeUpload(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(
        type
      )
      const isLt20M = file.size / 1024 / 1024 < 5
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isIMAGE && isLt20M
    },
    fileChange(res) {
      if (res.length > 0) {
        this.form.bigLogo = res[0].url
        this.$refs.BigUpload && this.$refs.Form.validateField('bigLogo')
      }
    },
    fileChange1(res) {
      if (res.length > 0) {
        this.form.smallLogo = res[0].url
        this.$refs.SmallUpload && this.$refs.Form.validateField('smallLogo')
      }
    },
    fileChange2(res) {
      if (res.length > 0) {
        this.form.businessLicense = res[0].url
        this.$refs.BusinessUpload &&
          this.$refs.Form.validateField('businessLicense')
      }
    },
    onClick() {
      this.$refs.BigUpload && this.$refs.BigUpload.setFileList([])
      this.form.bigLogo = ''
    },
    onClick1() {
      this.$refs.SmallUpload && this.$refs.SmallUpload.setFileList([])
      this.form.smallLogo = ''
    },
    onClick2() {
      this.$refs.BusinessUpload && this.$refs.BusinessUpload.setFileList([])
      this.form.businessLicense = ''
    },
    handleChangePackage(val) {
      this.form.packageId = val.join()
    },
    handleChangeType() {
      this.form.enterpriseCode = ''
      this.onClick()
      this.onClick1()
      this.onClick2()
    },
    submit() {
      this.$refs.Form.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const Pro =
              this.type === '1' ? beforeUpdateOrganization : updateOrganization
            await Pro({
              ...this.form,
              id: this.type === '1' ? this.id : undefined,
              organizationId: this.type === '2' ? this.id : undefined,
              status: undefined
            })
            this.loading = false
            this.$emit('success')
          } catch (err) {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;

  h2 {
    line-height: 30px;
    font-weight: 700;
  }

  .form {
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;

    .upload-item {
      ::v-deep .el-form-item__content {
        margin-bottom: 20px;
      }
    }

    ::v-deep .el-form-item__label {
      font-weight: normal;
    }
  }

  .drawer__footer {
    text-align: right;
    padding-right: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .tips {
    color: #606266;
    font-size: 12px;
  }
}
</style>
