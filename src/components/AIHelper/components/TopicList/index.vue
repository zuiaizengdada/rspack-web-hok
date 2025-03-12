<template>
  <div class="right-slide">
    <Sell
      v-show="showType === 1"
      ref="sellRef"
      @selectItem="selectItem"
      @trigger="showType = 2"
    />
    <Collect
      v-show="showType === 2"
      ref="collectRef"
      @selectItem="selectItem2"
      @trigger="showType = 1"
    />
  </div>
</template>
<script>
import Sell from './Sell/index.vue'
import Collect from './Collect/index.vue'
export default {
  components: {
    Sell,
    Collect
  },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      searchTopicName: '',
      topicList: [],
      showType: 1
    }
  },
  created() {
    this.showType = this.type
    this.$nextTick(() => {
      // this.queryData()
    })
  },
  methods: {
    queryData() {
      this.$refs.sellRef.resetSearch()
      this.$refs.collectRef.resetSearch()
    },
    selectItem(item) {
      this.$uweb && this.$uweb.setAction('Event_click_select_sell_btn')
      this.$emit('selectItem', item)
    },
    selectItem2(item) {
      this.$emit('selectItem', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.right-slide {
  position: relative;
  height: 100%;
  overflow: hidden;
}
</style>
