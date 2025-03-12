<template>
  <div class="giftMgt-wrapper-new">
    <HokSearchForm :form-opts="formOpts" :ref-obj.sync="formOpts.ref" />
    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:giveawayPrice="{ scope }">
        <span v-if="scope.row.giveawayType === 3">— —</span>
        <span v-else>￥{{ scope.row.giveawayPrice | filtersMoneyByZero }}</span>
      </template>
      <template v-slot:giveawayType="{ scope }">
        <span>
          {{
            { 1: '虚拟商品', 2: '实物商品', 3: '优惠券' }[
              scope.row.giveawayType
            ]
          }}
        </span>
      </template>
      <template v-slot:updateTime="{ scope }">
        <span>
          {{ moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm') }}
        </span>
      </template>
      <template v-slot:operate="{ scope }">
        <el-button
          v-permission="['btn:setting:giftMgt:delete', permsList]"
          type="text"
          style="color: #f53f3f"
          @click="onhandleDel(scope.row)"
        >
          删除
        </el-button>
      </template>
    </ZBTable>
    <!-- 弹框层 -->
    <addDialog :config="addConfig" @success="closeAddDialog" />
  </div>
</template>

<script>
import { giftList, giftDelete } from '@/api/liveRoom/index.js'
import addDialog from './addDialog.vue'
import { columns, formConfig } from './columns'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import moment from 'moment'
export default {
  components: { HokSearchForm, ZBTable, addDialog },
  data() {
    return {
      moment,
      permsList: this.$route.meta.permsList || [],
      columns,
      formOpts: {
        ...formConfig,
        operatorList: [
          {
            label: '查询',
            bind: { plain: true },
            fn: () => {
              this.searchFn()
            }
          },
          {
            label: '重置',
            type: 'plain',
            fn: () => {
              this.searchFn(true)
            }
          },
          {
            label: '新增',
            type: 'primary',
            permission:'btn:setting:giftMgt:add',
            fn: () => {
              this.onhandleAdd()
            },
            className: ['right']
          }
        ]
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      bindClickKeys: ['giveawayType'],
      addConfig: {
        visible: false
      }
    }
  },
  created() {
    // 绑定change事件
    this.formOpts.fieldList.forEach(item => {
      if (this.bindClickKeys.includes(item.prop)) {
        item.eventHandler.change = () => {
          this.searchFn()
        }
      }
    })
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {
          giveawayId: undefined,
          giveawayType: undefined
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      this.loading = true
      const params = {
        ...this.tableConfig,
        ...this.formOpts.formData
      }
      return giftList(params)
    },
    // 点击新增赠品
    onhandleAdd() {
      this.addConfig.visible = true
    },
    closeAddDialog(type) {
      !type && (this.addConfig.visible = false)
      this.searchFn()
    },
    // 点击删除
    onhandleDel(row) {
      console.log(row)
      this.$delModal({
        tips: `确定删除?`,
        success: () => {
          row.delLoading = true
          const data = { giveawayId: row.id }
          giftDelete(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              row.delLoading = false
              this.searchFn()
            })
            .catch(() => {
              row.delLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.giftMgt-wrapper-new {
  padding: 0 20px 20px 20px;
}
</style>
