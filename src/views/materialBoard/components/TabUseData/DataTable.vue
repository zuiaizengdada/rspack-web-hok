<template>
  <div class="tabla-data-container">
    <div class="header flex justify-between">
      <Title class="title" title="数据明细" />
      <div v-if="activeIndex === 1">
        <el-select
          v-model="config.greatsType"
          style="margin-right: 12px"
          size="mini"
          clearable
          :placeholder="'查看点赞量'"
          @change="handleChangePlatform"
        >
          <el-option
            v-for="item in likeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          type="primary"
          :disabled="!Boolean(tableData.length)"
          :index="tableData.length"
          size="mini"
          @click="handleClickExport"
        >导出</el-button>
      </div>
      <div v-else>
        <el-select v-model="config.isUse" size="mini" placeholder="请选择" @change="handleClickSearch">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <el-form ref="useForm" inline :model="config" size="mini" class="m-t-20">
      <div class="flex flex-end">
        <div class="flex flex-wrap">
          <el-form-item label="视频组标题" prop="videoGroupTitle">
            <el-input
              v-model="config.videoGroupTitle"
              placeholder="请输入视频组标题"
              clearable
            />
          </el-form-item>
          <el-form-item label="原视频标题" prop="videoName">
            <el-input
              v-model="config.videoName"
              placeholder="请输入原视频标题"
              clearable
            />
          </el-form-item>
          <template v-if="activeIndex === 1">
            <el-form-item label="短视频标题" prop="worksTitle">
              <el-input
                v-model="config.worksTitle"
                placeholder="请输入短视频标题"
                clearable
              />
            </el-form-item>
            <el-form-item label="账号" prop="accountName">
              <el-input
                v-model="config.accountName"
                placeholder="请输入账号名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="运营者" prop="operatorId">
              <el-select
                v-model="config.operatorId"
                filterable
                clearable
                @change="updateFormOperator"
              >
                <el-option
                  v-for="item in operatortList"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                >
                  <span style="float: left">{{ item.nickName }}</span>
                  <span
                    v-if="item.status === 1"
                    style="float: right; color: #f53f3f; font-size: 13px"
                  >已离职</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="平台" prop="platformId">
              <el-select
                v-model="config.platformId"
                clearable
                @change="handleChangePlatform"
              >
                <el-option
                  v-for="item in platformList"
                  :key="item.platformId"
                  :label="item.platformName"
                  :value="item.platformId"
                />
              </el-select>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleClickSearch"
            >查询</el-button>
            <el-button plain @click="handleClickReset">重置</el-button>
          </el-form-item>
        </div>
        <!-- <el-form-item style="margin-right: 0;">
          <el-checkbox v-model="config.isFilter" class="m-l-10" @change="handleClickSearch">查看爆款作品</el-checkbox>
        </el-form-item> -->
      </div>
    </el-form>
    <el-table ref="table" :header-row-class-name="'tableClassName'" :data="tableData" @sort-change="sortChange">
      <el-table-column
        v-for="item in tableColumns"
        :key="item.id"
        :label="item.label"
        :prop="item.prop"
        :sortable="item.sortable"
      >
        <template slot-scope="scope">
          <a
            v-if="item.prop === 'title'"
            :href="scope.row.openUrl"
            target="_blank"
            class="video-title"
            :title="scope.row[item.prop]"
            :style="
              scope.row.openUrl ? 'color: #0c6fff;' : 'cursor: auto;'
            "
          >
            {{ scope.row[item.prop] }}
          </a>
          <span
            v-else-if="item.prop === 'usrNum'"
            :class="scope.row.usrNum?'usrNum':''"
            @click="showUsersNums(scope.row)"
          >
            {{ scope.row.usrNum }}
          </span>
          <span v-else-if="item.prop === 'teacherName'">{{ scope.row.teacherName ||'--' }}</span>
          <span v-else-if="item.prop === 'hotMarkNum'" :class="scope.row.hotMarkNum?'usrNum':''" @click="goHotMark(scope.row)">{{ scope.row.hotMarkNum }}</span>
          <span v-else-if="item.prop === 'groupName'" :title="scope.row.groupName" :class="scope.row.groupName?'usrNum video-title':'video-title'" @click="goVideoUsage(scope.row,1)"> {{ scope.row.groupName }} </span>
          <span
            v-else-if="item.prop === 'titleName'"
            :title="scope.row.titleName"
            :class="scope.row.titleName?'usrNum video-title':'video-title'"
            @click="goVideoUsage(scope.row,2)"
          >
            {{ scope.row.titleName }}
          </span>
          <span
            v-else
            :title="scope.row[item.prop]"
            class="video-title"
          >{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <div slot="empty" class="empty">
        <el-empty
          :image-size="70"
          description="暂无数据"
        />
      </div>
    </el-table>
    <div v-if="total > 0" class="flex flex-middle flex-between mt-2" :style="activeIndex === 0?'':''">
      <div>
        <div v-show="activeIndex === 1" class="flex flex-middle all-data">
          <span class="mr-20">播放量：{{ formatterForW(allData.reading) }}</span>
          <span class="mr-20">点赞量：{{ formatterForW(allData.greats) }}</span>
          <span>粉丝量：{{ formatterForW(allData.fans) }}</span>
        </div>
      </div>
      <el-pagination
        :current-page="config.pageIndex"
        :page-sizes="[10, 20, 40, 100]"
        :page-size="config.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleCurrentChange"
        @current-change="handleSizeChange"
      />
    </div>
    <users-nums
      ref="usersNums"
      :visible.sync="visible"
      :list="useList"
      :title="title"
      @close="close()"
    />
  </div>
</template>
<script>
import { columns, columns1 } from './columns'
import { userNoPage } from '@/api/addressBookApi'
import { getPlatform } from '@/api/videoManagement/accountManage'
import usersNums from './usersNums.vue'
import { likeList } from './constants'
import { formatterForW } from '@/utils'
import Title from '../Base/Title.vue'
export default {
  components: { usersNums, Title },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    allData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      columns,
      columns1,
      tableColumns: columns1,
      visible: false,
      title: '',
      likeList,
      useList: [],
      options: [
        {
          value: '2',
          label: '全部'
        },
        {
          value: '1',
          label: '已使用'
        },
        {
          value: '0',
          label: '未使用'
        }
      ],
      config: {
        pageIndex: 1,
        pageSize: 10,
        isUse: '2',
        videoGroupTitle: '', // 视频组名称
        greatsType: '',
        greatsNum: '', // 点赞排序 1-正序 2-倒序
        readingNum: '', // 播放排序 1-正序 2-倒序
        fansNum: '', // 粉丝排序 1-正序 2-倒序
        worksTitle: '', // 作品标题
        videoName: '', // 视频名称
        accountName: '',
        operatorId: '',
        platformId: ''
      },
      operatortList: [],
      platformList: [],
      permsList: this.$route.meta.permsList || [],
      tableData: [],
      total: 0
    }
  },
  watch: {
    data(val) {
      this.tableData = val.items
      this.total = val.total
    },
    activeIndex: {
      handler(val) {
        console.log(val, '当前选中的')
        if (val === 0) {
          this.tableColumns = [...this.columns1]
        } else if (val === 1) {
          setTimeout(() => {
            this.tableColumns = [...this.columns]
          }, 100)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getUserList()
    this.getPlatformList()
  },
  methods: {
    formatterForW,
    showUsersNums(row) {
      this.title = row.videoName
      this.useList = row.userList
      this.visible = true
    },
    goHotMark(row) {
      if (!row.hotMarkNum) return
      const toTaskLog = this.$router.resolve({
        path: `/showSemiVideoDetail/${row.projectId}?videoType=2&videoGroupName=${row.projectName}&videoId=${row.desensitizedVideoId}&fromType=3`
      })
      window.open(toTaskLog.href, '_blank')
    },
    close() {
      this.visible = false
    },
    handleSizeChange(val) {
      this.config.pageIndex = val
      this.$emit('search')
    },
    handleChangePlatform() {
      this.config.pageIndex = 1
      this.$emit('search')
    },
    updateFormOperator() {
      this.config.pageIndex = 1
      this.$emit('search')
    },
    handleCurrentChange(val) {
      this.config.pageIndex = 1
      this.config.pageSize = val
      this.$emit('search')
    },
    handleClickSearch() {
      this.config.pageIndex = 1
      this.$emit('search')
    },
    handleClickReset() {
      this.config.pageIndex = 1
      this.config.pageSize = 10
      this.config.videoGroupTitle = ''
      this.config.greatsType = ''
      this.config.worksTitle = ''
      this.config.videoName = ''
      this.config.accountName = ''
      this.config.operatorId = ''
      this.config.platformId = ''
      this.$emit('search')
    },
    async getPlatformList() {
      const res = await getPlatform()
      this.platformList = res.data
    },
    async getUserList() {
      const res = await userNoPage()
      this.operatortList = res.data
    },
    goVideoUsage(row, type) {
      console.log(row, type, '跳转')
      const toTaskLog = this.$router.resolve({
        path: `/productManagement/videoUsage?groupName=${encodeURIComponent(row.groupName)}&titleName=${encodeURIComponent(row.titleName)}&type=${type}`
      })
      window.open(toTaskLog.href, '_blank')
    },
    sortChange({ prop, order }) {
      this.config.readingNum = ''
      this.config.greatsNum = ''
      const configMap = {
        reading: {
          ascending: 1,
          descending: 2,
          default: ''
        },
        greats: {
          ascending: 1,
          descending: 2,
          default: ''
        }
      }
      this.config[prop + 'Num'] =
        configMap[prop][order] || configMap[prop].default
      this.$emit('search')
    },
    handleClickExport() {
      this.$emit('export')
    },
    reset() {
      this.config.pageIndex = 1
      this.config.pageSize = 10
      this.config.videoGroupTitle = ''
      this.config.greatsType = ''
      this.config.worksTitle = ''
      this.config.videoName = ''
      this.config.accountName = ''
      this.config.operatorId = ''
      this.config.platformId = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.tabla-data-container {
  margin-top: 20px;
}
.video-title{
  // 超出两行省略
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.all-data{
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
.usrNum{
  color: #0c6fff;
  cursor: pointer;
}
.flex-end {
  justify-content: space-between;
}
.usersNums {
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  color: #0c6fff;
}
::v-deep {
  .tableClassName>th{
    background: #F3F3F3 !important;
  }
}
.tableClassName{
  background: #F3F3F3 !important;
}
</style>
