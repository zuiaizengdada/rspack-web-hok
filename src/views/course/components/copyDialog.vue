<template>
  <div>
    <el-dialog
      title="第二步"
      :visible.sync="visible"
      append-to-body
      :close-on-click-modal="false"
      width="500px"
    >
      <el-checkbox-group v-model="value">
        <el-checkbox label="more"> 内容管理-商品信息（{{ more }}节）</el-checkbox>
        <el-checkbox label="product">相关推荐（{{ product }}个商品）</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" :disabled="!value.length" @click="handleCopy">复制到新商品</el-button>
        <el-button size="small" @click="handleClose">跳过</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="第三步"
      :visible.sync="tipsVisible"
      append-to-body
      :close-on-click-modal="false"
      width="500px"
    >
      <div>
        <div>1、已成功同步商品章节 {{ copyInfo.more || 0 }}节</div>
        <div>2、已成功同步推荐{{ copyInfo.product || 0 }}个商品</div>
        <div>3、第三方商品对应未同步</div>
        <div>4、抖音小程序审核状态，对应新ID等未同步</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleSuccess">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { materialGoodsQueryCount, materialGoodsCopyData } from '@/api/shop'
export default {
  data() {
    return {
      visible: false,
      value: [],
      more: 0,
      product: 0,
      params: {},
      copyInfo: {
        more: 0,
        product: 0
      },
      tipsVisible: false
    }
  },
  methods: {
    async open({ goodsId, id, type }) {
      this.visible = true
      this.value = []
      this.params = {
        goodsId,
        id,
        type,
        more: false,
        product: false
      }
      this.copyInfo = {
        more: 0,
        product: 0
      }
      const { data } = await materialGoodsQueryCount({ goodsId, type })
      this.more = data.more
      this.product = data.product
    },
    async handleCopy() {
      if (this.value.includes('more')) {
        this.params.more = true
      }
      if (this.value.includes('product')) {
        this.params.product = true
      }
      const { data } = await materialGoodsCopyData({
        ...this.params,
        newGoodsId: this.params.id,
        oldGoodsId: this.params.goodsId
      })
      this.copyInfo = data
      this.visible = false
      this.tipsVisible = true
    },
    handleClose() {
      this.visible = false
      this.tipsVisible = true
    },
    handleSuccess() {
      this.tipsVisible = false
      this.$emit('success')
    }
  }
}
</script>

<style>

</style>
