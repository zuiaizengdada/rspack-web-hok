<template>
  <div v-if="visible">
    <!-- 订单认领弹框 -->
    <AppDialog
      v-model="visible"
      title="认领详情"
      width="800px"
      height="auto"
      :btn-footer="review"
    >
      <div class="model-conten">
        <div class="notice-title">认领内容</div>
        <div class="notice-box notice-top">
          <div class="notice-info"><span>认领编号：</span>{{ detail.id }}</div>
          <div class="notice-info"><span>认领人：</span>{{ detail.newTeacherName }}</div>
          <div class="notice-info"><span>认领时间：</span>{{ moment(detail.createdAt).format(
            'YYYY-MM-DD HH:mm:ss'
          ) }}</div>
          <div class="notice-info"><span>认领备注：</span>
            <div class="remark-box">{{ detail.claimReason }}</div>
            <div v-if="detail.attachmentUrlList.length>0" class="voucherImgage">
              <el-image
                v-for="(item, index) in detail.attachmentUrlList"
                :key="index"
                style="width: 90px; height: 90px;border-radius: 5px;margin: 5px;"
                :src="item"
                fit="contain"
                :preview-src-list="detail.attachmentUrlList"
              />
            </div>
          </div>
        </div>
        <div class="notice-title">{{ review ? '历史审批' : '审批内容' }}</div>
        <template v-if="detail.list.length">
          <div v-for="(item,index) in detail.list" :key="index" class="notice-box">
            <div class="notice-info"><span>审批节点：</span>{{ findLabelByValue( item.examineType,examineNodeOptions) }}</div>
            <div class="notice-info"><span>审批人：</span>{{ item.createdByName }}</div>
            <div class="notice-info"><span>审批时间：</span>{{ moment(item.createdAt).format(
              'YYYY-MM-DD HH:mm:ss'
            ) }}</div>
            <div class="notice-info"><span>审批状态：</span><span :class="item.examineStatus === 3 ? 'text-success' : item.examineStatus === 2 ? 'text-danger' : 'text-status'">{{ findLabelByValue(item.examineStatus,examineStatusOptions) }}</span></div>
            <div v-if="item.remark" class="notice-info">
              <span>审批备注：</span>
              <div class="remark-box">{{ item.remark }}</div>
            </div>
          </div>
        </template>
        <div v-if="!detail.list.length && !review">
          <div class="remark-box remark-box1">暂无审批记录</div>
        </div>
        <div v-if="review" class="notice-box">
          <div class="notice-info"><span>审批节点：</span>{{ findLabelByValue(examineStatus+1,examineNodeOptions) }}</div>
          <div class="notice-info"><span>审批备注：</span>
            <el-input v-model="remark" class="remark-input" maxlength="500" show-word-limit type="textarea" :rows="5" placeholder="请输入审批备注" />
          </div>
        </div>
      </div>
      <div v-if="review" slot="footer" class="p-20 flex justify-end">
        <el-button
          size="small"
          type="primary"
          @click="pass"
        >通过</el-button>
        <el-button
          size="small"
          plain
          @click="reject"
        >驳回</el-button>
      </div>
    </AppDialog>
  </div>
</template>
<script>
import AppDialog from '@/components/AppDialog'
import {
  orderclaimrecordDetail,
  orderclaimrecordDetailAudit,
  orderclaimrecordPass,
  orderclaimrecordReject
} from '@/api/order'
import { examineNodeOptions, examineStatusOptions } from './columns'
import { findLabelByValue } from '@/utils/index'
import moment from 'moment'
export default {
  components: {
    AppDialog
  },
  props: {
    review: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      examineNodeOptions,
      examineStatusOptions,
      visible: false,
      receiveModel: {
        order: { label: 'orderNo', value: '' } // 订单搜索
      },
      optionsTask: [],
      searchPrecisen: { // 精准搜索
        content: '',
        isGive: ''
      },
      detail: {
      },
      remark: '',
      examineStatus: ''
    }
  },
  methods: {
    moment,
    findLabelByValue,
    open(id, examineStatus) {
      this.remark = ''
      this.examineStatus = examineStatus
      this.visible = true
      this.getDetail(id)
    },
    async getDetail(id) {
      Promise.all([orderclaimrecordDetailAudit(id), orderclaimrecordDetail(id)]).then(([res1, res2]) => {
        this.detail = {
          list: res1.data.filter(i => i.examineStatus !== 0),
          ...res2.data
        }
      })
    },
    async pass() {
      await orderclaimrecordPass({ orderClaimId: this.detail.id, remark: this.remark, examineStatus: this.examineStatus })
      this.$message.success('审批通过成功')
      this.$emit('refresh')
      this.visible = false
    },
    async reject() {
      await orderclaimrecordReject({ orderClaimId: this.detail.id, remark: this.remark, examineStatus: this.examineStatus })
      this.$message.success('审批驳回成功')
      this.$emit('refresh')
      this.visible = false
    }
  }
}
</script>
  <style lang="scss" scoped>

  .model-conten {
    padding: 10px 25px 0px;
    height: 540px;
    overflow-y:auto;
    .notice-title {
        color: #000000;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 14px;
        margin:20px 0 20px;
    }
    .notice-box {
        margin-top: 20px;
        border-bottom: 1px solid #EFF2F6;
        padding-bottom: 5px;
        &:last-child{
          border-bottom: none;
        }
    }
        .notice-info {
            color: #000000;
            font-family: "Microsoft YaHei";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 14px;
            margin: 12px 0;
            >span{
                display: inline-block;
                width: 80px;
                text-align: right;
                color: #777777;
                font-family: "Microsoft YaHei";
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 14px;
                &.text-success{
                  color: #00B42A;
                  text-align: left;
                }
                &.text-danger{
                  color: #F53F3F;
                  text-align: left;
                }
                &.text-status{
                  color: #FF7D00;
                  text-align: left;
                }
            }
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
  .tips {
    color: #777777;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    margin-top: 10px;
  }
  .remark-box {
    border-radius: 8px;
    border: 1px solid #EFF2F6;
    padding: 10px;
    margin: 10px;
    line-height: 20px;
  }
  .remark-box1 {
    border: none;
  }
  .remark-input{
    border-radius: 8px;
    border: 1px solid #EFF2F6;
    margin: 10px;
    ::v-deep {
      .el-textarea__inner{
        border: none;
      }
    }
  }
  ::v-deep {
    .el-upload {
      .el-upload-dragger {
        width: 131px;
        height: 131px;
      }
    }
  }
  .voucherImgage {
    margin-top: 10px;
  }
  </style>
