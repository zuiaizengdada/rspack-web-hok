<template>
  <el-drawer
    :visible.sync="visible"
    :title="title"
    size="956px"
    :loading="loading"
  >
    <div class="drawer-container">
      <div class="drawer-content">
        <el-form
          ref="ruleForm"
          :model="form"
          :rules="rules"
          label-width="80px"
          size="small"
        >
          <el-form-item label="规则触发" prop="ruleType">
            <el-select
              v-model="form.ruleType"
              clearable
              placeholder="请选择"
              @change="handleChangeRuleType"
            >
              <el-option
                v-for="item in ruleTypeOptions"
                :key="item.ruleType"
                :label="item.ruleName"
                :value="item.ruleType"
              />
            </el-select>
            <div class="tips">
              {{ ruleTips[form.ruleType] }}
            </div>
          </el-form-item>
          <el-form-item
            v-if="isShowCondition"
            label="触发条件"
            prop="condition"
          >
            <div v-if="form.ruleType === 'ATTEND_CLASS'">
              <el-radio-group v-model="radio" @change="changeRadio">
                <div class="line-40"><el-radio v-model="radio" label="1">不限制</el-radio></div>
                <div class="line-40">
                  <el-radio v-model="radio" label="2">特定条件（暂不支持真人直播）</el-radio>
                </div>
              </el-radio-group>
            </div>
            <template>
              <el-button
                type="primary"
                v-if="
                  radio === '2' &&
                  form.condition.length < goodsCondictionTypes.length
                "
                size="small"
                icon="el-icon-plus"
                @click="addCondition"
                >新增条件</el-button
              >
              <div
                v-for="(item, index) in form.condition"
                :key="index"
                class="rule-content"
              >
                <div class="condition-item">
                  <div
                    class="flex flex-between flex-middle"
                    style="width: 100%"
                  >
                    <div class="rule-title">
                      <span style="margin-right: 20px"
                        >条件{{ index + 1 }}</span
                      >
                      <el-form-item
                        :prop="'condition.' + index + '.conditionType'"
                        :rules="[
                          {
                            required: true,
                            message: '请选择触发类型',
                            trigger: 'change'
                          }
                        ]"
                        style="margin-bottom: 0px"
                      >
                        <el-select
                          v-model="item.conditionType"
                          placeholder="请选择"
                          clearable
                          @change="handleSelectCondition(index)"
                        >
                          <el-option
                            v-for="list in item.conditionOptions"
                            :key="list.conditionType"
                            :label="list.conditionName"
                            :value="list.conditionType"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        :prop="'condition.' + index + '.operateSymbol'"
                        :rules="[
                          {
                            required: true,
                            message: '请选择条件',
                            trigger: 'change'
                          }
                        ]"
                        style="margin-bottom: 0px"
                      >
                        <el-select
                          v-model="item.operateSymbol"
                          placeholder="请选择"
                          @change="item.conditionValueList = []"
                        >
                          <el-option
                            v-for="list in item.conditionOpt"
                            :key="list.conditionSymbol"
                            :label="list.conditionSymbolName"
                            :value="list.conditionSymbol"
                          />
                        </el-select>
                      </el-form-item>
                      <template v-if="item.conditionType === 'goodsId'">
                        <el-form-item
                          :prop="'condition.' + index + '.conditionValueList'"
                          style="margin-bottom: 0px"
                          :rules="[
                            {
                              required: true,
                              message: '请选择商品',
                              trigger: 'change',
                              type: 'array'
                            }
                          ]"
                        >
                          <el-button
                            class="btn"
                            size="small"
                            @click="handleSelectGoods(item, index)"
                            >选择商品</el-button
                          >
                        </el-form-item>
                      </template>
                      <template v-if="item.conditionType === 'goodsPrice'">
                        <el-form-item
                          :prop="'condition.' + index + '.conditionValue'"
                          style="margin-bottom: 0px"
                          :rules="[
                            {
                              required: true,
                              message: '请输入内容',
                              trigger: 'blur'
                            }
                          ]"
                        >
                          <el-input
                            v-model="item.conditionValue"
                            style="width: 108px"
                            clearable
                          />
                        </el-form-item>
                      </template>
                      <template v-if="item.conditionType === 'liveIp'">
                        <el-form-item
                          :prop="'condition.' + index + '.conditionValueList'"
                          style="margin-bottom: 0px"
                        >
                          <m-select
                            v-model="item.conditionValue"
                            style="width: 205px"
                            class="m-300"
                            placeholder="请选择IP"
                            multiple
                            @change="changeTeacher($event, item)"
                            :dict-list="teacherOption"
                            :param="{
                              value: 'teacherId',
                              label: 'teacherName'
                            }"
                          />
                        </el-form-item>
                      </template>
                    </div>
                    <span class="del" @click="handleDel(form.condition, index)"
                      >删除</span
                    >
                  </div>
                  <div class="goods-content">
                    <div
                      v-for="(list, kIndex) in item.conditionValueList"
                      :key="list.goodsId"
                      class="goods-item"
                    >
                      <div class="flex">
                        <img v-if="list.coverVerticalUrl" :src="list.coverVerticalUrl" alt="" />
                        <img v-else :src="list.coverUrl" alt="" />
                        <div class="flex flex-column flex-between flex-1">
                          <span>{{ list.goodsName }}</span>
                          <span v-if="list.salePrice" class="price"
                            >¥{{ list.salePrice }}</span
                          >
                        </div>
                      </div>
                      <span
                        class="del"
                        @click="handleDel1(item.conditionValueList, kIndex,item)"
                        >删除</span
                      >
                    </div>
                  </div>
                </div>
                <div
                  v-if="index !== form.condition.length - 1"
                  style="margin-top: 16px; width: 108px"
                >
                  <el-select
                    v-model="item.logicalOperatorSymbol"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="list in joinSysymbols"
                      :key="list.conditionSymbol"
                      :label="list.conditionSymbolName"
                      :value="list.conditionSymbol"
                    />
                  </el-select>
                </div>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="标签内容" prop="tags" v-if="form.ruleType">
            <el-button
              type="primary"
              size="small"
              v-if="form.tags.length < 7"
              icon="el-icon-plus"
              @click="addRule"
              >新增标签</el-button
            >
            <div class="tips">
              单规则最多新增7个标签，单个标签内容长度不可超过30个字，过长将被截取
            </div>
            <div
              v-for="(item, index) in form.tags"
              :key="index"
              class="rule-content"
            >
              <el-form-item
                class="rule-item"
                :prop="'tags.' + index + '.smallTags'"
                :rules="[
                  {
                    required: true,
                    message: '请添加标签类型',
                    trigger: 'change'
                  }
                ]"
              >
                <div class="rule-title">
                  <span>标签{{ index + 1 }}</span>
                  <span class="del" @click="handleDel(form.tags, index)"
                    >删除</span
                  >
                </div>
                <Draggable
                  v-model="item.smallTags"
                  v-bind="{
                    group: 'people',
                    ghostClass: 'ghost',
                    animation: 300,
                    handle: '.drag-widget'
                  }"
                  class="flex flex-wrap"
                >
                  <div
                    v-for="(list, key) in item.smallTags"
                    :key="key"
                    class="drag-widget"
                    style="margin-bottom: 10px"
                  >
                    <div v-if="list.tagType !== 'TEXT'" class="box">
                      {{ list.tagTypeName }}
                      <i
                        class="el-icon-error"
                        @click="handleDel(item.smallTags, key)"
                      />
                    </div>
                    <div v-if="list.tagType === 'TEXT'" class="input-box">
                      <el-input
                        v-model="list.textContent"
                        style="width: 200px"
                        placeholder="请输入标签"
                        maxlength="30"
                      />
                      <i
                        class="el-icon-error"
                        @click="handleDel(item.smallTags, key)"
                      />
                    </div>
                  </div>
                  <el-dropdown
                    @command="
                      command => {
                        handleCommand(item, command)
                      }
                    "
                  >
                    <el-button size="small" type="primary" icon="el-icon-plus"
                      >新增</el-button
                    >
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="list in labelOptions"
                        :key="list.id"
                        :command="list.id"
                        >{{ list.tagName }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </Draggable>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="form.status"
              :active-value="true"
              :inactive-value="false"
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="flex flex-right" style="margin: 15px 0">
        <el-button size="small" type="primary" @click="save">保存</el-button>
        <el-button size="small" @click="visible = false">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import Draggable from 'vuedraggable'
import {
  getDetail,
  getRuleType,
  getRuleConditionType,
  getConditionOperatorSymbol,
  getRuleTagType,
  ruleSave
} from '@/api/privateArea/rule'
import { teacherQueryByName } from '@/api/tearchCenter/index'
export default {
  components: { Draggable },
  data() {
    var validatorCondition = (rule, value, callback) => {
      if (value.length === 0 && this.form.ruleType !== 'ATTEND_CLASS') {
        callback(new Error('请选择触发条件'))
      } else if (value.length === 0 && this.radio !== '1') {
        callback(new Error('请选择触发条件'))
      } else {
        callback()
      }
    }
    return {
      form: {
        ruleType: '',
        ruleTypeName: '',
        condition: [],
        tags: [],
        status: true,
        id: undefined
      },
      ruleTypeOptions: [],
      labelOptions: [],
      type: 1,
      title: '新增标签规则',
      visible: false,
      rules: {
        ruleType: [
          { required: true, message: '请选择规则触发', trigger: 'change' }
        ],
        tags: [
          {
            required: true,
            message: '请选择标签内容',
            type: 'array',
            trigger: 'change'
          }
        ],
        condition: [
          {
            validator: validatorCondition,
            type: 'array',
            trigger: 'change'
          }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      loading: false,
      isShowCondition: false,
      goodsCondictionTypes: [],
      joinSysymbols: [],
      ruleTips: {
        ATTEND_CLASS:
          '针对已到直播间的到课学员对智能销售线索进行打标签，若有当前直播间未到课标签会同步删除掉对应未到课标签',
        ABSENT_CLASS: '针对某场智能销售任务，在任务关联的直播间结束1小时内',
        FINISH_CLASS: '针对已到直播间完课的学员对智能销售线索进行打标签',
        RECEIVE_COUPON:
          '针对已到直播间且领取了券的学员对智能销售线索进行打标签',
        PAY_FINISH: '支付成功',
        REFUND_FINISH: '退款成功'
      },
      teacherOption: [],
      radio: '2'
    }
  },
  computed: {
    labelObj() {
      const obj = {}
      this.labelOptions.forEach(i => {
        obj[i.id] = i.tagName
      })
      return obj
    }
  },
  mounted() {
    this.getRuleType()
    this.getTeacher()
  },
  methods: {
    async getTeacher() {
        const res = await teacherQueryByName({ name: '' })
        this.teacherOption = res.data
    },
    async open(row, type) {
      this.reset()

      this.type = type
      this.title = type === 1 ? '新增标签规则' : '编辑标签规则'
      this.visible = true
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
      if (type === 2) {
        this.loading = true
        const { data } = await getDetail({
          id: row.id
        })
        const tags = data.ruleTagDtos.map(i => {
          const smallTags = i.smallTagDtos
          return {
            smallTags,
            tagSort: i.tagSort
          }
        })
        const condition = data.ruleConditionDtos.map(i => {
          return {
            ...i,
            conditionValue:
              i.conditionType === 'liveIp'
                ? i.conditionValue.split(',')
                : i.conditionValue,
            conditionValueList: i.conditionValueList
              .filter(j => j.goodsName)
              .map(j => {
                return {
                  ...j,
                  goodsId: j.value,
                  salePrice: j.salePrice ? this.getSalePrice(j.salePrice) : ''
                }
              })
          }
        })
        this.form = {
          ruleType: data.ruleType,
          condition,
          tags,
          status: data.status,
          id: data.id
        }
        if (
          this.form.ruleType === 'ATTEND_CLASS' &&
          this.form.condition.length === 0
        ) {
          this.radio = '1'
        }
        this.getTypeOptions(true)
        this.loading = false
      }
    },
    getSalePrice(data) {
      const salePrice = data ?? ''
      const priceArr = salePrice.split(',').map(i => (i / 100).toFixed(2))
      if (priceArr.length > 1) {
        const max = Math.max(...priceArr).toFixed(2)
        const min = Math.min(...priceArr).toFixed(2)
        return `${min}~${max}`
      }
      return priceArr[0]
    },
    handleChangeRuleType() {
      this.radio = '2'
      this.getTypeOptions()
      this.form.tags = []
      this.form.condition = []
    },
    async getTypeOptions(isEdit = false) {
      this.ruleTypeOptions.forEach(i => {
        if (i.ruleType === this.form.ruleType) {
          this.form.ruleTypeName = i.ruleName
        }
      })
      const { data } = await getRuleConditionType({
        ruleType: this.form.ruleType
      })
      if (data.goodsCondictionTypes) {
        this.isShowCondition = true
        this.goodsCondictionTypes = data.goodsCondictionTypes
        this.joinSysymbols = data.joinSysymbols
      } else {
        this.isShowCondition = false
        this.goodsCondictionTypes = []
        this.joinSysymbols = []
      }
      const res = await getRuleTagType({
        ruleType: this.form.ruleType
      })
      if (res.code === 1) {
        this.labelOptions = res.data
      }
      if (isEdit) {
        const options = this.getConditionOptionList()
        this.form.condition.forEach(i => {
          i.conditionOptions = this.goodsCondictionTypes.filter(
            j =>
              !options.includes(j.conditionType) ||
              j.conditionType === i.conditionType
          )
          this.getConditionOperatorSymbol(i, i.conditionType)
        })
      }
    },
    async getRuleType() {
      const { data } = await getRuleType()
      this.ruleTypeOptions = data
    },
    handleCommand(item, command) {
      const tagTypeName = this.labelObj[command]
      const tagType = this.labelOptions.find(i => i.id === command)?.tagType
      item.smallTags.push({
        tagTypeId: command,
        tagTypeName,
        textContent: '',
        tagType
      })
    },
    addRule() {
      this.form.tags.push({ smallTags: [] })
      this.$refs.ruleForm.clearValidate('tags')
    },
    reset() {
      this.form = {
        ruleType: '',
        ruleTypeName: '',
        condition: [],
        tags: [],
        status: true,
        id: undefined
      }
      this.isShowCondition = false
    },
    successFn() {
      this.$emit('success')
      this.$notify.success({ title: '提示', message: '操作成功' })
      this.visible = false
    },
    async ruleSave() {
      const tags = this.form.tags.map((i, tagSort) => {
        return {
          tagSort,
          smallTags: i.smallTags.map((j, sort) => {
            return {
              ...j,
              tagSort,
              sort
            }
          })
        }
      })
      const condition = this.form.condition.map((i, sort) => {
        const conditionName = this.goodsCondictionTypes.find(
          j => j.conditionType === i.conditionType
        )?.conditionName
        const logicalOperatorSymbolName = this.joinSysymbols.find(
          j => j.conditionSymbol === i.logicalOperatorSymbol
        )?.conditionSymbolName
        const operateSymbolName = i.conditionOpt.find(
          j => j.conditionSymbol === i.operateSymbol
        )?.conditionSymbolName
        let conditionValue = ''
        if (!i.conditionValueList.length && i.conditionValue) {
          conditionValue = i.conditionValue
        }
        if (i.conditionValueList.length) {
          conditionValue = i.conditionValueList.map(i => i.value).join(',')
        }
        return {
          conditionType: i.conditionType,
          conditionName,
          sort,
          conditionValue,
          conditionValueList: i.conditionValueList,
          logicalOperatorSymbol: i.logicalOperatorSymbol,
          logicalOperatorSymbolName,
          operateSymbol: i.operateSymbol,
          operateSymbolName
        }
      })
      const params = {
        ...this.form,
        tags,
        condition
      }
      const { code } = await ruleSave(params)
      if (code === 1) {
        this.successFn()
      }
    },
    handleMove() {
      return true
    },
    handleDel(array, key) {
      array.splice(key, 1)
    },
    handleDel1(array, key,item) {
      array.splice(key, 1)
      if(item.conditionType ==='liveIp'){
        item.conditionValue = item.conditionValueList.map(i => i.value)
      }
    },
    getConditionOptionList() {
      const arr = []
      this.form.condition.forEach(i => {
        arr.push(i.conditionType)
      })
      return arr
    },
    handleSelectCondition(key) {
      const options = this.getConditionOptionList()
      this.form.condition.forEach((i, index) => {
        if (key !== index) {
          i.conditionOptions = this.goodsCondictionTypes.filter(
            j =>
              !options.includes(j.conditionType) ||
              j.conditionType === i.conditionType
          )
        } else {
          this.getConditionOperatorSymbol(i, i.conditionType)
        }
      })
    },
    async getConditionOperatorSymbol(item, conditionType) {
      const { data } = await getConditionOperatorSymbol({
        conditionType,
        ruleType: this.form.ruleType
      })
      this.$set(item, 'conditionOpt', data)
    },
    addCondition() {
      const options = this.getConditionOptionList()
      const conditionOptions = this.goodsCondictionTypes.filter(
        i => !options.includes(i.conditionType)
      )
      this.form.condition.push({
        conditionName: '',
        conditionType: '',
        conditionValue: '',
        conditionValueList: [],
        logicalOperatorSymbol: '',
        logicalOperatorSymbolName: '',
        operateSymbol: '',
        operateSymbolName: '',
        conditionOptions
      })
      this.$refs.ruleForm.clearValidate('condition')
    },
    handleSelectGoods(item, index) {
      const multiple = item.operateSymbol === 'in'
      console.log(item.conditionValueList, 'item.conditionValueList')

      this.$SelectAllGoods({
        visible: true,
        multiple,
        check: item.conditionValueList.map(i => i.goodsId),
        tabList: [
          { id: '0', name: '图文', api: '' },
          { id: '1', name: '音频', api: '' },
          { id: '2', name: '视频', api: '' },
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' },
          { id: '7', name: '套餐课', api: '' },
          { id: '10', name: '直播课', api: '' }
        ],
        currentId: '3',
        success: res => {
          if (res) {
            if (item.operateSymbol === 'in') {
              item.conditionValueList = [
                ...res,
                ...item.conditionValueList
              ].map(i => {
                return {
                  coverVerticalUrl: i.coverVerticalUrl,
                  value: i.goodsId,
                  goodsId: i.goodsId,
                  goodsName: i.contentName ?? i.goodsName,
                  salePrice: i.salePrice / 100
                }
              })
            } else {
              item.conditionValueList = res.map(i => {
                return {
                  coverVerticalUrl: i.coverVerticalUrl,
                  value: i.goodsId,
                  goodsId: i.goodsId,
                  goodsName: i.contentName ?? i.goodsName,
                  salePrice: i.salePrice / 100
                }
              })
            }

            this.$refs.ruleForm.clearValidate(
              `condition.${index}.conditionValueList`
            )
          }
        }
      })
    },
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.ruleSave()
        }
      })
    },
    changeTeacher(e, item) {
      item.conditionValueList = this.teacherOption
        .filter(i => {
          return e.includes(i.teacherId)
        })
        .map(i => ({
          goodsName: i.teacherName,
          coverVerticalUrl: i.photoUrl,
          value: i.teacherId,
          goodsId: i.teacherId
        }))
    },
    changeRadio(){
      if(this.radio ==='1'){
        this.form.condition = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container ::v-deep {
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  .drawer-content {
    flex: 1;
    overflow: auto;
  }
  .rule-content {
    .rule-item {
      background: #fafafa;
      border-radius: 8px;
      padding: 20px;
      font-size: 16px;
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      line-height: 22px;
      .rule-title {
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        .del {
          color: #f1330d;
          font-size: 14px;
        }
      }
    }
    .condition-item {
      background: #fafafa;
      border-radius: 8px;
      padding: 20px;
      font-size: 16px;
      margin-top: 16px;
      display: flex;
      line-height: 22px;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .goods-content {
        max-height: 292px;
        overflow: auto;
        margin-top: 16px;
      }
      .goods-item {
        border-radius: 4px;
        background: #fff;
        margin: 0px auto 16px;
        font-size: 14px;
        color: #333333;
        display: flex;
        padding: 10px;
        line-height: 20px;
        justify-content: space-between;
        align-items: center;
        width: 680px;
        img {
          width: 52px;
          height: 52px;
          border-radius: 6px;
          margin-right: 10px;
        }
        .price {
          color: #f12e29;
        }
      }
      .rule-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-select {
          width: 108px;
          margin-right: 12px;
        }
      }
      .del {
        color: #f1330d;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  .box {
    border-radius: 4px;
    border: 1px solid #dcdfe5;
    font-size: 14px;
    color: #333333;
    padding: 7px 10px;
    margin-right: 12px;
    line-height: 16px;
    background: #fff;
    display: flex;
    align-items: center;
    i {
      font-size: 16px;
      color: #999;
      margin-left: 10px;
    }
  }
  .input-box {
    position: relative;
    margin-right: 12px;
    .el-input__inner {
      padding: 0 30px 0 15px;
    }
    i {
      font-size: 16px;
      color: #999;
      position: absolute;
      right: 10px;
      top: 8px;
    }
  }
  .btn {
    border: 1px solid #0c6fff;
    background: #e7f0ff;
    color: #0c6fff;
  }
  .tips {
    font-size: 12px;
    color: #999999;
    line-height: 20px;
    margin-top: 12px;
  }
}
.line-40 {
  line-height: 36px;
}
</style>
