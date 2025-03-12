<template>
  <div class="studentDynamics">
    <div v-loading="loading" class="studentDynamicsContent">
      <div v-for="(item, index) in list" :key="index" class="text-sm">
        <div class="header flex center-align items-center">
          <div
            class="title rounded-lg p-1 mr-4"
            style="background-color: #f2f9ff"
          >
            转入 {{ index + 1 }}
          </div>
          <div class="status">
            转课状态：<span
              :style="{ color: computedColor(item.shiftStatus) }"
            >{{ item.shiftStatus | parseShiftStatus }}</span>
          </div>
        </div>
        <div class="content mt-5 hidden" style="color: #777777">
          <div class="all hidden">
            这是审批内容这是审批内容，最多显示2行，操作2行有下拉折叠效果查看全部。
          </div>
          <div class="flex flex-col">
            <div>内容内容内容内容内容内容内容内容内容内容内容内容</div>
            <div class="self-end cursor-pointer" style="color: #0c6fff">
              查看更多 >
            </div>
          </div>
        </div>
        <div
          class="content flex flex-wrap text-sm p-5 mt-4 rounded-xl border border-solid"
          style="
            color: #333333;
            background-color: #fffdfa;
            border-color: #ececec;
          "
        >
          <div class="item w-1/3 flex mb-5">
            <div>讲师：</div>
            <div>{{ (item.lecturerNameList || []).join(',') }}</div>
          </div>
          <div class="item w-1/2 flex mb-5">
            <div>课程名称：</div>
            <div>{{ item.goodsName }}</div>
          </div>
          <div class="item w-1/3 flex mb-5">
            <div>课程金额：</div>
            <div>¥ {{ item.goodsTotalFee | filtersMoney }}</div>
          </div>
          <div class="item w-1/3 flex mb-5">
            <div>转入金额：</div>
            <div>¥ {{ item.shiftInFee | filtersMoney }}</div>
          </div>
          <div class="item w-1/3 flex mb-5">
            <div>优惠金额：</div>
            <div>¥ {{ item.discountsFee | filtersMoney }}</div>
          </div>
          <div class="item w-1/3 flex mb-5">
            <div>学员姓名：</div>
            <div>{{ item.userName }}</div>
          </div>
          <div class="item w-1/3 flex mb-5">
            <div>学员电话：</div>
            <tablePhoneItem
              v-if="item.shiftStatus === 4"
              :key="1"
              v-model="item.userPhone"
              :phone-area-code="item.shiftPhoneAreaCode"
              :row-data="{ uid: item.userId }"
              type="user"
            />
            <div v-else><span v-if="item.shiftPhoneAreaCode&&item.userPhone">+{{ item.shiftPhoneAreaCode }}</span>&nbsp;{{ item.userPhone }}</div>
          </div>
          <div class="item w-1/3 flex mb-5">
            <div>学员邮箱：</div>
            <!-- <tableEmailItem
              v-if="item.shiftStatus === 4"
              :key="1"
              v-model="item.shiftEmail"
              :row-data="{ uid: item.userId }"
              type="user"
            /> -->
            <div>
              <span v-if="!item.shiftEmailFlag">{{ item.shiftEmail }}</span>
              <span v-else>{{ item.shiftEmailStr }}</span>
              <i
                v-if="!item.shiftEmailFlag && item.shiftEmail"
                class="pointer el-icon-view"
                @click="changeShiftEmail(item)"
              /></div>
          </div>
          <div class="item w-full flex mb-5">
            <div style="flex: 0 0 70px">转课原因：</div>
            <div class="itemContent">{{ item.shiftReason }}</div>
          </div>
          <div class="item w-full flex mb-5">
            <div>原因补充：</div>
            <div>
              <img
                v-for="(imgItem, i) in item.shiftSupplement"
                :key="i"
                :src="imgItem"
              />
            </div>
          </div>
        </div>
        <el-divider v-if="list.length > 1" class="my-4" />
      </div>
    </div>
  </div>
</template>

<script>
import { getPackageTransferInfo } from '@/api/deliver/studentManagement'
import { filtersMoney } from '@/filters'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem/index.vue'
import {
  getDecryptByUser
} from '@/api/phoneEncrypt'
// import tableEmailItem from '@/components/AppTemplate/tableEmailItem/index.vue'
export default {
  components: { tablePhoneItem },
  props: {
    shiftId: {
      type: String,
      default: ''
    },
    deliveryInfoId: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      list: []
    }
  },
  mounted() {
    this.getDetail()
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
    filtersMoney,
    getDetail() {
      if (this.loading) return
      this.loading = true
      getPackageTransferInfo({ shiftId: this.deliveryInfoId })
        .then(res => {
          this.list = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    computedColor() {
      switch (this.shiftStatus) {
        case '4':
          return 'red'
        case '3':
          return 'green'
        default:
          return 'black'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.studentDynamics {
  .searchTop {
    margin-top: 12px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
  .studentDynamicsContent {
    margin-top: 30px;
    .chatView {
      background: #ffffff;
      border-radius: 6px;
      border: 1px solid #e7e7e7;
      overflow: hidden;
      margin-bottom: 16px;
      .chatViewHeader {
        background: #f2f9ff;
        border-radius: 6px 6px 0px 0px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #777777;
        line-height: 22px;
        padding: 0 20px;
        img {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
      .chatContent {
        padding: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
    }
  }
}
.chatViewBox {
  border: 1px solid #e7e7e7;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
  > div:nth-of-type(1) {
    background: #f2f9ff;
    border-radius: 6px 6px 0px 0px;
    height: 42px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 500;
    color: #777777;
    line-height: 42px;
    padding: 0 20px;
    display: flex;
    align-items: center;
  }
  > div:nth-of-type(2) {
    padding: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
}
.list-call-info {
  .item-call {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 10px;
    .playBtn {
      font-size: 24px;
      font-size: 24px;
      cursor: pointer;
    }
    > div:nth-of-type(1) {
      color: #777777;
    }
    > div:nth-of-type(2) {
      color: #333333;
    }
  }
}
.audioPlayViewwarp {
  display: flex;
  align-items: center;
}
.audioPlayBox {
  // display: flex;
  align-items: center;
  .audioPlayView {
    display: flex;
    height: 36px;
    background: #e7f0ff;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    padding: 8px 10px;
    .audioIcon {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
    .audioTime {
      margin-left: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3c8bff;
      line-height: 20px;
    }
  }
  .playBtn {
    width: 24px;
    height: 24px;
    font-size: 24px;
    margin-left: 20px;
    cursor: pointer;
  }
  .phoneMsg {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
.audio-call {
  height: 36px;
  background: #e7f0ff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-right: 16px;
  padding: 8px 10px;
  .audio-callView {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .audioIcon {
      font-size: 20px;
      margin-right: 16px;
    }
  }
}
.name-staff {
  margin-left: 10px;
  color: #409eff;
}
.itemContent {
  word-break: break-all;
}

.el-icon-view {
  margin-left: 10px;
  color: #409eff;
}
</style>
