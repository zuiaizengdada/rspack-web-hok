<template>
  <div class="detail-page">
    <div class="title">合同信息</div>
    <template v-if="info.contractStartTime">
      <div class="flex">
        <div class="text-l">合同日期：</div>
        <div class="text-r">{{ info.contractStartTime }} - {{ info.contractEndTime }}</div>
      </div>
      <div class="flex">
        <div class="text-l">合同有效期：</div>
        <div class="text-r">{{ info.contractMonth }}个月</div>
      </div>
      <div class="flex">
        <div class="text-l">合同附件：</div>
        <div class="text-r">
          <div class="flex">
            <div
              v-for="item in attachmentUrlArr"
              :key="item"
              class="image_poster"
            >
              <imgShow :url="item" style="width: 100%; height: 100%" />
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="flex">
        <div class="text-l">结算周期：</div>
        <div class="text-r">{{ settlePeriodKeys[info.settlePeriod] }}</div>
      </div> -->
    </template>
    <template v-else>
      <el-empty
        description="无合同信息"
        :image-size="100"
        style="padding: 20px 0"
      />
    </template>
  </div>
</template>
<script>
import imgShow from '@/views/teacherCenter/components/imgShow.vue'
export default {
  components: {
    imgShow
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      settlePeriodKeys: ['', '按月结算', '按季度结算', '按年结算']
    }
  },
  computed: {
    attachmentUrlArr() {
      return this.info.attachmentUrl ? this.info.attachmentUrl.split(',') : []
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  line-height: 28px;
  position: relative;
  padding-left: 24px;
  font-weight: 600;
  font-size: 14px;
  color: #333333;
  margin: 10px 0;
}

.title1 {
  font-weight: normal;
}

.text-l {
  font-size: 14px;
  color: #777777;
  line-height: 32px;
  text-align: right;
  flex: 0 0 120px;
}

.text-r {
  font-size: 14px;
  color: #333333;
  line-height: 32px;
  word-break: break-all;
  white-space: pre-wrap;
  text-align: left;
}
.image_poster {
  position: relative;
  width: 80px;
  height: 60px;
  background: #ffffff;
  border-radius: 4px;
  background: #fafafa;
  display: flex;
  flex-wrap: wrap;
  margin-right: 10px;
  margin-bottom: 10px;
  ::v-deep .imgView {
    width: 100%;
    height: 100%;
  }
}
.flex-box {
  flex: 1 0 50%;
}
.flex {
  display: flex;
  flex-wrap: wrap;
}
</style>
