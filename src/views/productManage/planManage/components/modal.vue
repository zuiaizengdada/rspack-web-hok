
<template>
  <el-dialog v-if="visible" class="create-plan" :close-on-click-modal="false" :title="title" width="700px" :visible.sync="visible" @close="close">
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="IP姓名" prop="teacherId">
        <el-select
          v-model="form.teacherId"
          :disabled="type === 'edit'"
          filterable
          clearable
          remote
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 100%"
          placeholder="请选择IP姓名"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划名称" prop="planName">
        <el-input v-model="form.planName" maxlength="20" show-word-limit placeholder="请输入计划名称" />
      </el-form-item>
      <el-form-item label="计划类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">选题</el-radio>
          <el-radio :label="2" disabled>话题</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择内容" prop="selectCase">
        <div>
          <el-button type="primary" plain @click="handleBodyDialog">去选择</el-button>
          已选择{{ selectCase.length }}个
        </div>
      </el-form-item>
      <el-form-item label="通知人员" prop="assessUsers">
        <el-select
          v-model="groupId"
          class="w-300 m-b-20"
          clearable
          placeholder="选择分组"
          :disabled="guoqiFlag"
          @change="handleGroupList"
        >
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :label="item.groupName"
            :value="item.id"
          />
        </el-select>
        <div :class="{ assessBox: form.assessUsers && form.assessUsers.length > 0 }">
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
            :disabled="guoqiFlag"
            @click="selectUser"
          ><i class="el-icon-plus el-icon--left" />添加选题人员</el-button>
        </div>
        <div v-if="form.assessUsers && form.assessUsers.length " class="tips m-t-8">已选{{ form.assessUsers.length }}人</div>
      </el-form-item>
      <el-form-item label="截稿时间" prop="noticeTime">
        <el-date-picker
          v-model="form.noticeTime"
          :picker-options="pickerOptions"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择交稿截止时间"
        />
        <span class="tips m-l-10">注：每次修改截稿时间将通过飞书发送消息通知。</span>
      </el-form-item>
      <el-form-item label="定版时间" prop="deadline">
        <el-date-picker
          v-model="form.deadline"
          :picker-options="pickerOptions"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择定版时间"
        />
        <span class="tips m-l-10">注：到了定版时间将不能对内容进行评审。</span>
      </el-form-item>
      <el-form-item style="text-align: right; padding-bottom: 15px;">
        <el-button type="primary" size="mini" @click="handleSubmit">保存</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
    <select-case-modal ref="modal" append-to-body @submit="onSubmit" />
  </el-dialog>
</template>

<script>
import { planAdd, planEdit } from '@/api/product/plan'
import selectCaseModal from '@/components/SelectCaseModal/index'
import { getTeacherData } from '@/utils/getApiData'
import { getTreeLabelById, parseTime } from '@/utils/index'
import { teacherQueryByName } from '@/api/tearchCenter/index'
import { getGroupDetail, getGroupNameList } from '@/api/tearchCenter/index'
import moment from 'moment'
import { DateFormat } from '@/utils/index'
export default {
  components: { selectCaseModal },
  data() {
    var checkAssessUsers = (rule, value, callback) => {
      if (!this.form.assessUsers.length) {
        return callback(new Error('请选择评估人员!'))
      } else {
        return callback()
      }
    }
    return {
      guoqiFlag: false,
      title: '新增计划',
      groupList: [],
      visible: false,
      pickerOptions: {
        disabledDate(time) {
          return moment(time).add(1, 'days') < Date.now()
        }
      },
      userList: [],
      groupId: '',
      form: {
        teacherId: '',
        planName: '',
        selectCase: [],
        deadline: '',
        type: 1,
        assessUsers: [],
        noticeTime: ''
      },
      loading: false,
      selectCase: [],
      type: 'add',
      teacherName: '',
      teacherList: [],
      options: [],
      rules: {
        teacherId: [{ required: true, message: '请选择IP姓名', trigger: 'change' }],
        planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
        deadline: [{ required: true, message: '请选择截止时间', trigger: 'blur' }],
        noticeTime: [{ required: true, message: '请选择截稿时间', trigger: 'blur' }],
        type: [{ required: true, message: '请选择计划类型', trigger: 'change' }],
        assessUsers: [{ required: true, message: '请选择通知人员', validator: checkAssessUsers, trigger: 'blur', type: 'array' }]
      }
    }
  },
  mounted() {
    console.log('ffffrom: ', this.form)
  },
  created() {
    this.getAreaList()
  },
  methods: {
    DateFormat,
    // 点击添加评估人员
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.assessUsers,
        maxlength: 100,
        success: (res) => {
          res.user.map((v) => {
            v.userName = v.nickName
          })
          this.form.assessUsers = res.user
        }
      })
    },
    // 点击删除评估人员
    delAssessUsers(tag, index) {
      if (this.guoqiFlag) {
        return
      }
      this.form.assessUsers.splice(index, 1)
    },
    // 获取领域数据
    async getAreaList() {
      const { data } = await getGroupNameList()
      this.groupList = data ?? []
      await this.$store.dispatch('option/getAreaOption')
    },
    async handleGroupList() {
      if (!this.groupId) {
        const userList = this.userList.map(i => i.sysUserId)
        this.form.assessUsers = this.form.assessUsers.filter(i => !userList.includes(i.userId))
        return
      }
      const userList = this.userList.map(i => i.sysUserId)
      this.form.assessUsers = this.form.assessUsers.filter(i => !userList.includes(i.userId))
      const { data } = await getGroupDetail(this.groupId)
      this.userList = data.userList || []
      const arrData = this.userList.map(i => {
        return {
          userId: i.sysUserId,
          userName: i.userName,
          nickName: i.userName
        }
      })
      this.form.assessUsers = this.form.assessUsers.concat(arrData)
    },
    open({ type, row }) {
      this.getAreaList()
      this.guoqiFlag = false
      this.visible = true
      this.options = []
      this.reset()
      this.init()
      this.type = type
      if (type === 'edit') {
        console.log('rrrrrrrrrrrrrrroooooooooooooooowwwwwwwwwwwwwwwwwww: ', row)
        this.form.teacherId = row.teacherId
        this.form.planId = row.planId
        this.form.planName = row.planName
        this.form.deadline = row.deadline
        this.form.type = row.type
        this.form.noticeTime = parseTime(new Date(row.noticeTime).getTime())
        if (new Date(row.noticeTime).getTime() < new Date().getTime()) {
          this.guoqiFlag = true
        }
        this.form.deadline = parseTime(new Date(row.deadline).getTime())
        this.groupId = row.groupId
        this.userList = row.userResponseList.map(i => {
          return {
            sysUserId: i.userId,
            userName: i.nikeName
          }
        })
        this.form.assessUsers = this.userList.map(i => {
          return {
            userId: i.sysUserId,
            userName: i.userName,
            nickName: i.userName
          }
        })
        this.form.selectCase = row.forkCaseList.map((i) => {
          return {
            label: i.caseName,
            value: i.forkCaseId,
            size: i.size
          }
        })
        this.remoteMethod(row.teacherName)
        this.selectCase = this.form.selectCase
      }
      const isAdd = type === 'add'
      this.title = isAdd ? '新增计划' : '编辑计划'
    },
    remoteMethod(queryString) {
      if (!queryString) {
        return
      }
      const params = {
        name: queryString
      }
      teacherQueryByName(params)
        .then((res) => {
          this.options = res.data.map((v) => {
            return { label: v.teacherName, value: v.teacherId }
          })
        })
        .catch(() => {
          this.options = []
        })
    },
    async init() {
      this.teacherList = await getTeacherData()
    },
    handleBodyDialog() {
      const teacherName = getTreeLabelById(this.teacherList, this.form.teacherId)
      this.$refs.modal.open(this.form.selectCase, { teacherId: this.form.teacherId, teacherName })
    },
    reset() {
      this.form = {
        teacherId: '',
        planName: '',
        selectCase: [],
        deadline: '',
        type: 1,
        assessUsers: [],
        noticeTime: ''
      }
      this.groupId = ''
      this.selectCase = []
    },
    close() {
      this.visible = false
      this.$emit('close')
      this.reset()
    },
    async add() {
      const params = this.getParams()
      const { code } = await planAdd(params)
      if (code === 1) {
        this.$notify.success('新增成功')
        this.close()
      }
    },
    getParams() {
      const selectCase = this.form.selectCase.map((i) => i.value)
      let groupName = this.groupId// this.groupList.map((i) => i.groupId === this.groupId)
      this.groupList.some(item => {
        if (item.id === this.groupId) {
          groupName = item.groupName
        }
      })

      const teacherName = getTreeLabelById(this.teacherList, this.form.teacherId)
      const arrayUserId = []
      this.form.assessUsers.some(item => {
        console.log('eeeeeeeeeeeeeeeee:', item)
        arrayUserId.push(item.userId)
      })
      return {
        deadline: this.form.deadline,
        teacherId: this.form.teacherId,
        planName: this.form.planName,
        planId: this.form.planId || undefined,
        userList: arrayUserId,
        type: this.form.type,
        groupName: groupName,
        groupId: this.groupId,
        noticeTime: DateFormat(new Date(this.form.noticeTime), 'yyyy-MM-dd hh:mm:ss'),
        selectCase,
        teacherName
      }
    },
    async edit() {
      const params = this.getParams()
      console.log('sdfdsfdsfdsfds:', params)
      const { code } = await planEdit(params)
      if (code === 1) {
        this.$notify.success('保存成功')
        this.close()
      }
    },
    onSubmit(data) {
      this.$set(this.form, 'selectCase', data)
      this.selectCase = data
    },
    handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            this.add()
          } else {
            this.edit()
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
.container ::v-deep {
  height: 500px;
  .table_wrap {
    height: 100%;
  }
}
.assessBox {
  width: 503px;
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
.create-plan {
  border-radius: 10px;
  ::v-deep .el-dialog {
    border-radius: 10px;
  }
  ::v-deep .el-dialog__title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #E7E7E7;
  }
  ::v-deep .el-dialog__body {
    padding-bottom: 0px;
  }

}
.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #F53F3F;
  line-height: 20px;
}
</style>
