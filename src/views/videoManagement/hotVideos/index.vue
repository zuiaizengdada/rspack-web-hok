<!-- 协议管理 -->
<template>
  <div class="page-content">
    <div class="title-container flex items-center">
      <em />
      <span> 近24小时爆款视频</span>
    </div>
    <div class="flex items-center opt_container">
      <ul class="tab-list flex items-center">
        <li
          :class="activeIndex === 0 ? 'tab_active' : ''"
          @click="checkList(0)"
        >
          爆款带货
        </li>
        <li
          :class="activeIndex === 1 ? 'tab_active' : ''"
          @click="checkList(1)"
        >
          爆款视频
        </li>
      </ul>
      <div class="tips-container flex items-center">
        <el-tooltip class="item" effect="dark" placement="top">
          <div slot="content">
            <p style="margin-bottom: 8px; line-height: 20px">
              带货爆款：24小时内账号总GMV≥10万，显示该账号24小时内的带货视频，并将溯源到的半成品自动共享
            </p>
            <p>
              爆款视频：24小时内发布的作品点赞数≥1万 或 播放数 ≥ 100万的视频
            </p>
          </div>
          <img
            src="@/assets/image/product/icon.png"
            style="width: 18px; height: 18px; margin-left: 10px"
          />
        </el-tooltip>
      </div>
    </div>
    <div class="page_wrap1">
      <filter-top
        :tearch-array="tearchArray"
        :search-form="searchForm"
        :dept-tree-array="deptTreeArray"
        :active-index="activeIndex"
        :user-array="userArray"
        @handleChangeTeacher="handleChangeTeacher"
        @tearchFilter="tearchFilter"
        @handleChangeUser="handleChangeUser"
        @visibleChangeD="visibleChangeD"
        @clear="clear"
        @getListForSearch="getListForSearch"
      />
      <!-- 内容区(爆款视频) -->
      <!-- :default-sort="getDefaultSort()" -->
      <MPageLayout
        v-if="isShow"
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
        @handleSelectionChange="handleSelectionChange"
        @sort-change="sortChange"
      >
        <div slot="openUrl" slot-scope="{ row }">
          <span v-if="row.title !== null">
            <el-tooltip
              class="item"
              effect="dark"
              :content="row.title"
              placement="bottom"
            >
              <a
                :href="row.openUrl"
                target="_blank"
                class="text_hidden"
                :style="row.openUrl !== null ? 'color: rgb(0, 0, 255)' : ''"
              >
                <span v-if="row.isNewVideo" class="isNew">新</span>
                <span
                  v-if="row.videoLabelType === 1"
                  class="commerce"
                >带货</span>
                <span>{{ row.title }}</span>
              </a>
            </el-tooltip>
          </span>
          <span v-else> -- </span>
        </div>
        <div slot="semiVideoName" slot-scope="{ row }">
          <el-tooltip
            v-if="row.semiVideoName !== null"
            class="item"
            effect="dark"
            :content="row.semiVideoName"
            placement="bottom"
          >
            <span
              class="flex text_hidden"
              style="color: rgb(0, 0, 255); cursor: pointer"
              @click="goSemiVideo(row)"
            >
              {{ row.semiVideoName }}
            </span>
          </el-tooltip>
          <span v-else> -- </span>
        </div>
        <div slot="desensitizedVideoName" slot-scope="{ row }">
          <el-tooltip
            v-if="row.desensitizedVideoName !== null"
            class="item"
            effect="dark"
            :content="`${row.desensitizedVideoName}`"
            placement="bottom"
          >
            <span
              class="flex text_hidden"
              style="color: rgb(0, 0, 255); cursor: pointer"
              @click="goDesensitizedVideo(row)"
            >
              {{ row.desensitizedVideoName }}
            </span>
          </el-tooltip>
          <span v-else> -- </span>
        </div>
        <div
          slot="accountName"
          slot-scope="{ row }"
          class="flex flex-middle userinfo"
        >
          <img
            :src="row.avatar"
            alt=""
            style="width: 36px; height: 36px; border-radius: 50%"
          />
          <img :src="row.platformavatar" alt="" class="platAcatar" />
          <span class="flex flex-column m-l-8">
            <span class="accountName"> {{ row.accountName }} </span>
            <span class="aboutDate"> {{ row.aboutDate }} </span>
          </span>
        </div>
        <div slot="" />
      </MPageLayout>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import {
  realHotSellingVideo,
  hotSellingVideo
} from '@/api/videoManagement/hotVideo'
import { deptTree } from '@/api/addressBookApi'
import { loadUserData, changeTeacher, tearchFilter } from '@/utils/videoMange'
import filterTop from './components/filterTop.vue'
import fxIconTime from '../../../assets/svg/fx-icon-time.svg'
import { tableColumns, tableColumns1, sortMap, sortMap1 } from './columns'
export default {
  components: {
    filterTop
  },
  data() {
    return {
      fxIconTime,
      sortMap,
      sortMap1,
      permsList: this.$route.meta.permsList || [],
      slotArr: [
        'action',
        'footer',
        'openUrl',
        'accountName',
        'semiVideoName',
        'desensitizedVideoName'
      ],
      loading: false,
      activeIndex: 0,
      isShow: true,
      userArray: [],
      userList: [],
      more: '',
      multipleSelection: [],
      platformArray: [],
      tearchArray: [],
      searchForm: {
        deptArray: [],
        timeArray: [
          moment().subtract(0, 'day').format('YYYY-MM-DD'),
          moment().subtract(0, 'day').format('YYYY-MM-DD')
        ],
        teacherId: '',
        operatorId: '',
        orderByParam: 0,
        videoType: 0,
        deptId: '',
        deptIdChain: '',
        sort: 0
      },
      deptArray: [],
      deptTreeArray: [],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: tableColumns,
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  created() {
    this.getList()
    this.loadUserNoPage()
    this.loadTreeData('')
    this.loadTeacherData()
  },
  methods: {
    getDefaultSort() {
      if (this.activeIndex === 0) {
        return {
          prop: 'videoFreeGmv',
          order: 'descending'
        }
      } else {
        return {}
      }
    },
    checkList(index) {
      if (this.activeIndex === index) {
        return
      }
      this.activeIndex = index
      this.isShow = false
      setTimeout(() => {
        this.isShow = true
      }, 0)
      this.config.tableColumns = index === 0 ? tableColumns : tableColumns1
      this.loadUserNoPage()
      this.loadTeacherData()
      this.clear()
    },
    async loadUserNoPage() {
      if (this.activeIndex === 0) {
        const { tearchArray, tearchList } = await loadUserData('hotVideosUser', 2)
        this.userArray = tearchArray
        this.userList = tearchList
      } else {
        const { tearchArray, tearchList } = await loadUserData('hotVideosUser1', 2)
        this.userArray = tearchArray
        this.userList = tearchList
      }
    },
    async handleChangeUser(data) {
      if (this.searchForm.operatorId) {
        if (this.activeIndex === 0) {
          const res = await changeTeacher(this.userList, this.userArray, 'hotVideosUser', this.searchForm.operatorId)
          this.userArray = res
        } else {
          const res = await changeTeacher(this.userList, this.userArray, 'hotVideosUser1', this.searchForm.operatorId)
          this.userArray = res
        }
      }
      this.getListForSearch(data)
    },
    goSemiVideo(row) {
      const toTaskLog = this.$router.resolve({
        path: `/clip/semifinishedProduct?semiVideoName=${row.semiVideoName}&activeName=sharevideo`
      })
      window.open(toTaskLog.href, '_blank')
    },
    // 剪辑工作台我的素材
    goDesensitizedVideo(row) {
      const obj = {
        code: `${row.videoTeacherName}${row.projectId}`,
        projectId: row.projectId,
        videoId: row.desensitizedVideoId,
        type: '2'
      }
      this.$store.commit('videoManage/SET_VIDEO_DETAIL', obj)
      localStorage.setItem('materialChooseObj', JSON.stringify(obj))
      // 新窗口打开
      this.$router.push({
        path: '/clip/clipWork'
      })
      // const toTaskLog = this.$router.resolve({ path: '/videoManagement/clipWork' })
      // window.open(toTaskLog.href, '_blank')
    },
    visibleChangeD(val) {
      this.searchForm.operatorId = ''
      this.loadUserNoPage()
      this.getListForSearch()
    },
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    findParents(treeData, id) {
      if (treeData.length === 0) return
      for (let i = 0; i < treeData.length; i++) {
        if (treeData[i].id === id) {
          treeData[i].disabled = false
          if (treeData[i].children) {
            this.setListItemDisable(treeData[i].children)
          }
          return []
        } else {
          if (treeData[i].children) {
            const res = this.findParents(treeData[i].children, id)
            if (res !== undefined) {
              return res.concat(treeData[i].id)
            }
          }
        }
      }
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    async loadTeacherData() {
      if (this.activeIndex === 0) {
        const { tearchArray, tearchList } = await loadUserData('hotVideosTearch', 1)
        this.tearchArray = tearchArray
        this.tearchList = tearchList
      } else {
        const { tearchArray, tearchList } = await loadUserData('hotVideosTearch1', 1)
        this.tearchArray = tearchArray
        this.tearchList = tearchList
      }
      this.tearchFilter('')
    },
    async tearchFilter(query) {
      console.log('搜索条件', query)
      const res = await tearchFilter(query, this.tearchList)
      this.tearchArray[0].isHidden = query.length > 0
      this.tearchArray[1].options = res
    },
    async handleChangeTeacher() {
      if (this.searchForm.teacherId) {
        if (this.activeIndex === 0) {
          const res = await changeTeacher(this.tearchList, this.tearchArray, 'hotVideosTearch', this.searchForm.teacherId)
          this.tearchArray = res
        } else {
          const res = await changeTeacher(this.tearchList, this.tearchArray, 'hotVideosTearch1', this.searchForm.teacherId)
          this.tearchArray = res
        }
      }
      this.getList()
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
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
      console.log(this.multipleSelection, 'this.multipleSelection')
      const sameScheduleIds = row.filter(
        i => row[0].id === i.id && i.id !== '0'
      ).length
      console.log(sameScheduleIds)
      this.canShowDownJob = sameScheduleIds === row.length
    },
    sortChange({ prop, order }) {
      this.searchForm.orderByParam =
        this.activeIndex === 0 ? this.sortMap1[prop] : this.sortMap[prop]
      if (order === 'descending') {
        this.searchForm.sort = 2
      } else if (order === 'ascending') {
        this.searchForm.sort = 1
      } else {
        this.searchForm.orderByParam = 0
        this.searchForm.sort = 0
      }
      this.getList()
    },
    clear() {
      this.config.currentPage = 1
      this.searchForm = {
        deptArray: [],
        timeArray: [
          moment().subtract(0, 'day').format('YYYY-MM-DD'),
          moment().subtract(0, 'day').format('YYYY-MM-DD')
        ],
        teacherId: '',
        operatorId: '',
        orderByParam: 0,
        videoType: '',
        deptId: '',
        deptIdChain: '',
        sort: 0
      }
      this.getList()
    },
    // 获取列表
    async getList() {
      this.loading = true
      console.log(this.searchForm)
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        startDate:
          this.searchForm.timeArray !== null &&
          this.searchForm.timeArray.length > 0
            ? this.searchForm?.timeArray[0]
            : '',
        endDate:
          this.searchForm.timeArray !== null &&
          this.searchForm.timeArray.length > 0
            ? this.searchForm?.timeArray[1]
            : '',
        operatorId: this.searchForm.operatorId,
        orderByParam: this.searchForm.orderByParam,
        deptId:
          this.searchForm.deptArray[this.searchForm.deptArray.length - 1] || '',
        deptIdChain: this.searchForm.deptArray.length
          ? '0-' + this.searchForm.deptArray.join('-')
          : '',
        orderBySort: this.searchForm.sort,
        teacherId: this.searchForm.teacherId
      }
      let res = null
      if (this.activeIndex === 0) {
        res = await hotSellingVideo(params)
      } else {
        res = await realHotSellingVideo({
          ...params,
          ...{
            videoType: this.searchForm.videoType
          }
        })
      }
      this.config.tableData = res.data.items
      this.config.total = res.data.total
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page-content {
  background: #fff;
  border-radius: 10px;
  padding: 0 20px;
  ::v-deep .el-tabs {
    height: 100%;
  }
}
.opt_container {
  margin-top: 20px;
}
.accountName {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #333333;
}
.aboutDate {
  font-size: 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 24px;
}
.isNew {
  padding: 2px 4px;
  background: #f98b8b;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  line-height: 20px;
  margin-right: 4px;
}
.commerce {
  padding: 2px 4px;
  background: #52d3b6;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
  text-align: center;
  margin-right: 4px;
}
.userinfo {
  position: relative;
  .platAcatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: absolute;
    bottom: 4px;
    left: 22px;
  }
}

.tab-list {
  background: #d8d8d8;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  li {
    cursor: pointer;
    padding: 4px 30px;
    box-sizing: border-box;
    border-radius: 3px 0px 0px 3px;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
  .tab_active {
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
  }
}
.title-container {
  position: relative;
  padding-top: 20px;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  em {
    width: 4px;
    height: 24px;
    margin-right: 8px;
    border-radius: 6px;
    background: rgb(12, 111, 255);
  }
}
.status_box {
  display: flex;
  align-items: center;
  width: 86px;
  height: 24px;
  border-radius: 12px;
  font-size: 12px;
}
.status_box1 {
  width: 74px;
  background: #fff2e6;
  color: #ff7d00;
}

.status_box2 {
  background: #e6f7ea;
  color: #00b42a;
}
.status_box3 {
  background: #feecec;
  color: #f53f3f;
}
.page_wrap1 ::v-deep {
  height: calc(100vh - 190px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  // padding-top: 15px;
  .tablePage {
    height: 600px;
  }
  .el-table::before {
    background-color: transparent;
  }
  .my-table {
    margin: 0 !important;
  }
}
</style>
