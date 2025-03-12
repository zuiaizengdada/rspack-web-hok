<template>
  <div>
    <MCard class="cardHeight deliverySettings-wrap">
      <div>
        <div class="deliverySettings">交付延期配置</div>
        <div class="time-config-wrap">
          <div class="time-config-item-content">
            <div
              v-for="(item, index) in deliveryDelayConfigList"
              :key="index"
              class="time-config-item-content-input"
            >
              <el-input
                v-model="item.value"
                class="time-config-item-content-input-input"
                :maxlength="item.type === 1 ? 3 : 4"
                type="number"
                :min="1"
                :max="item.type === 1 ? 840 : 70"
                @input="
                  val => {
                    // 自动转为整数
                    item.value = Math.floor(Number(val))

                    // 限制最大值
                    if (item.type === 1 && item.value > 840) {
                      item.value = 840
                    } else if (item.type === 2 && item.value > 70) {
                      item.value = 70
                    }
                  }
                "
              />
              <el-select
                v-model="item.type"
                class="time-config-item-content-input-select"
                placeholder=""
              >
                <el-option label="月" :value="1" />
                <el-option label="年" :value="2" />
              </el-select>
              <img
                src="@/assets/image/add2.png"
                style="
                  margin-left: 10px;
                  width: 20px;
                  height: 20px;
                  cursor: pointer;
                "
                @click="addTimeConfig(index)"
              />
              <img
                src="@/assets/image/delete2.png"
                style="
                  margin-left: 10px;
                  width: 20px;
                  height: 20px;
                  cursor: pointer;
                "
                @click="deleteTimeConfig(index)"
              />
            </div>
          </div>
        </div>
      </div>
      <el-row
        style="margin-bottom: 10px; padding-left: 20px"
        type="flex"
        justify="start"
      >
        <el-button type="primary" size="mini" @click="saveTimeConfig">
          保存
        </el-button>
      </el-row>
    </MCard>
  </div>
</template>

<script>
import {
  getDeliveryDelayConfig,
  setDeliveryDelayConfig
} from '@/api/deliver/delayConfig'

export default {
  data() {
    return {
      deliveryDelayConfigList: []
    }
  },
  mounted() {
    this.getDeliveryDelayConfig()
  },
  methods: {
    async getDeliveryDelayConfig() {
      const { code, data } = await getDeliveryDelayConfig()
      if (code === 1) {
        this.deliveryDelayConfigList = data
      }
    },
    addTimeConfig(index) {
      if (this.deliveryDelayConfigList.length >= 30) {
        this.$message.error('最多只能配置30项')
        return
      }
      // 在当前这一行的后面添加一项
      this.deliveryDelayConfigList.splice(index + 1, 0, {
        type: 1,
        value: ''
      })
    },
    deleteTimeConfig(index) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (this.deliveryDelayConfigList.length <= 1) {
          this.$message.error('至少保留1项配置')
          return
        }
        this.deliveryDelayConfigList.splice(index, 1)

        const { code } = await setDeliveryDelayConfig(
          this.deliveryDelayConfigList
        )
        if (code === 1) {
          this.$message.success('删除成功')
        }
      })
    },
    async saveTimeConfig() {
      // 1. 检查是否有重复项
      const seen = new Set()
      for (let i = 0; i < this.deliveryDelayConfigList.length; i++) {
        const item = this.deliveryDelayConfigList[i]
        const key = `${item.type}-${item.value}`
        if (seen.has(key)) {
          this.$message.error('配置项存在重复，请检查')
          return
        }
        seen.add(key)
      }

      // 2. 检查年限是否超过 70 年
      for (const item of this.deliveryDelayConfigList) {
        if (item.type === 1 && parseInt(item.value) > 12 * 70) {
          // 月份最大为 12 * 70
          this.$message.error('最大配置年限为70年（月数最大840个月）')
          return
        }
        if (item.type === 2 && parseInt(item.value) > 70) {
          // 年份最大为 70 年
          this.$message.error('最大配置年限为70年')
          return
        }
      }

      // 3.检查配置项是否为空
      for (const item of this.deliveryDelayConfigList) {
        if (item.value === '') {
          this.$message.error('配置项不能为空')
          return
        }
      }

      // 4. 保存数据
      const { code } = await setDeliveryDelayConfig(
        this.deliveryDelayConfigList
      )
      if (code === 1) {
        this.$message.success('保存成功')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.deliverySettings-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cardHeight {
  height: calc(100vh - 166px);
}

.deliverySettings {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 24px;
  padding-bottom: 20px;
  margin: 0 20px;
  border-bottom: 1px solid #e7e7e7;
}

.time-config-wrap {
  overflow-y: auto;
  height: calc(100vh - 68px - 69px - 45px - 20px - 28px - 50px);
  padding: 10px 20px;
  .time-config-item-content-input {
    margin-top: 10px;
    display: flex;
    align-items: center;

    ::v-deep {
      .el-input {
        width: 314px;

        input {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }

      .el-select {
        width: 77px !important;
        .el-input {
          width: 77px !important;
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
}
</style>
