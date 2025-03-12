<template>
  <!-- 企微能力开放 -->
  <el-drawer
    :size="1000"
    :visible.sync="visible"
    :with-header="false"
    title="调用API详情"
    :destroy-on-close="true"
    :wrapper-closable="false"
    :close-on-press-escape="false"
  >
    <div class="settingDrawer">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">调用API详情</div>
        <i class="el-icon-close close" @click="close" />
      </div>
      <div class="drawerContent">
        <el-form :inline="true" :model="form" class="form-inline">
          <el-form-item label="手机号码">
            <el-input
              v-model="form.phone"
              style="width:180px"
              placeholder="请输入手机号"
            />
          </el-form-item>
          <el-form-item label="成功推送二维码">
            <el-select
              v-model="form.qrCodeMsgStatus"
              style="width:190px"
              placeholder="请选择"
              clearable
            >
              <el-option label="是" :value="2" />
              <el-option label="否" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="成功添加企微" style="margin:0">
            <el-select
              v-model="form.addContactStatus"
              style="width:190px"
              placeholder="请选择"
              clearable
            >
              <el-option label="是" :value="2" />
              <el-option label="否" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item class="form-btn">
            <el-button size="small" type="primary" @click="search">查询</el-button>
            <el-button size="small" @click="clear()">重置</el-button>
            <el-button style="float:right" size="small" :loading="exportLoading" @click="exportExcell">导出</el-button>
          </el-form-item>
        </el-form>
        <dynamicTable
          ref="table"
          v-model="tableData"
          :columns="columns"
          :get-list-api="getList"
        >
          <template #pushSMS="{row}">
            <el-tooltip :content="`短信推送${row.smsMsgStatus == 2?'成功':'失败'}`" placement="bottom" effect="light">
              <svg-icon v-if="row.smsMsgStatus == 1" icon-class="icon_pushSMS" class="table-svg" />
              <svg-icon v-if="row.smsMsgStatus == 2" icon-class="icon_pushSMS_hover" class="table-svg" />
            </el-tooltip>
            <el-tooltip :content="`二维码推送${row.qrCodeMsgStatus == 2?'成功':'失败'}`" placement="bottom" effect="light">
              <svg-icon v-if="row.qrCodeMsgStatus == 1" icon-class="icon_qrcode" class="table-svg" />
              <svg-icon v-if="row.qrCodeMsgStatus == 2" icon-class="icon_qrcode_hover" class="table-svg" />
            </el-tooltip>
            <el-tooltip :content="`企微添加${row.addContactStatus == 2?'成功':'失败'}`" placement="bottom" effect="light">
              <svg-icon v-if="row.addContactStatus == 1" icon-class="icon_weCom" class="table-svg" />
              <svg-icon v-if="row.addContactStatus == 2" icon-class="icon_weCom_hover" class="table-svg" />
            </el-tooltip>
          </template>
        </dynamicTable>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getColumns } from './column'
import { recallPage } from '@/api/privateArea/recall'
import { exportCallProvider } from '@/api/privateArea/recall'
export default {
  components: {
    dynamicTable
  },
  props: {
    channelId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      exportLoading: false,
      visible: false,
      tableData: [],
      columns: getColumns.call(this),
      form: {
        phone: '',
        qrCodeMsgStatus: '', //	成功推送二维码 1: 否 2:是
        addContactStatus: '' // 成功添加企微, 1否，2是
      },
      searchObj: {
        channelId: '',
        time: null
      }
    }
  },
  mounted() {},
  methods: {
    // 点击关闭
    close() {
      this.visible = false
    },
    getList(params) {
      let startTime = ''
      let endTime = ''
      if (this.searchObj.time && this.searchObj.time.length > 0) {
        startTime = this.searchObj.time[0]
      }
      if (this.searchObj.time && this.searchObj.time.length > 0) {
        endTime = this.searchObj.time[1]
      }
      const data = {
        channelId: this.channelId,
        size: params.pageSize,
        current: params.pageIndex,
        ...params,
        startTime,
        endTime
      }
      delete data.pageSize
      delete data.pageIndex
      return recallPage(data).then(res => {
        res.data.items = res.data.records
        return res
      })
    },
    open(search) {
      this.searchObj = search
      this.visible = true
    },
    search() {
      this.$refs.table.config.pageIndex = 1
      this.$refs.table.onRefresh(this.form)
    },
    clear() {
      this.$refs.table.config.pageIndex = 1
      this.form = {
        phone: '',
        qrCodeMsgStatus: '', //	成功推送二维码 1: 否 2:是
        addContactStatus: '' // 成功添加企微, 1否，2是
      }
      this.search()
    },
    // 导出
    exportExcell() {
      let startTime = ''
      let endTime = ''
      if (this.searchObj.time && this.searchObj.time.length > 0) {
        startTime = this.searchObj.time[0]
      }
      if (this.searchObj.time && this.searchObj.time.length > 0) {
        endTime = this.searchObj.time[1]
      }
      const data = {
        channelId: this.channelId,
        startTime,
        endTime
      }
      this.exportLoading = true
      exportCallProvider(data).then(res => {
        console.log(res, '导出')
        var newWin = window.open('loading page', '_self')
        newWin.location.href = res.data // 成功 重定向到目标页面
        this.exportLoading = false
      }).catch(err => {
        console.log(err)
        this.exportLoading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.settingDrawer ::v-deep{
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #FFFFFF;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .table-svg{
    font-size:24px;
    margin-right:10px;
  }
  .drawerContent {
    flex: 1 0 0;
    display: flex;
    padding:  20px  0;
    flex-direction: column;
    .form-inline {
       padding:  0px  20px;
       height: 90px;
       .form-btn{
        width: 100%;
        .el-form-item__content{
          width: 100%;
        }
       }
    }
    .costConfirmDetail {
      display: flex;
      justify-content: space-between;
      .dataCollect {
        width: 218px;
        background: #F2F9FF;
        border-radius: 8px;
        padding: 16px;
        .dataCollectTitle {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #777777;
          line-height: 24px;
          margin-bottom: 8px;
        }
        .dataCollectValue {
          font-size: 20px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          color: #161616;
          line-height: 32px;
        }
      }
    }
    .mytabs {
      flex: 1 0 0;
    }
  }
  .ss-material-box-footer {
    padding-right: 18px;
    border-top: 1px solid #E7E7E7;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
::v-deep {
  .el-form-item__label {
    font-weight: 500!important;
  }
}
</style>
