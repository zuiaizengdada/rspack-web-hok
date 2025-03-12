<template>
  <AppDialog :height="'363px'" :width="'608px'" :value="visible" :title="title" :btn-footer="false" @close="close">
    <div v-for="(item,index) in goodsList" :key="index" class="addCommodityContent">
      <div class="commodityImgFont">
        商品图片
      </div>
      <div class="imgList overflowOuto">
        <img v-for="(ele,ind) in item.image" :key="ind" :src="ele" />
      </div>
      <div class="commodityImgFont">
        商品原标题
      </div>
      <div class="commodityImgFont1">
        {{ item.name }}
      </div>
      <div class="commodityImgFont">
        <span style="color: #F53F3F;margin-right: 4px">*</span>
        <span>视频短标题</span>
      </div>
      <div class="commodityTitle">
        <el-input
          v-model="item.shortTitle"
          type="text"
          placeholder="请输入内容"
          maxlength="10"
          show-word-limit
        />
      </div>
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button
        size="small"
        @click="close()"
      >取消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="succese()"
      >确定</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  name: 'AddCommodity',
  components: {
    AppDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    goodsList: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: '添加商品'
    }
  },
  data() {
    return {
      text: ''
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    succese() {
      if (this.goodsList[0].shortTitle === '') {
        // error('请填写短标题')
      } else {
        this.$emit('succese', this.goodsList[0])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addCommodityContent{
  padding: 0 20px;
  box-sizing: border-box;
  .commodityImgFont{
    margin-top: 19px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
  .commodityImgFont1{
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-top: 12px;
  }
  .commodityTitle{
    margin-top: 12px;
  }
  .imgList{
    display: flex;
    margin-top: 12px;
    width:550px;
    flex-shrink: 0;
    img{
      flex-shrink:0;
      width: 120px;
      height: 120px;
      border-radius: 2px;
      margin-right: 20px;
    }
  }
}
.ss-material-box-bottom {
  background: #ffffff;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
  border-radius: 0px 0px 10px 10px;
}
</style>
