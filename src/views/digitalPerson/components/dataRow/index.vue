<template>
  <div class="data-row">
    <div v-for="item in list" :key="item.title" class="row-col">
      <div class="row-col-item-title">
        <div class="row-col-item-title-left">
          <div class="row-col-item-title-icon" />
          <span>{{ item.title }}</span>
        </div>
        <div v-if="item.isRight" class="row-col-item-title-right">
          <span class="row-col-item-title-right-cz">充值</span>
          <template>
            <div class="row-col-item-title-right-line" />
            <span class="row-col-item-title-right-expire">赠送</span>
          </template>
          <div class="row-col-item-title-right-line" />
          <span class="row-col-item-title-right-xiao">消费</span>
          <!-- <template v-if="item.isDataBoard">
            <div class="row-col-item-title-right-line" />
            <span class="row-col-item-title-right-expire">赠送</span>
          </template> -->
        </div>
      </div>
      <div class="row-col-item-content">
        <template v-if="!item.isRight">
          <span v-if="item.isPrefix" class="row-col-item-content-prefix"
            >￥</span
          >
          <span class="row-col-item-content-number">{{ item.number }}</span>
        </template>
        <template v-else>
          <div class="row-col-item-content-vals">
            <div class="row-col-item-content-vals-item">
              {{ item.number }}
            </div>
            <div class="row-col-item-content-vals-line" />
            <div class="row-col-item-content-vals-item">
              {{ item.number2 }}
            </div>
            <template v-if="item.isDataBoard || item.isGift">
              <div class="row-col-item-content-vals-line" />
              <div class="row-col-item-content-vals-item">
                {{ item.number3 }}
              </div>
            </template>
          </div>
        </template>
      </div>
      <div class="row-img-box" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'DataRow',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped lang="scss">
.data-row {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20px 0;
  .row-col {
    width: 24%;
    border: 1px solid #f0f3f7;
    margin-bottom: 20px;
    border-radius: 8px;
    .row-col-item-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 14px 0 14px;
      margin-bottom: 18px;
      user-select: none;
      .row-col-item-title-left {
        display: flex;
        align-items: center;
        color: #000000;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        .row-col-item-title-icon {
          width: 3px;
          height: 14px;
          background: #065cff;
          border-radius: 6px;
          margin-right: 8px;
        }
      }
      .row-col-item-title-right {
        display: flex;
        align-items: center;
        .row-col-item-title-right-cz {
          color: #00b42a;
          font-family: 'Microsoft YaHei UI';
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
        }
        .row-col-item-title-right-line {
          width: 1px;
          height: 12px;
          background: #d9d9d9;
          margin: 0 10px;
        }
        .row-col-item-title-right-xiao {
          color: #ff7d00;
          font-family: 'Microsoft YaHei UI';
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
        }
        .row-col-item-title-right-expire {
          color: #f53f3f;
          font-family: 'Microsoft YaHei UI';
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
        }
      }
    }
    .row-col-item-content {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .row-col-item-content-vals {
        display: flex;
        align-items: center;
        width: 100%;
        .row-col-item-content-vals-item {
          text-align: center;
          color: #000000;
          font-family: 'DIN Alternate';
          font-size: 28px;
          font-style: normal;
          font-weight: 700;
          width: 49%;
        }
        .row-col-item-content-vals-line {
          width: 1px;
          height: 20px;
          background: #d9d9d9;
        }
      }
      .row-col-item-content-prefix {
        color: #000000;
        font-family: 'DIN Alternate';
        font-size: 22px;
        font-style: normal;
      }
      .row-col-item-content-number {
        color: #000000;
        font-family: 'DIN Alternate';
        font-size: 28px;
        font-style: normal;
        font-weight: 700;
      }
    }
    .row-img-box {
      margin-top: 12px;
      background-image: url('../../../../assets/image/aigc/digitalVideoManage/btm-bg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      width: 100%;
      height: 36px;
    }
  }
}
</style>
