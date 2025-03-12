<template>
  <AppDialog
    v-model="config.visible"
    title="新增白名单"
    width="568px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div class="addDialog overflowOuto">
      <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules">
        <el-form-item label="选择人员" prop="tutorTeacherUser">
          <el-button type="primary" icon="el-icon-plus" @click="addAssistant">添加员工</el-button>
          <span class="m-l-10 tips">注：白名单最多可添加20人</span>
          <div>
            <div :class="{ assessBox: form.tutorTeacherUser.length > 0 }">
              <el-tag
                v-for="(tag, index) in form.tutorTeacherUser"
                :key="tag.userId"
                class="remindPersonListView"
                closable
                @close="delAssistant(tag, index)"
              >{{ tag.nickName }}</el-tag>
            </div>
          </div>
          <div v-if="form.tutorTeacherUser.length > 0" class="tips m-t-10">已选{{ form.tutorTeacherUser.length }}人</div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { editWhiteList } from '@/api/liveRoom/setting.js'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false
        }
      }
    }
  },
  data() {
    return {
      form: {
        tutorTeacherUser: []
      },
      rules: {
        tutorTeacherUser: [
          { required: true, type: 'array', message: '请选择人员', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.form = {
            tutorTeacherUser: []
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    sure() {
      if (this.form.tutorTeacherUser.length === 0) {
        return this.$message.error('请选择人员')
      }
      this.loading = true
      const sysUserIds = this.form.tutorTeacherUser.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const data = {
        sysUserIds,
        whiteList: true
      }
      editWhiteList(data).then(res => {
        this.loading = false
        this.$emit('success')
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击添加人员
    addAssistant() {
      const disabledUser = []
      this.form.tutorTeacherUser.forEach((i) => {
        disabledUser.push(i.userId)
      })
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.tutorTeacherUser,
        disabledUser,
        maxlength: 20,
        success: (res) => {
          this.form.tutorTeacherUser = res.user
        }
      })
    },
    delAssistant(tag, index) {
      console.log(index)
      this.form.tutorTeacherUser.splice(index, 1)
    }
  }
}
</script>
<style lang='scss' scoped>
::v-deep {
  .el-form-item__label {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}
.addDialog {
  height: 300px;
  padding: 20px;
}
.assessBox {
  margin-top: 16px;
  width: 450px;
  box-sizing: border-box;
  padding: 18px 0 0 16px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  .remindPersonListView {
    margin-right: 16px;
    margin-bottom: 18px;
  }
}
.tips {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
}
</style>
