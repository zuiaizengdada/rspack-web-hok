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
      <el-form-item label="接待员工" prop="assessUsers">
        <div :class="{ assessBox: form.assessUsers.length > 0 }">
          <el-tag
            v-for="(tag, index) in form.assessUsers"
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
      <el-form-item v-if="[1,4].includes(dataType)" label="最大分配线索数" prop="maxClueNum" style="margin-top:20px">
        <el-input-number
          v-model="form.maxClueNum"
          :controls="false"
          :precision="0"
          :min="1"
          :max="2000"
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
export default {
  name: 'SaveRule',
  props: {
    dataType: {
      default: 1,
      type: Number
    }
  },
  data() {
    return {
      initForm: { dataType: 1 },
      form: {
        assessUsers: [],
        maxClueNum: 1
      },
      visible: false,
      rules: {
        assessUsers: [
          {
            required: true,
            message: '请选择接待员工',
            trigger: 'change',
            type: 'array'
          }
        ],
        maxClueNum: [
          {
            required: true,
            message: '请输入最大分配线索数',
            trigger: 'blur'
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    async  open(initForm) {
      this.initForm = initForm
      this.visible = true
      this.reset()
    },
    reset() {
      this.form = {
        assessUsers: [],
        maxClueNum: 1
      }
    },
    delAssessUsers(tag, index) {
      this.form.assessUsers.splice(index, 1)
    },
    async handleSave() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          this.$emit('success', this.form)
        }
      })
    },
    selectUser() {
      const checkUser = this.form.assessUsers.map(i => {
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
        success: res => {
          if (res.user.length > 0) {
            this.form.assessUsers = res.user?.map((i) => {
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
  .dialog-container ::v-deep{
      .el-dialog__body{
          padding:20px;
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

