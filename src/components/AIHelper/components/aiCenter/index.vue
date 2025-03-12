<template>
  <div class="assistantCenter">
    <div class="assistantCenter_page">
      <div class="assistantCenter-nav">
        <div class="assistantCenter-nav-list">
          <div
            v-for="item in navList"
            :key="item.value"
            :class="{ navActive: active === item.value }"
            class="assistantCenter-nav-list-view"
            @click="onChangeNav(item)"
          >
            <div>{{ item.label }}</div>
          </div>
        </div>

        <!-- <div class="add_btn" @click="onhandleAdd">
          <i class="el-icon-plus" />
          <span style="margin-left: 8px">创建AI助手</span>
        </div> -->
      </div>
      <div class="assistantCenter-content">
        <components
          :is="active"
          @editAi="item => $emit('editAi', item)"
          @onAdd="onhandleAdd"
          @openAi="id => $emit('openAi', id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import aiShop from './aiShop'
import myAssistant from './myAssistant'
export default {
  components: {
    aiShop,
    myAssistant
  },
  data() {
    return {
      navList: [
        { label: '助手中心', value: 'aiShop' }
        // { label: '我的助手', value: 'myAssistant' }
      ],
      active: 'aiShop'
    }
  },
  mounted() {},
  methods: {
    onChangeNav(item) {
      this.active = item.value
    },
    // 点击创建AI助手
    onhandleAdd() {
      this.$emit('onAdd')
    }
  }
}
</script>

<style lang="scss" scoped>
.assistantCenter {
  // min-width: 1200px;
  // overflow-x: auto;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: linear-gradient(225deg, #f8fbff 0%, #f9fcff 100%);
  // overflow: auto;
  .assistantCenter_page {
    // min-width: 1100px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    // overflow: auto;
    .assistantCenter-nav {
      padding-top: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .assistantCenter-nav-list {
        display: inline-block;
        border-radius: 6px;
        border: 1px solid #d3d7d8;
        padding: 5px;
        .assistantCenter-nav-list-view {
          display: inline-block;
          width: 112px;
          height: 30px;
          border-radius: 6px;
          color: #777777;
          text-align: center;
          line-height: 30px;
          cursor: pointer;
          font-weight: bold;
        }
        .navActive {
          background: #e8ebee;
          color: #5696ff;
        }
      }
      .add_btn {
        width: 134px;
        height: 40px;
        background: #5696ff;
        border-radius: 6px;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: bold;
        color: #ffffff;
        line-height: 40px;
        cursor: pointer;
        text-align: center;
      }
    }
    .assistantCenter-content {
      flex: 1 0 0;
      // min-width: 1200px;
      // overflow: auto;
    }
  }
}
</style>
