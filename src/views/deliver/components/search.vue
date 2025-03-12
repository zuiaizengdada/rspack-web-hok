<template>
  <el-form :inline="true" :model="searchDataObject" class="demo-form-inline">
    <el-form-item label="">
      <el-select v-model="searchDataObject.channel" placeholder="请选择渠道">
        <el-option label="全部渠道" value="all" />
        <el-option label="抖店" value="doudian" />
        <el-option label="快手" value="kuaishou" />
        <el-option label="获客" value="huoke" />
        <el-option label="微店" value="weidian" />
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <el-select v-model="searchDataObject.channelChild" placeholder="请选择渠道">
        <el-option label="全部" value="all" />
        <el-option label="店铺1" value="doudian" />
        <el-option label="店铺2" value="kuaishou" />
        <el-option label="店铺3" value="huoke" />
        <el-option label="店铺4" value="weidian" />
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <el-select v-model="searchDataObject.afterSales" placeholder="请选择售后状态">
        <el-option label="已交付" value="all" />
        <el-option label="未交付" value="doudian" />
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <el-select v-model="searchDataObject.checkIn" placeholder="请选择签到状态">
        <el-option label="未签到" value="all" />
        <el-option label="已签到" value="doudian" />
      </el-select>
    </el-form-item>
    <el-form-item class="right-font" label="">
      <el-select v-model="searchDataObject.timeType" placeholder="请选择时间状态">
        <el-option label="支付时间" value="all" />
        <el-option label="签到时间" value="doudian" />
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <el-date-picker v-model="searchDataObject.timeData" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
    </el-form-item>
    <el-form-item class="right-font" label="">
      <el-select v-model="searchDataObject.orderType" placeholder="">
        <el-option label="订单号" value="all1" />
        <el-option label="买家昵称" value="all2" />
        <el-option label="买家手机号" value="all3" />
        <el-option label="用户ID" value="all4" />
        <el-option label="商品名称" value="all5" />
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <el-input v-model="searchDataObject.orderTypeValue" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="">
      <el-select v-model="searchDataObject.teacherName" placeholder="选择老师">
        <el-option label="张琦" value="all1" />
        <el-option label="郑翔洲" value="all2" />
        <el-option label="王岑" value="all3" />
        <el-option label="申晨" value="all4" />
        <el-option label="乐嘉" value="all5" />
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <el-select v-model="searchDataObject.goods" placeholder="选择商品">
        <el-option label="张琦课程" value="all1" />
        <el-option label="郑翔洲课程" value="all2" />
        <el-option label="王岑课程" value="all3" />
        <el-option label="申晨课程" value="all4" />
        <el-option label="乐嘉课程" value="all5" />
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <el-select v-model="searchDataObject.goodsClass" placeholder="选择期数">
        <el-option label="1期" value="all1" />
        <el-option label="2期" value="all2" />
        <el-option label="3期" value="all3" />
        <el-option label="4期" value="all4" />
        <el-option label="5期" value="all5" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Search',
  // eslint-disable-next-line vue/require-prop-types
  data() {
    return {
      searchDataObject: {
        channel: '',
        channelChild: '',
        afterSales: '',
        checkIn: '',
        timeType: 'all',
        timeData: '',
        orderType: 'all1',
        orderTypeValue: '',
        teacherName: '',
        goods: '',
        goodsClass: ''
      }
    }
  },
  methods: {
    onSubmit() {
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
