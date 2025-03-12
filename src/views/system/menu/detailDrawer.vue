<template>
  <!-- 学员详情弹框 -->
  <el-drawer
    :size="728"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div v-if="visible" v-loading="loading" class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">菜单详情</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent overflowOuto">
        <div class="detailForm">
          <div class="detailFormView">
            <div class="detailFormLabel">菜单类型：</div>
            <div class="detailFormValue">
              {{ { M: '目录', C: '菜单', F: '按钮' }[detailForm.menuType] }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">菜单标题：</div>
            <div class="detailFormValue">{{ detailForm.menuName }}</div>
          </div>
          <div
            v-if="['C', 'F'].includes(detailForm.menuType)"
            class="detailFormView"
          >
            <div class="detailFormLabel">权限标识：</div>
            <div class="detailFormValue">{{ detailForm.perms }}</div>
          </div>
          <div
            v-if="['M', 'C'].includes(detailForm.menuType)"
            class="detailFormView"
          >
            <div class="detailFormLabel">路由地址：</div>
            <div class="detailFormValue">{{ detailForm.path }}</div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">菜单排序：</div>
            <div class="detailFormValue">{{ detailForm.orderNum }}</div>
          </div>
          <div
            v-if="['C'].includes(detailForm.menuType)"
            class="detailFormView"
          >
            <div class="detailFormLabel">组件名称：</div>
            <div class="detailFormValue">{{ detailForm.routerName }}</div>
          </div>
          <div
            v-if="['C'].includes(detailForm.menuType)"
            class="detailFormView"
          >
            <div class="detailFormLabel">组件路径：</div>
            <div class="detailFormValue">{{ detailForm.component }}</div>
          </div>
          <div
            v-if="['C'].includes(detailForm.menuType)"
            class="detailFormView"
          >
            <div class="detailFormLabel">重定向：</div>
            <div class="detailFormValue">{{ detailForm.redirect }}</div>
          </div>
          <div
            v-if="['C'].includes(detailForm.menuType)"
            class="detailFormView"
          >
            <div class="detailFormLabel">活动菜单：</div>
            <div class="detailFormValue">{{ detailForm.activeMenu }}</div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">上级类目：</div>
            <div class="detailFormValue">{{ parentName }}</div>
          </div>
          <div
            v-if="['M', 'C'].includes(detailForm.menuType)"
            class="detailFormView"
          >
            <div class="detailFormLabel">外链菜单：</div>
            <div class="detailFormValue">
              {{ { 1: '否', 0: '是' }[detailForm.isFrame] }}
            </div>
          </div>
          <div
            v-if="['C'].includes(detailForm.menuType)"
            class="detailFormView"
          >
            <div class="detailFormLabel">菜单缓存：</div>
            <div class="detailFormValue">
              {{ { 1: '否', 0: '是' }[detailForm.isCache] }}
            </div>
          </div>
          <div
            v-if="['M', 'C'].includes(detailForm.menuType)"
            class="detailFormView"
          >
            <div class="detailFormLabel">菜单可见：</div>
            <div class="detailFormValue">
              {{ { 1: '否', 0: '是' }[detailForm.visible] }}
            </div>
          </div>
        </div>
        <div v-if="!loading" class="tabView">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-if="jgFlag" label="机构列表" name="jgList" />
            <el-tab-pane v-if="roleFlag" label="使用角色列表" name="roleList" />
            <el-tab-pane v-if="userFlag" label="使用用户列表" name="userList" />
          </el-tabs>
          <components :is="activeName" :menu-id="detailForm.menuId" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import roleList from './roleList.vue'
import userList from './userList.vue'
import jgList from './jgList.vue'
export default {
  components: {
    roleList,
    userList,
    jgList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    jgFlag: {
      type: Boolean,
      default: true
    },
    userFlag: {
      type: Boolean,
      default: false
    },
    roleFlag: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    menus: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      detailForm: {
        id: null,
        menuName: null, // 菜单标题
        orderNum: null, // 排序
        path: null, // 路由地址
        component: null, // 组件路径
        routerName: null, // 组件名称
        isFrame: null, // 外链菜单
        parentId: null, // 上级类目
        icon: null, // 图标
        isCache: null, // 菜单缓存
        visible: null, // 菜单可见
        menuType: null, // 菜单类型
        perms: null, // 权限标识
        activeMenu: null // 活动菜单
      },
      show: true,
      activeName: 'jgList'
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    parentName() {
      console.log(this.detailForm.parentId, 'this.detailForm.parentId')
      return this.getTreeIds(this.menus, this.detailForm.parentId)
        ? this.getTreeIds(this.menus, this.detailForm.parentId).label
        : ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.jgFlag === true) {
          this.activeName = 'jgList'
        } else if (this.roleFlag === true) {
          this.activeName = 'roleList'
        } else if (this.userFlag === true) {
          this.activeName = 'userList'
        }
        this.detailForm = this.row
      }
    }
  },
  methods: {
    // 点击关闭
    close() {
      this.$emit('update:visible', false)
    },
    // tab栏切换
    handleClick() {},
    // 树形数据获取id
    getTreeIds(tree, nodeId, config) {
      const { children = 'children', id = 'id' } = config || {}
      const toFlatArray = (tree, parentId) => {
        return tree.reduce((t, _) => {
          const child = _[children]
          return [
            ...t,
            parentId ? { ..._, parentId } : _,
            ...(child && child.length ? toFlatArray(child, _[id]) : [])
          ]
        }, [])
      }
      const getIds = flatArray => {
        const child = flatArray.find(_ => _[id] === nodeId)
        return child
      }
      return getIds(toFlatArray(tree))
    }
  }
}
</script>

<style lang="scss" scoped>
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #ffffff;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
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
    .detailForm {
      margin: 20px 20px 0 20px;
      padding: 20px;
      background: #f2f9ff;
      border-radius: 8px;
      display: flex;
      flex-wrap: wrap;
      .detailFormView {
        flex: 50% 0 0;
        display: flex;
        margin-bottom: 16px;
        // align-items: center;
      }
      .detailFormLabel {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 24px;
        width: 80px;
        max-width: 80px;
        min-width: 80px;
        text-align: right;
      }
      .detailFormValue {
        padding-top: 2px;
        flex: 1 0 0;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 22px;
        word-break: break-all;
        white-space: pre-wrap;
      }
      .detailFormRemake {
        width: 100%;
        display: flex;
        .detailFormValue {
          flex: 1 0 0;
          display: flex;
          .text {
            font-size: 14px;
            &::before {
              content: '';
              float: right;
              width: 0;
              height: 100%;
              margin-bottom: -19px;
            }
          }
          .jyfwbtn {
            float: right;
            clear: both;
            cursor: pointer;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #0c6fff;
            line-height: 16px;
          }
          .showMore {
            /* 设置多行文本溢出省略 */
            display: -webkit-box;
            /* 默认最多显示3行 */
            -webkit-line-clamp: 3;
            overflow: hidden;
            -webkit-box-orient: vertical;
            font-size: 14px;
            &::before {
              content: '';
              float: right;
              width: 0;
              height: 100%;
              margin-bottom: -19px;
            }
          }
        }
      }
    }
    .tabView {
      margin-top: 28px;
      margin-bottom: 26px;
      padding: 0 20px;
    }
  }
}
.btn_close {
  transform: rotate(180deg);
}
::v-deep {
  .el-tabs__item {
    font-size: 16px;
    color: #777;
  }
  .el-tabs__item.is-top.is-active {
    color: #0c6fff;
  }
}
</style>
