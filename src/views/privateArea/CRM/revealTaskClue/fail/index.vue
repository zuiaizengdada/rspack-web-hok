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
      <template #action="{ row }">
        <el-button
          v-if="!row.repair && row.handle"
          type="text"
          class="setBtn"
          @click="handleSet(row)"
        >修复</el-button>
      </template>
    </dynamicTable>
  </MCard>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import columns from './columns.js'
import filterTop from './filterTop.vue'
import { getHkLinkClue, getHkLinkRepair } from '@/api/privateArea/CRM'
import d_icon from '@/assets/image/icon/d_icon.png'
import b_icon from '@/assets/image/icon/b_icon.png'
import { DateFormat } from '@/utils/index'
import phoneModel from './components/phoneModel'
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
  components: { dynamicTable, filterTop },
  data: () => ({
    tableData: [{ communicationNum: 12, followPhone: 17666130388 }],
    slotArr: ['communicationNum', 'action'],
    search: {
      allocationDatetime: [
        DateFormat(
          new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000),
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
    handleSet(row) {
      // 修改弹框
      phoneModel({
        form: { phone: row.followerPhone, id: row.id },
        onSubmit: async (data, done) => {
          try {
            const { code } = await getHkLinkRepair(data)
            if (code === 1) {
              this.$message.success('修改成功')
              this.$nextTick(() => {
                this.$refs.table.onRefresh()
              })
              done()
            } else {
              done(false)
            }
          } catch {
            done(false)
          }
        }
      })
    },
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
      const { followPhone, userPhone, allocationDatetime = [] } = this.search
      const [allocationDatetimeStart, allocationDatetimeEnd] =
        allocationDatetime || []
      const search = {
        followPhone,
        userPhone,
        allocationDatetimeStart: allocationDatetimeStart && allocationDatetimeStart + ' 00:00:00',
        allocationDatetimeEnd: allocationDatetimeEnd && allocationDatetimeEnd + ' 23:59:59'
      }
      return getHkLinkClue({ ...params, ...search })
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
.setBtn {
  cursor: pointer;
}
</style>
