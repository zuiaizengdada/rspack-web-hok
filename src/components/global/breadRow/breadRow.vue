<template>
  <div class="bread-row">
    <template v-for="(item, index) in title">
      <div :key="index" class="bread-row-box" @click="$emit('onClick', index)">
        <span v-if="index !== title.length - 1">{{ item }}</span>
        <i v-if="index !== title.length - 1"> > </i>
        <p v-if="index === title.length - 1">{{ item }}</p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.bread-row {
    width: 100%;
    padding-bottom: 15px;
    padding-left: 15px;
    padding-right: 15px;
    border-bottom: 1px solid #EFF2F6;
    .bread-row-box {
        display: inline-block;
    }
    span {
        color: #777;
        font-size: 16px;
        cursor: pointer;
    }
    i {
        color: #777;
        font-size: 14px;
        font-style: normal;
        padding: 0 2px;
        cursor: pointer;
    }
    p {
        font-size: 16px;
        font-weight: normal;
        color: #333;
        display: inline-block;
    }
}
</style>
