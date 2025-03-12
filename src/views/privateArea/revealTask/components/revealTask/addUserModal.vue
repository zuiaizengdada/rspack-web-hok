<template>
  <el-dialog
    width="600px"
    title="新增人员"
    class="dialog-container"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form
      ref="ruleForm"
      label-width="120px"
      :rules="rules"
      :model="form"
      size="small"
    >
      <el-form-item label="新增人员" prop="userIdList">
        <div :class="{ assessBox: form.userIdList.length > 0 }">
          <el-tag
            v-for="(tag, index) in form.userIdList"
            :key="tag.userId"
            class="assessUsersView"
            closable
            @close="delAssessUsers(tag, index)"
          >{{ tag.userName }}</el-tag>
          <el-button
            size="mini"
            class="assessUsersView"
            @click="selectUser"
          ><i class="el-icon-plus el-icon--left" />添加人员</el-button>
        </div>
      </el-form-item>
      <el-form-item
        label="每轮分配线索数"
        prop="clueNum"
        style="margin-top: 20px"
      >
        <el-input-number
          v-model="form.clueNum"
          :controls="false"
          :precision="0"
          :min="1"
          :max="300"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        size="small"
        type="primary"
        :loading="loading"
        @click="handleSave"
      >确 定</el-button>
      <el-button size="small" @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import {
//   assistantCreate,
//   assistantSettingUserIdList
// } from '@/api/deliver/assistant'
import { addTaskStaff } from '@/api/privateArea/revealTask'
export default {
  name: 'SaveRule',
  data() {
    return {
      form: {
        userIdList: [],
        clueNum: 0,
        goodsType: undefined,
        taskId: undefined
      },
      visible: false,
      rules: {
        userIdList: [
          {
            required: true,
            message: '请选择接待人人员',
            trigger: 'change',
            type: 'array'
          }
        ],
        clueNum: [
          {
            required: true,
            message: '请输入最大接待数',
            trigger: 'blur'
          }
        ]
      },
      disabledUser: [],
      loading: false
    }
  },
  methods: {
    async open(data) {
      this.visible = true
      this.reset()
      this.form.goodsType = data.goodsType
      this.form.taskId = data.taskId
    },
    reset() {
      this.form = {
        userIdList: [],
        clueNum: 0,
        goodsType: undefined,
        taskId: undefined
      }
    },
    delAssessUsers(tag, index) {
      this.form.userIdList.splice(index, 1)
    },
    async handleSave() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const userIdList = this.form.userIdList.map(item => item.userId)
            const { code, data } = await addTaskStaff({
              clueNum: this.form.clueNum,
              goodsType: this.form.goodsType,
              taskId: this.form.taskId,
              userIdList
            })
            if (code === 1) {
              this.loading = false
              this.$emit('success', data)
              this.visible = false
            }
          } catch (e) {
            this.loading = false
          }
        }
      })
    },
    selectUser() {
      const checkUser = this.form.userIdList.map(i => {
        return {
          userId: i.userId,
          nickName: i.userName
        }
      })
      this.$AddressBook({
        visible: true,
        multiple: true,
        checkUser,
        type: [1],
        minlength: 1,
        disabledUser: this.disabledUser,
        success: res => {
          if (res.user.length > 0) {
            this.form.userIdList =
              res.user?.map(i => {
                return {
                  userId: i.userId,
                  userName: i.nickName
                }
              }) ?? []
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep {
  .el-dialog__body {
    padding: 20px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .assessBox {
    width: 403px;
    box-sizing: border-box;
    padding: 18px 16px 2px;
    height: auto;
    background: #ffffff;
    border-radius: 6px;
    border: 1px dashed #979797;
    .assessUsersView {
      margin-right: 16px;
      margin-bottom: 16px;
    }
  }
}
</style>
