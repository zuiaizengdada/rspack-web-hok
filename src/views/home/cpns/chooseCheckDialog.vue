<template>
  <el-dialog
    title="新增快捷入口"
    :visible.sync="dialogVisible"
    width="fit-content"
    top="7vh"
  >
    <el-form
      ref="checkMenuRef"
      :model="checkMenuForm"
      status-icon
      :rules="checkMenuRules"
      label-width="100px"
      label-position="top"
      class="check-menu-form"
    >
      <el-form-item label="名称" prop="categoryName" class="category-name">
        <el-input
          v-model="checkMenuForm.categoryName"
          class="category-name-inp"
          placeholder="请输入"
          type="text"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="选择菜单" prop="menuIds" class="menu-ids">
        <div
          ref="carouselRef"
          :class="['box', topRouter.length > 4 ? 'exceed' : '']"
        >
          <div
            ref="boxCntRef"
            class="flex box-cnt"
            :style="{ transform: `translateX(-${curLeft}px)` }"
          >
            <div
              v-for="(item, index) in topRouter"
              :key="index"
              class="box-item"
            >
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
                      <el-checkbox-group v-model="checkMenuForm.menuIds">
                        <template v-for="menu in i.children">
                          <div v-if="menu.hidden !== true" :key="menu.id">
                            <el-menu-item :index="getMenuIndex(menu.id)">
                              <template
                                v-if="!menu.children || !menu.alwaysShow"
                              >
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
                        </template>
                      </el-checkbox-group>
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
      </el-form-item>
    </el-form>
    <div />

    <div slot="footer" class="dialog-footer flex justify-between align-center">
      <div />
      <div>
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">
          确 定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { addUserSysShortcutMenusApi } from '@/api/home'
export default {
  name: 'CheckMenuForm',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      defaultActive: '',
      menuIds: [],
      checkMenuForm: {
        categoryName: '',
        menuIds: [],
        type: 1,
        oldCategoryName: ''
      },
      checkMenuRules: {
        categoryName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        menuIds: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个菜单',
            trigger: 'change'
          }
        ]
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
        this.$refs['checkMenuRef'].resetFields()
        this.$emit('update:visible', val)
      }
    }
  },
  async mounted() {
    if (this.info.categoryName) {
      // 修改需要赋值
      this.checkMenuForm.categoryName = this.info.categoryName
      this.checkMenuForm.oldCategoryName = this.info.categoryName
      const ids = this.info.menuIds || []
      this.checkMenuForm.menuIds = JSON.parse(JSON.stringify(ids))
      ids.forEach(id => {
        setTimeout(() => {
          this.defaultActive = `menu-${id}`
        }, 100)
      })
    }
    this.maxWidth = (this.topRouter.length - 4) * 270
  },
  methods: {
    handleSubmit() {
      this.$refs['checkMenuRef'].validate(async valid => {
        if (valid) {
          const req = JSON.parse(JSON.stringify(this.checkMenuForm))
          if (this.info.id) req.categoryId = this.info.id
          await addUserSysShortcutMenusApi(req)
          this.$message.success('添加成功')
          this.dialogVisible = false
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    getMenuIndex(id) {
      return `menu-${id}`
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
::v-deep .el-dialog {
  .el-dialog__header {
    height: 72px;
    border-bottom: 1px solid #dedede;
    border-radius: 10px 10px 0 0;
    background-image: url('../../../assets/image/choosemenu-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .el-dialog__title {
    font-weight: 600;
    font-size: 18px;
    color: #333333;
  }
  .el-dialog__body {
    padding: 0;
    background-image: url('../../../assets/image/choosemenu-bg1.png');
    background-repeat: no-repeat;
    background-size: 100%;
    position: relative;
  }
  .el-menu {
    border-right: none;
    .el-submenu__title {
      height: 40px;
      line-height: 40px;
      font-weight: 600;
      font-size: 16px;
      color: #333333;
    }
    .el-menu-item {
      font-size: 16px;
      line-height: 40px;
      height: 40px;
      padding: 0 20px;
    }
  }
  .el-radio-group {
    width: 100%;
    .el-radio {
      line-height: 40px;
    }
  }
  .dialog-footer .el-radio__label {
    order: inherit;
    padding-left: 5px;
  }
}
::v-deep .check-menu-form {
  padding-top: 18px;
  .el-form-item__label {
    color: #333333;
    font-size: 16px;
    font-weight: 400;
    margin-right: 12px;
    padding: 0 0 0 20px;
  }
  .category-name {
    display: inline-flex;
    padding-right: 18px;
    .category-name-inp {
      height: 32px;
      width: 464px;
      input {
        height: 32px;
        line-height: 32px;
        width: 464px;
      }
    }
  }
  .el-form-item {
    margin-bottom: 14px;
    &:last-child {
      margin-right: 0px;
    }
  }
  .menu-ids .el-form-item__error {
    padding-left: 20px;
  }
}
.menu-ids {
  .box {
    max-width: 1110px;
    padding: 0 0 0 20px;
    overflow: auto;
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
}
</style>
