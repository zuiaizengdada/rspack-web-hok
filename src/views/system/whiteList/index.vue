<template>
  <div class="white-list-container">
    <p class="title">白名单信息设置</p>
    <el-form label-width="120px" label-position="left" size="mini" class="form">
      <el-form-item label="通知开关">
        <div class="flex items-center">
          <el-switch v-model="form.isRemind" disabled @change="handleChangeSwitch($event)" />
        </div>
      </el-form-item>
      <div>
        <el-form-item label="通知白名单">
          <employee-item ref="employees" :list="form.employees" @success="updateWhiteList" @delete="delEmployee" />
        </el-form-item>
        <el-form-item label="短信通知白名单">
          <phone-item ref="phones" :list="form.phones" @success="addMsgList" @delete="delMsgList" />
        </el-form-item>
        <el-form-item label="邮箱通知白名单">
          <mail-item ref="mails" :list="form.mails" @success="addMail" @delete="delMail" />
        </el-form-item>
      </div>
    </el-form>
    <dialog-verify-code :visible.sync="visibleDialog" @cancel="cancelVerifyCode" @success="successVerifyCode" />
  </div>
</template>
<script>
import EmployeeItem from './components/EmployeeItem.vue'
import PhoneItem from './components/PhoneItem.vue'
import MailItem from './components/MailItem.vue'
import DialogVerifyCode from './components/DialogVerifyCode.vue'
import { getMsgWhiteList, addWhiteList, updateStatus, delWhiteList } from '@/api/system/whiteList'

export default {
  components: {
    EmployeeItem,
    PhoneItem,
    MailItem,
    DialogVerifyCode
  },
  data() {
    return {
      form: {
        isRemind: false,
        employees: [],
        phones: [],
        mails: []
      },
      isVerifyCode: false,
      visibleDialog: false
    }
  },
  mounted() {
    this.getWhiteList()
  },

  methods: {
    async getWhiteList() {
      const res = await getMsgWhiteList()
      const { feiShuMsgWhiteDtoList, msgPhoneWhiteDtoList, mailShuMsgWhiteDtoList } = res.data
      feiShuMsgWhiteDtoList && feiShuMsgWhiteDtoList.forEach(item => {
        item.nickName = item.userName
      })
      this.form.employees = feiShuMsgWhiteDtoList || []
      this.form.phones = msgPhoneWhiteDtoList || []
      this.form.mails = mailShuMsgWhiteDtoList || []
      this.form.isRemind = res.data.isRemind
    },

    async updateWhiteList(selectEmployees) {
      // const selectEmployees = this.$refs.employees.tagList
      const newEmployees = selectEmployees.map(item => item.userId)

      const addEmployees = newEmployees.filter(item => !this.form.employees.some(ele => ele.userId === item))
      const delEmployees = this.form.employees.filter(item => !newEmployees.some(ele => ele === item.userId))

      // this.form.employees = selectEmployees
      console.log('diff count: ', addEmployees, delEmployees)

      let result = false
      if (addEmployees.length > 0) {
        const res = await addWhiteList({
          itemType: 0,
          items: addEmployees
        })
        result = res.code === 1
      }
      if (delEmployees.length > 0) {
        const res = await delWhiteList({
          itemType: 0,
          items: delEmployees.map(item => item.userId)
        })
        result = res.code === 1
      }

      if (result) {
        this.$message.success('更新成功')
        // ... get new data
      } else {
        this.$message.error('更新失败')
      }
      this.getWhiteList()
      console.log('====================')
      console.log('diff: ', selectEmployees, addEmployees, delEmployees)
      console.log('====================')

      // await saveOrUpdate({
      //   itemType: 0,
      //   feiShuWhiteListConfigReqList,
      //   msgWhiteListConfigReqList: phones,
      //   isRemind: this.form.isRemind
      // })
    },
    async delEmployee(index) {
      const delItem = this.form.employees[index]
      console.log('del employee: ', index, delItem)
      const res = await delWhiteList({
        itemType: 0,
        items: [delItem.userId]
      })
      if (res.code === 1) {
        this.$message.success('删除成功')
        this.getWhiteList()
      } else {
        this.$message.error('删除失败')
      }
    },
    async addMsgList(newMsgPhone) {
      console.log('add msg list: ', newMsgPhone)
      const res = await addWhiteList({
        itemType: 1,
        items: [newMsgPhone]
      })
      if (res.code === 1) {
        this.$message.success('更新成功')
        this.getWhiteList()
      } else {
        this.$message.error('更新失败')
      }
    },
    async delMsgList(index) {
      const delPhone = this.form.phones[index]
      console.log('del msg list: ', index, delPhone)
      const res = await delWhiteList({
        itemType: 1,
        items: [delPhone.phone]
      })
      if (res.code === 1) {
        this.$message.success('删除成功')
        this.getWhiteList()
      } else {
        this.$message.error('删除失败')
      }
    },
    async addMail(newMail) {
      console.log('add msg list: ', newMail)
      const res = await addWhiteList({
        itemType: 2,
        items: [newMail]
      })
      if (res.code === 1) {
        this.$message.success('更新成功')
        this.getWhiteList()
      } else {
        this.$message.error('更新失败')
      }
    },
    async delMail(index) {
      const delItem = this.form.mails[index]
      const res = await delWhiteList({
        itemType: 2,
        items: [delItem.mail]
      })
      if (res.code === 1) {
        this.$message.success('删除成功')
        this.getWhiteList()
      } else {
        this.$message.error('删除失败')
      }
    },
    handleChangeSwitch(val) {
      this.visibleDialog = true
    },
    cancelVerifyCode(isCheck) {
      if (!isCheck) {
        this.form.isRemind = this.isVerifyCode
      }
    },
    async successVerifyCode() {
      this.form.isRemind = !this.isVerifyCode
      await updateStatus(this.form.isRemind)
      this.isVerifyCode = !this.isVerifyCode
    }
  }

}
</script>
<style lang="scss" scoped>
.white-list-container{
  background: #fff;
  width:100%;
  height:auto;
  padding:20px;
  border-radius: 20px;
  .title{
    padding-bottom:14px;
    border-bottom:1px solid #e7e7e7;
    margin-bottom:20px;
  }
  .form{
    border:1px dashed #888;
    padding:20px 20px 10px 20px;
    border-radius: 6px;;
  }
}
</style>
