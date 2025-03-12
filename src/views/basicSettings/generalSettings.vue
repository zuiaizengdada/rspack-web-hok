<template>
  <div class="main_content">
    <div class="main_left">
      <div class="general_set">
        <span>通用设置</span>
      </div>
      <div
        v-for="(item, index) in arr"
        :key="index"
        class="child_item"
        :class="{ three_item_active: $route.name === item.name }"
        @click="router_cut(item.name)"
      >
        <div class="third-level-item" :title="item.meta.title">
          {{ item.meta.title }}
        </div>
      </div>
    </div>
    <div class="main_right">
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
  mounted() {
    console.log('this.permission_routes: ~~~~~:', this.permission_routes)
    // rodo----- 需要通过路由获取
    const currentRouter = this.permission_routes.filter(v => {
      return v.path === '/oaManagement'
    })
    if (currentRouter.length > 0 && currentRouter[0].children) {
      const liveListArr = currentRouter[0].children.filter(v => {
        return v.path === 'generalSettings'
      })
      if (liveListArr.length > 0) {
        // 过滤掉隐藏的tabes
        this.arr = liveListArr[0].children?.filter(v => !v.hidden) || []
      }
    }
    if (this.$route.path === '/oaManagement/generalSettings') {
      if (this.arr.length > 0) {
        this.$router.push({ name: this.arr[0].name })
      }
    }
    this.$router.push({ name: window.ty_router || this.arr[0].name })
  },
  created() {},
  methods: {
    router_cut(name) {
      window.ty_router = name
      this.$router.push({ name: name })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.main_content {
  background: #fff;
  border-radius: 10px;
  display: flex;
  // min-width: 1000px;
  .main_left {
    @include responsive-height(60px);
    width: 236px;
    margin-top: 20px;
    margin-left: 20px;
    border: 1px solid #e4e7ed;
    flex-direction: row;
    border-radius: 10px;
    .general_set {
      width: 196px;
      margin: 0 20px;
      height: 60px;
      border-bottom: 1px solid #e7e7e7;
      span {
        font-size: 16px;
        color: #333;
        line-height: 65px;
        font-weight: bold;
      }
    }
    .child_item {
      margin-top: 16px;
      width: 100%;
      height: 42px;
      padding-left: 20px;
      line-height: 42px;
      color: #333;
      font-size: 14px;
      cursor: pointer;
    }
    .three_item_active {
      color: #0c6fff;
      border-left: 4px solid #0c6fff;
      background: linear-gradient(
        90deg,
        #e7f0ff 0%,
        rgba(245, 249, 255, 0) 100%
      );
    }
  }
  .main_right {
    @include responsive-height(60px);
    width: calc(100% - 236px);
    flex-direction: row;
    margin: 20px;
    border-radius: 10px;
    display: inline-block;
    border: 1px solid #e4e7ed;
    position: relative;
    overflow: auto;
    flex: 1;
  }
}
</style>
