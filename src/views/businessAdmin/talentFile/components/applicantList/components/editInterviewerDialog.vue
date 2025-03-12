<!-- 新增面试 -->
<template>
  <el-dialog
    title="修改面试官"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="post" :model="post" label-width="80px">
      <el-form-item label="面试官" class="form-item">
        <!-- 面试官 -->
        <el-select
          v-model="interviewerIds"
          filterable
          clearable
          placeholder="请选择面试官"
          remote
          multiple
          style="width: 100%"
          :multiple-limit="5"
          :remote-method="remoteMethodInterviewer"
          @change="handleChange"
        >
          <el-option
            v-for="item in interviewerList"
            :key="item.userId"
            :label="`${item.nickName} (${item.deptName})`"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="form-item">
        <span
          >共{{
            info.recruitCandidateInfoList &&
            info.recruitCandidateInfoList.length
          }}名应聘者即将面试</span
        >
        <div class="applicant-list">
          <div
            v-for="(item, index) in info.recruitCandidateInfoList"
            :key="index"
            class="applicant-item"
          >
            <div class="applicant-name">
              <div class="flex1 title">面试人</div>
              <div class="flex1 title">面试时间</div>
            </div>
            <div class="applicant-time">
              <div class="flex1 value">{{ item.name }}</div>
              <div class="flex1 value">
                {{ interviewerTime(item.interviewTime) }}
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <p class="tips">修改后将向面试官发送面试通知</p>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">修 改</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { queryInterviewerInfo } from '@/api/businessAdmin/talentFile'
import { userNoPage } from '@/api/addressBookApi'

import moment from 'moment'

export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      post: {},
      info: {},
      interviewerList: [],
      interviewerIds: []
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
    },
    interviewerTime() {
      return time => moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted() {
    this.post = [...this.row]

    this.getInterviewerInfo()
    this.setAllUserList()
  },
  methods: {
    async remoteMethodInterviewer(query) {
      // status 0 查在职人员
      const res = await userNoPage({ nickName: query, status: 0 })

      this.interviewerList = res.data
    },
    setAllUserList() {
      // 在职的
      userNoPage({ status: 0 }).then(res => {
        if (res.code === 1) {
          this.interviewerList = res.data
        }
      })
    },
    handleChange(val) {
      this.interviewerIds = val
    },
    async getInterviewerInfo() {
      const params = this.row.map(item => item.id)
      const res = await queryInterviewerInfo(params)
      this.info = res.data

      this.interviewerIds = this.info.interviewerInfoList.map(
        item => item.interviewerId
      )
    },

    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.post.validate(valid => {
        if (valid) {
          this.$emit('submit', {
            interviewerIds: this.interviewerIds,
            candidateIds: this.post.map(item => item.id)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
.applicant-list {
  overflow: auto;
  height: 300px;

  .title {
    font-size: 12px;
    color: #636870;
  }
  .value {
    font-size: 14px;
    color: #333333;
  }

  .applicant-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    border-radius: 4px;
    margin-bottom: 8px;
    background-color: #f5f6f7;
    padding: 12px 16px;

    .del-icon {
      cursor: pointer;
      position: absolute;
      right: 20px;
      top: 10px;

      &:hover {
        color: #f56c6c;
      }
    }

    .applicant-name,
    .applicant-time {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      gap: 20px;

      .flex1 {
        flex: 1;
      }
    }
  }
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
.tips {
  display: inline-block;
  margin-right: 15px;
  color: #909399;
  font-size: 14px;
}
</style>
