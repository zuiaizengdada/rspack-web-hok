<template>
  <div class="thirdNav">
    <div class="scedindexMenuRegion">
      <div
        v-for="(item, index) in arr"
        :key="index"
        class="child_item"
        :class="{ three_item_active: $route.name === item.name }"
        @click="$router.push({ name: item.name })"
      >
        <div class="third-level-item" :title="item.meta.title">
          {{ item.meta.title }}
        </div>
      </div>
    </div>
    <div class="main_content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MarketingManagement',
  components: {},
  data() {
    return {
      arr: []
    }
  },
  computed: {
    ...mapGetters(['permission_routes'])
  },
  created() {
    const currentRouter = this.permission_routes.filter(v => {
      return v.path === '/yxgj'
    })
    if (currentRouter.length > 0 && currentRouter[0].children) {
      const liveListArr = currentRouter[0].children.filter(v => {
        return v.path === 'distribution'
      })
      if (liveListArr.length > 0) {
        this.arr = liveListArr[0].children || []
      }
    }
    if (this.$route.path === '/yxgj/distribution') {
      if (this.arr.length > 0) {
        this.$router.push({ name: this.arr[0].name })
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.thirdNav {
  position: absolute;
  top: 68px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  height: 100%;
  display: flex;
  .scedindexMenuRegion {
    margin-left: 1px;
    width: 128px;
    min-width: 128px;
    height: calc(100% - #{$historyHeight } - 40px);
    background-color: #ffffff;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    padding-top: 20px;
    font-size: 14px;
    &::-webkit-scrollbar {
      width: 4px;
      height: 10px;
      // display: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .child_item {
      width: 88px;
      height: 32px;
      line-height: 32px;
      padding-left: 8px;
      margin-bottom: 8px;
      color: #333333;
      cursor: pointer;
      &:hover {
        background-color: #f5f9ff;
        border-radius: 4px;
      }
    }
    .three_item_active {
      background-color: #e9f2ff;
      border-radius: 4px;
      text-align: left;
      width: 88px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .main_content {
    flex: 1;
    overflow: auto;
    padding: 0 10px 10px 10px;
    // min-width: 1000px;
  }
}
</style>
