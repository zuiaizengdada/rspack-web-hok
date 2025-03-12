<template>
  <MCard>
    <filterTop ref="filterTopRef" :search="search" @onSubmit="onSubmit" />
    <dynamicTable
      ref="table"
      v-model="tableData"
      :slot-arr="slotArr"
      class="tableBox"
      style="height:calc(100vh - 380px)"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #noticeNum="{ row }">
        <el-popover :key="row.id" width="450" trigger="hover" @show="handleShow(row.id,`communicationListRef${row.id}`)">
          <communicationList :ref="`communicationListRef${row.id}`" :key="row.id" />
          <span slot="reference" class="hoverNum">{{ row.noticeNum }}</span>
        </el-popover>
      </template>
      <template #isAddWx="{ row }">
        <div
          class="iconBox"
          :style="{
            color: getAddRessName(row.isAddWx, 'color'),
            backgroundColor: getAddRessName(row.isAddWx, 'backgroundColor')
          }"
        >
          <img :src="getAddRessName(row.isAddWx, 'icon')" alt="" />{{
            getAddRessName(row.isAddWx, 'label')
          }}
        </div>
      </template>
    </dynamicTable>
  </MCard>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import columns from './columns.js'
import filterTop from './filterTop.vue'
import { getUndertakeClue } from '@/api/privateArea/CRM'
import communicationList from '../components/communicationList'
import d_icon from '@/assets/image/icon/d_icon.png'
import b_icon from '@/assets/image/icon/b_icon.png'
import { DateFormat } from '@/utils/index'
const isAddWx_list = [
  {
    value: 0,
    label: '未加',
    backgroundColor: '#F5F5F5',
    color: '#777777',
    icon: d_icon
  },
  {
    value: 1,
    label: '已加',
    backgroundColor: '#E6F7EA',
    color: '#00B42A',
    icon: b_icon
  }
]
export default {
  name: 'RevealTaskClue',
  components: { dynamicTable, filterTop, communicationList },
  data: () => ({
    tableData: [{ communicationNum: 12 }],
    slotArr: ['communicationNum'],
    search: {
      addWxDatetime: [],
      allocationDatetime: [
        DateFormat(
          new Date(new Date().getTime() - 28 * 24 * 60 * 60 * 1000),
          'yyyy-MM-dd'
        ),
        DateFormat(new Date(), 'yyyy-MM-dd')
      ]
    },
    isAddWx_list,
    clueId: '',
    columns: columns
  }),
  created() {},
  methods: {
    getAddRessName(value, key) {
      return (
        this.isAddWx_list?.find(item => item.value === value) &&
        this.isAddWx_list?.find(item => item.value === value)[key]
      )
    },
    handleShow(id, refKey) {
      this.$refs[refKey].getList(id)
    },
    getList(params) {
      const {
        followPhone,
        phone,
        addWxDatetime = [],
        allocationDatetime = []
      } = this.search
      const [addWxDatetimeStart, addWxDatetimeEnd] = addWxDatetime || []
      const [allocationDatetimeStart, allocationDatetimeEnd] = allocationDatetime || []
      const search = {
        followPhone,
        phone,
        addWxDatetimeStart: addWxDatetimeStart && addWxDatetimeStart + ' 00:00:00',
        addWxDatetimeEnd: addWxDatetimeEnd && addWxDatetimeEnd + ' 23:59:59',
        allocationDatetimeStart: allocationDatetimeStart && allocationDatetimeStart + ' 00:00:00',
        allocationDatetimeEnd: allocationDatetimeEnd && allocationDatetimeEnd + ' 23:59:59'
      }
      return getUndertakeClue({ ...params, ...search })
    },
    onSubmit(search) {
      if (search) this.search = search
      this.$nextTick(() => {
        this.$refs.table.config.pageIndex = 1
        this.$refs.table.onRefresh()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
