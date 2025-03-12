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
          <el-form-item label="IP">
            <el-select
              v-model="search.teacherId"
              remote
              :remote-method="tearchFilter"
              clearable
              filterable
              placeholder="请选择IP"
              @blur="()=>tearchFilter('')"
              @change="handleChangeTeacher"
            >
              <el-option-group
                v-for="group in filteredGroups(tearchArray)"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span class="flex flex-between"><span>{{ item.label }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input
              v-model="search.keywords"
              style="width: 200px"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="时间范围">
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
            >
              查询
            </el-button>
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
            />
            自定义表头
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
      <div slot="keywordsString" slot-scope="{ row }">
        <el-tooltip
          class="item"
          effect="light"
          :content="row.keywordsString"
          placement="bottom"
        >
          <p class="keywordsString-cls">{{ row.keywordsString }}</p>
        </el-tooltip>
      </div>
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" @click="showVideo(row)">视频预览</el-button>
      </template>
      <template slot="footer" />
    </MPageLayout>
  </div>
</template>

<script>
import videoplayer from '../component/videoplayer/index.js'
import { loadUserData, changeTeacher, tearchFilter, filteredGroups } from '@/utils/videoMange'
import { getWordsPage } from '@/api/videoManagement/vedioSetting'
import { DateFormat } from '@/utils/index'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
export default {
  components: {},
  data() {
    return {
      iconShezhi,
      filteredGroups,
      tearchArray: [],
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: [
        'headerRight',
        'headerLeft',
        'keywordsString',
        'action',
        'footer'
      ],
      config: {
        tableData: [],
        tableColumns: [
          {
            prop: 'name',
            label: '视频名称',
            width: 300,
            type: 'text',
            visible: true
          },
          {
            prop: 'teacherName',
            label: 'IP',
            width: 150,
            type: 'text',
            visible: true,
            render: row => {
              return row.teacherName || '--'
            }
          },
          {
            prop: 'keywordsString',
            label: '触发敏感词',
            width: 400,
            type: 'slot',
            visible: true
          },
          { prop: 'createBy', label: '上传人员', type: 'text', visible: true },
          {
            prop: 'uploadTime',
            label: '上传时间',
            type: 'text',
            visible: true
          },
          {
            prop: 'action',
            label: '操作',
            width: 100,
            type: 'slot',
            visible: true,
            disabled: true,
            fixed: 'right'
          }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      search: {
        teacherId: '', // IP
        keywords: '', // 关键词
        timeArray: [], // 时间范围
        startTime: '',
        endTime: ''
      },
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
    this.$dragging.$on('dragged', res => {
      console.log(res)
      localStorage.setItem(
        'productInspection_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    })
  },
  created() {
    // const tableColumns = localStorage.getItem('productInspection_tableColumns')
    // if (tableColumns) {
    //   this.config.tableColumns = JSON.parse(tableColumns)
    // }
    this.loadTeacherData()
    this.getDefaultTime()
    this.getList()
  },
  methods: {
    resetData() {
      this.search = {
        teacherId: '', // IP
        keywords: '', // 关键词
        timeArray: [], // 时间范围
        startTime: '',
        endTime: ''
      }
      this.getDefaultTime()
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
      this.$nextTick(() => {
        this.$refs.MPageLayout.doLayout()
      })
      localStorage.setItem(
        'productInspection_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem(
        'productInspection_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    async loadTeacherData() {
      const { tearchArray, tearchList } = await loadUserData('productInspection', 1)
      this.tearchArray = tearchArray
      this.tearchList = tearchList
      this.tearchFilter('')
    },
    async tearchFilter(query) {
      setTimeout(async() => {
        const res = await tearchFilter(query, this.tearchList)
        this.tearchArray[0].isHidden = query.length > 0
        this.tearchArray[1].options = res
      }, 300)
    },
    async handleChangeTeacher(data) {
      if (this.search.teacherId) {
        const res = await changeTeacher(this.tearchList, this.tearchArray, 'productInspection', this.search.teacherId)
        console.log(res, '选择了IP')
        this.tearchArray = res
      }
      this.getList(data)
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'name', label: '视频名称', type: 'text', visible: true },
        { prop: 'teacherName', label: 'IP', type: 'text', visible: true },
        {
          prop: 'keywordsString',
          label: '触发敏感词',
          width: 250,
          type: 'slot',
          visible: true
        },
        { prop: 'createBy', label: '上传人员', type: 'text', visible: true },
        { prop: 'uploadTime', label: '上传时间', type: 'text', visible: true },
        {
          prop: 'action',
          label: '操作',
          type: 'slot',
          visible: true,
          disabled: true
        }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem(
        'productInspection_tableColumns',
        JSON.stringify(tableColumns)
      )
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        keyword: this.search.keywords,
        teacherId: this.search.teacherId,
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
      getWordsPage(params).then(res => {
        console.log(res)
        if (res.success) {
          this.config.tableData = res.data.items
          this.config.tableData.some(item => {
            item.keywordsString = ''
            item.keywords.some(obj => {
              item.keywordsString += obj + '、'
            })
            item.keywordsString = item.keywordsString.substring(
              0,
              item.keywordsString.length - 1
            )
          })
          this.config.total = res.data.total
          this.config.currentPage = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          // this.config.tableData[0].keywords = ['发射基地扣尾款', 'fdsaewfdsa', '涉及我看了就范德萨']
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
      if (this.search.teacherId === '' && this.search.keywords === '') {
        this.$message.error('IP或关键词必须输入一项！')
        return
      }
      this.getList()
    },
    // 清除搜索条件
    clearSearchFn() {
      this.search = {
        teacher: '', // IP
        keyWord: '', // 关键词
        time: ['', ''] // 时间范围
      }
    },
    // 点击视频预览
    showVideo(row) {
      console.log(row.videoUrl)
      videoplayer.play({
        visible: true,
        url: row.videoUrl,
        videoName: row.name,
        videoId: row.finishVideoId
      })
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
</style>
