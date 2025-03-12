<template>
  <!-- 批量更换助教 -->
  <AppDialog
    v-if="config.visible"
    v-model="config.visible"
    :footer-text="['保存', '取消']"
    title="批量更换助教"
    width="518px"
    height="auto"
    @success="sure"
  >
    <div class="replaceAssistants overflowOuto">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="67px" size="small">
        <el-form-item label="助教" prop="userId">
          <!-- <el-select v-model="form.name">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
          <el-select
            v-model="form.userId"
            filterable
            remote
            clearable
            style="width:400px"
            reserve-keyword
            placeholder="请输入员工名称"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getUserPage } from '@/api/addressBookApi'
import { batchReplaceAssistant } from '@/api/deliver/studentManagement'
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
          goodsId: '',
          deliveryInfoId: []
        }
      }
    }
  },
  data() {
    return {
      options: [],
      form: {
        userId: '',
        userName: ''
      },
      props: {
        label: 'label',
        value: 'userId'
      },
      rules: {
        userId: [
          { required: true, message: '请选择助教' }
        ]
      },
      loading: false
    }
  },
  watch: {
    'config.visible'(val) {
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      this.form = {
        userId: '',
        userName: ''
      }
    }
  },
  mounted() {
    this.remoteMethod()
  },
  methods: {
    selected(e) {
      this.form.userName = e.nickName
      this.form.userId = e.userId
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('userName')
    },
    remoteMethod(query) {
      this.loading = true
      this.getAssistantPage(query)
    },
    getAssistantPage(nickName) {
      if (!nickName) {
        this.loading = false
        this.options = []
        return
      }
      const data = {
        pageIndex: 1,
        pageSize: 999,
        goodsId: this.config.goodsId,
        nickName: nickName,
        status: 0
      }
      return getUserPage(data).then(res => {
        this.options = res.data.records.map(i => {
          return {
            value: i.userId,
            label: `${i.deptName} - ${i.nickName}（${i.phoneNumber}）`
          }
        })
        this.loading = false
      })
    },
    // 点击确认
    sure() {
      if (!this.form.userId) {
        return this.$message.error('请选择助教')
      }
      this.loading = true
      const data = {
        deliveryInfoIdList: this.config.deliveryInfoId,
        userId: this.form.userId
      }
      batchReplaceAssistant(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.loading = false
        this.$emit('success')
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.replaceAssistants {
  padding-top: 20px;
  min-height: 100px;
  max-height: 200px;
}
</style>
