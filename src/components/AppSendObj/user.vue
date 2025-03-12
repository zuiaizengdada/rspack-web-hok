<template>
  <div class="user_wrap">
    <!-- 按用户选 -->
    <div class="search">
      <filterTop class="w-100p" :search="search" @search="handerSearch" />
    </div>
    <el-table
      ref="table"
      :data="config.tableData"
      class="table_content m-t-20"
      height="360px"
      border
      :row-key="(row) => row.phone"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="userDisabledFn" />
      <el-table-column label="用户" prop="name" width="280">
        <template slot-scope="{ row }">
          <div class="nickName pointer">
            <AppAvatar :name="row.name || row.realName || row.uid || row.phone" width="45" :no-name="true" />
            <div class="m-l-10">
              <div>
                <div>
                  {{ row.name }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="渠道来源" prop="channelSource">
        <template slot-scope="{ row }">
          {{ { 1: '抖店', 2: '快手', 3: '获课', 4: '微店' }[row.channelSource] }}
        </template>
      </el-table-column>
      <el-table-column label="用户状态" prop="status">
        <template slot-scope="{ row }">
          {{ { '-1': '删除', 0: '禁用', 1: '正常', 2: '待激活' }[row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" prop="realName" />
      <el-table-column label="手机号码" prop="phone" />
    </el-table>
    <div class="footer m-t-20">
      <el-pagination
        layout="total, prev, pager, next"
        :current-page="config.currentPage"
        :page-size="config.pageSize"
        :pager-count="5"
        :total="config.total"
        @current-change="handleCurrentChange"
      />
      <div>
        <span class="m-r-10">已选{{ multipleSelection.length }}项</span>
        <el-button type="primary" @click="sureGou()">选择勾选部分</el-button>
        <el-button @click="sureSearchBtn()">选择查询条件</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { GetMemberList } from '@/api/user/member'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { GetList } from '@/api/user/label'
import filterTop from './filterTop.vue'
export default {
  components: {
    filterTop,
    AppAvatar
  },
  props: {
    userDisabledFn: {
      type: Function,
      default: () => {
        return () => true
      }
    }
  },
  data() {
    return {
      loading: false,
      config: {
        tableData: [],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      allChangeType: false,
      search: {
        user: { label: 'name', value: '' }, // 订单搜索
        labelId: [],
        loading: false
      },
      labelLoading: false,
      labelOption: [],
      labelList: [],
      labelSearch: '',
      checkList: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      this.loading = true
      const labelIdList = []
      this.search.labelId.map((v) => {
        labelIdList.push(v.labelId)
      })
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        [this.search.user.label]: this.search.user.value,
        timeType: 1,
        startTime: '',
        endTime: '',
        channelSource: '',
        userSource: '',
        status: '',
        thirdShopId: '',
        statusList: [1, 2],
        labelIdList
      }
      this.search.loading = true
      GetMemberList(params)
        .then((res) => {
          this.loading = false
          console.log(res, '列表数据')
          this.config.tableData = res.data.records
          this.config.total = +res.data.total
          this.search.loading = false
        })
        .catch(() => {
          this.loading = false
          this.search.loading = false
        })
    },
    init() {
      this.config.currentPage = 1
      this.getList()
      this.getLabeloption('')
    },
    handerSearch(res) {
      console.log(res, 'res')
      this.config.currentPage = 1
      this.search = res
      this.getList()
    },
    getLabeloption(query) {
      console.log('123123')
      this.labelLoading = true
      const params = {
        size: 20,
        current: 1,
        labelName: query
      }
      GetList(params)
        .then((res) => {
          if (res.data && res.data.records) {
            this.labelOption = res.data.records
          }
          this.labelLoading = false
        })
        .catch(() => {
          this.labelLoading = false
        })
    },
    // 点击勾选数据按钮
    sureGou() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选择数据')
      }
      this.$emit('successData', this.multipleSelection)
    },
    // 点击查询条件按钮
    sureSearchBtn() {
      if (this.search.user.value === '' && this.search.labelId.length === 0) {
        return this.$message.error('请设置查询条件')
      }
      this.$emit('successObj', this.search)
    }
  }
}
</script>

<style lang="scss" scoped>
.user_wrap {
  width: 100%;
  height: 100%;
  .search {
  }
  .table_content {
    width: 100%;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .nickName {
    display: flex;
    align-items: center;
  }
}
</style>
