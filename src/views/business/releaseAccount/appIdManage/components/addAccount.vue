<template>
  <!-- 新增账号弹框 -->
  <AppDialog
    v-model="config.visible"
    :title="['新增账号', '编辑账号'][config.type]"
    width="520px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div class="addDialog">
      <el-form
        ref="form"
        class="m-t-16"
        :model="form"
        label-width="auto"
        size="small"
        :rules="rules"
      >
        <el-form-item label="开放平台" prop="platformId">
          <el-select
            v-model="form.platformId"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in launchPlatformOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="AppID名称" prop="applicationName">
          <el-input
            v-model.trim="form.applicationName"
            placeholder="请输入AppID名称"
            class="w-120"
            maxlength="50"
            show-word-limit
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="AppID" prop="applicationId">
          <el-input
            v-model.trim="form.applicationId"
            placeholder="请输入AppID"
            class="w-120"
            maxlength="50"
            show-word-limit
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="密钥" prop="applicationSecret">
          <el-input
            v-model.trim="form.applicationSecret"
            placeholder="请输入密钥"
            class="w-120"
            maxlength="50"
            show-word-limit
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getPlatformDropdown, addApplication } from '@/api/advertisingKanBan'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 0, // 0新增 1编辑
          row: {},
          visible: false
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      form: {
        platformId: undefined,
        applicationName: undefined,
        applicationId: undefined,
        applicationSecret: undefined
      },
      rules: {
        platformId: [
          { required: true, message: '请选择开放平台', trigger: 'change' }
        ],
        applicationName: [
          { required: true, message: '请输入AppID名称', trigger: 'change' }
        ],
        applicationId: [
          { required: true, message: '请输入AppID', trigger: 'change' }
        ],
        applicationSecret: [
          { required: true, message: '请输入密钥', trigger: 'change' }
        ]
      },
      launchPlatformOption: []
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.$refs.form && this.$refs.form.resetFields()
          if (this.config.type === 1) {
            this.form = {
              platformId: undefined,
              applicationName: undefined,
              applicationId: undefined,
              applicationSecret: undefined
            }
          } else {
            this.form = JSON.parse(JSON.stringify(this.config.row))
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getPlatformDropdown()
  },
  methods: {
    async getPlatformDropdown() {
      const res = await getPlatformDropdown()
      if (res.code === 1) {
        this.launchPlatformOption = res.data.items.map(m => ({
          label: m.platformName,
          value: m.platformId
        }))
      }
    },
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.form
          }
          this.loading = true
          addApplication(params)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
              this.$emit('success')
            })
            .catch(() => {
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

<style lang="scss" scoped>
.addDialog {
  height: 240px;
  padding: 20px;
  .tips {
    width: 100%;
    padding: 10px;
    background: #fff2e6;
    border-radius: 8px;
    display: flex;
    .tipsIcon {
      width: 24px;
      color: #ff7d00;
      font-size: 24px;
    }
    .tipsContent {
      flex: 1;
      padding-left: 8px;
      .tipsTitle {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #ff7d00;
        line-height: 24px;
      }
      .tipsMsg {
        margin-top: 8px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ff7d00;
        line-height: 22px;
      }
    }
  }
}
.m-l-32 {
  margin-left: 32px;
}
.assessBox {
  width: 363px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
}
.remindPersonListView {
  cursor: pointer;
}
</style>
