<template>
  <div class="period_page_wrap">
    <!-- 期数管理 -->
    <el-button type="primary" @click="openAddPeriod">添加期数</el-button>
    <el-table class="m-t-20" :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="action" label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="clickCorpPeriod(row)">复制</el-button>
          <el-button type="text" @click="clickEditPeriod(row)">编辑</el-button>
          <el-button type="text" @click="delPeriod(row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="periodNum" label="期数">
        <template slot-scope="{ row }">
          {{ row.periodNum }}期
        </template>
      </el-table-column>
      <el-table-column prop="autoFlag" label="自动分配">
        <template slot-scope="{ row }">
          <span>
            {{
              {1: '是', 0: '否'}[row.autoFlag]
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间">
        <template slot-scope="{ row }">
          {{ row.startTime | parseTime }}
        </template>
      </el-table-column>
    </el-table>
    <div class="m-t-20 table_footer">
      <div>
        <el-button :disabled="multipleSelection.length === 0" @click="periodAuto(1)">自动分配</el-button>
        <el-button :disabled="multipleSelection.length === 0" @click="periodAuto(0)">取消自动分配</el-button>
      </div>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>

    <appDialog
      v-model="periodDialog.visible"
      :title="periodDialog.title"
      width="600px"
      height="400px"
      :loading="periodDialog.loading"
      @beforeClose="beforeClose"
      @success="successFn"
    >
      <div v-loading="periodDialog.loading" class="periodDialog">
        <el-form ref="form" :model="periodDialog.form" label-width="120px" :rules="rules">
          <el-form-item label="专栏系列期数" prop="periodNum">
            <span v-if="periodDialog.type === 2">
              {{ periodDialog.form.periodNum }}期
            </span>
            <template v-else>
              <el-input
                v-model="periodDialog.form.periodNum"
                class="w-200"
                type="number"
                controls-position="right"
                :min="1"
                :max="999999999999999"
              >
                <span slot="suffix">期</span>
              </el-input>
            </template>
          </el-form-item>
          <el-form-item v-if="periodDialog.type !== 2" label="班级最大人数" prop="maxType">
            <el-radio-group v-model="periodDialog.form.maxType" style="width: 100%" @change="maxTypeChange()">
              <div>
                <el-radio :label="0" style="line-height: 36px">
                  <span>期数最大学员数</span>
                  <el-input-number
                    v-if="periodDialog.form.maxType === 0"
                    v-model="periodDialog.form.studentMaxTotal"
                    :disabled="periodDialog.form.maxType !== 0"
                    class="w-200 m-l-20"
                    controls-position="right"
                    :min="1"
                    :max="999999999999999"
                    :step-strictly="true"
                    :step="1"
                  />
                  <el-tooltip class="item" effect="dark" content="最后一期不受此限制,会超额分配" placement="right-start">
                    <i class="el-icon-warning m-l-10" />
                  </el-tooltip>
                </el-radio>
              </div>
              <div class="m-t-10">
                <el-radio :label="1" style="line-height: 36px">
                  <span>单个班主任最大服务学员数</span>
                  <el-input-number
                    v-if="periodDialog.form.maxType === 1"
                    v-model="periodDialog.form.serveMaxTotal"
                    :disabled="periodDialog.form.maxType !== 1"
                    class="w-200 m-l-20"
                    controls-position="right"
                    :min="1"
                    :max="999999999999999"
                    :step-strictly="true"
                    :step="1"
                  />
                  <el-tooltip class="item" effect="dark" content="最后一期不受此限制,会超额分配" placement="right-start">
                    <i class="el-icon-warning m-l-10" />
                  </el-tooltip>
                </el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="periodDialog.type === 3" label="班主任">
            <el-radio-group v-model="periodDialog.form.copyCoordinator">
              <el-radio :label="1">复制班主任</el-radio>
              <el-radio :label="0">不复制班主任</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="直播开始时间" prop="startTime">
            <el-date-picker
              v-model="periodDialog.form.startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              :picker-options="pickerOptions"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="自动分配">
            <el-checkbox v-model="periodDialog.form.autoFlag" :true-label="1" :false-label="0" />
          </el-form-item>
          <el-form-item label="问卷调查" prop="questionnaireId">
            <el-tag
              v-if="periodDialog.form.questionnaireName"
              class="m-r-10"
              closable
              @close="handleClose"
            >
              {{ periodDialog.form.questionnaireName }}
            </el-tag>
            <el-button size="small" @click="selectQuestionnaire">选择问卷</el-button>
          </el-form-item>
        </el-form>
      </div>
    </appDialog>
  </div>
</template>

<script>
import appDialog from '@/components/AppDialog'
import { parseTime } from '@/utils/index'
import moment from 'moment'
import {
  getPeriodList,
  addPeriod,
  editPeriod,
  periodAuto,
  periodCopy,
  delectPeriod
} from '@/api/course'
export default {
  components: {
    appDialog
  },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      periodDialog: {
        title: '新增',
        visible: false,
        loading: false,
        form: {
          autoFlag: 1,
          goodsId: '',
          periodNum: 1,
          maxType: 0,
          studentMaxTotal: 1,
          serveMaxTotal: 0,
          startTime: '',
          copy: 1
        }
      },
      rules: {
        periodNum: [
          { required: true, message: '请输入专栏系列期数', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '请输入正确的期数' }
        ],
        maxType: [
          { required: true, message: '请选择班级最大人数', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择直播开始时间', trigger: 'blur' }
        ]
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      id: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000
        },
        selectableRange: '00:00:00 - 23:59:59'
      }
    }
  },
  watch: {
    'periodDialog.form.startTime'() {
      this.selectable()
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getList()
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击添加期数弹框
    openAddPeriod() {
      this.periodDialog = {
        title: '新增',
        type: 1,
        visible: true,
        loading: false,
        form: {
          autoFlag: 1,
          goodsId: this.$route.params.id,
          periodNum: '',
          maxType: 0,
          studentMaxTotal: 1,
          serveMaxTotal: 0,
          questionnaireName: '',
          questionnaireId: '',
          startTime: ''
        }
      }
    },
    // 点击编辑期数弹框
    clickEditPeriod(row) {
      console.log(row)
      this.periodDialog = {
        title: '编辑',
        type: 2,
        visible: true,
        loading: false,
        form: {
          goodsId: this.id,
          id: row.id,
          maxType: row.studentMaxTotal > 0 ? 1 : 0,
          studentMaxTotal: row.studentMaxTotal,
          serveMaxTotal: row.serveMaxTotal,
          startTime: parseTime(row.startTime),
          autoFlag: row.autoFlag,
          periodNum: row.periodNum,
          questionnaireId: row.questionnaireId,
          questionnaireName: row.questionnaireName
        }
      }
    },
    // 点击复制期数弹框
    clickCorpPeriod(row) {
      this.periodDialog = {
        title: '复制',
        type: 3,
        visible: true,
        loading: false,
        form: {
          id: row.id,
          periodNum: '',
          copyCoordinator: 1, // 1:是 0 :否
          studentMaxTotal: row.studentMaxTotal,
          maxType: row.studentMaxTotal > row.serveMaxTotal ? 0 : 1,
          serveMaxTotal: row.serveMaxTotal,
          startTime: parseTime(row.startTime),
          autoFlag: row.autoFlag,
          questionnaireId: row.questionnaireId,
          questionnaireName: row.questionnaireName
        }
      }
    },
    // 班级最大人数
    maxTypeChange() {
      if (this.periodDialog.form.maxType === 0) {
        this.periodDialog.form.studentMaxTotal = 1
        this.periodDialog.form.serveMaxTotal = 0
      } else {
        this.periodDialog.form.studentMaxTotal = 1
      }
    },
    // 获取期数列表
    getList() {
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        goodsId: this.id
      }
      this.loading = true
      getPeriodList(params).then(res => {
        this.tableData = res.data.records
        this.total = Number(res.data.total)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    // 弹框关闭前的回调
    beforeClose() {
      this.$refs.form && this.$refs.form.clearValidate()
    },
    // 弹框点击确定按钮触发
    successFn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.periodDialog.type === 1) {
            // 新增
            this.addPeriod()
          } else if (this.periodDialog.type === 2) {
            // 编辑
            this.editPeriod()
          } else if (this.periodDialog.type === 3) {
            // 复制
            this.corpPeriod()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加期数
    addPeriod() {
      this.periodDialog.loading = true
      const data = {
        ...this.periodDialog.form
      }
      if (this.periodDialog.form.maxType === 0) {
        // 期数最大学员数
        // 去掉单个班主任最大服务学员数
        data.serveMaxTotal = 0
      } else {
        // 单个班主任最大服务学员数
        // 去掉期数最大学员数
        data.studentMaxTotal = 0
      }
      addPeriod(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.periodDialog.visible = false
        this.getList()
        this.periodDialog.loading = false
      }).catch(() => {
        this.periodDialog.loading = false
      })
    },
    // 编辑期数
    editPeriod() {
      this.periodDialog.loading = true
      const data = {
        ...this.periodDialog.form
      }
      if (this.periodDialog.form.maxType === 0) {
        // 期数最大学员数
        // 去掉单个班主任最大服务学员数
        data.serveMaxTotal = 0
      } else {
        // 单个班主任最大服务学员数
        // 去掉期数最大学员数
        data.studentMaxTotal = 0
      }
      editPeriod(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.periodDialog.visible = false
        this.getList()
        this.periodDialog.loading = false
      }).catch(() => {
        this.periodDialog.loading = false
      })
    },
    // 复制期数
    corpPeriod() {
      this.periodDialog.loading = true
      const data = {
        ...this.periodDialog.form
      }
      periodCopy(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.periodDialog.visible = false
        this.getList()
        this.periodDialog.loading = false
      }).catch(() => {
        this.periodDialog.loading = false
      })
    },
    // 删除期数
    delPeriod(row) {
      this.$delModal({
        tips: `确定删除${row.periodNum}期吗？`,
        success: () => {
          this.loading = true
          delectPeriod(row.id).then(() => {
            this.currentPage = 1
            this.getList()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 自动分配/取消自动分配
    periodAuto(type) {
      this.$delModal({
        tips: `确定${type === 1 ? '自动分配' : '取消自动分配'}这${this.multipleSelection.length}期吗？`,
        success: () => {
          this.loading = true
          const ids = []
          this.multipleSelection.map(v => {
            ids.push(v.id)
          })
          const data = {
            autoFlag: type,
            goodsId: this.id,
            ids
          }
          periodAuto(data).then(() => {
            this.getList()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 点击选择问卷
    selectQuestionnaire() {
      this.$Select({
        type: 'questionnaire',
        visible: true,
        multiple: false,
        params: { status: 1, validType: 2 },
        success: (res) => {
          console.log(res)
          this.periodDialog.form.questionnaireName = res.questionnaireName
          this.periodDialog.form.questionnaireId = res.id
        }
      })
    },
    // 删除选择的问卷
    handleClose() {
      this.periodDialog.form.questionnaireName = ''
      this.periodDialog.form.questionnaireId = ''
    },
    // 可选的时间范围
    selectable() {
      const date = moment(this.periodDialog.form.startTime).startOf('day').format('x')
      const nowDate = moment().startOf('day').format('x')
      // 如果选择的是今天 则需要禁用已经过去的时间节点
      if (date <= nowDate) {
        // 默认选择的最新时间 是当前时间的两分钟后 （留出2分钟的富裕时间）
        this.pickerOptions.selectableRange = (
          `${moment().add(2, 'minutes').format('HH:mm:ss')} - 23:59:59`
        )
      // eslint-disable-next-line brace-style
      }
      // 如果是以后的日期，则不需要禁用时间节点
      else {
        this.pickerOptions.selectableRange = '00:00:00 - 23:59:59'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.periodDialog {
  padding: 20px;
}
.table_footer {
  display: flex;
  justify-content: space-between;
}
</style>
