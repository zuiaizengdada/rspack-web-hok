<template>
  <!-- 选择短信模板弹框 -->
  <AppDialog
    v-model="visible"
    title="查看规则库"
    top="5vh"
    width="950px"
    height="695px"
    :loading="loading"
    @success="successFn"
  >
    <div v-loading="loading" class="smsDialog overflowOuto">
      <div class="headerSearch">
        <div class="flex flex-column">
          <div>规则名称：{{ config.name }}</div>
          <div>分配规则：{{ config.allocationRules === 1 ?'轮询分配':'依次阶梯分配' }}</div>
          <div>兜底助教：{{ config.assistantUserName }}</div>
          <div>助教列表：</div>
        </div>
        <el-button
          v-if="type === 'EDIT'"
          type="primary"
          size="small"
          @click="handleAdd"
        >新增助教</el-button>
      </div>
      <el-table
        height="450px"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column prop="deptName" label="部门名称" />
        <el-table-column prop="assistantName" label="助教名称" />
        <el-table-column prop="autoDistribute" label="分配状态">
          <template slot-scope="{ row }">
            {{ { 0: '暂停分配', 1: '正常分配' }[row.autoDistribute] }}
          </template>
        </el-table-column>
        <el-table-column prop="receptionsNum" label="最大接待数" />
        <el-table-column prop="createTime" label="接待课程价格">
          全部
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column
          v-if="type === 'EDIT'"
          prop="buttons"
          label="操作"
          width="160"
        >
          <template slot-scope="{ row }">
            <div class="bottonBox">
              <button @click.stop="handleCancel(row)">
                {{ row.autoDistribute ? '取消自动分配' : '开启自动分配' }}
              </button>
              <button @click.stop="handleDelete(row)">删除</button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottonBox">
        <div>
          <div v-if="type === 'EDIT'">
            <button @click="handleBtn(false)">取消自动分配</button>
            <button @click="handleBtn(true)">开启自动分配</button>
            <button @click="handleDeletes">删除</button>
          </div>
        </div>
        <el-pagination
          class="pagination"
          :current-page.sync="current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  addWarehouseStaff,
  autoDistribute,
  addTeachingStaff,
  deleteTeachingStaff
} from '@/api/course'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      form: {
        search: ''
      },
      config: {},
      visible: false,
      type: '',
      current: 1, // 当前页
      pageSize: 10, // 页数
      total: 0, // 总数
      tableData: [],
      multipleSelection: []
    }
  },
  mounted() {},
  methods: {
    handleAdd() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        minlength: 1,
        success: res => {
          if (res.user.length > 0) {
            this.loading = true
            // const assistantList = res.user.reduce((pre, next) => {
            //   const obj = this.assistantList.find(
            //     v => v.sysUserId === next.userId
            //   )
            //   pre.push({
            //     autoDistribute: obj ? obj.autoDistribute : 1,
            //     deptId: next.deptId,
            //     sysUserId: next.userId
            //   })
            //   return pre
            // }, [])
            // const data = {
            //   goodsId: this.config.goodsId,
            //   goodsName: this.config.goodsName,
            //   assistantList: assistantList,
            //   num: this.num
            // }
            const data = {
              id: this.config.id,
              staffs:
                res.user.map(item => ({
                  sysUserId: item.userId,
                  autoDistribute: 0
                })) || []
            }
            this.addTeachingStaff(data)
            // this.queryAddAssistant(data)
          }
        }
      })
    },
    async addTeachingStaff(data) {
      try {
        await addTeachingStaff(data)
        this.sureSearch()
      } catch {
        this.loading = false
      }
    },
    open(row = {}, type) {
      this.type = type
      this.visible = true
      this.config = row
      this.getList()
    },
    init() {
      this.current = 1
      this.total = 0
      this.form.search = ''
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        warehouseId: this.config.id,
        current: this.current,
        size: this.pageSize
      }
      addWarehouseStaff(params)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.current = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    sureSearch() {
      this.current = 1
      this.getList()
    },
    selectFn(row, column, event) {
      event.stopPropagation()
      //   this.$emit('select', row)
    },
    successFn() {
      this.$emit('select')
      this.visible = false
    },
    handleBtn(bol) {
      const sysUserId = this.multipleSelection.map(item => item.sysUserId)
      const autoDistribute = bol ? 1 : 0
      const obj = {
        assistantWarehouseId: this.config.id,
        sysUserId,
        autoDistribute
      }
      this.autoDistribute(obj)
    },
    handleDeletes() {
      const obj = {
        assistantWarehouseId: this.config.id,
        sysUserId: this.multipleSelection?.map(item => item.sysUserId) || []
      }
      this.deleteTeachingStaff(obj)
    },
    async handleCancel(row) {
      const obj = {
        assistantWarehouseId: this.config.id,
        sysUserId: [row.sysUserId],
        autoDistribute: row.autoDistribute ? 0 : 1
      }
      this.autoDistribute(obj)
    },
    handleDelete(row) {
      const obj = {
        assistantWarehouseId: this.config.id,
        sysUserId: [row.sysUserId]
      }
      this.deleteTeachingStaff(obj)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async autoDistribute(data) {
      let tips =
        '是否确认取消自动分配,取消后有新订单进入交付系统后将不再自动分配学员给此助教。'
      if (data.autoDistribute !== 0) {
        tips =
          '是否确认加入自动分配,加入后有新订单进入交付系统后将轮询分配助教来服务学员。'
      }
      this.$delModal({
        tips: tips,
        success: async () => {
          this.loading = true
          try {
            const res = await autoDistribute(data)
            res.code === 1 && this.$message.success(res.msg)
            res.code === 1 && this.getList()
            this.loading = false
          } catch {
            this.loading = false
          }
        }
      })
    },
    async deleteTeachingStaff(data) {
      this.$delModal({
        tips: '是否删除当前选中助教',
        success: async () => {
          this.loading = true
          try {
            const res = await deleteTeachingStaff(data)
            res.code === 1 && this.$message.success('删除成功')
            res.code === 1 && this.getList()
            this.loading = false
          } catch {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

  <style lang='scss' scoped>
.smsDialog {
  height: 695px;
  box-sizing: border-box;
  padding: 20px;
  .headerSearch {
    border-bottom: 1px solid #e7e7e7;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
.myRadioSelect {
  width: 12px;
  height: 12px;
  color: #409eff;
}
.myRadio {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #dcdfe6;
}
.bottonBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    margin-right: 10px;
    color: #409eff;
  }
}
</style>

