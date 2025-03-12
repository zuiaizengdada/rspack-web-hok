<template>
  <div class="filterBox">
    <el-form :model="search" size="small" label-width="95px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="学员电话">
            <el-input
              v-model="search.phone"
              clearable
              placeholder="学员电话"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="跟进人手机号">
            <el-input
              v-model="search.followPhone"
              style="width: 100%"
              clearable
              placeholder="跟进人手机号"
            /> </el-form-item></el-col>
        <el-col :span="6">
          <el-form-item label="分配时间">
            <el-date-picker
              v-model="search.allocationDatetime"
              style="width:100%"
              type="daterange"
              range-separator="至"
              :clearable="false"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="加微时间">
            <el-date-picker
              v-model="search.addWxDatetime"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item class="btnBox">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { DateFormat } from '@/utils/index'
export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => ({
        addWxDatetime: [],
        allocationDatetime: []
      })
    }
  },
  data: () => ({
    selectDate: ''
  }),
  computed: {
    pickerOptions() {
      return {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime()
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: time => {
          if (this.selectDate !== '') {
            const one = 28 * 24 * 3600 * 1000
            const minTime = this.selectDate - one
            const maxTime = this.selectDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      }
    }
  },
  created() {},
  methods: {
    onSubmit() {
      this.$emit('onSubmit')
    },
    onReset() {
      const search = {
        addWxDatetime: [],
        allocationDatetime: [
          DateFormat(
            new Date(new Date().getTime() - 28 * 24 * 60 * 60 * 1000),
            'yyyy-MM-dd hh:mm:ss'
          ),
          DateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        ]
      }
      this.$emit('onSubmit', search)
    }
  }
}
</script>
<style lang="scss" scoped>
.filterBox::v-deep {
  padding: 0 20px;
  padding-top: 20px;
  .btnBox > div {
    margin-left: 0 !important;
    text-align: right;
  }
}
</style>
