<!-- 停更及恢复更新 -->
<template>
  <div v-if="stopOrResumeFlag" class="stopOrResume">
    <el-dialog
      :height="'400px'"
      :width="'568px'"
      :visible.sync="stopOrResumeFlag"
      @close="handleClose()"
    >
      <div slot="title" class="dialogTitle">
        <img :src="icon_zhuyi" alt="" />
        <div class="titleContent">{{ type == 'pass' ? titleMap[status] :titleMap1[status] }}</div>
      </div>
      <div slot="teacherName" slot-scope="{ row }">
        <span>
          {{ row.teacherName ? row.teacherName.join(',') : '--' }}
        </span>
      </div>
      <div class="content">
        <div>
          平台：{{ content[0].platformName }}，账号名称：{{ content[0].accountName }}，粉丝数：{{ content[0].fans }}
        </div>
        <div class="m-t-8">
          原因：{{ content[0].reason }}
        </div>
        <div v-if="type == 'pass'">
          <div v-if="status === 1" class="m-t-12 rd">
            账号申请停更后，运营人员将不再对此账号继续进行作品更新，将对账号的运营产生不可逆转后果，确认是否继续？
          </div>
          <div v-if="status === 5" class="m-t-12 rd">
            账号注销后，系统将停止该账号的一切操作，包括账号维护、数据统计等所有相关操作，请谨慎操作。
          </div>
          <div v-if="status === 4" class="m-t-12 rd">
            移交给老师后，账号将完全交由对应老师进行维护。系统将停止该账号的一切操作，包括账号维护、数据统计等所有相关操作，请谨慎操作。
          </div>
        </div>
        <div v-else class="m-t-12">
          确认驳回吗？
        </div>
      </div>
      <div slot="footer" class="dialogFooter">
        <el-button
          size="small"
          :loading="loading"
          @click="handleClose()"
        >取消</el-button>
        <el-button
          size="small"
          :loading="loading"
          :type="type == 'pass' ?'primary':'danger'"
          @click="submitForm()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import icon_zhuyi from '@/assets/svg/videoManga/icon_zhuyi.svg'
import { filtersMoneyByW } from '@/filters/index'
export default {
  name: 'StopOrResume',
  data() {
    return {
      stopOrResumeFlag: false,
      loading: false,
      icon_zhuyi,
      type: '',
      status: 1,
      content: [],
      titleMap: {
        1: '停更确认通过提示',
        2: '转号确认通过提示',
        5: '注销确认通过提示',
        3: '变更运营确认通过提示',
        4: '移交老师确认通过提示'
      },
      titleMap1: {
        1: '停更确认驳回提示',
        2: '转号确认驳回提示',
        5: '注销确认驳回提示',
        3: '变更运营确认驳回提示',
        4: '移交老师确认驳回提示'
      },
      form: {
        reason: ''
      }
    }
  },
  methods: {
    filtersMoneyByW,
    show(data, status, type) {
      console.log(data, status, type, 'shuju ')
      this.content = data
      this.status = status
      this.type = type
      this.stopOrResumeFlag = true
    },
    handleClose(done) {
      this.stopOrResumeFlag = false
    },
    submitForm() {
      this.$emit('submit', this.type, this.content)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
    border-radius: 10px;
    .el-dialog__body {
        padding: 0;
    }
    .el-dialog__footer {
        padding: 0;
    }
}
::v-deep .el-dialog__header{
    padding: 0;
}
// .lastTime{
// font-size: 16px;
// font-family: PingFangSC-Regular, PingFang SC;
// font-weight: 400;
// color: #333333;
// }
.stopTips{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F53F3F;
    margin-top: 20px;
}
.rd{
  color: #F53F3F;
}
.content {
  padding: 20px;
  .accountInfo{
    padding: 20px;
    box-sizing: border-box;
    background: #E7F0FF;
    margin-bottom: 20px;
    .title1{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
    }
    .accountInfo_con{
        display: flex;
        align-items: center;
        margin-top: 10px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        >span{
         flex: 1;
        }
    }
    .accountInfo_tit{
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #333333;
    }
  }
}
.dialogTitle{
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    border-bottom:1px solid #e7e7e7 ;
    .titleContent{
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
        margin-left: 10px;
    }
}
.dialogFooter{
    padding: 20px 16px;
    border-top: 1px solid #e7e7e7;
}
</style>
