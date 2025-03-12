<template>
  <AppDialog
    v-model="editConfig.visible"
    :title="editConfig.title"
    width="530px"
    height="auto"
    @success="handleOk"
  >
    <div class="warpBox">
      <el-form
        ref="editForm"
        :rules="rules"
        label-position="left"
        :inline="true"
        :model="form"
        size="small"
        label-width="90px"
      >
        <el-form-item label="渠道/店铺" prop="orderPlatform">
          <el-cascader
            ref="cascaderForChoose"
            v-model="form.orderPlatform"
            style="width: 380px"
            :options="options"
            :props="{
              expandTrigger: 'hover',
              value: 'label',
              label: 'label',
              children: 'list'
            }"
          />
        </el-form-item>
        <el-form-item label="商品名" prop="orderName">
          <el-input
            v-model.trim="form.orderName"
            style="width: 380px"
            :maxlength="100"
            placeholder="请输入商品名称"
            show-word-limit
          />
          <div>确保商品名称与第三方店铺中的商品名称完全一致</div>
        </el-form-item>
        <el-form-item label="商品ID" prop="productId">
          <el-input
            v-model.trim="form.productId"
            style="width: 380px"
            placeholder="请输入商品ID"
            :maxlength="50"
            show-word-limit
          />
          <div>确保商品ID与第三方店铺中的ID完全一致</div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import { getThirdShopSelect } from '@/api/order/orderSign.js'
import AppDialog from '@/components/AppDialog'
export default {
  name: 'CommodityModel',
  components: { AppDialog },
  props: {
    editConfig: {
      type: Object,
      default: () => ({
        visible: false,
        title: '选择课程'
      })
    },
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    form: {
      orderPlatform: '',
      orderName: '',
      productId: ''
    },
    rules: {
      orderPlatform: [
        {
          required: true,
          type: 'array',
          message: '请选择渠道/店铺',
          trigger: 'change'
        }
      ],
      orderName: [{ required: true, message: '请输入商品名', trigger: 'blur' }],
      productId: [{ required: true, message: '请输入商品ID', trigger: 'blur' }]
    },
    options: []
  }),
  created() {
    this.getOptions()
  },
  methods: {
    initForm() {
      this.form = {
        orderPlatform: '',
        orderName: '',
        productId: ''
      }
    },
    handleChange() {},
    handleOk() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const data = {
            shopName: this.form.orderPlatform[1],
            orderPlatform: this.form.orderPlatform[0],
            orderName: this.form.orderName,
            shopId: this.getShopIdByOrderplatform(this.form.orderPlatform),
            orderPlatformId: this.getorderPlatformId(this.form.orderPlatform),
            productId: this.form.productId
          }
          const isBol = this.dataList.some(item => {
            const { orderPlatformId, shopId, productId } = item
            return orderPlatformId === data.orderPlatformId && shopId === data.shopId && productId === data.productId
          })
          if (isBol) return this.$message.error('不允许重复添加')
          this.$emit('update:editConfig', { visible: false })
          this.$emit('handleAdd', data)
          this.initForm()
        } else {
          return false
        }
      })
    },
    getShopIdByOrderplatform(array) {
      var shopId = ''
      this.options.some(item => {
        if (item.label === array[0]) {
          item.list.some(obj => {
            if (obj.shopName === array[1]) {
              shopId = obj.shopId
            }
          })
        }
      })
      return shopId
    },
    getorderPlatformId(array) {
      var orderPlatformId = ''
      this.options.some(item => {
        if (item.label === array[0]) {
          orderPlatformId = item.dictValue
        }
      })
      return orderPlatformId
    },
    getOptions() {
      getThirdShopSelect().then(res => {
        console.log(res.data)
        this.options = res.data.reduce((pre, next) => {
          if (next.list && next.list.length > 0) {
            next.list.map(e => {
              e.label = e.shopName
            })
            pre.push({
              label: next.dictLabel,
              dictValue: next.dictValue,
              list: next.list
            })
          }
          return pre
        }, [])
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.warpBox ::v-deep{
  padding: 20px;
  .el-input__inner{
    padding-right: 55px;
  }
}
</style>
