<template>
  <div class="account-list-content page-wrap ">
    <div class="search_title flex flex-middle flex-between m-t-20">
      <span class="title_span">
        <em />
        <p>账号数据明细</p>
      </span>
      <!-- <el-form ref="useForm" inline :model="config" size="mini" class="m-t-20">
        <div class="flex flex-end">
          <div class="flex">
            <el-form-item label="账号名称" prop="account">
              <el-input v-model="config.accountName" placeholder="请输入账号名称" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleClickSearch">查询</el-button>
              <el-button plain @click="handleClickReset">重置</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form> -->
    </div>
    <div class="account-list-table m-t-20">
      <MPageLayout
        ref="MPageLayout"
        type="tablePage"
        class="table-fixed"
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
        <div slot="accountNick" slot-scope="{ row }" @click="toShowDetail(row)">
          <span class="account-table-line">
            <img :src="row.avatar" />
            <p>{{ row.accountNick }}</p>
          </span>
        </div>
        <div slot="addContent" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addContent) }}</p>
        </div>
        <div slot="addFans" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addFans) }}</p>
        </div>
        <div slot="addVideoView" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addVideoView) }}</p>
        </div>
        <div slot="addGreats" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addGreats) }}</p>
        </div>
        <div slot="addShared" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addShared) }}</p>
        </div>
        <div slot="addOrder" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addOrder) }}</p>
        </div>
        <div slot="addFreeOrder" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addFreeOrder) }}</p>
        </div>
        <div slot="addPayOrder" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addPayOrder) }}</p>
        </div>
        <div slot="addGmv" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addGmv) }}</p>
        </div>
        <div slot="addFreeGmv" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addFreeGmv) }}</p>
        </div>
        <div slot="addPayGmv" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addPayGmv) }}</p>
        </div>
        <div slot="addComment" slot-scope="{row}">
          <p>{{ formatterForNumber(row.addComment) }}</p>
        </div>
        <!-- <div slot="action" slot-scope="scope">
          <el-button type="text" @click="toShowDetail(scope.row)">详情</el-button>
        </div> -->
        <div slot="footer" />
      </MPageLayout>
    </div>

  </div>
</template>

<script>
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import { getAccountList } from '@/api/videoManagement/dataApi'
import { teacherQueryByName } from '@/api/tearchCenter/index'
export default {
  components: {
  },
  props: {
    search: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  data() {
    return {
      iconShezhi,
      tearchArray: [],
      searchIng: false,
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'addShared', 'accountNick', 'addContent', 'addFans', 'addVideoView', 'addGreats', 'addOrder', 'addFreeOrder', 'addPayOrder', 'addGmv', 'addFreeGmv', 'addPayGmv', 'addComment'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'accountNick', label: '账号名称', width: 230, type: 'slot', visible: true },
          { prop: 'platformName', label: '平台', type: 'text', visible: true },
          { prop: 'addContent', label: '新增作品', width: 110, type: 'slot', sortable: true, visible: true },
          { prop: 'addFans', label: '新增粉丝', width: 110, type: 'slot', visible: true, sortable: true, disable: false },
          { prop: 'addVideoView', label: '新增播放', width: 110, type: 'slot', visible: true, sortable: true, disable: false },
          { prop: 'addGreats', label: '新增点赞', width: 110, type: 'slot', visible: true, sortable: true, disable: false },
          { prop: 'addComment', label: '新增评论', width: 110, type: 'slot', visible: true, sortable: true, disable: false },
          { prop: 'addShared', label: '新增分享', width: 110, type: 'slot', visible: true, sortable: true, disable: false },
          { prop: 'addOrder', label: '新增订单', width: 110, type: 'slot', visible: true, sortable: true, disable: false },
          { prop: 'addFreeOrder', label: '新增免费订单', width: 130, type: 'slot', visible: true, sortable: true, disable: false },
          { prop: 'addPayOrder', label: '新增付费订单', width: 130, type: 'slot', visible: true, sortable: true, disable: false },
          { prop: 'addGmv', label: '新增GMV', width: 110, type: 'slot', visible: true, sortable: true, disable: false },
          { prop: 'addFreeGmv', label: '新增免费GMV', width: 135, type: 'slot', visible: true, sortable: true, disable: false },
          { prop: 'addPayGmv', label: '新增付费GMV', width: 135, type: 'slot', visible: true, sortable: true, disable: false }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0,
        orderByParam: 1,
        accountName: '',
        orderByWay: 0
      },
      paramsForm: {
        endTime: '',
        orderByParam: 1,
        orderByWay: 0,
        platformAccountId: '',
        platformId: 0,
        startTime: '',
        teacherId: ''
      },
      multipleSelection: [],
      permsList: this.$route.meta.permsList || [],
      propArray: [
        { label: 'addContent', value: 1 },
        { label: 'addFans', value: 2 },
        { label: 'addVideoView', value: 3 },
        { label: 'addGreats', value: 4 },
        { label: 'addOrder', value: 6 },
        { label: 'addFreeOrder', value: 7 },
        { label: 'addPayOrder', value: 8 },
        { label: 'addGmv', value: 9 },
        { label: 'addFreeGmv', value: 10 },
        { label: 'addPayGmv', value: 11 },
        { label: 'addComment', value: 5 }
      ]
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
    },
    'config.tableData': {
      handler() {
        this.$nextTick(() => {
          this.$refs.MPageLayout.doLayout()
        })
      },
      deep: true
    }
  },
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', (res) => {
      localStorage.setItem('myDataAccountList', JSON.stringify(this.config.tableColumns))
    })
  },
  created() {
    const tableColumns = localStorage.getItem('myDataAccountList')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    this.loadTeacherData()
    this.getList()
  },
  methods: {
    toShowDetail(row) {
      const path = this.$route.path
      this.$router.push({
        path: `/videoManagement/myAccountDetail?fromType=all&accountId=${row.platformAccountId}&startTime=${this.search.startTime}&endTime=${this.search.endTime}`,
        query: {
          path,
          name: '我的数据'
        }
      })
      // this.$router.push({ path: 'myAccountDetail?fromType=all&accountId=' + row.platformAccountId })
    },
    loadData() {
      this.$emit('loadData')
    },
    handleClickReset() {
      this.config.accountName = ''
      this.config.pageIndex = 1
      this.getList()
    },
    handleClickSearch() {
      this.config.pageIndex = 1
      this.getList()
    },
    formatterForNumber(num) {
      return String(num).replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
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
      localStorage.setItem('myDataAccountList', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      this.$nextTick(() => {
        this.$refs.MPageLayout.doLayout()
      })

      localStorage.setItem('myDataAccountList', JSON.stringify(this.config.tableColumns))
    },
    // sortChange(val) {
    //   this.propArray.some(item => {
    //     if (item.label === val.prop) {
    //       this.config.orderByParam = item.value
    //     }
    //   })
    //   if (val.order === 'descending') {
    //     this.config.orderByWay = 0
    //   }
    //   if (val.order === 'ascending') {
    //     this.config.orderByWay = 1
    //   }
    //   this.getList()
    // },
    // 获取列表数据
    getList() {
      this.paramsForm.platformAccountId = this.search.platformAccountId
      this.paramsForm.startTime = this.search.startTime
      this.paramsForm.endTime = this.search.endTime
      this.paramsForm.teacherId = this.search.teacherId
      this.paramsForm.orderByWay = this.config.orderByWay
      this.paramsForm.orderByParam = this.config.orderByParam
      this.paramsForm.platformId = this.search.platformId
      this.paramsForm.platformAccountId = this.search.platformAccountId
      getAccountList(this.paramsForm).then(res => {
        console.log(res, '获取列表数据')
        if (res.success) {
          this.config.tableData = res.data
          this.config.pageSize = res.data.pageSize
          this.config.currentPage = res.data.pageIndex
          this.config.total = res.data.total
        }
      })
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
    loadTeacherData() {
      const params = {
        name: ''
      }
      teacherQueryByName(params)
        .then((res) => {
          this.tearchArray = res.data
        })
        .catch(() => {
        })
    }
  }
}
</script>

  <style lang='scss' scoped>
  .account-list-content {
    width: 100%;
    height: 100%;
    @media screen and (max-width: 1550px) {
      ::v-deep .PageLayout {
        max-height: 610px;
      }
    }
    @media screen and (min-width: 1550px) {
      ::v-deep .PageLayout {
        max-height: 650px;
      }
    }
    ::v-deep .el-table__fixed {
      height:auto !important; // 让固定列的高自适应，且设置!important覆盖ele-ui的默认样式
      bottom:17px; // 固定列默认设置了定位，    position: absolute;top: 0;left: 0;只需要再设置一下bottom的值，让固定列和父元素的底部出现距离即可
    }

    ::v-deep .el-table__fixed {
      height: 100% !important; //设置高优先，以覆盖内联样式
    }
    ::v-deep .el-table__fixed-right {
      height: calc(100% + 15px) !important; //设置高优先，以覆盖内联样式
      border: none !important;
    }
    ::v-deep .el-table__fixed::before, .el-table__fixed-right::before {
      background-color: none!important;
    }

    ::v-deep .my-table .el-table::before, .el-table--group::after, .el-table--border::after {
      background-color: #fff;
    }
    ::v-deep .my-table {
      margin: 0;
      height: calc(100% - 10px);
    }
    ::v-deep .page_header {
      padding: 0;
      height: 0;
      min-height: 0;
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
    .dialog-cls {
      ::v-deep .el-dialog {
        border-radius: 10px;
      }
      ::v-deep .el-dialog__header {
        border-bottom: 1px solid #e7e7e7;
      }
    }
  }
  .el-icon-lsdd {
    cursor: pointer;
    width: 14px;
    height: 14px;
    margin-top: 1px;
    background-image: url(../../../../assets/image/video/icn_wenhao.png);
    background-size: 100%;
  }
  .tips-block {
    width: 100%;
    height: 40px;
    z-index: 3;
    position: relative;
    i {
      position: absolute;
      top: 15px;
      left: 300px;
    }
  }
  .search-top {
    overflow: hidden;
    margin-bottom: 20px;
  }
  .inner-cls {
    margin-top: 15px;
  }
  ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label{
    color:#333;
  }
  .del-cls {
    color: #F53F3F;
  }

  .show-block {
    .p-title {
      max-width: 180px;
      overflow: hidden;
      float: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow:ellipsis;
    }
    i {
      color: #0C6FFF;
      cursor: pointer;
      margin-left: 10px;
      float: left;
      margin-top: 5px;
    }
  }
  .show-edit {
    width: 220px;
    ::v-deep .el-input--mini {
      width: 150px;
      float: left;
    }
    ::v-deep .el-input__inner {
      width: 150px;
      padding: 0 5px;
      float: left;
    }
    ::v-deep .el-button--primary.is-plain {
      float: left;
      margin-left: 10px;
    }
  }
  .scope-p-cls {
    cursor: pointer;
    width: 100%;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap;
  }

  .zhihui-cls {
    color: #9c9c9c;
  }
  .right_btn {
    float: right;
  }
  .right-float {
    float: right;
    margin-right: 0px;
    width: 200px;
  }

  .search_title {
      width: 100%;
      height: 32px;
      .title_span {
          color: #333;
          height: 24px;
          font-size: 16px;
          line-height: 24px;
          margin-right: 10px;
          p {
              float: left;
              line-height: 24px;
              font-weight: bold;
          }
          em {
              float: left;
              width: 4px;
              height: 24px;
              border-radius: 6px;
              background: #0c6fff;
              margin-right: 8px;
          }
      }
      .right_time_choose-s {
          float: right;
          height: 32px;
      }
    }
    .account-list-table {
      height: 100%;
      ::v-deep .el-table--scrollable-y .el-table__body-wrapper {
        min-height: 300px !important;
        max-height: 580px!important;
        padding-bottom: 20px;
      }
      ::v-deep .page_footer {
        display: none;
      }
      .account-table-line {
        width: 100%;
        display: flex;
        color: #0c6fff;
        cursor: pointer;
        img {
          width: 40px;
          height: 40px;
          border-radius: 100%;
          margin-right: 8px;
        }
        p {
          flex: 1;
          height: 40px;
          line-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  </style>
  <style lang='scss'>
  .el-table__fixed::before, .el-table__fixed-right::before {
    background-color: none!important;
    height: 0px!important;
  }
  </style>

