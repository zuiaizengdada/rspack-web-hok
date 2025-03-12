<template>
  <MCard class="page_wrap">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-bottom:20px"
    >
      <el-breadcrumb-item
        :to="{ path: '/privateArea/clue' }"
      >线索管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ taskName }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="课前" name="1" />
      <el-tab-pane v-if="liveList.length" label="课中" name="2" />
      <el-tab-pane v-if="liveList.length" label="课后" name="3" />
    </el-tabs>
    <el-form
      :inline="true"
      size="small"
      :model="form"
      class="search-form"
    >
      <el-form-item label="来源渠道：">
        <el-select
          v-model="form.channelSource"
          clearable
          style="width:150px"
          placeholder="请选择"
          @change="onSubmit"
        >
          <el-option
            v-for="(item) in channelSourceType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="来源IP老师：">
        <el-select
          v-model="form.lectureId"
          style="width:150px"
          clearable
          placeholder="请选择"
          @change="onSubmit"
        >
          <el-option
            v-for="(item) in lectureIdList"
            :key="item.lecturerId"
            :label="item.lecturerName"
            :value="item.lecturerId"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="active === '2'" label="直播间：">
        <el-select
          v-model="form.liveId"
          placeholder="请选择"
          style="width:160px"
          @change="handleLiveChange"
        >
          <el-option
            v-for="(item) in liveList"
            :key="item.liveId"
            :label="item.name"
            :value="item.liveId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="跟进人：">
        <el-input
          v-model="form.userName"
          style="width:150px"
          placeholder="请输入内容"
          @focus="handleShowUser"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        <el-button size="small" @click="clear">重置</el-button>
        <el-button v-if="active === '3'" size="small" type="primary" @click="showOrderDialog">订单认领</el-button>
      </el-form-item>
      <el-form-item>
        <el-popover
          placement="bottom-end"
          width="200"
          style="max-height:500px"
          trigger="click"
        >
          <div
            slot="reference"
            class="flex flex-middle"
          >
            <img
              :src="iconShezhi"
              class="mr-1 el-icon--left"
              style="margin-top:2px;"
            />
            <el-button
              type="text"
            >
              自定义表头
            </el-button>
          </div>
          <el-scrollbar style="height: 400px">
            <el-checkbox
              v-model="allColumnsSelected"
              :indeterminate="allColumnsSelectedIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox
              v-for="item in tableColumns"
              :key="item.label"
              v-model="item.visible"
              @change="handleCheckedChange(item)"
            >
              {{ item.label }}
            </el-checkbox>
          </el-scrollbar>
        </el-popover>
      </el-form-item>
    </el-form>
    <beforeClassTable v-show="active === '1'" ref="beforeClassTable" />
    <inClassTable v-show="active === '2'" ref="inClassTable" :live-name="liveName" />
    <afterClassTable v-show="active === '3'" ref="afterClassTable" />
    <orderClaim ref="orderClaim" />
  </MCard>
</template>

<script>
import beforeClassTable from './components/beforeClassTable'
import inClassTable from './components/inClassTable'
import afterClassTable from './components/afterClassTable'
import orderClaim from './components/orderClaim'
import { mapGetters } from 'vuex'
import { getTeacherList } from '@/api/shop'
import { saleTaskPage } from '@/api/privateArea/toolbox'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import { beforeClassColumns, inClassColumns, afterClassColumns } from './tableColumns'
import { getItem, setItem } from '@/utils/localStorage'
export default {
  components: {
    beforeClassTable,
    afterClassTable,
    inClassTable,
    orderClaim
  },
  filters: {},
  data() {
    return {
      iconShezhi,
      loading: false,
      active: '1',
      taskId: '',
      taskName: '',
      userList: [],
      lectureIdList: [],
      liveList: [],
      liveName: '',
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      form: {
        channelSource: '',
        lectureId: '',
        userName: '',
        deptId: '',
        sysUserId: [],
        liveId: ''
      },
      tableColumns: []
    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  async mounted() {
    this.taskName = this.$route.query.taskName
    this.tableColumns = getItem('beforeClassColumns') ?? beforeClassColumns
    await this.getTeacherList()
    await this.saleTaskPage()
    this.onSubmit()
  },
  methods: {
    async getTeacherList() {
      const { data } = await getTeacherList()
      this.lectureIdList = data
    },
    handleCheckedChange() {
      const ref = {
        1: 'beforeClassTable',
        2: 'inClassTable',
        3: 'afterClassTable'
      }
      const columnCount = this.tableColumns.length
      const selectColumn = this.tableColumns.filter(i => i.visible)
      const columnKey = {
        1: 'beforeClassColumns',
        2: 'inClassColumns',
        3: 'afterClassColumns'
      }
      setItem(columnKey[this.active], this.tableColumns)
      this.allColumnsSelected = selectColumn.length === columnCount
      this.allColumnsSelectedIndeterminate = selectColumn.length > 0 && selectColumn.length < columnCount
      this.$refs[ref[this.active]].setColumnList(this.tableColumns)
    },
    handleCheckAllChange(val) {
      this.allColumnsSelected = val
      this.allColumnsSelectedIndeterminate = false
      this.tableColumns.forEach(i => {
        i.visible = val
      })
      this.handleCheckedChange()
    },
    async saleTaskPage() {
      const taskId = this.$route.query.taskId
      const { data } = await saleTaskPage({ taskId })
      this.liveList = data
      if (data && data.length) {
        this.form.liveId = data[0].liveId
        this.liveName = data[0].name
      }
    },
    clear() {
      this.form = {
        channelSource: '',
        lectureId: '',
        userName: '',
        deptId: '',
        sysUserId: [],
        liveId: ''
      }
      if (this.liveList && this.liveList.length) {
        this.form.liveId = this.liveList[0].liveId
        this.liveName = this.liveList[0].name
      }
      this.onSubmit()
    },
    handleLiveChange() {
      if (this.form.liveId) {
        const data = this.liveList.find(i => i.liveId === this.form.liveId)
        console.log(data)
        this.liveName = data.name
      }
      this.onSubmit()
    },
    showOrderDialog() {
      this.$refs.orderClaim.open()
    },
    handleClick() {
      if (this.active === '1') {
        this.tableColumns = getItem('beforeClassColumns') ?? beforeClassColumns
        this.$uweb && this.$uweb.setAction('Event_Taskkanban_beforeClass')
      } else if (this.active === '2') {
        this.tableColumns = getItem('inClassColumns') ?? inClassColumns
        this.$uweb && this.$uweb.setAction('Event_Taskkanban_centerClass')
      } else {
        this.tableColumns = getItem('afterClassColumns') ?? afterClassColumns
        this.$uweb && this.$uweb.setAction('Event_Taskkanban_afterClass')
      }
      this.onSubmit()
    },
    handleShowUser() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [0, 1],
        checkUser: this.userList,
        success: (res) => {
          this.userList = []
          this.form.sysUserId = ''
          this.form.userName = ''
          this.form.deptId = ''
          if (res.user.length) {
            res.user.forEach((v) => {
              v.userName = v.nickName
            })
            this.userList = res.user
            this.form.sysUserId = this.userList.map(i => i.userId)
            this.form.userName = this.userList[0].userName
          } else {
            this.userList = res.dept
            this.form.deptId = this.userList[0].deptId
            this.form.userName = this.userList[0].name
          }
          this.onSubmit()
        }
      })
    },
    onSubmit() {
      const ref = {
        1: 'beforeClassTable',
        2: 'inClassTable',
        3: 'afterClassTable'
      }
      this.$nextTick(() => {
        this.handleCheckedChange()
        this.$refs[ref[this.active]].getList(this.form)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: calc(100vh - 90px);
  min-width: 1300px;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

::v-deep {
  .el-table__header-wrapper tbody td.el-table__cell, .el-table__footer-wrapper tbody td.el-table__cell {
    background: #F2F9FF;
  }
}
</style>
