<template>
  <div class="performanceRankings">
    <div class="filterTop p-l-20 p-r-20">
      <div class="filterTopTitle">{{ title }}</div>
    </div>
    <div v-loading="loading" class="rankings overflowOuto">
      <div v-for="(item, index) in list" :key="index" class="listLi">
        <div class="sort">
          <template v-if="index < 3">
            <img v-if="index === 0" src="~@/assets/image/live/ranking1.png" alt="">
            <img v-if="index === 1" src="~@/assets/image/live/ranking2.png" alt="">
            <img v-if="index === 2" src="~@/assets/image/live/ranking3.png" alt="">
          </template>
          <template v-else>{{ index + 1 }}</template>
        </div>
        <div class="li_label">{{ item.userName }}</div>
        <div class="li_value">{{ item.number }}</div>
      </div>

      <div v-if="list.length === 0" class="noData">
        <img src="~@/assets/image/zanwusousuoneirong2.png" alt="">
        <div class="noDataText">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.performanceRankings {
  padding: 20px 0 16px;
  border-radius: 8px;
  // height: 370px;
  height: 100%;
  min-height: 370px;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  .filterTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .filterTopTitle {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bolder;
      color: #2C3242;
      line-height: 22px;
    }
  }
  .rankings {
    margin-top: 14px;
    flex: 1 0 0;
    padding: 0 16px;
    .listLi {
      display: flex;
      align-items: center;
      background: #FAFAFA;
      border-radius: 4px;
      // height: 48px;
      padding: 8px 16px 8px 12px;
      .sort {
        width: 32px;
        text-align: center;
        margin-right: 16px;
        font-weight: bolder;
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #2C3242;
        > img {
          width: 32px;
          height: 32px;
        }
      }
      .li_label {
        width: 100px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #2C3242;
        line-height: 22px;
      }
      .li_value {
        flex: 1 0 0;
        text-align: right;
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #2C3242;
        line-height: 22px;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
    .listLi + .listLi {
      margin-top: 2px;
    }
  }

  .noData {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    > img {
      width: 250px;
    }
    .noDataText {
      margin-top: 16px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 22px;
    }
  }
}
</style>
