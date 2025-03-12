<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="auto" size="small" :inline="true">
      <el-row>
        <el-form-item label="模板类型" label-width="70px">
          <el-select v-model="search.smsTypeId" placeholder="请选择" clearable @clear="onSearch" @change="onSearch">
            <el-option v-for="(item) in smsTypeOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道商名称">
          <el-select v-model.trim="search.channelId" placeholder="请输入" class="w-200" filterable clearable @clear="onSearch" @change="onSearch">
            <el-option v-for="(item) in ChannelOption" :key="item.id" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="search.examineStatus" placeholder="请选择" class="w-200" clearable @clear="onSearch" @change="onSearch">
            <el-option v-for="(item) in examineStatusOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" label-width="40px">
          <!-- <el-input v-model.trim="search.tagName" placeholder="请输入" class="w-200" clearable @clear="onSearch" @change="onSearch" /> -->
          <LabelInput
            ref="LabelInput"
            v-model="search.tagName"
            placeholder="请输入"
            maxlength="30"
            @clear="onSearch"
            @keyup.enter.native="onSearch"
            @select="labelSelect"
          />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form-item label-width="0px">
            <el-input v-model.trim="search.tem.value" placeholder="请输入内容" style="width: 333px" clearable @clear="onSearch" @keyup.enter.native="onSearch">
              <el-select slot="prepend" v-model="search.tem.label" placeholder="请选择" style="width: 133px;">
                <el-option v-for="item in searchTemOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="onClear">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col>
          <div class="searchFooter">
            <el-button class="m-r-20" type="primary" icon="el-icon-plus" size="small" @click="onhandleAdd">新增模板</el-button>
            <CustomTabelHeader :columns="columns" v-bind="$attrs" v-on="$listeners" />
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import CustomTabelHeader from './CustomTabelHeader'
import { searchTemOptions, examineStatusOption } from './columns'
import { smsTypeOption } from '../channelProvider/columns'
import { getSmsChannelList } from '@/api/system/sms.js'
import LabelInput from './labelinput'
export default {
  components: {
    CustomTabelHeader,
    LabelInput
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          smsTypeId: '', // 模板类型
          channelId: '', // 渠道商名称
          examineStatus: '', // 审核状态
          tagName: '', // 标签名称
          tem: { label: 'templateName', value: '' }
        }
      }
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      smsTypeOption,
      ChannelOption: [],
      examineStatusOption,
      searchTemOptions
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 获取数据
    init() {
      const params = {
        pageIndex: 1,
        pageSize: 99999
      }
      getSmsChannelList(params).then(res => {
        this.ChannelOption = res.data.items
      })
    },
    onhandleAdd() {
      this.$emit('onhandleAdd')
    },
    onSearch() {
      this.$emit('onSearch')
    },
    onClear() {
      this.$emit('onClear')
    },
    labelSelect(val) {
      this.search.tagName = val.name
      this.$emit('onSearch')
    }
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
  margin-top: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
  .searchFooter {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
  .el-input-group__append, .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
