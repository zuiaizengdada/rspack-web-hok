<template>
  <AppDialog
    v-model="visible"
    title="选择加微客服"
    width="800px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="editRemarks overflowOuto">
      <div class="search">
        <div class="searchLabel">伏羲云员工姓名</div>
        <el-input v-model.trim="search.name" size="small" class="w-200" placeholder="请输入" />
        <div class="m-l-20">
          <el-button size="small" type="primary">查询</el-button>
          <el-button size="small">重置</el-button>
        </div>
      </div>
      <div class="viewContent m-t-20">
        <el-table class="viewTable" height="518" :data="tableData" :header-cell-style="{ background: '#F3F3F3' }" @row-click="handleRowClick">
          <el-table-column width="55">
            <template slot-scope="{ row }">
              <el-checkbox :value="Boolean(multipleSelection.find(v => {return v.userId === row.userId}))" :label="row.userId"><span /></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="dept" label="部门名称" width="239" show-overflow-tooltip />
          <el-table-column prop="userName" label="伏羲云员工姓名" align="center" />
        </el-table>
        <div class="viewSelect">
          <div class="viewSelectHeader">已选加微客服({{ multipleSelection.length }})</div>
          <div class="viewSelectContent overflowOuto">
            <div v-for="(item, index) in multipleSelection" :key="item.userId" class="selectItem">
              <span class="selectName">{{ item.dept }} - {{ item.userName }}</span>
              <i class="el-icon-close closeIcon" @click="del(item, index)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: true,
      top: '114px',
      search: {
        name: ''
      },
      success: () => {},
      tableData: [
        { dept: '部门1', deptId: '100', userName: '员工1', userId: '100' },
        { dept: '部门2', deptId: '110', userName: '员工2', userId: '101' },
        { dept: '部门3', deptId: '120', userName: '员工3', userId: '102' }
      ],
      multipleSelection: []
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 739) / 2 + 'px'
  },
  methods: {
    sure() {
      this.success && this.success(this.multipleSelection)
      // this.visible = false
    },
    handleRowClick(row, column, event) {
      const index = this.multipleSelection.findIndex(v => v.userId === row.userId)
      if (index === -1) {
        this.multipleSelection.push(row)
      } else {
        this.multipleSelection.splice(index, 1)
      }
    },
    del(row, index) {
      this.multipleSelection.splice(index, 1)
    }
  }
}
</script>

<style lang='scss' scoped>
.editRemarks {
  height: 611px;
  padding: 20px;
  .search {
    display: flex;
    align-items: center;
    .searchLabel {
      margin-right: 8px;
    }
  }
  .viewContent {
    display: flex;
    .viewTable {
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #CBCFD3;
      flex: 1;
    }
    .viewSelect {
      width: 262px;
      margin-left: 20px;
      height: 518px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #E7E7E7;
      display: flex;
      flex-direction: column;
      .viewSelectHeader {
        height: 36px;
        background: #F3F3F3;
        line-height: 36px;
        text-align: center;
      }
      .viewSelectContent {
        flex: 1 0 0;
        .selectItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 34px;
          line-height: 34px;
          padding: 0 10px;
          border-bottom: 1px solid #E7E7E7;
          .selectName {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 20px;
          }
          .closeIcon {
            font-size: 12px;
            cursor: pointer;
            &:hover {
              color: #5cb6ff;
            }
          }
        }
      }
    }
  }
}
</style>
