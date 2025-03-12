<template>
  <el-dialog
    width="600px"
    title="更改接待课程价格"
    class="dialog-container"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form
      ref="ruleForm"
      label-width="110px"
      :rules="rules"
      :model="form"
      size="small"
    >
      <el-form-item label="当前选中人员" prop="userId">
        <div :class="{ assessBox: form.userId.length > 0 }">
          <el-tag
            v-for="(tag, index) in form.userId"
            :key="tag.userId"
            class="assessUsersView"
            :closable="form.userId.length > 1"
            @close="delAssessUsers(tag, index)"
          >{{ tag.userName }}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="接待课程价格" required>
        <div>
          <div>保存后将所有选中人员的接待课程价格全部重置</div>
          <el-radio-group v-model="form.isWholePrice" class="flex flex-column">
            <el-radio :label="1" style="margin:20px 0">全部价格</el-radio>
            <el-radio :label="0" class="flex flex-middle">
              <div class="flex flex-middle">
                <div style="margin-right: 5px">
                  具体价格区间
                </div>
                <el-form-item prop="startPrice" style="margin-bottom:0px">
                  <el-input-number
                    v-model="form.startPrice"
                    :controls="false"
                    style="width:100px"
                    :min="0"
                    :precision="2"
                  />
                </el-form-item>
                <div style="margin:0px 5px">
                  至
                </div>
                <el-form-item prop="endPrice" style="margin-bottom:0px">
                  <el-input-number
                    v-model="form.endPrice"
                    :controls="false"
                    style="width:100px"
                    :min="form.startPrice"
                    :precision="2"
                  />
                </el-form-item>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        size="small"
        type="primary"
        @click="handleSave"
      >确 定</el-button>
      <el-button size="small" @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { assistantDetailEdit } from '@/api/deliver/assistant'
export default {
  name: 'BatchSetPrice',
  data() {
    var validateStartPrice = (rule, value, callback) => {
      if (this.form.startPrice === 0 && this.form.isWholePrice === 0) {
        callback(new Error('价格开始区间不能等于0'))
        return
      }
      callback()
    }
    var validateEndPrice = (rule, value, callback) => {
      if (this.form.endPrice < this.form.startPrice && this.form.isWholePrice === 0) {
        callback(new Error('价格结束区间必须大于开始区间'))
        return
      }
      callback()
    }
    return {
      form: {
        userId: [],
        isWholePrice: 0,
        startPrice: 0,
        endPrice: 0,
        id: undefined
      },
      visible: false,
      rules: {
        userId: [
          {
            required: true,
            message: '请选择助教',
            trigger: 'change',
            type: 'array'
          }
        ],
        startPrice: [
          {
            required: true,
            validator: validateStartPrice,
            trigger: 'blur'
          }
        ],
        endPrice: [
          {
            required: true,
            validator: validateEndPrice,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    open(row) {
      this.visible = true
      this.reset()
      this.form.userId = row.userId
      this.form.id = row.id
      this.form.isWholePrice = row.isWholePrice ?? 0
      if ((row.startPrice || row.endPrice) && row.isWholePrice === 0) {
        this.form.startPrice = this.getPrice(row.startPrice)
        this.form.endPrice = this.getPrice(row.endPrice)
      }
    },
    reset() {
      this.form = {
        userId: [],
        isWholePrice: 0,
        startPrice: 0,
        endPrice: 0,
        id: undefined
      }
    },
    getPrice(price) {
      if (typeof price === 'number') {
        return price / 100
      }
      return price
    },
    delAssessUsers(tag, index) {
      this.form.userId.splice(index, 1)
    },
    handleSave() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          const ids = this.form.userId.map(i => i.id)
          const { code } = await assistantDetailEdit({
            ids,
            startPrice: this.form.startPrice * 100,
            endPrice: this.form.endPrice * 100,
            isWholePrice: this.form.isWholePrice,
            id: this.form.id
          })
          if (code === 1) {
            this.$emit('success')
            this.visible = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep{
    .el-dialog__body{
        padding:20px;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .assessBox {
        width: 403px;
        box-sizing: border-box;
        padding: 18px 16px 2px;
        height: auto;
        background: #ffffff;
        border-radius: 6px;
        border: 1px dashed #979797;
        .assessUsersView {
        margin-right: 16px;
        margin-bottom: 16px;
        }
    }
}

</style>
