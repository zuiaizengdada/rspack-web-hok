<template>
  <div class="home-group">
    <div class="home-group-head">
      <div class="title">{{ categoryName }}</div>
      <div class="more">
        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
          <i class="more-icon more-edit" @click="moreClick('edit')" />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          :content="info && info.topTime ? '取消置顶' : '置顶'"
          placement="top"
        >
          <i
            v-if="info && info.topTime"
            class="more-icon more-untopping"
            @click="moreClick('untopping')"
          />
          <i
            v-else
            class="more-icon more-topping"
            @click="moreClick('topping')"
          />
        </el-tooltip>
        <el-tooltip
          v-delTabIndex
          class="item"
          effect="dark"
          content="删除"
          placement="top"
        >
          <i class="more-icon more-delete" @click="moreClick('delete')" />
        </el-tooltip>
      </div>
    </div>
    <div class="home-group-main">
      <template v-for="item in list">
        <HomeGroupItem
          v-if="item.list.length"
          :key="item.refKey"
          :title="item.title"
          :list="item.list"
          :ref-key="item.refKey"
        />
      </template>
    </div>
  </div>
</template>

<script>
import HomeGroupItem from './homeGroupItem.vue'
export default {
  name: 'HomeGroup',
  components: {
    HomeGroupItem
  },
  directives: {
    delTabIndex: {
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        el.__vueSetTimeoutIndex__ = setTimeout(() => {
          // 清除当前tabIndex
          el.removeAttribute('tabindex')
          clearTimeout(el.__vueSetTimeoutIndex__)
        }, 0)
      },
      unbind(el) {
        clearTimeout(el.__vueSetTimeoutIndex__)
      }
    }
  },
  props: {
    info: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      categoryName: '',
      list: []
    }
  },
  watch: {
    info: {
      handler(newValue, oldValue) {
        this.init()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { categoryName, list } = this.info
      this.categoryName = categoryName
      this.list = list
    },
    moreClick(type) {
      this.$emit('moreClick', type, this.index)
      document.body.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.home-group {
  height: auto;
  min-width: 900px;
  width: auto;
  /* border: 1px solid #979797; */
  background: #ffffff;
  box-shadow: 0 4px 6px 0 #0000000d;
  border-radius: 8px;
  padding: 20px;
  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .title {
      color: #2c3242;
      font-size: 20px;
      font-weight: 600;
      line-height: 20px;
    }
  }
  &-main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .more {
    transition: opacity 0.5s ease-out;
    /* opacity: 0; */
    padding-left: 20px;
  }
  .more {
    height: 20px;
    opacity: 1;
    .more-icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-left: 10px;
      &.more-edit {
        background: url('~@/assets/image/home/home_edit.png') no-repeat 100%/100%;
        &:hover {
          background: url('~@/assets/image/home/home_edit_on.png') no-repeat
            100%/100%;
        }
      }
      &.more-delete {
        background: url('~@/assets/image/home/home_del.png') no-repeat 100%/100%;
      }
      &.more-topping {
        background: url('~@/assets/image/home/home_topping.png') no-repeat 100%/100%;
        &:hover {
          background: url('~@/assets/image/home/home_topping_blue.png')
            no-repeat 100%/100%;
        }
      }
      &.more-untopping {
        background: url('~@/assets/image/home/home_untopping.png') no-repeat
          100%/100%;
        &:hover {
          background: url('~@/assets/image/home/home_untopping_blue.png')
            no-repeat 100%/100%;
        }
      }
    }
  }
}
</style>
