<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    border
  >
    <el-table-column
      prop="nickName"
      label="跟进人"
      width="120"
    />
    <el-table-column
      prop="createTime"
      label="操作时间"
      width="180"
    />
    <el-table-column
      prop="cooperateStatus"
      label="合作状态"
      width="130"
    >
      <template slot-scope="{row}">
        <span>{{ row.cooperateStatus | getOptionsValue(COOPERATION_TYPE) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="teacherRealName"
      label="真实姓名"
      width="120"
    />
    <el-table-column
      prop="phoneNumber"
      label="联系人和方式"
      width="300"
    />
    <el-table-column
      v-if="showCommunicationUrls"
      prop="communicationUrls"
      label="沟通图片"
      min-width="150"
    >
      <template v-if="row.communicationUrls" slot-scope="{ row }">
        <el-image v-for="(item, index) in row.communicationUrls" :key="index" :preview-src-list="row.communicationUrls" style="width: 50px; height: 50px" :src="item" fit="contain" />
      </template>
    </el-table-column>
    <el-table-column
      prop="wechatId"
      label="微信号"
      width="180"
    />
    <el-table-column
      prop="contactSituation"
      show-overflow-tooltip
      label="联系情况"
    />
  </el-table>
</template>

<script>
import { teacherFollowList } from '@/api/tearchCenter/index'
import { getDict } from '@/utils/index'
export default {
  model: {
    prop: 'tableData',
    event: 'change'
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    showCommunicationUrls: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      COOPERATION_TYPE: []
    }
  },
  async created() {
    this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
  },
  methods: {
    async getList(params) {
      const { data } = await teacherFollowList(params)
      this.innerVisible = true
      this.$emit('change', data)
    }
  }
}
</script>

<style>

</style>
