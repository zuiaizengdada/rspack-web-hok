<template>
  <div class="wrapper-online-content">
    <div v-if="dataArray.length === 2">
      <div class="wrapper-online-data-row">
        <div class="data-row-item">
          <viewBlock :item-obj="dataArray[0]" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
        <div class="data-row-item">
          <viewBlock :item-obj="dataArray[1]" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
      </div>
    </div>
    <div v-if="dataArray.length !== 6 && dataArray.length !== 2">
      <div class="wrapper-online-data-row">
        <div class="data-row-item">
          <viewBlock :item-obj="objectOne" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
        <div class="data-row-item">
          <viewBlock :item-obj="objectTwo" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
      </div>
      <div class="wrapper-online-data-row">
        <div class="data-row-item">
          <viewBlock :item-obj="objectThree" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
        <div class="data-row-item">
          <viewBlock :item-obj="objectFourth" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
      </div>
    </div>
    <div v-if="dataArray.length === 6">
      <div class="wrapper-online-data-row">
        <div class="data-row-item">
          <viewBlock :item-obj="dataArray[0]" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
        <div class="data-row-item">
          <viewBlock :item-obj="dataArray[1]" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
      </div>
      <div class="wrapper-online-data-row-short">
        <div class="data-row-item-short">
          <shortView :item-obj="dataArray[2]" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
        <div class="data-row-item-short">
          <shortView :item-obj="dataArray[3]" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
        <div class="data-row-item-short">
          <shortView :item-obj="dataArray[4]" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
        <div class="data-row-item-short">
          <shortView :item-obj="dataArray[5]" :loadding="loadding" :form-gmv-show="formGmvShow" :contrast-string="contrastString" :biz-type-active="bizTypeActive" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import viewBlock from './view.vue'
import shortView from './shortView.vue'
export default {
  components: {
    viewBlock,
    shortView
  },
  props: {
    contrastString: {
      type: String,
      default: ''
    },
    bizTypeActive: {
      type: [String, Number],
      default: 0
    },
    formGmvShow: {
      type: Object,
      default: function() {
        return {}
      }
    },
    loadding: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataArray: [],
      objectOne: {
        amount: 0,
        amountDiffer: 0,
        amountLinkRatio: 0,
        bizType: 0,
        bizTypeName: '',
        orderCount: 0,
        refundRatio: 0
      },
      objectTwo: {
        amount: 0,
        amountDiffer: 0,
        amountLinkRatio: 0,
        bizType: 0,
        bizTypeName: '',
        orderCount: 0,
        refundRatio: 0
      },
      objectThree: {
        amount: 0,
        amountDiffer: 0,
        amountLinkRatio: 0,
        bizType: 0,
        bizTypeName: '',
        orderCount: 0,
        refundRatio: 0
      },
      objectFourth: {
        amount: 0,
        amountDiffer: 0,
        amountLinkRatio: 0,
        bizType: 0,
        bizTypeName: '',
        orderCount: 0,
        refundRatio: 0
      }
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    init(arr) {
      this.dataArray = arr
      this.dataArray.some(item => {
        if (item.bizType === 4) {
          this.objectOne = item
        }
        if (item.bizType === 5) {
          this.objectTwo = item
        }
        if (item.bizType === 9) {
          this.objectThree = item
        }
        if (item.bizType === 12) {
          this.objectFourth = item
        }
      })
    },
    changeTheBizType(bizType) {
      this.$emit('changeTheBizType', bizType)
    },
    changeToList(obj) {
      this.$emit('changeToList', obj)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper-online-content {
  width: 100%;
  overflow: hidden;
}
.wrapper-online-data-row {
    width: 100%;
    margin-top: 20px;
    height: 122px;
    width: calc(100% + 20px);
    margin-left: -20px;
    .data-row-item {
        float: left;
        width: calc(50% - 20px);
        margin-left: 20px;
        height: 122px;
        background: #F5FAFF;
        border-radius: 10px;
        border: 1px solid #F2F2F2;
    }
}

.wrapper-online-data-row-short {
    margin-top: 20px;
    height: 145px;
    width: calc(100% + 20px);
    margin-left: -20px;
    .data-row-item-short {
      float: left;
      width: calc(25% - 20px);
      margin-left: 20px;
      height: 145px;
      background: #F5FAFF;
      border-radius: 10px;
      border: 1px solid #F2F2F2;
    }
}
</style>
