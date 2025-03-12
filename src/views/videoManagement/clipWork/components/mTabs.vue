<template>
  <div class="my_tabs">
    <!-- <div v-for="(item, index) in arr" :key="item.title" class="tabpane">
      <div v-permission="['web:clipWork:'+item.name, permsList]" class="title" :class="{'active': active === index}" @click="tabClick(item, index)">{{ item.title }}</div>
    </div> -->
    <div class="tabpane">
      <div class="title" :class="{'active': active === 0}" @click="tabClick(arr[0], 0)">我的工程</div>
      <div v-if="active == 0" class="line" />
    </div>
    <div v-permission="['web:clipWork:ClipWorkMyMaterial', permsList]" class="tabpane">
      <div class="title" :class="{'active': active === 1}" @click="tabClick(arr[1], 1)">我的素材</div>
      <div v-if="active == 1" class="line" />
    </div>
    <div v-permission="['web:clipWork:ClipWorkShared', permsList]" class="tabpane">
      <div class="title" :class="{'active': active === 2}" @click="tabClick(arr[2], 1)">共享给我</div>
      <div v-if="active == 2" class="line" />
    </div>

  </div>
</template>

<script>
export default {
  components: {},
  // eslint-disable-next-line vue/require-prop-types
  props: ['activename'],
  data() {
    return {
      arr: [
        { title: '我的工程', name: 'ClipWorkMyProject' },
        { title: '我的素材', name: 'ClipWorkMyMaterial' },
        { title: '共享给我', name: 'ClipWorkShared' }
      ],
      permsList: this.$route.meta.permsList || [],
      active: 0
    }
  },
  watch: {
    activename: {
      handler (newName, oldName) {
        if (newName !== oldName) {
          if (newName === 'ClipWorkMyProject') {
            this.active = 0
          } else if (newName === 'ClipWorkMyMaterial') {
            this.active = 1
          } else if (newName === 'ClipWorkShared') {
            this.active = 2
          }
        }
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    tabClick(item, index) {
      console.log('llllllllllllllllllllllll:', item)
      this.active = index
      this.$emit('tabClick', item.name)
    }
  }
}
</script>

<style lang='scss' scoped>
.my_tabs {
    margin-top: 16px;
    padding-bottom: 8px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #E7E7E7;
    position: relative;
    .tabpane {
        flex: 1 0 0;
        text-align: center;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 24px;
        cursor: pointer;
        position: relative;
        .active {
            color: #0C6FFF;
        }
        .line {
          position: absolute;
          bottom: -11px;
          left: 0px;
          width: 100%;
          height: 4px;
          background: #0C6FFF;
          border-radius: 5px;
          // transform: ;
          transition: all .2s;
        }
    }

}
</style>
