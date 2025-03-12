<template>
  <!-- 区号选中 -->
  <el-select
    v-model="myvalue"
    :loading="searchLoading"
    style="width: 80px"
    filterable
    remote
    reserve-keyword
    placeholder="请选择"
    :remote-method="filterMethod"
    @change="onchange"
  >
    <el-option-group v-for="group in filterArrList" :key="group.label" :label="group.label">
      <el-option v-for="item in group.options" :key="item.areaCode" :label="`+${item.areaCode}`" :value="item.areaCode">
        <span style="float: left">{{ item.areaChineseName }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">+{{ item.areaCode }}</span>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      myvalue: '+86',
      filterArrList: []
    }
  },
  mounted() {},
  methods: {
    filterMethod() {},
    onchange(res) {
      console.log(res, 'res')
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
