<template>
  <base-drawer
    v-bind="$attrs"
    title="更多详情"
    :append-to-body="true"
    :visible-footer="true"
    size="616px"
    :modal="false"
    v-on="$listeners"
  >
    <el-form
      slot="content"
      class="more-detail-form"
      label-width="140px"
      label-position="left"
    >
      <el-form-item
        v-for="item in detailFormItems"
        :key="item.label"
        :label="item.label"
      >
        <span :title="item.value" :class="item.class">{{ item.value }}</span>
      </el-form-item>
    </el-form>
  </base-drawer>
</template>
<script>
import BaseDrawer from '@/components/BaseDrawer.vue'
import moment from 'moment'
export default {
  components: {
    BaseDrawer
  },
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    detailFormItems() {
      const {
        number,
        unit,
        purchaseDate,
        purchaseChannel,
        purchaseCode,
        depreciationFormula,
        assetLocation,
        remark,
        provinceName,
        cityName
      } = this.form
      return [
        { label: '数量', value: `${number}${unit}` },
        { label: '购置日期', value: moment(purchaseDate).format('YYYY-MM-DD') },
        { label: '购置渠道', value: purchaseChannel, class: 'text_hidden' },
        { label: '购置编号', value: purchaseCode, class: 'text_hidden' },
        { label: '折旧公式', value: depreciationFormula }, {
          label: '资产使用/存放城市',
          value: provinceName ? `${provinceName}/${cityName}` : '',
          class: 'text_hidden_3'
        },
        {
          label: '资产使用/存放详细地点',
          value: assetLocation,
          class: 'text_hidden_3'
        },
        { label: '备注', value: remark, class: 'text_hidden_3' }
      ]
    }
  },
  watch: {
    '$attrs.visible'(newVal) {
      if (newVal === false) {
        this.$emit('close')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.more-detail-form {
  padding: 0 32px;
}
::v-deep .el-form-item__label {
  color: #666;
  font-weight: 400;
}
::v-deep .el-form-item {
  margin-bottom: 12px;
}
::v-deep .el-drawer {
  background: linear-gradient(180deg, #f2f6fc 0%, #ffffff 100%);
}
::v-deep .el-drawer__header {
  margin-bottom: 0;
}
::v-deep .el-drawer__body {
  padding: 20px 0;
}
</style>
