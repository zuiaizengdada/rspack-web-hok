<template>
  <div>
    <div class="task-box" @click="click">
      <div class="header-task">
        <svg-icon
          v-if="isVideoEdit"
          class-name="task-icon"
          icon-class="icon_task_edit"
        />
        <svg-icon v-else class-name="task-icon" icon-class="icon_task" />
      </div>
      <div class="header-title">任务中心</div>
      <!-- <taskCenter /> -->
    </div>
  </div>
</template>

<script>
// import eventBus from '@/utils/eventBus'
// import TaskCenter from '../taskCenter/index'
import { mixinsSyncData } from '@/views/videoManagement/accountManage/mixinsSyncData'
export default {
  name: 'HeaderTask',
  components: {
    // TaskCenter
  },
  mixins: [mixinsSyncData],
  props: {
    isVideoEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      toast: false,
      timer: null,
      socket: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    click() {
      this.$uweb && this.$uweb.setAction('Event_taskCenter_open')
      // this.toast = !this.toast
      // eventBus.$emit('visibleTaks', this.toast)
      this.$taskCenter.open(this.isVideoEdit)
    }
  }
}
</script>

<style lang="scss" scoped>
.task-box {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  .header-task {
    font-size: 0 !important;
    .task-icon {
      font-size: 20px;
      vertical-align: middle;
    }
  }
  .header-title {
    margin-left: 8px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
}
</style>
