<template>
  <div>
    <p class="head-stundentInfo">{{ stundentInfo }}</p>
    <!-- <div class="completed-list">
      <div v-for="(item,index) of completedList" :key="index">
        <div class="completed-listItem">
          <img class="icon-clear" src="@/assets/image/icon_clear@2x.png" @click=" $emit('clear',item, index)">
          <svg-icon :icon-class="getFileTypeName(item.fileName)" class="flex-none" style="font-size: 32px" />
          <p class="showMore">{{ item.fileName }}</p>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    completedList: {
      type: Array,
      default: () => {
        return []
      }
    },
    studentInfo: {
      type: Object,
      default: () => {
        return {
          userName: '未知',
          userPhone: ''
        }
      }
    }
  },
  data() {
    return {
      uploadCompletedList: []
    }
  },
  computed: {
    stundentInfo() {
      return this.studentInfo.userName + (this.studentInfo.userPhone ? `(${this.studentInfo.userPhone})` : '')
    }
  },
  methods: {
    getFileTypeName(name) {
      const fileTypeName = name.substring(name.lastIndexOf('.') + 1)
      const workTypeName = fileTypeName + 'work' // 作业的图标
      return workTypeName || 'el-icon-document'
    }
  }
}
</script>

<style lang="scss" scoped>
  .head-stundentInfo {
    color: #333;
    font-size: 14px;
    margin-top: 20px;
  }
  .completed-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    & > div{
      flex: 0 0 25%;
    }
  }
  .completed-listItem {
    position: relative;
    width: 160px;
    height: 80px;
    text-align: center;
    cursor: pointer;
    border: 1px solid #eff2f6;
    margin-top: 10px;
    padding-top: 10px;
    .icon-clear {
      width: 16px;
      height: 16px;
      top: -8px;
      right: -8px;
      position: absolute;
    }
    p {
      font-size: 14px;
      color: #333;
    }
  }
  .showMore {
    /* 设置多行文本溢出省略 */
    display: -webkit-box;
    /* 默认最多显示1行 */
    -webkit-line-clamp: 1;
    overflow: hidden;
    -webkit-box-orient: vertical;
    font-size: 14px;
    &::before{
      content: '';
      float: right;
      width: 0;
      height: 100%;
      margin-bottom: -19px;
    }
  }

</style>
