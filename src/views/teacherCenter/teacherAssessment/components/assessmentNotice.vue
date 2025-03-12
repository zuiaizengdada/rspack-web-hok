<template>
  <el-dialog
    title="评估结果通知"
    :visible.sync="visible"
    class="dialog-container"
    width="650px"
  >
    <div class="dialog-tips">注：当老师到了评估截止时间,将通过飞书方式进行通知</div>
    <el-form :inline="true" :model="form" size="small">
      <el-form-item label="通知对象">
        <div :class="{ 'assess-box': form.assessUsers.length > 0 }">
          <el-tag
            v-for="(tag, index) in form.assessUsers"
            :key="tag.userId"
            class="assess-users-view"
            closable
            @close="delAssessUsers(tag, index)"
          >{{ tag.userName }}</el-tag>
          <el-button
            size="mini"
            class="assess-users-view"
            @click="selectUser"
          ><i class="el-icon-plus el-icon--left" />添加通知人员</el-button>
        </div>
        <div v-if="form.assessUsers.length > 0" class="tips m-t-8">已选{{ form.assessUsers.length }}人</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { teacherGetSendUser, teacherSetSendUser } from '@/api/tearchCenter/index'
export default {
  data() {
    return {
      visible: false,
      form: {
        assessUsers: []
      }
    }
  },
  methods: {
    async open() {
      const { data } = await teacherGetSendUser()
      this.form.assessUsers = data.map(i => {
        return {
          userId: i.sysUserId,
          nickName: i.userName,
          userName: i.userName
        }
      }) ?? []
      this.visible = true
    },
    async handleSave() {
      const assessUserIds = this.form.assessUsers.map(i => i.userId)
      await teacherSetSendUser(assessUserIds)
      this.$notify.success('保存成功')
      this.visible = false
    },
    // 点击添加评估人员
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.assessUsers,
        maxlength: 20,
        success: (res) => {
          this.form.assessUsers = res.user.map((v) => {
            return {
              nickName: v.nickName,
              userName: v.nickName,
              userId: v.userId
            }
          })
        }
      })
    },
    // 点击删除评估人员
    delAssessUsers(tag, index) {
      this.form.assessUsers.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.assess-box {
    width: 503px;
    box-sizing: border-box;
    padding: 18px 16px 2px;
    height: auto;
    background: #ffffff;
    border-radius: 6px;
    border: 1px dashed #979797;
    .assess-users-view {
      margin-right: 16px;
      margin-bottom: 16px;
    }
  }
  .dialog-container::v-deep{
  .el-dialog__title{
      font-weight: bold;
  }
  .el-dialog__header{
      border-bottom: 1px solid #E7E7E7;
  }
  .el-dialog__body{
      padding: 20px 20px;
  }
  .dialog-tips{
      border-radius: 4px;
      background: #FEECEC;
      padding: 5px 16px;
      line-height: 22px;
      color: #F53F3F;
      font-size: 14px;
      margin-bottom: 20px;
      width: 570px;
  }
}
</style>
