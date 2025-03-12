<template>
  <div class="page_wrap">
    <!-- 班主任管理 -->
    <div class="header_search">
      <div>
        <el-button size="small" @click="openAddModel()">新增</el-button>
      </div>
      <div>
        <el-button size="small" @click="periodChange">
          {{ search.period.periodNum ? `${search.period.periodNum}期` : '选择期数' }}
        </el-button>
        <el-input
          v-model.trim="search.text.value"
          size="small"
          placeholder="请输入"
          class="w-300 m-l-20"
          clearable
          @keyup.enter.native="init"
          @clear="init"
        >
          <el-select slot="prepend" v-model="search.text.label" size="small" placeholder="请选择" class="w-100">
            <el-option label="姓名" value="nickName" />
            <el-option label="账号" value="userName" />
            <el-option label="手机号" value="phoneNumber" />
          </el-select>
          <!-- <el-button slot="append" type="primary">查询</el-button> -->
        </el-input>
        <el-button class="m-l-20" size="small" @click="clear">清空</el-button>
        <el-button type="primary" class="m-l-20" size="small" @click="init">查询</el-button>
      </div>
    </div>
    <el-table class="m-t-20" :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="periodNum" label="期数">
        <template slot-scope="{ row }"> {{ row.periodNum || '-' }}期 </template>
      </el-table-column>
      <el-table-column prop="deptName" label="部门" />
      <el-table-column prop="nickName" label="姓名" />
      <el-table-column prop="userName" label="账号" />
      <el-table-column prop="phoneNumber" label="手机号" />
      <el-table-column prop="status" label="在职状态">
        <template slot-scope="{ row }">
          <AppStatus :status="{ 0: 'success', 1: 'error' }[row.status]">
            {{ { 0: '在职', 1: '离职' }[row.status] }}
          </AppStatus>
        </template>
      </el-table-column>
    </el-table>
    <div class="m-t-10 footer">
      <div>
        <el-button size="small" type="danger" :disabled="multipleSelection.length === 0" @click="del">删除</el-button>
      </div>
      <el-pagination
        :current-page.sync="current"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <appDialog v-model="dialog.visible" title="新增" width="500px" height="300px" @success="successFn">
      <div v-loading="dialog.loading" class="Dialog overflowOuto">
        <el-form ref="form" :model="dialog.form" label-width="80px" :rules="rule">
          <el-form-item label="期数" prop="periodNum">
            <el-button size="small" @click="selectPeriod">
              {{ dialog.form.periodNum ? `${dialog.form.periodNum}期` : '选择' }}
            </el-button>
            <!-- <el-input v-model="dialog.form.period" /> -->
          </el-form-item>
          <el-form-item label="人员" prop="user">
            <!-- <el-tag v-for="(tag, index) in dialog.form.user" :key="index" class="m-r-10 m-b-10" closable @close="handleClose(tag.userId)">
              {{ tag.nickName }}
            </el-tag>
            <el-button size="mini" @click="selectUser">选择人员</el-button> -->
            <el-select v-model="dialog.form.user" multiple placeholder="请选择">
              <el-option v-for="item in teacherArr" :key="item.value" :label="item.name" :value="item.hokUserId" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </appDialog>
  </div>
</template>

<script>
import appDialog from '@/components/AppDialog'
import AppStatus from '@/components/AppStatus'
import { getHeadTeacherPage, addHeadTeacherBatch, delHeadTeacherBatch, getTeacherPage } from '@/api/course'
export default {
  components: {
    appDialog,
    AppStatus
  },
  data() {
    return {
      search: {
        period: { id: '', periodNum: '' }, // 期数
        text: { label: 'nickName', value: '' }
      },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      multipleSelection: [],
      dialog: {
        visible: false,
        loading: true,
        form: {
          periodNum: '',
          livePeriodId: '',
          user: []
        }
      },
      rule: {
        periodNum: [{ required: true, message: '请选择期数', trigger: 'blur' }],
        user: [{ required: true, message: '请选人员', trigger: 'blur', type: 'array' }]
      },
      teacherArr: []
    }
  },
  mounted() {},
  created() {
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    openAddModel() {
      this.dialog = {
        visible: true,
        loading: false,
        form: {
          periodNum: this.search.period.periodNum,
          livePeriodId: this.search.period.id,
          user: []
        }
      }
      this.getTeacher()
    },
    // 选择人员
    selectUser() {
      // this.dialog.form.user
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkDept: [],
        checkUser: this.dialog.form.user,
        success: (res) => {
          console.log(res, 'res')
          this.dialog.form.user = res.user
          this.$refs.form.validateField('user')
        }
      })
    },
    // 新增弹框选择期数
    selectPeriod() {
      this.$Select({
        type: 'period',
        visible: true,
        multiple: false,
        params: { goodsId: this.$route.params.id },
        success: (res) => {
          console.log(res)
          this.$set(this.dialog.form, 'livePeriodId', res.id)
          this.$set(this.dialog.form, 'periodNum', res.periodNum)
          this.$refs.form.validateField('periodNum')
        }
      })
    },
    // 筛选条件处选择期数
    periodChange() {
      this.$Select({
        type: 'period',
        visible: true,
        multiple: false,
        params: { goodsId: this.$route.params.id },
        success: (res) => {
          console.log(res)
          this.search.period = res
          this.current = 1
          this.getList()
        }
      })
    },
    // 点击移出弹框中的班主任
    handleClose(userId) {
      const index = this.dialog.form.user.findIndex((v) => v.userId === userId)
      this.dialog.form.user.splice(index, 1)
    },
    // 分页查询班主任列表
    getList() {
      this.loading = true
      const params = {
        current: this.current,
        size: this.pageSize,
        goodsId: this.$route.params.id,
        livePeriodId: this.search.period.id,
        // headTeacherType: 1,
        [this.search.text.label]: this.search.text.value
      }
      getHeadTeacherPage(params)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 添加班主任
    add() {
      this.loading = true
      const reqList = []
      this.dialog.form.user.map((v) => {
        reqList.push({
          livePeriodId: this.dialog.form.livePeriodId,
          userId: v
        })
      })
      const data = {
        goodsId: this.$route.params.id,
        reqList
      }
      addHeadTeacherBatch(data)
        .then((res) => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.search.period.id = this.dialog.form.livePeriodId
          this.search.period.periodNum = this.dialog.form.periodNum
          this.dialog.visible = false
          this.getList()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击弹框确定按钮
    successFn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.add()
        } else {
          return false
        }
      })
    },
    init() {
      this.current = 1
      this.getList()
    },
    // 清空筛选条件
    clear() {
      this.search = {
        period: { id: '', periodNum: '' }, // 期数
        text: { label: 'nickName', value: '' }
      }
      this.init()
    },
    // 分页切换
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    // 点击批量删除按钮
    del() {
      this.$delModal({
        tips: `确定删除这${this.multipleSelection.length}个班主任?`,
        success: () => {
          this.loading = true
          const teacherPeriodReqs = []
          this.multipleSelection.map((v) => {
            teacherPeriodReqs.push({
              id: v.id,
              livePeriodId: v.livePeriodId
            })
          })
          const data = {
            goodsId: this.$route.params.id,
            teacherPeriodReqs
            // livePeriodId:
          }
          delHeadTeacherBatch(data)
            .then((res) => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
              this.getList()
            })
        }
      })
    },
    // 获取班主任列表数据
    getTeacher() {
      this.dialog.loading = true
      const params = {
        likeHokUserFlag: '',
        headTeacherFlag: 2,
        customServiceFlag: '',
        wxRobotStatus: '',
        wxInServiceFlag: 2,
        hokInServiceFlag: 2,
        current: 1,
        headTeacherType: 1,
        size: 9999999
      }
      getTeacherPage(params)
        .then((res) => {
          console.log(res, 'res')
          this.teacherArr = res.data.records
          this.dialog.loading = false
        })
        .catch(() => {
          this.dialog.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  .header_search {
    display: flex;
    justify-content: space-between;
  }
  .footer {
    display: flex;
    justify-content: space-between;
  }
}
.Dialog {
  width: 500px;
  height: 300px;
  padding: 10px;
}
</style>
