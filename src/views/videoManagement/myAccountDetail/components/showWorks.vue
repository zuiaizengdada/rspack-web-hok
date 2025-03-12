<template>
  <div class="data_show">
    <div class="top_search">
      <div class="search_title">
        <span class="title_span">
          <em />
          <p>全部作品</p>
        </span>
        <!-- <div class="right_time_choose-s">
          <el-button style="float: right; margin-left: 20px; margin-top: -5px;" type="text" @click="downloadData">导出数据</el-button>
        </div> -->
      </div>
    </div>
    <div class="table-block">
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
        @size-change="handleListSizeChange"
        @current-change="handleListCurrentChange"
        @sort-change="sortChange"
      >
        <div slot="frontCoverImage" slot-scope="{ row }">

          <div class="img-for-cls" @click="toShowVideo(row)">
            <picture :class="row.coverDirection === 2?'hengping-cls':'suping-cls'">
              <source type="image/webp" :srcset="row.frontCoverImage" />
              <img :class="row.coverDirection === 1?'hengping-cls':'suping-cls'" :src="row.frontCoverImage" />
            </picture>
            <i class="el-icon-video-play" />
          </div>
        </div>
        <div slot="title" slot-scope="{row}">
          <el-tooltip class="item" effect="dark" :content="row.title" placement="bottom">
            <p>{{ row.title }}</p>
          </el-tooltip>
        </div>
        <div slot="reading" slot-scope="{row}">
          <p>{{ formatterForNumber(row.reading) }}</p>
        </div>
        <div slot="addFans" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addFans) }}</p>
        </div>
        <div slot="greats" slot-scope="{row}">
          <p>{{ formatterForNumber(row.greats) }}</p>
        </div>
        <div slot="comment" slot-scope="{row}">
          <p>{{ formatterForNumber(row.comment) }}</p>
        </div>
        <div slot="shared" slot-scope="{row}">
          <p>{{ formatterForNumber(row.shared) }}</p>
        </div>
        <!-- <div slot="collection" slot-scope="{row}">
          <p>{{ formatterForNumber(row.collection) }}</p>
        </div> -->
        <div slot="footer" />
      </MPageLayout>
    </div>
  </div>
</template>

<script>
import { getAccountAllWorks, downloadFors } from '@/api/videoManagement/dataApi'
export default {
  name: 'DataShowBlock',
  props: {
    platformAccountId: {
      type: String,
      default: ''
    },
    platformId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dateRangeCache: {},
      loading: false,
      slotArr: ['action', 'footer', 'frontCoverImage', 'title', 'reading', 'greats', 'comment', 'shared', 'collection', 'addFans'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'frontCoverImage', label: '视频', width: 180, type: 'slot', visible: true, disable: true },
          { prop: 'title', label: '作品名称', width: 200, type: 'slot', visible: true, disable: true },
          { prop: 'releaseTime', label: '发布时间', type: 'text', visible: true, disable: true },
          { prop: 'reading', label: '播放量', type: 'slot', sortable: true, visible: true, disable: false },
          { prop: 'greats', label: '点赞数', type: 'slot', sortable: true, visible: true, disable: false },
          { prop: 'comment', label: '评论数', type: 'slot', sortable: true, visible: true, disable: false },
          { prop: 'shared', label: '分享数', type: 'slot', sortable: true, visible: true, disable: false }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0,
        orderByParam: 0,
        orderByWay: 0
      },
      downloadUrl: ''
    }
  },
  watch: {
    platformId: {
      handler(val) {
        if (val) {
          if (val === 24) {
            // 删除tableColumns最后一项
            this.config.tableColumns.splice(this.config.tableColumns.length - 1, 1)
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    formatterForNumber(num) {
      return num !== null ? String(num).replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,') : 0
      // return String(num).replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
    },
    loadData(data) {
      this.dateRangeCache = data || this.dateRangeCache
      console.log(data, this.platformId, 'loaddata')
      console.log(this.dateRangeCache, this.platformId, 'dateRangeCache')
      const params = {
        platformAccountId: this.platformAccountId,
        startTime: this.dateRangeCache.startTime,
        endTime: this.dateRangeCache.endTime,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        orderByParam: this.config.orderByParam,
        orderByWay: this.config.orderByWay
      }
      getAccountAllWorks(params).then(res => {
        if (res.success) {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.config.currentPage = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          console.log('tableData::::::::', this.config.tableData)
        }
      })
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.loadData()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.loadData()
    },
    sortChange(val) {
      if (val.prop === 'reading') {
        this.config.orderByParam = 1
      }
      if (val.prop === 'greats') {
        this.config.orderByParam = 2
      }
      if (val.prop === 'comment') {
        this.config.orderByParam = 3
      }
      if (val.prop === 'shared') {
        this.config.orderByParam = 4
      }
      if (val.prop === 'collection') {
        this.config.orderByParam = 5
      }
      if (val.prop === 'addFans') {
        this.config.orderByParam = 6
      }
      if (val.order === 'descending') {
        this.config.orderByWay = 0
      }
      if (val.order === 'ascending') {
        this.config.orderByWay = 1
      }
      this.loadData()
    },
    downloadData() {
      const params = {
        platformAccountId: this.platformAccountId,
        startTime: this.searchForDetail.time[0],
        endTime: this.searchForDetail.time[1],
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        orderByParam: this.config.orderByParam,
        orderByWay: this.config.orderByWay
      }
      downloadFors(params).then(async res => {
        if (res.success) {
          const merges = []
          const dataArr = []
          this.config.tableData.some(item => {
            const obj = {
              title: item.title,
              releaseTime: item.releaseTime,
              reading: item.reading,
              greats: item.greats,
              comment: item.comment,
              shared: item.shared
            }
            dataArr.push(obj)
          })
          const tHeader1 = ['作品标题', '发布时间', '播放数', '点赞数', '评论数', '分享数']
          const arr = ['title', 'releaseTime', 'reading', 'greats', 'comment', 'shared']
          var downEx = new this.ExportExcel(dataArr, tHeader1, merges, arr, res.data.substring(res.data.lastIndexOf('/'), res.data.lastIndexOf('.')))
          downEx.export2Excel()
        }
      })
    },
    toShowVideo(row) {
      /* videoplayer.play({
        visible: true,
        url: row.openUrl,
        videoName: row.title,
        videoId: ''
      }) */
      console.log(row)
      window.open(row.openUrl, '_blank')
    }
  }
}
</script>

  <style scoped lang="scss">
  .data_show {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    .top_search {
    width: 100%;
    height: 35px;
    .search_title {
        width: 100%;
        height: 32px;
        .title_span {
            color: #333;
            height: 24px;
            font-size: 16px;
            line-height: 24px;
            margin-right: 10px;
            p {
                float: left;
                line-height: 24px;
                font-weight: bold;
            }
            em {
                float: left;
                width: 4px;
                height: 24px;
                border-radius: 6px;
                background: #0c6fff;
                margin-right: 8px;
            }
        }
        .right_time_choose-s {
            float: right;
            height: 32px;
        }
    }

    .form_search {
        width: 100%;
        height: 45px;
        padding-top: 12px;
    }
    }
  }

  .table-block {
    width: 100%;
    ::v-deep .tablePage .page_header {
        min-height: 0px!important;
        padding: 0px!important;
    }
    ::v-deep .tablePage .page_content{
        padding: 0!important;
        padding-bottom: 10px!important;
    }
    ::v-deep .my-table {
        margin: 0!important;
        min-height: 500px!important;
    }
    ::v-deep .el-table__body-wrapper {
        min-height: 500px;
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

