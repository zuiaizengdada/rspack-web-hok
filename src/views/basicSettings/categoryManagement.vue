<template>
  <div class="main_content">
    <div class="main_left">
      <div class="general_set">
        <span>类别管理</span>
      </div>
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
    // todo--- 需要处理根据便利获取
    console.log('this.permission_routes: ~~~~~:', this.permission_routes)
    const currentRouter = this.permission_routes.filter(v => {
      return v.path === '/teacherCenter'
    })
    if (currentRouter.length > 0 && currentRouter[0].children) {
      const liveListArr = currentRouter[0].children.filter(v => {
        return v.path === 'categoryManagement'
      })
      if (liveListArr.length > 0) {
        this.arr = liveListArr[0].children || []
      }
    }
    if (this.$route.path === '/teacherCenter/categoryManagement') {
      if (this.arr.length > 0) {
        this.$router.push({ name: this.arr[0].name })
      }
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.main_content {
  background: #fff;
  border-radius: 10px;
  @include responsive-height(20px);
  /* height: 100%; */
  display: flex;
  // min-width: 1000px;
  .main_left {
    @include responsive-height(60px);
    width: 236px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 20px;
    margin-left: 20px;
    border: 1px solid #e4e7ed;
    flex-direction: row;
    border-radius: 10px;
    box-sizing: border-box;
    .general_set {
      width: 183px;
      margin: 0 20px;
      box-sizing: border-box;
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
    width: calc(100% - 236px);
    height: calc(100% - 40px);
    flex-direction: row;
    margin: 20px;
    border-radius: 10px;
    display: inline-block;
    border: 1px solid #e4e7ed;
    position: relative;
  }
}
</style>
