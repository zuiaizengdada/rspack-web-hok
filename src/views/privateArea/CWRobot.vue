<template>
  <div class="table_wrap">
    <!--表格渲染-->
    <MPageLayout
      ref="MPageLayout"
      border
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
      @handleSelectionChange="handleListSelectionChange"
    >
      <div slot="headerLeft">
        <div class="fl">
          <el-input v-model="search.searchTxt" placeholder="请输入" size="small" maxlength="80">
            <el-select slot="prepend" v-model="search.searchType" class="w-120" size="small" placeholder="请选择">
              <el-option label="机器人名称" value="name" />
              <el-option label="机器人id" value="robotId" />
            </el-select>
            <!-- <el-button slot="append" icon="el-icon-search" /> -->
          </el-input>
          <!-- <el-input v-model="search" placeholder="请输入商品名称" clearable size="small" @keyup.enter.native="getList" @clear="getList" /> -->
          <span class="header-txt">在线状态</span>
          <el-select v-model="search.onlineStatus" class="m-l20" placeholder="在线状态">
            <el-option label="在线状态" value="" />
            <el-option label="在线" value="3" />
            <el-option label="离线" value="2" />
          </el-select>
          <el-button class="m-l20" size="small" @click="getList(true)">搜索</el-button>
        </div>
      </div>
      <div slot="headerRight">
        <el-popover
          placement="bottom-end"
          width="150"
          trigger="click"
        >
          <!-- <el-button slot="reference" type="text" size="small">自定义表头</el-button> -->

          <el-checkbox v-model="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-checkbox
            v-for="item in config.tableColumns"
            :key="item.label"
            v-model="item.visible"
            v-dragging="{ item: item, list: config.tableColumns, group: 'item' }"
            @change="handleCheckedTableColumnsChange(item)"
          >
            {{ item.label }}
          </el-checkbox>
        </el-popover>
        <!-- <el-button type="text" size="small" class="m-l-20" @click="clear()">重置表头</el-button> -->
        <!-- <el-button type="primary" size="small" @click="openModel('add')">新增机器人</el-button> -->
      </div>
      <div slot="action" slot-scope="{ row }">
        <el-button type="text" @click="openModel('edit',row)">编辑</el-button>
        <!-- <el-button v-if="row.isEdit" type="text" @click="table_save(row)">保存</el-button>
        <el-button v-if="row.isEdit" type="text" @click="table_cancel(row)">取消</el-button>
        <el-button v-if="!row.isEdit" type="text">移除</el-button> -->
      </div>
      <div slot="onlineStatus" slot-scope="{ row }">
        <div v-if="row.onlineStatus == '离线'" class="status-box" @click="openModel(row)">
          <!-- <div slot="content" class="qrcode-box"><img :src="login_qrcode" alt=""></div> -->
          <span>{{ row.onlineStatus }}</span>
        </div>
        <span v-else>{{ row.onlineStatus }}</span>
      </div>
      <div slot="commission" slot-scope="{ row }">
        <template v-if="row.isEdit">
          <el-input-number v-model="row._commission" :max="100" :min="0" />
          <span>%</span>
        </template>
        <span v-else>{{ row.commission }}%</span>
      </div>
      <div slot="footer">
        <!-- <el-button type="primary" size="small">新增机器人</el-button> -->
        <!-- <el-button type="danger" size="small" :disabled="multipleSelection.length === 0">批量审核</el-button> -->
      </div>
    </MPageLayout>
    <AppDialog
      v-model="memberModal.visible"
      :title="memberModal.title"
      width="550px"
      height="auto"
      @success="memberModal.visible = false"
    >
      <div v-loading="memberModal.loading" class="code-info-box">
        <template>
          <div class="code-info-img"><img :src="login_qrcode" /></div>
          <div>当前状态:{{ wxRobotStatus }} <span @click="getRobotCode">刷新状态</span></div>
        </template>
      </div>
      <div slot="footer" class="footer">
        <!-- <el-button type="primary" size="small">保存</el-button> -->
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { robotPage, refreshRobot } from '@/api/privateArea/CWRobotList'
import { parseTime } from '@/utils/index'
export default {
  name: 'CWeChat',
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      search: {
        searchType: 'name',
        searchTxt: '',
        onlineStatus: '' // 2离线，3在线
      },
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'goodsName', 'onlineStatus', 'type', 'sort', 'commission'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'userName', label: '机器人名称', type: 'text', visible: true },
          { prop: 'robotId', label: '机器人id', type: 'text', visible: true },
          { prop: 'onlineStatus', label: '在线状态', type: 'slot', visible: true },
          { prop: 'createTime', label: '创建时间', type: 'text', visible: true, render: (row) => { return row.createTime ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}') : '——' } },
          { prop: 'updateTime', label: '更新时间', type: 'text', visible: true, render: (row) => { return row.updateTime ? parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}') : '——' } }
          // { prop: 'commission', label: '加入时间', type: 'text', visible: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      memberModal: {
        visible: false,
        title: '登录状态',
        loading: false
      },
      form: {
        id: '',
        labelName: ''
      },
      rules: {
        id: [
          { required: true, message: '请输入机器人id', trigger: 'blur' }
        ],
        labelName: [
          { required: true, message: '请输入机器人名称', trigger: 'blur' }
        ]
      },
      login_qrcode: '',
      robotId: '',
      wxRobotStatus: ''
    }
  },
  created() {

  },
  mounted() {
    this.getList()
    // 拖拽后触发的事件
    // this.$dragging.$on('dragged', (res) => {
    //   console.log(res)
    //   localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    // })
  },
  methods: {
    // 获取列表数据
    getList(status) {
      this.loading = true
      status ? this.config.currentPage = 1 : ''
      const params = {
        onlineStatus: this.search.onlineStatus,
        current: this.config.currentPage,
        size: this.config.pageSize
      }
      params[this.search.searchType] = this.search.searchTxt
      robotPage(params).then(res => {
        console.log(res, 'res')
        this.loading = false
        res.data.records.map(v => {
          v.onlineStatus === 2 ? v.onlineStatus = '离线' : v.onlineStatus = '在线'
        })
        this.config.tableData = res.data.records
        console.log(this.config.tableData)
        this.config.total = res.data.total
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取企微登录 二维码
    getRobotCode() {
      const params = this.robotId
      const that = this
      this.memberModal.loading = true
      refreshRobot(params).then(res => {
        console.log(res.data, 'res')
        this.login_qrcode = res.data.qrcode
        this.wxRobotStatus = res.data.wxRobotStatus === 2 ? '离线' : '在线'
        this.config.tableData.forEach(e => {
          console.log(e.robotId === that.robotId)
          e.robotId === that.robotId ? e.onlineStatus = that.wxRobotStatus : ''
        })
        this.memberModal.loading = false
      }).catch(() => {
        this.memberModal.loading = false
      })
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'action', label: '操作', type: 'text', visible: true },
        { prop: 'goodsName', label: '推广员码', type: 'text', visible: true },
        { prop: 'price', label: '推广员', type: 'text', visible: true },
        { prop: 'type', label: '审核状态', type: 'text', visible: true },
        { prop: 'sort', label: '姓名', type: 'text', visible: true },
        { prop: 'sort', label: '绑定手机号', type: 'text', visible: true },
        { prop: 'sort', label: '累计用户', type: 'text', visible: true },
        { prop: 'sort', label: '状态', type: 'text', visible: true },
        { prop: 'commission', label: '加入时间', type: 'text', visible: true }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('promoter_tableColumns', JSON.stringify(tableColumns))
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
    handleListSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
      this.getList()
    },
    // 打开成员信息弹框
    openModel(row) {
      // this.memberList = []
      this.robotId = row.robotId
      this.memberModal.visible = true
      this.getRobotCode()
      // this.memberModal.loading = true
      // if (type === 'add') {
      //   this.memberModal.title = '新增机器人'
      // } else {
      //   this.memberModal.title = '编辑机器人'
      // }
      // const params = {
      //   goodsId: row.goodsId,
      //   orderNo: row.orderNo
      // }
      // getStudentList(params)
      //   .then((res) => {
      //     this.memberList = res.data
      //     this.memberModal.loading = false
      //     console.log(res, '获取学员信息')
      //   })
      //   .catch(() => {
      //     this.memberModal.loading = false
      //   })
    }
  }
}
</script>

<style lang='scss' scoped>
.header-txt {
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  width: 160px;
  font-weight: 700;
}
.table_wrap {
  height: 100%;
  background: #fff;
}
.code-info-box {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  span {
    cursor: pointer;
  }
  .code-info-img {
    width: 120px;
    height: 120px;
    color: #444;
    line-height: 40px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 400;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.fl {
  align-items: center;
}
.m-l20 {
  margin-left: 20px;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
}
.status-box {
  cursor: pointer;
}
</style>
