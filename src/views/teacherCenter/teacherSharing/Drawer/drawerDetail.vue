<template>
  <!-- 跟进详情弹框 -->
  <el-drawer
    :size="728"
    :visible.sync="visible"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div v-if="visible" class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <div class="w-100p mytabs">
          <template v-for="item in tabs">
            <div
              v-if="item.isShow"
              :key="item.value"
              class="mytabsView"
              :class="{active: activeName === item.value}"
              @click="activeName = item.value"
            >{{ item.label }}</div>
          </template>
        </div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent overflowOuto">
        <component :is="activeName" :teacher-id="teacherId" :row="row" />
      </div>
      <div class="ss-material-box-footer">
        <el-button size="small" type="primary" @click="onhandleGet">立即领取</el-button>
        <el-button size="small" @click="visible = false">关闭</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import followDetail from './followDetail'
import claimRecord from './claimRecord'
// import Dialog from '../Dialog/index'
export default {
  components: {
    followDetail,
    claimRecord
  },
  props: {},
  data() {
    return {
      visible: false,
      row: {},
      teacherId: '',
      activeName: 'followDetail',
      tabs: [
        { label: '跟进详情', value: 'followDetail', isShow: true }
        // { label: '领取记录', value: 'claimRecord', isShow: true }
      ],
      success: () => {},
      permsList: []
    }
  },
  computed: {},
  watch: {
    visible: {
      handler(val) {
      }
    }
  },
  mounted() {
  },
  methods: {
    // 点击关闭
    close() {
      this.visible = false
    },
    // 点击立即领取
    onhandleGet() {
      this.success && this.success()
      // Dialog.open({
      //   visible: true,
      //   type: 'GetDialog',
      //   row: this.row,
      //   teacherId: this.teacherId,
      //   success: () => {
      //     this.success && this.success()
      //   }
      // })
    }
  }
}
</script>

<style lang='scss' scoped>
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    box-sizing: border-box;
    height: 52px;
    display: flex;
    align-items: flex-end;
    position: relative;
    .mytabs {
      padding-left: 20px;
      border-bottom: 1px solid #dfe4ed;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      display: flex;
      .mytabsView {
        margin-right: 21px;
        padding-bottom: 8px;
        cursor: pointer;
      }
      .active {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #0C6FFF;
        line-height: 24px;
        border-bottom: 2px solid #0C6FFF;
      }
    }
    .close {
      position: absolute;
      right: 20px;
      top: 22px;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .drawerContent {
    flex: 1 0 0;
  }
  .ss-material-box-footer {
    padding-right: 18px;
    border-top: 1px solid #E7E7E7;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
::v-deep {
  .el-tabs__header {
    margin: 0;
  }
}
</style>
