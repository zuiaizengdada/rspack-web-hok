<template>
  <ul class="group-nav-container">
    <li v-for="(item,index) in groupNavList" v-show="!item.isHide" :key="item.name" :class="activeNavIndex===index?'active':''" @click="handleClickNavItem(item,index)">
      <svg-icon :icon-class="item.icon" class="icon" />
      <p>{{ item.name }}</p>
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      groupNavList: [
        {
          name: '视频',
          icon: 'videoIcon',
          isHide: false,
          componentName: 'VideoList'
        },
        {
          name: '贴图',
          icon: 'mapsIcon',
          isHide: false,
          componentName: 'MapsList'
        }
      ],
      activeNavIndex: 0
    }
  },
  methods: {
    handleClickNavItem(data, index) {
      this.$emit('active', data)
      this.activeNavIndex = index
    }
  }
}
</script>
<style lang="scss" scoped>
.group-nav-container{

    padding:0 16px;
    li{
        padding-top:20px;
        padding-bottom:16px;
        text-align: center;
        cursor: pointer;
         color:#999;
        &:first-child{
            border-bottom:1px solid #333333;
        }
        .icon{
          margin-bottom:10px;
          width:28px;
          height:28px;
        }
        p{
            font-size:14px;

        }
        &.active{
            color:#fff;
        }
    }
}
</style>
