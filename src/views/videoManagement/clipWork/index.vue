<template>
  <div v-loading="loading" class="clipWork">
    <div class="clipWorkList">
      <div class="p-l-r-16">
        <mTabs :activename="activeName" @tabClick="handleClick" />
      </div>
      <!-- <filterTop ref="filterTop" class="p-l-r-16" @onTeacherSelect="onTeacherSelect" @keyWordChange="keyWordChange" @clear="onTeacherSelect" /> -->
      <div class="showSearch" @click="showSearch">
        <el-input
          ref="simulationSearch"
          size="mini"
          prefix-icon="el-icon-search"
          placeholder="支持IP/工程名/字幕搜索"
          clearable
        />
      </div>
      <div v-if="isSearch">
        <list ref="MList" :data="listData" @change="onhandeChange" />
        <div v-if="listData && listData.length > 0" class="pagination">
          <div>共{{ total }}条</div>
          <pagination
            :total="total"
            :current="current"
            :size="size"
            @currentChange="currentChange"
          />
        </div>
      </div>
      <div v-else class="my_tree">
        <myProjectFenzu
          v-if="activeName === 'ClipWorkMyProject'"
          ref="myProjectFenzu"
          @tohander="onhandeChange"
          @deleteNoData="deleteNoData"
        />
        <myMaterialFenzuVue
          v-if="activeName === 'ClipWorkMyMaterial'"
          @tohander="onhandeChange"
        />
        <shareFenzu
          v-if="activeName === 'ClipWorkShared'"
          ref="shareFenzu"
          @tohander="onhandeChange"
        />
      </div>
    </div>
    <div class="clipContent">
      <!-- 右侧区域 -->
      <ClipWorkMyProject
        v-show="activeName === 'ClipWorkMyProject'"
        ref="ClipWorkMyProjectChange"
        @handerTab="handerTab"
        @resetListData="resetList"
        @loadProjectFzData="loadProjectFzData"
      />
      <ClipWorkMyMaterial
        v-show="activeName === 'ClipWorkMyMaterial'"
        ref="ClipWorkMyMaterialChange"
        :project-id="currentItem.projectId"
        @handerTab="handerTab"
      />
      <ClipWorkShared
        v-show="activeName === 'ClipWorkShared'"
        ref="ClipWorkSharedChange"
        :project-id="currentItem.projectId"
        @handerTab="handerTab"
        @removeProject="removeProject"
      />
    </div>
    <searchDrawer ref="searchDrawer" @close="handleClose" />
  </div>
</template>

<script>
import ClipWorkMyProject from './myProject.vue'
import ClipWorkMyMaterial from './myMaterial.vue'
import ClipWorkShared from './myShared.vue'
import searchDrawer from './components/searchDrawer.vue'
// import filterTop from './components/filterTop.vue'
import list from './components/list.vue'
import pagination from './components/pagination.vue'
import mTabs from './components/mTabs.vue'
import {
  myProjectShaixuan,
  myMaterialsShaixuan,
  mySharedShaixuan
} from '@/api/videoManagement/clipWork'
import shareFenzu from '@/views/videoManagement/clipWork/components/shareFenzu'
import myProjectFenzu from '@/views/videoManagement/clipWork/components/myProjectFenzu'
import myMaterialFenzuVue from './components/myMaterialFenzu.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    ClipWorkMyProject,
    ClipWorkMyMaterial,
    ClipWorkShared,
    searchDrawer,
    // filterTop,
    list,
    pagination,
    mTabs,
    shareFenzu,
    myProjectFenzu,
    myMaterialFenzuVue
  },
  data() {
    return {
      isSearch: false,
      loading: false,
      activeName: '',
      total: 0,
      current: 1,
      size: 20,
      listData: [],
      search: {
        tearch: {
          tearchId: '',
          tearchName: ''
        },
        keyWord: ''
      },
      searchTeacherId: '',
      // 当前选中的列表项
      currentItem: {
        title: '',
        id: ''
      },
    }
  },
  computed: {
    ...mapGetters(['videoDetail'])
  },
  watch: {
    $route: {
      // $route可以用引号，也可以不用引号  监听的对象
      handler(val) {
        console.log('路由变化了', val)
      },
      deep: true, // 深度观察监听 设置为 true
      immediate: true // 第一次初始化渲染就可以监听到
    }
  },
  created() {},
  mounted() { 
    console.log(this.videoDetail, '视频详情')
    if (this.videoDetail?.type === '2') {
      this.handleClick('ClipWorkMyMaterial')
    } else if (this.videoDetail?.type === '3') {
      this.handleClick('ClipWorkShared')
    } else {
      this.handleClick('ClipWorkMyProject')
    }
    // this.$nextTick(() => {
    //   this.$refs.myProjectFenzu.selectNode(this.videoDetail)
    // })
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'VideoEditor') {
      this.$store.commit('videoManage/SET_VIDEO_DETAIL', {
        projectId: '',
        videoId: ''
      })
      localStorage.removeItem('myProjectChooseObj')
      localStorage.removeItem('materialChooseObj')
      localStorage.removeItem('shareChooseObj')
      localStorage.removeItem('materialTreeOpenCodeArr')
      localStorage.removeItem('myProjectTreeOpenCodeArr')
      localStorage.removeItem('shareTreeOpenCodeArr')
    }
    next()
  },
  destroyed() {},
  methods: {
    // 展示搜索框
    showSearch() {
      // 使simulationSearch失去焦点
      this.$refs.simulationSearch.blur()
      this.$refs.searchDrawer.show(this.activeName)
    },
    deleteNoData() {
      this.$refs.ClipWorkMyProjectChange.detailForm = null
    },
    handleClose() {
      this.$refs.myProjectFenzu.loadData()
    },
    loadProjectFzData() {
      this.$refs.myProjectFenzu.isDeleteFlag = true
      this.$refs.myProjectFenzu.loadData()
    },
    handleClick(name) {
      console.log(name, 'namename')
      this.search.keyWord = ''
      this.activeName = name
      console.log(this.$refs, 'dom')
      this.size = 20
      this.current = 1
      this.isSearch = false
      this.$refs.filterTop && this.$refs.filterTop.clear()
      if (this.$uweb) {
        if (name === 'ClipWorkMyProject') {
          this.$uweb.setAction('Event_clipWork_myProject_page')
        } else if (name === 'ClipWorkMyMaterial') {
          this.$uweb.setAction('Event_clipWork_myMaterial_page')
        } else if (name === 'ClipWorkShared') {
          this.$uweb.setAction('Event_clipWork_myShared_page')
        }
      }
    },
    removeProject() {
      localStorage.removeItem('shareChooseObj')
      this.$refs.shareFenzu.loadData()
    },
    // 分页改变触发
    currentChange(val) {
      this.current = val
      this.loading = true
      this.getList(this.activeName)
    },
    handerTab(val) {
      this.handleClick(val)
    },
    resetList(obj) {
      this.listData.some(item => {
        if (obj.projectId === item.projectId) {
          item.projectName = obj.projectName
        }
      })
      this.$refs.myProjectFenzu.resetUpdateDatas(obj)
    },
    // 获取列表数据
    getList(name) {
      this.loading = true
      const params = {
        pageSize: this.size,
        pageIndex: this.current,
        teacherId: this.search.tearch.tearchId,
        name: this.search.keyWord
      }
      if (params.teacherId === '' && params.name === '') {
        this.isSearch = false
        this.loading = false
        return
      } else {
        this.isSearch = true
      }

      if (name === 'ClipWorkMyProject') {
        myProjectShaixuan(params)
          .then(res => {
            this.listData = res.data.items
            this.total = res.data.total
            if (this.listData.length > 0) {
              this.currentItem = this.listData[0]
              this.$refs.MList.onClick(this.listData[0])
              this.$refs.ClipWorkMyProjectChange.current = 1
              // this.$refs.ClipWorkMyProject.getDownloadTaskNow(this.listData[0].projectId)
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else if (name === 'ClipWorkMyMaterial') {
        myMaterialsShaixuan(params)
          .then(res => {
            this.listData = res.data.items
            this.total = res.data.total
            if (this.listData.length > 0) {
              this.currentItem = this.listData[0]
              this.$refs.MList.onClick(this.listData[0])
              this.$refs.ClipWorkMyMaterialChange.loadData(
                this.listData[0].projectId
              )
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else if (name === 'ClipWorkShared') {
        mySharedShaixuan(params)
          .then(res => {
            this.listData = res.data.items
            this.total = res.data.total
            if (this.listData.length > 0) {
              this.currentItem = this.listData[0]
              this.$refs.MList.onClick(this.listData[0])
              this.$refs.ClipWorkSharedChange.loadData(
                this.listData[0].projectId
              )
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
        this.loading = false
      }
    },
    // 列表数据改变触发
    onhandeChange(item, videoId) {
      console.log(item, videoId, '列表改变触发')
      item.newVideoNum = 0
      this.currentItem = item
      if (this.activeName === 'ClipWorkMyProject') {
        this.$refs.ClipWorkMyProjectChange.current = 1
        this.$refs.ClipWorkMyProjectChange.getDetail(item.projectId, videoId)
        this.$refs.ClipWorkMyProjectChange.stopDownloadGetUrl = false
        // this.$refs.ClipWorkMyProjectChange.getDownloadTaskNow(item.projectId)
        // this.$refs.ClipWorkMyProject.handleCheckAllChange(false)
        // this.$refs.ClipWorkMyProjectChange.clearAllCheck()
      } else if (this.activeName === 'ClipWorkMyMaterial') {
        this.$refs.ClipWorkMyMaterialChange.loadData(item.projectId)
      } else if (this.activeName === 'ClipWorkShared') {
        this.$refs.ClipWorkSharedChange.loadData(item.projectId)
      }
    },
    // 筛选栏选择老师变化
    onTeacherSelect(item) {
      this.search.tearch.tearchId = item.teacherId
      this.search.tearch.tearchName = item.teacherName
      console.log(this.activeName, 'this.activeName')
      this.getList(this.activeName)
    },
    // 搜索关键词变化
    keyWordChange(val) {
      this.search.keyWord = val
      this.getList(this.activeName)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.clipWork {
  @include responsive-height(20px);
  width: 100%;
  .showSearch {
    margin: 16px;
  }
  .my_tree{
    flex: 1;
    display: flex;
  }
  .clipWorkList {
    float: left;
    width: 294px;
    height: 100%;
    background: #fff;
    border-radius: 10px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    .pagination {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding-left: 18px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #999999;
      line-height: 22px;
      user-select: none;
    }
  }
  .clipContent {
    float: left;
    width: calc(100% - 295px);
    padding-left: 16px;
    box-sizing: border-box;
    flex: 1 0 0;
    height: 100%;
  }
}
::v-deep {
  .el-tabs__header {
    margin: 0;
  }
}
.p-l-r-16 {
  padding-left: 16px;
  padding-right: 16px;
}
.delisting::v-deep {
  .el-dialog__header{
    padding-bottom: 0px;
  }
  .el-dialog--center .el-dialog__body {
    padding: 20px 25px 25px;
  }
  .delisting-tips {
    font-size: 16px;
    color: #333333;
    font-weight: 400;
  }
  .delisting-tips-text {
    color: #f1330d;
    font-weight: 600;
    font-size: 18px;
  }
  .el-dialog__title {
    // color: #f1330d;
    font-weight: 600;
    font-size: 22px;
  }
}
</style>
