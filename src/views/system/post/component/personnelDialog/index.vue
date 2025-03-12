<template>
  <el-dialog
    :visible.sync="visible"
    width="50%"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <template slot="title">
      <span>
        <p style="float: left">人员管理</p>
        <p class="post-name">{{ postInfo.name }}</p>
      </span>
      <el-button
        size="mini"
        style="position: absolute; right: 80px"
        @click="addUser"
      >
        新增人员
      </el-button>
    </template>
    <!-- 人员管理表格 -->
    <el-table
      style="margin-top: 10px"
      :header-cell-style="{ background: '#f5f5f5' }"
      :data="tableData"
      border
      height="500px"
      @selection-change="changeSelect"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column prop="nickName" label="员工姓名" />
      <el-table-column prop="phoneNumber" label="手机号码" width="120" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <AppStatus :status="{ 0: 'success', 1: 'error' }[row.status]">
            <span>{{ { 0: '在职', 1: '离职' }[row.status] }}</span>
          </AppStatus>
        </template>
      </el-table-column>
      <el-table-column prop="roleVoList" label="角色">
        <template slot-scope="{ row }">
          <el-tag v-for="(item, index) in row.roleVoList" :key="index">{{
            item.roleName
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="部门" />
      <el-table-column prop="time" width="140" label="添加日期" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            style="color: #ee2e14"
            @click="remove(scope.row)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-button size="mini" type="danger" @click="remove">
        批量删除
      </el-button>
      <el-pagination
        :current-page="pageInfo.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>
<script>
import { getAllUserByRoleId } from '@/api/role'
import AppStatus from '@/components/AppStatus'
export default {
  components: {
    AppStatus
  },
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    postInfo: {
      type: Object,
      default: () => {
        return { id: undefined, name: undefined }
      }
    }
  },
  data() {
    return {
      tableData: [
        // 模拟数据
        {
          nickName: '张三',
          phoneNumber: '12345678901',
          status: 0,
          roleVoList: [
            {
              roleName: '管理员'
            }
          ],
          deptName: '技术部',
          time: '2020-01-01'
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      selectList: []
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
  watch: {
    visible(val) {
      if (val) {
        this.getUserList()
      }
    }
  },
  methods: {
    addUser() {
      // 待替换
      getAllUserByRoleId().then(res => {
        if (res.code === 1) {
          // const checkUser = []
          // const userIdsForDisabl = []
          // res.data.some(item => {
          //   const obj = {
          //     userId: item.userId,
          //     userName: item.userName,
          //     nickName: item.nickName
          //   }
          //   userIdsForDisabl.push(item.userId)
          //   checkUser.push(obj)
          // })
          // this.$AddressBook({
          //   visible: true,
          //   multiple: true,
          //   type: [1],
          //   disabledUser: userIdsForDisabl,
          //   success: res => {
          //     console.log()
          //   }
          // })
        }
      })
    },
    remove(record) {
      let info = {}
      // record有值则单选
      if (record) {
        info = {
          postId: this.postInfo.id,
          postName: this.postInfo.name,
          staffNames: record.nickName,
          staffIds: [record.id]
        }
      } else {
        if (this.selectList.length === 0) {
          this.$message.error('请选择要移除的人员')
          return
        }
        info = {
          postId: this.postInfo.id,
          postName: this.postInfo.name,
          staffNames: this.selectList.map(m => m.name).join(','),
          staffIds: this.selectList.map(m => m.id)
        }
      }
      this.$emit('remove', info)
    },
    // 获取人员列表
    async getUserList() {
      //   const { pageNum, pageSize } = this.pageInfo
      //   const { data } = await this.$http.get('/user/list', {
      //     params: {
      //       pageNum,
      //       pageSize
      //     }
      //   })
      //   this.tableData = data.data
      //   this.pageInfo.total = data.total
    },
    // 分页
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNum = val
      this.getUserList()
    },
    changeSelect(val) {
      console.log(val, 'changeSelect')
      this.selectList = val
    },
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.post.validate(valid => {
        if (valid) {
          this.$emit('submit', this.post)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.post-name {
  float: left;
  margin-left: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
