<template>
  <div class="p4header">
    <div>
      <template v-for="item in tabList">
        <div
          :key="item.key"
          class="p4headerList"
          :class="{ active: item.key === active }"
          @click="onchange(item)"
        >
          {{ item.label }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    tabList: {
      type: Array,
      default: () => {
        return []
      }
    },
    active: {
      type: String,
      default: ''
    },
    // 是否是负责人 暂时不使用
    isHead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    onchange(item) {
      if (item.key === this.active) return
      // this.active = item.key
      this.$emit('onChange', item.key)
    }
  }
}
</script>

<style lang='scss' scoped>
.p4header {
    display: flex;
    justify-content: flex-end;
    padding-top: 7px;
    padding-right: 7px;
    background: linear-gradient(180deg, #D7FEFF 0%, #D9FEFF 100%);
    >div {
      background: rgba(0, 0, 0, 0.05);
      padding: 2px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      border-radius: 5px;
      width: fit-content;
    }

  .p4headerList {
    width: 51px;
    height: 25px;
    line-height: 25px;
    flex-shrink: 0;
    border-radius: 5px;
    // background: #000000cc;
    // color: #ffffff;
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    text-align: center;
    cursor: pointer;
  }

  .p4headerList + .p4headerList {
    margin-left: 5px;
  }

  .active {
    background: #fff;
    color: #000;
  }
}
</style>
