<template>
  <div v-loading="loading" class="userList">
    <el-table :data="data" :header-cell-style="{ background: '#f5f5f5' }">
      <el-table-column prop="index" label="序号" />
      <el-table-column prop="nickName" label="用户名称" />
      <el-table-column prop="phoneNumber" label="手机号码">
        <template slot-scope="{ row }">
          <watchPhoneNumber :user-id="row.userId" :default-value="row.phoneNumber" :if-system="true" />
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="部门" />
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { usersByMenuIdApi } from '@/api/system/menu'
import watchPhoneNumber from '@/components/watchPhoneNumber'
export default {
  components: {
    watchPhoneNumber
  },
  props: {
    menuId: {
      type: [Number, undefined],
      default: undefined
    }
  },
  data() {
    return {
      data: [],
      loading: false,
      currentPage: 1,
      total: 0,
      pageSize: 10
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        menuId: this.menuId
      }
      usersByMenuIdApi(params).then(res => {
        console.log('分页查询菜单下用户列表', res)
        res.data.records.map((v, index) => {
          v.index = (this.currentPage - 1) * this.pageSize + index + 1
        })
        this.data = res.data.records
        this.total = Number(res.data.total)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.userList {
  border: 1px solid #F3F3F3;
  border-radius: 6px;
  overflow: hidden;
}
.pagination {
  height: 62px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
