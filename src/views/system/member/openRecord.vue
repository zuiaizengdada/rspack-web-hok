<template>
  <div>
    <el-table :data="data" border>
      <el-table-column prop="orderNo" label="订单号" />
      <el-table-column prop="contentName" label="商品" />
      <el-table-column prop="createTime" label="购买时间" />
      <el-table-column prop="effectiveTime" label="生效时间" />
      <el-table-column prop="failureTime" label="到期时间" />
      <el-table-column prop="goodsType" label="类型">
        <template slot-scope="{ row }">
          {{ {0:'图片',1:'音频', 2: '视频',3: '专栏',4:'大专栏',5:'公开课',6:'一对一',7:'落地班'}[row.goodsType] }}
        </template>
      </el-table-column>
      <el-table-column prop="payerTotal" label="消费金额">
        <template slot-scope="{ row }">
          {{ (row.payerTotal || 0) | filtersMoney }} 元
        </template>
      </el-table-column>
      <el-table-column prop="userTerminal" label="订单来源">
        <template slot-scope="{ row }">
          {{ row.userTerminal | getOptionsValue(userTerminal) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { userTerminal } from '@/utils/enum'
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      userTerminal
    }
  }

}
</script>

<style>

</style>
