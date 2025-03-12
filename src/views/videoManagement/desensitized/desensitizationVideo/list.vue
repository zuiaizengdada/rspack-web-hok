<template>
  <div class="myvideo-content">
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
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleListSizeChange"
      @current-change="handleListCurrentChange"
    >
      <div slot="headerLeft">
        <div class="fl">
          <el-form :inline="true" :model="videoForm" size="small" class="demo-form-inline">
            <el-form-item label="IP">
              <el-select
                v-model="videoForm.teacherId"
                filterable
                clearable
                placeholder="请选择"
                class="w-200"
                @change="searchFn"
              >
                <el-option
                  v-for="item in teacherArray"
                  :key="item.teacherId"
                  :label="item.teacherName"
                  :value="item.teacherId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="工程名称">
              <el-input v-model="videoForm.projectName" clearable placeholder="请输入" @change="searchFn" />
            </el-form-item>
            <el-form-item>
              <!-- <el-checkbox v-model="videoForm.myCreated" style="margin-right: 50px;" @change="searchFn">我创建的</el-checkbox> -->
              <el-button type="primary" @click="searchFn">查询</el-button>
              <el-button @click="clearSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="headerRight">
        <el-popover
          placement="bottom-end"
          width="180"
          trigger="click"
        >
          <p slot="reference" style="color:#0C6FFF;font-size:14px;" type="text" class="cursor-pointer flex items-center" size="small"><img :src="iconShezhi" class="mr-1" style="margin-top:2px;" />自定义表头</p>

          <el-checkbox v-model="allColumnsSelected" :disabled="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-checkbox
            v-for="item in config.tableColumns"
            :key="item.label"
            v-model="item.visible"
            v-dragging="{ item: item, list: config.tableColumns, group: 'item' }"
            :label="item.label"
            :disabled="item.disable"
            @change="handleCheckedTableColumnsChange(item)"
          >
            {{ item.label }}
          </el-checkbox>
        </el-popover>
      </div>
      <div slot="desensitizingVideoItemList" slot-scope="scope">
        <div v-if="scope.row.desensitizingVideoItemList && scope.row.desensitizingVideoItemList.length <= 3" class="ls">
          <el-tooltip v-for="(item,index) in scope.row.desensitizingVideoItemList" :key="index" class="item" effect="light" :content="item.name" placement="bottom">
            <span :class="item.desensitizedStatus === 3?'sb':''" :title="item.name">{{ item.name }}</span>
          </el-tooltip>
        </div>
        <div v-else-if="scope.row.desensitizingVideoItemList" class="ls">
          <el-tooltip class="item" effect="light" :content="scope.row.desensitizingVideoItemList[0].name" placement="bottom">
            <span :class="scope.row.desensitizingVideoItemList[0].desensitizedStatus === 3?'sb':''">{{ scope.row.desensitizingVideoItemList[0].name }}</span>
          </el-tooltip>
          <el-tooltip class="item" effect="light" :content="scope.row.desensitizingVideoItemList[1].name" placement="bottom">
            <span :class="scope.row.desensitizingVideoItemList[1].desensitizedStatus === 3?'sb':''" :title="scope.row.desensitizingVideoItemList[1].name">{{ scope.row.desensitizingVideoItemList[1].name }}</span>
          </el-tooltip>
          <el-tooltip class="item" effect="light" :content="scope.row.desensitizingVideoItemList[2].name" placement="bottom">
            <span :class="scope.row.desensitizingVideoItemList[2].desensitizedStatus === 3?'sb':''" :title="scope.row.desensitizingVideoItemList[2].name">{{ scope.row.desensitizingVideoItemList[2].name }}</span>
          </el-tooltip>
          <p class="loadmore" @click="showMore(scope.row.desensitizingVideoItemList)">更多({{ scope.row.desensitizingVideoItemList.length - 3 }})...</p>
        </div>
      </div>
      <div slot="desensitizedVideoItemList" slot-scope="scope">
        <div v-if="scope.row.desensitizedVideoItemList && scope.row.desensitizedVideoItemList.length <= 3" class="ls">
          <div v-for="(item,index) in scope.row.desensitizedVideoItemList" :key="index" class="mtls">
            <el-tooltip class="item" effect="light" :content="item.name" placement="bottom">
              <span :class="item.autoDesensitizedStatus === 3?'sb':''">{{ item.name }}</span>
            </el-tooltip>
            <showImgCom :statusd="item" />
          </div>
        </div>
        <div v-else-if="scope.row.desensitizedVideoItemList" class="ls">
          <div class="mtls">
            <el-tooltip class="item" effect="light" :content="scope.row.desensitizedVideoItemList[0].name" placement="bottom">
              <span :class="scope.row.desensitizedVideoItemList[0].autoDesensitizedStatus === 3?'sb':''">{{ scope.row.desensitizedVideoItemList[0].name }}</span>
            </el-tooltip>
            <showImgCom :statusd="scope.row.desensitizedVideoItemList[0]" />
          </div>
          <div class="mtls">
            <el-tooltip class="item" effect="light" :content="scope.row.desensitizedVideoItemList[1].name" placement="bottom">
              <span :class="scope.row.desensitizedVideoItemList[1].autoDesensitizedStatus === 3?'sb':''">{{ scope.row.desensitizedVideoItemList[1].name }}</span>
            </el-tooltip>
            <showImgCom :statusd="scope.row.desensitizedVideoItemList[1]" />
          </div>
          <div class="mtls">
            <el-tooltip class="item" effect="light" :content="scope.row.desensitizedVideoItemList[2].name" placement="bottom">
              <span :class="scope.row.desensitizedVideoItemList[2].autoDesensitizedStatus === 3?'sb':''">{{ scope.row.desensitizedVideoItemList[2].name }}</span>
            </el-tooltip>
            <showImgCom :statusd="scope.row.desensitizedVideoItemList[2]" />
          </div>
          <p class="loadmore" @click="showMoreTm(scope.row.desensitizedVideoItemList)">更多({{ scope.row.desensitizedVideoItemList.length - 3 }})...</p>
        </div>
      </div>
      <!-- 操作 -->
      <div slot="action" slot-scope="scope">
        <el-button type="text" style="color: #0C6FFF" @click="toDetail(scope.row)">详情</el-button>
        <el-button v-if="scope.row.hasTmVideoFlag && scope.row.isUploaderFlag" style="color: #0C6FFF" type="text" @click="toDesensitizationVideo(scope.row)">在线脱敏</el-button>
      </div>
      <div slot="footer" />
    </MPageLayout>
    <el-drawer
      title="自动脱敏中的视频"
      :visible.sync="drawer"
      :direction="direction"
      size="50%"
      style=" color: #333;font-size: 16px;font-weight: bold;"
      :with-header="false"
      append-to-body
    >
      <div class="ss-material-box-header">
        <div class="ss-material-box-header-title">自动脱敏中的视频</div>
        <i class="el-icon-close close" @click="drawer = false" />
      </div>
      <div class="desensiti_inline-block">
        <el-table
          :data="gridData"
          :header-cell-style="{background:'#F3F3F3'}"
        >
          <el-table-column property="name" label="视频名称">
            <template slot-scope="scope">
              <p style="color：#777;font-weight: normal;font-size: 14px;">{{ scope.row.name }}</p>
            </template>
          </el-table-column>
          <el-table-column property="uploaderName" width="100" label="上传者" />
          <el-table-column property="desensitizedStatus" width="120" label="脱敏状态">
            <template slot-scope="scope">
              <p v-if="scope.row.desensitizedStatus === 3" class="error-ls"><i class="el-icon-error" />脱敏失败</p>
              <p v-if="scope.row.desensitizedStatus === 2" class="success-ls"><i class="el-icon-success" />已完成</p>
              <p v-if="scope.row.desensitizedStatus === 1" class="chuli-ls"><i class="el-icon-warning" />处理中</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-drawer
      title="脱敏视频状态"
      style=" color: #333;font-size: 16px;font-weight: bold;"
      :visible.sync="drawerTm"
      :direction="direction"
      size="50%"
      :with-header="false"
      append-to-body
    >
      <div class="ss-material-box-header">
        <div class="ss-material-box-header-title">脱敏视频状态</div>
        <i class="el-icon-close close" @click="drawerTm = false" />
      </div>
      <div class="desensiti_inline-block">
        <el-table :header-cell-style="{background:'#F3F3F3'}" :data="gridDataTm">
          <el-table-column property="name" label="视频名称">
            <template slot-scope="scope">
              <p style="color：#777;font-weight: normal;font-size: 14px;">{{ scope.row.name }}</p>
            </template>
          </el-table-column>
          <el-table-column property="autoDesensitizedStatus" width="105" label="自动脱敏状态">
            <template slot-scope="scope">
              <p v-if="scope.row.autoDesensitizedStatus === 2" class="autod"><img src="@/assets/image/video/zdtm_hover.png" />已完成</p>
              <p v-else class="unauto"><img src="@/assets/image/video/zdtm.png" />未完成</p>
            </template>
          </el-table-column>
          <el-table-column property="manualDesensitizedStatus" width="105" label="人工脱敏视频">
            <template slot-scope="scope">
              <p v-if="scope.row.manualDesensitizedStatus === 2" class="rgdown"><img src="@/assets/image/video/sdtm_hover.png" />已完成</p>
              <p v-else class="unauto"><img src="@/assets/image/video/sdtm.png" />未完成</p>
            </template>
          </el-table-column>
          <el-table-column property="shareStatus" width="105" label="共享视频">
            <template slot-scope="scope">
              <p v-if="scope.row.shareStatus === 0" class="unauto"><img src="@/assets/image/video/gxsp.png" />未分享</p>
              <p v-if="scope.row.shareStatus === 1" class="shared"><img src="@/assets/image/video/gxsp_hover.png" />已分享</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import showImgCom from './components/showImgCom.vue'
import { mapGetters } from 'vuex'
import { teacherQueryByName } from '@/api/tearchCenter/index'
import { queryDesensitizeVideoList } from '@/api/product/videoManager'
export default {
  components: {
    showImgCom
  },
  data() {
    return {
      iconShezhi,
      loginLoadUserId: '',
      teacherArray: [],
      gridData: [],
      drawer: false,
      direction: 'rtl',
      drawerTm: false,
      gridDataTm: [],
      videoForm: {
        myCreated: true,
        teacherId: '',
        projectName: ''
      },
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'desensitizingVideoItemList', 'desensitizedVideoItemList', 'action', 'footer'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'name', label: '脱敏工程名称', width: 250, type: 'text', visible: true, disable: true },
          { prop: 'desensitizingVideoItemList', width: 300, label: '自动脱敏中的视频', type: 'slot', visible: true },
          { prop: 'desensitizedVideoItemList', label: '脱敏状态', width: 500, type: 'slot', visible: true },
          { prop: 'teacherName', label: 'IP', width: 150, type: 'text', visible: true },
          { prop: 'createTime', label: '工程生成时间', type: 'text', visible: true },
          { prop: 'action', label: '操作', width: 200, type: 'slot', visible: true, disable: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      search: '',
      multipleSelection: [],
      permsList: this.$route.meta.permsList || []
    }
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
    this.$dragging.$on('dragged', (res) => {
      localStorage.setItem('videoUsageStatization_tableColumns', JSON.stringify(this.config.tableColumns))
    })
  },
  activated() {
    const tableColumns = localStorage.getItem('videoUsageStatization_tableColumns')
    // eslint-disable-next-line no-undef
    this.loginLoadUserId = String(BigInt(this.userInfo.userId))
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    this.loadTearchList()
    this.searchFn()
  },
  created() {
    const tableColumns = localStorage.getItem('videoUsageStatization_tableColumns')
    // eslint-disable-next-line no-undef
    this.loginLoadUserId = String(BigInt(this.userInfo.userId))
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    this.loadTearchList()
    this.searchFn()
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    loadTearchList() {
      const params = {
        name: ''
      }
      teacherQueryByName(params).then((res) => {
        if (res.success) {
          this.teacherArray = res.data
        }
      })
    },
    showMore(data) {
      this.gridData = data
      this.drawer = true
    },
    showMoreTm(data) {
      this.drawerTm = true
      this.gridDataTm = data
    },
    toDetail(row) {
      this.$router.push({ path: `/videoManagement/desensitizationVideoDetail?desensitizedProjectId=${row.desensitizedProjectId}` })
    },
    toDesensitizationVideo(row) {
      const videoGroupId = row.videoGroupId
      const videoGroupName = row.name
      this.$router.push(`/subtitleEditor/${videoGroupId}?videoGroupName=${videoGroupName}`)
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('videoUsageStatization_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem('videoUsageStatization_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'name', label: '脱敏工程名称', width: 180, type: 'text', visible: true, disable: true },
        { prop: 'desensitizingVideoItemList', label: '自动脱敏中的视频', type: 'slot', visible: true },
        { prop: 'desensitizedVideoItemList', label: '脱敏状态', width: 400, type: 'slot', visible: true },
        { prop: 'teacherName', label: 'IP', width: 120, type: 'text', visible: true },
        { prop: 'createTime', label: '工程生成时间', width: 180, type: 'slot', visible: true },
        { prop: 'action', label: '操作', width: 200, type: 'slot', visible: true, disable: true }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('videoUsageStatization_tableColumns', JSON.stringify(tableColumns))
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    clearSearch() {
      this.videoForm.teacherId = ''
      this.videoForm.projectName = ''
      this.getList()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        projectName: this.videoForm.projectName,
        teacherId: this.videoForm.teacherId,
        createUserId: this.videoForm.myCreated ? this.loginLoadUserId : '',
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      console.log(params, 9889898)
      queryDesensitizeVideoList(params).then(res => {
        if (res.success) {
          this.loading = false
          this.config.total = res.data.total
          this.config.tableData = res.data.items
          this.config.tableData.some(item => {
            this.judeHasTmVideo(item)
            if (item.createUserId === this.loginLoadUserId) {
              item.isUploaderFlag = true
            } else {
              item.isUploaderFlag = false
            }
          })
        }
      })
    },
    judeHasTmVideo(item) {
      item.hasTmVideoFlag = false
      if (item && item.desensitizedVideoItemList) {
        item.desensitizedVideoItemList.some(obj => {
          if (obj.autoDesensitizedStatus === 2) {
            item.hasTmVideoFlag = true
          }
        })
      }
    },
    handleSizeChange(val) {
      this.roleUserModel.size = val
      this.getRoleUserList()
    },
    handleCurrentChange(val) {
      this.roleUserModel.current = val
      this.getRoleUserList()
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.myvideo-content {
  width: 100%;
  height: calc(100vh - 160px);
  ::v-deep .page_header {
    padding: 10px 0;
  }
  ::v-deep .my-table {
    margin: 0!important;
  }
  ::v-deep .my-table .element-table-list {
    border: none!important;
  }
  ::v-deep .el-form-item--small.el-form-item {
    margin-bottom: 0;
    margin-top: 10px;
  }
  .fl {
    padding-top: 0px;
    padding-bottom: 10px;
  }
  .datePicker {
    flex: 1 0 0;
  }
  .ls {
    width: 100%;
    span {
      width: 100%;
      display: inline-block;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow:ellipsis;
    }
    .sb {
      color: #F53F3F;
    }
    .loadmore {
      color: #0C6FFF;
      cursor: pointer;
    }
    .mtls {
      span {
        float: left;
        width: 70%;
      }
      .mgimg {
        width: 30%;
        display: inline-block;
        img {
          float: left;
          width: 23px;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }
  }
}

.error-ls {
  color: #F53F3F;
  background: #FEECEC;
  padding-left: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-radius: 12px;
  width: 90%;
  margin-right: 10%;
  i {
    margin-right: 3px;
  }
}
.success-ls {
  color: #00B42A;
  background: #E6F7EA;
  padding-left: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-radius: 12px;
  width: 90%;
  margin-right: 10%;
  i {
    margin-right: 3px;
  }
}

.chuli-ls {
  color: #FF7D00;
  background: #FFF2E6;
  padding-left: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-radius: 12px;
  width: 90%;
  margin-right: 10%;
  i {
    margin-right: 3px;
  }
}

.unauto {
  color: #999;
  img {
    width: 24px;
    margin-right: 8px;
    display: inline-block;
  }
}

.rgdown {
  color: #8A3FD4;
  img {
    width: 24px;
    margin-right: 8px;
    display: inline-block;
  }
}

.shared {
  color: #00C07A;
  img {
    width: 24px;
    margin-right: 8px;
    display: inline-block;
  }
}

.autod {
  color: #3CBFFF;
  img {
    width: 24px;
    margin-right: 8px;
    display: inline-block;
  }
}

.desensiti_inline-block {
  width: 100%;
  padding: 20px;
}
.desensiti_table {
  width: 100%;
}

.ss-material-box-header {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 52px;
  padding: 15px 20px;
  background: #fff;
  border-radius: 2px 2px 0 0;
  border-bottom: 1px solid #f2f2f2;
  color: #353535;
  font-size: 16px;
  font-weight: 500;
  .ss-material-box-header-title {
    font-weight: bold;
    color: #333333;
    max-width: 300px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
.close {
  color: #b2b2b2;
  margin-left: auto;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
::v-deep .tablePage .page_footer{
  justify-content: flex-end;
  box-shadow: none;
  padding:6px 0px 4px;
  height:auto;
}
::v-deep .page_header{
  padding: 0!important;
}
::v-deep .my-table{
  margin:0!important
}

::v-deep .has-gutter .el-table__cell{
  border-bottom:0!important;
}
::v-deep .has-gutter .el-table__cell .cell{
  color:#333;
}
::v-deep .el-table__body .el-table__cell .cell{
  color:#777
}
  ::v-deep .has-gutter tr .el-table__cell:first-child{
  border-radius: 5px 0 0 5px;
}
::v-deep .has-gutter tr .el-table__cell.is-leaf:nth-last-child(2){
  border-radius: 0 5px 5px 0;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label{
  color:#333;
}

</style>
<style>
.el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #ececec!important;
}

</style>
