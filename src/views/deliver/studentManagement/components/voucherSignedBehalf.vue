<template>
  <!-- 代签凭证弹框 -->
  <AppDialog
    v-model="config.visible"
    title="代签凭证"
    width="694px"
    height="auto"
  >
    <div v-if="config.visible" class="voucherSignedBehalf overflowOuto">
      <div v-for="(item, index) in config.data" :key="index" class="list">
        <uploadShow :url="item" style="width: 207px;height: 116px" :no-mask="false" />
      </div>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import uploadShow from './uploadShow.vue'
export default {
  components: {
    AppDialog,
    uploadShow
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          data: [],
          visible: false
        }
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {},
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.voucherSignedBehalf {
  max-height: 300px;
  padding: 20px 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  .list {
    width: 207px;
    height: 116px;
    border-radius: 4px;
    margin-right: 16px;
    margin-bottom: 20px;
    overflow: hidden;
    position: relative;
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
::v-deep {
  .el-form--inline .el-form-item {
    margin-right: 63px;
  }
}
</style>
