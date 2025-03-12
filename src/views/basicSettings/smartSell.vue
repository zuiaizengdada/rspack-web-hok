<template>
  <MCard>
    <div class="videoDeliverySettings">智能销售</div>
    <div class="contentBox">
      <p>到课数定义:</p>
      <p>
        在直播间观看时长大于等于
        <el-input-number
          v-model="num"
          controls-position="right"
          :min="1"
          :max="10"
          step-strictly
          size="small"
          @change="handleChange"
        />
        分钟的线索数
      </p>
    </div>
    <div class="contentBox">
      <p>完课数定义:</p>
      <p>
        在直播间观看时长大于等于
        <el-input-number
          v-model="num"
          controls-position="right"
          :min="1"
          step-strictly
          :max="100"
          size="small"
          @change="handleChange"
        />
        分钟的线索数
      </p>
    </div>
  </MCard>
</template>

<script>
export default {
  components: {},
  data: () => ({
    num: undefined
  }),
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.videoDeliverySettings {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 24px;
  padding-bottom: 20px;
  margin: 0 20px;
  border-bottom: 1px solid #e7e7e7;
}
.contentBox {
  display: flex;
  align-items: center;
  padding-top: 40px;
  > p {
    margin-left: 20px;
    font-size: 14px;
  }
  > p:nth-of-type(2) {
    color: #666;
    font-size: 13px;
  }
}
</style>
