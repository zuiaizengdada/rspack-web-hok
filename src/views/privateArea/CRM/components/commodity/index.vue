<template>
  <div class="listBox">
    <dynamicTable
      ref="table"
      v-model="dataList"
      table-layout="auto"
      class="reception-table"
      row-key="id"
      :config-props="configProps"
      :immediate-check="true"
      :columns="columns"
      :get-list-api="getList"
      checkbox
      @selectionChange="handleSelectionChange"
    >
      <template #action="scope">
        <el-popconfirm
          title="确定移除该条商品吗？"
          @confirm="handleDelete(scope)"
        >
          <el-button
            slot="reference"
            type="text"
            :disabled="isDisabled"
            size="small"
          >删除</el-button>
        </el-popconfirm>
      </template>
      <template #submitBtn>
        <el-button
          type="primary"
          size="small"
          :disabled="isDisabled"
          @click="handleAddCondition"
        >新增</el-button>
      </template>
      <template slot="footer">
        <el-button
          :disabled="isDisabled || !multipleSelection.length"
          @click="handleAllDelete"
        >批量删除</el-button>
      </template>
    </dynamicTable>

    <commodityModel
      :edit-config.sync="config"
      :data-list="dataList"
      @handleAdd="handleAdd"
    />
  </div>
</template>

<script>
import commodityModel from './commodityModel.vue'
import columns from './columns'
import {
  addTaskCondition,
  getTaskCondition,
  deleteTaskCondition
} from '@/api/privateArea/toolbox'
import dynamicTable from '@/components/DynamicTable/table'
import { getThirdShopSelectAll, removeBatch } from '@/api/order/orderSign.js'
export default {
  components: { commodityModel, dynamicTable },
  props: {
    taskStatus: {
      type: String,
      default: ''
    },
    taskId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    initForm: {},
    multipleSelection: [],
    dataList: [],
    columns,
    params: {},
    config: {
      visible: false
    },
    configProps: {
      total: 0
    }
  }),
  computed: {
    isDisabled() {
      return this.taskStatus === '4' || this.type === 'detail'
    }
  },
  mounted() {
    this.getOptions()
  },
  methods: {
    handleSelectionChange(row) {
      console.log(row)
      this.multipleSelection = row
    },
    getList(params) {
      this.params = params
      const orderPlatformId =
        params.shopList && params.shopList.length
          ? params.shopList[0]
          : undefined
      const shopId =
        params.shopList && params.shopList.length
          ? params.shopList[1]
          : undefined
      return getTaskCondition({
        ...params,
        shopList: undefined,
        orderPlatformId,
        shopId,
        taskId: this.initForm.id
      })
    },
    getOptions() {
      getThirdShopSelectAll().then(res => {
        this.columns[1].formProps.options = res.data.reduce((pre, next) => {
          if (next.list && next.list.length > 0) {
            next.list.map(e => {
              e.label = e.shopName
              e.value = e.shopId
            })
            pre.push({
              label: next.dictLabel,
              children: next.list,
              value: next.dictValue
            })
          }
          return pre
        }, [])
      })
    },
    // 初始化列表
    async initData(initForm) {
      this.initForm = initForm
      console.log(111, this.initForm)
      if (!initForm?.id) return
      this.$refs.table.onRefresh({ taskId: initForm.id })
    },
    // 新增
    async handleAdd(item) {
      const { code, data } = await addTaskCondition({
        ...item,
        taskId: this.initForm.id
      })
      if (code === 1) this.$message.success('新增成功')
      if (!this.initForm.id) {
        this.initForm = {
          ...this.initForm,
          id: data
        }
        this.$emit('updateRuleId', data)
      }
      this.onRefresh()
    },
    onRefresh(params = {}) {
      this.$refs.table.onRefresh(params)
    },

    async handleAllDelete() {
      this.$confirm('确定移除选中商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          console.log(222222, this.multipleSelection.map(item => item.id))
          const { code } = await removeBatch({
            taskId: this.initForm.id,
            idList: this.multipleSelection.map(item => item?.id)
          })
          if (code === 1) {
            this.multipleSelection = []
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.onRefresh(this.params)
          }
        })
        .catch(() => {
        })
    },
    async handleDelete(scope) {
      const { row } = scope
      const data = {
        id: row.id,
        taskId: this.initForm.id
      }
      const res = await deleteTaskCondition(data)
      if (res.code === 1) {
        this.onRefresh(this.params)
        this.$message.success('移除商品成功')
      }
    },
    handleAddCondition() {
      this.config.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.pageBox {
  display: flex;
  justify-content: flex-end;
}
.listBox {
  position: relative;
  margin-top: -20px;
}
.listBox::v-deep {
  .filter-container {
    padding: 0px;
  }
  .reception-table {
    min-height: 350px;
  }
  .el-table th.el-table__cell {
    background: #f2f9ff !important;
  }
  .el-table {
    border-radius: 6px;
    min-height: 300px !important;
    border: 1px solid #d8dce6;
  }
}
</style>
