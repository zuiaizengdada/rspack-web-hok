<template>
  <div class="order-list">
    <HokSearchForm :form-opts="formOpts" :ref-obj.sync="formOpts.ref">
      <template #orderLabel>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.orderLabel"
            placeholder="请选择"
            style="width: 150px; border-right: 1px solid #dcdee1"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="formOpts.formData.orderValue"
            style="padding-left: 8px"
            placeholder="请输入"
          />
        </div>
      </template>
    </HokSearchForm>

    <div class="change-type2">
      <div
        v-for="item in typeList"
        :key="item.value"
        :class="{ active: couponType === item.value }"
        @click="changeType(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <ZBTable
      ref="zbTableRef"
      height="410px"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:couponName="{ scope }">
        <div>
          <p class="goods-title-cls">{{ scope.row.couponName }}</p>
          <p
            class="goods-blue-cls"
            style="cursor: pointer; width: 100%; float: left"
          >
            <span style="float: left" @click="toDetail(scope.row)">
              ID:{{ scope.row.couponNo }}
            </span>
            <img
              v-clipboard:copy="scope.row.couponNo"
              v-clipboard:success="clipboardSuccess"
              title="复制订单号"
              style="
                float: left;
                margin-top: 4px;
                width: 14px;
                height: 14px;
                font-style: normal;
                margin-left: 10px;
              "
              src="../../../../assets/image/coupon/icn_copy.png"
            />
          </p>
          <em v-if="scope.row.couponType === 1" class="goods-em-cls">
            商品优惠券
          </em>
          <em v-if="scope.row.couponType === 2" class="goods-em-cls">
            店铺优惠券
          </em>
          <em v-if="scope.row.couponType === 3" class="goods-em-cls">
            直播优惠券
          </em>
        </div>
      </template>
      <template v-slot:couponContent="{ scope }">
        <p class="coupon-youhui">{{ scope.row.couponContent }}</p>
        <span v-if="scope.row.discountMethod === 1" class="coupon-yh-em">
          指定商品满减券
        </span>
        <span v-if="scope.row.discountMethod === 2" class="coupon-yh-em">
          指定商品直减券
        </span>
        <span v-if="scope.row.discountMethod === 3" class="coupon-yh-em">
          指定商品折扣券
        </span>
      </template>
      <template v-slot:couponType="{ scope }">
        <p v-if="scope.row.couponType === 1">商品券</p>
        <p v-else-if="scope.row.couponType === 3">直播专享券</p>
      </template>
      <template v-slot:issueCount="{ scope }">
        <p>{{ scope.row.claimedCount }} / {{ scope.row.issueCount }}</p>
        <div
          v-if="scope.row.couponType === 1"
          v-permission="['btn:couponMg:view', permsList]"
        >
          <el-link
            :underline="false"
            type="primary"
            @click="
              () => {
                collectionRecord(scope.row)
              }
            "
          >查看</el-link>
        </div>
      </template>
      <template v-slot:claimStartTime="{ scope }">
        <p class="time-line-p">
          <em>领</em>{{ scope.row.claimStartTime }} -
          {{ scope.row.claimEndTime }}
        </p>
        <p v-if="scope.row.expireDays" class="time-line-p">
          <em class="line-em-inp">用</em>领取后
          {{ scope.row.expireDays }} 天有效
        </p>
        <p v-else class="time-line-p">
          <em class="line-em-inp">用</em>{{ scope.row.useStartTime }} -
          {{ scope.row.useEndTime }}
        </p>
      </template>
      <template v-slot:auditStatus="{ scope }">
        <div v-if="scope.row.auditStatus === 1" class="audit-div-cls">
          <img src="../../../../assets/image/coupon/icn_chushen.png" />
          <p>待初审</p>
        </div>
        <div
          v-if="scope.row.auditStatus === 2"
          class="audit-div-cls audit-bohui-cls"
        >
          <img src="../../../../assets/image/coupon/icn_bohui.png" />
          <p>审核驳回</p>
        </div>
        <div
          v-if="scope.row.auditStatus === 3"
          class="audit-div-cls audit-fushen-cls"
        >
          <img src="../../../../assets/image/coupon/icn_fushen.png" />
          <p>待复审</p>
        </div>
        <div
          v-if="scope.row.auditStatus === 4"
          class="audit-div-cls audit-bohui-cls"
        >
          <img src="../../../../assets/image/coupon/icn_bohui.png" />
          <p>审核驳回</p>
        </div>
        <div
          v-if="scope.row.auditStatus === 5"
          class="audit-div-cls audit-tongguo-cls"
        >
          <img src="../../../../assets/image/coupon/icn_check.png" />
          <p>审核通过</p>
        </div>
      </template>
      <template v-slot:useStatus="{ scope }">
        <div v-if="scope.row.auditStatus === 5">
          <p v-if="scope.row.useStatus === 1" class="use-status-cls stay-start">
            <em />待开始
          </p>
          <p v-if="scope.row.useStatus === 2" class="use-status-cls going-now">
            <em />生效中
          </p>
          <p v-if="scope.row.useStatus === 3" class="use-status-cls">
            <em />已过期
          </p>
          <p v-if="scope.row.useStatus === 4" class="use-status-cls zuofei">
            <em />已作废
          </p>
        </div>
        <p v-else>无</p>
      </template>
      <template v-slot:operate="{ scope }">
        <el-button type="text" @click="toDetail(scope.row)">详情</el-button>
        <el-button
          v-if="couponType !== 2"
          type="text"
          @click="toCopy(scope.row)"
        >复制</el-button>
        <el-button
          v-if="
            couponType === 0 &&
              (scope.row.auditStatus === 4 || scope.row.auditStatus === 2)
          "
          type="text"
          @click="toEdit(scope.row)"
        >
          编辑
        </el-button>
        <el-button
          v-if="
            scope.row.auditStatus === 5 &&
              scope.row.useStatus !== 3 &&
              scope.row.useStatus !== 4&&
              couponType !== 2
          "
          type="text"
          style="color: #f53f3f"
          @click="toCancel(scope.row)"
        >
          作废
        </el-button>
        <el-button
          v-if="
            scope.row.auditStatus === 5 &&
              isTimeTo(scope.row) &&
              scope.row.couponType === 1
          "
          v-permission="['btn:couponMg:share', permsList]"
          type="text"
          @click="
            () => {
              buildShareUrl({ couponNo: scope.row.couponNo })
            }
          "
        >
          分享
        </el-button>
      </template>
    </ZBTable>
    <el-dialog title="确认作废" :visible.sync="cancelDialog" width="30%">
      <span>请确认是否作废【{{ nowCancelObj.couponName }}】该优惠券</span>
      <p class="tips-red-cls">
        注意：作废操作将影响到优惠券的领取和展示，请确认
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="sureToCancel">
          确 定
        </el-button>
        <el-button size="small" @click="cancelDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <collectionRecord v-model="collectionRecordDialog" :row="row" />
    <couponShare v-model="couponShareDialog" :row="row" />
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns, formConfig } from './columns'
import clipboard from '@/directive/clipboard/index.js'
import { getCouponByPage, couponDiscard } from '@/api/marketingTools/coupon.js'
import collectionRecord from './collectionRecord/index.vue'
import couponShare from './couponShare/index.vue'
export default {
  name: 'CouponManager',
  directives: {
    clipboard
  },
  components: { HokSearchForm, ZBTable, collectionRecord, couponShare },
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
      permsList: this.$route.meta.permsList || [],
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      couponType: 0,
      options: [
        { label: '优惠券名称', value: 'couponName' },
        { label: '优惠券ID', value: 'couponNo' }
      ],
      cancelDialog: false,
      bindClickKeys: ['couponType', 'discountMethod', 'useStatus', 'time1'],
      nowCancelObj: {},
      typeList: [
        {
          name: '我创建的',
          value: 0
        },
        {
          name: '我管理的',
          value: 1
        },
        {
          name: '我使用的',
          permission: 'web:couponManager:MyUse',
          value: 2
        }
      ],
      collectionRecordDialog: false,
      couponShareDialog: false,
      row: {}
    }
  },
  watch: {},
  created() {
    // 绑定change事件
    this.formOpts.fieldList.forEach(item => {
      if (this.bindClickKeys.includes(item.prop)) {
        item.eventHandler.change = () => {
          this.searchFn()
        }
      }
    })
    if (
      this.$route.query.search &&
      this.$route.query.fromTab === 'couponManager'
    ) {
      const searchFromDetail = JSON.parse(this.$route.query.search)
      this.formOpts.formData = searchFromDetail
      this.couponType = this.$route.query.dataType
        ? Number(this.$route.query.dataType)
        : 0
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    isTimeTo(record) {
      // 判断claimStartTime后
      const nowTime = new Date().getTime()
      const claimStartTime = new Date(record.claimStartTime).getTime()
      if (nowTime > claimStartTime) {
        return true
      }
      return false
    },
    buildShareUrl(row) {
      this.row = row
      this.couponShareDialog = true
    },
    collectionRecord(row) {
      this.row = row
      this.collectionRecordDialog = true
    },
    changeType(item) {
      this.couponType = item.value
      this.searchFn()
    },
    toDetail(row) {
      const paramsString = JSON.stringify({
        ...this.tableConfig,
        ...this.formOpts.formData,
        dataType: this.couponType,
        claimStartTime:
          this.formOpts.formData.time1 && this.formOpts.formData.time1[0]
            ? this.formOpts.formData.time1[0]
            : undefined,
        claimEndTime:
          this.formOpts.formData.time1 && this.formOpts.formData.time1[1]
            ? this.formOpts.formData.time1[1]
            : undefined,
        [this.formOpts.formData.orderLabel]: this.formOpts.formData.orderValue
      })
      this.$router.push({
        path: '/yxgj/couponDataDetail',
        query: {
          couponNo: row.couponNo,
          fromTab: 'couponManager',
          dataType: this.couponType,
          search: paramsString,
          prevPath: this.$route.path
        }
      })
    },
    toCopy(row) {
      const paramsString = JSON.stringify({
        ...this.tableConfig,
        ...this.formOpts.formData,
        dataType: this.couponType,
        claimStartTime:
          this.formOpts.formData.time1 && this.formOpts.formData.time1[0]
            ? this.formOpts.formData.time1[0]
            : undefined,
        claimEndTime:
          this.formOpts.formData.time1 && this.formOpts.formData.time1[1]
            ? this.formOpts.formData.time1[1]
            : undefined,
        [this.formOpts.formData.orderLabel]: this.formOpts.formData.orderValue
      })
      this.$router.push({
        path: '/yxgj/addCouponIndex',
        query: {
          couponNo: row.couponNo,
          fromTab: 'couponManager',
          dataType: this.couponType,
          search: paramsString,
          isCopy: 1,
          prevPath:
            this.$route.path +
            '?fromTab=couponManager&dataType=' +
            this.couponType
        }
      })
    },
    toCancel(row) {
      this.nowCancelObj = row
      this.cancelDialog = true
    },
    toEdit(row) {
      this.$router.push({
        path: '/yxgj/addCouponIndex',
        query: {
          couponNo: row.couponNo,
          fromTab: 'couponManager',
          dataType: this.couponType
        }
      })
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    sureToCancel() {
      const params = {
        id: this.nowCancelObj.id
      }
      couponDiscard(params).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功！')
          this.cancelDialog = false
          this.loadData(this.searchForStart)
        }
      })
    },
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
          orderLabel: 'couponName',
          orderValue: undefined,
          couponType: undefined,
          useStatus: undefined,
          discountMethod: undefined,
          time1: undefined
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        ...this.formOpts.formData,
        dataType: this.couponType,
        claimStartTime:
          this.formOpts.formData.time1 && this.formOpts.formData.time1[0]
            ? this.formOpts.formData.time1[0]
            : undefined,
        claimEndTime:
          this.formOpts.formData.time1 && this.formOpts.formData.time1[1]
            ? this.formOpts.formData.time1[1]
            : undefined,
        [this.formOpts.formData.orderLabel]: this.formOpts.formData.orderValue
      }
      return getCouponByPage(params)
    }
  }
}
</script>
<style lang="scss" scoped>
.order-list {
  position: relative;
  margin-top: 20px;
  padding-bottom: 20px;
  .goods-title-cls {
    color: #161616;
    font-size: 16px;
    margin-bottom: 5px;
    white-space: pre-line; /*允许换行*/
    overflow: hidden;
    text-overflow: ellipsis; /*省略号*/
    display: -webkit-box;
    -webkit-box-orient: vertical; /*行向垂直排列*/
    -webkit-line-clamp: 2; /*限制2行*/
  }
  .goods-blue-cls {
    font-size: 12px;
    color: #0c6fff;
  }
  .goods-em-cls {
    font-style: normal;
    font-size: 12px;
    color: #ff7d00;
  }
  .coupon-youhui {
    color: #161616;
    font-size: 14px;
  }
  .coupon-yh-em {
    font-size: 12px;
    color: #999;
  }
  .time-line-p {
    margin-bottom: 5px;
    em {
      display: inline-block;
      font-style: normal;
      color: #fff;
      font-size: 14px;
      text-align: center;
      width: 20px;
      height: 20px;
      line-height: 20px;
      background: #bbd5fb;
      border-radius: 3px;
      margin-right: 8px;
    }
    .line-em-inp {
      background: #fcbd80;
    }
  }
  .audit-div-cls {
    padding: 3px 10px;
    border-radius: 12px;
    background: #fff2e6;
    display: inline-block;
    img {
      float: left;
      width: 16px;
      height: 16px;
      margin-top: 4px;
      margin-right: 5px;
    }
    p {
      float: left;
      color: #ff7d00;
      font-size: 12px;
    }
  }
  .audit-bohui-cls {
    background: #feecec;
    p {
      color: #f53f3f;
    }
  }
  .audit-fushen-cls {
    background: #fff2cc;
    p {
      color: #ffc619;
    }
  }
  .audit-tongguo-cls {
    background: #e6f7ea;
    p {
      color: #00b42a;
    }
  }
  .use-status-cls {
    color: #161616;
    font-size: 14px;
    em {
      float: left;
      margin-top: 8px;
      margin-right: 5px;
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background: #cbcfd3;
    }
  }
  .stay-start {
    em {
      background: #ff7d00;
    }
  }
  .zoufei {
    em {
      background: #999999;
    }
  }
  .going-now {
    em {
      background: #00b42a;
    }
  }
  .input-with-select {
    width: 120px;
    height: 32px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    border-radius: 3px 0px 0px 3px;
    padding-left: 5px;
  }
  .input-with-select-chang {
    ::v-deep .el-input__inner {
      border: none;
      border-radius: 3px 0px 0px 3px;
      border: 1px solid #d8dce6;
      border-right: none;
    }
  }
  .input-with-input {
    width: 308px;
  }
}
::v-deep .el-input-group__prepend {
  background-color: #ffffff;
}
::v-deep {
  .filter_teacherSelect {
    .tearchInput {
      width: 270px !important;
    }
  }
}
.change-type2 {
  width: 358px;
  border-radius: 4px;
  background: #f0f0f0;
  padding: 3px;
  cursor: pointer;
  user-select: none;
  margin: 20px 0;
  div {
    display: inline-block;
    min-width: 117px;
    text-align: center;
    color: #000;
    font-size: 14px !important;
  }
  .active {
    padding-top: 2px;
    height: 26px;
    border-radius: 4px;
    color: #0c6fff;
    background: #fff;
  }
}
</style>

