<template>
  <div>
    <el-button type="primary" @click="addAssistant">添加助教({{ tutorTeacherUser.length }}/100)</el-button>
    <div>
      <div :class="{ assessBox: tutorTeacherUser.length > 0 }">
        <el-tag
          v-for="(tag, index) in tutorTeacherUser"
          :key="tag.userId"
          class="remindPersonListView"
          closable
          @close="delAssistant(tag, index)"
        >{{ tag.nickName }}</el-tag>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tutorTeacherUser: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  inject: ['baseInfoForm'],
  methods: {
    addAssistant() {
      const realityTeacherUser = this.baseInfoForm.realityTeacherUser
      console.log(realityTeacherUser, 'realityTeacherUser')
      let disabledUser = []
      if (Object.keys(realityTeacherUser).length) {
        // realityTeacherUser.realityTeacherUser.forEach(item=>{})
        disabledUser = realityTeacherUser.realityTeacherUserIds
      }
      console.log(disabledUser, 'disabledUser')
      // realityTeacherUser.forEach((i) => {
      //   disabledUser.push(i.userId)
      // })
      //   if (this.config.type === 2 && [1, 2, 3].includes(this.form.status)) {
      //     disabledUser = disabledUser.concat(this.defaultDisabledUser)
      //   }
      const userDeptId = Number(localStorage.getItem('userDeptId'))
      // alert(userDeptId)
      const checkDept = []
      checkDept.push({
        name: '',
        deptId: userDeptId
      })
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkDept: checkDept,
        checkUser: this.tutorTeacherUser,
        disabledUser,
        maxlength: 100,
        success: (res) => {
          this.tutorTeacherUser = res.user
          console.log(res.user, 'userrrrr')
          const list = []
          this.tutorTeacherUser.forEach(item => {
            list.push(item.userId)
          })

          this.$emit('select', list)
        }
      })
    },
    // 点击删除助教
    delAssistant(tag, index) {
      this.tutorTeacherUser.splice(index, 1)
      this.getTutorTeacherUser()
    },
    getTutorTeacherUser() {
      const list = []
      this.tutorTeacherUser.forEach(item => {
        list.push(item.userId)
      })
      this.$emit('select', list)
    },
    updateInitList(isInit) {
      if (isInit) {
        this.tutorTeacherUser = [{ ...this.userInfo }]
        this.getTutorTeacherUser()
      } else {
        this.tutorTeacherUser = []
        this.$emit('select', [])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.assessBox {
  margin-top: 16px;
  width: 450px;
  box-sizing: border-box;
  padding: 16px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
}
.remindPersonListView {
  margin-right: 16px;
  margin-bottom: 16px;
}
</style>
