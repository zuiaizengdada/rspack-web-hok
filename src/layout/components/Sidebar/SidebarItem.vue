<template>
  <div v-if="!item.hidden" class="sidebarItem">
    <!-- 这里去掉了item.children就不显示三级菜单了 -->
    <template
      v-if="
        hasOneShowingChild([], item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      class="submenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu sub_menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.sidebarItem {
  ::v-deep {
    .router-link-active {
      .is-active,
      li {
        background-color: $subMenuActive !important;
        height: 38px;
        line-height: 38px;
      }
    }
  }
}
//   .aaa{
//   ::v-deep{
//     // height: 58px;
//     .is-active {
//       background-color: #0C6FFF !important;
//       // border-radius: 6px!important;
//       // margin: 0px 8px!important;
//       // height: 38px;
//       // line-height: 38px;
//     }
//   }

::v-deep .sub_menu {
  font-size: 14px;
  font-weight: normal;
  svg {
    display: none;
  }
  span {
    font-size: 14px;
    padding-left: 4px;
    vertical-align: -1px;
  }
}
.el-menu-item {
  height: 38px;
  line-height: 38px;
  /* margin: 4px 8px!important; */
}
/* .el-menu-item:hover {
    border-radius: 6px!important;
  } */

// }
</style>
