<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="1200px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div class="warningOperation">
      <div class="filterHeader">
        <span class="formLabel m-r-10">机构名称</span>
        <el-select v-model="search.tenantId" clearable size="small" placeholder="请选择">
          <el-option v-for="item in orgOption" :key="item.organizationId" :label="item.name" :value="item.organizationId" />
        </el-select>
        <span class="formLabel m-l-10 m-r-10">直播间ID</span>
        <el-input v-model.trim="search.code" size="small" placeholder="请输入" class="w-200 m-r-10" clearable @keyup.enter.native="searchFn" @clear="searchFn" />
        <el-button size="small" type="primary" @click="searchFn">查询</el-button>
        <el-button size="small" style="margin-left: 16px" @click="clearFn">重置</el-button>
      </div>
      <div class="myTable">
        <el-table v-loading="loading" height="428" :header-cell-style="{ background: '#F3F3F3' }" :data="list">
          <el-table-column prop="tenantName" label="机构名称" />
          <el-table-column prop="code" label="直播间ID" />
          <el-table-column prop="name" label="直播间名称" />
          <el-table-column prop="heatType" label="加热类型">
            <template slot-scope="{ row }">
              {{ row.heatType | filterHeat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="330px">
            <template slot-scope="{ row }">
              <el-button type="text" @click="onhandleforbid(row)">{{ row.isHeatButton ? '隐藏' : '显示' }}加热按钮</el-button>
              <el-button v-if="row.heatType.includes(1)" type="text" @click="onhandlestop(row, 1)">停止加热人气</el-button>
              <el-button v-if="row.heatType.includes(2)" type="text" @click="onhandlestop(row, 2)">停止加热下单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :pager-count="5"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getOrgList } from '@/api/liveRoom/setting.js'
import { getHeatLiveRoomPage, forbidheatLiveRoom, stopheatLiveRoom } from '@/api/liveRoom/setting.js'
export default {
  components: {
    AppDialog
  },
  filters: {
    filterHeat(val) {
      if (val.length === 0 || !val) {
        return ''
      }
      return val.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${{ 1: '加热人气', 2: '加热下单' }[next]}`)
        return pre
      }, '')
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      title: '预警操作',
      list: [],
      currentPage: 1,
      search: {
        code: '',
        tenantId: ''
      },
      pageSize: 10,
      total: 0,
      orgOption: [
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val) {
        if (val) {
          this.getOrgList()
          this.searchFn()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 获取机构列表
    getOrgList() {
      getOrgList().then(res => {
        this.orgOption = res.data
      })
    },
    onhandleforbid(row) {
      const data = {
        isHeatButton: !row.isHeatButton,
        liveRoomId: row.liveRoomId
      }
      forbidheatLiveRoom(data).then(res => {
        this.getList()
      })
    },
    onhandlestop(row, type) {
      const data = {
        heatType: type,
        liveRoomId: row.liveRoomId
      }
      stopheatLiveRoom(data).then(res => {
        this.getList()
      })
    },
    clearFn() {
      this.search = {
        code: '',
        tenantId: ''
      }
      this.searchFn()
    },
    sure() {
      this.visible = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        code: this.search.code,
        tenantId: this.search.tenantId
      }
      getHeatLiveRoomPage(data).then(res => {
        console.log('获取预警列表数据', res)
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.warningOperation {
  height: 552px;
  padding: 20px;
  .myTable {
    margin-top: 20px;
    width: 100%;
    // height: 502px;
    background: #FFFFFF;
    border-radius: 6px;
    overflow: hidden;
  }
  .pagination {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
</style>
