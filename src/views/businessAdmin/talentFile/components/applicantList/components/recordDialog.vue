<!-- 新增面试 -->
<template>
  <el-dialog
    title="面试记录"
    :visible.sync="visible"
    width="70%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="content-wrapper">
      <el-form
        ref="post"
        class="forms"
        :model="post"
        :rules="rules"
        label-width="110px"
      >
        <div>
          <div style="padding: 0 20px">
            <div class="title">新增面试记录</div>
            <el-form-item label="应聘人员" class="form-item" prop="name">
              <div>{{ row.name }}</div>
            </el-form-item>
            <el-form-item
              key="interviewerId"
              label="面试官"
              class="form-item"
              prop="interviewerId"
            >
              <!-- 面试官 -->
              <el-select
                key="interviewerId"
                v-model="post.interviewerId"
                filterable
                clearable
                placeholder="请选择面试官"
                remote
                style="width: 100%"
                :remote-method="remoteMethodInterviewer"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="`${item.nickName} (${item.deptName})`"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="面试结果"
              class="form-item"
              prop="interviewResult"
            >
              <!-- 面试结果 -->
              <el-radio-group
                key="interviewResult"
                v-model="post.interviewResult"
              >
                <el-radio :label="1">录用</el-radio>
                <el-radio :label="2">待定</el-radio>
                <el-radio :label="3">淘汰</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <template v-if="post.interviewResult === 1">
              <el-form-item
                key="probationSalary"
                label="试用期薪资"
                class="form-item"
                prop="probationSalary"
              >
                <el-input-number
                  key="probationSalary"
                  v-model="post.probationSalary"
                  :min="0"
                  :controls="false"
                  :precision="2"
                  style="width: 100%"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                key="formalSalary"
                label="约定转正薪资"
                class="form-item"
                prop="formalSalary"
              >
                <el-select
                  key="formalSalary"
                  v-model="post.salaryType"
                  style="width: 100%"
                >
                  <el-option value="1" label="已确认的固定薪资" />
                  <el-option value="2" label="待确认的薪资范围" />
                </el-select>
              </el-form-item>
              <el-form-item
                key="formalSalary"
                class="form-item"
                prop="formalSalary"
              >
                <el-input-number
                  v-if="post.salaryType === '1'"
                  key="formalSalary"
                  v-model="post.formalSalary"
                  :min="0"
                  :controls="false"
                  :precision="2"
                  style="width: 100%"
                  placeholder="请输入"
                />
                <div
                  v-else
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                  "
                >
                  <el-input-number
                    key="formalSalary"
                    v-model="post.formalSalary"
                    :min="0"
                    :controls="false"
                    :precision="2"
                    placeholder="请输入"
                  />
                  <div style="width: 80px">元 至</div>
                  <el-input-number
                    key="formalSalaryMax"
                    v-model="post.formalSalaryMax"
                    :min="0"
                    :controls="false"
                    :precision="2"
                    placeholder="请输入"
                  />
                </div>
              </el-form-item>
              <el-form-item
                key="entryTime"
                label="预计入职时间"
                class="form-item"
                prop="entryTime"
              >
                <el-date-picker
                  key="entryTime"
                  v-model="post.entryTime"
                  value-format="timestamp"
                  type="date"
                  placeholder="选择日期时间"
                  style="width: 100% !important"
                />
              </el-form-item>
              <el-form-item
                label="入职公司"
                class="form-item"
                prop="entryCompanyId"
              >
                <!-- 入职公司 -->
                <el-select
                  v-model="post.entryCompanyId"
                  clearable
                  filterable
                  placeholder="请选择入职公司"
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
              <el-form-item
                label="入职部门"
                class="form-item"
                style="width: 100%"
                prop="entryDepartmentId"
              >
                <!-- 入职部门 -->
                <el-cascader
                  v-model="post.entryDepartmentId"
                  style="width: 100%"
                  placeholder="请选择入职部门"
                  :options="deptOptions"
                  :props="{ checkStrictly: true, emitPath: false }"
                  clearable
                  @change="handleChange"
                />
              </el-form-item>
              <el-form-item label="岗位" class="form-item" prop="positionId">
                <!-- 岗位 -->
                <el-select
                  key="positionId"
                  v-model="post.positionId"
                  clearable
                  filterable
                  placeholder="请选择岗位"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in jobList"
                    :key="item.jobId"
                    :label="item.jobName"
                    :value="item.jobId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                key="remark1"
                label="备注"
                class="form-item"
                prop="remark"
              >
                <el-input
                  key="remark1"
                  v-model="post.remark"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  resize="none"
                  maxlength="100"
                  show-word-limit
                  placeholder="请输入备注"
                />
              </el-form-item>
            </template>
            <template v-if="post.interviewResult === 2">
              <el-form-item
                key="evaluation"
                label="评价"
                class="form-item"
                prop="evaluation"
              >
                <el-input
                  key="evaluation"
                  v-model="post.evaluation"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  maxlength="100"
                  show-word-limit
                  type="textarea"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </template>
            <template v-if="post.interviewResult === 3">
              <el-form-item
                key="personnelInfoMoveIn"
                label="人员信息移入"
                prop="personnelInfoMoveIn"
                class="form-item"
              >
                <!-- 人员信息移入 -->
                <el-radio-group
                  key="personnelInfoMoveIn"
                  v-model="post.personnelInfoMoveIn"
                >
                  <el-radio :label="1">简历库</el-radio>
                  <el-radio :label="2">黑名单</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 评价 -->
              <el-form-item
                key="evaluation2"
                label="评价"
                class="form-item"
                prop="evaluation"
              >
                <el-input
                  key="evaluation2"
                  v-model="post.evaluation"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  maxlength="100"
                  show-word-limit
                  type="textarea"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </template>
          </div>
        </div>

        <div class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button
            v-if="post.interviewResult === 1"
            type="primary"
            @click="submit"
          >发送录用申请</el-button>
          <el-button v-else type="primary" @click="submit">确 定</el-button>
        </div>
      </el-form>
      <div class="divider" />
      <div class="interview-history">
        <div style="width: 100%; padding: 0 20px">
          <div class="title">历史面试记录</div>
          <el-card
            v-for="(item, index) in historyList"
            :key="index"
            class="box-card"
            shadow="never"
          >
            <el-form class="history-form" label-width="110px">
              <template v-if="item.interviewResult === 1">
                <el-form-item label="发起录用人" class="form-item">
                  <div>{{ item.interviewerName }}</div>
                </el-form-item>
                <el-form-item
                  label="面试结果"
                  class="form-item"
                  :style="interviewResultStyleMap[item.interviewResult]"
                >
                  <div>{{ interviewResultMap[item.interviewResult] }}</div>
                </el-form-item>
                <el-form-item label="试用期薪资" class="form-item">
                  <div>{{ toFixedTwo(item.probationSalary) }}</div>
                </el-form-item>
                <el-form-item label="转正薪资" class="form-item">
                  <span>
                    {{ toFixedTwo(item.agreedRegularSalary) }}
                  </span>
                  <span v-if="item.agreedRegularSalaryMax">
                    {{ '-' + toFixedTwo(item.agreedRegularSalaryMax) }}
                  </span>
                </el-form-item>
                <el-form-item label="预计入职日期" class="form-item">
                  <div>
                    {{
                      item.expectedEntryTime
                        ? getTime(item.expectedEntryTime, 'YYYY-MM-DD')
                        : ''
                    }}
                  </div>
                </el-form-item>
                <el-form-item label="入职公司" class="form-item">
                  <div>{{ item.entryCompanyName }}</div>
                </el-form-item>
                <el-form-item label="入职部门" class="form-item">
                  <div>{{ item.entryDepartmentName }}</div>
                </el-form-item>
                <el-form-item label="岗位" class="form-item">
                  <div>{{ item.positionName }}</div>
                </el-form-item>
                <el-form-item label="发起时间" class="form-item">
                  <div>{{ getTime(item.evaluationTime) }}</div>
                </el-form-item>
                <el-form-item label="备注" class="form-item">
                  <div>{{ item.remark }}</div>
                </el-form-item>
              </template>

              <template
                v-if="item.interviewResult === 2 || item.interviewResult === 3"
              >
                <el-form-item label="面试官" class="form-item">
                  <div>{{ item.interviewerName }}</div>
                </el-form-item>
                <el-form-item label="面试建议" class="form-item">
                  <div :style="interviewResultStyleMap[item.interviewResult]">
                    {{ interviewResultMap[item.interviewResult] }}
                  </div>
                </el-form-item>
                <el-form-item label="建议薪资" class="form-item">
                  <span>
                    {{ toFixedTwo(item.suggestedSalary) }}
                  </span>
                  <span v-if="item.suggestedSalaryMax">
                    {{ '-' + toFixedTwo(item.suggestedSalaryMax) }}
                  </span>
                </el-form-item>
                <el-form-item label="评价" class="form-item">
                  <p>
                    {{ item.evaluation }}
                  </p>
                </el-form-item>
                <el-form-item label="评价时间" class="form-item">
                  <div>
                    {{ getTime(item.evaluationTime) }}
                  </div>
                </el-form-item>
              </template>
            </el-form>
          </el-card>
        </div>

        <div v-if="historyList.length === 0" class="no-record">
          暂无面试记录~
        </div>

        <el-pagination
          class="pagination"
          :current-page="config.currentPage"
          :page-sizes="config.pageSizes"
          :page-size="config.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="config.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  querySubjectList,
  queryInterviewRecordPageList
} from '@/api/businessAdmin/talentFile'
import { getDeptData } from '@/utils/getApiData'
import { jobNoPageList } from '@/views/system/positionManagement/api/job'
import moment from 'moment'
import { userNoPage } from '@/api/addressBookApi'

export default {
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
      userId: '',
      userList: [],
      post: {},
      rules: {
        interviewResult: [
          {
            required: true,
            message: '请选择面试结果',
            trigger: 'change'
          }
        ],
        probationSalary: [
          {
            required: true,
            message: '请输入试用期薪资',
            trigger: 'blur'
          }
        ],
        interviewerId: [
          {
            required: true,
            message: '请选择面试官',
            trigger: 'change'
          }
        ],
        evaluation: [
          {
            required: true,
            message: '请输入评价',
            trigger: 'blur'
          }
        ],
        formalSalary: [
          {
            required: true,
            message: '请输入约定转正薪资薪资',
            trigger: 'blur'
          }
        ],
        formalSalaryMax: [
          {
            required: true,
            message: '请输入约定转正薪资最大值',
            trigger: 'blur'
          }
        ],
        entryTime: [
          {
            required: true,
            message: '请选择岗位',
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
        ],
        entryCompanyId: [
          {
            required: true,
            message: '请选择入职公司',
            trigger: 'change'
          }
        ],
        entryDepartmentId: [
          {
            required: true,
            message: '请选择入职部门',
            trigger: 'change'
          }
        ],
        personnelInfoMoveIn: [
          {
            required: true,
            message: '请选择人员信息移入',
            trigger: 'change'
          }
        ],
        positionId: [
          {
            required: true,
            message: '请选择岗位',
            trigger: 'change'
          }
        ]
      },
      config: {
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      interviewResultMap: {
        1: '录用',
        2: '待定',
        3: '淘汰'
      },
      interviewResultStyleMap: {
        1: { color: '#00b42a' },
        2: { color: '#00b42a' },
        3: { color: '#ED1B24' }
      },
      fileList: [],
      jobList: [],
      deptOptions: [],
      interviewerList: [],
      historyList: [],
      currentPage: 1,
      companyId: ''
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
  async mounted() {
    const res = await this.getJobList()

    if (res.some(item => item.jobId === +this.row.positionId)) {
      if (this.row.id) {
        this.post = { ...this.row, positionId: +this.row.positionId }
      }
    } else {
      if (this.row.id) {
        this.post = { ...this.row, positionId: '' }
      }
    }

    await this.getJobList()
    await this.getCompanyPageList()
    // await this.getUserList()
    await this.getInterviewRecordPageList()
    this.setAllUserList()
    this.getDeptData()

    this.userId = this.$store.getters.userInfo.userId
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
    async getUserList() {
      const res = await userNoPage()

      this.userList = res.data.flat()
    },
    interviewerChange(val) {
      if (val === this.hrbpId) {
        this.isHrbp = true
      } else {
        this.isHrbp = false
      }
    },

    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getInterviewRecordPageList()
    },
    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getInterviewRecordPageList()
    },
    async getInterviewRecordPageList() {
      const params = {
        personnelBaseInfoId: this.row.personnelBaseInfoId,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      const res = await queryInterviewRecordPageList(params)

      if (res) {
        this.historyList = res.data.items
        this.config.total = res.data.total
      }
    },
    handleChange(data) {
      if (!data) return
      this.getTreeLabelById(this.deptOptions, data)
    },
    getTreeLabelById(data, id) {
      data.forEach(i => {
        if (i.value === id) {
          this.form.deptName = i.label
        }
        if (i.children && i.children.length) {
          this.getTreeLabelById(i.children, id)
        }
      })
    },
    getTime(val, type = 'YYYY-MM-DD HH:mm:ss') {
      return moment(val).format(type)
    },
    async getCompanyPageList() {
      const params = {
        pageIndex: 1,
        pageSize: 1000
      }

      querySubjectList(params)
        .then(res => {
          this.loading = false
          if (res.code === 1) {
            this.companyList = res.data.items.filter(item => item.status === 0)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    async getDeptData() {
      const res = await getDeptData()
      this.deptOptions = res
    },

    getTreeData(data, config = { label: 'label', value: 'value' }) {
      data.forEach(i => {
        i.label = i[config.label]
        i.value = i[config.value]
        if (i.children && i.children.length) {
          this.getTreeData(i.children, config)
        } else {
          i.children = null
        }
      })
      return data
    },

    async getJobList() {
      const res = await jobNoPageList()

      this.jobList = res.data
      return this.jobList
    },
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.post.validate(valid => {
        if (valid) {
          this.$emit('submit', {
            candidateId: this.row.id,
            entryCompanyId: this.post.entryCompanyId,
            entryDepartmentId: this.post.entryDepartmentId,
            entryTime: this.post.entryTime,
            evaluation: this.post.evaluation,
            formalSalary: +this.post.formalSalary,
            formalSalaryMax: this.post.formalSalaryMax
              ? +this.post.formalSalaryMax
              : undefined,
            interviewResult: this.post.interviewResult,
            interviewerId: this.post.interviewerId,
            personnelInfoMoveIn: this.post.personnelInfoMoveIn,
            positionId: this.post.positionId,
            probationSalary: +this.post.probationSalary,
            remark: this.post.remark,
            salaryType: +this.post.salaryType
          })
        }
      })
    },
    toFixedTwo(num) {
      return num ? `${num.toFixed(2)}元` : ''
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

::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

.divider {
  width: 1px;
  background-color: #dcdfe6;
  height: 550px;
}

.dialog-footer {
  text-align: right;
}
.pagination {
  width: 100%;
  text-align: right;
}
.content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .forms,
  .interview-history {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 600px;
    overflow: auto;

    .title {
      font-size: 16px;
      margin-bottom: 30px;
      padding: 0 10px;
    }

    .no-record {
      font-size: 16px;
      text-align: center;
      width: 100%;
    }

    .box-card {
      margin-bottom: 10px;
    }
  }

  .interview-history {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
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
</style>
