<template>
  <div v-if="show" class="widget-config-container">
    <el-form :model="current.options" :rules="rules" label-position="top">
      <div class="widget-config-title">
        {{ typeList[current.type] }}
      </div>
      <div v-if="current.type === 'course'" class="widget-config-name">
        <div>
          <span>显示课程组名称</span>
          <span class="tips">若设置了多个分组，保存时将默认显示分组切换</span>
        </div>
        <el-switch
          v-model="current.options.isShowCourseGroupName"
          @change="handleChangeShowGroup"
        />
      </div>
      <!-- <el-form-item label="字段属性">
        <el-input v-model="current.model" disabled />
      </el-form-item> -->
      <el-form-item label="排列方式" prop="sortType">
        <div class="sort-box">
          <template v-for="(item,index) in sortType">
            <div
              v-if="!(item.value === '4' && current.type === 'course')"
              :key="item.value"
              class="sort-item"
              :class="{active:current.options.sortType === item.value,'right-radius':index === 0,'left-radius':index === sortType.length - 1}"
              @click="current.options.sortType = item.value"
            >
              <svg-icon
                :icon-class="item.icon"
                class="sort-icon"
              />
              <div>{{ item.label }}</div>
            </div>
          </template>

        </div>
      </el-form-item>
      <el-form-item v-if="current.type === 'picture'" label="上传图片">
        <imageUpload :data-source.sync="current.options.dataSource" />
      </el-form-item>
      <template v-if="['lecturer','course'].includes(current.type)">
        <backgroundFormItem
          label="组件背景"
          :form.sync="current.options.backgroundStyle"
        />
      </template>
      <!-- IP部分 -->
      <template v-if="current.type === 'lecturer'">
        <el-form-item label="IP选择">
          <lecturerSelect :data-source.sync="current.options.dataSource" />
        </el-form-item>
        <el-form-item label="内容展示">
          <el-form-item
            label="IP姓名"
            class="side-form bor-0"
            prop="showNameType"
          >
            <el-radio-group v-model="current.options.showNameType">
              <el-radio
                v-for="item in lecturerNameOptionList"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="教师简介"
            class="side-form bor-0"
            prop="showIntroductionType"
          >
            <el-radio-group v-model="current.options.showIntroductionType">
              <el-radio
                v-for="item in introductionList"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form-item>
      </template>
      <template v-if="current.type === 'course'">
        <el-form-item
          label="显示数量"
          class="side-form"
          prop="courseMaxlen"
          style="margin-top:15px"
          :rules="[
            { required: true, message: '请选择组件背景', trigger: 'change' }
          ]"
        >
          <div class="flex flex-between" style="width: 396px;">
            <span class="tips">单个分组商品数量大于0小于等于30</span>
            <el-input-number
              v-model="current.options.courseMaxlen"
              controls-position="right"
              class="input-number"
              size="small"
              :max="30"
              :min="min"
            />
          </div>
        </el-form-item>
        <el-form-item
          label="添加课程"
          class="side-form hide-border"
          prop="courseMaxlen"
          :rules="[
            { required: true, message: '请选择课程', trigger: 'change' }
          ]"
        >
          <el-button
            size="small"
            type="text"
            @click="showCourseDialog"
          >课程组设置</el-button>
        </el-form-item>
        <courseSelect
          v-if="current.options.tabsKey.length"
          ref="courseSelect"
          :max="current.options.courseMaxlen"
          :data-source.sync="current.options.dataSource"
          :tabs-key="current.options.tabsKey"
        />
        <el-form-item label="内容展示" class="hide-border">
          <el-form-item
            label="课程名称"
            class="side-form hide-border"
          >
            <el-radio-group v-model="current.options.showNameType">
              <el-radio
                v-for="item in lecturerNameOptionList"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="课程简介"
            class="side-form hide-border"
          >
            <el-radio-group v-model="current.options.showIntroductionType">
              <el-radio
                v-for="item in introductionList"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="课程价格"
            class="side-form hide-border"
          >
            <el-switch
              v-model="current.options.isShowGoodsScore"
              @change="handleChangeGoodsScore"
            />
          </el-form-item>
          <el-form-item
            label="划线价格"
            class="side-form hide-border"
          >
            <el-switch
              v-model="current.options.isShowGoodsPopularity"
              @change="handleChangeGoodsPopularity"
            />
          </el-form-item>
        </el-form-item>
      </template>

      <el-form-item label="风格">
        <div
          v-for="(item,index) in styles"
          :key="item.key"
          class="flex flex-middle"
          :style="{'margin-bottom':index !== styles.length-1 ?'15px':'0px'}"
        >
          <div style="width:100px">{{ item.label }}</div>
          <el-slider
            v-model="current.options.style[item.key]"
            class="flex-1"
            :show-tooltip="false"
            style="margin:0 20px"
            :max="32"
          />
          <el-input-number
            v-model="current.options.style[item.key]"
            controls-position="right"
            class="input-number"
            size="small"
            :min="0"
            :max="32"
          />
        </div>
      </el-form-item>
    </el-form>
    <courseDialog
      ref="courseDialog"
      :disabled="!current.options.isShowCourseGroupName"
      @success="handleSetDataSource"
      @del="handleDel"
    />
  </div>
</template>

<script>
import imageUpload from './imageUpload/index'
import lecturerSelect from './lecturerSelect/index'
import courseSelect from './courseSelect/index'
import courseDialog from './courseDialog'
import backgroundFormItem from './backgroundFormItem'
import { sortType, typeList, backgroundTypeList, lecturerNameOptionList, introductionList } from '../utils/enum'
export default {
  components: {
    imageUpload,
    lecturerSelect,
    courseSelect,
    courseDialog,
    backgroundFormItem
  },
  props: {
    data: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      sortType,
      typeList,
      backgroundTypeList,
      lecturerNameOptionList,
      introductionList,
      styles: [
        {
          label: '组件内间距',
          value: 0,
          key: 'gutter'
        },
        {
          label: '组件左右间距',
          value: 0,
          key: 'leftAndRightSpacing'
        },
        {
          label: '组件上下间距',
          value: 0,
          key: 'topAndBottomSpacing'
        }
      ],
      rules: {
        sortType: [
          { required: true, message: '请选择排列方式' }
        ],
        showNameType: [
          { required: true, message: '请选择IP姓名', trigger: 'change' }
        ],
        showIntroductionType: [
          { required: true, message: '请选择教师简介', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true
      }
      return false
    },
    current: {
      set(val) {
        this.$emit('update:data', val)
      },
      get() {
        return this.data
      }
    },
    min() {
      const tabsKey = this.current.options.tabsKey
      const lens = []
      tabsKey.forEach(i => {
        const len = this.current.options.dataSource.filter(j => j.tabsKey === i.key).length
        lens.push(len)
      })
      // 取最大值
      return this.findMaxValue(lens)
    }
  },
  watch: {
    'data.model': {
      handler() {
        this.$nextTick(() => {
          const items = this.current?.options?.tabsKey ?? []
          if (this.current.type === 'course' && items && items.length < 1) {
            this.$refs.courseDialog.open(this.current?.options?.tabsKey ?? [], 'new')
          }
          if (items && items.length) {
            this.$refs.courseSelect.active = items[0].key
          }
        })
      },
      deep: true
    }
  },
  methods: {
    // 取最大值
    findMaxValue(arr) {
      if (arr.length === 0) {
        return 0
      }
      let maxValue = arr[0]
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] > maxValue) {
          maxValue = arr[i]
        }
      }
      return maxValue
    },
    handleChangeShowGroup() {
      if (this.current?.options?.tabsKey?.length > 1) {
        this.current.options.isShowCourseGroupName = true
        this.$message.error('当前已设置多个分组，不能关闭')
      }
    },
    showCourseDialog() {
      this.$refs.courseDialog.open(this.current?.options?.tabsKey ?? [])
    },
    handleSetDataSource(items) {
      console.log(items, 'items')
      this.current.options.tabsKey = items
      const keyList = items.map(i => i.key)
      this.current.options.dataSource = this.current.options.dataSource.filter(i => keyList.includes(i.tabsKey))
      if (items.length) {
        this.$nextTick(() => {
          this.$refs.courseSelect.active = items[0] && items[0].key
        })
      }
    },
    handleChangeGoodsScore() {
      if (!this.current.options.isShowGoodsScore) {
        this.current.options.isShowGoodsPopularity = false
      }
    },
    handleChangeGoodsPopularity() {
      const options = this.current.options
      if (!options.isShowGoodsScore && options.isShowGoodsPopularity) {
        this.current.options.isShowGoodsScore = true
      }
    },
    handleDel() {
      this.$emit('del', this.current.model)
    }
  }
}
</script>
<style lang="scss" scoped>
.widget-config-container{
  .input-number{
    width:80px;
    margin-right:10px;
    height: 32px;
  }
  .bor-0{
    border-bottom: 0px !important;
    padding-bottom: 0px !important;
  }
  .widget-config-title{
    color: #333333;
    font-size: 16px;
    font-weight: 600;
    height: 56px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #F5F5F5;
  }
  .widget-config-name{
    font-weight: 400;
    color: #333333;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    border-bottom: 1px solid #F5F5F5;
    .tips{
      color: #999999;
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .side-form.el-form-item{
    display: flex;
    justify-content: space-between;
    &::before,&::after{
      display: none;
    }
  }
  .tips{
    font-size: 12px;
    color: #999999;
    font-weight: 400;
  }
  .sort-box{
    display: flex;
    height: 72px;
    width: 100%;
    .sort-icon{
      height: 28px;
      width: 28px;
      font-size: 28px;
      color:#999;
    }
    .sort-item{
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid #DCDFE6;
      font-size: 12px;
      color: #777777;
      padding: 10px;
      cursor: pointer;
      &:hover{
        background: #EBF3FF;
      }
      &.active{
        color: #0C6FFF;
        border: 1px solid #0C6FFF;
        .sort-icon{
          color: #0C6FFF;
        }
      }
      img{
        width: 32px;
        height: 32px;
        border-radius: 4px;
      }
      div{
        height: 18px;
        line-height: 24px;
      }
    }
    .right-radius{
        border-radius: 4px 0px 0px 4px;
    }
    .left-radius{
      border-radius: 0px 4px 4px 0px;
    }
  }

}
</style>
