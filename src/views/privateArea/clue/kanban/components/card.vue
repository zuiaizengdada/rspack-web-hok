<template>
  <div
    class="kanbanlist"
    :class="{
      active: active.paramType === item.paramType,
      maxkanbanlist: item.valueTwo || item.valueOne
    }"
    @click="onhandleClick"
  >
    <div>
      {{ item.text }}
      <el-tooltip
        v-if="item.tips"
        class="item"
        effect="dark"
        :content="item.tips"
        placement="top-start"
      >
        <svg-icon
          icon-class="tips"
          class="titleIcon"
          style="stroke: currentColor"
        />
      </el-tooltip>
    </div>
    <div v-if="!item.cardNums" class="numbers">
      <div>{{ item.value || 0 }}</div>
    </div>
    <div v-else class="numbers">
      <div>
        <span>{{ item.value || 0 }}</span>
        <span>总数</span>
      </div>
      <div>
        <span class="minFont">{{ item.valueOne || 0 }}</span>
        <span>自动</span>
      </div>
      <div>
        <span class="minFont">{{ item.valueTwo || 0 }}</span>
        <span>手动</span>
      </div>
    </div>
    <div v-if="!item.cardNums" class="ratioBox">
      <div>
        <span>{{ item.ratioLabel }}</span>
        <span>{{ item.basisRatio }}</span>
      </div>
      <div>
        <span>{{ item.ratioLabelTwo }}</span>
        <span>{{ item.basisRatioTwo }}</span>
      </div>
    </div>
    <div v-else class="ratioTwo">
      <div>加微率</div>
      <div>
        <span>{{ item.basisRatio }}</span>
        <span>{{ item.basisRatioOne }}</span>
        <span>{{ item.basisRatioTwo }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    active: {
      type: Object,
      default: () => {}
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({}),
  created() {},
  methods: {
    onhandleClick() {
      this.$emit('handleCard', this.item)
    }
  }
}
</script>
<style lang="scss" scoped>
.kanbanlist {
  max-width: 50%;
  padding: 16px 20px;
  background: #ffffff;
  box-shadow: -2px 4px 12px 0px rgba(22, 22, 22, 0.1);
  border-radius: 8px;
  border: 1px solid #eff2f6;
  cursor: pointer;
  > div:nth-of-type(1) {
    font-size: 14px;
    font-weight: 400;
    color: #777777;
    line-height: 22px;
  }
  > div:nth-of-type(2) {
    font-size: 32px;
    font-weight: bold;
    color: #161616;
    line-height: 40px;
    margin: 8px 0;
  }
  > div:nth-of-type(3) {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
    display: flex;
    > div > span:nth-of-type(2) {
      font-size: 16px;
      color: #333333;
      line-height: 26px;
      margin-left: 2px;
    }
    > div:nth-of-type(2) {
      margin-left: 10px;
    }
  }
  &:hover {
    transform: scale(1.05);
  }
  .numbers {
    display: flex;
    align-items: center;
    > div {
      margin-left: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      &:nth-of-type(1) {
        margin-left: 0;
      }
      > span:nth-of-type(2) {
        font-size: 12px;
        margin-top: -15px;
        font-weight: 500;
      }
    }
  }
  .ratioTwo {
    margin-top: -20px;
    margin-bottom: -10px;
    display: flex;
    flex-direction: column;
    > div:nth-of-type(2) {
      font-size: 16px;
      color: #333333;
      margin-left: 0 !important;
      > span {
        margin-left: 21% !important;
      }
      > span:nth-of-type(1) {
        margin-left: 0 !important;
      }
      > span:nth-last-of-type(1) {
        margin-left: 19% !important;
      }
    }
  }
}
.maxkanbanlist{
  max-width: 100%;
  width: 32.6% !important;
}
.active {
  background: url('../../../../../assets/image/kanbanbeijin.png') no-repeat;
  background-size: 100% 100%;
  > div {
    color: #fff !important;
    span {
      color: #fff !important;
    }
  }
}
.minFont{
  font-weight: 200 !important;
}
</style>
