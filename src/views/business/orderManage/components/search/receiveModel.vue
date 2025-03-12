<template>
  <div v-if="visible">
    <!-- 订单认领弹框 -->
    <AppDialog
      v-model="visible"
      title="订单认领"
      width="1100px"
      height="auto"
      :footer-text="['认领', '取消']"
      @success="onClickReceiveModelOk"
    >
      <div class="model-conten">
        <div class="notice-title">认领须知：</div>
        <div class="notice-box notice-top">
          <div class="notice-info">1、请遵守公司订单认领制度，认领属于自己产出的订单。</div>
          <div class="notice-info">2、订单认领要求：订单已全额付款，无关联的招生老师，未产生退款。</div>
          <div class="notice-info">3、若出现认领他人订单等违反公司规定的认领行为时，由认领人承担相关责任，请确认订单信息。</div>
        </div>
        <div class="notice-title">认领流程：</div>
        <div class="notice-box">
          <div class="notice-info">1、通过获客订单号查询订单。</div>
          <div class="notice-info">2、核对售卖商品信息。</div>
          <div class="notice-info">3、确认认领</div>
        </div>
        <div>
          <div class="notice-title">智能销售任务：</div>
          <el-select
            v-model="form.taskId"
            :remote-method="remoteMethodTask"
            filterable
            remote
            clearable
            placeholder="请选择"
            class="w-296"
            @clear="handleChangeTask"
          >
            <el-option
              v-for="item in optionsTask"
              :key="item.id"
              :label="item.taskName"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="list-box">
          <div class="notice-title">订单查询：</div>
          <div class="list-info">
            <div class="info-search">
              <el-input v-model="receiveModel.order.value" placeholder="请输入获客订单号" class="model-with-input" clearable>
                <!-- <el-select slot="prepend" v-model="receiveModel.order.label" placeholder="请选择" class="model-with-select">
                  <el-option v-for="item in optionsAccurate" :key="item.value" :label="item.label" :value="item.value" />
                </el-select> -->
              </el-input>
              <!-- <el-button v-permission="['system:order:findOrderNo', permsList]" type="primary" size="small" @click="onClickReceiveModelSearch">查询</el-button> -->
              <el-button type="primary" size="small" @click="onClickReceiveModelSearch">查询</el-button>
              <el-button size="small" @click="onClickReceiveModelReset">重置</el-button>
            </div>
            <div class="info-item">
              <order-list ref="orderList" :show-border="true" :operation-column="false" :operation="false" :see-detail-model="false" @sizeChange="receiveSizeChange" @tableDataNum="receiveTableDataNum" @tableDataPrecisen="tableDataPrecisen" />
            </div>
            <div v-if="searchPrecisen.isGive" class="info-pop info-pop-pass">
              <svg-icon icon-class="pickUp_ok" class="icon-svg" />
              <span>当前订单可认领</span>
            </div>
            <div v-if="!searchPrecisen.isGive && searchPrecisen.content" class="info-pop">
              <svg-icon icon-class="pickUp_no" class="icon-svg" />
              <span>{{ searchPrecisen.content }}</span>
            </div>
            <div v-if="searchPrecisen.isGive && searchPrecisen.enrollmentTeacherName" class=" info-pop">
              <span>当前订单招生老师为{{ searchPrecisen.enrollmentTeacherName }}，请与当前老师和上级领导协商沟通确定订单归属后再申请认领！</span>
            </div>
          </div>
        </div>
        <div class="notice-title">认领备注：</div>
        <el-input v-model="form.claimReason" type="textarea" rows="5" maxlength="500" show-word-limit placeholder="请输入认领备注" class="model-with-input" clearable />
        <div class="notice-title" />
        <upload
          ref="MUpload"
          width="131"
          height="131"
          accept=".jpg,.jpeg,.png"
          upload-text="点击上传图片"
          :before-upload="beforeUpload"
          :max-length="9"
          oss-teacher-folder="hok_orderClaim"
          @onClick="onUploadClick"
          @change="fileChange"
        />
        <div class="tips">支持上传图片（jpg,png,jpeg），单张图片最大2M，最多上传9张图片</div>
      </div>
    </AppDialog>
  </div>
</template>
<script>
import { taskSelect } from '@/api/business/addOrder'
import AppDialog from '@/components/AppDialog'
import OrderList from '../orderList/index'
import upload from '@/components/AppUploadView/upload.vue'
import { getFileType } from '@/utils/index'
import {
  orderAdopt
} from '@/api/business'
export default {
  components: {
    OrderList,
    AppDialog,
    upload
  },
  data() {
    return {
      visible: false,
      receiveModel: {
        order: { label: 'orderNo', value: '' } // 订单搜索
      },
      optionsTask: [],
      searchPrecisen: { // 精准搜索
        content: '',
        isGive: ''
      },
      form: {
        taskId: '',
        claimReason: '',
        attachmentUrlList: []
      }
    }
  },
  created() {
    this.remoteMethodTask()
  },
  methods: {
    open() {
      this.form = {
        taskId: '',
        claimReason: '',
        attachmentUrlList: []
      }
      this.visible = true
    },
    beforeUpload(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(type)
      const isLt5M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 2M!')
      }
      return isIMAGE && isLt5M
    },
    fileChange(res) {
      if (res.length > 0) {
        this.form.attachmentUrlList = res.map(i => i.url)
      }
    },
    onUploadClick(res) {
      this.form.attachmentUrlList.splice(res, 1)
    },
    handleChangeTask() {
      this.remoteMethodTask()
    },
    async remoteMethodTask(query) {
      const { data } = await taskSelect({
        pageIndex: 1,
        pageSize: 100,
        taskName: query || undefined
      })
      this.optionsTask = data.items
    },
    // 认领重置
    onClickReceiveModelReset() {
      this.receiveModel.order = { label: 'orderNo', value: '' }
      const params = {
        orderNo: '-',
        type: 2 // 1 赠送关联订单精准查询 2 认领订单精准查询
      }
      this.$refs.orderList.searchPrecisen(params)
      this.searchPrecisen = { // 精准搜索
        content: '',
        isGive: ''
      }
    },
    async onClickReceiveModelOk() {
      if (!this.searchPrecisen.isGive) {
        this.$message.error(this.searchPrecisen.content ? this.searchPrecisen.content : '没有可认领的关联订单')
        return
      }
      // const formData = new FormData()
      // const value = this.receiveModel.order.value
      // formData.append('orderNo', value)
      // formData.append('taskId', this.form.taskId)
      // formData.append('claimReason', '')
      // formData.append('attachmentUrlList', [])
      if (this.searchPrecisen.enrollmentTeacherName && (!this.form.claimReason && !this.form.attachmentUrlList.length)) {
        return this.$message.error('当前订单名下有招生老师，认领备注不可为空（文字和图片至少有1项不为空）')
      }
      const adoptData = await orderAdopt({
        orderNo: this.receiveModel.order.value,
        taskId: this.form.taskId,
        claimReason: this.form.claimReason,
        attachmentUrlList: this.form.attachmentUrlList
      })
      if (adoptData.code === 1) {
        this.$message({
          message: '认领成功',
          type: 'success'
        })
        this.onClickReceiveModelReset()
        this.visible = false
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    receiveSizeChange(e) {
      this.$refs.orderSearch.sizeChange(e)
    },
    receiveTableDataNum(e) {
      console.log(e)
      this.$refs.orderSearch.tableDataNumChange(e)
    },
    // 认领搜索
    onClickReceiveModelSearch() {
      const label = this.receiveModel.order.label
      const value = this.receiveModel.order.value
      console.log(label)
      console.log(value)
      const params = {
        [label]: value,
        type: 2 // 1 赠送关联订单精准查询 2 认领订单精准查询
      }
      this.$refs.orderList.searchPrecisen(params)
    },
    tableDataPrecisen(e) {
      console.log(e, '搜索结果')
      this.searchPrecisen = e
    }
  }
}
</script>
<style lang="scss" scoped>

.model-conten {
  padding: 10px 25px 15px;
  height: 550px;
  overflow-y:auto;
  .notice-title {
    color: #000000;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    margin:10px 0 15px;
  }
  .notice-box {
      padding: 16px 20px;
      border-radius: 8px;
      background: #F5F5F5;
      .notice-info {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
      }
  }
  .notice-top {
      margin-top: 4px;
  }
  .list-box {
      .list-title {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #777777;
      }
      .list-info {
          .info-search {
          margin-top: 8px;
          .model-with-input {
              width: 426px;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #333333;
              margin-right: 8px;
          }
          .model-with-select {
              width: 130px;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #333333;
              height: 10px;
          }
          }
          .info-item {
            margin-top: 10px;
            height: 186px;
            overflow-x: auto;
          // overflow: scroll;
          }
          .info-pop {
          font-size: 16px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          color: #F53F3F;
          .icon-svg {
              margin: 16px 8px 0 0;
          }
          }
          .info-pop-pass {
          color: #00B42A;
          }
      }
  }
}
.tips {
  color: #777777;
  font-family: "Microsoft YaHei";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-top: 10px;
}
::v-deep {
  .el-upload {
    .el-upload-dragger {
      width: 131px;
      height: 131px;
    }
  }
}
</style>
