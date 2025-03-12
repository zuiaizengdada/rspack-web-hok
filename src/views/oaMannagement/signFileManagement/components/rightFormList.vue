<template>
  <!-- :title="`参数选择：${item.propValue}`" -->

  <div class="rightFormList-container">
    <el-collapse v-model="activeNames" @change="handleChange" accordion>
      <el-collapse-item
        :name="item.id"
        v-for="item in componentData"
        :key="item.id"
        :id="'rightFormItem' + item.id"
        style="white-space: pre-wrap"
        :class="{ 'rightFormList-collapseItemActive': activeNames === item.id }"
      >
        <template slot="title">
          <div :title="item.propValue">
            参数选择:&nbsp;{{ handleTitle(item.propValue) }}
          </div>
        </template>
        <el-form
          ref="curComponent"
          :model="curComponent"
          :rules="rules"
          label-position="left"
          label-width="80px"
        >
          <el-form-item label="参数类型：" class="form-item">
            <div class="rightFormList-type">
              <span>{{ curComponent.label }}</span>
              <el-checkbox
                v-model="curComponent.isRequired"
                :true-label="1"
                :false-label="0"
                >必填</el-checkbox
              >
            </div>
          </el-form-item>
          <el-form-item label="参数名称：" class="form-item">
            <el-input
              v-model="curComponent.propValue"
              style="white-space: pre-wrap"
            />
          </el-form-item>
          <el-form-item
            label="最大字符数："
            v-if="curComponent.type === 2"
            label-width="95px"
            class="form-item"
          >
            <el-input v-model="curComponent.maxLength" />
          </el-form-item>
          <el-form-item
            label="文本示例："
            v-if="curComponent.type === 2"
            class="form-item"
          >
            <el-checkbox
              v-model="curComponent.textExample"
              :true-label="1"
              :false-label="0"
              >提供文本示例</el-checkbox
            >
          </el-form-item>
          <el-input
            v-if="curComponent.type === 2"
            v-model="curComponent.textExampleContent"
            placeholder="请填写文本示例"
            type="textarea"
            :rows="3"
          />
          <el-form-item
            label="日期单位"
            v-if="curComponent.type === 5"
            class="form-item"
          >
            <el-select v-model="curComponent.dateUnit">
              <el-option
                v-for="item in dateUnitOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="签名归属"
            v-if="curComponent.type === 7"
            class="form-item"
          >
            <el-select :value="curComponent.signatureType" disabled>
              <el-option
                v-for="item in signatureTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="使用公章"
            v-if="curComponent.type === 8"
            class="form-item"
          >
            <el-input
              :value="row.electronicSealList[0]"
              disabled
              :title="row.electronicSealList[0]"
            />
          </el-form-item>

          <el-form-item label-width="0" class="form-item">
            <div>文字</div>
            <div class="rightFormList-font">
              <el-select v-model="curComponent.fontId">
                <el-option
                  v-for="item in fontListOptions"
                  :key="item.id"
                  :label="item.fontName"
                  :value="item.id"
                />
              </el-select>
              <el-input-number
                v-model="curComponent.style.fontSize"
                @change="curComponentFontSizeChange"
                :min="0"
                style="min-width: 60px; width: 60px; margin-left: 6px"
                :controls="false"
                :precision="0"
              />
            </div>
            <el-radio-group
              v-model="curComponent.style.textAlign"
              class="textAlignBtnGroup"
            >
              <el-radio-button label="left" class="textAlignBtn">
                <img
                  :src="
                    curComponent.style.textAlign === 'left'
                      ? textAlignLeft_actived
                      : textAlignLeft
                  "
                  style="min-width: 24px; min-height: 24px"
                />
              </el-radio-button>
              <el-radio-button label="center" class="textAlignBtn">
                <img
                  :src="
                    curComponent.style.textAlign === 'center'
                      ? textAlignCenter_actived
                      : textAlignCenter
                  "
                  style="min-width: 24px; min-height: 24px"
                />
              </el-radio-button>
              <el-radio-button label="right" class="textAlignBtn">
                <img
                  :src="
                    curComponent.style.textAlign === 'right'
                      ? textAlignRight_actived
                      : textAlignRight
                  "
                  style="min-width: 24px; min-height: 24px"
                />
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="文字颜色" class="form-item t_g_r">
            <el-color-picker
              v-model="curComponent.style.color"
              color-format="rgb"
            ></el-color-picker>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fontListAjax } from '../../api/signFile'
import textAlignLeft from '@/assets/image/oa/textAlignLeft.png'
import textAlignLeft_actived from '@/assets/image/oa/textAlignLeft_actived.png'
import textAlignCenter from '@/assets/image/oa/textAlignCenter.png'
import textAlignCenter_actived from '@/assets/image/oa/textAlignCenter_actived.png'
import textAlignRight from '@/assets/image/oa/textAlignRight.png'
import textAlignRight_actived from '@/assets/image/oa/textAlignRight_actived.png'
import { hasValue } from '@/utils/index'

import { signatureTypeOption, dateUnitOption } from './utils/options'

export default {
  props: {
    row: {
      type: Object,
      default: () => {
        return {
          electronicSealList: []
        }
      }
    }
  },
  data() {
    return {
      rules: {},
      activeNames: -1,
      fontListOptions: [],
      textAlignList: [],
      textAlignLeft,
      textAlignLeft_actived,
      textAlignCenter,
      textAlignCenter_actived,
      textAlignRight,
      textAlignRight_actived,
      signatureTypeOption,
      dateUnitOption
    }
  },
  computed: {
    ...mapState({
      curComponent: state => state.oaManage.curComponent,
      componentData: state => state.oaManage.componentData,
      curComponentIndex: state => state.oaManage.curComponentIndex
    })
  },
  watch: {
    curComponentIndex: {
      handler(val) {
        console.log(val, 'curComponentIndex+++++++++')
        this.activeNames = val
      },
      immediate: true
    }
  },
  created() {
    this.fontList()
  },
  methods: {
    handleTitle(name) {
      if (!hasValue(name)) {
        return ''
      }
      return name.length > 10 ? `${name.slice(0, 10)}...` : name.slice(0, 10)
    },
    handleChange(e) {
      console.log(e, 'handleChange++++')
      if (hasValue(e)) {
        const upIndex = this.componentData.findIndex(i => i.id === e)
        this.$store.commit('oaManage/setCurComponent', {
          component: this.componentData[upIndex],
          index: e
        })
        //列表滚动到对应位置
        this.toRollListElement(e)
      } else {
        this.$store.commit('oaManage/setCurComponent', {
          component: {
            style: {}
          },
          index: -1
        })
      }
    },
    fontList() {
      fontListAjax().then(res => {
        if (res.code === 1) {
          this.fontListOptions = res.data
        }
      })
    },
    toRollListElement(e) {
      this.$nextTick(() => {
        const listElement = document.getElementById(`shape${e}`)
        if (listElement) {
          listElement.scrollIntoView({ behavior: 'smooth' })
        }
      })
    },
    curComponentFontSizeChange(e) {
      if (!hasValue(e)) return
      const minHeight = 2 * e - 6 < 5 ? 5 : 2 * e - 6
      if (this.curComponent.style.height < minHeight) {
        this.curComponent.style.height = minHeight
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rightFormList-container {
  overflow: auto;
  height: 100%;
}
.rightFormList-container ::v-deep .el-collapse-item__header.is-active {
  border-bottom-color: #e6ebf5;
}

.rightFormList-container ::v-deep .el-collapse-item > :first-child > div {
  padding: 0 16px;
}
.rightFormList-container ::v-deep .el-collapse-item .el-collapse-item__content {
  padding: 0 16px;
}

.rightFormList-type {
  display: flex;
  justify-content: space-between;
}
.rightFormList-font {
  display: flex;
  justify-content: space-between;
  margin-bottom: 9px;
}

.rightFormList-container
  ::v-deep
  .rightFormList-collapseItemActive
  > :first-child
  > div {
  outline: 1px solid #70c0ff;
  background: rgba(0, 133, 255, 0.1);
}

.form-item {
  margin-bottom: 0;
  padding: 6px 0;
}
.t_g_r {
  text-align: right;
}
.textAlignBtn {
  width: 45px;
  height: 40px;
}
.textAlignBtnGroup ::v-deep .el-radio-button__inner {
  padding: 8px 10px;
}
</style>
