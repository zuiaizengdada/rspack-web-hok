<template>
  <div class="videoStatistics-wrapper">
    <div class="fl">
      <el-form
        :inline="true"
        :model="searchForm"
        size="small"
        class="demo-form-inline"
      >
        <el-form-item label="日期">
          <el-date-picker
            v-model="searchForm.timeArray"
            class="m-l-10 datePicker"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            type="daterange"
            :clearable="true"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getFormSearch"
          />
        </el-form-item>
        <el-form-item label="IP">
          <el-select
            v-model="searchForm.teacherId"
            clearable
            filterable
            placeholder="请选择IP"
            @change="handleChangeTeacher"
          >
            <el-option-group
              v-for="group in tearchArray"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.teacherId"
                :label="item.teacherName"
                :value="item.teacherId"
              >
                <span class="flex flex-between"><span>{{ item.teacherName }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="标记">
          <el-select
            v-model="hotMarkTypeIdValue"
            filterable
            placeholder="请选择"
            clearable
            multiple
            collapse-tags
            @change="getFormSearch"
          >
            <el-option
              v-for="item in tagList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="视频名称">
          <el-input
            v-model="searchForm.videoName"
            placeholder="视频名称"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="activeName !== 'first'" label="标记描述">
          <el-input
            v-model="dynamicValue"
            placeholder="标记描述"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getFormSearch">查询</el-button>
          <el-button @click="clearSearchData">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="flex flex-right m-b-20">
      <el-button size="mini" @click="exportTable">导出当前页</el-button>
      <el-button
        v-permission="['web:productManagement:tagManage', permsList]"
        size="mini"
        type="primary"
        @click="tagEditManage"
      >标记分类管理</el-button>
    </div>
    <div class="flex table_content">
      <div v-loading="loading" class="table-item m-r-20" style="width: 330px">
        <el-table
          :header-row-class-name="'tableClassName'"
          :data="hotMarkTypeList"
          :row-class-name="tableRowClassName"
          height="100%"
          @row-click="setRightTableData"
        >
          <el-table-column prop="name" label="标记名称" align="left">
            <template slot-scope="scope">
              <div class="flex flex-middle">
                <span
                  :style="`background:${getPrColor(scope.row.color) || 'fff'}`"
                  class="tipsBgColor"
                />
                <span
                  style="flex: 1"
                  class="text_hidden"
                  :title="scope.row.name"
                >{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="markCount" label="标记数" align="center" />
          <div slot="empty" class="empty">
            <el-empty :image-size="70" description="暂无数据" />
          </div>
        </el-table>
      </div>
      <div
        v-loading="loading"
        class="table-item right-item overflowOuto"
        style="flex: 1"
      >
        <el-table
          ref="rightTable"
          :key="tableKey"
          :header-row-class-name="'tableClassName'"
          height="100%"
          :data="config.tableData"
          @row-click="showDetails"
        >
          <el-table-column
            v-for="item in config.tableColumns"
            :key="item.label"
            :width="item.width"
            :label="item.label"
            :prop="item.prop"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <span
                v-if="item.prop === 'videoName'"
                class="my-video text_hidden"
              >
                <span class="link_to">{{ scope.row[item.prop] }}</span>
              </span>
              <span
                v-else-if="item.prop === 'hotMarkTypeName'"
                class="typeName flex flex-middle"
              >
                <span
                  :style="`background:${getPrColor(
                    getColor(scope.row.hotMarkTypeId)
                  )}`"
                  class="typeName-tips"
                />
                <span
                  style="flex: 1"
                  class="text_hidden"
                  :title="scope.row.name"
                >{{ scope.row[item.prop] }}</span>
              </span>
              <span
                v-else-if="item.prop === 'hotMarkRemarks'"
                class="typeName flex flex-middle"
              >
                <span :title="scope.row[item.prop]" class="text_hidden">{{
                  scope.row[item.prop]
                }}</span>
              </span>
              <span
                v-else-if="item.prop === 'subtitleContent'"
                class="text_hidden"
                :title="scope.row[item.prop]"
              >
                <span>{{ scope.row[item.prop] }}</span>
              </span>
              <span v-else>{{ scope.row[item.prop] || '--' }}</span>
            </template>
          </el-table-column>
          <div slot="empty" class="empty">
            <el-empty :image-size="70" description="暂无数据" />
          </div>
        </el-table>
        <div
          v-if="config.tableData.length > 0"
          class="my-pagination flex justify-end mt-2"
        >
          <el-pagination
            :current-page="config.currentPage"
            :page-sizes="[10, 20, 40, 100]"
            :page-size="config.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="config.total"
            @size-change="handleSizeChange"
            @current-change="handleListCurrentChange"
          />
        </div>
      </div>
    </div>
    <TagEdit
      :hot-mark-type-list="hotMarkEditList"
      :active-name="activeName"
      :drawer.sync="drawer"
      @close="closeDrawer"
      @addTagMark="addTagMark"
    />
    <TagDetails
      :active-name="activeName"
      :video-details="videoDetails"
      :drawer-details.sync="drawerDetails"
      @close="closeDrawerDetails"
    />
  </div>
</template>

<script>
import {
  hotMarkTypeList,
  queryHotMarkPage,
  hotMarkTypeStatistics,
  hotMarkTypeEditList,
  queryMarkSubtitle,
  sensitiveQueryMarkSubtitle,
  sensitiveMarkTypeList,
  querySensitiveMarkPage,
  sensitiveMarkTypeStatistics,
  sensitiveMarkTypeEditList
} from '@/api/product/tagManage'
import { searchDeliveryData } from '@/api/product/setting'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import { teacherQueryByName } from '@/api/tearchCenter/index'
import { userNoPage } from '@/api/addressBookApi'
import { columns } from '../columns'
import TagEdit from './tagEdit'
import TagDetails from './tagDetails'
export default {
  components: { TagEdit, TagDetails },
  props: {
    activeName: {
      type: String,
      default: 'first'
    }
  },
  data() {
    return {
      tearchArray: [],
      tearchList: [],
      columns: Object.assign([], columns),
      userArray: [],
      senceOptions: [],
      iconShezhi,
      deptTreeArray: [],
      drawer: false,
      drawerDetails: false,
      permsList: this.$route.meta.permsList || [],
      tableData: [],
      hotMarkTypeList: [],
      videoDetails: {},
      hotMarkEditList: [],
      tagList: [],
      tableKey: 0,
      searchForm: {
        teacherId: '',
        videoName: '',
        hotMarkRemark: '',
        hotMarkTypeIdList: [],
        sensitiveMarkRemark: '',
        sensitiveMarkTypeIdList: [],
        timeArray: []
      },
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.cuttentTime = minDate.getTime()
          if (maxDate) {
            this.cuttentTime = ''
          }
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const date = new Date()
              picker.$emit('pick', [date, date])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [date, date])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate: time => {
          // return time.getTime() > Date.now()
          if (time.getTime() > Date.now()) {
            return true
          }
          if (this.cuttentTime !== '') {
            const one = 30 * 24 * 3600 * 1000
            const minTime = this.cuttentTime - one
            const maxTime = this.cuttentTime + one
            return time.getTime() < minTime || time.getTime() > maxTime // 选择日期范围为一个月
          }
        }
      },
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: [
        'headerRight',
        'headerLeft',
        'videoGroupName',
        'finishProductNum',
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
      menus: [],
      search: '',
      multipleSelection: []
    }
  },
  computed: {
    dynamicValue: {
      get() {
        return this.activeName === 'first' ? this.searchForm.sensitiveMarkRemark : this.searchForm.hotMarkRemark
      },
      set(val) {
        if (this.activeName === 'first') {
          this.searchForm.sensitiveMarkRemark = val
        } else {
          this.searchForm.hotMarkRemark = val
        }
      }
    },
    hotMarkTypeIdValue: {
      get() {
        return this.activeName === 'first' ? this.searchForm.sensitiveMarkTypeIdList : this.searchForm.hotMarkTypeIdList
      },
      set(val) {
        if (this.activeName === 'first') {
          this.searchForm.sensitiveMarkTypeIdList = val
        } else {
          this.searchForm.hotMarkTypeIdList = val
        }
      }
    }
  },
  watch: {
    activeName(val) {
      this.initData()
    }
  },
  mounted() {},
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.loadTeacherData()
      this.getHotMarkTypeList()
      this.gethotMarkTypeEditList()
      this.getList()
    },
    toggleElementInArray(array, element) {
      if (array.includes(element)) {
        return array.filter(v => v !== element)
      } else {
        array.push(element)
        return array
      }
    },
    setRightTableData(row) {
      if (this.activeName === 'first') {
        this.hotMarkTypeIdValue = this.toggleElementInArray(this.searchForm.sensitiveMarkTypeIdList, row.id)
      } else {
        this.hotMarkTypeIdValue = this.toggleElementInArray(this.searchForm.hotMarkTypeIdList, row.id)
      }
      this.getFormSearch()
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.searchForm.hotMarkTypeIdList.includes(row.id) || this.searchForm.sensitiveMarkTypeIdList.includes(row.id)) {
        return 'check-row'
      }
      return ''
    },
    getColor(id) {
      console.log(id, this.hotMarkTypeList, 'my-id')
      const arr = this.hotMarkTypeList.filter(v => v.id === id)
      if (arr.length > 0) {
        return arr[0].color
      }
    },
    async getSenceOptions(query) {
      const page = {
        pageIndex: 1,
        pageSize: 100
      }
      const { data } = await searchDeliveryData({ sceneName: query, ...page })
      this.senceOptions = data.items.filter(item => {
        return item.status === 1
      })
      console.log(data, '交付场景')
    },
    getFormSearch() {
      this.config.currentPage = 1
      this.getList()
    },
    addTagMark() {
      this.getHotMarkTypeList()
      this.getHotMarkTypeStatistics()
      this.gethotMarkTypeEditList()
    },
    async showDetails(row) {
      console.log(row, '点击了')
      let res = null
      if (this.activeName === 'first') {
        res = await sensitiveQueryMarkSubtitle({ sensitiveMarkId: row.desensitizedVideoMarkId })
      } else {
        res = await queryMarkSubtitle({
          desensitizedVideoMarkId: row.desensitizedVideoMarkId
        })
      }
      // console.log(res, '详情')
      const obj = { ...row }
      let str = ''
      res.data.forEach((item, index) => {
        str +=
          index === res.data.length - 1 ? item.content : item.content + ' / '
      })
      obj.subtitleList = str
      this.videoDetails = obj
      this.drawerDetails = true
    },
    tagEditManage() {
      this.drawer = true
    },
    closeDrawer() {
      this.drawer = false
    },
    closeDrawerDetails() {
      this.drawerDetails = false
    },
    async exportTable() {
      console.log(this.searchForm, '点击了')
      let params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        desensitizedStartDate:
          this.searchForm.timeArray && this.searchForm?.timeArray[0]
            ? this.searchForm?.timeArray[0]
            : '',
        desensitizedEndDate:
          (this.searchForm.timeArray && this.searchForm?.timeArray[1]) || '',
        teacherId: this.searchForm.teacherId,
        videoName: this.searchForm.videoName,
        export: true
      }
      if (this.activeName === 'first') {
        params = { ...{ sensitiveMarkRemark: this.searchForm.sensitiveMarkRemark, sensitiveMarkTypeIdList: this.searchForm.sensitiveMarkTypeIdList }, ...params }
      } else {
        params = { ...{ hotMarkRemark: this.searchForm.hotMarkRemark, hotMarkTypeIdList: this.searchForm.hotMarkTypeIdList }, ...params }
      }
      let res = null
      if (this.activeName === 'first') {
        res = await querySensitiveMarkPage(params)
      } else {
        res = await queryHotMarkPage(params)
      }
      // blob流下载
      const blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      })
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = '标记管理.xls' // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
      console.log(res, '导出')
    },
    visibleChangeD(events) {
      if (!events) {
        this.loadUserNoPage()
        this.getList()
      } else {
        this.getList()
      }
    },
    async getHotMarkTypeStatistics() {
      let res = null
      if (this.activeName === 'first') {
        res = await sensitiveMarkTypeStatistics()
      } else {
        res = await hotMarkTypeStatistics()
      }
      this.hotMarkTypeList = res.data
      console.log(res, '爆款类型统计')
    },
    async getHotMarkTypeList() {
      let res = null
      if (this.activeName === 'first') {
        res = await sensitiveMarkTypeList()
      } else {
        res = await hotMarkTypeList()
      }
      this.tagList = res.data
      console.log(res, '爆款类型列表')
    },
    async gethotMarkTypeEditList() {
      let res = null
      if (this.activeName === 'first') {
        res = await sensitiveMarkTypeEditList()
      } else {
        res = await hotMarkTypeEditList()
      }
      this.hotMarkEditList = res.data
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    async loadTeacherData() {
      const res = await teacherQueryByName({ name: '' })
      this.tearchList = res.data
      const obj = {
        label: '全部',
        options: res.data
      }
      this.tearchArray = [obj]
      this.checkTeacher()
    },
    // 检测是否有常用
    checkTeacher() {
      let tagsTearch = ''
      if (this.activeName !== 'first') {
        tagsTearch = localStorage.getItem('tagsTearch')
      } else {
        tagsTearch = localStorage.getItem('hotTagsTearch')
      }
      if (tagsTearch) {
        const arr = JSON.parse(tagsTearch)
        this.tearchArray.unshift({
          label: '最近常用',
          options: arr
        })
      }
    },
    handleChangeTeacher() {
      const arr = this.tearchList.filter(
        item => item.teacherId === this.searchForm.teacherId
      )
      if (arr.length) {
        let tagsTearch = ''
        if (this.activeName !== 'first') {
          tagsTearch = localStorage.getItem('tagsTearch')
        } else {
          tagsTearch = localStorage.getItem('hotTagsTearch')
        }
        console.log(tagsTearch, '缓存里面有没有')
        if (!tagsTearch) {
          if (this.activeName !== 'first') {
            localStorage.setItem('tagsTearch', JSON.stringify(arr))
          } else {
            localStorage.setItem('hotTagsTearch', JSON.stringify(arr))
          }
          this.tearchArray.unshift({
            label: '最近常用',
            options: arr
          })
        } else {
          // 如果缓存里面有了 没有5个就继续添加 有5个就把最后一个删除第一个替换成最新的
          const arr1 = JSON.parse(tagsTearch)
          const index = arr1.findIndex(
            item => item.teacherId === this.searchForm.teacherId
          )
          if (index === -1) {
            if (arr1.length < 5) {
              arr1.unshift(arr[0])
            } else {
              arr1.pop()
              arr1.unshift(arr[0])
            }
          } else {
            arr1.splice(index, 1)
            arr1.unshift(arr[0])
          }
          if (this.activeName !== 'first') {
            localStorage.setItem('tagsTearch', JSON.stringify(arr1))
          } else {
            localStorage.setItem('hotTagsTearch', JSON.stringify(arr1))
          }
          this.tearchArray[0].options = arr1
        }
      }
      this.getFormSearch()
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem(
        'videousagestatustics_tabledata',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem(
        'videousagestatustics_tabledata',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 点击重置按钮
    clear() {},
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    clearSearchData() {
      this.config.currentPage = 1
      this.searchForm = {
        teacherId: '',
        videoName: '',
        hotMarkRemark: '',
        hotMarkTypeIdList: [],
        sensitiveMarkTypeIdList: [],
        timeArray: []
      }
      this.getList()
    },
    // 获取列表数据
    async getList() {
      this.loading = true
      this.config.tableColumns = this.columns
      console.log(this.searchForm, this.config, '点击了')
      this.getHotMarkTypeStatistics()
      let params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        desensitizedStartDate:
          this.searchForm.timeArray && this.searchForm?.timeArray[0]
            ? this.searchForm?.timeArray[0]
            : '',
        desensitizedEndDate:
          (this.searchForm.timeArray && this.searchForm?.timeArray[1]) || '',
        teacherId: this.searchForm.teacherId,
        videoName: this.searchForm.videoName
      }
      if (this.activeName === 'first') {
        this.config.tableColumns[1].prop = 'sensitiveMarkTypeName'
        this.config.tableColumns[2].prop = 'sensitiveMarkRemarks'
        // 不要数组第三个元素
        this.config.tableColumns = this.config.tableColumns.filter((item, index) => index !== 2)
        console.log(this.searchForm.sensitiveMarkTypeIdList, '选中的标记')
        params = { ...{ sensitiveMarkRemark: this.searchForm.sensitiveMarkRemark, sensitiveMarkTypeIdList: this.searchForm.sensitiveMarkTypeIdList }, ...params }
      } else {
        this.config.tableColumns[1].prop = 'hotMarkTypeName'
        this.config.tableColumns[2].prop = 'hotMarkRemarks'
        params = { ...{ hotMarkRemark: this.searchForm.hotMarkRemark, hotMarkTypeIdList: this.searchForm.hotMarkTypeIdList }, ...params }
      }
      console.log(this.config.tableColumns, 'this.config.tableColumns')
      let res = null
      if (this.activeName === 'first') {
        console.log('当前的12111')
        res = await querySensitiveMarkPage(params)
      } else {
        res = await queryHotMarkPage(params)
      }
      if (res.success) {
        this.loading = false
        this.tableKey++
        this.config.tableData = res.data.items
        this.config.total = res.data.total
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
    handleSizeChange(val) {
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

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.tipsBgColor {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}
.typeName-tips {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}
.my-video {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #0c6fff;
}
.my-pagination {
  padding-right: 10px;
  box-sizing: border-box;
  margin: 10px 0;
}

.videoStatistics-wrapper {
    @include responsive-height(90px);
  width: 100%;
  background: #fff;
  border-radius: 10px;
  // height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  ::v-deep .table_content {
    margin: 0;
    // height: calc(100% - 10px);
    height: 100%;
    overflow: auto;
  }
  .title-container {
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
  .table-item {
    border: 1px solid #e7e7e7;
    border-radius: 8px;
  }
  .right-item {
    display: flex;
    flex-direction: column;
    // height: calc(100% - 1px);
    height: 100%;
  }
  ::v-deep .page_header {
    padding: 10px 0;
  }
  ::v-deep .el-form-item--small.el-form-item {
    margin-bottom: 0;
    margin-top: 5px;
  }
  ::v-deep {
    .el-drawer__header {
      border-bottom: 1px solid #eff2f6 !important;
      padding: 12px 20px !important;
      margin-bottom: 0px !important;
    }
    .el-table {
      border-radius: 8px !important;
    }
    .el-table .check-row {
      background: #d9e8ff !important;
    }
    .tableClassName > th {
      background: #f3f3f3 !important;
    }
  }

  .fl {
    padding-top: 0px;
    padding-bottom: 20px;
    box-sizing: border-box;
  }
  .datePicker {
    flex: 1 0 0;
  }
  .bread-row {
    width: 100%;
    padding-bottom: 15px;
    border-bottom: 1px solid #eff2f6;
    span {
      color: #777;
      font-size: 16px;
      cursor: pointer;
    }
    i {
      color: #777;
      font-size: 16px;
      font-style: normal;
      cursor: pointer;
    }
    p {
      font-size: 16px;
      font-weight: bold;
      display: inline-block;
    }
  }
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333;
}
.link_to {
  cursor: pointer;
}
.link_to:hover {
  color: #0c6fff;
}
.red-cls {
  color: #f53f3f;
}
</style>
