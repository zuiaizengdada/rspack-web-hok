<template>
  <!-- 获客助手链接 -->
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      keys="toolbox_rearrangement"
      :slot-arr="slotArr"
      style="height: calc(100vh - 220px)"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="search">
        <div class="searchBox">
          <div class="searchLeft">
            <div>排重商品名称</div>
            <el-input v-model="goodsName" class="inputBox" clearable />
            <el-button type="primary" @click="searchFn">查询</el-button>
            <el-button @click="handleRest">重置</el-button>
          </div>
          <div class="m-t-20 m-b-20">
            <el-button
              size="small"
              type="primary"
              @click="handleAddModel()"
            ><i class="el-icon-plus" /> 新增</el-button>
          </div>
        </div>
      </template>
      <template #goodsName="{ row }">
        <template v-if="row.id !== active">
          <div class="flexBox">
            <div>{{ row.goodsName || '未知' }}</div>
            <i class="el-icon-edit color_icon" @click="onhandleRemark(row)" />
          </div>
        </template>
        <template v-else>
          <el-input
            v-model.trim="row.goodsName"
            show-word-limit
            maxlength="60"
            clearable
            placeholder="请输入"
            size="mini"
            @input="value => handleInput(value, row)"
            @keyup.enter.native="onHandleEditGoodsName(row)"
            @blur="onHandleEditGoodsName(row)"
          />
        </template>
      </template>
      <template #action="{ row }">
        <el-button
          type="text"
          style="color: #0a78f7"
          @click="handleAddModel(row)"
        >设置商品</el-button>
        <el-button
          type="text"
          style="color: #f53f3f"
          @click="handleRemove(row)"
        >删除</el-button>
      </template>
    </MPageLayout>
    <addDialog ref="addDialogRef" @handleOk="handleOk" />
  </div>
</template>

<script>
import {
  getReachList,
  deleteReachList,
  updateReachList
} from '@/api/privateArea/toolbox'
import addDialog from './components/addDialog'
export default {
  components: {
    addDialog
  },
  data() {
    return {
      addDialogData: {
        visible: false,
        initData: {},
        type: 'add'
      },
      goodsName: '',
      isGoodsName: '',
      active: '',
      slotArr: ['action', 'search', 'footer', 'goodsName'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'goodsName', label: '排重商品名称', type: 'slot' },
          { prop: 'goodsNum', label: '包含商品数', type: 'text' },
          { prop: 'createUserName', label: '创建人', type: 'text' },
          { prop: 'createTime', label: '创建时间', type: 'text' },
          {
            prop: 'updateUserName',
            label: '更新人',
            type: 'text',
            width: 100
          },
          {
            prop: 'updateTime',
            label: '更新时间',
            type: 'text',
            width: 200
          },
          {
            width: '150px',
            prop: 'action',
            label: '操作',
            type: 'slot',
            disable: true
          }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    // 限制  输入 文字，数字，英文 （） -
    formatting(value) {
      const regex = /[^ \u4e00-\u9fa5a-zA-Z0-9()\-]/g
      const filteredValue = value.replace(regex, '')
      return filteredValue
    },
    handleInput(value, row) {
      row.goodsName = this.formatting(value)
    },
    onhandleRemark(row) {
      this.isGoodsName = row.goodsName
      this.active = row.id
    },
    async onHandleEditGoodsName(row) {
      this.active = ''
      row.goodsName = row.goodsName.trim()
      try {
        const { code } = await updateReachList({
          goodsName: row.goodsName,
          id: row.id
        })
        if (code === 1) {
          this.$message.success('修改成功!')
        } else {
          row.goodsName = this.isGoodsName
        }
      } catch {
        row.goodsName = this.isGoodsName
      }
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    handleOk() {
      this.searchFn()
    },
    handleRest() {
      this.goodsName = ''
      this.searchFn()
    },
    handleAddModel(row) {
      this.$refs.addDialogRef.open({
        initData: row || {},
        type: row ? 'edit' : 'add'
      })
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        goodsName: this.goodsName
      }
      getReachList(data)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleRemove(row) {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.deleteSms(row)
        }
      })
    },
    async deleteSms(row) {
      const { code } = await deleteReachList(row.id)
      if (code === 1) {
        this.$message.success('该模板已删除')
        this.getList()
      }
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.searchFn()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap::v-deep {
  padding: 0 20px;
  .el-form-item__content .el-input__inner {
    padding-right: 55px;
  }
}
.searchBox::v-deep {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > .searchLeft {
    display: flex;
    align-items: center;
    > div:nth-of-type(1) {
      min-width: 95px;
      color: #666666;
      font-size: 14px;
    }
    > .inputBox {
      margin-right: 10px;
    }
  }
}
.flexBox {
  display: flex;
  align-items: center;
  .color_icon {
    color: #0d85f5;
    margin-left: 5px;
  }
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
</style>
