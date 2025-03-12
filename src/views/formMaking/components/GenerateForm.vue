<template>
  <div class="fm-style">
    <el-form
      ref="generateForm"
      label-suffix=":"
      :size="data.config.size"
      :model="models"
      :rules="rules"
      :label-position="data.config.labelPosition"
      :label-width="data.config.labelWidth + 'px'"
    >
      <template v-for="item in data.list">
        <!-- <template v-if="item.type == 'grid'">
          <el-row
            :key="item.key"
            type="flex"
            :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify"
            :align="item.options.align"
          >
            <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">
              <template v-for="citem in col.list">
                <el-form-item v-if="citem.type == 'blank'" :key="citem.key" :label="citem.name" :prop="citem.model">
                  <slot :name="citem.model" :model="models" />
                </el-form-item>
                <genetate-form-item
                  v-else
                  :key="citem.key"
                  :models.sync="models"
                  :remote="remote"
                  :rules="rules"
                  :widget="citem"
                  @input-change="onInputChange"
                />
              </template>
            </el-col>
          </el-row>
        </template>

        <template v-else-if="item.type == 'blank'">
          <el-form-item :key="item.key" :label="item.name" :prop="item.model">
            <slot :name="item.model" :model="models" />
          </el-form-item>
        </template> -->
        <template>
          <genetate-form-item
            :key="item.key"
            :models.sync="models"
            :rules="rules"
            :widget="item"
            :remote="remote"
            @input-change="onInputChange"
          />
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import GenetateFormItem from './GenerateFormItem'
import { isArray, getDict } from '../util/index'
export default {
  name: 'FmGenerateForm',
  components: {
    GenetateFormItem
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['data', 'remote', 'value', 'insite'],
  data() {
    return {
      models: {},
      rules: {}
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.generateModle(val.list)
      }
    },
    value: {
      deep: true,
      handler(val) {
        console.log(JSON.stringify(val))
        this.models = { ...this.models, ...val }
      }
    }
  },
  created() {
    this.generateModle(this.data.list)
  },
  mounted() {},
  methods: {
    async generateModle(genList) {
      if (!(genList && isArray(genList) && genList.length)) {
        return
      }
      for (let i = 0; i < genList.length; i++) {
        if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
          this.models[genList[i].model] = this.value[genList[i].model]
        } else {
          this.models[genList[i].model] = genList[i].options.defaultValue
        }
        const selectList = {
          industryId: 'sys_industry',
          positionId: 'sys_position',
          turnoverId: 'sys_turnover'
        }
        const item = genList[i]
        if (selectList[item.params] && !item.options.options.length) {
          const data = await getDict(selectList[item.params])
          item.options.options = data
          item.options.props = {
            value: 'dictCode',
            label: 'dictLabel'
          }
        }
        // if (this.rules[genList[i].model]) {
        //   this.rules[genList[i].model] = [
        //     ...this.rules[genList[i].model],
        //     ...genList[i].rules.map((item) => {
        //       if (item.pattern) {
        //         return { ...item, pattern: new RegExp(item.pattern) }
        //       } else {
        //         return { ...item }
        //       }
        //     })
        //   ]
        // } else {
        //   this.rules[genList[i].model] = [
        //     ...genList[i].rules.map((item) => {
        //       if (item.pattern) {
        //         return { ...item, pattern: new RegExp(item.pattern) }
        //       } else {
        //         return { ...item }
        //       }
        //     })
        //   ]
        // }
      }
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate((valid) => {
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error('表单数据校验失败'))
          }
        })
      })
    },
    reset() {
      this.$refs.generateForm.resetFields()
    },
    onInputChange(value, field) {
      this.$emit('on-change', field, value, this.models)
    },
    refresh() {}
  }
}
</script>

<style lang="scss">
// @import '../styles/cover.scss';
</style>
