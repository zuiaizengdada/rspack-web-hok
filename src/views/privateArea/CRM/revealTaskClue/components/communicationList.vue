<template>
  <el-table
    v-loading="loading"
    class="el-table-my"
    :data="tableData"
    style="width: 100%"
    height="300"
  >
    <el-table-column prop="channel" label="通道" />
    <el-table-column prop="sender" label="发送方" />
    <el-table-column prop="sendTime" label="发送时间" width="160" />
    <el-table-column prop="address" label="发送状态">
      <template slot-scope="scope">
        <div
          class="iconBox"
          :style="{
            color: getAddRessName(scope.row, 'color'),
            backgroundColor: getAddRessName(scope.row, 'backgroundColor')
          }"
        >
          <img :src="getAddRessName(scope.row, 'icon')" alt="">{{
            getAddRessName(scope.row, 'label')
          }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { getCommunicationList } from '@/api/privateArea/CRM'
import a_icon from '@/assets/image/icon/a_icon.png'
import b_icon from '@/assets/image/icon/b_icon.png'
import c_icon from '@/assets/image/icon/c_icon.png'
import f_icon from '@/assets/image/icon/f_icon.png'
import e_icon from '@/assets/image/icon/e_icon.png'
import g_icon from '@/assets/image/icon/g_icon.png'
// 短信
const receive_status_list = [
  {
    value: 1,
    label: '未知',
    backgroundColor: '#FEF4EC',
    color: '#FF7D00',
    icon: a_icon
  },
  {
    value: 2,
    label: '未送达',
    backgroundColor: '#FEECEC',
    color: '#F53F3F',
    icon: f_icon
  },
  {
    value: 3,
    label: '已送达',
    backgroundColor: '#E6F7EA',
    color: '#00B42A',
    icon: b_icon
  }
]
// 电话
const call_status_list = [
  {
    value: 1,
    label: '已提交',
    backgroundColor: '#E6F7EA',
    color: '#00B42A',
    icon: b_icon
  },
  {
    value: 2,
    label: '提交失败',
    backgroundColor: '#FEECEC',
    color: '#F53F3F',
    icon: f_icon
  },
  {
    value: 3,
    label: '呼叫中',
    backgroundColor: '#EDF4FF',
    color: '#0091FF',
    icon: g_icon
  },
  {
    value: 4,
    label: '未拨通',
    backgroundColor: '#FEECEC',
    color: '#F53F3F',
    icon: c_icon
  },
  {
    value: 5,
    label: '已拨通',
    backgroundColor: '#E6F7EA',
    color: '#00B42A',
    icon: e_icon
  }
]
export default {
  components: {},
  data: () => ({
    loading: false,
    tableData: []
  }),
  created() {},
  methods: {
    getAddRessName(row, key) {
      const value = row.channelType === 1 ? row?.receiveStatus : row?.callStatus
      const dataKey =
        row.channelType === 1 ? receive_status_list : call_status_list
      return (
        dataKey?.find(item => item.value === value) &&
        dataKey?.find(item => item.value === value)[key]
      )
    },
    async getList(id) {
      this.loading = true
      try {
        const { code, data } = await getCommunicationList(id)
        if (code === 1) this.tableData = data || []
        this.loading = false
      } catch {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table-my::v-deep {
  .iconBox {
    display: flex;
    align-items: center;
    width: 74px;
    height: 24px;
    background: #e6f7ea;
    border-radius: 12px;
    font-size: 12px;
    justify-content: center;
    > img {
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }
  }
  th {
    background: #f5f5f5;
  }
}
</style>
