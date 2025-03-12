<template>
  <el-drawer
    :visible.sync="getDialogVisible"
    size="45%"
    append-to-body
    title="充值"
    :wrapper-closable="false"
    destroy-on-close
    :before-close="dialogBeforeClose"
  >
    <div>
      <div
        v-if="rechargeList.length > 0"
        id="recharge-type-row"
        :class="{
          'recharge-type-row': true
        }"
      >
        <div
          v-for="(item, index) in rechargeList"
          :key="index"
          :class="{
            'recharge-type-item': true,
            'recharge-type-item-active': rechargeType === item.id
          }"
          @click="handleRechargeType(item)"
        >
          {{ item.packageName }}
        </div>
      </div>

      <!-- <template v-if="isMore">
        <el-button
          v-if="!isShowMore"
          class="recharge-type-more"
          type="text"
          @click="handleMore"
        >
          更多 <i class="el-icon-arrow-down" />
        </el-button>
        <div v-if="isShowMore" class="recharge-type-more-up-box">
          <el-button class="recharge-type-more" type="text" @click="handleMore">
            收起 <i class="el-icon-arrow-up" />
          </el-button>
        </div>
      </template> -->
      <el-divider v-if="rechargeList.length > 0" class="recharge-divider" />
      <div v-if="rechargeType" class="recharge-content">
        <div class="title">套餐包含内容</div>
        <div class="content-item">
          <div v-if="info.trainingTimes" class="content-item-value">
            声音训练{{ info.trainingTimes }}次
          </div>
          <div v-if="info.trainingDuration" class="content-item-value">
            声音训练采购{{ info.trainingDuration }}次
          </div>
          <div v-if="info.purchaseTimes" class="content-item-value">
            形象训练采购{{ info.purchaseTimes }}次
          </div>
          <div v-if="info.videoDuration" class="content-item-value">
            视频生成时长{{ info.videoDuration }}分钟
          </div>
        </div>
        <div class="period">
          有效期：<span class="period-time">1年</span>
          <span class="period-msg">以实际支付时间为起始时间</span>
        </div>
        <div class="price">
          价格：<span class="icon-span">¥ </span>
          <span class="price-time">{{ filterPrice(info.packagePrice) }}</span>
        </div>
      </div>
      <el-button
        v-if="rechargeType"
        type="primary"
        class="recharge-btn"
        :loading="loading"
        @click="handleSubmit"
      >
        生成订单
      </el-button>
    </div>
  </el-drawer>
</template>
<script>
import { filterPrice } from '@/utils/index'
import {
  generateOrder,
  getPackageList
} from '@/api/aiVideoManage/setMealModule'
export default {
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      rechargeList: [],
      rechargeType: undefined,
      info: {}
      // isMore: false,
      // isShowMore: false,
    }
  },
  computed: {
    getDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  watch: {
    getDialogVisible: {
      handler(val) {
        if (val) {
          this.getPackageList()
        }
      },
      deep: true
    }
  },
  methods: {
    filterPrice,
    handleRechargeType(item) {
      this.rechargeType = item.id
      this.info = { ...item }
    },
    getPackageList() {
      getPackageList().then(res => {
        this.rechargeList = res.data || []
        if (this.rechargeList.length > 0) {
          this.info = { ...this.rechargeList[0] }
          this.rechargeType = this.rechargeList[0].id
        }
      })
    },
    handleSubmit() {
      this.loading = true
      generateOrder({ packageId: this.info.id })
        .then(res => {
          this.loading = false
          this.$emit('handleSubmit', { orderId: res.data })
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleMore() {
      this.isShowMore = !this.isShowMore
    },
    handleSave() {
      this.$emit('change', false)
    },
    dialogBeforeClose() {
      this.$emit('change', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.recharge-type-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  overflow-y: auto;
  height: 130px;
  position: relative;

  .recharge-type-item {
    text-align: center;
    padding: 12px 24px;
    border-radius: 5px;
    background: #f7f7f7;
    color: #000000;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    margin-right: 12px;
    margin-bottom: 20px;
    cursor: pointer;
  }
  .recharge-type-item-active {
    color: #000000;
    background: linear-gradient(90deg, #cee2ff 0%, #bcc9ff 100%);
    font-weight: 600;
  }
}
// .recharge-type-more {
//   position: absolute;
//   top: 200px;
//   left: 47%;
// }
.recharge-type-more {
  width: 100%;
  text-align: center;
  color: #0c6fff;
  text-align: center;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  padding-bottom: 20px;
}

.recharge-type-more-icon {
  font-size: 12px;
  margin-left: 4px;
}
.recharge-type-row-up {
  height: auto;
  overflow: initial;
}
.recharge-content {
  background: #f4feff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  .title {
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .content-item {
    margin-bottom: 25px;
    border: 1px solid #d8d8d8;
    border-bottom: none;
    .content-item-value {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      padding: 13px 11px;
      border-bottom: 1px solid #d8d8d8;
    }
  }
  .period {
    color: #777777;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    margin-top: 16px;
    margin-bottom: 16px;
    .period-time {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
    }
    .period-msg {
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .price {
    color: #777777;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    .icon-span {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: 14px;
    }
    .price-time {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 30px;
      font-style: normal;
      font-weight: 600;
    }
  }
}
::v-deep {
  .recharge-divider {
    margin: 0 0 24px 0 !important;
  }
  .el-drawer__header {
    padding-bottom: 20px !important;
    margin-bottom: 0 !important;
    border-bottom: 1px solid #eff2f6;
    span {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      font-family: 'Microsoft YaHei';
      letter-spacing: 1px;
    }
  }
  .el-drawer__body {
    padding: 20px 23px 68px 23px;
  }
  .add-form-dialog {
    .el-form-item__label {
      font-weight: 600;
      color: #000;
      font-family: 'Microsoft YaHei';
      padding-left: 0 !important;
      padding-right: 20px !important;
    }
  }

  .text-left {
    .el-input {
      input {
        text-align: left;
      }
    }
  }
  .custom-label {
    .el-form-item__label {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
  }
}
</style>
