<template>
  <div v-if="visible">
    <!-- 订单认领弹框 -->
    <AppDialog
      v-model="visible"
      title="订单认领"
      width="1200px"
      height="auto"
      :footer-text="['认领', '取消']"
      @success="onClickReceiveModelOk"
    >
      <div class="model-conten">
        <div class="model-title">
          <div class="notice-title">多个订单认领</div>
          <el-button type="text" size="small" @click="handleAdd">新增一行</el-button>
        </div>
        <div class="table-title flex">
          <div>订单编号</div>
          <div>认领备注</div>
          <div>原招生老师</div>
          <div>新招生老师</div>
          <div>有效性</div>
          <div />
        </div>
        <div class="table-content">
          <div v-for="(item,index) in tableData" :key="index" class="table-content-item flex">
            <div><el-input v-model="item.orderNo" placeholder="请输入获客订单号" clearable @clear="clearOrderNo(item)" @blur="onClickReceiveModelSearch(item)" @keyup.enter.native="onClickReceiveModelSearch(item)" /></div>
            <div class="relative">
              <div class="flex">
                <el-input v-model="item.claimReason" style="width:220px;margin-right:8px" maxlength="500" placeholder="请输入认领备注" clearable @change="handleClaimReasonChange(item)" />
                <upload
                  :ref="'MUpload' + index"
                  width="54"
                  height="54"
                  accept=".jpg,.jpeg,.png"
                  upload-text="图片"
                  :before-upload="beforeUpload"
                  :max-length="2"
                  oss-teacher-folder="hok_orderClaim"
                  @onClick="onUploadClick($event, index)"
                  @change="fileChange($event, index)"
                />
              </div>
              <div v-if="item.error" class="tips">认领备注不能为空</div>
            </div>
            <div>{{ item.enrollmentTeacherName }}</div>
            <div>{{ item.enrollmentTeacherNameNew }}</div>
            <div>
              <div v-if="item.id">
                <span v-if="item.isGive">订单有效</span>
                <el-tooltip v-else effect="dark" :content="item.content" placement="top-start">
                  <span>订单无效<i class="el-icon-warning" /></span>
                </el-tooltip></div>
            </div>
            <div class="table-content-item-del" @click="handleDel(index)">删除</div>
          </div>
        </div>
        <div class="tips">单次最多20条，订单无效时，当前行订单不处理，请确保订单号输入正确！</div>
      </div>
    </AppDialog>
  </div>
</template>
<script>
import AppDialog from '@/components/AppDialog'
import upload from '@/components/AppUploadView/upload.vue'
import { getFileType } from '@/utils/index'
import { mapGetters } from 'vuex'
import {
  orderClaims,
  findOrderNo
} from '@/api/business'
export default {
  components: {
    AppDialog,
    upload
  },
  data() {
    return {
      visible: false,
      optionsTask: [],
      searchPrecisen: { // 精准搜索
        content: '',
        isGive: ''
      },
      form: {
        taskId: '',
        claimReason: '',
        attachmentUrlList: []
      },
      tableData: [{
        orderNo: '',
        claimReason: '',
        attachmentUrlList: [],
        enrollmentTeacherName: '',
        isGive: '',
        enrollmentTeacherNameNew: ''
      }]
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    handleAdd() {
      if (this.tableData.length >= 20) {
        this.$message.error('最多只能认领20个订单')
        return
      }
      this.tableData.push({
        orderNo: '',
        claimReason: '',
        attachmentUrlList: [],
        enrollmentTeacherName: '',
        isGive: '',
        enrollmentTeacherNameNew: '',
        content: '',
        error: false
      })
    },
    open() {
      this.tableData = [{
        orderNo: '',
        claimReason: '',
        attachmentUrlList: [],
        enrollmentTeacherName: '',
        isGive: '',
        enrollmentTeacherNameNew: '',
        content: '',
        error: false
      }]
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
    fileChange(res, index) {
      if (res.length > 0) {
        this.tableData[index].attachmentUrlList = res.map(i => i.url)
        this.tableData[index].error = false
      }
    },
    onUploadClick(res, index) {
      this.tableData[index].attachmentUrlList.splice(res, 1)
      this.$refs[`MUpload${index}`] && this.$refs[`MUpload${index}`][0].delFile('', res)
    },
    // 认领重置
    handleDel(index) {
      this.tableData.splice(index, 1)
    },
    async onClickReceiveModelOk() {
      const arr = this.tableData.filter(i => i.orderNo)
      if (!arr.length) {
        this.$message.error('没有可认领的订单')
        return
      }
      this.tableData.forEach(i => {
        if (!i.claimReason && !i.attachmentUrlList.length && (i.enrollmentTeacherName && (i.enrollmentTeacherName !== '无' && i.enrollmentTeacherName !== i.enrollmentTeacherNameNew))) {
          i.error = true
        }
      })
      if (this.tableData.some(i => i.error)) {
        return
      }
      const adoptData = await orderClaims(arr.map(i => ({ orderNo: i.orderNo, claimReason: i.claimReason, attachmentUrlList: i.attachmentUrlList })))
      if (adoptData.code === 1) {
        this.$message({
          message: '操作成功，可在认领记录中查看',
          type: 'success'
        })
        this.tableData = []
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
    async onClickReceiveModelSearch(item) {
      if (!item.orderNo) {
        return
      }
      const params = {
        orderNo: item.orderNo,
        type: 2 // 1 赠送关联订单精准查询 2 认领订单精准查询
      }

      const res = await findOrderNo(params)
      if (res.code === 1 && res.data !== '' && res.data !== null) {
        item.enrollmentTeacherName = res.data.enrollmentTeacherName ? res.data.enrollmentTeacherName : '无'
        item.isGive = res.data.isGive
        item.enrollmentTeacherNameNew = this.userInfo.nickName
        item.content = res.data.content
        item.id = res.data.id
      } else {
        this.$message.error('请输入正确的订单号')
        item.orderNo = ''
      }
    },
    handleClaimReasonChange(item) {
      if (!item.claimReason && !item.attachmentUrlList.length) {
        item.error = true
      } else {
        item.error = false
      }
    },
    clearOrderNo(item) {
      item.orderNo = ''
      item.enrollmentTeacherName = ''
      item.enrollmentTeacherNameNew = ''
      item.isGive = ''
      item.content = ''
      item.id = ''
      item.error = false
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
}
.tips {
  color: #F1330D;
  font-family: "Microsoft YaHei";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  margin-top: -1px;
  position: absolute;
}
.model-title{
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
}
.table-title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  flex-shrink: 0;
  border-radius: 8px 8px 0 0;
  background: #F5F5F5;
  color: #000000;
  font-family: "Microsoft YaHei";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  padding:0 10px;
  div {
    flex: 0 0 5%;
    &:nth-of-type(1) {
      flex: 0 0 25%
    }
    &:nth-of-type(2) {
      flex: 0 0 38%
    }
    &:nth-of-type(3) {
      flex: 0 0 12%
    }
    &:nth-of-type(4) {
      flex: 0 0 12%
    }
    &:nth-of-type(5) {
      flex: 0 0 8%
    }
  }
}
.table-content{
  height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
  .table-content-item{
    border-bottom: 1px solid #F2F2F2;
    border-left: 1px solid #F2F2F2;
    border-right: 1px solid #F2F2F2;
    color: #000000;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    padding: 18px 0 14px;
    // line-height: 46px;
    >div {
      flex: 0 0 5%;
      padding: 0 9px;
      &:nth-of-type(1) {
        flex: 0 0 25%
      }
      &:nth-of-type(2) {
        flex: 0 0 37%
      }
      &:nth-of-type(3) {
        flex: 0 0 12%;
        line-height: 46px;

      }
      &:nth-of-type(4) {
        flex: 0 0 12%;
        line-height: 46px;
      }
      &:nth-of-type(5) {
        flex: 0 0 9%;
        line-height: 46px;
      }
      &:nth-of-type(6) {
        line-height: 46px;
      }
    }
  }
  .table-content-item-del {
    cursor: pointer;
    color: #F1330D;
  }
}
.relative {
  position: relative;
}
::v-deep {
  .el-upload {
    .el-upload-dragger {
      width: 54px;
      height: 54px;
    }
  }
}
::v-deep {
  .upload {
    margin-top: -8px;
    margin-right: 5px;
  }
  .upload .uploadView .uploadViewText {
    font-size: 10px;
    margin-top: 0px;
    color: #000000;
  }
  .maskdShow {
    height: 22px;
  }
  .maskdShow .maskdShowText{
    font-size: 10px;
  }
}
</style>
