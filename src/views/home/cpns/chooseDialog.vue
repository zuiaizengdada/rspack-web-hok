<template>
  <el-dialog
    :title="info[type].title"
    :visible.sync="dialogVisible"
    width="fit-content"
  >
    <div
      ref="carouselRef"
      :class="['box', topRouter.length > 4 ? 'exceed' : '']"
    >
      <div
        ref="boxCntRef"
        class="flex box-cnt"
        :style="{ transform: `translateX(-${curLeft}px)` }"
      >
        <div v-for="(item, index) in topRouter" :key="index" class="box-item">
          <div class="title">{{ item.meta.title }}</div>
          <div class="content">
            <el-menu :default-active="defaultActive">
              <div v-for="i in item.children" :key="i.id">
                <el-submenu
                  v-if="!i.hidden"
                  :index="getMenuIndex(i.id)"
                  :popper-append-to-body="true"
                >
                  <template slot="title">
                    <span>{{ i.meta.title }}</span>
                  </template>
                  <template v-if="type === 'home'">
                    <el-radio-group v-model="menuId">
                      <template v-for="menu in i.children">
                        <div v-if="menu.hidden !== true" :key="menu.id">
                          <el-menu-item :index="getMenuIndex(menu.id)">
                            <template v-if="!menu.children || !menu.alwaysShow">
                              <el-radio :label="menu.id">{{
                                menu.meta.title
                              }}</el-radio>
                            </template>
                            <div v-else>
                              <el-submenu
                                :index="getMenuIndex(menu.id)"
                                :popper-append-to-body="true"
                              >
                                <template slot="title">
                                  <span>{{ menu.meta.title }}</span>
                                </template>
                              </el-submenu>
                            </div>
                          </el-menu-item>
                        </div>
                      </template>
                    </el-radio-group>
                  </template>
                  <template v-else-if="type === 'shortcut'">
                    <el-checkbox-group v-model="menuIds" @change="checkChange">
                      <div v-for="menu in i.children" :key="menu.id">
                        <el-menu-item :index="getMenuIndex(menu.id)">
                          <template v-if="!menu.children || !menu.alwaysShow">
                            <el-checkbox :label="menu.id">{{
                              menu.meta.title
                            }}</el-checkbox>
                          </template>
                          <div v-else>
                            <el-submenu
                              :index="getMenuIndex(menu.id)"
                              :popper-append-to-body="true"
                            >
                              <template slot="title">
                                <span>{{ menu.meta.title }}</span>
                              </template>
                            </el-submenu>
                          </div>
                        </el-menu-item>
                      </div>
                    </el-checkbox-group>
                  </template>
                </el-submenu>
              </div>
            </el-menu>
          </div>
        </div>
      </div>
    </div>
    <div v-if="topRouter.length > 4" class="carousel">
      <i
        :class="['carousel-arrow', 'el-icon-arrow-left']"
        @click="carouselFn(-1)"
      />
      <i
        :class="['carousel-arrow', 'el-icon-arrow-right']"
        @click="carouselFn(1)"
      />
    </div>
    <div v-if="curLeft > 0" class="shadow-left" />
    <div v-if="curLeft < maxWidth - 20" class="shadow-right" />
    <span slot="footer" class="dialog-footer flex justify-between align-center">
      <div>
        <el-radio v-model="menuId" :label="0" @input="radioChange">
          {{ info[type].desc }}
        </el-radio>
      </div>
      <div>
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">
          确 定
        </el-button>
      </div>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { addUserSysShortcutMenusApi } from '@/api/home'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // type  shortcut => 自定义快捷入口。 home => 自定义首页
    type: {
      type: String,
      default: 'home'
    },
    shortcutMenuIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultActive: '',
      menuId: '',
      menuIds: [],
      info: {
        home: { title: '自定义首页菜单项（单选）', desc: '系统默认首页' },
        shortcut: {
          title: '自定义首页快捷入口（多选）',
          desc: '系统默认快捷入口'
        }
      },
      curLeft: 0,
      maxWidth: 0
    }
  },
  computed: {
    ...mapGetters(['topRouter', 'userMenuId']),
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  async mounted() {
    if (this.type === 'home') {
      this.defaultActive = `menu-${this.userMenuId}`
      this.menuId = this.userMenuId || 0
    } else if (this.type === 'shortcut') {
      this.shortcutMenuIds.forEach(id => {
        setTimeout(() => {
          this.defaultActive = `menu-${id}`
        }, 100)
      })
      this.menuIds = JSON.parse(JSON.stringify(this.shortcutMenuIds))
      if (this.menuIds.length === 0) this.menuId = 0
    }
    this.maxWidth = (this.topRouter.length - 4) * 270
  },
  methods: {
    async handleSubmit() {
      let data = {}
      if (this.type === 'home') {
        data = { menuIds: [this.menuId], type: 0 }
      } else {
        data = { menuIds: this.menuIds, type: 1 }
      }
      await addUserSysShortcutMenusApi(data)
      this.$message.success('添加成功')
      this.$store.commit('user/SET_USERMENUID', this.menuId)
      this.dialogVisible = false
    },
    handleClose() {
      this.dialogVisible = false
    },
    getMenuIndex(id) {
      return `menu-${id}`
    },
    radioChange() {
      if (this.type === 'home') return
      this.menuIds = []
    },
    checkChange() {
      if (this.type === 'home') return
      this.menuId = null
    },
    carouselFn(num) {
      if (
        (this.curLeft === 0 && num === -1) ||
        (this.curLeft >= this.maxWidth - 20 && num === 1)
      ) {
        return
      }
      const sum = this.curLeft + num * 256
      if (sum > this.maxWidth) {
        this.curLeft = this.maxWidth - 20
      } else if (sum < 256) {
        this.curLeft = 0
      } else {
        this.curLeft = sum
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  height: 72px;
  border-bottom: 1px solid #dedede;
  border-radius: 10px 10px 0 0;
  background-image: url('../../../assets/image/choosemenu-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

::v-deep .el-dialog__title {
  font-weight: 600;
  font-size: 18px;
  color: #333333;
}

::v-deep .el-dialog__body {
  padding: 0;
  background-image: url('../../../assets/image/choosemenu-bg1.png');
  background-repeat: no-repeat;
  background-size: 100%;
  position: relative;
}

::v-deep .el-menu {
  border-right: none;
}

::v-deep .el-submenu__title {
  height: 40px;
  line-height: 40px;
  font-weight: 600;
  font-size: 16px;
  color: #333333;
}

::v-deep .el-menu-item {
  font-size: 16px;
  line-height: 40px;
  height: 40px;
  padding: 0 20px;
}

::v-deep .el-radio-group {
  width: 100%;
}

::v-deep .el-radio {
  line-height: 40px;
}

.box {
  max-width: 1110px;
  overflow: auto;
  padding: 18px 0 18px 20px;
  &.exceed .box-item:last-child {
    margin-right: 18px;
  }
  .box-cnt {
    transition: transform 0.5s ease-out;
  }

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: rgba(216, 216, 216, 1);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: rrgba(216, 216, 216, 0.1);
    transition: all 0.4s ease;
    -moz-transition: all 0.4s ease;
    -webkit-transition: all 0.4s ease;
    -o-transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(216, 216, 216, 0.1);
  }

  .box-item {
    margin-right: 18px;
    /* &:last-child {
      margin-right: 0;
    } */
    .content {
      width: 252px;
      height: 400px;
      overflow-y: auto;
      box-sizing: border-box;
      overflow-x: hidden;
      border: 1px solid #dedede;
      border-radius: 0px 0px 8px 8px;
      background: #fff;
    }

    .title {
      width: 252px;
      height: 55px;
      background: #0c6fff;
      font-weight: 600;
      font-size: 18px;
      color: #ffffff;
      text-align: center;
      line-height: 55px;
      border-radius: 8px 8px 0px 0px;
    }
  }
}

.carousel {
  .carousel-arrow {
    display: inline-block;
    height: 34px;
    width: 34px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: 0.3s;
    background-color: rgba(31, 45, 61, 0.2);
    border-radius: 50%;
    font-size: 14px;
    text-align: center;
    line-height: 34px;
    color: #fff;
    cursor: pointer;
    box-shadow: 1px 2px 4px #ccc;

    &:hover {
      background-color: rgba(31, 45, 61, 0.5);
    }

    &.el-icon-arrow-right {
      right: 10px;
      z-index: 2;
    }
    &.el-icon-arrow-left {
      left: 10px;
      z-index: 2;
    }
  }
}

.shadow-right {
  position: absolute;
  top: 0;
  right: 0;
  display: inline-block;
  height: 100%;
  width: 54px;
  background: linear-gradient(90deg, #ffffff00 0%, #ffffff 100%);
}
.shadow-left {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  height: 100%;
  width: 54px;
  background: linear-gradient(-90deg, #ffffff00 0%, #ffffff 100%);
}
.align-center {
  align-items: center;
}

::v-deep .el-radio {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::v-deep .el-radio__inner {
  border: 1px solid #000000;
}

::v-deep .el-radio__label {
  order: -1;
  margin-right: 5px;
  color: #333;
  /* max-width: 100px; */
  white-space: normal;
  /* line-height: 16px; */
  text-align: left;
}

.dialog-footer {
  ::v-deep .el-radio__label {
    order: inherit;
    padding-left: 5px;
  }
}
</style>
