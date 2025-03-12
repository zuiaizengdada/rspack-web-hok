<template>
  <div>
    <template v-if="isPage">
      <el-collapse
        v-for="(item, index) in list"
        :key="index"
        :value="0"
        accordion
        style="padding: 0 10px; margin: 10px 0"
      >
        <el-collapse-item
          :title="'上架平台：' + item.channeTypeName"
          :name="index"
        >
          <div
            v-for="(m, mIndex) in item.chrildren"
            :key="mIndex"
            class="content"
          >
            <div>上架店铺：{{ m.shopName }}</div>
            <div class="flex" style="margin-top: 10px">
              <div>产品链接：</div>
              <div class="width-90">
                <div
                  v-for="(n, nIndex) in m.chrildren"
                  :key="nIndex"
                  style="width: 100%"
                >
                  <el-divider v-if="nIndex > 0" style="margin: 10px 0 0 0" />
                  <div>
                    商品ID：{{ n.goodsId }}
                    <i
                      class="el-icon-document-copy"
                      style="cursor: pointer"
                      @click="copyClick(n.goodsId)"
                    />
                  </div>
                  <div>
                    链接地址：
                    <el-link
                      type="primary"
                      :underline="false"
                      @click="openLinkUrl(n.linkUrl)"
                    >{{ n.linkUrl }}</el-link>
                    <span
                      style="margin-left: 10px"
                    >链接备注：{{ n.linkRemark || '-' }}</span>
                  </div>
                  <div
                    v-if="item.channeType === 10"
                    @click="copyClick(n.promotionLinkUrl)"
                  >
                    推广链接：{{ n.promotionLinkUrl }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </template>
    <el-drawer
      v-else
      v-loading="loading"
      :title="title"
      :visible.sync="getVisible"
      :direction="'rtl'"
      :before-close="handleClose"
      :size="'45%'"
      destroy-on-close
    >
      <el-collapse
        v-for="(item, index) in list"
        :key="index"
        :value="0"
        accordion
        style="padding: 0 10px; margin: 10px 0"
      >
        <el-collapse-item
          :title="'上架平台：' + item.channeTypeName"
          :name="index"
        >
          <div
            v-for="(m, mIndex) in item.chrildren"
            :key="mIndex"
            class="content"
          >
            <div>上架店铺：{{ m.shopName }}</div>
            <div class="flex" style="margin-top: 10px">
              <div>产品链接：</div>
              <div class="width-90">
                <div
                  v-for="(n, nIndex) in m.chrildren"
                  :key="nIndex"
                  style="width: 100%"
                >
                  <el-divider v-if="nIndex > 0" style="margin: 10px 0 0 0" />
                  <div>
                    商品ID：{{ n.goodsId }}
                    <i
                      class="el-icon-document-copy"
                      style="cursor: pointer"
                      @click="copyClick(n.goodsId)"
                    />
                  </div>
                  <div>
                    链接地址：
                    <el-link
                      type="primary"
                      :underline="false"
                      @click="openLinkUrl(n.linkUrl)"
                    >{{ n.linkUrl }}</el-link>
                    <span
                      style="margin-left: 10px"
                    >链接备注：{{ n.linkRemark || '-' }}</span>
                  </div>
                  <div
                    v-if="item.channeType === 10"
                    @click="copyClick(n.promotionLinkUrl)"
                  >
                    推广链接：{{ n.promotionLinkUrl }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>
  </div>
</template>

<script>
import { orderChannels } from '../utils'
import { getShelfDetail } from '@/api/product/productManage.js'
import { copy } from '@/utils'
export default {
  model: {
    prop: 'visible',
    event: 'changeVisible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    productId: {
      type: String,
      default: ''
    },
    isPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      copy,
      orderChannels,
      loading: false,
      title: '产品上架链接',
      list: []
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('changeVisible', val)
      }
    }
  },
  watch: {
    getVisible: {
      handler(val) {
        if (val) {
          this.getInfo()
        }
      },
      deep: true
    }
  },
  methods: {
    openLinkUrl(url) {
      window.open(url, '_blank')
    },
    copyClick(val) {
      this.copy(val)
      this.$message.success({
        message: '复制成功',
        customClass: 'amap-sug-result'
      })
    },
    getInfo() {
      this.loading = true
      getShelfDetail({ productId: this.productId })
        .then(res => {
          this.loading = false
          if (res.data.length) {
            this.list = res.data.map(item => ({
              channeTypeName:
                this.orderChannels.find(i => i.value === item.type)?.label ||
                '-',
              channeType: item.type,
              chrildren: item.shopList.map(i => ({
                shopId: i.shopId,
                shopName: i.shopName,
                chrildren: [
                  ...i.goodsList.map(m => ({
                    goodsId: m.goodsId,
                    linkUrl: m.linkUrl,
                    linkRemark: m.linkRemark,
                    promotionLinkUrl: m.promotionLinkUrl
                  }))
                ]
              }))
            }))
            console.log(this.list, 'ssssssssssssss')
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleClose() {
      this.$emit('handleClose')
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  padding: 20px;
  background-color: #F2F6FC;
  border-radius: 5px;
}
.width-90 {
  width: 90%;
}
::v-deep .el-collapse-item__arrow {
  margin-left: 10px;
  color: rgb(12, 111, 255);
  font-weight: bold;
}
::v-deep .el-collapse .el-collapse-item__header {
  color: rgb(12, 111, 255);
}
</style>
