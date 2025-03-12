<template>
  <div>
    <el-dialog
      title="第二步"
      :visible.sync="visible"
      append-to-body
      :close-on-click-modal="false"
      width="500px"
    >
      <div>
        <span class="text-base">确认是否同步以下信息到新商品</span>
        <el-checkbox-group v-model="asyncConfig" class="flex flex-column mt-3">
          <el-checkbox class="mt-2" label="more"> 套餐课程-商品信息（{{ more }}）</el-checkbox>
          <el-checkbox class="mt-2" label="delivery"> 交付配置</el-checkbox>
          <el-checkbox class="mt-2" label="packageMaterial">抖音小程序视频（{{ product }}）</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="mt-5">
        <span class="text-base mt-5">映射关系</span>
        <el-checkbox-group v-model="mapConfig" class="flex flex-column mt-3">
          <el-checkbox class="mt-2" label="thirdGoodsMapping">同步第三方商品映射关系（抖音小程序需要重新提交审核）</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" :disabled="!(asyncConfig.length + mapConfig.length)" @click="handleCopy">复制到新商品</el-button>
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
        <div>1、已成功同步套餐课课程 {{ copyInfo.packageGoods || 0 }}个</div>
        <div>2、已成功同步交付配置</div>
        <!--        <div>2、已成功同步推荐{{ copyInfo.packageGoods || 0 }}个商品</div>-->
        <div>3、第三方商品对应{{ copyInfo.thirdGoods || 0 }}个</div>
        <div>4、抖音小程序视频{{ copyInfo.packageMaterial || 0 }}个</div>
        <div>5、抖音小程序审核状态未同步</div>
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
      asyncConfig: [],
      mapConfig: [],
      more: 0,
      product: 0,
      params: {},
      copyInfo: {
        more: 0,
        product: 0,
        thirdGoods: 0,
        packageMaterial: 0
      },
      tipsVisible: false
    }
  },
  methods: {
    async open({ goodsId, id, type }) {
      this.visible = true
      this.asyncConfig = []
      this.mapConfig = []
      this.params = {
        goodsId,
        id,
        type,
        more: false,
        product: false
      }
      this.copyInfo = {
        more: 0,
        product: 0,
        thirdGoods: 0,
        packageMaterial: 0
      }
      const { data } = await materialGoodsQueryCount({ goodsId, type })
      this.more = data.packageGoods
      this.product = data.packageMaterial
    },
    async handleCopy() {
      this.params.packageGoods = false
      this.params.delivery = false
      this.params.packageMaterial = false
      this.params.thirdGoodsMapping = false
      if (this.asyncConfig.includes('more')) {
        this.params.packageGoods = true
      }
      if (this.asyncConfig.includes('delivery')) {
        this.params.delivery = true
      }
      if (this.asyncConfig.includes('packageMaterial')) {
        this.params.packageMaterial = true
      }
      if (this.mapConfig.includes('thirdGoodsMapping')) {
        this.params.thirdGoodsMapping = true
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
