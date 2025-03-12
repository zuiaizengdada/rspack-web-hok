<template>
  <el-dialog
    v-loading="loading"
    title="选择"
    :visible.sync="getDialogVisible"
    width="880px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" label-width="70px">
      <el-form-item label="模板名称" prop="name" style="margin-bottom: 10px">
        <el-input
          v-model.trim="form.name"
          placeholder="请输入模板名称"
          size="small"
          style="width: 30%; margin-right: 10px"
          clearable
        />
        <el-button plain type="primary" size="small" @click="getTemplateList()">
          查询
        </el-button>
      </el-form-item>
    </el-form>

    <div id="listPresetTemplateListId" class="list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="cols"
        :style="{
          'margin-right': (index + 1) % 6 == 0 ? '0' : '25px'
        }"
      >
        <div
          :class="{ item: true, 'item-checked': item.checked }"
          :style="{
            'background-image': 'url(' + item.coverUrl + ')'
          }"
          @click="itemClick(item)"
        >
          <img v-if="item.checked" :src="iconPanel" class="iconPanel" />
          <div class="bottom_btn">
            <span @click.stop="delItem(item)">删除</span>
          </div>
        </div>

        <div
          class="title"
          :style="{ 'margin-top': item.editTitle ? '4px' : '10px' }"
        >
          <template v-if="!item.editTitle">
            <span>{{ item.name }}</span>
            <img
              src="@/assets/image/aigc/digitalVideoManage/edittt.png"
              alt=""
              @click="item.editTitle = true"
            />
          </template>
          <template v-else>
            <div class="edit-title">
              <el-input v-model="item.name" maxlength="20" size="mini" />
              <el-button type="primary" size="mini" @click="updateName(item)">
                保存
              </el-button>
            </div>
          </template>
        </div>
      </div>
      <div class="flex flex-center" style="width: 100%">
        <el-empty
          v-if="!list.length || list.length < 1"
          description="暂无数据"
        />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        :loading="btnLoading"
        @click="submit(1)"
      >
        确 定
      </el-button>
      <el-button
        plain
        type="primary"
        :loading="btnLoading"
        @click="submit(2)"
      >
        下一步
      </el-button>
      <el-button :loading="btnLoading" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import iconPanel from '@/assets/svg/panel/aiselect_icon.svg'
import {
  getPresetTemplateList,
  updatePresetTemplate,
  delPresetTemplate,
  checkPresetTemplate
} from '@/api/aiVideoManage'
export default {
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      iconPanel,
      form: {
        name: ''
      },
      list: [],
      loading: false,
      btnLoading: false,
      pageIndex: 1,
      pageSize: 20,
      total: 0
    }
  },
  computed: {
    getDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.pageIndex = 1
        this.getTemplateList()
        this.$nextTick(() => {
          const el = document.getElementById('listPresetTemplateListId')
          el.addEventListener('scroll', this.handleScroll)
        })
      }
    }
  },
  methods: {
    updateName(item) {
      if (!item.name) {
        this.$message.warning('请输入模板名称')
        return
      }
      if (item.name.length < 2) {
        this.$message.warning('最少不能少于2个字符')
        return
      }
      updatePresetTemplate({ id: item.id, name: item.name }).then(() => {
        this.$message.success('修改成功')
        item.editTitle = false
      })
    },
    getTemplateList(isInit = true) {
      this.loading = true
      getPresetTemplateList({
        name: this.form.name,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
        .then(res => {
          this.loading = false
          this.total = res.data.total
          if (res.data.items.length === 0) {
            this.pageIndex = isInit ? 1 : this.pageIndex - 1
          }
          if (isInit) {
            this.list = res.data.items.map(m => ({
              ...m,
              checked: false,
              editTitle: false
            }))
          } else {
            const ls = res.data.items.map(m => ({
              ...m,
              checked: false,
              editTitle: false
            }))
            this.list.push(...ls)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    delItem(item) {
      this.$confirm('是否删除该模板？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('del', item.id)
        delPresetTemplate({ id: item.id }).then(() => {
          this.$message.success('删除成功')
          this.getTemplateList()
        })
      })
    },
    handleScroll(e) {
      // 滚动条触底
      if (
        e.target.scrollHeight - e.target.scrollTop ===
        e.target.clientHeight
      ) {
        this.pageIndex++
        this.getTemplateList(false)
      }
    },
    itemClick(item) {
      item.checked = true
      this.list.forEach(i => {
        if (i.id !== item.id) {
          i.checked = false
        }
      })
    },
    submit(val) {
      const item = this.list.find(i => i.checked)
      if (!item) {
        this.$message.warning('请选择模板')
        return
      }
      this.btnLoading = true
      checkPresetTemplate({ ...item }).then(() => {
        this.btnLoading = false
        this.$emit('submit', { ...item, nextType: val })
        this.handleClose()
      }).catch(() => {
        this.btnLoading = false
      })
    },
    handleClose() {
      this.$emit('change', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  height: 508px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d8d8;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }
  .cols {
    width: 118px;
    margin-bottom: 16px;

    .item {
      width: 100%;
      height: 209px;
      border-radius: 6px;
      border: 1px solid #fff;
      position: relative;
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: flex;
      align-items: flex-end;
      .bottom_btn {
        display: none;
        width: 100%;
        height: 25px;
        border-radius: 0 0 6px 6px;
        border: 1px solid #979797;
        background: rgba(64, 64, 64, 0.6);
        align-items: center;
        justify-content: center;
        color: #ffffff;
        cursor: pointer;
        user-select: none;
      }
      &:hover {
        .bottom_btn {
          display: flex;
        }
      }
      .iconPanel {
        position: absolute;
        right: 0;
        top: 0;
        width: 16px;
        height: 16px;
        font-size: 16px;
        z-index: 2;
      }
    }
    .item-checked {
      border: 1px solid #0c6fff;
    }
    .title {
      width: 100%;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #666666;
      .edit-title {
        display: flex;
        align-items: center;

        button {
          width: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
          span {
            font-size: 12px;
          }
        }
      }
      span {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      img {
        cursor: pointer;
        width: 14px;
        height: 14px;
      }
    }
  }
}
::v-deep {
  .el-dialog__header {
    border-bottom: 1px solid #e6e6e7;
    .el-dialog__title {
      font-size: 16px;
    }
  }
  .el-dialog__body {
    padding-top: 15px !important;
  }
  .edit-title {
    .el-input {
      .el-input__inner {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        border: 1px solid #c2c6ce;
        border-right: none;
        padding: 0 4px;
      }
    }
  }
}
</style>
