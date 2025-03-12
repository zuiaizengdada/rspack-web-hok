<template>
  <div v-loading="pageLoading" class="home-page">
    <div class="home-head">
      <div class="home-head-left">
        <span class="title">快捷菜单</span>
        <span class="add" @click="openShortcutMenus('add')">
          <i class="icon-add" />新增
        </span>
        <div v-if="addHokCache" class="desc desc-add">
          <div class="desc-tlt">自定义快捷菜单模块</div>
          <p class="txt">
            根据个人需要，可自定义模块名称，以及模块包含的快捷菜单入口。
          </p>
          <div class="poper" />
          <i class="el-icon-close close" @click="closeCache('addHokCache')" />
        </div>
      </div>
      <div v-if="topRouter.length" class="home-btn">
        <div @click="openchooseMenuDialog('home')">
          <img class="home-img" src="@/assets/image/homeset.png" /> 自定义首页
        </div>
        <div v-if="homeHokCache" class="desc desc-home">
          <div class="desc-tlt">自定义首页</div>
          <p class="txt">可将指定菜单页面，设置为登录后的默认页面</p>
          <div class="poper" />
          <i class="el-icon-close close" @click="closeCache('homeHokCache')" />
        </div>
      </div>
    </div>
    <div v-if="categoryMenus.length">
      <template v-for="(item, index) in categoryMenus">
        <div v-if="item.list.length" :key="item.id" class="homegroup">
          <HomeGroup :index="index" :info="item" @moreClick="moreClick" />
        </div>
      </template>
    </div>

    <!-- <div v-if="recommendList.length" class="inlet">
      <div class="inlet-title-box">
        <p class="inlet-title">快捷入口</p>
        <p class="inlet-sub">
          <i class="icon-home-shortcut" />
          <span @click="openchooseMenuDialog('shortcut')">自定义快捷入口</span>
        </p>
      </div>

      <div
        ref="scrollContainer"
        class="scroll-container"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseUp"
      >
        <div ref="scrollContent" class="scroll-content inlet-item">
          <div
            v-for="item in recommendList"
            :key="item.menuId"
            @click.stop="gotoPage(item)"
          >
            <img :src="item.icon || defaultBigIcon" />
            <p>{{ item.meta.title }}</p>
          </div>
        </div>
      </div>
      <div class="inlet-shadow" />
      <el-button
        class="inlet-btn"
        icon="el-icon-arrow-right"
        @click="scrollLeft"
      />
    </div> -->
    <ChooseMenu
      v-if="chooseMenuDialogVisible"
      :visible.sync="chooseMenuDialogVisible"
      :type="chooseType"
      :shortcut-menu-ids="menuIds"
    />
    <!-- 快捷菜单 -->
    <ChooseCheckMenu
      v-if="chooseCheckMenuDialogVisible"
      :visible.sync="chooseCheckMenuDialogVisible"
      :info="ChooseCheckInfo"
    />
  </div>
</template>
<script>
import { setItem, getItem } from '@/utils/localStorage'
import { mapGetters } from 'vuex'
import ChooseMenu from './cpns/chooseDialog.vue'
import ChooseCheckMenu from './cpns/chooseCheckDialog.vue'
import HomeGroup from './cpns/homeGroup.vue'

import {
  // listSysShortcutMenus,
  // userSysShortcutMenus,
  userSysShortcutCategoryMenusApi,
  topUserSysShortcutMenuCategoryApi,
  delUserSysShortcutMenuCategoryApi
} from '@/api/home'
import { filterAsyncRouter } from '@/store/modules/permission'
import { getThirdLevelItemsWithPathsObj } from '@/utils/common'
export default {
  components: {
    ChooseMenu,
    HomeGroup,
    ChooseCheckMenu
  },
  data() {
    return {
      categoryMenus: [],
      pageLoading: false,
      threeMenuTansforTwo: {}, // 设置所有的三级菜单映射一级及二级
      isDragging: false,
      lastX: 0,
      scrollContainer: null,
      scrollContent: null,
      chooseMenuDialogVisible: false,
      chooseCheckMenuDialogVisible: false,
      ChooseCheckInfo: {},
      recommendList: [],
      height: '494px',
      chooseType: 'home',
      menuIds: [],
      defaultBigIcon:
        'https://oss.hokkj.cn/hok_liveRoom/img/fccmf583scg000081.png',
      addHokCache: false,
      homeHokCache: false
    }
  },
  computed: {
    ...mapGetters(['topRouter', 'permission_routes', 'permission_pathList'])
  },
  watch: {
    chooseCheckMenuDialogVisible: {
      handler(val) {
        if (!val) {
          this.userSysShortcutCategoryMenus()
        }
      }
    }
  },
  async mounted() {
    this.threeMenuTansforTwo = getThirdLevelItemsWithPathsObj(this.topRouter)
    await this.init()
  },
  methods: {
    async init() {
      // this.scrollContainer = this.$refs.scrollContainer
      // this.scrollContent = this.$refs.scrollContent
      const caches = ['addHokCache', 'homeHokCache']
      caches.forEach(key => {
        this[key] = !getItem(key)
      })
      await this.userSysShortcutCategoryMenus()
    },
    closeCache(key) {
      this[key] = false
      setItem(key, { status: true })
    },
    // 查询用户的分类快捷菜单
    async userSysShortcutCategoryMenus() {
      this.pageLoading = true
      try {
        const { data } = await userSysShortcutCategoryMenusApi()
        const newDate = data.map(m => {
          return {
            ...m,
            list: this.idsTransforList(m.menuIds)
          }
        })
        this.categoryMenus = newDate || []
      } catch (error) {
        this.categoryMenus = []
        console.log('error--userSysShortcutCategoryMenus', error)
      }
      this.pageLoading = false
    },
    idsTransforList(ids) {
      const obj = {}
      ids.forEach(id => {
        const cur = this.threeMenuTansforTwo[id]
        if (cur) {
          const arr = obj[cur.firstName]
          if (arr) {
            arr.push(cur)
          } else {
            obj[cur.firstName] = [cur]
          }
        }
      })
      const transferList = []
      Object.keys(obj).forEach((key, index) => {
        transferList.push({
          refKey: String(Math.floor(Math.random() * 1000000)),
          title: key,
          orderNum: obj[key][0].orderNum,
          firstOrderNum: obj[key][0].firstOrderNum,
          list: obj[key]
        })
      })
      transferList.sort((a, b) => {
        if (a.firstOrderNum !== b.firstOrderNum) {
          return a.firstOrderNum - b.firstOrderNum
        } else {
          return a.orderNum - b.orderNum
        }
      })
      return transferList
    },
    // 打开 新增/修改分类快捷菜单
    openShortcutMenus(type, req) {
      this.chooseCheckMenuDialogVisible = true
      this.ChooseCheckInfo = type === 'add' ? {} : req
    },
    // 操作
    moreClick(type, index) {
      switch (type) {
        case 'edit':
          this.openShortcutMenus('edit', this.categoryMenus[index])
          break
        case 'topping':
          this.topUserSysShortcutMenuCategory(true, index)
          break
        case 'untopping':
          this.topUserSysShortcutMenuCategory(false, index)
          break
        case 'delete':
          this.$confirm(
            `确认删除吗？删除后，该模块的所有配置不可恢复！`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            this.delUserSysShortcutMenuCategory(index)
          })
          break
        default:
          break
      }
    },

    // 设置/取消置顶
    async topUserSysShortcutMenuCategory(flag, index) {
      this.pageLoading = true
      const cur = this.categoryMenus[index]
      try {
        const { code } = await topUserSysShortcutMenuCategoryApi({
          categoryId: cur.id,
          oldCategoryName: cur.categoryName || ''
        })
        if (code === 1) {
          this.userSysShortcutCategoryMenus()
        } else {
          this.pageLoading = false
        }
      } catch (error) {
        this.pageLoading = false
        console.log('err---topUserSysShortcutMenuCategory', error)
      }
    },
    // 删除快捷分类
    async delUserSysShortcutMenuCategory(index) {
      this.pageLoading = true
      const cur = this.categoryMenus[index]
      try {
        const { code } = await delUserSysShortcutMenuCategoryApi({
          categoryId: cur.id,
          oldCategoryName: cur.categoryName || ''
        })
        if (code === 1) {
          this.userSysShortcutCategoryMenus()
        } else {
          this.pageLoading = false
        }
      } catch (error) {
        this.pageLoading = false
        console.log('err---topUserSysShortcutMenuCategory', error)
      }
    },

    // async getSysShortcutMenus() {
    //   // 没有自定义的快捷入口 使用默认的
    //   try {
    //     const { data } = await userSysShortcutMenus({ type: 1 })
    //     if (data.length) {
    //       this.recommendList = data
    //         .map(i => {
    //           const item = this.flattenItems(this.topRouter, i.menuId, null)
    //           if (item.length) {
    //             const current = this.permission_pathList.find(
    //               i => i.id === item[0].id
    //             )
    //             return {
    //               ...i,
    //               topParentId: item[0].topParentId,
    //               topParentPath: item[0].topParentPath,
    //               meta: item[0].meta,
    //               path: current ? current.path : '',
    //               hidden: item[0].hidden
    //             }
    //           } else {
    //             return i
    //           }
    //         })
    //         .filter(i => !i.hidden && i.meta)
    //       this.menuIds = data.reduce((t, v) => [...t, v.menuId], [])
    //       console.log('this.menuIds --------', this.menuIds)
    //     } else {
    //       this.menuIds = []
    //       this.getShortcutMenus()
    //     }
    //   } catch (error) {
    //     console.log('getShortcutMenus---err', error)
    //     this.getShortcutMenus()
    //   }
    // },
    // // 默认推荐菜单
    // async getShortcutMenus() {
    //   const res = await listSysShortcutMenus()
    //   this.recommendList = res.data
    //     .map(i => {
    //       const item = this.flattenItems(this.topRouter, i.menuId, null)
    //       if (item.length) {
    //         const current = this.permission_pathList.find(
    //           i => i.id === item[0].id
    //         )
    //         return {
    //           ...i,
    //           topParentId: item[0].topParentId,
    //           topParentPath: item[0].topParentPath,
    //           meta: item[0].meta,
    //           path: current ? current.path : '',
    //           hidden: item[0].hidden
    //         }
    //       } else {
    //         return i
    //       }
    //     })
    //     .filter(i => !i.hidden && i.meta)
    // },
    flattenItems(items, id, parentId, parentPath) {
      return items.flatMap(i => {
        if (i.id === id) {
          i.topParentId = parentId
          i.topParentPath = parentPath
          return i
        }
        if (!i.children) {
          return []
        }
        return this.flattenItems(
          i.children,
          id,
          parentId || i.id,
          parentPath || i.path
        )
      })
    },
    async gotoPage(item) {
      const changeRouter = this.topRouter.find(i => i.id === item.topParentId)
      const sidebarRoutes = filterAsyncRouter(changeRouter.children)
      this.$store.commit('permission/SET_TOP_HEADER_PATH', item.topParentPath)
      await this.$store.dispatch('permission/SetSidebarRouters', sidebarRoutes)
      if (item.path) {
        this.$router.push({ path: item.path, meta: item.meta })
      } else {
        this.$message.warning('该菜单未配置路由')
      }
    },
    // handleMouseDown(event) {
    //   this.isDragging = true
    //   this.lastX = event.clientX
    // },
    // handleMouseUp() {
    //   this.isDragging = false
    // },
    // handleMouseMove(event) {
    //   if (!this.scrollContainer) {
    //     this.scrollContainer = this.$refs.scrollContainer
    //   }
    //   if (this.isDragging) {
    //     const deltaX = event.clientX - this.lastX
    //     this.scrollContainer.scrollLeft -= deltaX
    //     this.lastX = event.clientX
    //   }
    // },
    // scrollLeft() {
    //   if (!this.scrollContainer) {
    //     this.scrollContainer = this.$refs.scrollContainer
    //   }
    //   let left = this.scrollContainer.scrollLeft
    //   if (
    //     this.scrollContainer.scrollWidth - this.scrollContainer.offsetWidth >
    //     this.scrollContainer.scrollLeft
    //   ) {
    //     // 调整滚动量
    //     left = left + 224
    //   } else {
    //     left = 0 // 调整滚动量
    //   }
    //   this.scrollContainer.scroll({
    //     left: left,
    //     behavior: 'smooth'
    //   })
    // },
    // 打开选择菜单
    openchooseMenuDialog(type) {
      this.chooseType = type
      this.chooseMenuDialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.home-page {
  @include responsive-height(20px);
}
.inlet {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px 24px 32px 24px;
  margin-top: 20px;
  position: relative;
  .inlet-shadow {
    position: absolute;
    right: 0;
    top: 0;
    // width: 87px;
    width: 40px;
    height: 206px;
    background: linear-gradient(
      150deg,
      rgba(255, 255, 255, 0) 0%,
      #ffffff 100%
    );
    border-radius: 0px 8px 8px 0px;
  }
  .inlet-title {
    font-weight: 600;
    font-size: 20px;
    color: #2c3242;
  }
  .inlet-btn {
    position: absolute;
    top: 28px;
    right: 24px;
    display: block;
    padding: 0;
    width: 21px;
    height: 21px;
    border: 1px solid #bfbfbf;
    border-radius: 50%;
    z-index: 1;
  }
  .inlet-title-box {
    display: inline-flex;
    align-items: center;
    .inlet-sub {
      color: #2c3242;
      font-size: 16px;
      font-weight: 600;
      line-height: 17px;
      height: 17px;
      position: relative;
      display: flex;
      align-items: center;
      padding-left: 16px;
      margin-left: 14px;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 17px;
        width: 2px;
        background: #cccccc;
      }
      .icon-home-shortcut {
        display: inline-block;
        height: 17px;
        width: 17px;
        background: url('~@/assets/image/icon/icon_home_shortcut.png') no-repeat;
        background-size: 100%;
        margin-right: 10px;
      }
      span {
        cursor: pointer;
      }
    }
  }

  .inlet-item {
    display: flex;
    flex-direction: row;

    > div {
      flex: 0 0 76px;
      margin-right: 36px;
      text-align: center;
      .inlet-icon {
        width: 76px;
        height: 76px;
        border-radius: 10px;
        line-height: 76px;
        font-size: 28px;
      }
      img {
        margin: 0 auto;
        width: 76px;
        height: 76px;
        border-radius: 10px;
      }

      p {
        font-size: 14px;
        color: #2c3242;
        margin: 10px 0;
      }
    }
  }
}

.scroll-container {
  overflow-x: auto;
  white-space: nowrap;
  cursor: grab;
  margin-top: 40px;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: #fff;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #fff;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }
  .scroll-content {
    display: inline-block;
  }
}

.home-head {
  height: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  &-left {
    display: flex;
    align-items: center;
    position: relative;
    span.title {
      font-size: 20px;
      font-weight: 600;
      text-align: left;
      line-height: 28px;
      position: relative;
      padding-right: 19px;
      &::before {
        content: '';
        position: absolute;
        right: 10px;
        top: 49%;
        transform: translateY(-50%);
        width: 1px;
        height: 22px;
        background: #d8d8d8;
      }
    }
    span.add {
      height: 24px;
      line-height: 24px;
      background: #0c6fff;
      padding: 0 12px;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #fff;
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      .icon-add {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url('~@/assets/image/home/home_add.png') no-repeat 100%/100%;
        margin-right: 6px;
      }
    }
  }

  .home-btn {
    font-weight: 600;
    font-size: 16px;
    color: #3d3d3d;
    cursor: pointer;
    display: inline-block;
    z-index: 999;
    position: relative;

    .home-img {
      width: 28px;
      height: 28px;
      display: inline-block;
      vertical-align: -8px;
    }
  }
}
.homegroup {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.desc {
  position: absolute;

  padding: 8px 14px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  margin-left: 15px;
  z-index: 999;
  &.desc-add {
    right: -286px;
    width: 271px;
    .poper {
      position: absolute;
      left: -3px;
      top: 42%;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
      &::before {
        content: ' ';
        position: absolute;
        border: 6px solid transparent;
        top: 0;
        left: -3px;
        border-left-width: 0;
        border-right-color: #fff;
      }
    }
  }
  &.desc-home {
    left: -300px;
    top: 50%;
    transform: translateY(-50%);
    width: 271px;
    .poper {
      position: absolute;
      right: -3px;
      top: 42%;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
      &::before {
        content: ' ';
        position: absolute;
        border: 6px solid transparent;
        right: 0;
        left: -3px;
        border-right-width: 0;
        border-left-color: #fff;
      }
    }
  }
  .desc-tlt {
    color: #0c6fff;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .txt {
    color: #777777;
    font-size: 12px;
    font-weight: 400;
  }

  .close {
    position: absolute;
    right: 18px;
    top: 8px;
    cursor: pointer;
    &:hover {
      color: #0c6fff;
    }
  }
}
</style>
