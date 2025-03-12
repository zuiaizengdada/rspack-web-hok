<template>
  <div class="goodsSetting">
    <MTitle class="p-t-20 p-l-20">课程推荐配置</MTitle>
    <div class="goodsSettingHeader">
      <span class="m-r-10">课程</span>
      <el-button size="small" type="primary">选择</el-button>
    </div>
    <div class="goodsSettingContent">
      <div class="goodsSettingContentView">
        <div v-if="arr.length === 0" class="noData">
          <img src="@/assets/image/adNoData.png" alt="" />
          <div class="noDataText">内容为空</div>
        </div>
      </div>
      <div class="footer">
        <el-button size="small" type="primary">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      arr: []
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.goodsSetting {
  height: 100%;
  display: flex;
  flex-direction: column;
  .goodsSettingHeader {
    height: 32px;
    margin-top: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    padding-left: 20px;
  }
  .goodsSettingContent {
    display: flex;
    flex: 1 0 0;
    flex-direction: column;
    .goodsSettingContentView {
      flex: 1 0 0;
      overflow: auto;
      .noData {
        padding-top: 86px;
        width: 100%;
        > img {
          // width: 100%;
          width: 229px;
          height: 136px;
          margin: auto;
        }
        .noDataText {
          margin-top: 10px;
          font-size: 14px;
          font-weight: 400;
          color: #A4A4A8;
          line-height: 20px;
          text-align: center;
        }
      }
    }
    .footer {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.p-t-20 {
  padding-top: 20px;
}
</style>
