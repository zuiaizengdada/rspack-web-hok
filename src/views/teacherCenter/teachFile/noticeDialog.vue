<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="550px"
    height="auto"
    @success="submit"
  >
    <div v-loading="loading" class="remindDialog">
      <div class=" formView">
        <span class="m-r-8 formlabel">通知对象</span>
        <div>
          <div :class="{ assessBox: form.users.length > 0 }">
            <el-tag
              v-for="(tag, index) in form.users"
              :key="tag.userId"
              class="remindPersonListView"
              closable
              @close="delAssessUsers(tag, index)"
            >{{ tag.nickName }}</el-tag>
            <el-button
              v-if="form.users.length < 10"
              size="mini"
              class="remindPersonListView"
              @click="selectUser"
            ><i class="el-icon-plus el-icon--left" />添加通知对象</el-button>
          </div>
          <div v-if="form.users.length > 0" class="tips m-t-8">已选{{ form.users.length }}人</div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getFollowUsers, getFollowUpdate } from '@/api/tearchCenter'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      form: {
        users: []
      },
      visible: false,
      title: '通知跟进设置'
    }
  },
  methods: {
    async open() {
      try {
        this.visible = true
        this.loading = true
        const res = await getFollowUsers()
        const users = res?.data?.map(i => {
          return {
            userId: i.sysUserId,
            userName: i.userName,
            nickName: i.userName
          }
        }) ?? []
        this.form = {
          users
        }
        this.loading = false
      } catch (e) {
        console.log(e)
        this.form = {
          users: []
        }
        this.loading = false
      }
    },
    // 点击删除通知人员
    delAssessUsers(tag, index) {
      this.form.users.splice(index, 1)
    },
    // 点击添加通知人员
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.users,
        maxlength: 10,
        success: (res) => {
          this.form.users = res.user.map(i => {
            return {
              userId: i.userId,
              userName: i.nickName,
              nickName: i.nickName
            }
          }) ?? []
        }
      })
    },
    // 点击确定
    async submit() {
      this.loading = true
      try {
        const users = this.form.users.map(i => i.userId)
        await getFollowUpdate(users)
        this.visible = false
        this.loading = false
        this.$notify.success({ title: '提示', message: '操作成功' })
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.remindDialog {
  padding: 20px 34px;
  box-sizing: border-box;
  color: #333;
}
.m-t-32 {
  margin-top: 32px;
}
.formView {
  display: flex;
  // align-items: center;
  .formlabel {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
  }
}
.assessBox {
  width: 400px;
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
.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #999999;
  line-height: 20px;
}
</style>
