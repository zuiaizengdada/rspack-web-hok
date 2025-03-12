<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="config.visible"
    title="新增关联广告"
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
            class="select"
            placeholder="请选择"
            clearable
            style="width: 90%"
            @change="platformIdChange"
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
        <el-form-item label="投放账号名称" prop="id">
          <el-select
            v-model="form.id"
            placeholder="请选择"
            clearable
            style="width: 90%"
            filterable
            :disabled="!form.platformId"
            @change="idChange"
          >
            <el-option
              v-for="item in advertiserStaffs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="type > -1"
          :label="type == 0 ? '广告组ID' : '广告计划ID'"
          prop="cId"
          required
        >
          <el-input
            v-model.trim="form.cId"
            :placeholder="type === 0 ? '请输入广告组ID' : '请输入广告计划ID'"
            class="w-120"
            style="width: 90%"
            @input="delNumber"
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  getPlatformDropdown,
  getGroupInterrelated,
  getPlanInterrelated,
  getAdvertiserStaffDropdown
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
          type: 1, // 1新增 2编辑
          row: {},
          visible: false
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      form: { platformId: undefined, id: undefined, cId: undefined },
      launchPlatformOption: [],
      advertiserStaffs: [],
      rules: {
        platformId: [
          { required: true, message: '请选择投放平台', trigger: 'blur' }
        ],
        id: [{ required: true, message: '请选择投放账号名称', trigger: 'blur' }]
      },
      type: -1
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.$refs.form && this.$refs.form.resetFields()
        } else {
          this.form = {
            platformId: undefined,
            id: undefined,
            cId: undefined
          }
          this.type = -1
        }
      },
      deep: true,
      immediate: true
    },
    'form.cId': {
      handler(val) {
        if (val && !/^[A-Za-z0-9]+$/g.test(val)) {
          this.$set(this.form, 'cId', undefined)
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
    // 限制只能输入数字
    delNumber(e) {
      // this.$set(this.form, 'cId', e.replace(/^\d+$/g, ' '))
    },
    idChange(val) {
      const info = this.advertiserStaffs.find(f => f.value === val)
      if (info) {
        this.type = info.discriminate === 2 ? 0 : 1

        this.rules['cId'] = [
          {
            required: true,
            message: this.type === 0 ? '请输入广告组ID' : '请输入广告计划ID',
            trigger: 'change'
          }
        ]
      }
    },
    platformIdChange(val) {
      this.$set(this.form, 'id', undefined)
      if (val) {
        this.getAdvertiserStaffDropdown()
      } else {
        this.advertiserStaffs = []
      }
    },
    async getAdvertiserStaffDropdown() {
      const res = await getAdvertiserStaffDropdown({
        platformId: this.form.platformId
      })
      if (res.code === 1) {
        this.advertiserStaffs = res.data.items
          .filter(f => f.discriminate > 1)
          .map(m => ({
            label: m.advertiserId,
            value: m.id,
            discriminate: m.discriminate
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
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            id: this.form.id,
            campaignId: this.form.cId,
            adPlanId: this.form.cId
          }
          this.loading = true
          const apiFn =
            this.type === 0 ? getGroupInterrelated : getPlanInterrelated
          apiFn(params)
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
