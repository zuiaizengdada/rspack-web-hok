<template>
  <div class="page_wrap overflowOuto">
    <ul class="listViewUl">
      <div
        v-for="item in data"
        :key="item.projectId"
        class="listViewLi"
        :class="{ active: active === item.projectId }"
        @click="onClick(item)"
      >
        <span class="list_title">
          <span
            class="label"
          >{{ item.shareUserName ? item.shareUserName : ''
          }}<em
            v-if="item.shareUserName"
            style="width: 10px; height: 20px; display: inline-block"
          /></span>
          <span class="text">{{ item.projectName }}</span>
        </span>
        <span v-if="active === item.projectId" class="list_active">
          <svg-icon icon-class="right" />
        </span>
      </div>
    </ul>
    <div v-if="data.length === 0" class="noData">
      <img src="~@/assets/image/materialBg.png" alt="" />
      <div class="m-t-10 noDataText">暂无内容</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      active: 1
    }
  },
  mounted() {},
  methods: {
    onClick(item) {
      this.active = item.projectId
      this.$emit('change', item)
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  // height: 100%;
  flex: 1 0 0;
  height: 500px;
  .listViewUl {
    .listViewLi {
      padding-left: 16px;
      padding-right: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
      margin-bottom: 8px;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      .list_title {
        width: 227px;
        display: flex;
        color: #333333;
        .label {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .text {
          color: #fff;
          flex: 1 0 0;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
      .list_active {
        font-size: 20px;
        color: #0c6fff;
      }
    }
    .active {
      background-color: #2b2b2b;
      .list_title {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #0c6fff;
        .text {
          color: #0c6fff;
        }
      }
    }
  }
  .noData {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > img {
      width: 180px;
    }
    > .noDataText {
      margin-top: 10px;
      font-size: 14px;
      color: #919293;
      line-height: 26px;
    }
  }
}
</style>
