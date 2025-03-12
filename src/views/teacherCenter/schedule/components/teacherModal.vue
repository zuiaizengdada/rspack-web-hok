<template>
  <!-- 排班提醒弹框 -->
  <el-dialog
    :visible.sync="visible"
    class="dialog-container"
    width="548px"
    height="270px"
    title="首页IP设置"
  >
    <el-scrollbar
      v-if="visible"
      v-loading="loading"
      class="teacherDialog"
      style="height: 400px"
    >
      <el-form
        ref="ruleForm"
        :model="form"
        label-width="100px"
      >
        <el-form-item
          label="IP姓名"
          :rules="[
            { required: true },
          ]"
        >
          <span style="font-size: 12px;color: #999999">注：最多可添加20个IP，不可重复，支持拖动IP排序</span>
        </el-form-item>
        <draggable v-model="form.formList" animation="300" group="people">
          <transition-group>
            <el-form-item
              v-for="(list, index) in form.formList"
              :key="index + 1"
              label=""
              class="draggable-item"
              :prop="'formList.' + index + '.value'"
              :rules="[
                { required: true, message: '请选择IP姓名', trigger: 'change' },
              ]"
            >
              <span class="draggable-item__icon">
                <i class="el-icon-sort icon" />
              </span>
              <el-select
                v-model="list.value"
                remote
                filterable
                :remote-method="(query)=>remoteMethod(query,list)"
                placeholder="请选择IP"
                :loading="selectLoading"
                @change="handleChange"
              >
                <el-option
                  v-for="item in list.options"
                  :key="item.teacherId"
                  :label="item.teacherName"
                  :value="item.teacherId"
                  :disabled="item.disabled"
                />
              </el-select>
              <span v-if="form.formList.length < 20" class="draggable-icon" @click="handleAdd">
                <i class="el-icon-plus" />
              </span>
              <span v-if="index !== 0" class="draggable-icon minus" @click="handleDel(index)">
                <i class="el-icon-minus" />
              </span>
            </el-form-item>
          </transition-group>
        </draggable>

      </el-form>
    </el-scrollbar>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import { teacherQueryByName, teacherIndexSave } from '@/api/tearchCenter/index'
export default {
  name: 'TeacherModal',
  components: { draggable },
  data() {
    return {
      visible: false,
      loading: false,
      selectLoading: false,
      form: {
        formList: []
      }
    }
  },
  methods: {
    async open(formList = []) {
      try {
        this.loading = true
        this.form.formList = formList?.map(item => {
          return {
            value: item.teacherId,
            options: [{
              teacherName: item.teacherName,
              teacherId: item.teacherId
            }]
          }
        })
      } catch (e) {
        this.loading = false
      }
      this.loading = false
      this.visible = true
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.save()
        }
      })
    },
    async save() {
      const params = {
        saveRequests: this.form.formList.map((i, index) => {
          return {
            sort: index,
            teacherId: i.value
          }
        })
      }
      const { code } = await teacherIndexSave(params)
      if (code === 1) {
        this.visible = false
        this.$notify.success('保存成功')
        this.$emit('success')
      }
    },
    async remoteMethod(query, item) {
      if (query !== '') {
        const { data } = await teacherQueryByName({ name: query })
        const teacherIds = this.form.formList.map(i => i.value)
        item.options = data?.map(i => {
          return {
            ...i,
            disabled: teacherIds.includes(i.teacherId)
          }
        })
      } else {
        this.options = []
      }
    },
    handleChange() {
       this.form.formList?.forEach(item => {
         item.options = this.getOptions(item)
       })
    },
    handleDel(index) {
      this.form.formList.splice(index, 1)
      this.form.formList = this.form.formList?.map(item => {
        return {
          value: item.value,
          options: this.getOptions(item)
        }
      })
    },
    getOptions(item) {
      const teacherIds = this.form.formList.map(i => i.value)
      return item.options.map(i => {
        return {
          ...i,
          disabled: teacherIds.includes(i.teacherId)
        }
      })
    },
    handleAdd() {
      const item = {
        value: '',
        options: []
      }
      this.form.formList.push(item)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep{
  .draggable-item__icon{
    padding: 8px 10px;
    background-color: #dcdcdc5c;
    margin-right: 15px;
    border-radius: 10px;
    cursor: move;
  }
  .draggable-icon{
    font-size: 10px;
    padding: 8px 10px;
    margin-left:8px ;
    border: 1px dashed #DCDCDC;
    cursor: pointer;
    i{
      font-weight: 600;
    }
  }
  .icon{
    font-size: 16px;

  }
  .minus{
    i{
      color: rgba(0,0,0,0.4);
    }
  }
  .el-form-item{
    margin-bottom: 12px;
  }
  .el-dialog__body{
    padding: 20px
  }
}
</style>
