<template>
  <AppDialog v-model="visible" width="480px" :loading="loading" height="auto">
    <div class="m-l-20 m-t-20 m-b-20">
      <el-radio v-model="shareAll" :label="true">共享给所有人</el-radio>
    </div>
    <div class="m-l-20">
      <el-radio v-model="shareAll" :label="false">指定共享</el-radio> <el-button
        size="mini"
        type="primary"
        plain
        @click="selectUser"
      >选择部门/人员</el-button>
    </div>
    <template v-if="!shareAll && shareUserList.length">
      <div class="share-user">
        <el-tag
          v-for="(tag, index) in shareUserList"
          :key="tag.userId"
          class="user-tag"
          closable
          @close="delUsers(tag, index)"
        >{{ tag.userName }}</el-tag>
      </div>
      <div class="m-l-20">已选{{ shareUserList.length }} 人</div>
    </template>
    <div slot="footer" class="footer">
      <div>
        <el-button v-if="!shareAll && shareUserList.length" size="small" type="danger" plain @click="dleAll">删除已选</el-button>
      </div>
      <div>
        <el-button size="small" :loading="loading" type="primary" @click="sure">确定</el-button>
        <el-button size="small" :loading="loading" @click="visible = false">取消</el-button>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import { getDesensitizedVideoShareSpecificUser } from '@/api/product/videoManager'
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  props: {
    teacherId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      shareAll: true,
      loading: false,
      visible: false,
      shareUserList: []
    }
  },
  computed: {
    userId() {
      return this.$store.getters.userInfo.userId
    },
    userName() {
      return this.$store.getters.userInfo.userName
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          if (this.teacherId) {
            this.shareAll = false
            this.getShareUser()
          } else {
            this.shareAll = true
            this.shareUserList = [
              { userId: this.userId, userName: this.userName, nickName: this.userName }]
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    async getShareUser() {
      const { data } = await getDesensitizedVideoShareSpecificUser({ teacherId: this.teacherId })
      if (data && data.length) {
        this.shareUserList = data.map(i => ({ ...i, nickName: i.userName }))
      } else {
        this.shareUserList = [
          { userId: this.userId, userName: this.userName, nickName: this.userName }]
      }
    },
    dialogOperation(type, info) {
      if (type === 'open') {
        this.visible = true
      } else {
        this.visible = false
      }
    },
    dleAll() {
      this.shareUserList = []
    },
    delUsers(tag, index) {
      this.shareUserList.splice(index, 1)
    },
    selectUser() {
      this.$AddressBookUser({
        visible: true,
        multiple: true,
        type: [0, 1],
        checkUser: this.shareUserList,
        disabledUser: this.shareUserList,
        maxlength: 100,
        success: (res) => {
          res.user.map((v) => {
            v.userName = v.nickName
          })
          this.shareUserList = res.user
          console.log(this.shareUserList)
          this.shareAll = false
        }
      })
    },
    async sure() {
      if (!this.shareAll && !this.shareUserList.length) {
        this.$message.error('请选择指定共享部门/人员')
        return
      }
      this.loading = true
      try {
        this.$emit('success', { shareAll: this.shareAll, shareUserList: this.shareUserList.map(i => i.userId) })
        this.dialogOperation('close')
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.share-user {
    width: 438px;
    max-height: 300px;
    border-radius: 6px;
    overflow-y: auto;
    margin: 12px auto;
    border: 1px solid #D9D9D9;
    padding: 12px;
    .user-tag{
      margin-right: 16px;
      margin-bottom: 16px;
    }
}
.footer{
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
