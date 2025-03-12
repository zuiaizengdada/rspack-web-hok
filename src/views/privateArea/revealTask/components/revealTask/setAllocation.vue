<template>
  <div class="warpBox">
    <div class="contentBox">
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分配模式" prop="allocationType">
          <el-checkbox-group
            v-model="form.allocationType"
            @change="handleAllocationType"
          >
            <el-checkbox key="1" label="1" :true-label="2" false-label="">
              依次分配</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label=" 接待员工" prop="name" />
      </el-form>
      <div class="headBox">
        <div>
          <div>员工名称</div>
          <el-input
            v-model="userName"
            class="inputBox"
            placeholder="请输入"
            size="mini"
          />
          <el-button
            type="primary"
            size="mini"
            @click="handleSearch"
          >查询</el-button>
          <el-button size="mini" @click="handleReset">重置</el-button>
        </div>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="handleAdd"
        >新增</el-button>
      </div>
      <dynamicTable
        ref="table"
        v-model="tableData"
        style="height: 550px"
        :columns="columns"
        :get-list-api="getList"
      >
        <template #sort="{ row }">
          <el-input-number
            v-model="row.sort"
            :controls="false"
            :min="0"
            class="inputBox"
            placeholder="请输入"
            size="mini"
            @blur="handleBlur(row)"
          />
        </template>
        <template #clueNum="{ row }">
          <el-input-number
            v-model="row.clueNum"
            :controls="false"
            :min="1"
            :max="300"
            class="inputBox"
            placeholder="请输入"
            size="mini"
            @blur="handleBlur(row)"
          />
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-button
            type="text"
            :loading="loading"
            @click="handleClickEdit(row)"
          >移出</el-button>
        </template>
      </dynamicTable>
    </div>
    <div class="btnBox">
      <el-button size="mini" @click="handleStop(1)">上一步</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handleStop(3)"
      >下一步</el-button>
    </div>
    <addUserModal ref="addUserModal" @success="handleSuccess" />
  </div>
</template>
<script>
import dynamicTable from '@/components/DynamicTable/table'
import {
  getReceptionStaffPage,
  deleteGoodsTypeTaskStaff,
  setStaffChangeSort
} from '@/api/privateArea/revealTask'
import addUserModal from './addUserModal'
export default {
  components: {
    dynamicTable,
    addUserModal
  },
  props: {
    form: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Object,
      default: () => ({
        goodsType: ''
      })
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      userName: '',
      taskId: '',
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      checked: true,
      tableData: [],
      columns: [
        { prop: 'deptName', label: '部门', type: 'text', width: 250 },
        { prop: 'userName', label: '员工姓名', type: 'text' },
        { prop: 'sort', label: '排序值', type: 'slot' },
        { prop: 'clueNum', label: '每轮分配线索数量', type: 'slot' },
        { prop: 'action', label: '操作', type: 'slot', width: 100 }
      ],
      goodsId: '',
      ruleForm: {
        name: ''
      },
      rules: {
        allocationType: [
          {
            required: true,
            message: '请选择分配模式',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.userName = ''
      this.$refs.table.onRefresh()
    },
    async handleBlur(row) {
      const { code } = await setStaffChangeSort({
        id: row.id,
        sort: row.sort,
        clueNum: row.clueNum
      })
      if (code === 1) {
        this.$message.success('修改成功！')
        this.handleSearch()
      }
    },
    async handleClickEdit(row) {
      if (this.page.pageIndex === 1 && this.tableData?.length <= 1) {
        return this.$message.warning('必须有一位接待员工！')
      }
      this.loading = true
      try {
        const { code } = await deleteGoodsTypeTaskStaff({ id: row.id })
        if (code === 1) {
          this.$message.success('删除成功!')
          this.handleSearch()
        }
        this.loading = false
      } catch {
        this.loading = false
      }
    },
    handleSearch() {
      this.$refs.table.onRefresh()
    },
    handleReset() {
      this.userName = ''
      this.$refs.table.onRefresh()
    },
    async handleStop(value) {
      if (value === 3) {
        await this.$refs.ruleForm.validate()
      }
      if (value === 3) {
        const { data } = await getReceptionStaffPage({
          pageIndex: 1,
          pageSize: 10,
          taskId: this.data?.taskId || this.taskId
        })
        if (!data.total) {
          return this.$message.error('请添加接待人员！')
        }
      }
      this.$emit('handleStop', value)
    },
    handleAdd() {
      this.$refs.addUserModal.open(this.data)
    },
    handleAllocationType() {
      this.$emit('update:form', this.form)
    },
    handleSuccess(value) {
      if (value) {
        this.taskId = value
        this.$emit('update:form', {
          ...this.form,
          receptionStaffTempTaskId: value
        })
        this.data.taskId = value
      }

      this.$refs.table.onRefresh()
    },
    async getList(params) {
      this.page = params
      return getReceptionStaffPage({
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        userName: this.userName,
        taskId: this.data?.taskId || this.taskId
      }).then(res => {
        this.tableData = res.data.items || []
        return res
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.warpBox {
  width: 100%;
  height: calc(100vh - 105px);
  // overflow: scroll;
  display: flex;
  flex-direction: column;
  > .contentBox {
    flex: 1;
    padding: 0 20px;
    padding-bottom: 40px;
    overflow: scroll;
    > .headBox {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      margin-top: -20px;
      // margin-bottom: -10px;
      > div:nth-of-type(1) {
        display: flex;
        align-items: center;
        .inputBox {
          width: 200px;
          margin-right: 20px;
        }
        > div:nth-of-type(1) {
          font-size: 14px;
          color: #333333;
          width: 70px;
          line-height: 22px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
    }
    .enabledBox {
      display: flex;
      align-items: center;
      .textContent {
        margin-left: 10px;
      }
    }
    .cardBox {
      background: #fafafa;
      border-radius: 8px;
      display: flex;
      padding: 12px;
      > div:nth-of-type(1) {
        flex: 1;
        margin-right: 22px;
      }
    }
  }
  > .btnBox {
    display: flex;
    padding: 17px 0;
    padding-right: 20px;
    border-top: 1px solid #e7e7e7;
    justify-content: flex-end;
  }
}
</style>
