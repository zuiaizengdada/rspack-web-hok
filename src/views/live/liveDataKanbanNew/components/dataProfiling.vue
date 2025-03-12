<template>
  <div class="dataProfiling">
    <div class="searchTop">
      <MTitle>数据概括</MTitle>
      <!-- <div class="navView">
        <div v-for="(item, index) in liveOption" :key="index" :class="{active: search.navActive === item.value}" class="navListLi" @click="tabChange(item.value)">{{ item.label }}</div>
      </div> -->
    </div>
    <div class="dataContent">
      <template v-for="(item) in navView">
        <viewData
          :key-item="item.key"
          class="pageContentView"
          :loading="item.loading"
          :tips="item.tips"
          :title="item.label"
          :rate-text="item.value === 10 ? '' : rateText"
          :rate="item.rate"
          :render="item.render"
          :data="item.number"
          :active="search.active === item.value"
          @onClick="$emit('onNavClick', item.value)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import viewData from './viewData.vue'
export default {
  components: {
    viewData
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          time: { active: 1, time: ['', ''] }, // 时间
          active: 1, // 筛选项1:成交订单数 2:成交金额 3:待付款金额 4: 退款金额 5: 营收 6: 转化人数 7 - 完课人数; 8 - 到课人数; 9 - 报名人数; 10 - 邀约人数;
          title: '成交金额排行榜',
          navActive: '' // PERSON_LIVE 真人直播；AI_LIVE 智能直播；DIGITAL_PERSON_LIVE 数字人直播，不传默认查所有
        }
      }
    },
    navView: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      liveOption: [
        { label: '所有直播', value: '' },
        { label: '真人直播', value: 'PERSON_LIVE' },
        { label: '数字直播', value: 'AI_LIVE' }
      ]
    }
  },
  computed: {
    rateText() {
      return '对比' + { '': '上期', '0': '昨日', '1': '前天', '7': '上期', '30': '上期', 'month': '上期' }[this.search.time.active]
    }
  },
  mounted() {},
  methods: {
    tabChange(val) {
      this.$emit('onLiveTypeChange', val)
    }
  }
}
</script>

<style lang='scss' scoped>
.dataProfiling {
  // height: 370px;
  min-height: 370px;
  // background: linear-gradient(180deg, #D8EAFF 0%, #FFFFFF 15%, #FFFFFF 100%);
  border-radius: 8px;
  // min-width: 1000px;
  .searchTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .titleView {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2C3242;
      line-height: 22px;
    }
  }
  .navView {
      margin-left: 20px;
      overflow: hidden;
      display: inline-block;
      height: 30px;
      .navListLi {
        width: 88px;
          display: inline-block;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border: 1px solid #fff;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #747474;
          &:hover {
            color: #2474FF;
            background: #E7F0FF;
            border: 1px solid #3C8BFF;
          }
      }
      .navListLi + .navListLi {
          margin-left: 4px;
      }
      .active {
        color: #2474FF;
        background: #E7F0FF;
        border: 1px solid #3C8BFF;
      }
  }
  .dataContent {
    // display: flex;
    // flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 10px;
    margin-top: 18px;
    // margin-left: -12px;
    .pageContentView {
      margin-top: 0px;
      // flex: 20% 1 1;
    }
  }
}
@media screen and (max-width: 1600px) {
  .dataContent {
    grid-template-columns: repeat(4, 1fr)!important; 		/* 4列布局 */
  }
}
</style>
