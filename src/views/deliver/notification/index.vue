<template>
  <div>
    <MCard class="cardHeight">
      <div class="videoDeliverySettings">交付通知</div>
      <div class="form">
        <el-form ref="form" :model="form" label-width="0px" :rules="rules">
          <el-form-item
            v-model="form.switch"
            label="通知开关"
            label-width="120px"
            class="custom-group-item"
          >
            <el-switch v-model="form.switch" />
          </el-form-item>
          <el-form-item
            label="通知人员"
            label-width="120px"
            class="custom-group-item"
          >
            <addUser
              btn-text="添加提醒人员"
              :loading="addUserLoading"
              :disabled="!form.switch"
              :data="form.userList"
              @del="val => delUserList(val)"
              @add="val => addUserList(val)"
            />
          </el-form-item>
          <el-form-item
            label="通知企微群"
            label-width="120px"
            class="custom-group-item"
          >
            <addGroup
              :shop-notice-flag="form.switch"
              :shop-feishu-group-list="form.groupList"
              :set-type="19"
              :login-type="loginType"
              @setRemindInfo="handleSetRemindInfo"
            />
          </el-form-item>
          <el-form-item
            label="通知内容"
            label-width="120px"
            class="custom-group-item"
          >
            <el-popover placement="top-start" title="内容" trigger="hover">
              <div style="white-space: pre-line">
                <p>有一个直播课学员未分配且未入班</p>
                <p>订单号：xxx</p>
                <p>学员电话：</p>
                <p>学员邮箱：xxx</p>
                <p>课程名称：xxx xxx</p>
                <p>下单时间：xxxx-xx-xx xx:xx:xx</p>
              </div>
              <el-button slot="reference" size="mini">内容</el-button>
            </el-popover>
          </el-form-item>
          <el-button
            :disabled="!edited"
            :loading="loading"
            type="primary"
            @click="save()"
          >
            保存
          </el-button>
        </el-form>
      </div>
    </MCard>
  </div>
</template>

<script>
import addUser from '@/views/basicSettings/components/addUser'
import addGroup from '@/views/basicSettings/components/addGroup'
import { getRemindDetail, saveRemindDetail } from '@/api/deliver/baseSeeting'
import { isEqual, cloneDeep } from 'lodash'

export default {
  components: {
    addUser,
    addGroup
  },
  data() {
    return {
      addUserLoading: false,
      loginType: 'wecom',
      form: {
        switch: false,
        userList: [],
        groupList: [],
        desc: ''
      },
      edited: false,
      oldForm: {},
      rules: {
        // packageConfig: {
        //   playDuration: [
        //     { required: true, message: '请输入累计观看时长', trigger: 'blur' },
        //     {
        //       type: 'number',
        //       min: 0,
        //       message: '时间不能是负数'
        //     }
        //   ],
      },
      packageConfig: {
        modelType: 1
      },
      loading: false
    }
  },
  watch: {
    form: {
      handler(newVal) {
        this.edited = !isEqual(this.oldForm, this.form)
      },
      deep: true
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      getRemindDetail().then(res => {
        this.form.switch = res.data.flag === 1
        this.form.userList = (res.data.sysUserList || []).map(item => ({
          userId: item.id,
          nickName: item.name
        }))
        this.form.groupList = (res.data.groupList || []).map(item => ({
          chat_id: item.id,
          name: item.name
        }))
        this.form.desc = res.data.desc || ''
        this.oldForm = cloneDeep(this.form)
      })
    },
    delUserList(index) {
      this.form.userList.splice(index, 1)
    },
    addUserList(val) {
      this.form.userList = val
    },
    // 点击保存
    save() {
      const reqData = {
        flag: this.form.switch ? 1 : 0,
        sysUserIds: this.form.userList.map(item => item.userId),
        groupList: this.form.groupList.map(item => ({
          chatId: item.chat_id,
          name: item.name
        }))
      }
      saveRemindDetail(reqData).then(res => {
        if (res.success) {
          this.edited = false
          this.oldForm = cloneDeep(this.form)
          this.$message.success('保存成功')
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    handleSetRemindInfo(groupReqs) {
      this.form.groupList = groupReqs.map(item => ({
        chat_id: item.chatId,
        name: item.name
      }))
    },
    handleSwitchChange() {
      saveRemindDetail({ flag: this.form.switch ? 1 : 0, type: 0 }).then(
        res => {
          if (res.success) {
            this.$message.success('保存成功')
          } else {
            this.$message.error('保存失败')
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.cardHeight {
  @include responsive-height(20px);
}

::v-deep {
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 10px;
  }
}

.videoDeliverySettings {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 24px;
  padding-bottom: 20px;
  margin: 0 20px;
  border-bottom: 1px solid #e7e7e7;
}

.title {
  font-size: 14px;
  color: #333333;
  margin-bottom: 16px;
}

.form {
  padding: 20px;

  .custom-group-item {
    .el-input-group__append .el-select {
      margin: -10px;
    }
  }
  ::v-deep {
    .assessBox {
      padding: 0;
      border: none;
    }
  }
}

.formLabel {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
  font-weight: 500;
}

.formValue {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
}

.m-l-4 {
  margin-left: 4px;
}

.m-r-4 {
  margin-right: 4px;
}
.radioBox::v-deep {
  display: flex;
  margin-top: 10px;
  .el-radio__label {
    display: flex;
  }
  .radioText {
    margin-left: 10px;
    color: #000;
    > span {
      color: red;
    }
  }
}

.shop-notice {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  width: 100%;
  display: inline-block;
  .shop-line {
    float: left;
    width: 100%;
    margin-bottom: 10px;
    ::v-deep .assessBox {
      padding: 0;
      border: none;
    }

    .shop-line-text-box {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      .inputNumber {
        width: 130px;
      }
      > div:nth-of-type(2) {
        padding-left: 100px;
        font-size: 12px;
        font-weight: 400;
        color: #777777;
        line-height: 22px;
        margin-top: 10px;
        margin-bottom: 22px;
      }
    }
    .shop-line-label {
      float: left;
      font-size: 12px;
      width: 100px;
      line-height: 28px;
      color: #333;
    }
  }
  .boxText {
    font-size: 14px;
  }
}
</style>
