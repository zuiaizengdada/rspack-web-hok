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
          <el-input v-model="search.titleVal" placeholder="请输入" size="small" maxlength="100">
            <el-select slot="prepend" v-model="search.title" class="w-120" size="small" placeholder="请选择">
              <el-option label="标题" value="title" />
            </el-select>
            <!-- <el-button slot="append" icon="el-icon-search" /> -->
          </el-input>
          <div class="m-l20 search-info">
            <el-select v-model="search.timeType" placeholder="请选择" size="small">
              <el-option label="预计发送时间" value="1" />
              <el-option label="实际发送时间" value="2" />
            </el-select>
            <el-date-picker
              v-model="search.timeVal"
              size="small"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="selectTime"
            />
          </div>

          <el-button class="m-l-10" size="small" @click="getList(true)">搜索</el-button>
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
        <el-button type="primary" size="small" @click="addGroup()">新增</el-button>
      </div>
      <div slot="action" slot-scope="{ row }">
        <el-button type="text" @click="gotoDetail(row.id, row.status)">详情</el-button>
        <template v-if="row.listMore">
          <el-button type="text" @click="copyInfo(row.id)">复制</el-button>
          <el-button v-if="row.status == 5 || row.status == 6" type="text" @click="sendResend(row.id)">重新发送</el-button>
          <el-button v-if="row.status == 2" type="text" @click="sendNow(row.id)">立即发送</el-button>
          <el-button v-if="row.status == 2 || row.status == 3" type="text" @click="sendCancel(row.id)">取消发送</el-button>
        </template>
        <el-button type="text" @click="onClickListMore(row.id)">{{ row.listMore ? '收起' : '更多' }}</el-button>
      </div>
      <div slot="sendCount" slot-scope="{ row }">
        <div class="count-show" @click="openModel(row.id)">{{ row.sendCount }}</div>
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
      width="900px"
      height="auto"
      @success="memberModal.visible = false"
    >
      <div v-loading="memberModal.loading" class="customer-info-box">
        <template>
          <MPageLayout
            ref="MPageLayout"
            class="result-list-box"
            border
            type="tablePage"
            :slot-arr="slotArr"
            :current-page="configResult.currentPage"
            :page-sizes="configResult.pageSizes"
            :page-size="configResult.pageSize"
            :total="configResult.total"
            :table-data="configResult.tableData"
            :table-columns="configResult.tableColumns"
            :loading="loading"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleListSizeResultChange"
            @current-change="handleListCurrentResultChange"
            @handleSelectionChange="handleListSelectionResultChange"
          />
        </template>
      </div>
      <div slot="footer" class="footer">
        <!-- <el-button type="primary" size="small" /> -->
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { GetMsgList, msgCancel, msgSend, resendMsgSend, wechatMsgResult } from '@/api/privateArea/CWMassSending'
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
        title: 'title',
        titleVal: '',
        timeType: '1',
        timeVal: '',
        beginTime: '',
        endTime: ''
      },
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'sendCount', 'price', 'type', 'sort', 'commission'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'action', label: '操作', type: 'slot', visible: true },
          { prop: 'title', label: '标题', type: 'text', visible: true },
          { prop: 'msgType', label: '发送类型', type: 'text', visible: true },
          { prop: 'sendCount', label: '已发次数', type: 'slot', visible: true },
          { prop: 'predictBeginTime', label: '预计发送开始时间', type: 'text', visible: true, render: (row) => { return parseTime(row.predictBeginTime, '{y}-{m}-{d} {h}:{i}') } },
          { prop: 'realBeginTime', label: '实际发送开始时间', type: 'text', visible: true, render: (row) => { return row.realBeginTime ? parseTime(row.realBeginTime, '{y}-{m}-{d} {h}:{i}') : '——' } },
          { prop: 'realEndTime', label: '实际发送结束时间', type: 'text', visible: true, render: (row) => { return row.realEndTime ? parseTime(row.realEndTime, '{y}-{m}-{d} {h}:{i}') : '——' } }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      configResult: {
        tableData: [],
        tableColumns: [
          { prop: 'robotId', label: '发送机器人ID', type: 'text', visible: true },
          { prop: 'nickName', label: '接收人昵称', type: 'text', visible: true },
          { prop: 'msgTypeTxt', label: '类型', type: 'text', visible: true },
          { prop: 'content', label: '发送内容', type: 'text', visible: true, render: (row) => { return row.content.replace(/<\/?.+?\/?>/g, '') } },
          { prop: 'sendTime', label: '发送时间', type: 'text', visible: true, render: (row) => { return parseTime(row.sendTime, '{y}-{m}-{d} {h}:{i}') } },
          { prop: 'sendStatusTxt', label: '发送状态', type: 'text', visible: true },
          { prop: 'failReason', label: '失败原因', type: 'text', visible: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      memberModal: {
        visible: false,
        title: '已发次数详情',
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
      listMore: false,
      msgResultId: ''
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
      console.log(this.search)
      const params = {
        title: this.search.titleVal,
        timeType: this.search.timeType,
        beginTime: this.search.beginTime,
        endTime: this.search.endTime,
        current: this.config.currentPage,
        size: this.config.pageSize
      }
      GetMsgList(params).then(res => {
        console.log(res, 'res')
        this.loading = false
        res.data.records.map(v => {
          v['listMore'] = false
        })
        this.config.tableData = res.data.records
        this.config.total = res.data.total
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取发送日志列表数据
    wechatMsgResult(recordId) {
      this.memberModal.loading = true
      console.log(this.search)
      const params = {
        recordId,
        current: this.configResult.currentPage,
        size: this.configResult.pageSize
      }
      wechatMsgResult(params).then(res => {
        console.log(res, 'res')
        res.data.records.map(v => {
          let msgTypeTxt = ''
          if (v.msgType === 1) {
            msgTypeTxt = '图文'
          } else if (v.msgType === 2) {
            msgTypeTxt = '文字'
          } else if (v.msgType === 3) {
            msgTypeTxt = '音频'
          } else if (v.msgType === 4) {
            msgTypeTxt = '视频'
          } else if (v.msgType === 5) {
            msgTypeTxt = '文件'
          } else if (v.msgType === 6) {
            msgTypeTxt = '小程序'
          }
          v['msgTypeTxt'] = msgTypeTxt
          v['sendStatusTxt'] = v.sendStatus === 1 ? '发送成功' : '发送失败'
        })
        this.configResult.tableData = res.data.records
        this.configResult.total = res.data.total
        this.memberModal.loading = false
      }).catch(() => {
        this.memberModal.loading = false
      })
    },
    // 立即发送
    sendNow(recordId) {
      const params = 'recordId=' + recordId
      msgSend(params).then(res => {
        console.log(res, 'res')
        // this.config.tableData.forEach(e => {
        //   e.id === recordId ? e.status = 3 : ''
        // })
        this.getList()
        this.$message({
          message: '发送成功',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          message: '发送失败',
          type: 'warning'
        })
      })
    },
    // 复制
    copyInfo(id) {
      console.log(id)
      this.$router.push({ name: 'PrivateAreaGroupAdd', params: { id } })
    },
    // 取消发送
    sendCancel(recordId) {
      console.log('---', recordId)
      const params = 'recordId=' + recordId
      msgCancel(params).then(res => {
        console.log(res, 'res')
        this.getList()
        this.$message({
          message: '取消成功',
          type: 'success'
        })
        this.loading = false
      }).catch(() => {
        this.$message({
          message: '取消失败',
          type: 'warning'
        })
        this.loading = false
      })
    },
    // 重新发送
    sendResend(recordId) {
      const params = 'recordId=' + recordId
      resendMsgSend(params).then(res => {
        console.log(res, 'res')
        // this.config.tableData.forEach(e => {
        //   e.id === recordId ? e.status = 3 : ''
        // })
        this.getList()
        this.$message({
          message: '发送成功',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          message: '发送失败',
          type: 'warning'
        })
      })
    },
    // 跳转订单详情
    gotoDetail(id, save_status) {
      // console.log(row)
      this.$router.push({ name: 'PrivateAreaGroupDetail', params: { id, save_status } })
      // this.$router.push({ path: `privateArea/group/detail/${row}` })
    },
    addGroup(id) {
      this.$router.push({ name: 'PrivateAreaGroupAdd', params: id })
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
    handleListSizeResultChange(val) {
      this.configResult.pageSize = val
      this.configResult.currentPage = 1
      this.wechatMsgResult(this.msgResultId)
    },
    handleListCurrentResultChange(val) {
      this.configResult.currentPage = val
      this.wechatMsgResult(this.msgResultId)
    },
    handleListSelectionResultChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
      this.wechatMsgResult(this.msgResultId)
    },
    selectTime(e) {
      if (e) {
        const beginTime = this.filterTime(e[0])
        let endTime = this.filterTime(e[1])
        if (beginTime === endTime) {
          const endTimeArr = endTime.split(' ')
          console.log('选择同一天', endTime)
          console.log('选择同一天', endTimeArr[0] + '23:59:59')
          endTime = endTimeArr[0] + ' 23:59:59'
        }
        this.search.beginTime = beginTime
        this.search.endTime = endTime
      } else {
        this.search.beginTime = ''
        this.search.endTime = ''
      }
    },
    filterTime(time) {
      const date = new Date(time)
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s
    },
    onClickListMore(row) {
      this.config.tableData.map(v => {
        v.id === row ? v.listMore = !v.listMore : ''
      })
    },
    // 打开成员信息弹框
    openModel(row) {
      // this.memberList = []
      this.memberModal.visible = true
      console.log('row', row)
      this.configResult.currentPage = 1
      this.configResult.pageSize = 10
      this.msgResultId = row
      this.wechatMsgResult(row)
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
.table_wrap {
  height: 100%;
  background: #fff;
  .count-show {
    cursor: pointer;
  }
}
.customer-info-box {
  padding: 20px;
  .result-list-box {
    height: 500px;
  }
}
.fl {
  align-items: center;
}
.m-l20 {
  padding-left: 20px;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
}
.search-info {
  display: flex;
}
</style>
