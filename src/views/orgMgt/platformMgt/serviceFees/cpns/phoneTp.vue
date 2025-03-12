<template>
  <el-form
    ref="phoneFormRef"
    class="phone-form-cnt"
    :model="phoneForm"
    label-width="0px"
  >
    <div
      v-for="(item, index) in phoneForm.phoneList"
      :key="index"
      class="flex phone-cell"
    >
      <el-form-item :prop="'phoneList.' + index + '.value'" :rules="item.rule">
        <el-input
          v-model="phoneForm.phoneList[index].value"
          clearable
          maxlength="32"
          :placeholder="`请输入` + title"
        />
      </el-form-item>
      <div class="flex icon-btn">
        <i
          v-if="phoneForm.phoneList.length > 1"
          class="el-icon-remove-outline"
          @click="removePhone(index)"
        />
        <i class="el-icon-circle-plus blue" @click="addPhone" />
        <!-- <el-button
          v-if="phoneForm.phoneList.length > 1"
          type="text"
          @click="removePhone(index)"
        >
          删除
        </el-button>
        <el-button type="text" @click="addPhone"> 添加 </el-button> -->
      </div>
    </div>
  </el-form>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      phoneForm: {
        phoneList: [
          {
            value: undefined,
            rule: [
              {
                required: true,
                message: '请输入' + this.title,
                trigger: 'blur'
              },
              { validator: this.validatePhone, trigger: 'blur' }
            ]
          }
        ]
      }
    }
  },
  methods: {
    validatePhone(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入1' + this.title))
      } else if (!this.checkFieldUniqueness(value)) {
        return callback(new Error(this.title + '不能重复'))
      } else {
        callback()
      }
    },
    checkFieldUniqueness(field) {
      const arr = this.phoneForm.phoneList
      const filteredArr = arr.filter(item => item.value === field)
      return filteredArr.length === 1
    },
    addPhone() {
      this.phoneForm.phoneList.push({
        value: undefined,
        rule: [
          {
            required: true,
            message: '请输入' + this.title,
            trigger: 'blur'
          },
          { validator: this.validatePhone, trigger: 'blur' }
        ]
      })
    },
    removePhone(index) {
      this.phoneForm.phoneList.splice(index, 1)
    },
    getPhoneForm() {
      return new Promise((resolve, reject) => {
        this.$refs.phoneFormRef.validate(valid => {
          if (valid) {
            resolve(this.phoneForm.phoneList.map(m => m.value))
          } else {
            resolve([])
          }
        })
      })
    },
    clearValidate() {
      this.$refs.phoneFormRef.clearValidate()
    }
  }
}
</script>

<style lang="scss">
.phone-cell {
  margin-bottom: 20px;
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }
}
.icon-btn {
  position: absolute;
  left: calc(100% - 10px);
  top: 0;
  transform: translateY(50%);
  align-items: center;
  padding-left: 10;
  i {
    cursor: pointer;
    font-size: 20px;
    &.blue {
      color: #0c6fff;
    }
    &:nth-child(2) {
      margin-left: 5px;
    }
  }
}
</style>
