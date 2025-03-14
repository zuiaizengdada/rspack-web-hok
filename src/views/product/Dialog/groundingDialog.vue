<template>
  <el-drawer
    v-loading="loading"
    :title="title"
    :visible.sync="visible"
    :direction="'rtl'"
    :before-close="handleClose"
    :size="'45%'"
    destroy-on-close
    :wrapper-closable="false"
  >
    <div class="body-groundingDialog">
      <el-card v-for="(row, index) in list" :key="index" class="box-card">
        <div slot="header" class="clearfix">
          <el-row
            style="width: 100%"
            type="flex"
            align="middle"
            justify="space-between"
          >
            <span>
              上架平台：
              <el-select
                v-model="row.channeType"
                style="width: 168px"
                placeholder="请选择"
                :disabled="row.isDisabled"
                @change="
                  val => {
                    getType(val, index)
                  }
                "
              >
                <el-option
                  v-for="item in row.channelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <i
                v-if="list.length > 1"
                class="el-icon-remove-outline"
                style="
                  font-size: 24px;
                  cursor: pointer;
                  margin-left: 10px;
                  color: red;
                "
                @click="delList(index)"
              />
            </span>
            <el-button v-if="index === list.length - 1" @click="addChannel">
              新增平台
            </el-button>
          </el-row>
        </div>
        <div
          v-for="(o, oIndex) in row.chrildren"
          :key="oIndex"
          class="text item"
        >
          <el-divider v-if="oIndex > 0" />
          <el-row type="flex" align="middle">
            <div style="width: 90%">
              <el-row type="flex" align="middle" style="margin-bottom: 10px">
                <span>上架店铺：</span>
                <el-select
                  v-model="o.shopId"
                  style="width: 168px"
                  placeholder="请选择"
                  :disabled="o.isDisabled"
                  @change="
                    val => {
                      shopChange(val, index, oIndex)
                    }
                  "
                >
                  <el-option
                    v-for="item in o.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-row>
              <div
                class="flex-row-grounding"
                :style="{
                  'align-items': o.chrildren.length > 1 ? 'baseline' : 'center'
                }"
              >
                <span style="min-width: 80px">产品链接：</span>
                <template v-if="row.channeType !== 10">
                  <div class="flex-row-grounding" style="flex-wrap: wrap">
                    <div
                      v-for="(n, nIndex) in o.chrildren"
                      :key="nIndex"
                      class="flex-row-grounding"
                      :style="{
                        'margin-top': nIndex < 1 ? '0' : '10px'
                      }"
                    >
                      <el-input
                        v-model="n.goodsId"
                        :disabled="n.isDisabled"
                        style="width: 168px; margin-right: 10px"
                        placeholder="商品ID"
                      />
                      <el-input
                        v-model="n.linkUrl"
                        style="width: 280px; margin-right: 10px"
                        placeholder="链接地址"
                      />
                      <el-input
                        v-model="n.linkRemark"
                        style="width: 112px; margin-right: 10px"
                        placeholder="链接备注"
                      />
                      <i
                        v-if="nIndex === o.chrildren.length - 1"
                        class="el-icon-circle-plus-outline"
                        style="
                          font-size: 24px;
                          cursor: pointer;
                          margin-right: 8px;
                        "
                        @click="addLinks(index, oIndex)"
                      />
                      <i
                        v-if="o.chrildren.length > 1"
                        class="el-icon-remove-outline"
                        style="font-size: 24px; cursor: pointer; color: red"
                        @click="delLinks(index, oIndex, nIndex)"
                      />
                    </div>
                  </div>
                </template>
                <!-- 视频号 -->
                <template v-else>
                  <div class="flex-row-grounding" style="flex-wrap: wrap">
                    <div
                      v-for="(n, nIndex) in o.chrildren"
                      :key="nIndex"
                      class="flex-row-grounding"
                      style="flex-wrap: wrap"
                      :style="{
                        'margin-top': nIndex < 1 ? '0' : '10px'
                      }"
                    >
                      <div class="flex-row-grounding">
                        <el-input
                          v-model="n.goodsId"
                          :disabled="n.isDisabled"
                          style="width: 168px; margin-right: 10px"
                          placeholder="商品ID"
                        />
                        <el-input
                          v-model="n.promotionLinkUrl"
                          style="width: 400px"
                          placeholder="推广链接"
                        />
                      </div>
                      <div class="flex-row-grounding" style="margin-top: 10px">
                        <el-input
                          v-model="n.linkUrl"
                          style="width: 468px; margin-right: 10px"
                          placeholder="商品链接地址"
                        />
                        <el-input
                          v-model="n.linkRemark"
                          style="width: 100px; margin-right: 10px"
                          placeholder="链接备注"
                        />
                        <i
                          v-if="nIndex === o.chrildren.length - 1"
                          class="el-icon-circle-plus-outline"
                          style="
                            font-size: 24px;
                            cursor: pointer;
                            margin-right: 8px;
                          "
                          @click="addLinks(index, oIndex)"
                        />
                        <i
                          v-if="o.chrildren.length > 1"
                          class="el-icon-remove-outline"
                          style="font-size: 24px; cursor: pointer; color: red"
                          @click="delLinks(index, oIndex, nIndex)"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div style="width: 10%; display: flex; justify-content: flex-end">
              <i
                v-if="oIndex === row.chrildren.length - 1"
                class="el-icon-circle-plus-outline"
                style="font-size: 24px; cursor: pointer; margin-right: 8px"
                @click="addShop(index)"
              />
              <i
                v-if="row.chrildren.length > 1"
                class="el-icon-remove-outline"
                style="font-size: 24px; cursor: pointer; color: red"
                @click="delShop(index, oIndex)"
              />
            </div>
          </el-row>
        </div>
      </el-card>
    </div>
    <div class="footer-op">
      <el-button size="small" class="control-btn" @click="handleClose()">
        取消
      </el-button>
      <el-button
        type="primary"
        size="small"
        class="control-btn-primary"
        @click="save()"
      >
        保存
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import { orderChannels } from '../utils'
import {
  goodListByProductId,
  productShelf,
  shopThirdList
} from '@/api/product/productManage.js'
export default {
  props: {
    productId: {
      type: String,
      default: ''
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      orderChannels,
      loading: false,
      visible: false,
      title: '产品上架',
      list: []
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.list = []
          this.getInfo()
        }
      },
      deep: true
    }
  },
  methods: {
    delList(index) {
      this.list.splice(index, 1)
    },
    delLinks(index, oIndex, nIndex) {
      this.list[index].chrildren[oIndex].chrildren.splice(nIndex, 1)
    },
    addLinks(index, oIndex) {
      this.list[index].chrildren[oIndex].chrildren.push({
        linkRemark: undefined,
        goodsId: undefined,
        linkUrl: undefined,
        promotionLinkUrl: undefined
      })
    },
    delShop(index, oIndex) {
      this.list[index].chrildren.splice(oIndex, 1)
    },
    addShop(index) {
      this.list[index].chrildren.push({
        shopId: undefined,
        shopName: undefined,
        chrildren: [
          {
            linkRemark: undefined,
            goodsId: undefined,
            linkUrl: undefined,
            promotionLinkUrl: undefined
          }
        ],
        options: [...this.list[index].chrildren[0].options]
      })
    },
    save() {
      const ls = [...this.list]
      const tmpList = []
      ls.forEach(m => {
        if (m.channeType) {
          m.chrildren.forEach((n, i) => {
            if (n.shopId) {
              n.goodsList = n.chrildren.filter(
                v =>
                  v.goodsId &&
                  v.linkUrl &&
                  (n.channeType !== 10 ? true : !!v.promotionLinkUrl)
              )
              if (n.goodsList.length && i === m.chrildren.length - 1) {
                tmpList.push(m)
              }
            }
          })
        }
      })
      console.log(tmpList, 'ccc')
      if (tmpList.length === 0) {
        this.$message.error('请选择上架平台和店铺')
        return
      }
      this.loading = true
      console.log('sssssssss:', tmpList)
      const params = {
        productGoodsList: [
          ...tmpList.map(m => ({
            type: m.channeType,
            shopList: m.chrildren.map(n => ({
              shopId: n.shopId,
              shopName: n.shopName,
              goodsList: [
                ...n.goodsList.map(v => ({
                  goodsId: v.goodsId,
                  linkUrl: v.linkUrl,
                  linkRemark: v.linkRemark,
                  promotionLinkUrl:
                    m.channeType !== 10 ? undefined : v.promotionLinkUrl
                }))
              ]
            }))
          }))
        ],
        productId: this.productId
      }
      // console.log(params)
      productShelf(params)
        .then(() => {
          this.loading = false
          this.$message.success('保存成功')
          this.$emit('success')
          this.handleClose()
        })
        .catch(() => {
          this.loading = false
        })
    },
    shopChange(val, index, oIndex) {
      const name =
        this.list[index].chrildren[oIndex].options.find(f => f.value === val)
          ?.label || ''
      this.list[index].chrildren[oIndex].shopName = name
    },
    setShopList(type, index) {
      shopThirdList({ type }).then(res => {
        this.list[index].chrildren = [
          {
            shopId: undefined,
            shopName: undefined,
            chrildren: [
              {
                linkRemark: undefined,
                goodsId: undefined,
                linkUrl: undefined,
                promotionLinkUrl: undefined
              }
            ],
            options: res.data.map(item => {
              return {
                label: item.shopName,
                value: item.shopId
              }
            })
          }
        ]
      })
    },
    getType(type, index) {
      this.setShopList(type, index)
      // if (type !== oldType) {
      //   this.$confirm('切换平台将重置下方店铺数据，是否切换！', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //     callback: action => {
      //       if (action === 'confirm') {
      //         this.setShopList(type, index)
      //       } else {
      //         this.list[index].channeType = oldType
      //       }
      //     }
      //   })
      // } else {
      //   this.setShopList(type, index)
      // }
    },
    getInfo() {
      this.loading = true
      goodListByProductId({ productId: this.productId })
        .then(res => {
          this.loading = false
          if (res.data.length) {
            this.list = res.data.map(item => {
              return {
                channeType: item.type,
                channelOptions: [...this.orderChannels],
                chrildren: item.shopList.map(i => {
                  return {
                    shopId: i.shopId,
                    shopName: i.shopName,
                    chrildren: [
                      ...i.goodsList.map(m => ({
                        goodsId: m.goodsId,
                        linkUrl:
                          item.type === 1
                            ? `https://haohuo.jinritemai.com/ecommerce/trade/detail/index.html?id=${m.goodsId}&origin_type=604`
                            : m.linkUrl,
                        linkRemark: m.linkRemark,
                        isDisabled: this.isAdd,
                        promotionLinkUrl:
                          item.type !== 10
                            ? undefined
                            : `weixinstore/${m.goodsId}`
                      }))
                    ],
                    isDisabled: this.isAdd,
                    options: [{ label: i.shopName, value: i.shopId }]
                  }
                }),
                isDisabled: this.isAdd
              }
            })
          } else {
            this.addChannel()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    addChannel() {
      this.list.push({
        channeType: undefined,
        channelOptions: [...this.orderChannels],
        chrildren: [
          {
            shopId: undefined,
            shopName: undefined,
            chrildren: [
              {
                linkRemark: undefined,
                goodsId: undefined,
                linkUrl: undefined,
                promotionLinkUrl: undefined
              }
            ],
            options: []
          }
        ]
      })
    },
    handleClose() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.body-groundingDialog {
  position: relative;
  height: calc(100% - 60px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #d0d0d0;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }
  .box-card {
    margin: 0 20px 20px 20px;
  }
}
.flex-row-grounding {
  display: flex;
  align-items: center;
  width: 100%;
}
.footer-op {
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
}
</style>
