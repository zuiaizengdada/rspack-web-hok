<template>
  <div class="set-permission">
    <el-dialog title="开放权限设置" :visible.sync="setPermissionsFlag" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="视频类型" :label-width="formLabelWidth">
          <el-input v-model="form.type" class="w-300" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="视频名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" class="w-300" disabled />
        </el-form-item>
        <el-form-item label="开放状态" :label-width="formLabelWidth" prop="shareStatus">
          <el-radio-group v-model="form.shareStatus">
            <el-radio :label="1">不开放</el-radio>
            <el-radio :label="2">开放</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.shareStatus !== 1" label="开放对象" :label-width="formLabelWidth" prop="kaifdx">
          <el-radio-group v-model="form.kaifdx">
            <el-radio :label="2">指定对象</el-radio>
            <el-radio :label="3">所有人</el-radio>
          </el-radio-group>
          <div v-if="form.kaifdx === 2" class="choose-user">
            <span v-for="(item,index) in form.userIdList" :key="index" class="choose-span">{{ item.nickName }}<i class="el-icon-close" @click="deleteTheUser(index)" /></span>
            <el-button class="choose-btn" size="mini" @click="addFollowUser"> <i class="el-icon-plus" />添加对象</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button class="sure-cls" type="primary" @click="sureToSet('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getSettingGetData, setShareSetting } from '@/api/videoManagement/vedioSetting'
export default {
  components: {
  },
  data() {
    return {
      followUserModel: {
        visible: true
      },
      rowdata: {},
      setPermissionsFlag: false,
      form: {
        name: '',
        type: '半成品视频',
        kaifdx: 2,
        shareStatus: '',
        userIdList: []
      },
      rules: {
        shareStatus: [
          { required: true, message: '请选择开放状态', trigger: 'change' }
        ],
        kaifdx: [
          { required: true, message: '请选择开放对象', trigger: 'change' }
        ]
      },
      formLabelWidth: '120px'
    }
  },
  mounted() {
    // this.loadData()
  },
  methods: {
    show(row) {
      this.rowdata = row
      this.form.name = row.name
      this.setPermissionsFlag = true
      this.loadData()
    },
    loadData() {
      this.form = {
        name: '',
        type: '半成品视频',
        kaifdx: 2,
        shareStatus: '',
        userIdList: []
      }
      getSettingGetData(this.rowdata.semiVideoId).then(res => {
        if (res.success) {
          this.form.shareStatus = res.data.shareStatus === 3 ? 2 : res.data.shareStatus
          if (res.data.shareStatus === 3) {
            this.form.kaifdx = 3
          }
          this.form.userIdList = res.data.userInfos
          this.form.name = res.data.name
        }
      })
    },
    deleteTheUser(item) {
      this.form.userIdList.splice(item)
    },
    closeDialog() {
      this.setPermissionsFlag = false
    },
    sureToSet(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const userlistArray = []
          if (this.form.userIdList) {
            this.form.userIdList.some(item => {
              userlistArray.push(item.userId)
            })
          }

          const params = {
            protectStatus: this.form.shareStatus,
            semiVideoId: this.rowdata.semiVideoId,
            shareStatus: this.form.shareStatus === 1 ? 1 : (this.form.kaifdx === 3 ? 3 : 2),
            userIdList: userlistArray
          }
          setShareSetting(params).then(res => {
            if (res.success) {
              this.$message.success('设置成功！')
              this.$emit('getList')
              this.setPermissionsFlag = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sureFollowUser() {
      console.log(this.followUserModel)
    },
    closeFollowUserModel() {
      this.followUserModel.visible = false
    },
    // 选择跟进人员
    addFollowUser(index) {
      this.$AddressBook({
        visible: true,
        checkUser: this.form.userIdList ? this.form.userIdList : [],
        type: [1],
        multiple: true,
        success: (res) => {
          this.form.userIdList = []
          res.user.some(item => {
            const obj = {
              userId: item.userId,
              nickName: item.nickName
            }
            this.form.userIdList.push(obj)
          })
          const index = this.form.userIdList.findIndex((ele) => {
            return ele.userId === this.$store.getters.userInfo.userId
          })
          if (index >= 0) {
            this.form.userIdList.splice(index, 1)
          }
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.set-permission {
    width: 100%;
    .dialog-footer {
        text-align: right;
        padding-top: 30px;
    }
    .w-300 {
        width: 300px;
    }
    .choose-user {
      width: 450px;
      margin-top: 10px;
      margin-bottom: 10px;
      padding: 10px;
      min-height: 90px;
      border: 1px dashed #979797;
      .choose-span {
        padding: 4px 10px;
        position: relative;
        margin-right: 10px;
        border-radius: 3px;
        color: #0C6FFF;
        font-size: 12px;
        background: #DAE9FF;
        i {
          margin-left: 5px;
          cursor: pointer;
        }
      }
      .choose-btn {
        margin-left: 10px;
      }
    }
}

</style>

