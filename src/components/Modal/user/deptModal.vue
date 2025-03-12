<!-- 新增/编辑部门页面弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      size="small"
      class="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model.trim="form.deptName" maxlength="30" show-word-limit />
      </el-form-item>
      <el-form-item label="关联公司主体" prop="companyId">
        <el-select
          v-model="form.companyId"
          clearable
          filterable
          placeholder="请选择关联公司主体"
          style="width: 100%"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上一级部门" prop="parentId">
        <el-input
          v-model="form.parentName"
          style="width: 200px"
          :disabled="true"
          :required="rules.parentId[0].required"
        />
        <el-button @click="selectDept">选择</el-button>
      </el-form-item>
      <el-form-item label="部门类型" prop="deptType">
        <el-radio-group v-model="form.deptType" :disabled="type === 3">
          <el-radio :label="0">内部部门</el-radio>
          <el-radio :label="1">外部部门</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="部门负责人" prop="leaderId">
        <div class="leader-item">
          <el-select
            v-model="form.leaderId"
            filterable
            remote
            clearable
            :remote-method="remoteMethodleader"
            @change.native="handleChangeleader"
          >
            <el-option
              v-for="item in leaderOptions"
              :key="item.userId"
              :label="`${item.nickName} (${item.deptName})`"
              :value="item.userId"
            />
          </el-select>
          <el-select :value="0">
            <el-option label="主负责人" :value="0" />
          </el-select>
        </div>
        <div
          v-for="(item, index) in sysDeptLeaderReqListShow"
          :key="index"
          class="leader-item"
        >
          <el-select
            v-model="item.leaderId"
            filterable
            remote
            clearable
            :remote-method="remoteMethodleader"
            @change="e => handleChangeSysDep(e, index, leaderOptions)"
          >
            <el-option
              v-for="item2 in leaderOptions"
              :key="item2.userId"
              :label="`${item2.nickName} (${item2.deptName})`"
              :value="item2.userId"
            />
          </el-select>
          <el-select :value="1">
            <el-option label="负责人" :value="1" />
          </el-select>
          <i
            class="delete-icon el-icon-close"
            @click="deleteLeaderItem(item)"
          />
        </div>
        <div class="add-btn">
          <el-button type="text" @click="addLeader">继续添加</el-button>
        </div>
      </el-form-item>
    </el-form>

    <div class="demo-drawer__footer">
      <el-button size="small" @click="$emit('close')">取 消</el-button>
      <el-button
        v-if="type !== 2"
        type="primary"
        size="small"
        @click="send"
      >提交</el-button>
    </div>
  </div>
</template>

<script>
import { queryCompanyPageList } from '@/api/businessAdmin/talentFile'
import { userNoPage } from '@/api/addressBookApi'
import { hasValue } from '@/utils/index'

export default {
  props: {
    type: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {
          deptName: '',
          parentName: '',
          parentId: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      rules: {
        deptName: [
          { required: true, message: '请输入部门', trigger: 'blur' },
          { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择上一级部门', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '请选择公司主体', trigger: 'blur' }
        ],
        deptType: [
          { required: true, message: '请选择部门类型', trigger: 'change' }
        ],
        leaderId: [
          { required: true, message: '请选择部门负责人', trigger: 'change' }
        ]
      },
      form: {
        deptName: '',
        parentName: '',
        parentId: '',
        deptType: 0,
        leader: '',
        leaderId: ''
      },
      leaderOptions: [],
      sysDeptLeaderReqList: [],
      sysDeptLeaderReqListShow: [],
      companyList: []
    }
  },
  computed: {},
  watch: {
    visible: {
      handler(newValue) {
        if (newValue && this.type === 1) {
          this.form = {
            deptName: '',
            parentName: '',
            parentId: '',
            deptType: 0,
            leader: '',
            leaderId: ''
          }
          this.rules.parentId[0].required = true
        } else if (newValue && this.type === 3) {
          this.form = this.data

          this.getALLOptions()
          if (!hasValue(this.data.parentId)) {
            // 编辑部门信息，上一级部门为空，则上一级部门为非必填项
            this.rules.parentId[0].required = false
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getCompanyPageList()
    this.sysDeptLeaderReqList = this.data.sysDeptLeaderReqList ?? []
    this.sysDeptLeaderReqListShow = this.data.sysDeptLeaderReqList ?? []
  },
  methods: {
    deleteLeaderItem(item) {
      this.sysDeptLeaderReqListShow = this.sysDeptLeaderReqListShow.filter(
        child => child.leaderId !== item.leaderId
      )
      this.sysDeptLeaderReqList = this.sysDeptLeaderReqListShow
    },
    hasElementAppearedTwice(arr) {
      // 如果数组为空，则返回 false
      if (arr.length === 0) {
        return false
      }

      const elementCountMap = {}
      for (const element of arr) {
        // 如果元素已经在计数映射中，则增加其出现次数，否则将其计数设为1
        elementCountMap[element] = (elementCountMap[element] || 0) + 1
        // 如果某个元素出现次数达到了2次，则返回true
        if (elementCountMap[element] === 2) {
          return true
        }
      }
      // 如果没有任何元素出现了两次，则返回false
      return false
    },
    handleChangeSysDep(val, i, options) {
      const isRepeat = this.form.leaderId === val
      // 判断sysDeptLeaderReqList中是否包含val 如果有则提示部门负责人不能重复添加
      const flag = this.hasElementAppearedTwice(
        this.sysDeptLeaderReqList.map(item => item.leaderId)
      )

      if ((this.sysDeptLeaderReqList.length >= 2 && flag) || isRepeat) {
        this.$message({
          message: '负责人不能重复添加',
          type: 'warning'
        })
        // 当前下拉框置空
        this.sysDeptLeaderReqList.splice(i, 1)
        return
      } else {
        const currOptions = options.find(item => item.userId === val)
        const currDept = this.sysDeptLeaderReqList.find(
          item => item.leaderId === val
        )
        currDept.leader = currOptions.userName
      }
    },

    addLeader() {
      this.sysDeptLeaderReqListShow.push({
        leader: '',
        leaderId: ''
      })
      this.sysDeptLeaderReqList = this.sysDeptLeaderReqListShow
    },
    async getCompanyPageList() {
      const params = {
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await queryCompanyPageList(params)

      if (res) {
        this.companyList = res.data.items.filter(item => item.status === 0)
      }
    },
    send() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.data,
            ...this.form,
            sysDeptLeaderReqList: this.sysDeptLeaderReqList
          }
          this.$emit('success', params)
        } else {
          return false
        }
      })
    },
    // 点击选择上一级部门
    selectDept() {
      const _this = this
      const checkDept = []
      if (_this.form.parentId) {
        checkDept.push({
          name: _this.form.parentName,
          deptId: _this.form.parentId
        })
      }
      this.$AddressBook({
        visible: true,
        multiple: false,
        checkDept,
        checkUserIds: [],
        success: res => {
          console.log(res)
          if (res.dept.length > 0) {
            _this.$set(this.form, 'parentName', res.dept[0].name)
            _this.$set(this.form, 'parentId', res.dept[0].id)
          }
        }
      })
    },
    async remoteMethodleader(query) {
      const res = await userNoPage({ nickName: query })
      this.leaderOptions = res.data
    },
    handleChangeleader(val) {
      const obj = this.leaderOptions.find(item => item.userId === val) || {}

      this.form.leader = obj.nickName
    },
    getALLOptions() {
      this.remoteMethodleader('')
    }
  }
}
</script>

<style lang="scss" scoped>
.leader-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.delete-icon {
  cursor: pointer;
}

.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%),
      0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
  .form_avatar {
    display: flex;
    align-items: center;
    .form_btn {
      height: 30px;
      margin-left: 10px;
    }
  }
  .form_textarea {
    width: 600px;
    margin-right: 10px;
  }
}
.image_poster {
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #dcdcdc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > span {
    margin-top: 13px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 20px;
  }
  &:hover {
    border: 1px dashed #1472ff;
  }
}
.tips {
  // margin-top: 20px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
</style>
