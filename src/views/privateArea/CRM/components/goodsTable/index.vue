<template>
  <div class="listBox">
    <dynamicTable
      ref="table"
      v-model="dataList"
      table-layout="auto"
      class="reception-table"
      row-key="id"
      type="order"
      :config-props="configProps"
      :immediate-check="true"
      :columns="columns"
      :get-list-api="getList"
      :task-id="initForm.id"
      :data-list="dataList"
      checkbox
      @table-data-change="handleTableDataChange"
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
          >移除</el-button>
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
    </dynamicTable>
  </div>
</template>

<script>
import columns from './columns'
import {
  addTaskCondition,
  getTaskClueGoodsPage,
  addTaskClueGoodsPage,
  deleteTaskClueGoodsPage
} from '@/api/privateArea/toolbox'
import dynamicTable from '@/components/DynamicTable/table'
export default {
  components: { dynamicTable },
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
    },
    courseType: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    initForm: {},
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
  methods: {
    handleTableDataChange(tableData) {
      console.log(tableData, 'tableData')
      this.$emit('update:dataList', tableData)
    },
    getList(params) {
      this.params = params
      return getTaskClueGoodsPage({
        ...params,
        taskId: this.initForm.id
      })
    },
    // 初始化列表
    async initData(initForm) {
      this.initForm = initForm
      if (!initForm?.id) return
      this.$refs.table.onRefresh({ taskId: initForm.id })
    },
    // 新增
    async handleAdd(item) {
      const { code, data } = await addTaskCondition({
        ...item,
        taskId: this.taskId
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
    async handleDelete(scope) {
      const { row } = scope
      const data = {
        id: row.id
      }
      const res = await deleteTaskClueGoodsPage(data)
      if (res.code === 1) {
        this.onRefresh(this.params)
        this.$message.success('移除商品成功')
      }
    },
    async handleAddCondition() {
      const goodsReqList = []
      try {
        if (!this.initForm?.id) {
          this.$SelectGoods({
            visible: true,
            multiple: true,
            tearchSearch: true,
            isSearchPrice: true,
            check: goodsReqList,
            currentId: this.courseType === 1 ? '10' : '3',
            tabList:
              this.courseType === 1
                ? [{ id: '10', name: '直播课', api: '' }]
                : [
                  { id: '3', name: '普通专栏', api: '' },
                  { id: '4', name: '大专栏', api: '' },
                  { id: '2', name: '视频', api: '' },
                  { id: '1', name: '音频', api: '' },
                  { id: '7', name: '套餐课', api: '' }
                ],
            success: res => {
              if (this.courseType === 1) {
                const resLecturerIdList =
                  res?.map(item => item.lecturerIdList) || []
                const tempTableDataLecturerIdList =
                  this.$refs.table.tempTableData?.map(
                    item => item.lecturerIdList
                  ) || []
                const concatLecturerIdList = [
                  ...resLecturerIdList,
                  ...tempTableDataLecturerIdList
                ]

                const isSame =
                  concatLecturerIdList.length > 0 &&
                  concatLecturerIdList.every(arr => {
                    const sortedCurrent = [...arr].sort().join(',')
                    const sortedFirst = [...concatLecturerIdList[0]]
                      .sort()
                      .join(',')
                    return sortedCurrent === sortedFirst
                  })

                if (!isSame) {
                  this.$message.warning('商品讲师必须一致')
                  return
                }
              }

              const goodsIdList = res?.map(item => item.goodsId) || []
              this.addQuery(goodsIdList)
            }
          })
          return
        }
        const { code, data } = await getTaskClueGoodsPage({
          pageIndex: 1,
          pageSize: 1000,
          taskId: this.initForm?.id
        })
        if (code === 1) {
          if (data.items?.length) {
            data.items.map(v => {
              goodsReqList.push(v.goodsId)
            })
          }
          this.$SelectGoods({
            visible: true,
            multiple: true,
            tearchSearch: true,
            isSearchPrice: true,
            check: goodsReqList,
            currentId: this.courseType === 1 ? '10' : '3',
            tabList:
              this.courseType === 1
                ? [{ id: '10', name: '直播课', api: '' }]
                : [
                  { id: '3', name: '普通专栏', api: '' },
                  { id: '4', name: '大专栏', api: '' },
                  { id: '2', name: '视频', api: '' },
                  { id: '1', name: '音频', api: '' },
                  { id: '7', name: '套餐课', api: '' }
                ],
            success: res => {
              if (this.courseType === 1) {
                const resLecturerIdList =
                  res?.map(item => item.lecturerIdList) || []
                const tempTableDataLecturerIdList =
                  this.$refs.table.tempTableData?.map(
                    item => item.lecturerIdList
                  ) || []
                const concatLecturerIdList = [
                  ...resLecturerIdList,
                  ...tempTableDataLecturerIdList
                ]

                const isSame =
                  concatLecturerIdList.length > 0 &&
                  concatLecturerIdList.every(arr => {
                    const sortedCurrent = [...arr].sort().join(',')
                    const sortedFirst = [...concatLecturerIdList[0]]
                      .sort()
                      .join(',')
                    return sortedCurrent === sortedFirst
                  })

                if (!isSame) {
                  this.$message.warning('商品讲师必须一致')
                  return
                }
              }
              const goodsIdList = res?.map(item => item.goodsId) || []
              this.addQuery(goodsIdList)
            }
          })
        }
      } catch {
        this.$SelectGoods({
          visible: true,
          multiple: true,
          tearchSearch: true,
          isSearchPrice: true,
          check: goodsReqList,
          currentId: '3',
          tabList: [
            { id: '3', name: '普通专栏', api: '' },
            { id: '4', name: '大专栏', api: '' },
            { id: '2', name: '视频', api: '' },
            { id: '1', name: '音频', api: '' },
            { id: '7', name: '套餐课', api: '' },
            { id: '10', name: '直播课', api: '' }
          ],
          success: res => {
            const goodsIdList = res?.map(item => item.goodsId) || []
            this.addQuery(goodsIdList)
          }
        })
      }
    },
    async addQuery(goodsIdList) {
      const { code, data } = await addTaskClueGoodsPage({
        goodsIdList,
        taskId: this.initForm?.id
      })
      if (code !== 1) return
      if (!this.initForm?.id) {
        this.initForm = {
          ...this.initForm,
          id: data
        }
        this.$emit('updateRuleId', data)
      }
      this.initData(this.initForm)
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
