<template>
  <div class="subtitle-search-contaienr flex items-center">
    <label class="label">搜索</label>
    <div class="input-content flex items-center">
      <el-input v-model="name" placeholder="请输入字幕" size="mini" @keyup.enter.native="subtitleSearch" @change="handleChangeName">
        <div v-show="visibleInputSuffix" slot="suffix" class="input">
          <span>{{ activeIndex }}/{{ totalIndex }}</span>
          <i class="el-icon-error" @click="handleClickClear" />
        </div>
      </el-input>
      <div class="btns flex items-center">
        <el-button size="mini" icon="el-icon-arrow-up" class="btn" :disabled="!totalIndex" @click="handleClickUp" />
        <el-button size="mini" icon="el-icon-arrow-down" class="btn" :disabled="!totalIndex" @click="handleClickDown" />
      </div>
    </div>
    <slot name="searchRight" />
    <slot name="searchFontsize" />
  </div>
</template>
<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      name: '',
      activeIndex: 0,
      totalIndex: 0,
      visibleInputSuffix: false
    }
  },
  watch: {
    index(val) {
      this.activeIndex = val
    },
    total(val) {
      this.totalIndex = val
      this.visibleInputSuffix = val
    },
    name(val) {
      if (val.length === 0) {
        this.visibleInputSuffix = false
      }
    }
  },
  methods: {
    subtitleSearch() {
      this.$emit('search', this.name)
    },
    handleClickClear() {
      this.name = ''
      this.$emit('clear')
    },
    handleChangeName() {
      this.$emit('change', this.name)
    },
    handleClickUp() {
      this.$emit('search', this.name, true)
    },
    handleClickDown() {
      this.$emit('search', this.name)
    }
  }
}
</script>
<style lang="scss" scoped>
.subtitle-search-contaienr{
    padding:8px 20px;
    .label{
        font-size:14px;
        color:#D9D9D9;
        margin-right:8px;
        font-weight: 400;
    }
    .input-content{
        width: 270px;
        height: 24px;
        border-radius: 4px;
        border: 1px solid #4D4D4D;
        overflow: hidden;
        flex:1;
        .input{
            height:24px;
        }
        .btns{
            margin-left:4px;
        }
    }
}
::v-deep .el-input--mini .el-input__inner{
    height: 24px;
    line-height: 24px;
    background: none;
    border:none;
    padding-left:10px;
    color:#D9D9D9;
}
::v-deep .el-input__suffix-inner{
    line-height: 24px;;
}
::v-deep .el-icon-error{
    margin-left:10px;
    font-size:14px;
    color:#737373;
    cursor: pointer;
}
::v-deep .el-input__inner::placeholder{
    color:#737373;
    font-size:12px;
}
::v-deep .el-button--mini{
    width: 24px;
    height: 24px;
    background: #737373;
    display: flex;
    align-items: center;
    justify-content: center;
    padding:0;
    border:none;
    border-radius: 0;;
    &:first-child{
       margin-right:1px;
    }
    i{
        color:#D9D9D9;
        font-size:12px;
    }
    &:hover{
        background: #737373;
    }
}
::v-deep .el-button + .el-button{
    margin-left:0;
}
</style>
