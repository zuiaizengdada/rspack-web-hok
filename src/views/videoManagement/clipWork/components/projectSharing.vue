<template>
  <AppDialog
    v-model="config.visible"
    title="开放权限设置"
    width="518px"
    height="auto"
    top="10vh"
    :loading="config.loading"
    @before-close="$emit('before-close')"
    @success="success()"
  >
    <el-form ref="form" :model="config.form" label-width="80px" class="projectSharingForm overflowOuto">
      <el-form-item>
        <span slot="label" class="projectTitleLabel">工程名称</span>
        <span class="projectTitle">{{ config.form.projectName }}</span>
      </el-form-item>
      <el-form-item label="开放状态">
        <el-radio-group v-model="config.form.isOpen">
          <el-radio :label="0">不开放</el-radio>
          <el-radio :label="1">开放</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="config.form.isOpen === 1" label="开放对象">
        <el-radio-group v-model="config.form.openObject">
          <el-radio :label="1">指定对象</el-radio>
          <el-radio :label="2">所有人</el-radio>
        </el-radio-group>
        <div v-if="config.form.openObject === 1">
          <div :class="{ assessBox: config.form.shareUsers.length > 0 }">
            <el-tag
              v-for="(tag, index) in config.form.shareUsers"
              :key="tag.userId"
              class="remindPersonListView"
              closable
              @close="delAssessUsers(tag, index)"
            >{{ tag.userName }}</el-tag>
            <el-button
              size="mini"
              class="remindPersonListView"
              @click="selectUser"
            ><i class="el-icon-plus el-icon--left" />添加对象</el-button>
          </div>
          <div v-if="config.form.shareUsers.length > 0" class="tips m-t-8">已选{{ config.form.shareUsers.length }}人</div>
        </div>
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { setShareProjectP } from '@/api/videoManagement/clipWork'
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
          loading: false,
          form: {
            name: '', // 工程名称
            isOpen: 0, // 开放状态： 0不开放，1开放
            shareUsers: [] // 指定对象
          }
        }
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    show(obj) {
      console.log('dddsdfdsfdsfds:', obj)
      this.config.visible = true
      this.config.form = obj
      this.config.form.shareUsers = this.config.form.shareUsers ? this.config.form.shareUsers : []
      this.config.form.shareUsers.some(item => {
        item.nickName = item.userName
      })
    },
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.config.form.shareUsers,
        success: (res) => {
          console.log('ssssssssss: ', res)
          this.config.form.shareUsers = res.user
          this.config.form.shareUsers.some(item => {
            item.userName = item.nickName
          })
          const index = this.config.form.shareUsers.findIndex((ele) => {
            return ele.userId === this.$store.getters.userInfo.userId
          })
          if (index >= 0) {
            this.config.form.shareUsers.splice(index, 1)
          }
          console.log('fdsfdsafdsafdsa:', this.$store.getters.userInfo.userId)
          console.log(res.user)
        }
      })
    },
    // 点击删除开放对象
    delAssessUsers(tag, index) {
      this.config.form.shareUsers.splice(index, 1)
    },
    success() {
      console.log('点击确定')
      console.log('config.form: ', this.config.form)
      if (this.config.form.isOpen === 1 && this.config.form.openObject === 1) {
        if (this.config.form.shareUsers.length <= 0) {
          this.$message.error('请选择开放的指定对象！')
          return
        }
      }
      const usersArray = []
      this.config.form.shareUsers.some(item => {
        usersArray.push(item.userId)
      })
      // this.$emit('success', this.config.form)
      const params = {
        isOpen: this.config.form.isOpen,
        openObject: this.config.form.openObject,
        projectId: this.config.form.projectId,
        users: usersArray
      }
      setShareProjectP(params).then(res => {
        if (res.success) {
          if (this.config.form.isOpen === 0) {
            this.$message.success('工程取消共享成功！')
          } else {
            this.$message.success('工程共享成功！')
          }
          this.config.visible = false
          this.$emit('loadDateFn')
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
    .el-form-item {
        margin-bottom: 16px;
    }
}
.projectSharingForm {
    padding: 20px;
    min-height: 284px;
    max-height: 500px;
    .projectTitle {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 22px;
    }
    .projectTitleLabel {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 22px;
        font-weight: normal;
    }
}
.assessBox {
  width: 398px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  .remindPersonListView {
    margin-right: 16px;
    margin-bottom: 16px;
  }
}
.m-t-8 {
  text-align: right;
}
</style>
