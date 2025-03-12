<template>
  <div class="pagination">
    <span class="previousPage" :class="{disabled: myCurrent < 2}" @click="previousPage"><i class="el-icon-arrow-left" /></span>
    <span class="paginationDetail">
      <template v-if="myCurrent >= 100 && Math.ceil(total/size) >= 100">
        <span class="currentPage">{{ myCurrent }}</span>
        <span class="totalPage">/共{{ Math.ceil(total/size) }}页</span>
      </template>
      <template v-else>
        <span class="currentPage">第{{ myCurrent }}页</span>
        <span class="totalPage">/共{{ Math.ceil(total/size) }}页</span>
      </template>
    </span>
    <span class="nextPage" :class="{disabled: myCurrent >= Math.ceil(total/size)}" @click="nextPage"><i class="el-icon-arrow-right" /></span>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 总条数
    total: {
      type: Number,
      default: 0
    },
    // 当前页
    current: {
      type: Number,
      default: 1
    },
    // 每页条数
    size: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      myCurrent: 0, // 当前页
      totalPage: 0 // 总页数
    }
  },
  watch: {
    current: {
      handler(val) {
        this.myCurrent = val
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 上一页
    previousPage() {
      if (this.myCurrent < 2) {
        return
      }
      this.myCurrent--
      this.$emit('currentChange', this.myCurrent)
    },
    // 下一页
    nextPage() {
      if (this.myCurrent === Math.ceil(this.total / this.size)) {
        return
      }
      this.myCurrent++
      this.$emit('currentChange', this.myCurrent)
    }
  }
}
</script>

<style lang='scss' scoped>
.pagination {
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
  .paginationDetail {
    margin-left: 28px;
    margin-right: 28px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    line-height: 22px;
    .currentPage {
      color: #777777;
    }
    .totalPage {
      color: #999999;
    }
  }
  .previousPage {
    cursor: pointer;
    font-weight: bold;
    &:hover {
      color: #409eff;
    }
  }
  .nextPage {
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .disabled {
    color: #c0c4cc;
    cursor: not-allowed;
  }
}
</style>
