<template>
  <MCard class="orderKanbanSetting">
    <div class="title">订单数据看板设置</div>
    <div class="tips">
      <i class="el-icon-warning tipsIcon" />
      <div class="tipsContent">
        <div class="tipsTitle">注意</div>
        <div class="tipsMsg">修改配置内容，将变更数据统计，影响对员工的业绩核算</div>
      </div>
    </div>
    <div class="content">
      <!-- <div class="orderType">
        <div class="contentItem">
          <div class="contentItemTitle">订单类型-线上</div>
          <div class="contentItemForm">
            <div class="formLabel">商品价格等于</div>
            <div class="formValue">
              <el-select v-model="form.onlinePrice" :disabled="!ifEdit" size="small" multiple placeholder="请选择" style="width: 242px;">
                <el-option
                  v-for="item in priceOption"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
          </div>
        </div>

        <div class="contentItem">
          <div class="contentItemTitle">订单类型-线下</div>
          <div class="contentItemForm">
            <div class="formLabel">商品价格等于</div>
            <div class="formValue">
              <el-select v-model="form.offlinePrice" :disabled="!ifEdit" size="small" multiple placeholder="请选择" style="width: 242px;">
                <el-option
                  v-for="item in priceOption"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
          </div>
        </div>
      </div>

      <div class="orderType m-t-36">
        <div class="contentItem">
          <div class="contentItemTitle">订单类型-线上交付</div>
          <div class="contentItemForm">
            <div class="formLabel">商品价格等于</div>
            <div class="formValue">
              <el-select v-model="form.onlineDeliveryPrice" :disabled="!ifEdit" size="small" multiple placeholder="请选择" style="width: 242px;">
                <el-option
                  v-for="item in priceOption"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div class="contentItem">
          <div class="contentItemTitle">排除统计</div>
          <div class="contentItemForm">
            <div class="formLabel">商品实付金额小于等于</div>
            <div class="formValue">
              <el-input-number v-model="form.excludePrice" controls-position="right" size="small" :disabled="!ifEdit" style="width: 185px" placeholder="请输入内容" type="number" :min="0" :max="200" />
            </div>
          </div>
        </div>
      </div> -->
      <div class="orderType">
        <div class="contentItem">
          <div class="contentItemTitle">排除统计</div>
          <div class="contentItemForm">
            <div class="formLabel">商品实付金额小于等于</div>
            <div class="formValue">
              <el-input-number v-model="form.excludePrice" controls-position="right" size="small" :disabled="!ifEdit" style="width: 185px" placeholder="请输入内容" type="number" :min="0" :max="200" />
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="footer">
      <el-button v-if="!ifEdit" :loading="loading" size="small" class="footerBtn" @click="onhandlerEdit">编辑</el-button>
      <el-button v-if="ifEdit" type="primary" :loading="loading" size="small" class="footerBtn" @click="onhandlerSave">保存</el-button>
      <el-button v-if="ifEdit" :loading="loading" size="small" class="footerBtn" @click="onhandlerCancel">取消</el-button>
    </div>
  </MCard>
</template>

<script>
import { getStatisticalCorrelation, statisticalCorrelationSetting } from '@/api/order/performanceShare'
import { getGoodsPrices } from '@/api/order/performanceShare'
export default {
  components: {},
  data() {
    return {
      ifEdit: false,
      loading: false,
      detail: {
        // onlinePrice: [], // 线上
        // offlinePrice: [], // 线下
        // onlineDeliveryPrice: [], // 线上交付
        excludePrice: '' // 排除统计
      }, // 详情数据
      form: {
        // onlinePrice: [], // 线上
        // offlinePrice: [], // 线下
        // onlineDeliveryPrice: [], // 线上交付
        excludePrice: '' // 排除统计
      }, // 编辑数据
      priceOption: []
    }
  },
  mounted() {
    this.getDetail()
    this.getPriceOption()
  },
  methods: {
    // 点击编辑按钮
    onhandlerEdit() {
      this.form = JSON.parse(JSON.stringify(this.detail))
      this.ifEdit = true
    },
    // 点击保存按钮
    onhandlerSave() {
      this.loading = true
      const data = {
        excludePrice: this.form.excludePrice
      }
      statisticalCorrelationSetting(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.ifEdit = false
        this.getDetail()
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击取消按钮
    onhandlerCancel() {
      this.form = JSON.parse(JSON.stringify(this.detail))
      this.ifEdit = false
    },
    // 查询详情
    getDetail() {
      this.loading = true
      getStatisticalCorrelation().then(res => {
        console.log('获取订单数据看板设置详情')
        this.detail = {
          excludePrice: res.data.excludePrice
        }
        this.onhandlerCancel()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getPriceOption() {
      getGoodsPrices().then(res => {
        this.priceOption = res.data
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.orderKanbanSetting {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20px;
    min-width: 851px;
    overflow: hidden;
    .title {
        width: 100%;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 24px;
        padding-bottom: 20px;
        border-bottom: 1px solid #E7E7E7;
    }
    .tips {
        width: 100%;
        margin-top: 20px;
        padding: 10px;
        background: #FFF2E6;
        border-radius: 8px;
        display: flex;
        .tipsIcon {
            width: 24px;
            color: #FF7D00;
            font-size: 24px;
        }
        .tipsContent {
            flex: 1;
            padding-left: 8px;
            .tipsTitle {
                font-size: 16px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: #FF7D00;
                line-height: 24px;
            }
            .tipsMsg {
                margin-top: 8px;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #FF7D00;
                line-height: 22px;
            }
        }
    }
    .content {
        margin-top: 36px;
        .orderType {
            display: flex;
        }
        .contentItem {
            width: 477px;
            .contentItemTitle {
                font-size: 16px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: #333333;
                line-height: 24px;
                margin-bottom: 16px;
            }
            .contentItemForm {
                display: flex;
                .formLabel {
                    font-size: 14px;
                    font-family: MicrosoftYaHei;
                    color: #333333;
                    line-height: 32px;
                }
                .formValue {
                    padding-left: 8px;
                }
            }
        }
    }
    .footer {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 32px;
        width: 851px;
        .footerBtn{
            width: 68px;
            height: 32px;
        }
    }
}
.m-t-36 {
    margin-top: 36px;
}
</style>
