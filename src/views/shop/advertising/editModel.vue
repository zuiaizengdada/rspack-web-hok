<template>
  <AppDialog
    v-model="config.visible"
    :footer-text="['提交', '取消']"
    title="广告管理"
    width="694px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div class="editModel overflowOuto">
      <el-form ref="form" :model="form" label-width="92px" :inline="true" size="small" :rules="rules">
        <el-form-item label="广告位名称" prop="name">
          <el-input v-model.trim="form.name" style="width: 486px" placeholder="请输入" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="广告类型" prop="type">
          <el-select v-model="form.type" class="w-200" placeholder="请选择" disabled>
            <el-option v-for="(item, key) in adTypeOption" :key="key" :label="item" :value="Number(key)" />
          </el-select>
        </el-form-item>
        <el-form-item label="允许最大广告数量" label-width="133px" style="margin-left: 11px" prop="maxNum">
          <el-input v-model="form.maxNum" style="width: 121px;" placeholder="请输入" @input="(e) => delNoNumber(e, 'maxNum')" />
        </el-form-item>
        <el-form-item label="文件格式" prop="fileFormat">
          <el-select v-model="form.fileFormat" multiple class="w-200" placeholder="请选择（多选）">
            <el-option label="图片" :value="1" />
            <!-- <el-option label="视频" :value="2" /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="单个文件最大" label-width="133px" style="margin-left: 11px" prop="fileSize">
          <el-input v-model="form.fileSize" style="width: 121px;" placeholder="请输入" @input="(e) => delNoNumber(e, 'fileSize')">
            <!-- <i slot="suffix" class="maxTips">KB</i> -->
            <el-button slot="append" style="width: 40px;padding: 0;">KB</el-button>
          </el-input>
        </el-form-item>
        <el-form-item v-if="form.type === 6" label="分类" label-width="92px" prop="bannerType">
          <el-select v-model="form.bannerType" placeholder="请选择" class="w-200" disabled>
            <el-option v-for="(item) in bannerTypeOptions" :key="item.catalogueId" :label="item.catalogueName" :value="item.catalogueId" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注说明" prop="remark">
          <el-input v-model="form.remark" :rows="3" style="width: 486px;" type="textarea" placeholder="请输入内容" maxlength="100" show-word-limit />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { adType } from './columns'
import { getManagerDetail, managerUpdate } from '@/api/shop/advertising'
import { getCatalogueList } from '@/api/shop'
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
          row: {}
        }
      }
    }
  },
  data() {
    var checkFileSize = (rule, value, callback) => {
      if (!value) {
        return callback('请输入大于0的正整数')
      } else if (value >= 20480) {
        return callback('请输入小于20480的数')
      } else {
        callback()
      }
    }
    var checkMaxNum = (rule, value, callback) => {
      if (!value) {
        return callback('请输入大于0的正整数')
      } else if (this.form.type && this.form.type === 3 && value > 1) {
        return callback('开屏广告最多只能为1')
      } else {
        callback()
      }
    }
    return {
      bannerTypeOptions: [],
      adTypeOption: adType,
      form: {
        name: '',
        type: '',
        maxNum: '',
        fileFormat: '',
        fileSize: '',
        remark: ''
      },
      loading: false,
      rules: {
        name: [{ required: true, message: '请输入广告位名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择广告类型', trigger: 'blur' }],
        maxNum: [{ validator: checkMaxNum, required: true, trigger: 'blur' }],
        fileFormat: [{ required: true, message: '请选择文件格式', trigger: 'blur' }],
        fileSize: [{ validator: checkFileSize, required: true, trigger: 'blur' }]
      }
    }
  },
  watch: {
    'config.visible'(val) {
      if (val) {
        this.$refs.form && this.$refs.form.resetFields()
        this.getCatalogueList().then(() => {
          this.getDetail()
        })
      }
    }
  },
  mounted() {},
  methods: {
    // 获取商品分类
    getCatalogueList() {
      this.loading = true
      return getCatalogueList().then(res => {
        this.bannerTypeOptions = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    delNoNumber(e, key) {
      const value = Number(e.replace(/\D/g, ''))
      if (key === 'fileSize') {
        value >= 20480 ? this.form[key] = 20479 : this.form[key] = value
      } else {
        this.form[key] = value
      }
    },
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          managerUpdate(this.form).then(() => {
            this.loading = false
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    getDetail() {
      this.loading = true
      const params = {
        id: this.config.row.id
      }
      getManagerDetail(params).then(res => {
        this.form = {
          name: this.config.row.name,
          ...res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.editModel {
  height: 320px;
  padding: 16px 16px 0;
  box-sizing: border-box;
}
.maxTips {
  font-style:normal;
  font-size: 14px;
  font-family: AppleSystemUIFont;
  color: #333333;
  line-height: 22px;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
