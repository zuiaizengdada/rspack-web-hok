<template>
  <!-- 添加人员 -->
  <AppDialog
    v-model="visible"
    title="添加人员"
    width="400px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="addLottery overflowOuto">
      <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model.trim="form.phone" style="width: 200px" clearable placeholder="请输入" maxlength="11" show-word-limit @input="delNumber" />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="exportScriptFooter">
      <el-button size="small" type="primary" :loading="loading" @click="sure(1)">保存</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="sure(2)">保存并新增下一个</el-button>
      <el-button size="small" :loading="loading" @click="visible = false">取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { playbackWhiteListAdd } from '@/api/liveRoom/index'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: true,
      liveRoomId: '',
      form: {
        phone: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      },
      top: '114px'
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 644) / 2 + 'px'
  },
  methods: {
    // 限制只能输入数字
    delNumber(e) {
      this.form.phone = e.replace(/[^0-9]/g, '')
    },
    sure(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.addUserPhone(type)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存
    addUserPhone(type) {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        studentPhone: this.form.phone
      }
      playbackWhiteListAdd(data).then(res => {
        if (type === 1) {
          this.visible = false
        }
        this.success && this.success()
        this.form.phone = ''
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
    // 保存并新增下一个
  }
}
</script>

<style lang='scss' scoped>
.addLottery {
  max-height: 516px;
  padding: 20px 34px;
}
.exportScriptFooter {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px;
}
</style>
