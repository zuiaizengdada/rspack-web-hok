<template>
  <div class="interior-container">
    <div class="form">
      <div class="form-item" style="margin-bottom: 10px">
        <div class="title">兜底分配模式：</div>
        <el-radio-group v-model="form.tabs">
          <el-radio :label="1">商品类型</el-radio>
          <el-radio :label="2">团队</el-radio>
        </el-radio-group>
      </div>
      <div class="form-item" style="margin-bottom: 10px">
        <div class="title">兜底分配状态：</div>
        <div>
          <span
            style="margin: 0 15px; color: #ff3232"
            :class="{ success: form.tabs === form.type }"
          >{{ form.tabs === form.type ? '开启' : '未开启' }}</span>
          <el-button
            v-if="form.tabs !== form.type"
            type="primary"
            size="mini"
            @click="handleChange"
          >开启</el-button>
        </div>
      </div>
    </div>
    <transition-group name="el-fade-in">
      <dynamicTable
        v-show="form.tabs === 1 && !isShow"
        key="1"
        ref="table"
        v-model="tableData"
        style="height: 540px"
        :hide-pagination="true"
        :columns="columns"
        :get-list-api="getList"
      >
        <template slot="action" slot-scope="{ row }">
          <el-button type="text" @click="handleClickEdit(row)">编辑</el-button>
        </template>
      </dynamicTable>
      <div v-show="form.tabs === 2 && isShow" key="2" class="table-box">
        <div class="form-item">
          <div class="title">订单来源团队：</div>
          <div class="flex flex-1">
            <el-cascader
              v-model="form.deptId"
              size="mini"
              placeholder="请选择使用部门"
              :options="deptTreeArray"
              :props="{ emitPath: false, checkStrictly: true }"
              clearable
              @change="onRefresh"
            />
            <div class="form-item__btn">
              <el-button type="primary" size="mini" @click="onRefresh">
                查询
              </el-button>
              <el-button size="mini" @click="clear"> 重置 </el-button>
            </div>
          </div>
          <el-button
            type="primary"
            size="mini"
            style="margin-right: 20px"
            @click="handleAdd"
          >
            新增
          </el-button>
        </div>
        <dynamicTable
          ref="teamTable"
          v-model="teamTableData"
          style="height: 480px"
          :columns="teamColumns"
          :get-list-api="getTeamList"
        >
          <template slot="action" slot-scope="{ row }">
            <el-button
              type="text"
              @click="handleClickTeamEdit(row, 'edit')"
            >编辑</el-button>
          </template>
        </dynamicTable>
      </div>
    </transition-group>

    <revealTask ref="revealTask" @success="handleSuccess" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import {
  getGoodsTypeTaskList,
  modelQuery,
  modelUpdate,
  sourceDeptPage
} from '@/api/privateArea/revealTask'
import { deptTree } from '@/api/addressBookApi'
import revealTask from './revealTask/index'
export default {
  name: 'DouApprove',
  components: {
    dynamicTable,
    revealTask
  },
  data() {
    return {
      row: {},
      tableData: [],
      teamTableData: [],
      columns: [
        { prop: 'goodsTypeName', label: '课程类型', type: 'text' },
        {
          prop: 'enabled',
          label: '开启状态',
          type: 'text',
          slotFn: row => (row.enabled === 2 ? '开启' : '关闭')
        },
        { prop: 'startTime', label: '开启时间', type: 'text' },
        { prop: 'action', label: '操作', type: 'slot', width: 100 }
      ],
      teamColumns: [
        { prop: 'deptName', label: '订单来源团队', type: 'text', width: 300 },
        {
          prop: 'receptionDeptName',
          label: '订单接量团队',
          type: 'text',
          width: 300
        },
        {
          prop: 'enabled',
          label: '任务状态',
          type: 'text',
          slotFn: row => (row.enabled === 2 ? '开启' : '关闭')
        },
        { prop: 'createUserName', label: '创建人', type: 'text' },
        { prop: 'createTime', label: '创建时间', type: 'text' },
        { prop: 'action', label: '操作', type: 'slot', width: 100 }
      ],
      visible: false,
      goodsId: '',
      form: {
        type: 1,
        deptId: '',
        tabs: 1
      },
      deptList: [],
      isShow: false,
      deptTreeArray: []
    }
  },
  watch: {
    'form.tabs': {
      deep: true,
      handler() {
        setTimeout(() => {
          this.isShow = this.form.tabs !== 1
        }, 200)
      }
    }
  },
  mounted() {
    this.getType()
    this.getDeptTree()
  },
  methods: {
    handleClickEdit(row) {
      this.row = row
      this.$nextTick(() => {
        this.$refs.revealTask.init(row, 1)
      })
    },
    clear() {
      this.form.deptId = ''
    },
    async getDeptTree() {
      const res = await deptTree()
      const list = this.encapsulateData(res.data)
      this.deptTreeArray = list
    },
    encapsulateData(array) {
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
      return array
    },
    handleAdd() {
      this.$nextTick(() => {
        this.$refs.revealTask.init(undefined, 2)
      })
    },
    handleClickTeamEdit(row, type) {
      this.$nextTick(() => {
        this.$refs.revealTask.init(row, 2)
      })
    },
    async getType() {
      const { data } = await modelQuery()
      this.form.type = data.type
      if ([1, 2].includes(data.type)) {
        this.form.tabs = data.type
      }
    },
    async handleChange() {
      const { code } = await modelUpdate({
        type: this.form.type === 1 ? 2 : 1
      })
      if (code === 1) {
        this.$message.success(`开启${this.form.type === 1 ? '团队' : '商品类型'}兜底分配模式成功`)
        this.getType()
        this.handleSuccess()
      }
    },
    open(goodsId) {
      this.getType()
      this.goodsId = goodsId
      this.visible = true
    },
    handleSuccess() {
      this.handleOk()
      this.onRefresh()
    },
    handleOk() {
      this.$refs.table.onRefresh()
    },
    onRefresh() {
      this.$refs.teamTable.onRefresh()
    },
    async getList() {
      return getGoodsTypeTaskList().then(res => {
        res.data.items = res.data
        return res
      })
    },
    async getTeamList(params) {
      return sourceDeptPage({
        ...params,
        deptId: this.form.deptId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.interior-container ::v-deep {
  .dou-container {
    ul {
      margin: 20px 50px;
    }
  }
  .filter-container{
    padding: 0px 0px 10px 0;
  }
  .form-item {
    margin-top: 10px;
    display: flex;
    height: 30px;
    align-items: center;
    font-size: 14px;
    color: #2e2d2d;
    padding-left: 20px;
    .form-item__btn {
      margin-left: 10px;
    }
  }
  .my-table {
    margin: 0;
  }
  .table-box {
    border-radius: 6px;
    border: 1px solid #eff2f6;
    margin: 0 20px 0 120px;
  }
  .success {
    color: #18c618 !important;
  }
}
</style>
