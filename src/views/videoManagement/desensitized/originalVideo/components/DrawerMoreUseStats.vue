<template>
  <el-drawer :visible.sync="visibleDrawer" @close="visibleDrawer=false">
    <template slot="title">
      <slot name="title">
        <p class="title-p">{{ obj.title }}<em>使用统计</em></p>
      </slot>
    </template>
    <p class="use-list">使用人员列表（{{ list.length }}）</p>
    <el-table :data="showDataArray" class="px-4 hk-table">
      <el-table-column prop="userName" label="员工姓名" />
      <el-table-column prop="semiVideoTotal" label="半成品数" />
      <el-table-column prop="finishVideoTotal" label="成品数" />
    </el-table>
    <div class="page-block">
      <el-pagination
        v-if="list.length > pageSize"
        :current-page="currentPage"
        :page-sizes="[15, 30, 45, 60]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-drawer>
</template>
<script>
import { getStatisticsDetail } from '@/api/videoManagement/origin'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    obj: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      list: [],
      nameTitle: '',
      currentPage: 1,
      pageSize: 15,
      showDataArray: []
    }
  },
  computed: {
    visibleDrawer: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    obj: {
      handler: function () {
        console.log('监听到了::::::::', this.obj)
        this.loadData()
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    loadData() {
      this.nameTitle = this.obj.title + ' 使用统计'
      const params = {
        videoGroupId: this.obj.videoGroupId
      }
      getStatisticsDetail(params).then(res => {
        this.list = res.data.dataList
        /* this.list = [
          { avatar: '', finishVideoTotal: 15, semiVideoTotal: 12, userName: '测试name' },
          { avatar: '', finishVideoTotal: 34, semiVideoTotal: 13, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 22, semiVideoTotal: 22, userName: '的说法二我让' },
          { avatar: '', finishVideoTotal: 433, semiVideoTotal: 56, userName: '范德萨额外' },
          { avatar: '', finishVideoTotal: 32, semiVideoTotal: 32, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 433, semiVideoTotal: 33, userName: '地方撒尔' },
          { avatar: '', finishVideoTotal: 43, semiVideoTotal: 112, userName: '的说法二' },
          { avatar: '', finishVideoTotal: 543, semiVideoTotal: 21, userName: '地方撒尔' },
          { avatar: '', finishVideoTotal: 4534, semiVideoTotal: 233, userName: '的说法额外' },
          { avatar: '', finishVideoTotal: 5675, semiVideoTotal: 67, userName: '分数单位' },
          { avatar: '', finishVideoTotal: 56, semiVideoTotal: 77, userName: '发的色温人' },
          { avatar: '', finishVideoTotal: 65, semiVideoTotal: 67, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 56, semiVideoTotal: 65, userName: '富士达而' },
          { avatar: '', finishVideoTotal: 65, semiVideoTotal: 56, userName: '分数单位' },
          { avatar: '', finishVideoTotal: 5, semiVideoTotal: 765, userName: '是打分违法第三' },
          { avatar: '', finishVideoTotal: 55, semiVideoTotal: 66, userName: 'we进口量法的撒库拉' },
          { avatar: '', finishVideoTotal: 15, semiVideoTotal: 12, userName: '测试name' },
          { avatar: '', finishVideoTotal: 34, semiVideoTotal: 13, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 22, semiVideoTotal: 22, userName: '的说法二我让' },
          { avatar: '', finishVideoTotal: 433, semiVideoTotal: 56, userName: '范德萨额外' },
          { avatar: '', finishVideoTotal: 32, semiVideoTotal: 32, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 433, semiVideoTotal: 33, userName: '地方撒尔' },
          { avatar: '', finishVideoTotal: 43, semiVideoTotal: 112, userName: '的说法二' },
          { avatar: '', finishVideoTotal: 543, semiVideoTotal: 21, userName: '地方撒尔' },
          { avatar: '', finishVideoTotal: 4534, semiVideoTotal: 233, userName: '的说法额外' },
          { avatar: '', finishVideoTotal: 5675, semiVideoTotal: 67, userName: '分数单位' },
          { avatar: '', finishVideoTotal: 56, semiVideoTotal: 77, userName: '发的色温人' },
          { avatar: '', finishVideoTotal: 65, semiVideoTotal: 67, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 56, semiVideoTotal: 65, userName: '富士达而' },
          { avatar: '', finishVideoTotal: 65, semiVideoTotal: 56, userName: '分数单位' },
          { avatar: '', finishVideoTotal: 5, semiVideoTotal: 765, userName: '是打分违法第三' },
          { avatar: '', finishVideoTotal: 55, semiVideoTotal: 66, userName: 'we进口量法的撒库拉' },
          { avatar: '', finishVideoTotal: 15, semiVideoTotal: 12, userName: '测试name' },
          { avatar: '', finishVideoTotal: 34, semiVideoTotal: 13, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 22, semiVideoTotal: 22, userName: '的说法二我让' },
          { avatar: '', finishVideoTotal: 433, semiVideoTotal: 56, userName: '范德萨额外' },
          { avatar: '', finishVideoTotal: 32, semiVideoTotal: 32, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 433, semiVideoTotal: 33, userName: '地方撒尔' },
          { avatar: '', finishVideoTotal: 43, semiVideoTotal: 112, userName: '的说法二' },
          { avatar: '', finishVideoTotal: 543, semiVideoTotal: 21, userName: '地方撒尔' },
          { avatar: '', finishVideoTotal: 4534, semiVideoTotal: 233, userName: '的说法额外' },
          { avatar: '', finishVideoTotal: 5675, semiVideoTotal: 67, userName: '分数单位' },
          { avatar: '', finishVideoTotal: 56, semiVideoTotal: 77, userName: '发的色温人' },
          { avatar: '', finishVideoTotal: 65, semiVideoTotal: 67, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 56, semiVideoTotal: 65, userName: '富士达而' },
          { avatar: '', finishVideoTotal: 65, semiVideoTotal: 56, userName: '分数单位' },
          { avatar: '', finishVideoTotal: 5, semiVideoTotal: 765, userName: '是打分违法第三' },
          { avatar: '', finishVideoTotal: 55, semiVideoTotal: 66, userName: 'we进口量法的撒库拉' },
          { avatar: '', finishVideoTotal: 15, semiVideoTotal: 12, userName: '测试name' },
          { avatar: '', finishVideoTotal: 34, semiVideoTotal: 13, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 22, semiVideoTotal: 22, userName: '的说法二我让' },
          { avatar: '', finishVideoTotal: 433, semiVideoTotal: 56, userName: '范德萨额外' },
          { avatar: '', finishVideoTotal: 32, semiVideoTotal: 32, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 433, semiVideoTotal: 33, userName: '地方撒尔' },
          { avatar: '', finishVideoTotal: 43, semiVideoTotal: 112, userName: '的说法二' },
          { avatar: '', finishVideoTotal: 543, semiVideoTotal: 21, userName: '地方撒尔' },
          { avatar: '', finishVideoTotal: 4534, semiVideoTotal: 233, userName: '的说法额外' },
          { avatar: '', finishVideoTotal: 5675, semiVideoTotal: 67, userName: '分数单位' },
          { avatar: '', finishVideoTotal: 56, semiVideoTotal: 77, userName: '发的色温人' },
          { avatar: '', finishVideoTotal: 65, semiVideoTotal: 67, userName: '范迪萨尔' },
          { avatar: '', finishVideoTotal: 56, semiVideoTotal: 65, userName: '富士达而' },
          { avatar: '', finishVideoTotal: 65, semiVideoTotal: 56, userName: '分数单位' },
          { avatar: '', finishVideoTotal: 5, semiVideoTotal: 765, userName: '是打分违法第三' },
          { avatar: '', finishVideoTotal: 55, semiVideoTotal: 66, userName: 'we进口量法的撒库拉' }
        ] */
        this.showDataArray = []
        this.currentPage = 1
        this.showDataArray = this.list.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%:', res)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.showDataArray = []
      this.showDataArray = this.list.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    handleCurrentChange(val) {
      this.showDataArray = []
      this.currentPage = val
      this.showDataArray = this.list.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  }
}
</script>
  <style lang="scss" scoped>
  ::v-deep .el-drawer.rtl{
    width:50%!important;
  }
  ::v-deep .el-dialog__close{
    color:#000;
  }
  ::v-deep .el-drawer__header{
    padding:22px 20px;
    margin-bottom:0;
    line-height: 1;
    border-bottom:1px solid #E7E7E7;
    span{
      color:#333;
      font-weight: bold;
      font-size:16px;
    }
  }
  ::v-deep .has-gutter .el-table__cell{
    background: rgb(245, 245, 245);
    line-height: 1;
    border-radius: 6px;;
    border-bottom:none!important;
    .cell{
      line-height: 1;
      padding:0 20px;
    }
  }
  ::v-deep .el-drawer__body{
    padding-top:18px;
  }

  ::v-deep .el-table__body,::v-deep .el-table__header{
    width:auto!important
  }

  ::v-deep .el-table {
    height: calc(100% - 100px);
    overflow-y: auto;
  }

  ::v-deep .has-gutter .el-table__cell .cell {
    padding: 0;
    padding-left: 3px;
  }

  .use-list {
    padding-left: 17px;
    margin-bottom: 15px;
  }
  .page-block {
    text-align: right;
    padding-top: 15px;
  }

  .title-p {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    em {
      font-style: normal;
      font-size: 14px;
      font-weight: lighter;
      margin-left: 10px;
    }
  }
  </style>

