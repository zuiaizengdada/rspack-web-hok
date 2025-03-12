<template>
  <el-dialog
    title="课程组分组设置"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="568px"
    append-to-body
    class="dialog-container"
    @close="handleClose"
  >
    <div class="content">
      一个课程组块，可以有多个课程分组，比如运营可根据课程价格进行分组营销，按课程价格分组199，299，399等。
    </div>
    <div class="dialog-btn">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        :disabled="form.items.length >= 7"
        @click="add"
      >新建课程组</el-button>
    </div>
    <el-form ref="form" :model="form" label-width="100px">
      <draggable
        :list="form.items"
        tag="div"
        draggable=".form-item"
        v-bind="{
          animation:500 ,
          handle:'.icon_draggable_dialog',
        }"
        :move="handleMove"
      >
        <div
          v-for="(item, index) in form.items"
          :key="index"
          class="form-item"
        >
          <svg-icon
            icon-class="icon_draggable"
            class="icon_draggable_dialog"
          />
          <el-form-item
            label="课程组名称"
            :prop="'items.' + index + '.value'"
            :rules="{
              required: true, message: '课程组名称不能为空', trigger: 'blur'
            }"
          >
            <el-input
              v-model="item.value"
              placeholder="请输入课程组名称"
              style="width:350px;margin:0 15px 0 10px"
              size="small"
              clearable
              maxlength="10"
              show-word-limit
            />
            <el-button
              type="text"
              style="color: #F53F3F !important"
              @click="remove(index)"
            >删除</el-button>
          </el-form-item>
        </div>
      </draggable>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        size="small"
        type="primary"
        @click="save"
      >确 定</el-button>
      <el-button
        size="small"
        @click="handleClose"
      >取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import { hasDuplicate } from '@/utils/index'
export default {
  name: 'CourseDialog',
  components: {
    draggable
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        items: []
      },
      visible: false,
      type: 'old'
    }
  },
  methods: {
    open(items, type = 'old') {
      this.form.items = JSON.parse(JSON.stringify(items))
      this.visible = true
      this.type = type
      if (type === 'new') {
        this.add()
      }
    },
    remove(index) {
      if (this.form.items.length === 1) {
        this.$message.error('课程组不能小于一个')
        return
      }
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.form.items.splice(index, 1)
        }
      })
    },
    handleClose() {
      if (this.type === 'new') {
        this.$emit('del')
      }
      this.visible = false
    },
    handleMove() {
      return true
    },
    add() {
      if (this.disabled) {
        this.$message.error('请先打开显示课程组名称开关')
        return
      }
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      this.form.items.push({
        value: '',
        key
      })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.type = 'save'
          const isSame = hasDuplicate(this.form.items.map(i => i.value))
          if (isSame) {
            this.$message.error('课程组名称不能相同')
            return
          }
          this.visible = false
          this.$emit('success', this.form.items)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.icon_draggable_dialog{
  width: 20px;
  height: 20px;
  font-size: 20px;
  cursor: move;
  color: #999999;
  &:hover{
    color: #2980FF ;
  }
}
</style>
<style lang="scss" scoped>
.dialog-container ::v-deep{
    .el-dialog__body{
        padding:20px
    }
    .content{
        background: #F5F9FF;
        border-radius: 8px;
        padding: 16px;
        font-weight: 400;
        font-size: 14px;
        color: #777777;

    }

    .dialog-btn{
        margin: 20px 0;
    }
    .form-item{
        display: flex;
        align-items: center;
        height: 36px;
        margin-bottom: 20px;
    }
    .el-form-item{
        border-bottom: 0px !important;
        padding-bottom: 0px !important;
        margin-bottom: 0px !important;
    }
}

</style>
