<template>
  <!-- 讲师列表 -->
  <div>
    <el-button
      type="primary"
      style="margin-bottom: 10px"
      :disabled="form.status === 9"
      @click="handleClickAdd"
    >添加讲师</el-button>
    <ul v-if="realityTeacherUser.length > 0" class="lecturerTable-list">
      <li
        v-for="item in realityTeacherUser"
        :key="item.userId"
        class="flex justify-between"
      >
        <div class="flex items-center">
          <span style="margin-right: 6px">{{ item.nickName }}</span>
          <el-tag
            v-show="item.isCheckedHost"
            effect="dark"
            size="mini"
          >主持人</el-tag>
        </div>
        <div>
          <el-button
            v-if="form.status !== 9 && !item.isCheckedHost"
            type="text"
            style="font-size: 14px"
            size="mini"
            :disabled="item.isCheckedHost"
            @click="operateHostTeacher(item)"
          >设为主持人</el-button>
          <el-button
            v-if="form.status === 0 && !item.isCheckedHost"
            size="mini"
            type="text"
            style="color: #ff2c35; font-size: 14px"
            @click="onhandleDelete(item)"
          >删除</el-button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      realityTeacherUser: [],
      userIds: [],
      emceeUserId: ''
    }
  },
  methods: {
    handleClickAdd() {
      const tutorTeacherUserIds =
        this.form.tutorTeacherUser?.map(item => item.userId) || []
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.realityTeacherUser,
        disabledUser: tutorTeacherUserIds,
        maxlength: 10,
        success: res => {
          this.realityTeacherUser = res.user
          this.realityTeacherUser[0].isCheckedHost = true
          // res.user.forEach(item => {
          //   this.userIds.push(item.userId)
          // })
          this.userIds = res.user.map(item => item.userId)
          this.emceeUserId = this.realityTeacherUser[0].userId
          this.$emit('select', {
            emceeUserId: this.emceeUserId,
            realityTeacherUserIds: this.userIds
          })
        }
      })
    },
    // 设置主持人
    operateHostTeacher(row) {
      const list = JSON.parse(JSON.stringify(this.realityTeacherUser))
      list.forEach((item, index) => {
        item.isCheckedHost = false
        if (row.userName === item.userName) {
          item.isCheckedHost = true
          this.emceeUserId = item.userId
        }
      })
      this.$emit('select', {
        emceeUserId: this.emceeUserId,
        realityTeacherUserIds: this.userIds
      })
      this.realityTeacherUser = list
    },
    // 删除
    onhandleDelete(row) {
      const index = this.realityTeacherUser.findIndex(
        item => item.userId === row.userId
      )
      this.realityTeacherUser.splice(index, 1)
      this.userIds = this.realityTeacherUser.map(item => item.userId)
      this.$emit('select', {
        emceeUserId: this.emceeUserId,
        realityTeacherUserIds: this.userIds
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.lecturerTable-list {
  border-radius: 6px;
  border: 1px solid #eee;
  width: 600px;

  li {
    border-bottom: 1px solid #eee;
    padding: 4px 12px;
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
