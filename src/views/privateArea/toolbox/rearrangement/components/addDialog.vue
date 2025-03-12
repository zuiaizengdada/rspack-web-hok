<template>
  <el-drawer :title="type === 'add' ? '新增' : '编辑'" :visible.sync="visible" size="1000px" @close="handleCancel">
    <div class="warp">
      <div style="padding: 0 15px">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="110px" @submit.native.prevent>
          <el-form-item label="排重商品名称" prop="goodsName">
            <el-input v-model="ruleForm.goodsName" show-word-limit maxlength="60" :clearable="true"
              style="width: 250px; margin-right: 10px" @input="handleInput" @blur="handleBlur" />
            <el-button v-if="type === 'edit'" type="primary" size="small" @click="handleOk">保存</el-button>
            <span style="color: #666666">（不允许重复，建议使用IP老师+关键词+金额）</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="setBtn">
        <div><span>*</span>商品</div>
        <el-button type="primary" size="small" @click="handleGoods">选择商品</el-button>
      </div>
      <dynamicTable ref="table" v-model="ruleForm.goodsAddRequests" :columns="columns" :immediate-check="true"
        :get-list-api="getList" :config-props="params" class="content" :hide-pagination="type === 'add'">
        <template #coverVerticalUrl="{ row }">
          <img style="height: 60px" :src="row.coverVerticalUrl" alt="" />
        </template>
        <template #action="{ row }">
          <el-button type="text" style="color: #f53f3f" @click="handleRemove(row)">移除</el-button>
        </template>
      </dynamicTable>
      <div v-if="type === 'add'" class="btnBox">
        <el-button v-if="type === 'add'" type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleCancel">返回</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import dynamicTable from '@/components/DynamicTable/table'
import dict from '@/strings'
import moment from 'moment'
import {
  removeReachConfig,
  addReachList,
  ReachListDetails,
  updateReachList,
  getReachDetail
} from '@/api/privateArea/toolbox'
const price = row => {
  if (row.saleType === 0) return '免费'
  if (row.saleType === 2) return '加密'
  if (row.minPrice && row.maxPrice) {
    if (row.minPrice !== row.maxPrice) {
      return `${(row.minPrice / 100).toFixed(2)} - ${(
        row.maxPrice / 100
      ).toFixed(2)}`
    }
    return `${(row.minPrice / 100).toFixed(2)}`
  }
  if (row.salePrice) {
    return (row.salePrice / 100).toFixed(2)
  }
  return '__'
}
export default {
  components: {
    dynamicTable
  },
  props: {},
  data: () => ({
    columns: [
      {
        prop: 'coverVerticalUrl',
        label: '头图',
        type: 'slot'
      },
      {
        prop: 'goodsId',
        label: '商品ID'
      },
      {
        prop: 'contentName',
        label: '商品名称'
      },
      {
        prop: 'lecturerVos',
        label: 'IP',
        slotFn: row =>
          row?.lecturerVos?.map(item => item.lecturerName)?.join(',')
      },
      {
        prop: 'price',
        label: '价格',
        slotFn: row => price(row)
      },
      {
        prop: 'createTime',
        label: '加入时间'
      },
      {
        prop: 'goodsType',
        label: '类型',
        slotFn: row =>
          dict?.GOODS_STATUS.find(item => item.value === row.goodsType)?.label
      },
      {
        prop: 'action',
        type: 'slot',
        label: '操作',
        width: 100
      }
    ],
    visible: false,
    tableData: [],
    type: 'add',
    params: { pageIndex: 1, pageSize: 10 },
    initData: {},
    ruleForm: { goodsName: '', goodsAddRequests: [] },
    rules: {
      goodsName: [
        {
          required: true,
          message: '请输入排重商品名称',
          trigger: 'change'
        }
      ]
    }
  }),
  methods: {
    // 限制  输入 文字，数字，英文 （） -
    formatting(value) {
      const regex = /[^ \u4e00-\u9fa5a-zA-Z0-9()\-]/g
      const filteredValue = value.replace(regex, '')
      return filteredValue
    },
    handleInput(value) {
      this.ruleForm.goodsName = this.formatting(value)
    },
    // 去掉字符串前后空格
    handleBlur() {
      this.ruleForm.goodsName = this.ruleForm.goodsName.trim()
    },
    handleOk() {
      if (this.type === 'edit' && this.ruleForm.goodsName) {
        this.updateReachList({ goodsName: this.ruleForm.goodsName })
      }
    },
    async handleRemove(row) {
      if (this.type === 'add') {
        this.ruleForm.goodsAddRequests = this.ruleForm.goodsAddRequests.filter(
          item => item.goodsId !== row.goodsId
        )
        return
      }
      const data = {
        goodsId: row.goodsId,
        id: this.initData.id
      }
      const { code } = await removeReachConfig(data)
      if (code === 1) {
        this.$nextTick(() => {
          if (this.ruleForm.goodsAddRequests.length === 1) {
            this.params.pageIndex = Math.max(this.params.pageIndex - 1, 1)
          }
          this.$refs.table.onRefresh({ ...this.params, id: this.initData.id })
        })
      }
    },
    async handleGoods() {
      let goodsReqList = []
      if (this.type === 'add') {
        goodsReqList = this.ruleForm.goodsAddRequests.map(item => item.goodsId)
      }
      if (this.type === 'edit') {
        const { data } = await ReachListDetails({
          pageIndex: 1,
          pageSize: 10000,
          id: this.initData.id
        })
        goodsReqList = data.items?.map(item => item.goodsId) || []
      }
      this.$SelectGoods({
        visible: true,
        multiple: true,
        tearchSearch: true,
        isSearchPrice: true,
        check: goodsReqList,
        currentId: '3',
        tabList: [
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' },
          { id: '7', name: '套餐课', api: '' },
          { id: '10', name: '直播课', api: '' }
        ],
        success: res => {
          if (this.type === 'add') {
            const newList = res?.map(item => ({
              ...item,
              maxPrice: item?.maxSalePrice,
              minPrice: item.salePrice,
              createTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }))
            this.ruleForm.goodsAddRequests = [
              ...newList,
              ...this.ruleForm.goodsAddRequests
            ]
          } else {
            const newList =
              res?.map(item => ({
                goodsId: item.goodsId,
                goodsName: item.contentName
              })) || []
            this.updateReachList({ goodsAddRequests: newList })
          }
        }
      })
    },
    async updateReachList(value) {
      const { code, data = '修改成功!' } = await updateReachList({
        ...value,
        id: this.initData.id
      })
      if (code !== 1) return
      this.$message.success(data || '操作成功！')
      if (value?.goodsAddRequests?.length) {
        this.$nextTick(() => {
          this.$refs.table.onRefresh()
        })
      }
    },
    async handleSave() {
      await this.$refs.ruleForm.validate()
      if (!this.ruleForm.goodsAddRequests?.length) {
        return this.$message.warning('请选择商品！')
      }
      const goodsAddRequests = this.ruleForm.goodsAddRequests.map(item => ({
        goodsId: item.goodsId,
        goodsName: item.contentName
      }))
      const data = {
        ...this.ruleForm,
        goodsAddRequests
      }
      const { code } = await addReachList(data)
      if (code === 1) {
        this.handleCancel()
        this.$message.success('保存成功！')
      }
    },
    handleCancel() {
      this.$emit('handleOk')
      this.visible = false
    },
    getList(params) {
      if (this.type === 'add') return []
      this.params = params
      return ReachListDetails({ ...params, id: this.initData.id })
    },
    async open(data) {
      this.ruleForm = { goodsName: '', goodsAddRequests: [] }
      this.params = { pageIndex: 1, pageSize: 10 }
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
      this.visible = true
      this.type = data.type
      this.initData = data.initData || {}
      // 编辑执行
      if (data.initData?.id && data.type === 'edit') {
        this.getReachDetail()
        this.$nextTick(() => {
          this.$refs.table.onSubmit({ id: this.initData.id })
        })
      }
    },
    async getReachDetail() {
      const { code, data } = await getReachDetail(this.initData.id)
      if (code === 1 && data) this.ruleForm.goodsName = data.goodsName
    }
  }
}
</script>
<style lang="scss" scoped>
.warp {
  display: flex;
  flex-direction: column;
  height: 100%;

  >.setBtn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    margin-top: -10px;

    >div:nth-of-type(1) {
      >span {
        color: red;
        margin-right: 4px;
      }
    }
  }

  >.content {
    flex: 1;
    overflow: scroll;
    padding: 0 15px;
    padding-bottom: 20px;
  }

  >.btnBox {
    padding: 10px;
    display: flex;
    align-items: center;
    box-shadow: 0 -8px 15px rgba(118, 114, 167, 0.2);
  }
}
</style>
