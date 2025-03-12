<template>
  <!-- 转课记录列表 -->
  <div class="transferList">
    <div class="header">
      <div class="headerTitle">
        <div class="headerTitleLeft">
          <div class="title m-r-16">{{ title }}</div>
          <div :class="`checkStatus${item.checkStatus}`">
            {{ item.checkStatusName }}
          </div>
        </div>
        <div class="headerTitleRight">
          <el-button
            v-if="[1, 5].includes(item.checkStatus)"
            type="text"
            @click="$emit('handleClickRevise')"
          >重新修改</el-button>
          <el-button
            v-if="item.checkStatus === 1"
            type="text"
            style="color: #f53f3f"
            @click="$emit('handleClickDel')"
          >删除</el-button>
          <el-button
            v-if="item.checkStatus === 1"
            class="btn_primary"
            size="small"
            @click="$emit('handleClickSubmit')"
          >确认提交审核</el-button>
        </div>
        <div v-if="item.shiftOrderNo">
          <span>
            <i style="font-style: normal; margin-right: 8px">订单号:</i>
            <em style="font-style: normal">{{ item.shiftOrderNo }}</em>
            <img
              v-clipboard:copy="item.shiftOrderNo"
              v-clipboard:success="clipboardSuccess"
              title="复制订单号"
              style="
                float: left;
                margin-top: 4px;
                width: 16px;
                height: 16px;
                font-style: normal;
                margin-left: 10px;
              "
              src="../../../../assets/image/coupon/icn_copy.png"
            />
          </span>
        </div>
      </div>
      <textShowMore
        v-if="
          item.checkStatus === 1 &&
            item.approvalReason &&
            item.approvalReason.length > 0
        "
        class="m-t-8"
        :text="item.approvalReason"
      />
    </div>
    <div class="body">
      <el-row type="flex">
        <el-col :span="8" class="formView">
          <div class="formViewLabel">讲师：</div>
          <div class="formViewValue">
            {{ item.lecturerNameList | filterTearch }}
          </div>
        </el-col>
        <el-col :span="16" class="formView">
          <div class="formViewLabel">课程名称：</div>
          <div class="formViewValue">{{ item.goodsName }}</div>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8" class="formView">
          <div class="formViewLabel">课程金额：</div>
          <div class="formViewValue">
            ￥{{ item.goodsTotalFee | filtersMoneyByZero }}
          </div>
        </el-col>
        <el-col :span="8" class="formView">
          <div class="formViewLabel">转入金额：</div>
          <div class="formViewValue">
            ￥{{ item.shiftFee | filtersMoneyByZero }}
          </div>
        </el-col>
        <el-col :span="8" class="formView">
          <div class="formViewLabel">优惠金额：</div>
          <div class="formViewValue">
            ￥{{ item.discountsFee | filtersMoneyByZero }}
          </div>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8" class="formView">
          <div class="formViewLabel">应补金额：</div>
          <div class="formViewValue">
            ￥{{ item.shouldSupplementAmount | filtersMoneyByZero }}
          </div>
        </el-col>
        <el-col :span="8" class="formView">
          <div class="formViewLabel">补缴金额：</div>
          <div class="formViewValue">
            ￥{{ item.alreadySupplementAmount | filtersMoneyByZero }}
          </div>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8" class="formView">
          <div class="formViewLabel">学员姓名：</div>
          <div class="formViewValue">{{ item.userName }}</div>
        </el-col>
        <el-col :span="8" class="formView">
          <div class="formViewLabel">学员电话：</div>
          <div class="formViewValue">
            <span v-if="item.shiftPhoneAreaCode">+{{ item.shiftPhoneAreaCode }}</span>&nbsp;<span v-if="item.userPhone">{{ item.userPhone }}</span>
            <!-- <tablePhoneItem
              v-model="item.userPhone"
              :row-data="item"
              :phone-area-code="item.shiftPhoneAreaCode"
              type="delivery"
            /> -->
          </div>
        </el-col>
        <el-col :span="8" class="formView">
          <div class="formViewLabel">学员邮箱：</div>
          <div class="formViewValue">
            <div>
              <span v-if="!item.shiftEmailFlag">{{ item.shiftEmail }}</span>
              <span v-else>{{ item.shiftEmailStr }}</span>
              <!-- <i
                v-if="!item.shiftEmailFlag && item.shiftEmail"
                class="pointer el-icon-view"
                @click="changeShiftEmail(item)"
              /></div> -->
            </div>
          </div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="formView">
          <div class="formViewLabel">转课原因：</div>
          <div class="formViewValue">
            <textShowMore
              ref="textShowMore"
              :text="item.shiftReason"
              :line-clamp="2"
            />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="formView">
          <div class="formViewLabel">原因补充：</div>
          <div class="formViewValue fileUrlList">
            <div
              v-for="(url, index) in item.fileUrlList"
              :key="index"
              class="m-r-16 m-b-16"
            >
              <el-image
                class="myImg"
                style="width: 160px; height: 90px"
                :src="url"
                fit="contain"
                :preview-src-list="[url]"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import textShowMore from './textShowMore.vue'
import clipboard from '@/directive/clipboard/index.js'
import {
  getDecryptByUser
} from '@/api/phoneEncrypt'
// import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
export default {
  components: {
    textShowMore
    // tableEmailItem
  },
  directives: {
    clipboard
  },
  filters: {
    filterTearch(val) {
      if (!val || val.length === 0) {
        return ''
      }
      return val.join(',')
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      checkStatus: {
        1: '待提交',
        2: '待审批',
        3: '审批中',
        4: '审批通过',
        5: '审批驳回'
      },
      show: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.textShowMore && this.$refs.textShowMore.refresh()
    })
  },
  methods: {
    changeShiftEmail(item) {
      const params = {
        userId: item.userId,
        type: 2
      }
      getDecryptByUser(params).then(res => {
        if (res.code === 1 && res.data) {
          this.$set(item, 'shiftEmailFlag', true)
          this.$set(item, 'shiftEmailStr', res.data)
        }
      })
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.transferList {
  background: #f7fbff;
  border-radius: 8px;
  .header {
    border-bottom: 1px solid #e7e7e7;
    padding: 16px 12px 20px;
    .headerTitle {
      display: flex;
      justify-content: space-between;
      .headerTitleLeft {
        display: flex;
        align-items: center;
        .title {
          font-size: 16px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          color: #333333;
          line-height: 24px;
        }
        .checkStatus5 {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #f53f3f;
          line-height: 22px;
        }
        .checkStatus1,
        .checkStatus2 {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #777777;
          line-height: 22px;
        }
        .checkStatus3 {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #ff7d00;
          line-height: 22px;
        }
        .checkStatus4 {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #00b42a;
          line-height: 22px;
        }
      }
    }
    .headerDes {
      margin-top: 8px;
      display: flex;
      .text {
        font-size: 14px;
        &::before {
          content: '';
          float: right;
          width: 0;
          height: 100%;
          margin-bottom: -19px;
        }
      }
      .jyfwbtn {
        float: right;
        clear: both;
        cursor: pointer;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #0c6fff;
        line-height: 18px;
      }
      .showMore {
        /* 设置多行文本溢出省略 */
        display: -webkit-box;
        /* 默认最多显示3行 */
        -webkit-line-clamp: 2;
        overflow: hidden;
        -webkit-box-orient: vertical;
        font-size: 14px;
        &::before {
          content: '';
          float: right;
          width: 0;
          height: 100%;
          margin-bottom: -19px;
        }
      }
    }
  }
  .body {
    padding: 20px 12px 16px;
    .formView {
      display: flex;
      margin-bottom: 16px;
      .formViewLabel {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 24px;
        margin-right: 8px;
        width: 80px;
        text-align: right;
      }
      .formViewValue {
        flex: 1 0 0;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 24px;
      }
    }
  }
}
.m-b-8 {
  margin-bottom: 8px;
}
.m-t-8 {
  margin-top: 8px;
}
.btn_close {
  transform: rotate(180deg);
}
.fileUrlList {
  display: flex;
  flex-wrap: wrap;
  .myImg {
    background: #edeff2;
    border-radius: 4px;
  }
}
.m-r-16 {
  margin-right: 16px;
}
.m-b-16 {
  margin-bottom: 16px;
}

.el-icon-view {
  margin-left: 10px;
  color: #409eff;
}
</style>
