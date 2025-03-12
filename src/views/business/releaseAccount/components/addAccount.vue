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
        <el-form-item label="投放平台" prop="platformId">
          <el-select
            v-model="form.platformId"
            placeholder="请选择"
            clearable
            style="width: 100%"
            @change="platformIdChange"
            @clear="platformIdClear"
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

        <el-form-item label="关联AppID" prop="oauthId">
          <el-select
            v-model="form.oauthId"
            placeholder="请选择"
            clearable
            style="width: 100%"
            :disabled="!form.platformId"
          >
            <el-option
              v-for="item in applications"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  getPlatformDropdown,
  getApplicationDropdown,
  getOauthUri
} from '@/api/advertisingKanBan'

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
        platformId: '',
        oauthId: ''
      },
      rules: {
        platformId: [
          { required: true, message: '请选择投放平台', trigger: 'blur' }
        ],
        oauthId: [
          { required: true, message: '请选择关联AppID', trigger: 'blur' }
        ]
      },
      launchPlatformOption: [],
      applications: []
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.$refs.form && this.$refs.form.resetFields()
          if (this.config.type === 1) {
            this.form = {
              platformId: '',
              oauthId: ''
            }
          } else {
            this.form = JSON.parse(JSON.stringify(this.config.row || {}))
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
    platformIdClear() {
      this.applications = []
      this.form.oauthId = ''
    },
    platformIdChange(val) {
      if (val) {
        this.$set(this.form, 'oauthId', '')
        this.getApplicationDropdown()
      } else {
        this.applications = []
        this.form.oauthId = ''
      }
    },
    async getApplicationDropdown() {
      const res = await getApplicationDropdown({
        platformId: this.form.platformId
      })
      if (res.code === 1) {
        this.applications = res.data.map(m => ({
          label: m.applicationName,
          value: m.oauthId
        }))
      }
    },
    async getPlatformDropdown() {
      const res = await getPlatformDropdown()
      if (res.code === 1) {
        this.launchPlatformOption = res.data.items.map(m => ({
          label: m.platformName,
          value: m.platformId
        }))
      }
    },
    // 限制输入英文数字和汉字
    delNoNumber2(e) {
      this.form.expertName = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    // 限制输入英文和数字
    delNoNumber1(e) {
      this.form.expertId = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            oauth_id: this.form.oauthId
          }
          delete params.operateName
          this.loading = true
          getOauthUri(params)
            .then(res => {
              // this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
              this.$emit('success', res.data)
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    // 点击删除通知人员
    delAssessUsers() {
      this.form.operateName = ''
      this.form.operateUid = ''
    },
    // 点击添加人员
    selectUser() {
      const checkUser = []
      if (this.form.operateUid && this.form.operateName) {
        checkUser.push({
          userId: this.form.operateUid,
          nickName: this.form.operateName
        })
      }
      this.$AddressBook({
        visible: true,
        multiple: false,
        checkUser,
        type: [1],
        success: res => {
          if (res.user.length > 0) {
            this.form.operateName = res.user[0].nickName // 运营人员名称
            this.form.operateUid = res.user[0].userId // 运营人员ID
          }
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
