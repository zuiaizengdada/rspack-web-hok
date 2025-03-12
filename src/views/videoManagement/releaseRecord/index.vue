<template>
  <div class="page-wrap">
    <!-- 成品检测 -->

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
          <el-form-item label="发布状态">
            <el-select
              v-model="search.status"
              filterable
              placeholder="请选择发布状态"
              clearable
              @change="getList"
            >
              <el-option
                v-for="item in republishArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> </el-select></el-form-item>
          <el-form-item label="作品标题">
            <el-input
              v-model="search.keywords"
              style="width: 200px"
              placeholder="请输入标题名称"
            />
          </el-form-item>
          <el-form-item label="发布日期">
            <el-date-picker
              v-model="search.timeArray"
              size="small"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
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
      <template slot="headerRight">
        <el-popover placement="bottom-end" width="150" trigger="click">
          <p
            slot="reference"
            style="
              color: #0c6fff;
              width: 100px;
              margin-top: 6px;
              font-size: 14px;
              cursor: pointer;
            "
            type="text"
            size="small"
          >
            <img
              :src="iconShezhi"
              class="mr-1"
              style="margin-top: 2px; float: left"
            />自定义表头
          </p>

          <el-checkbox
            v-model="allColumnsSelected"
            :disabled="allColumnsSelected"
            :indeterminate="allColumnsSelectedIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox
            v-for="item in config.tableColumns"
            :key="item.label"
            v-model="item.visible"
            v-dragging="{
              item: item,
              list: config.tableColumns,
              group: 'item'
            }"
            :disabled="item.disabled"
            @change="handleCheckedTableColumnsChange(item)"
          >
            {{ item.label }}
          </el-checkbox>
        </el-popover>
      </template>
      <!-- 操作 -->
      <div slot="cover" slot-scope="{ row }">
        <div class="img-for-cls" @click="toShowVideo(row)">
          <img
            :src="
              row.cover.indexOf('http') >= 0
                ? row.cover
                : getHuoshanPosterUrl(row.cover)
            "
          />
          <i class="el-icon-video-play" />
        </div>
      </div>
      <div slot="status" slot-scope="{ row }">
        <span v-if="row.status === 2" class="success-tag">
          <img src="../../../assets/image/account/icn_checked.png" />
          <em>发布成功({{ row.successCount }})</em>
        </span>
        <span v-if="row.status === 1" class="loadding-tag">
          <img src="../../../assets/image/account/icn_time.png" />
          <em>发布中({{ row.successCount + row.failCount }}/{{
            row.totalCount
          }})</em>
        </span>
        <span v-if="row.status === 3" class="error-tag">
          <img src="../../../assets/image/account/icn_error.png" />
          <em>发布失败({{ row.failCount }}/{{ row.totalCount }})</em>
        </span>
      </div>
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" @click="showVideo(row)">详情</el-button>
      </template>
      <template slot="footer" />
    </MPageLayout>
    <detail ref="detailShow" @loadData="getList" />
    <DownloadModal ref="DownloadModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import videoplayer from '../component/videoplayer/index.js'
import { getHuoshanPosterUrl } from '@/utils'
import { DateFormat } from '@/utils/index'
import { getReleaseRecord } from '@/api/videoManagement/accountManage'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import detail from './components/detail.vue'
import DownloadModal from '@/components/DownloadModal/index.vue'
export default {
  components: {
    detail,
    DownloadModal
  },
  data() {
    return {
      iconShezhi,
      republishArray: [
        { value: 1, label: '发布中' },
        { value: 2, label: '发布成功' },
        { value: 3, label: '发布失败' }
      ],
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: [
        'headerRight',
        'headerLeft',
        'cover',
        'status',
        'action',
        'footer'
      ],
      config: {
        tableData: [],
        tableColumns: [
          {
            prop: 'cover',
            label: '封面',
            width: 150,
            type: 'slot',
            visible: true
          },
          { prop: 'title', label: '作品标题', type: 'text', visible: true },
          { prop: 'status', label: '发布状态', type: 'slot', visible: true },
          {
            prop: 'createTime',
            label: '发布时间',
            type: 'text',
            visible: true
          },
          {
            prop: 'action',
            label: '操作',
            width: 80,
            type: 'slot',
            visible: true,
            disabled: true
          }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      search: {
        status: '', // 讲师
        keywords: '', // 关键词
        timeArray: [], // 时间范围
        startTime: '',
        endTime: ''
      },
      multipleSelection: [],
      permsList: this.$route.meta.permsList || [],
      getHuoshanPosterUrl
    }
  },
  computed: {
    ...mapGetters(['isNewSocketVideoPublish'])
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter(v => v.visible)
        if (arr.length === this.config.tableColumns.length) {
          this.allColumnsSelected = true
          this.allColumnsSelectedIndeterminate = false
        } else {
          this.allColumnsSelected = false
          this.allColumnsSelectedIndeterminate = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', res => {
      console.log(res)
      localStorage.setItem(
        'releaseRecord_table',
        JSON.stringify(this.config.tableColumns)
      )
    })
  },
  created() {
    // const tableColumns = localStorage.getItem('releaseRecord_table')
    // if (tableColumns) {
    //   this.config.tableColumns = JSON.parse(tableColumns)
    // }
    // this.getDefaultTime()
    this.$uweb && this.$uweb.setAction('Event_videoManage_publishRelease')
    console.log('baseUrlForImg: ', this.baseUrlForImg)
    this.getList()
  },
  methods: {
    resetData() {
      this.search = {
        status: '', // 讲师
        keywords: '', // 关键词
        timeArray: [], // 时间范围
        startTime: '',
        endTime: ''
      }
      // this.getDefaultTime()
      this.getList()
    },
    getDefaultTime() {
      const nowDate = new Date()
      const nowDataM = new Date()
      const sixMonthAgo = nowDate.setMonth(nowDate.getMonth() - 6)
      this.search.timeArray.push(sixMonthAgo)
      this.search.timeArray.push(nowDataM)
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem(
        'releaseRecord_table',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem(
        'releaseRecord_table',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        {
          prop: 'cover',
          label: '封面',
          width: 120,
          type: 'text',
          visible: true
        },
        { prop: 'title', label: '作品标题', type: 'text', visible: true },
        { prop: 'status', label: '发布状态', type: 'slot', visible: true },
        { prop: 'createTime', label: '发布时间', type: 'text', visible: true },
        {
          prop: 'action',
          label: '操作',
          width: 80,
          type: 'slot',
          visible: true,
          disabled: true
        }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('releaseRecord_table', JSON.stringify(tableColumns))
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        title: this.search.keywords,
        status: this.search.status,
        startTime:
          this.search.timeArray && this.search.timeArray[0]
            ? DateFormat(new Date(this.search.timeArray[0]), 'yyyy-MM-dd')
            : '',
        endTime:
          this.search.timeArray && this.search.timeArray[1]
            ? DateFormat(this.search.timeArray[1], 'yyyy-MM-dd')
            : '',
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      console.log('parraaassss: ', params)
      getReleaseRecord(params).then(res => {
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
    },
    // 清除搜索条件
    clearSearchFn() {
      this.search = {
        teacher: '', // 讲师
        keyWord: '', // 关键词
        time: ['', ''] // 时间范围
      }
    },
    toShowVideo(row) {
      this.$uweb && this.$uweb.setAction('Event_videoRelease_videoPreview')
      videoplayer.play({
        visible: true,
        url: row.finishVideoUrl,
        videoName: row.title,
        videoId: row.finishVideoId
      })
    },
    showVideo(row) {
      const isSocket = this.isNewSocketVideoPublish
      this.$uweb && this.$uweb.setAction('Event_videoRelease_videoDetail')
      if (isSocket) {
        this.$refs.detailShow.show(row)
      } else {
        this.$refs.DownloadModal.show()
      }
      /* console.log('dwwwwwwwwwwwwww:', row)
      const params = {
        taskId: row.taskId
      }
      getReleaseRecordDetail(params).then(res => {
        console.log('rreeeesss:', res)
        if (res.success) {
          row.arr = res.data
          this.$refs.detailShow.show(row)
        }
      })*/
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.page-wrap {
  @include responsive-height(20px);
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
