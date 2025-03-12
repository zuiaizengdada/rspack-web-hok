<template>
  <!-- 讲师列表 -->
  <div>
    <el-button
      type="primary"

      :disabled="status === 9"
      @click="handleClickAdd"
    >添加讲师</el-button>
    <ul v-if="realityTeacherUser.length > 0" class="lecturerTable-list">
      <li
        v-for="(item,index) in realityTeacherUser"
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
            type="text"
            style="font-size: 14px"
            size="mini"
            :disabled="item.isCheckedHost"
            @click="operateHostTeacher(item)"
          >设为主持人</el-button>
          <el-button
            :disabled="item.isCheckedHost"
            size="mini"
            type="text"
            style=" font-size: 14px"
            @click="onhandleDelete(index)"
          >删除</el-button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      realityTeacherUser: [],
      emceeUserId: ''
    }
  },
  inject: ['baseInfoForm'],
  methods: {
    handleClickAdd() {
      const tutorTeacherUserIds = this.baseInfoForm.tutorTeacherUserIds
      const liveModel = this.baseInfoForm
      console.log(tutorTeacherUserIds, liveModel, 'tutorTeacherUserIds')
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.realityTeacherUser,
        disabledUser: tutorTeacherUserIds,
        maxlength: 10,
        success: res => {
          console.log(res, 'res')
          this.realityTeacherUser = res.user
          const isHasCheck = this.realityTeacherUser.filter(item => item.isCheckedHost === true)
          if (isHasCheck) {
            this.realityTeacherUser[0].isCheckedHost = true
            this.emceeUserId = this.realityTeacherUser[0].userId
          }

          this.userIds = res.user.map(item => item.userId)

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
    onhandleDelete(index) {
      const userIds = []
      this.realityTeacherUser.splice(index, 1)
      console.log('点击删除', this.realityTeacherUser)
      this.realityTeacherUser.forEach(item => {
        console.log(item, 11111111)
        userIds.push(item.userId)
      })
      console.log(userIds, 22222222)
      this.$emit('select', {
        emceeUserId: this.emceeUserId,
        realityTeacherUserIds: userIds
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
  margin-top:10px;

  li {
    border-bottom: 1px solid #eee;
    padding: 4px 12px;
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
