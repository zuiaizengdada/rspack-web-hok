<template>
  <div class="main_content">
    <div class="main_left">
      <div class="general_set">
        <span>通用设置</span>
      </div>
      <div
        v-for="(item, index) in pathList"
        :key="index"
        class="child_item"
        :class="{ three_item_active: name === item.name }"
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
  name: 'LayoutSidebar',
  components: {},
  data() {
    return {
      pathList: [],
      name: ''
    }
  },
  computed: {
    ...mapGetters(['permission_routes'])
  },
  watch: {
    $route: {
      handler(to) {
        console.log('to', to)
        if (to.name === 'courseInteractionDetail') {
          this.name = 'courseInteraction'
        } else {
          this.name = to.name
        }
      },
      immediate: true
    } 
  },
  created() {
    this.pageInit()
  },
  methods: {
    pageInit() {
      const path = this.$route.path
      const name = this.$route.name
      // 一级路由
      this.permission_routes?.forEach(i => {
        i.children &&
          i.children?.forEach(j => {
            if (j.path === path || j.name === name) {
              j.children?.length &&
                this.$router.replace({ name: j.children[0].name })
            } else {
              j.children &&
                j.children?.forEach(v => {
                  if (v.path === path || v.name === name) {
                    console.log(j, 'j')
                    this.pathList = j.children || []
                  }
                  if (v.children?.length) {
                    v.children.forEach(item => {
                      if (item.path === path || item.name === name) {
                        this.pathList = j.children || []
                      }
                    })
                  }
                })
            }
          })
      })

      console.log('this.pathList: ~~~~~:', this.pathList)
    }
  }
}
</script>

<style lang="scss" scoped>
.main_content {
  //background: #fff;
  border-radius: 10px;
  display: flex;
  // min-width: 1000px;
  .main_left {
    background: #fff;
    width: 180px; 
    height: calc(100vh - 160px);
    //margin-top: 20px;
    //margin-left: 20px;
    border: 1px solid #e4e7ed;
    flex-direction: row;
    border-radius: 10px;
    .general_set {
      width: 140px;  
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
    width: calc(100% - 236px);
    height: calc(100% - 60px);
    flex-direction: row;
    //margin: 20px;
    margin-left: 10px;
    border-radius: 10px;
    display: inline-block;
    //border: 1px solid #e4e7ed;
    position: relative;
    overflow: auto;
    flex: 1;
    border: 1px solid #f2f2f2;
  }
}
</style>
