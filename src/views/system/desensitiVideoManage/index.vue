<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="page_wrap1">
    <filter-top
      :search-form="searchForm"
      :config="config"
      @clear="clear"
      @addDesensitiVideo="addDesensitiVideo"
      @getListForSearch="getListForSearch"
    />
    <!-- 内容区(脱敏视频管理) -->
    <MPageLayout
      ref="MPageLayout"
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
      @sort-change="sortChange"
    >
      <div slot="videoUrl" slot-scope="{ row }">
        <div v-if="row.posterUrl" class="img-for-cls" @click="toShowVideo(row)">
          <img
            :src="
              row.posterUrl.indexOf('http') >= 0
                ? row.posterUrl
                : getHuoshanPosterUrl(row.posterUrl)
            "
          />
          <i class="el-icon-video-play" />
        </div>
      </div>
      <template slot="mandatoryFlag" slot-scope="{ row }">
        <span>{{ row.mandatoryFlag === 1 ? '必看' : '非必看' }}</span>
      </template>
      <div slot="action" slot-scope="{ row }">
        <el-button type="text" @click="edit(row)">编辑</el-button>
        <el-button
          type="text"
          style="color: red"
          @click="del(row)"
        >删除</el-button>
      </div>
    </MPageLayout>
    <add-video-dialog
      v-if="addDesensitiVideoDialog"
      ref="addVideoDialog"
      :row="row"
      :dialog-visible.sync="addDesensitiVideoDialog"
      @success="addSuccess"
    />
  </div>
</template>

<script>
import filterTop from './components/filterTop.vue'
import { getTrainingVideoList, deleteTrainingVideo } from '@/api/trainingVideo'
import AddVideoDialog from './components/addVideoDialog.vue'
import { getHuoshanPosterUrl } from '@/utils'
export default {
  components: {
    filterTop,
    AddVideoDialog
  },
  data() {
    return {
      getHuoshanPosterUrl,
      slotArr: ['action', 'footer', 'videoUrl', 'mandatoryFlag'],
      loading: false,
      addDesensitiVideoDialog: false,
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          {
            prop: 'videoName',
            label: '视频名称',
            type: 'text',
            visible: true,
            disable: true
          },
          {
            prop: 'videoUrl',
            label: '视频预览',
            type: 'slot',
            visible: true,
            disable: true
          },
          {
            prop: 'bindEventName',
            label: '绑定事件ID',
            type: 'text',
            visible: true
          },
          {
            prop: 'mandatoryFlag',
            label: '是否必看',
            type: 'slot',
            visible: true
          },
          {
            prop: 'createBy',
            label: '创建者',
            type: 'text',
            visible: true
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'text',
            visible: true
          },
          {
            prop: 'action',
            label: '操作',
            width: 190,
            type: 'slot',
            visible: true,
            disable: true
          }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      searchForm: {
        videoName: ''
      },
      row: {}
    }
  },
  created() {
    this.userInfo = this.$store.getters.userInfo
    this.getList()
  },
  methods: {
    addSuccess() {
      this.addDesensitiVideoDialog = false
      this.getListForSearch()
    },
    del(record) {
      this.$confirm('确定删除该视频吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteTrainingVideo({
          trainingVideoId: record.trainingVideoId + ''
        })
        if (res.code === 1) {
          this.$message.success('删除成功')
          this.getListForSearch()
        }
      })
    },
    edit(record) {
      this.row = {
        ...record,
        videoFirstimgsrc:
          record.posterUrl.indexOf('http') >= 0
            ? record.posterUrl
            : getHuoshanPosterUrl(record.posterUrl)
      }

      this.addDesensitiVideoDialog = true
    },
    toShowVideo(row) {
      this.$Videoplayer({
        src: row.videoUrl,
        videoName: row.videoName
      })
    },
    addDesensitiVideo() {
      this.row = {}
      this.addDesensitiVideoDialog = true
    },
    // 页码改变触发
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.config.pageSize = val
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    getListForSearch(data) {
      this.config.currentPage = 1
      this.searchForm = { ...this.searchForm, ...data }
      this.getList()
    },
    clear() {
      this.searchForm = {
        videoName: ''
      }
      this.getListForSearch()
    },
    sortChange(data) {
      this.config.tableColumns.forEach(item => {
        if (item.prop === data.prop) {
          item.sort = data.order
        } else {
          item.sort = null
        }
      })
      this.getList()
    },
    async getList() {
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        ...this.searchForm
      }
      this.loading = true
      const res = await getTrainingVideoList(params)
      if (res.success) {
        this.loading = false
        this.config.tableData = res.data.items
        this.config.currentPage = res.data.pageIndex
        this.config.pageSize = res.data.pageSize
        this.config.total = res.data.total
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.accountStatus {
  display: flex;
  .accountStatus1,
  .accountStatus2 {
    display: flex;
    align-items: center;
    height: 24px;
    box-sizing: border-box;
    border-radius: 12px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    img {
      margin-left: 10px;
      margin-right: 4px;
      width: 14px;
      height: 14px;
    }
  }
  .accountStatus1 {
    color: #717f99;
    width: 62px;
    background: #eef2f9;
  }
  .accountStatus2 {
    color: #860cff;
    width: 88px;
    background: #fbf5ff;
  }
}
.page_wrap1 ::v-deep {
  height: calc(100vh - 100px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding-top: 15px;
  .tablePage {
    height: 600px;
  }
  .el-table::before {
    background-color: transparent;
  }
}
.details-container ::v-deep {
  padding: 0 20px;
  // padding-bottom: 0px;
  .form-breadcrumb {
    padding-bottom: 15px;
    border-bottom: 1px solid #eff2f6;
  }
  .tool-block {
    padding: 20px 0;
    .plus-btn {
      margin-right: 5px;
      font-weight: bold;
    }
  }
}

.photoUrl {
  width: 70px;
  height: 80px;
  border-radius: 4px;
  background: rgb(250, 250, 250);
}
.experience {
  width: 135px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333;
}
.search_for_button {
  margin-left: 10px;
  ::v-deep .el-button--primary.is-plain {
    border: 1px solid #0c6fff;
    color: #0c6fff;
    background: none !important;
  }
  .add_account {
    margin-right: 5px;
    font-weight: bold;
  }
}

.login-success {
  color: #00b42a;
}
.login-error {
  em {
    font-style: normal;
    color: #f53f3f;
    text-align: center;
    width: 100%;
    float: left;
  }
  ::v-deep .el-button {
    width: 80px;
  }
}
.plat-form-line {
  img {
    float: left;
    width: 36px;
    height: 36px;
    border-radius: 100%;
  }
  span {
    line-height: 36px;
    margin-left: 8px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
  }
}
.del-cls {
  color: #f53f3f;
}
.item-tips {
  float: left;
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
