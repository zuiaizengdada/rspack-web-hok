<template>
  <div class="filterHeader">
    <!-- <template v-if="!show"> -->
    <el-select v-model="search.type" :class="{showMySelect: !show}" class="mySelect" placeholder="请选择" @change="typeChange">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <div />
    <!-- </template> -->
    <div class="searchIcon">
      <div class="pointer searchSvgIcon" :style="{'margin-right': show ? '10px' : '0px'}" @click="searchBoxType">
        <svg-icon class="pointer" icon-class="searchIcon" />
      </div>
      <el-input
        ref="myInput"
        v-model.trim="search.keyWord"
        size="small"
        placeholder="请输入关键词搜索"
        :class="{show: show}"
        class="myinput"
        clearable
        @keyup.enter.native="$emit('keyWordChange', search.keyWord)"
        @clear="clearKeyword"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {},
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      value: '',
      show: false,
      search: {
        type: '',
        keyWord: ''
      }
    }
  },
  computed: {
    ...mapState({
      memberQueryType: state => state.im.memberQueryType
    })
  },
  watch: {
    memberQueryType: {
      handler(val) {
        this.search.type = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    keyWordChange(val) {
      this.$emit('keyWordChange', val)
    },
    clearKeyword() {
      this.$emit('clearKeyword')
    },
    typeChange() {
      this.$store.commit('im/set_memberQueryType', Number(this.search.type))
      this.$emit('typeChange', this.search.type)
    },
    // 筛选栏切换触发
    searchBoxType() {
      this.show = !this.show
      this.search.keyWord = ''
      this.$emit('searchBoxType', this.show)
    }
  }
}
</script>

<style lang='scss' scoped>
.filterHeader {
    background: #FFFFFF;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    .searchIcon {
      flex: 1 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      .el-icon-search {
        margin-right: 10px;
        cursor: pointer;
      }
      .searchSvgIcon {
        width: 32px;
        height: 32px;
        background: #F5F5F5;
        border-radius: 4px;
        line-height: 32px;
        text-align: center;
      }
      .myinput {
        transition: width .2s;
        width: 0;
        overflow: hidden;
      }
      .show {
        width: 220px;
      }
    }
    .mySelect {
      width: 0;
      display: none;
    }
    .showMySelect {
      display: block;
      width: 220px;
    }
}
::v-deep {
    .el-input {
        > input {
          height: 32px;
          background: #F5F5F5;
        }
    }
}
</style>
