<template>
  <AppDialog
    v-model="visible"
    title="新增"
    width="500px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="addTargetSetting overflowOuto">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="auto" class="demo-ruleForm">
        <el-form-item label="选择月份" prop="monthYear">
          <el-date-picker
            v-model="form.monthYear"
            format="yyyy-MM"
            value-format="yyyyMM"
            size="small"
            type="month"
            placeholder="请选择"
            style="width: 120px"
            filterable
            clearable
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="选择员工" prop="userList">
          <el-button size="small" type="primary" @click="addUser">选择</el-button>
          <div>
            <div :class="{ assessBox: form.userList.length > 0 }">
              <el-tag
                v-for="(tag, index) in form.userList"
                :key="tag.userId"
                class="remindPersonListView"
                :closable="!defaultDisabledUser.includes(tag.userId)"
                @close="delAssistant(tag, index)"
              >{{ tag.nickName }}</el-tag>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="目标值" prop="number">
          <el-input v-model="form.targetValue" size="small" @input="delNumber" />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: true,
      top: '114px',
      form: {
        monthYear: '',
        userList: [],
        targetValue: 200000
      },
      rules: {
        monthYear: [{ required: true, message: '请选择月份', trigger: 'blur' }],
        targetValue: [{ required: true, message: '请输入目标值', trigger: 'blur' }],
        userList: [{ type: 'array', required: true, message: '请至少选择一个员工', trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        }
      },
      defaultDisabledUser: []
    }
  },
  mounted() {
  },
  methods: {
    // 限制只能输入数字
    delNumber(e) {
      this.form.targetValue = e.replace(/[^0-9]/g, '')
      if (this.form.targetValue > 1000000) {
        this.form.targetValue = 1000000
      } else if (this.form.targetValue < 0) {
        this.form.targetValue = 0
      }
    },
    sure() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.success && this.success(this.form)
          this.visible = false
        } else {
          return false
        }
      })
    },
    delAssistant(tag, index) {
      this.form.userList.splice(index, 1)
    },
    // 点击添加用户
    addUser() {
      const disabledUser = []
      this.defaultDisabledUser.forEach((i) => {
        disabledUser.push(i.userId)
      })
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.userList,
        disabledUser,
        maxlength: 50,
        success: (res) => {
          if (res) {
            this.form.userList = res.user
          }
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.addTargetSetting {
    padding: 20px;
    max-height: 500px;
}
.remindPersonListView {
  margin-right: 16px;
  margin-bottom: 16px;
}
.assessBox {
  margin-top: 16px;
  width: 359px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
}
</style>
