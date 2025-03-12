<template>
  <AppDialog v-model="config.visible" :title="config.title" width="990px" @success="successFn">
    <div class="addLiveRoomDialog-page">
      <div class="headerSearch">
        <el-form ref="search" :model="search" :inline="true" size="small">
          <el-form-item label="直播间名称" label-width="80px">
            <el-input v-model="search.liveRoomName" clearable class="w-160" @keyup.enter.native="sureSearch" />
          </el-form-item>
          <el-form-item label="讲师">
            <el-select v-model="liveModel" placeholder="请选择" class="input-with-select input-with-select-chang" @change="onhandleTearchChange">
              <el-option label="真人讲师" value="PERSON_LIVE" />
              <el-option label="视频讲师" value="AI_LIVE" />
            </el-select>
            <el-select v-if="liveModel === 'PERSON_LIVE'" v-model="search.realityTeacherUserId" class="w-160 filter_teacherSelect" filterable placeholder="请选择讲师" clearable>
              <el-option
                v-for="item in userArray"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
            <AppSelect
              v-else-if="liveModel === 'AI_LIVE'"
              class="filter_teacherSelect "
              :get-api-fn="getTeacherList"
              search-key="teacherName"
              :value="search.teacherId"
              :label="search.teacherName"
              :props="{
                label: 'teacherName',
                value: 'teacherId'
              }"
              @selected="selectedTeacher"
            />
          </el-form-item>
          <el-form-item label="助教" label-width="40px">
            <el-select v-model="search.tutorTeacherUserId" class="w-160" filterable placeholder="请选择助教" clearable>
              <el-option
                v-for="item in userArray"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="sureSearch">查询</el-button>
            <el-button size="small" @click="clearSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-if="config.visible" ref="table" :data="tableData" row-key="id" height="485px" :header-cell-style="{ background: '#f5f5f5' }" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" reserve-selection :selectable="disabledFn" />
        <el-table-column prop="name" label="直播间名称" :show-overflow-tooltip="true" />
        <el-table-column prop="startTime" label="直播时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="teacherInfoDtoList" label="讲师" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ renderTearch(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="teacherInfoDtoList" label="助教" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ renderAssistantTearch(scope.row) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="addLiveRoomDialog-footer">
        <div class="c_F53F3F">注：最多可选择5个直播间</div>
        <el-pagination
          class="pagination"
          :current-page.sync="current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />

      </div>

    </div>
  </AppDialog>
</template>

<script>
import { getLiveRoomList } from '@/api/liveRoom/index'
import { userNoPage } from '@/api/addressBookApi'
import AppSelect from '@/components/AppSelect/index'
import { getTeacherList } from '@/api/tearchCenter/index'
import { mapGetters } from 'vuex'
import AppDialog from '@/components/AppDialog'
import moment from 'moment'
export default {
  components: {
    AppDialog,
    AppSelect
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          title: '选择直播间',
          chooseList: [],
          liveRoomId: ''
        }
      }
    }
  },

  data() {
    return {
      search: {
        tutorTeacherUserId: ''
      },
      tableData: [],
      current: 1, // 当前页
      pageSize: 10, // 页数
      total: 0, // 总数
      multipleSelection: [],
      userArray: [],
      liveModel: 'PERSON_LIVE'
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    disabledList() {
      const list = this.config.chooseList?.map(item => item.liveRoomId)
      return [...list, this.config.liveRoomId]
    }
  },
  watch: {
    'config.visible' (val) {
      if (val) {
        this.init()
      }
    }
  },

  methods: {
    moment,
    init() {
      this.current = 1
      this.pageSize = 10
      this.search = {
        tutorTeacherUserId: this.userInfo.userId
      }
      this.multipleSelection = []
      this.getList()
      this.loadUserNoPage()
    },
    getList() {
      const params = {
        pageIndex: this.current,
        pageSize: this.pageSize,
        statusList: [0, 1, 2],
        ...this.search
      }
      if (params.realityTeacherUserId) {
        params.liveModel = 'PERSON_LIVE'
      } else if (params.teacherId) {
        params.liveModel = 'AI_LIVE'
      }
      getLiveRoomList(params).then(res => {
        this.tableData = res.data?.items || []
        this.total = res.data.total
        // this.$nextTick(() => {
        //   this.$refs.table.clearSelection()
        //   this.config.chooseList?.forEach(val => {
        //     const row = this.tableData?.find(item => val.liveRoomId === item.id)
        //     row && this.$refs.table.toggleRowSelection(
        //       row, true
        //     )
        //   })
        // })
      })
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    sureSearch() {
      this.current = 1
      this.getList()
    },
    clearSearch() {
      this.current = 1
      this.search = {}
      this.liveModel = 'PERSON_LIVE'
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.current = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('handleSelectionChange', val)
    },
    successFn() {
      console.log(this.multipleSelection)
      if (this.multipleSelection.length > 5) {
        return this.$message.error('最多可选择5个直播间')
      }
      this.$emit('select', this.multipleSelection)
      this.config.visible = false
    },
    selectedTeacher(res) {
      console.log(res)
      this.search.teacherId = res.teacherId
      this.search.teacherName = res.teacherName
      this.$forceUpdate()
    },
    onhandleTearchChange() {
      this.search.teacherId = ''
      this.search.teacherName = ''
      this.search.realityTeacherUserId = ''
    },
    getTeacherList(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherName: params.teacherName,
        serviceEnterprise: '',
        domainId: '',
        cooperateStatus: '',
        assessStatus: '',
        searchDateStart: '',
        searchDateEnd: '',
        createTimeBegin: '',
        createTimeEnd: '',
        assessResult: '',
        recommendName: '',
        createUserName: '',
        assessFlag: ''
      }
      return getTeacherList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    renderTearch(row) {
      if (!row) return
      if (row.liveModel === 'PERSON_LIVE') {
        const arr = row.teacherInfoDtoList
        if (!arr) {
          return ''
        }
        const value = arr.filter(v => v.teacherRole === 0).reduce((pre, next) => {
          next && (pre = `${pre}${pre ? '、' : ''}${next.teacherName}`)
          return pre
        }, '')
        return value
      } else if (row.liveModel === 'AI_LIVE') {
        return row.videoTeacherName
      } else {
        return ''
      }
    },
    renderAssistantTearch(row) {
      const arr = row.teacherInfoDtoList
      if (!arr) {
        return ''
      }
      const value = arr.filter(v => v.teacherRole === 1).reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next.teacherName}`)
        return pre
      }, '')
      return value
    },
    disabledFn(row) {
      return !this.disabledList.includes(row.id)
    }
  }
}
</script>

<style lang='scss' scoped>
 .addLiveRoomDialog-page {
  padding: 20px;
  .input-with-select {
    width: 108px;
    height: 32px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    border-radius: 3px 0px 0px 3px;
  }
  .input-with-select-chang {
    ::v-deep  .el-input__inner {
      border: none;
      border-radius: 3px 0px 0px 3px;
      border: 1px solid #D8DCE6;
      border-right: none;
    }
  }
  .filter_teacherSelect {
  ::v-deep {
    .tearchInput  {
      width: 160px;
    }
    .el-input__inner {
      border-radius: 0px 3px 3px 0px;
      width: 160px;
    }
  }
 }
 }
.pagination {
    text-align: right;
  }
  .addLiveRoomDialog-footer {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
  }
  .w-160 {
    width: 160px;
  }
  ::v-deep .el-table__body-wrapper {
    height: 100% !important;
  }
</style>
