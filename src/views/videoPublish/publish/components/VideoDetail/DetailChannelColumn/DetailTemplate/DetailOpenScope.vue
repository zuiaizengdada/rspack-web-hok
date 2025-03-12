<template>
  <div class="address-container">
    <template-title title="设置谁可以看" />
    <open-scope v-show="!isXiaohongshu" :scope-type="scopeType" @change="handlerChange" />
    <el-radio-group v-show="isXiaohongshu" v-model="xiaohongshuOpenScopeType" @input="handleInputScopeType">
      <el-radio v-for="item in xiaohongshuOpenScopeList" :key="item.value" :label="item.value">{{ item.label }} <span class="tips">({{ item.tips }})</span></el-radio>
    </el-radio-group>
  </div>

</template>
<script>
import OpenScope from '../../../Common/OpenScope.vue'
import TemplateTitle from './TemplateTitle.vue'
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
export default {
  components: {
    TemplateTitle,
    OpenScope
  },
  mixins: [mixinsAllOperations],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scopeType: 0,
      isXiaohongshu: false,
      xiaohongshuOpenScopeType: 0,
      xiaohongshuOpenScopeList: [{
        label: '公开',
        value: 0,
        tips: '所有人可见'
      },
      {
        label: '私密',
        value: 1,
        tips: '仅自己可见'
      }
      ]
    }
  },
  computed: {
    getVideoOpenScope() {
      return this.publishForm.openScope
    }
  },
  watch: {
    getVideoOpenScope(val) {
      let openScope = val
      if (this.type === 'xiaohongshu') {
        openScope = [0, 2].includes(openScope) ? 0 : 1
        this.xiaohongshuOpenScopeType = openScope
      } else {
        this.scopeType = openScope
      }
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'openScope', val)
    },
    'channel.accountData': {
      handler(val) {
        this.initData()
      },
      deep: true
    }
  },
  mounted() {
    this.isXiaohongshu = this.type === 'xiaohongshu'
  },
  methods: {
    async initData() {
      let openScope = this.publishChannelData.activeData?.openScope
      if (this.type === 'xiaohongshu') {
        openScope = openScope > 1 ? 1 : openScope
        this.xiaohongshuOpenScopeType = openScope
      } else {
        this.scopeType = openScope
      }
    },
    handlerChange(e) {
      this.scopeType = e
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'openScope', e)
    },
    handleInputScopeType(e) {
      this.scopeType = e
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'openScope', e)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-radio__label .tips{
  font-size:12px;
  color:#777;
  margin-left:4px;
}
</style>
