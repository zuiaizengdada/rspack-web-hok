<template>
  <div class="videoStatistics-wrapper">
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
          <el-form
            :inline="true"
            :model="videoForm"
            size="small"
            class="demo-form-inline"
          >
            <el-form-item label="IP">
              <el-select
                v-model="videoForm.teacherId"
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
            <el-form-item label="视频组标题">
              <el-input
                v-model="videoForm.videoGroupName"
                placeholder="视频组标题"
                clearable
              />
            </el-form-item>
            <el-form-item label="视频标题">
              <el-input
                v-model="videoForm.videoName"
                placeholder="视频标题"
                clearable
              />
            </el-form-item>
            <el-form-item label="选择部门">
              <el-cascader
                v-model="videoForm.deptArray"
                :options="deptTreeArray"
                :props="{ checkStrictly: true }"
                clearable
                @change="visibleChangeD($event)"
                @visible-change="visibleChangeD($event)"
              />
            </el-form-item>
            <el-form-item label="员工姓名">
              <el-select
                v-model="videoForm.staffId"
                filterable
                placeholder="请选择员工"
                clearable
                @change="getList"
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
                  >
                    已离职
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">查询</el-button>
              <el-button @click="clearSearchData">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="headerRight">
        <el-popover placement="bottom-end" width="150" trigger="click">
          <p
            slot="reference"
            style="
              color: #0c6fff;
              font-size: 14px;
              width: 93px;
              text-align: right;
            "
            type="text"
            size="small"
          >
            自定义表头
            <img
              :src="iconShezhi"
              class="mr-1"
              style="margin-top: 2px; float: left"
            />
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
            :disabled="item.disable"
            @change="handleCheckedTableColumnsChange(item)"
          >
            {{ item.label }}
          </el-checkbox>
        </el-popover>
      </div>
      <div slot="videoGroupName" slot-scope="scope">
        <p class="link_to" @click="linkToDetail(scope.row)">
          {{ scope.row.videoGroupName }}
        </p>
      </div>
      <div slot="finishProductNum" slot-scope="scope">
        <p
          :class="
            scope.row.finishProductNum < scope.row.avgFinishProductNum
              ? 'red-cls'
              : ''
          "
        >
          {{ scope.row.finishProductNum }}
        </p>
      </div>
      <div slot="footer" />
    </MPageLayout>
  </div>
</template>

<script>
import { searchVideoUseNumsData } from '@/api/product/videoManager'
import { deptTree } from '@/api/addressBookApi'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import { loadUserData, changeTeacher, tearchFilter, filteredGroups } from '@/utils/videoMange'
import { userNoPage } from '@/api/addressBookApi'
export default {
  components: {},
  data() {
    return {
      filteredGroups,
      tearchArray: [],
      tearchList: [],
      userArray: [],
      iconShezhi,
      deptTreeArray: [],
      videoForm: {
        videoGroupName: '',
        teacherId: '',
        staffId: '',
        dept: '',
        videoName: '',
        deptArray: []
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
        tableColumns: [
          {
            prop: 'videoGroupName',
            label: '视频组标题',
            width: 180,
            type: 'slot',
            visible: true
          },
          {
            prop: 'videoName',
            label: '视频标题',
            width: 180,
            type: 'text',
            visible: true
          },
          { prop: 'teacherName', label: 'IP', type: 'text', visible: true,
            render: row => {
              return row.teacherName || '--'
            }
          },
          {
            prop: 'createUserName',
            label: '视频组创建者',
            type: 'text',
            visible: true
          },
          {
            prop: 'staffName',
            label: '成品上传者',
            type: 'text',
            visible: true
          },
          {
            prop: 'finishProductNum',
            label: '上传成品数',
            type: 'slot',
            visible: true
          },
          {
            prop: 'avgFinishProductNum',
            label: '平均上传成品数',
            type: 'text',
            visible: true
          },
          {
            prop: 'allFinishProductNum',
            label: '成品总数',
            type: 'text',
            visible: true
          },
          {
            prop: 'allPeopleNum',
            label: '使用总人数',
            type: 'text',
            visible: true
          },
          {
            prop: 'deptChain',
            label: '上传者所属部门',
            type: 'text',
            visible: true
          }
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
    this.$dragging.$on('dragged', res => {
      console.log(JSON.stringify(this.config.tableColumns))
      localStorage.setItem(
        'videousagestatustics_tabledata',
        JSON.stringify(this.config.tableColumns)
      )
    })
  },
  created() {
    const pageInfo = this.$route.query
    console.log('pageInfo: ', pageInfo)
    if (pageInfo?.type && pageInfo?.type === '1') {
      console.log('pageInfo?.groupName: ', pageInfo?.groupName)
      this.videoForm.videoGroupName = decodeURI(pageInfo?.groupName) || ''
    }
    if (pageInfo?.type && pageInfo?.type === '2') {
      this.videoForm.videoName = decodeURI(pageInfo?.titleName) || ''
    }
    const tableColumns = localStorage.getItem('videousagestatustics_tabledata')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    this.loadTreeData()
    this.loadUserNoPage()
    this.loadTeacherData()
    this.getList()
  },
  methods: {
    visibleChangeD(events) {
      if (!events) {
        this.loadUserNoPage()
        this.getList()
      } else {
        this.getList()
      }
    },
    linkToDetail(row) {
      console.log(row)
      const url = '/videoManagement/originalVideoDetail/' + row.videoGroupId
      this.$router.push(url)
    },
    loadUserNoPage() {
      const params = {
        deptId: this.videoForm.deptArray[this.videoForm.deptArray.length - 1]
          ? this.videoForm.deptArray[this.videoForm.deptArray.length - 1]
          : '',
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    async loadTeacherData() {
      const { tearchArray, tearchList } = await loadUserData('videoUsage', 1)
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
      if (this.videoForm.teacherId) {
        const res = await changeTeacher(this.tearchList, this.tearchArray, 'videoUsage', this.videoForm.teacherId)
        this.tearchArray = res
      }
      this.getList(data)
    },
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
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
    clear() {
      const tableColumns = [
        {
          prop: 'videoGroupName',
          label: '视频组标题',
          width: 180,
          type: 'slot',
          visible: true
        },
        {
          prop: 'videoName',
          label: '视频组标题',
          width: 180,
          type: 'slot',
          visible: true
        },
        { prop: 'teacherName', label: 'IP', type: 'text', visible: true, render: row => {
          return row.teacherName || '--'
        } },
        {
          prop: 'createUserName',
          label: '视频组创建者',
          type: 'text',
          visible: true
        },
        { prop: 'staffName', label: '成品上传者', type: 'text', visible: true },
        {
          prop: 'finishProductNum',
          label: '上传成品数',
          type: 'slot',
          visible: true
        },
        {
          prop: 'avgFinishProductNum',
          label: '平均上传成品数',
          type: 'text',
          visible: true
        },
        {
          prop: 'allFinishProductNum',
          label: '成品总数',
          type: 'text',
          visible: true
        },
        {
          prop: 'allPeopleNum',
          label: '使用总人数',
          type: 'text',
          visible: true
        },
        {
          prop: 'deptChain',
          label: '上传者所属部门',
          type: 'text',
          visible: true
        }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem(
        'videousagestatustics_tabledata',
        JSON.stringify(tableColumns)
      )
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    clearSearchData() {
      this.videoForm.deptArray = []
      this.config.currentPage = 1
      this.videoForm.staffId = ''
      this.videoForm.teacherId = ''
      this.videoForm.videoGroupName = ''
      this.videoForm.videoName = ''
      this.getList()
    },
    // 获取列表数据
    async getList() {
      this.loading = true
      console.log('this.videoForm.deptArray: ', this.videoForm.deptArray)
      const params = {
        deptId: this.videoForm.deptArray[this.videoForm.deptArray.length - 1]
          ? this.videoForm.deptArray[this.videoForm.deptArray.length - 1]
          : '',
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        userId: this.videoForm.staffId,
        teacherId: this.videoForm.teacherId,
        videoName: this.videoForm.videoName,
        videoGroupName: this.videoForm.videoGroupName
      }
      searchVideoUseNumsData(params).then(res => {
        if (res.success) {
          this.loading = false
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.config.currentPage = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
        }
      })
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

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.videoStatistics-wrapper {
  @include responsive-height(20px);
  width: 100%;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  ::v-deep .my-table {
    margin: 0;
    height: calc(100% - 30px);
  }
  ::v-deep .page_header {
    padding: 10px 0;
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
