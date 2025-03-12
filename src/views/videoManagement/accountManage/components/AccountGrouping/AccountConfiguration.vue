<template>
  <AppDialog :height="'475px'" :width="'694px'" :value="visible" :title="title" @close="close">
    <div class="content">
      <div v-if="loginObject.addOrEdit === 'edit'" class="top-info">
        <img :src="form.avatar" />
        <div class="top-name">{{ form.name }}</div>
      </div>
      <div v-else-if="loginObject.addOrEdit === 'add'" class="top-info">
        <span class="top-info-spanbg">
          <i class="success-check" />
        </span>
        <div class="top-name success-login-name">账号登录成功</div>
      </div>
      <div v-if="loginObject.addOrEdit === 'add'" class="show-name-block">
        <img :src="form.avatar" />
        <span>{{ form.name }}</span>
      </div>
      <div class="form-list">
        <el-form ref="ruleform" :rules="rules" :inline="true" :model="form" class="demo-form-inline" label-width="100px">
          <div>
            <el-form-item label="平台">
              <el-input v-model="form.platformName" placeholder="平台名称" class="w-200" disabled />
            </el-form-item>
            <el-form-item label="账号UID">
              <el-input v-model="form.uid" placeholder="账号UID" class="w-200" disabled />
            </el-form-item>
          </div>
          <div>
            <el-form-item label="运营者" prop="operatorId">
              <el-select v-model="form.operatorId" filterable placeholder="请选择" :disabled="loginObject.addOrEdit === 'edit'" clearable>
                <el-option
                  v-for="item in userArray"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="IP" prop="teacherIds">
              <!-- <el-select v-model="form.teacherIds" :disabled="loginObject.addOrEdit === 'edit'" placeholder="请选择" class="w-200 dr-tearch" multiple filterable popper-class="eloption-cls" :popper-append-to-body="true">
                <el-option
                  v-for="item in teacherList"
                  :key="item.teacherId"
                  :label="item.teacherName"
                  :value="item.teacherId"
                />
              </el-select> -->
              <filterSelectSingle ref="filterSelectSingle" class="w-365" :disabled="loginObject.addOrEdit === 'edit'" :placeholder-str="'请选择IP'" multiple popper-class="eloption-cls" :popper-append-to-body="true" @handleChange="changeHanldeTeacher" />
            </el-form-item>
          </div>
          <div>
            <el-form-item label="电话号码" prop="phoneNumber">
              <el-input v-model.trim="form.phoneNumber" type="tel" class="w-200" maxlength="11" :min="0" @input="(e) => delNoNumber(e, 'phoneNumber')" />
            </el-form-item>
          </div>
          <!-- <div>
            <el-form-item label="分组">
              <el-input v-if="userInfo.userId != form.operatorId" v-model="loginObject.group" disabled placeholder="" />
              <el-select v-else v-model="form.groupId" placeholder="请选择" class="w-200" :disabled="userInfo.userId != form.operatorId" multiple>
                <el-option
                  v-for="item in groupList"
                  :key="item.groupId"
                  :label="item.groupName"
                  :value="item.groupId"
                />
              </el-select>
            </el-form-item>
          </div> -->
        </el-form>
      </div>
    </div>
    <div slot="footer" class="footer-cls">
      <el-button type="primary" :loading="submitFlag" @click="submit('ruleform')">确定</el-button>
      <el-button @click="close()">取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import { userNoPage } from '@/api/addressBookApi'
import AppDialog from '@/components/AppDialog'
// import { teacherQueryByName } from '@/api/tearchCenter/index'
import { addAccountMedia, getAccountGroupList, updateAccount, getIsChanger } from '@/api/videoManagement/accountManage'
import filterSelectSingle from '@/components/filterSelectSingle/index.vue'

export default {
  name: 'AccountConfiguration',
  components: {
    AppDialog,
    filterSelectSingle
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  data() {
    return {
      title: '完善账号信息',
      submitFlag: false,
      loginObject: {},
      isChanger: '',
      disabledV: false,
      teacherList: [],
      groupList: [],
      form: {
        name: '',
        platformId: '',
        platformName: '',
        id: '',
        uid: '',
        phoneNumber: '',
        operatorId: '',
        teacherIds: [],
        avatar: ''
      },
      rules: {
        operatorId: [
          { required: true, message: '请选择运营者', trigger: 'change' }
        ],
        // teacherIds: [
        //   { required: true, message: '请选择达人老师', trigger: 'change' }
        // ],
        phoneNumber: [
          { required: true, message: '请输入电话号码', trigger: 'blur' }
        ]
      },
      userArray: []
    }
  },
  created() {
    this.getGroupList()
    this.loadUserNoPage()
  },
  methods: {
    changeHanldeTeacher(val) {
      this.form.teacherIds = val
    },
    // async getTeacherList() {
    //   const params = {
    //     name: ''
    //   }
    //   teacherQueryByName(params)
    //     .then((res) => {
    //       this.teacherList = res.data
    //     })
    //     .catch(() => {
    //     })
    // },
    loadUserNoPage() {
      const params = {
        deptId: '',
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    show(item) {
      if (this.loginObject.addOrEdit === 'add') {
        this.title = '完善账号信息'
      } else if (this.loginObject.addOrEdit === 'edit') {
        this.title = '编辑账号信息'
      }
      this.loginObject = item
      this.form.name = this.loginObject.name
      this.form.avatar = this.loginObject.avatar
      this.form.platformName = this.loginObject.platformName
      this.form.platformId = this.loginObject.platformId
      this.form.id = this.loginObject.platformAccountId
      this.form.uid = this.loginObject.authorId
      this.form.platformAccountId = this.loginObject.platformAccountId
      if (this.loginObject.id) {
        this.form.merchantId = this.loginObject.id
      } else {
        delete this.form.merchantId
      }
      if (this.loginObject.addOrEdit === 'add') {
        this.form.operatorId = this.userInfo.userId
        this.form.phoneNumber = ''
        this.form.teacherIds = []
        this.$nextTick(() => {
          this.$refs['ruleform'].clearValidate()
        })
      }
    },
    showEidt(item) {
      this.loginObject = item
      this.loginObject.addOrEdit = 'edit'
      if (this.loginObject.addOrEdit === 'edit') {
        this.title = '编辑账号信息'
      } else {
        this.title = '完善账号信息'
      }
      this.form.name = item.name
      this.form.avatar = item.avatar
      this.form.platformName = item.platformName
      this.form.platformId = item.platformId
      this.form.id = item.platformAccountId
      this.form.uid = item.authorId
      this.form.platformAccountId = item.platformAccountId
      this.form.phoneNumber = item.phone
      this.form.operatorId = item.operatorId
      this.form.teacherIds = item.teacherIds
      const that = this
      setTimeout(() => {
        that.$refs.filterSelectSingle.defaultSelect(this.form.teacherIds)
      }, 1000)
      getIsChanger().then(res => {
        if (res.success) {
          this.isChanger = res.data.role
        }
      })
    },
    getGroupList() {
      const params = {
        pageIndex: 1,
        pageSize: 1000,
        type: 2
      }
      getAccountGroupList(params).then(res => {
        if (res.success) {
          this.groupList = res.data.items
        }
      })
    },
    delNoNumber(e) {
      this.form.phoneNumber = e.replace(/[^0-9]/g, '')
    },
    close() {
      this.$refs.filterSelectSingle.clear()
      this.$emit('closeAccountConfig')
      /* if (this.loginObject.addOrEdit === 'edit') {
        this.visible = false
      }*/
    },
    submit(ruleForm) {
      this.$refs['ruleform'].validate((valid) => {
        if (valid) {
          const reg = /^[1][3-9][0-9]{9}$/
          // eslint-disable-next-line eqeqeq
          if ((!reg.test(this.form.phoneNumber)) && this.form.phoneNumber != '' && this.form.phoneNumber != null) {
            this.$message.error('请输入正确的手机号码！')
            return false
          }
          this.submitFlag = true
          if (this.loginObject.addOrEdit === 'edit') {
            const params = {
              operatorId: this.form.operatorId,
              phone: this.form.phoneNumber ? this.form.phoneNumber : '',
              platformAccountId: this.form.platformAccountId,
              teacherIds: this.form.teacherIds
            }
            updateAccount(params).then(res => {
              if (res.success) {
                this.$message.success('账号修改成功！')
                this.$refs.filterSelectSingle.clear()
                this.submitFlag = false
                this.$emit('successForAccount')
              }
            })
          } else {
            const params = {
              authorId: this.form.uid,
              authorityUrl: this.form.uid,
              avatar: this.form.avatar,
              cookie: this.loginObject.cookie,
              name: this.form.name,
              operatorId: this.form.operatorId,
              phone: this.form.phoneNumber,
              platformAccountId: this.form.platformAccountId,
              platformId: this.form.platformId,
              teacherIds: this.form.teacherIds,
              merchantId: this.form.merchantId
            }
            addAccountMedia(params).then(res => {
              if (res.success) {
                this.$message.success('账号添加成功！')
                this.submitFlag = false
                this.$store.dispatch('videoManage/syncAccountData', this.form.platformAccountId)
                this.$refs.filterSelectSingle.clear()
                this.$emit('successForAccount')
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 460px;
  overflow-y: auto;
  .form-list{
    margin-top: 24px;
  }
}
.top-info{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  .top-info-spanbg {
    border-radius: 100%;
    width: 64px;
    height: 64px;
  }
  .success-check {
    width: 64px;
    height: 64px;
    color: #00D151;
    background-image: url(../../../../../assets/image/account/icn_success_bg.png);
    background-size: 100%;
    display: inline-block;
  }
  .success-login-name {
    color: #333;
    font-weight: bold;
  }
  .top-name{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    margin-top: 10px;
  }
  img{
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
}

.show-name-block {
  width: 100%;
  height: 52px;
  padding-left: 60px;
  margin-top: 10px;
  img {
    width: 52px;
    height: 52px;
    border-radius: 100%;
    float: left;
    margin-right: 15px;
  }
  span {
    height: 52px;
    line-height: 52px;
    font-size: 16px;
    color: #333;
  }
}

.footer-cls {
  border-top: 1px solid #f2f2f2;
  padding-bottom: 20px;
  padding-top: 20px;
  padding-right: 20px;
  text-align: right;
}

</style>
