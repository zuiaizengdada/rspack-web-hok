<template>
  <!-- 新增/编辑解除锁单飞书提醒设置 -->
  <AppDialog
    v-model="config.visible"
    :title="config.title"
    width="518px"
    height="226px"
    :loading="loading"
    @success="send"
  >
    <div class="unlockUserDialog overflowOuto">
      <!-- 新增/编辑收款渠道 -->
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="79px" size="small">
        <el-form-item label="课程名称" prop="goodsName">
          <span v-if="config.type === 1">
            <CourseSelect
              ref="CourseSelect"
              :disabled-fn="disabledFn"
              style="width: 200px"
              :default-id="form.goodsId"
              :value="form.goodsName"
              @selected="courseSelect"
            />
          </span>
          <span v-else>{{ form.goodsName }}</span>
        </el-form-item>
        <el-form-item label="通知人员" prop="userList">
          <div>
            <div :class="{ assessBox: form.userList.length > 0 }">
              <el-tag
                v-for="(tag, index) in form.userList"
                :key="tag.userId"
                class="userListView"
                closable
                @close="delAssessUsers(tag, index)"
              >{{ tag.nickName }}</el-tag>
              <el-button
                v-if="form.userList.length < 5"
                size="mini"
                class="userListView"
                @click="selectUser"
              ><i class="el-icon-plus el-icon--left" />添加提醒人员</el-button>
            </div>
            <div v-if="form.userList.length > 0" class="tips m-t-8">{{ form.userList.length }}/5</div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import CourseSelect from '@/views/deliver/components/courseSelect.vue'
import { addUnlockFeishuremind } from '@/api/deliver/baseSeeting'
export default {
  components: {
    AppDialog,
    CourseSelect
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          title: '',
          id: '',
          type: 1 // 1:新增 2:编辑
        }
      }
    },
    disabledFn: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        goodsName: '',
        goodsId: '',
        userList: []
      },
      rules: {
        goodsName: [
          { required: true, message: '请选择课程名称', trigger: 'blur' }
        ],
        userList: [
          { type: 'array', required: true, message: '请选择提醒人员', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  watch: {
    'config.visible'(val) {
      if (val) {
        this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
        console.log(this.config)
        if (this.config.type === 2) {
          this.form = {
            goodsName: this.config.row.goodsName,
            goodsId: this.config.row.goodsId,
            userList: this.config.row.userList
          }
        } else {
          this.init()
        }
      } else {
        this.init()
      }
    }
  },
  mounted() {},
  methods: {
    send() {
      console.log('点击确定')
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const sysUsers = this.form.userList.reduce((pre, next) => {
            pre.push(next.userId)
            return pre
          }, [])
          const data = {
            unlockInfo: [
              {
                goodsId: this.form.goodsId,
                goodsName: this.form.goodsName,
                sysUsers
              }
            ]
          }
          addUnlockFeishuremind(data).then(res => {
            this.loading = false
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击添加通知人员
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.userList,
        maxlength: 5,
        success: (res) => {
          this.form.userList = res.user
          this.$refs.ruleForm.validateField('userList')
        }
      })
    },
    // 点击删除通知人员
    delAssessUsers(tag, index) {
      this.form.userList.splice(index, 1)
    },
    courseSelect(val) {
      if (val.length > 0) {
        console.log(val[0])
        this.form.goodsId = val[0].goodsId
        this.form.goodsName = val[0].contentName
        this.$refs.ruleForm.validateField('goodsName')
      }
    },
    // 初始化
    init () {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
      this.form = {
        goodsName: '',
        goodsId: '',
        userList: []
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.unlockUserDialog {
  height: 518px;
  padding: 16px;
  box-sizing: border-box;
  .assessBox {
    box-sizing: border-box;
    padding: 18px 16px 2px;
    height: auto;
    background: #ffffff;
    border-radius: 6px;
    border: 1px dashed #979797;
    .userListView {
      margin-right: 16px;
      margin-bottom: 16px;
    }
  }
}
.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 20px;
  text-align: right;
}
</style>
