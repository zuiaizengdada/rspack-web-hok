<!-- 提示词分类 -->
<template>
  <div class="wrapper">
    <div v-if="isAuthority" class="outbound">
      <div class="outbound-header">
        <el-form
          ref="form"
          inline
          label-width="80px"
          :model="searchForm"
          size="small"
        >
          <el-row>
            <el-col :span="20">
              <el-form-item label="坐席部门" prop="dept">
                <el-cascader
                  v-model="searchForm.deptId"
                  filterable
                  :options="deptTreeArray"
                  :props="{ checkStrictly: true }"
                  clearable
                  @change="searchOutboundSeats"
                  @clear="searchOutboundSeatsReset"
                />
              </el-form-item>
              <el-form-item label="坐席姓名" prop="userName">
                <el-input
                  v-model="searchForm.userName"
                  placeholder="请输入"
                  clearable
                  @clear="searchOutboundSeatsReset"
                  @keyup.enter.native="searchOutboundSeats"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchOutboundSeats">
                  查询
                </el-button>
                <el-button @click="searchOutboundSeatsReset">重置</el-button>
              </el-form-item>
            </el-col>
            <el-col
              :span="4"
              style="
                display: flex;
                align-items: center;
                justify-content: flex-end;
              "
            >
              <el-form-item>
                <el-button type="primary" @click="addOutboundSeats">
                  新增
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="outbound-content">
        <el-table
          v-loading="loading"
          :header-cell-style="{ background: '#f5f5f5' }"
          :data="outboundList"
        >
          <el-table-column prop="deptName" label="坐席部门" />
          <el-table-column prop="userName" label="坐席姓名" />
          <el-table-column prop="bindPhone" label="坐席电话" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="test(scope.row)">
                测试
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="editOutboundSeats(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                style="color: red"
                @click="deleteOutboundSeats(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column></el-table>
      </div>
      <div class="outbound-footer">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-empty
      v-else
      :image-size="500"
      style="margin-top: 100px"
      description="您尚未开通坐席，开通坐席请联系您的商务服务人员！"
    >
      <img
        slot="image"
        src="@/assets/image/outboundSeats/null-status.png"
        alt=""
      />
    </el-empty>
    <createOrEditDialog
      v-if="visible"
      v-model="visible"
      :row="row"
      @close="close"
    />
    <testCallPhone
      v-model="visibleTestCallPhone"
      :row="row"
      @close="visibleTestCallPhone = false"
    />
  </div>
</template>

<script>
import createOrEditDialog from './component/createOrEditDialog.vue'
import testCallPhone from './component/testCallPhone.vue'
import { deptTree } from '@/api/addressBookApi'
import { callAgentPage, callAgentDel } from '@/api/privateArea/outboundSeats'
export default {
  name: 'OutboundSeats',
  components: {
    createOrEditDialog,
    testCallPhone
  },
  data() {
    return {
      visible: false,
      outboundList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 搜索表单
      searchForm: { userName: undefined, deptId: undefined },
      loading: false,
      row: {
        id: undefined,
        name: undefined
      },
      visibleTestCallPhone: false,
      isAuthority: true,
      deptTreeArray: []
    }
  },
  created() {
    this.loadTreeData()
    this.getOutboundListType()
  },
  methods: {
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    test(record) {
      this.row = { ...record }
      this.visibleTestCallPhone = true
    },
    close() {
      this.row = {}
      this.visible = false
      this.getOutboundListType()
    },
    // 获取列表
    async getOutboundListType() {
      this.loading = true
      const data = await callAgentPage({
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        userName: this.searchForm.userName,
        deptId: this.searchForm.deptId
          ? this.searchForm.deptId[this.searchForm.deptId.length - 1]
          : undefined
      }).catch(() => {
        this.loading = false
      })
      if (data.message === '90001') {
        this.isAuthority = false
        this.loading = false
        return
      }
      this.outboundList = data.data.items
      this.total = data.data.total
      this.loading = false
    },
    // 搜索分类
    searchOutboundSeats() {
      this.currentPage = 1
      this.getOutboundListType()
    },
    // 重置
    searchOutboundSeatsReset() {
      this.searchForm = { userName: undefined, deptId: undefined }
      this.currentPage = 1
      this.pageSize = 10
      this.getOutboundListType()
    },
    // 每页显示条数改变
    handleSizeChange(val) {
      this.pageSize = val
      this.getOutboundListType()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getOutboundListType()
    },
    // 添加分类
    addOutboundSeats() {
      this.row = {}
      this.visible = true
    },
    // 编辑分类
    editOutboundSeats(record) {
      this.row = { ...record }
      this.visible = true
    },
    // 删除分类
    deleteOutboundSeats(record) {
      console.log(record)
      this.$delModal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">删除提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">删除后坐席不可继续人工外呼,确认要删除吗?</div>`,
        success: () => {
          this.loading = true
          callAgentDel({ id: record.id })
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getOutboundListType()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  height: 100%;
  padding: 20px;
  background-color: #fff;
  .location {
    margin-bottom: 20px;
  }
  .el-button {
    margin-left: 10px;
  }
  .outbound {
    .outbound-header {
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 20px;
    }
    .outbound-content {
      width: 100%;
      .el-table {
        width: 100%;
      }
    }
    .outbound-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>
