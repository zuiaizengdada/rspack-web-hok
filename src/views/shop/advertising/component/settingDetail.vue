<template>
  <div class="settingDetail">
    <div class="settingDetailBox">
      <div class="settingDetailLabel">广告位名称：</div>
      <div class="settingDetailValue">{{ data.name }}</div>
    </div>
    <div class="settingDetailBox">
      <div class="settingDetailBox">
        <div class="settingDetailLabel">广告类型：</div>
        <div class="settingDetailValue">{{ adType[data.type] }}</div>
      </div>
      <div class="settingDetailBox">
        <div class="settingDetailLabel">允许最大广告数量：</div>
        <div class="settingDetailValue">{{ data.maxNum }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { adType } from '../columns'
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          name: '',
          type: '',
          maxNum: ''
        }
      }
    }
  },
  data() {
    return {
      adType,
      detail: [
        { key: 'name', label: '广告位名称' },
        { key: 'type', label: '广告类型' },
        { key: 'maxNumber', label: '允许最大广告数量' }
      ]
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.settingDetail {
  display: flex;
  padding: 16px 0 0;
  margin: 0 20px;
  flex-wrap: wrap;
  border-bottom: 1px solid #EFF2F6;
  .settingDetailBox {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-right: 68px;
    .settingDetailLabel {
      padding-bottom: 16px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #777777;
      line-height: 24px;
    }
    .settingDetailValue {
      flex: 1 0 0;
      padding-bottom: 16px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
    }
  }
}
</style>
