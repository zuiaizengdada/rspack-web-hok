<template>
  <div class="filterTopCrm">
    <HokSearchForm
      :form-opts="searchForm"
      :ref-obj.sync="searchForm.ref"
      class="pd20"
      :isMoreOutside="false"
      style="margin-top: 20px"
    >
      <template #user>
        <div class="flex" style="padding-left: 8px">
          <el-select
            v-model="searchForm.formData.user.label"
            placeholder="请选择"
            style="width: 115px; border-right: 1px solid #dcdee1"
            @change="searchFn()"
          >
            <el-option label="电话" value="userPhone" />
            <el-option label="姓名" value="userName" />
            <el-option label="邮箱" value="email" />
          </el-select>
          <el-input
            style="padding-left: 10px"
            v-model="searchForm.formData.user.value"
          />
        </div>
      </template>
      <template #time>
        <div class="flex">
          <el-date-picker
            v-model="searchForm.formData.time"
            style="padding-left: 20px"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </template>
      <template #punchTaskId>
        <div class="flex">
          <m-select
            filterable
            remote
            reserve-keyword
            :param="{ value: 'id', label: 'title' }"
            placeholder="请输入任务名称"
            v-model="searchForm.formData.punchTaskId"
            :dict-list="punchTaskIdList"
            :remote-method="remoteMethod"
            :loading="punchTaskLoading"
          />
        </div>
      </template>

      <template #isCommend>
        <div class="flex">
          <m-select
            v-model="searchForm.formData.isCommend"
            :dict-list="searchForm.optionsObj.isCommendList"
          />
        </div>
      </template>

      <template #isFeatured>
        <div class="flex">
          <m-select
            v-model="searchForm.formData.isFeatured"
            dict-key="IS_FEATURED"
          />
        </div>
      </template>

      <template #content>
        <div class="flex" style="padding-left: 8px">
          <el-input
            placeholder="请输入内容"
            style="padding-left: 10px"
            v-model="searchForm.formData.content"
          />
        </div>
      </template>
    </HokSearchForm>
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { getPunchRecordList } from '@/api/deliver/punch'
import { formConfig } from './config'
export default {
  components: { HokSearchForm },
  data() {
    return {
      punchTaskLoading: false,
      search: {
        user: { label: 'userPhone', value: '' } // 学员搜索
      },
      punchTaskIdList: [],
      searchForm: {
        ...formConfig,
        operatorList: [
          {
            label: '查询',
            bind: {
              plain: true
            },
            fn: () => {
              this.searchFn()
            }
          },
          {
            label: '重置',
            type: 'plain',
            fn: () => {
              this.onClear()
            }
          }
        ]
      },
      ChannelOption: []
    }
  },
  mounted() {
    this.searchForm.formData = {
      user: { label: 'userPhone', value: '' }, // 学员搜索
      time: [], // 提交日期
      // 训练状态
      punchTaskId: '', // 任务
      // 采购状态
      isCommend: '', // 点评状态
      isFeatured: '', // 是否精选
      // 时间类型
      content: '', // 打卡内容
      // 开始时间
      startTime: '',
      // 结束时间
      endTime: ''
    }
  },
  methods: {
    async remoteMethod(query) {
      console.log(9999, query)
      if (query !== '') {
        this.punchTaskLoading = true
        const { code, data } = await getPunchRecordList({
          pageNum: 1,
          pageSize: 10000,
          title: query,
          punchId: this.$route.query.id
        })
        this.punchTaskLoading = false
        if (code === 1) {
          this.punchTaskIdList = data
        }
      } else {
        this.punchTaskIdList = []
      }
    },
    searchFn() {
      this.$emit('onSearch', this.searchForm.formData)
    },
    onClear() {
      this.searchForm.formData = {
        user: { label: 'userPhone', value: '' }, // 学员搜索
        time: [], // 提交日期
        // 训练状态
        punchTaskId: '', // 任务
        // 采购状态
        isCommend: '', // 点评状态
        isFeatured: '', // 是否精选
        // 时间类型
        content: '', // 打卡内容
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: ''
      }
      this.$emit('onSearch', {})
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTopCrm {
  ::v-deep .hok-search-form-btn {
    display: inline-block;
  }
}
</style>
