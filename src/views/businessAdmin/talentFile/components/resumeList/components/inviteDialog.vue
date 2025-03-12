<!-- 新增面试 -->
<template>
  <el-dialog
    title="邀约信息"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="postRef" :model="post" :rules="rules" label-width="80px">
      <el-form-item label="姓名" class="form-item">
        <!-- 姓名 -->
        <span>{{ post.name }}</span>
      </el-form-item>
      <el-form-item label="手机号" class="form-item">
        <!-- 手机 -->
        <!-- <span>{{ post.phone }}</span> -->
        <watchPhone
          :default-value="post.phone"
          :params="post"
          :user-id="post.personnelBaseInfoId"
        />
      </el-form-item>
      <el-form-item label="面试时间" class="form-item" prop="interviewTime">
        <!-- 手机 -->
        <el-date-picker
          v-model="post.interviewTime"
          type="datetime"
          placeholder="选择日期时间"
          style="width: 100% !important"
          value-format="timestamp"
        />
      </el-form-item>
      <el-form-item label="面试官" class="form-item" prop="interviewerIds">
        <el-select
          v-model="post.interviewerIds"
          filterable
          clearable
          placeholder="请选择面试官"
          remote
          multiple
          style="width: 100%"
          :multiple-limit="5"
          :remote-method="remoteMethodInterviewer"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="`${item.nickName} (${item.deptName})`"
            :value="item.userId"
          />
        </el-select>
        <!-- <el-select
          v-model="post.interviewerIds"
          class="w-200"
          style="width: 100% !important"
          placeholder="请选择面试官"
          filterable
          multiple
          :multiple-limit="5"
          :filter-method="getUserByName"
          clearable
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          >
            <span style="float: left">{{ item.nickName }}</span>
            <span
              v-if="item.status === 1"
              style="float: right; color: #f53f3f; font-size: 13px"
            >
              已离职
            </span>
          </el-option>
        </el-select> -->
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <p class="tips">确定后将向面试官发送面试通知</p>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { userNoPage } from '@/api/addressBookApi'
import WatchPhone from './watchPhone.vue'
export default {
  components: {
    WatchPhone
  },
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      userList: [],
      post: {},
      rules: {
        interviewerIds: [
          {
            required: true,
            message: '请选择面试官',
            trigger: 'change'
          }
        ],
        interviewTime: [
          {
            required: true,
            message: '请选择面试时间',
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              const todayTimestamp = new Date().setHours(0, 0, 0, 0)

              if (value < todayTimestamp) {
                callback(new Error('只能选中大于今天的日期'))
              }
              callback()
            }
          }
        ]
      }
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  created() {
    this.getUserByName()
    if (this.row.id) {
      this.post = { ...this.row }
    }
    this.setAllUserList()
  },
  methods: {
    async remoteMethodInterviewer(query) {
      // status 0 查在职人员
      const res = await userNoPage({ nickName: query, status: 0 })

      this.userList = res.data
    },
    setAllUserList() {
      // 在职的
      userNoPage({ status: 0 }).then(res => {
        if (res.code === 1) {
          this.userList = res.data
        }
      })
    },
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.postRef.validate(valid => {
        if (valid) {
          this.$emit('submit', {
            ...this.post
          })
        }
      })
    },
    getUserByName(val) {
      return new Promise((resolve, reject) => {
        const params = {
          nickName: val
        }
        userNoPage(params)
          .then(res => {
            resolve()
            if (res.code === 1) {
              this.userList = res.data
            }
          })
          .catch(() => {
            reject()
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}

::v-deep .el-dialog__title {
  font-size: 16px;
  font-weight: 500;
}

::v-deep .el-form-item {
  margin-bottom: 15px;
}
.dialog-footer {
  text-align: right;
}
.el-textarea__inner::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.el-textarea__inner::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}
.el-textarea__inner::-webkit-scrollbar-track {
  background-color: transparent;
}

.innerbox {
  max-height: 150px;
  overflow: auto;
}

// 滚动条整体样式
.innerbox::-webkit-scrollbar {
  width: 6px;
}
// 滚动条内嵌滑块
.innerbox::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
// 滚动条边角
.innerbox::-webkit-scrollbar-corner {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
.tips{
  display: inline-block;
  margin-right: 15px;
  color: #909399;
  font-size: 14px;
}
</style>
