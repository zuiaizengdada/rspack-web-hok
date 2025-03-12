<template>
  <!-- 班期详情弹框 -->
  <el-drawer
    :size="828"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div v-if="visibleDialog" class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <!-- <el-tabs v-model="activeName" class="w-100p mytabs">
          <el-tab-pane label="班期详情" name="scheduleDetails" style="margin-left: 20px" />
          <el-tab-pane label="学员记录" name="studentRecord" />
        </el-tabs> -->
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
        <component
          :is="activeName"
          :perms-list="permsList"
          :current="current"
          :schedule-id="scheduleId"
          :goods-id="goodsId"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import scheduleDetails from './scheduleDetails'
import studentList from './studentList'
import studentRecord from './studentRecord'
import { mapGetters } from 'vuex'
export default {
  components: {
    scheduleDetails,
    studentRecord,
    studentList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    scheduleId: {
      type: [Number, String],
      default: ''
    },
    goodsId: {
      type: [Number, String],
      default: ''
    },
    current: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeName: 'scheduleDetails',
      tabs: [
        { label: '班期详情', value: 'scheduleDetails', isShow: false },
        { label: '学员列表', value: 'studentList', isShow: false },
        { label: '学员出入班记录', value: 'studentRecord', isShow: false }
      ],
      permsList: []
    }
  },
  computed: {
    ...mapGetters(['permission_routes']),
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visibleDialog(val) {
      val && this.init()
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    init() {
      this.permission_routes.forEach(i => {
        if (i.children && i.children.length) {
          i.children.forEach(j => {
            if (j.path === 'scheduleManagement') {
              this.permsList = []
              const data = j.children.find(x => x.name === 'studentList')
              if (data) {
                this.permsList = data.meta.permsList
              }
              const childPaths = j.children.map(item => item.path)
              this.tabs.forEach(z => {
                if (childPaths.includes(z.value)) {
                  z.isShow = true
                }
              })
              const showRoutes = this.tabs.filter(z => z.isShow)
              this.activeName = (showRoutes.length && showRoutes[0].value) || ''
            }
          })
        }
      })
    },
    // 点击关闭
    close() {
      this.$emit('update:visible', false)
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
