<template>
  <div class="page-wrap">
    <!--表格渲染-->
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableData.length > 0 ? config.tableColumns : []"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleListSizeChange"
      @current-change="handleListCurrentChange"
    >
      <template slot="headerLeft">
        <!-- 搜索栏 -->
        <el-form :model="search" :inline="true" size="small">
          <el-form-item label="上报时间">
            <el-date-picker
              v-model="search.timeArray"
              class="m-l-10 datePicker"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="运营者">
            <el-select
              v-model="search.operatorId"
              filterable
              placeholder="请选择"
              clearable
              @change="getListForSearch"
            >
              <el-option
                v-for="item in userArray"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              >
                <span style="float: left">{{ item.nickName }}</span>
                <span
                  v-if="item.status === 1"
                  style="float: right; color: #f53f3f; font-size: 13px"
                >已离职</span></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上报问题">
            <el-select v-model="search.type" placeholder="请选择">
              <el-option
                v-for="item in republishArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="自媒体账号">
            <el-input
              v-model="search.name"
              style="width: 200px"
              placeholder="输入自媒体账号关键字"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="m-l-10"
              size="small"
              type="primary"
              @click="searchFn"
            >查询</el-button>
            <el-button @click="resetData">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" @click="showVideo(row)">详情</el-button>
      </template>
      <template slot="footer" />
    </MPageLayout>
  </div>
</template>

<script>
import { DateFormat } from '@/utils/index'
import { qryMediaProblemList } from '@/api/videoManagement/accountManage'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import { userNoPage } from '@/api/addressBookApi'
import { columns } from './columns'
export default {
  data() {
    return {
      iconShezhi,
      republishArray: [
        { value: 1, label: '未授权' },
        { value: 2, label: '同步失败' },
        { value: 3, label: '同步中' }
      ],
      loading: false,
      userArray: [],
      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer'
      ],
      config: {
        tableData: [],
        tableColumns: columns,
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        operatorId: '', // 运营者
        type: '', // 问题类型 1-未授权 2-同步失败 3-同步中
        name: '', // 关键词
        timeArray: [], // 时间范围
        startTime: '',
        endTime: ''
      }
    }
  },
  mounted() {
  },
  created() {
    this.loadUserNoPage()
    this.getList()
  },
  methods: {
    getListForSearch() {
      this.config.currentPage = 1
      this.getList()
    },
    resetData() {
      this.search = {
        operatorId: '', // 运营者
        type: '', // 问题类型 1-未授权 2-同步失败 3-同步中
        name: '', // 关键词
        timeArray: [], // 时间范围
        startTime: '',
        endTime: ''
      }
      this.getList()
    },
    loadUserNoPage() {
      const params = {}
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        operatorId: this.search.operatorId,
        type: this.search.type,
        name: this.search.name,
        startTime:
          this.search.timeArray && this.search.timeArray[0]
            ? DateFormat(new Date(this.search.timeArray[0]), 'yyyy-MM-dd')
            : '',
        endTime:
          this.search.timeArray && this.search.timeArray[1]
            ? DateFormat(new Date(this.search.timeArray[1]), 'yyyy-MM-dd')
            : ''
      }
      console.log('parraaassss: ', params)
      qryMediaProblemList(params).then(res => {
        console.log(res)
        if (res.success) {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.config.currentPage = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
        }
      })
      this.loading = false
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 搜索
    searchFn() {
      this.getList()
    }
  }
}
</script>

  <style lang='scss' scoped>
.page-wrap {
  // height: 100%;
  height: calc(100vh - 100px);
  background: #fff;
  border-radius: 10px;
  ::v-deep {
    .page_header {
      padding: 20px 20px 0;
      .page_header_action {
        align-items: flex-start;
      }
    }
  }
  ::v-deep .el-table__empty-block {
    background: url(../../../assets/image/video/icn_nodata.png) no-repeat;
    background-position: center 40%;
  }
  ::v-deep .el-table__empty-text {
    margin-top: 150px;
  }
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333;
}

.keywordsString-cls {
  width: 100%;
  cursor: pointer;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; // 默认不换行；
}

.success-tag {
  width: 100%;
  float: left;
  img {
    float: left;
    margin-top: 5px;
    margin-right: 8px;
    width: 14px;
    height: 14px;
  }
  color: #00b42a;
  em {
    float: left;
    font-style: normal;
  }
}

.loadding-tag {
  width: 100%;
  float: left;
  img {
    float: left;
    margin-top: 5px;
    margin-right: 8px;
    width: 14px;
    height: 14px;
  }
  color: #ff7d00;
  em {
    float: left;
    font-style: normal;
  }
}

.error-tag {
  width: 100%;
  float: left;
  img {
    float: left;
    margin-top: 5px;
    margin-right: 8px;
    width: 14px;
    height: 14px;
  }
  color: #f53f3f;
  em {
    float: left;
    font-style: normal;
  }
}

.img-for-cls {
  position: relative;
  text-align: center;
  cursor: pointer;
  width: 45px;
  height: 60px;
  background: #eee;
  img {
    max-height: 60px;
    max-width: 45px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  i {
    position: absolute;
    z-index: 11;
    top: 50%;
    left: 50%;
    font-size: 20px;
    margin: -10px 0 0 -10px;
    border-radius: 100%;
    color: #fff;
  }
}
</style>
