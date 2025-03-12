<template>
  <div>
    <div>
      <el-radio-group
        v-model="form.capacityMatchType"
        :disabled="type === 'edit'"
      >
        <el-radio label="1">不限区间</el-radio>
        <el-radio label="2">按区间</el-radio>
      </el-radio-group>
    </div>
    <div class="contentBox">
      <div v-if="form.capacityMatchType === '1'">
        <div>人数限制</div>
        <el-input-number
          v-model="form.capacity"
          :controls="false"
          class="w-200 m-r-10"
          controls-position="right"
          placeholder="请输入"
          :min="1"
          :max="999998"
        />
        <span class="tips">只能输入大于0小于999999的整数</span>
      </div>
      <div v-else>
        <div>
          <span>课程金额区间</span>
          <span style="margin-left: 233px">人数限制</span>
        </div>

        <div
          v-for="(item, index) in form.scheduleCapacityAddReq"
          :key="index"
          class="tableItem"
        >
          <div v-if="!index">{{ item.startPrice }}</div>
          <div
            v-if="index > 0 && index < form.scheduleCapacityAddReq.length - 1"
          >
            {{ form.scheduleCapacityAddReq[index - 1].endPrice }}
          </div>
          <div v-if="index === form.scheduleCapacityAddReq.length - 1">
            {{
              `${
                form.scheduleCapacityAddReq[index - 1].endPrice ||
                form.scheduleCapacityAddReq[index - 1].startPrice
              }以上`
            }}
          </div>
          <span
            :class="{
              hidenInput: index === form.scheduleCapacityAddReq.length - 1
            }"
          >至</span>
          <el-input-number
            v-model="item.endPrice"
            :class="{
              hidenInput: index === form.scheduleCapacityAddReq.length - 1
            }"
            :controls="false"
            class="w-115 m-l-10 m-r-10"
            controls-position="right"
            precision
            placeholder="请输入"
            :min="item.startPrice + 1 || 0"
            :max="
              form.scheduleCapacityAddReq[index + 1]
                ? form.scheduleCapacityAddReq[index + 1].endPrice - 1
                : 100000000
            "
            @change="value => handleStartPrice(value, index)"
          /><span
            :class="{
              hidenInput: index === form.scheduleCapacityAddReq.length - 1
            }"
          >(含)</span>
          <el-input-number
            v-model="item.capacity"
            :controls="false"
            class="w-115 m-l-20"
            precision
            controls-position="right"
            placeholder="请输入"
            :min="1"
            :max="999998"
          />
          <div class="btns">
            <div
              v-if="index === form.scheduleCapacityAddReq.length - 2"
              @click="chandleAddStep(item, index)"
            >
              <i class="el-icon-plus" />
            </div>
            <div
              v-if="
                index !== 0 && index !== form.scheduleCapacityAddReq.length - 1
              "
              @click="chandleRemoveStep(index)"
            >
              <i class="el-icon-minus" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="form.capacityMatchType === '2'" class="totalBox">
        合计：总容纳人数{{ capacityTotal }}人
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['type'],
  data: () => ({
    radio: '1',
    step: 0,
    form: {
      scheduleCapacityAddReq: [
        { startPrice: 0, endPrice: undefined, capacity: undefined },
        { startPrice: undefined, endPrice: undefined, capacity: undefined }
      ],
      capacityMatchType: '1',
      capacity: 0
    }
  }),
  computed: {
    capacityTotal() {
      return (
        this.form.scheduleCapacityAddReq?.reduce(
          (accumulator, currentValue) => {
            return accumulator + (currentValue.capacity || 0)
          },
          0
        ) || 0
      )
    }
  },
  methods: {
    setData(data) {
      if (!data?.scheduleCapacityAddReq?.length) {
        this.form = {
          scheduleCapacityAddReq: [
            { startPrice: 0, endPrice: undefined, capacity: undefined },
            { startPrice: undefined, endPrice: undefined, capacity: undefined }
          ],
          capacityMatchType: data?.capacityMatchType || '1',
          capacity: data.capacity
        }
      } else {
        const scheduleCapacityAddReq = data.scheduleCapacityAddReq.map(
          item => ({
            startPrice: item.startPrice / 100,
            endPrice: item.endPrice / 100,
            capacity: item.capacity
          })
        )
        const newForm = {
          ...data,
          scheduleCapacityAddReq: scheduleCapacityAddReq
        }
        this.form = newForm
      }
      this.$forceUpdate()
    },
    getForm() {
      return this.form
    },
    handleStartPrice(value, index) {
      this.form.scheduleCapacityAddReq[index + 1].startPrice = value
    },
    chandleAddStep(item, index) {
      if (index >= 6) return this.$message.warning('已达到最大区间数！')
      if (!item.endPrice || !item.capacity) {
        this.$message.warning('请先填写当前行！')
        return
      }
      this.form.scheduleCapacityAddReq.splice(index + 1, 0, {
        startPrice: item.endPrice,
        endPrice: undefined,
        capacity: undefined
      })
    },
    chandleRemoveStep(index) {
      this.form.scheduleCapacityAddReq.splice(index, 1)
      if (this.form?.scheduleCapacityAddReq[index]?.startPrice) {
        this.form.scheduleCapacityAddReq[index - 1].endPrice =
          this.form.scheduleCapacityAddReq[index].startPrice
      }

      this.$forceUpdate()
    }
  }
}
</script>
<style scoped lang="scss">
.contentBox {
  background: #ffffff;
  border-radius: 4px;
  border: 1px dashed #979797;
  padding: 8px 16px;
  margin-right: 20px;
  position: relative;
  padding-bottom: 32px;
  .totalBox {
    position: absolute;
    width: 100%;
    background: #e4f2fd;
    text-indent: 10px;
    left: 0;
    border-radius: 0 0 4px 4px;
  }
  .tips {
    font-size: 12px;
    color: #999999;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  .tableItem {
    display: flex;
    margin-bottom: 12px;
    .w-115 {
      min-width: 115px !important;
      max-width: 115px !important;
    }
    > div:nth-of-type(1) {
      min-width: 120px !important;
      max-width: 120px;
      border: 1px solid #e9e9e9;
      height: 32px;
      text-align: center;
      border-radius: 5px;
      background: #e9e9e9;
      margin-right: 10px;
    }
    .btns {
      display: flex;
      > div {
        border: 1px dashed #979797;
        height: 32px;
        width: 32px;
        text-align: center;
        margin-left: 5px;
        border-radius: 2px;
        cursor: pointer;
      }
    }
  }
}
.hidenInput {
  visibility: hidden;
}
.w-115 {
  width: 115px;
}
</style>
