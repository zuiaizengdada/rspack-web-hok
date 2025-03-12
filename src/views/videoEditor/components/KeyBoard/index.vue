<template>
  <div class="keyboard-container">
    <el-tooltip placement="bottom">
      <div slot="content" class="key-list">
        <h4 class="title">快捷键提示</h4>
        <p v-for="item in list" :key="item.name">{{ item.name }} : {{ item.value }}</p>
        <div class="flex items-center keyword-custom cursor-pointer" @click="handleClickOpenDialogSet">
          <img :src="iconKeywordCustom" />
          <span>自定义快捷键</span>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <img :src="keywordIcon" style="margin-right:10px;" />
        <span>快捷键</span>
      </div>
    </el-tooltip>
    <dialog-set :visible.sync="visibleDialogSet" />
  </div>
</template>

<script>
import keywordIcon from '../../icons/kuaijiejian_icon.svg'
import iconKeywordCustom from '../../icons/zidingyikuaijiejian_icon.svg'
import DialogSet from './DialogSet.vue'
import { KEYBOARDLIST } from './constant'
export default {
  components: {
    DialogSet
  },
  data() {
    return {
      visibleDialogSet: false,
      list: KEYBOARDLIST,
      keywordIcon,
      iconKeywordCustom
    }
  },
  methods: {
    handleClickOpenDialogSet() {
      this.visibleDialogSet = true
    }
  }
}
</script>
<style lang="scss" scoped>
.keyboard-container{
  margin-right:24px;
  }
   .key-list {
      padding:0 4px;
      .title{
        padding-top: 4px;
        font-size: 16px;
        margin-bottom:10px;
        color: #DEDEDE;
      }
      p {
        line-height: 20px;
        color: #a6a6a6;
        font-size: 12px;
      }
      .keyword-custom{
        margin-top:10px;
        padding-top:10px;
        font-size:14px;
        color: #a6a6a6;
        position: relative;
        &:after{
            content:'';
            position:absolute;
            top:0;
            left:-14px;
            width:156px;
            height:1px;
            background: #4D4D4D;
        }
        img{
            margin-right:5px
        }
      }
    }
</style>
