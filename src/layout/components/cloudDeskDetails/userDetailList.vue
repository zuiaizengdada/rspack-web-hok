<template>
  <div class="userDetailList">
    <div class="userDetailTitle">
      <MTitle>云桌面使用明细</MTitle>
      <div>
        <el-date-picker
          v-model="search.time"
          style="width: 244px"
          class="m-r-20"
          size="small"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button :loading="loading" class="myBtn" type="primary" size="small" @click="searchFn">查询</el-button>
        <el-button :loading="loading" class="myBtn" size="small" @click="clearFn">重置</el-button>
      </div>
    </div>
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
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
    />
  </div>
</template>

<script>
import { getCloudPcUseDetail } from '@/api/videoManagement/cloudDesktop'
export default {
  components: {},
  props: {
    deskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      slotArr: ['action', 'search', 'footer'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'index', label: '序号', type: 'text', visible: true },
          { prop: 'startTime', label: '开机时间', type: 'text', visible: true },
          { prop: 'endTime', label: '关机时间', type: 'text', visible: true },
          { prop: 'useTime', label: '使用时长', type: 'text', visible: true, render: (row) => { return this.filterTime(row.useTime) } }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        time: ['', '']
      }
    }
  },
  watch: {
    deskId: {
      handler(val) {
        if (val) {
          this.getList()
        }
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    // 获取云桌面详情-使用明细
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        endTime: this.search.time ? this.search.time[1] : '',
        startTime: this.search.time ? this.search.time[0] : '',
        userEcsId: this.deskId
      }
      getCloudPcUseDetail(params).then(res => {
        console.log(res)
        res.data.items.map((v, i) => {
          v.index = i + 1
        })
        this.config.tableData = res.data.items
        this.config.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 点击查询
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 点击重置
    clearFn() {
      this.search.time = ['', '']
      this.searchFn()
    },
    filterTime(value) {
      if (!value || typeof value !== 'number') {
        return '0秒'
      } else {
        const result = parseInt(value)
        const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
        const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
        const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
        return h + '时' + m + '分' + s + '秒'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.userDetailList {
  flex: 1 0 0;
  overflow: hidden;
  .userDetailTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .myBtn {
    width: 68px;
    height: 32px;
  }
}
::v-deep .tablePage .page_footer{
  justify-content: space-between;
  box-shadow: none;
  padding:10px 0 0;
  height:auto;
}
::v-deep .page_header{
  padding: 0!important;
}
::v-deep .my-table{
  margin:0!important;
}
::v-deep .PageLayout {
  height: calc(100% - 32px) !important;
}
</style>
