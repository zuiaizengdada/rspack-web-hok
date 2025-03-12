<template>
  <el-drawer
    title="触达时间配置"
    :visible="visible"
    append-to-body
    direction="rtl"
    :size="610"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :wrapper-closable="false"
    @close="handleClose"
  >
    <div class="time-config-wrap">
      <div class="time-config-item">
        <div class="time-config-item-title">触达时间</div>
        <div class="time-config-item-content">
          <div style="display: flex; align-items: center; gap: 10px">
            <span>分配后</span>
            <div class="time-config-item-content-input">
              <el-input
                v-model="formData.value"
                class="time-config-item-content-input-input"
                type="number"
                maxlength="3"
                :max="240"
                :min="0"
                @input="
                  val => {
                    // 自动转为整数
                    formData.value = Math.floor(Number(val))

                    // 限制最大值
                    if (formData.value > 240) {
                      formData.value = 240
                    }

                    // 确保值为非负数
                    if (formData.value < 0) {
                      formData.value = 0
                    }
                  }
                "
              />
              <el-select
                v-model="formData.type"
                class="time-config-item-content-input-select"
                placeholder=""
              >
                <el-option label="小时" :value="1" />
                <el-option label="分钟" :value="2" />
              </el-select>
            </div>
            <span>0标识立即，区间范围（0-240）</span>
          </div>
          <el-button
            type="primary"
            size="mini"
            :disabled="!formData.value || !formData.type"
            @click="handleAdd"
          >新增</el-button>
        </div>
      </div>
      <div class="time-config-item">
        <div
          class="sort-wrap"
          :style="{
            height:
              'calc(100vh - 71px - 10px - 67px - 20px - 20px - 20px - 28px)'
          }"
        >
          <div class="sort-wrap-title">
            拖动可排序，最多配置30项，每项不能重复
          </div>
          <div class="sort-wrap-content">
            <draggable
              v-model="timeList"
              animation="300"
              handle=".sort-wrap-content-item"
              style="display: flex; flex-direction: column; gap: 10px"
              @end="handleSort"
            >
              <div
                v-for="(item, index) in timeList"
                :key="index"
                class="sort-wrap-content-item"
              >
                <span class="sort-wrap-content-item-text">{{
                  item.actionName
                }}</span>
                <img
                  v-if="item.isDefault !== 1"
                  class="sort-wrap-content-item-close"
                  src="@/assets/image/close2.png"
                  alt=""
                  @click="handleDelete(index)"
                />
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import draggable from 'vuedraggable'
import { getReachTimeConfig, setReachTimeConfig } from '@/api/timeConfig'

export default {
  name: 'TimeConfigDialog',
  components: {
    draggable
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        sort: '',
        type: 1,
        value: ''
      },
      timeList: []
    }
  },
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value() {
      this.formData = {
        sort: '',
        type: 1,
        value: ''
      }
    }
  },
  mounted() {
    this.getReachTimeConfig()
  },

  methods: {
    async getReachTimeConfig() {
      const { code, data } = await getReachTimeConfig()
      if (code === 1) {
        // 根据sort排序
        this.timeList = data.sort((a, b) => a.action - b.action)
      }
    },
    handleClose() {
      this.visible = false
    },

    async handleDelete(index) {
      const res = await this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
      if (res === 'confirm') {
        const tempList = [...this.timeList].map(item => ({
          value: item.value,
          type: item.type,
          sort: item.action,
          isDefault: item.isDefault,
          id: item.id
        }))

        tempList.splice(index, 1)

        const { code } = await setReachTimeConfig(tempList)
        if (code === 1) {
          this.$message.success('删除成功')
          this.getReachTimeConfig()
        }
      }
    },
    async handleAdd() {
      if (this.formData.value > 240) {
        this.$message.warning(
          `时间不能大于240${this.formData.type === 1 ? '小时' : '分钟'}`
        )
        return
      }

      // 检查是否存在相同的配置
      const isDuplicate = this.timeList.some(
        item =>
          Number(item.value) === Number(this.formData.value) &&
          Number(item.type) === Number(this.formData.type)
      )

      if (isDuplicate) {
        this.$message.warning('已存在相同的时间配置')
        return
      }

      const tempList = [...this.timeList].map(item => ({
        value: item.value,
        id: item.id,
        type: item.type,
        sort: item.action,
        isDefault: item.isDefault
      }))
      tempList.push({
        value: this.formData.value,
        type: this.formData.type,
        sort: tempList.length + 1,
        isDefault: 2
      })
      const { code } = await setReachTimeConfig(tempList)

      if (code === 1) {
        this.getReachTimeConfig()
        this.$message.success('新增成功')
        this.formData = {
          sort: '',
          type: 1,
          value: ''
        }
      }
    },
    async handleSort() {
      const { code } = await setReachTimeConfig(
        this.timeList.map((item, index) => ({ ...item, sort: index + 1 }))
      )
      if (code === 1) {
        this.getReachTimeConfig()
        this.$message.success('排序更新成功')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}

::v-deep {
  .el-drawer__header {
    border-bottom: 1px solid #e7e7e7;
    padding-bottom: 20px;
    margin-bottom: 10px;

    span {
      font-size: 16px;
      font-weight: 600;
      color: #000000;
    }

    .el-drawer__close-btn {
      color: #000000;
    }
  }

  .el-drawer__body {
    padding: 10px 20px 0;
  }
}

.time-config-wrap {
  .time-config-item {
    margin-bottom: 20px;

    &-title {
      font-size: 14px;
      font-weight: 600;
      color: #000000;
    }

    &-content {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      ::v-deep {
        .el-input {
          width: 138px;

          input {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
        }

        .el-select {
          width: 77px;
          .el-input {
            .el-input__suffix {
              right: 67px;
            }
          }
          input {
            width: 77px !important;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-top-right-radius: 4px !important;
            border-bottom-right-radius: 4px !important;
            padding-right: 0;
          }
        }
      }

      span {
        font-size: 14px;
        color: #000000;
      }
    }

    .sort-wrap {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 10px 20px;
      border: 1px solid #dcdee1;
      border-radius: 8px;
      overflow-y: scroll;
      // 隐藏滚动条
      &::-webkit-scrollbar {
        display: none;
      }

      &-title {
        font-size: 14px;
        color: #000000;
      }

      &-content {
        display: flex;
        flex-direction: column;
        gap: 10px;

        &-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border: 1px solid #dcdee1;
          border-radius: 8px;
          background-color: #f7f7f7;
          cursor: move;

          .handle {
            cursor: move;
            font-size: 16px;
            color: #909399;
          }

          &-text {
            font-size: 14px;
            color: #000000;
          }

          &-close {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
