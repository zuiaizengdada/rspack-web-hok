<template>
  <div class="detail">
    <Base :info="info" />
    <template v-if="organizationList.length">
      <div class="title">入驻需求</div>
      <div v-for="(item, index) in organizationList" :key="index">
        <p class="title title1">{{ item.settingsName }}：</p>
        <div class="box">
          <div v-for="(value, i) in item.settingsValues" :key="i" class="flex-box flex">
            <div class="text-l">{{ value.settingsColumnName }}：</div>
            <div class="text-r">{{ value.value }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { listByOrganizationId } from '@/api/organization/settings.js'
import Base from './base.vue'
export default {
  components: {
    Base
  },
  props: {
    type: {
      type: String,
      default: '1'
    },
    info: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      organizationList: []
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const res = await listByOrganizationId(this.info.organizationId)
      this.organizationList = res.data
    }
  }
}
</script>
<style lang="scss" scoped>
.detail {
  width: 100%;
  height: 600px;
  overflow-y: auto;
}

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
  flex: 0 0 130px;
}

.text-r {
  font-size: 14px;
  color: #333333;
  line-height: 32px;
  word-break: break-all;
  white-space: pre-wrap;
  text-align: left;
}

.flex-box {
  display: inline-flex;
  width: 50%;
}
.box{
  padding-right: 24px;
}
</style>
