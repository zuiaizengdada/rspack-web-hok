<template>
  <AppDialog
    v-if="visible"
    v-model="visible"
    :title="title"
    width="518px"
    height="auto"
    @success="submit"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      style="margin-top:20px"
      label-width="100px"
    >
      <el-form-item
        label="分组名称"
        prop="groupName"
      >
        <el-input
          v-model="form.groupName"
          style="width:380px"
          maxlength="20"
          clearable
          show-word-limit
          placeholder="请输入分组名称"
        />
      </el-form-item>
      <el-form-item
        label="分组人员"
        prop="list"
      >
        <div class="assess-box">
          <el-tag
            v-for="(tag, index) in form.list"
            :key="tag.userId"
            class="assess-users-view"
            closable
            @close="delAssessUsers(tag, index)"
          >{{ tag.userName }}</el-tag>
          <el-button
            v-if="form.list && form.list.length < 100 "
            size="mini"
            class="assess-users-view"
            @click="selectUser"
          ><i class="el-icon-plus el-icon--left" />添加人员</el-button>
          <div class="group-count">{{ `${form.list.length || 0}/100` }}</div>
        </div>
      </el-form-item>
      <el-form-item
        label="分组说明"
        prop="groupDesc"
      >
        <el-input
          v-model="form.groupDesc"
          style="width:380px"
          type="textarea"
          maxlength="100"
          :autosize="{ minRows: 4}"
          show-word-limit
          clearable
          placeholder="请输入分组说明"
        />
      </el-form-item>

    </el-form>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getGroupAdd, getGroupEdit } from '@/api/tearchCenter/index'
export default {
  name: 'GroupModal',
  components: {
    AppDialog
  },
  data() {
    return {
      visible: false,
      form: {
        groupName: '',
        list: [],
        groupDesc: '',
        groupId: ''
      },
      title: '新增分组',
      rules: {
        groupName: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ],
        list: [
          { required: true, message: '请选择分组人员', type: 'array', trigger: 'change' }
        ]
      },
      type: ''
    }
  },
  methods: {
    async open(row = {}, type = 'add') {
      this.type = type
      this.title = `${type === 'edit' ? '编辑' : '新增'}分组`
      this.form = {
        groupName: row?.groupName ?? '',
        groupDesc: row?.groupDesc ?? '',
        groupId: row?.id ?? '',
        list: row?.userList?.map(i => {
          return {
            userId: i.sysUserId,
            userName: i.userName,
            nickName: i.userName
          }
        }) ?? []
      }
      this.visible = true
    },
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.list,
        maxlength: 100,
        success: (res) => {
          const user = res.user.map((v) => {
            return {
              ...v,
              userName: v.nickName
            }
          })
          this.form.list = user
        }
      })
    },
    async submit() {
      if (!this.form.list.length) {
        this.$notify.error('分组人员不能为空')
        return
      }
      const params = {
        sysUsers: this.form.list.map(i => i.userId),
        groupName: this.form.groupName,
        groupDesc: this.form.groupDesc,
        groupId: this.form.groupId
      }
      if (this.type === 'add') {
        await getGroupAdd(params)
      } else {
        await getGroupEdit(params)
      }
      this.$notify.success(`${this.type === 'edit' ? '编辑' : '新增'}成功`)
      this.$emit('success')
      this.reset()
    },
    async reset() {
      this.visible = false
      this.form = {
        groupName: '',
        list: [],
        groupDesc: '',
        groupId: ''
      }
    },
    // 点击删除通知人员
    delAssessUsers(tag, index) {
      this.form.list.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.assess-box {
    width: 398px;
    box-sizing: border-box;
    padding: 18px 16px 2px;
    height: auto;
    background: #ffffff;
    border-radius: 6px;
    border: 1px dashed #979797;
    .assess-users-view {
        margin-right: 16px;
        margin-bottom: 16px;
    }
}
.group-count{
    font-size: 12px;
    color: #777777;
    margin:8px 0 0 0;
    text-align: right;
}
</style>
