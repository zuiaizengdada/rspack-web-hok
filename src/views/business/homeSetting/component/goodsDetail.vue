<template>
  <div v-loading="loading && !detail.coverUrl" class="goodsDetail" element-loading-spinner="el-icon-loading">
    <img
      style="width: 60px; height: 60px;border-radius: 4px;background: #F5F7FA"
      :src="detail.coverVerticalUrl ? detail.coverVerticalUrl : detail.coverUrl"
      fit="cover"
      :preview-src-list="detail.coverVerticalUrl ? detail.coverVerticalUrl : detail.coverUrl"
    />
    <div class="contentName">
      <div class="contentNameText">{{ detail.contentName }}</div>
    </div>
    <div class="btn" @click="$emit('againSelect')">重选</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
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
.goodsDetail {
    width: 465px;
    height: 92px;
    background: #F7FBFF;
    border-radius: 8px;
    display: flex;
    padding: 16px;
    .contentName {
        flex: 1 0 0;
        .contentNameText {
            margin-left: 8px;
            width: 252px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 22px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
    .btn {
        line-height: 60px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0C6FFF;
        cursor: pointer;
    }
}
</style>
