<template>
  <AppDialog
    v-model="config.visible"
    :title="{0: '新增渠道', 1: '编辑渠道'}[config.type]"
    width="518px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div class="addDialog overflowOuto">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-position="right" label-width="98px">
        <el-form-item label="渠道商名称" prop="name">
          <el-select v-model="form.name" placeholder="请选择" :disabled="config.type === 1">
            <el-option v-for="(item) in ChannelOption" :key="item.dictCode" :value="item.dictLabel" :label="item.dictLabel" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="activeFlag">
          <el-select v-model="form.activeFlag" placeholder="请选择">
            <el-option v-for="(item, key) in statusOption" :key="key" :label="item" :value="Number(key)" />
          </el-select>
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="form.weight" style="width: 116px" maxlength="8" @input="delNoNumber">
            <el-button slot="append">%</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="用途" prop="smsTypeIdList">
          <el-checkbox-group v-model="form.smsTypeIdList">
            <el-checkbox v-for="(item) in smsTypeOption" :key="item.value" :label="item.value" :disabled="disabledFn(item)">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { statusOption, smsTypeOption } from './columns.js'
import { getDict } from '@/utils/index'
import { editSmsChannelList, addSmsChannel } from '@/api/system/sms.js'
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
          type: 0,
          row: {}
        }
      }
    }
  },
  data() {
    return {
      smsTypeOption,
      statusOption,
      form: { name: '', weight: '', status: 2, smsTypeVos: [] },
      loading: false,
      rules: {
        name: [
          { required: true, message: '请选择渠道商名称', trigger: 'change' }
        ],
        activeFlag: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        weight: [
          { required: true, message: '请输入权重', trigger: 'blur' }
        ],
        smsTypeIdList: [
          { type: 'array', required: true, message: '请选择用途', trigger: 'change' }
        ]
      },
      ChannelOption: []
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.init()
          if (this.config.type === 1) {
            let smsTypeIdList = []
            if (this.config.row.smsTypeVos) {
              smsTypeIdList = this.config.row.smsTypeVos.reduce((pre, next) => {
                pre.push(next.id)
                return pre
              }, [])
            }
            // 编辑
            this.form = {
              name: this.config.row.name || '',
              weight: this.config.row.weight || '',
              activeFlag: this.config.row.activeFlag || '',
              smsTypeIdList: smsTypeIdList,
              id: this.config.row.id
            }
            delete this.form.smsTypeVos
          } else {
            // 新增
            this.form = { name: '', weight: '', activeFlag: 2, smsTypeIdList: [] }
          }
          this.$nextTick(() => {
            this.$refs.form && this.$refs.form.clearValidate()
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    delNoNumber(e, key) {
      let num = Number(e.replace(/\D/g, ''))
      if (num === 0) {
        num = 1
      } else if (num > 99999999) {
        num = 99999999
      }
      this.form.weight = num
    },
    // 获取数据
    init() {
      getDict('sys_sms_channel').then(res => {
        this.ChannelOption = res
      })
    },
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            ...this.form
          }
          const apiFn = this.config.type === 1 ? editSmsChannelList : addSmsChannel
          this.loading = true
          apiFn(data).then(() => {
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.loading = false
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 禁止用途
    disabledFn(item) {
      console.log(item)
      if (!this.form.name) {
        return true
      }
      if (this.form.name === '客窗科技' && item.value !== 3) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang='scss' scoped>
.addDialog {
    padding: 16px;
    height: 250px;
}
</style>
