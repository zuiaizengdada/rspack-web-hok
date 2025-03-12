<template>
  <el-dialog
    title=""
    :visible.sync="dialogVisible"
    width="1300px"
    :before-close="dialogBeforeClose"
  >
    <div>
      <HokSearchForm
        :form-opts="formOpts"
        :ref-obj.sync="formOpts.ref"
        class="pd20"
      >
        <template #keyword>
          <div class="flex pl-2">
            <el-select
              v-model="formOpts.formData.keyword"
              placeholder="请选择"
              style="width: 130px; border-right: 1px solid #dcdee1"
            >
              <el-option label="手机号" value="phone" />
              <el-option label="学员昵称" value="userName" />
              <el-option label="邮箱" value="email" />
            </el-select>
            <el-input
              v-model="formOpts.formData.keywordVal"
              style="padding-left: 8px"
              placeholder="请输入"
            />
          </div>
        </template>
      </HokSearchForm>
      <ZBTable
        ref="zbTableRef"
        :columns="columns"
        :height="500"
        :get-list="getList"
        @handleSizeChangeEmit="handleSizeChangeEmit"
        @handleCurrentChangeEmit="handleCurrentChangeEmit"
      >
        <template v-slot:phone="{ scope }">
          <watchPhoneNumber
            :phone-area-code="scope.row.phoneAreaCode"
            :default-value="scope.row.phone"
            :user-id="scope.row.userId"
          />
          <span v-if="!scope.row.phone">-</span>
        </template>
        <template v-slot:email="{ scope }">
          <watchPhoneNumber
            :default-value="scope.row.email"
            :params="scope.row"
            :user-id="scope.row.userId"
            :get-api="operationLogsWriteAjax"
          />
          <span v-if="!scope.row.email">-</span>
        </template>
      </ZBTable>
    </div>
    <div slot="footer" />
  </el-dialog>
</template>
<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns, formConfig } from './columns'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { couponShare } from '@/api/marketingTools/coupon.js'
import { sysUserWrite } from '@/api/liveRoom/setting.js'
import { getItem } from '@/utils/localStorage'
import { mapGetters } from 'vuex'
import { getDecryptByUser } from '@/api/phoneEncrypt'
export default {
  name: 'CollectionRecord',
  components: {
    ZBTable,
    HokSearchForm,
    watchPhoneNumber
  },
  model: {
    prop: 'dialogVisible',
    event: 'update:dialogVisible'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data() {
    return {
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
          }
        ]
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    dialogVisible(val) {
      this.$nextTick(() => {
        if (val) {
          this.formOpts.formData = {
            inviteUser: undefined, // 邀请人
            keywordVal: undefined, //
            keyword: 'phone', //   学员昵称,手机号，邮箱
            couponStatus: undefined
          }
          this.searchFn()
        }
      })
    }
  },
  methods: {
    getList() {
      const params = {
        couponType: 2,
        couponVal: this.row.couponNo,
        ...this.tableConfig,
        ...this.formOpts.formData,
        userType: this.formOpts.formData.keywordVal
          ? this.formOpts.formData.keyword === 'phone'
            ? 3
            : this.formOpts.formData.keyword === 'userName'
              ? 1
              : 4
          : undefined,
        userVal: this.formOpts.formData.keywordVal
      }
      delete params.keyword
      delete params.keywordVal
      return new Promise((resolve, reject) => {
        couponShare(params)
          .then(res => {
            res.data.items = res.data.items.map(m => ({
              ...m,
              couponStatusName:
                m.couponStatus === 1
                  ? '待核销'
                  : m.couponStatus === 2
                    ? '已锁定'
                    : m.couponStatus === 3
                      ? '已核销'
                      : '已作废',
              couponTypeName:
                m.couponType === 1
                  ? '商品券'
                  : m.couponType === 2
                    ? '店铺券'
                    : '直播券'
            }))
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {
          inviteUser: undefined, // 邀请人
          keywordVal: undefined, //
          keyword: 'phone', //   学员昵称,手机号，邮箱
          couponStatus: undefined
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    // 获取邮箱
    operationLogsWriteAjax(params) {
      const data = {
        userId: params.userId, type: 2
      }
      return getDecryptByUser(data)
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const orginfo = getItem('orgInfo')
      const data = {
        userId: params.userId,
        phoneNum: params.phone,
        tenantId: orginfo.organizationId
      }
      return sysUserWrite(data)
    },
    dialogBeforeClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>
