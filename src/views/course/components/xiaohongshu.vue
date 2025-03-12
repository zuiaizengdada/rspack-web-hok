<template>
  <div class="content">
    <div class="content_header">
      <div class="header_left">
        <el-button v-permission="['system:dou:add', permsList]" type="primary" :loading="loading" @click="add()">新增对应</el-button>
      </div>
    </div>

    <div class="content_table">
      <el-table
        v-loading="loading"
        border
        :data="tableData"
        style="width: 100%"
        class="m-t-20"
      >
        <el-table-column
          prop="productId"
          label="商品id"
          min-width="280"
        />
        <el-table-column
          prop="shopName"
          label="店铺名称"
          min-width="280"
        />
        <el-table-column
          prop="createTime"
          label="对应时间"
          min-width="180"
        />
        <el-table-column
          prop="createBy"
          label="对应人"
          min-width="180"
        />
        <el-table-column
          prop="type"
          label="类型"
          min-width="180"
        >
          <template slot-scope="{ row }">
            {{ row.type | getOptionsValue(thirdShopType) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="{ row }">
            <el-button v-permission="['system:dou:remove', permsList]" type="text" @click="_disassociateBatch(row)">移出</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <el-col :span="12">
          <el-pagination
            class="pagination m-t-10"
            :current-page="current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </div>

    <AppDialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="650px"
      height="auto"
      @beforeClose="beforeClose"
    >
      <div id="ss-dialog-content" v-loading="dialog.loading" class="ss-dialog-content">
        <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-width="140px" class="demo-dynamic">
          <el-form-item
            label="店铺名称"
            prop="thirdShopName"
            :rules="{
              required: true, message: '请选择店铺', trigger: 'blur'
            }"
          >
            <el-input v-model="dynamicValidateForm.thirdShopName" disabled class="w-200 m-r-10" />
            <el-button type="primary" @click="selectThirdShop()">选择</el-button>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.domains"
            :id="domain.key"
            :key="domain.key"
            :label="'小红书商品' + (index + 1)"
            :prop="'domains.' + index + '.value'"
            :rules="{
              required: true, message: '商品id不能为空', trigger: 'blur'
            }"
          >
            <el-input :ref="domain.key" v-model.trim="domain.value" class="w-300 m-r-10" />
            <el-button v-if="index > 0" @click.prevent="removeDomain(domain)">删除</el-button>
            <el-button :loading="dialog.loading" @click="addDomain">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="ss-dialog-footer">
        <el-button :loading="dialog.loading" type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
      </div>
    </AppDialog>

    <el-dialog
      :visible.sync="alert.visible"
      width="600px"
      height="auto"
    >
      <div>
        <el-alert
          :closable="false"
          title="提交成功"
          type="success"
          description="以下商品id重复提交"
          show-icon
        />
        <div style="max-height: 400px; overflow: auto;" class="m-t-20">
          <div class="alertItem">
            <AppIconClipboard :src="alert.text">
              <span>一键复制id</span>
            </AppIconClipboard>
          </div>
          <div v-for="(item, index) in alert.data" :key="index" class="alertItem">
            <AppIconClipboard :src="item.productId">
              <span class="m-r-10">商品名称: {{ item.contentName }}</span>
              <span class="m-r-10">商品类型: {{ goodsType_obj[item.goodsType] }}</span>
              <span>重复id: {{ item.productId }}</span>
            </AppIconClipboard>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog/index.vue'
import AppIconClipboard from '@/components/AppIconClipboard'
import { mapGetters } from 'vuex'
import { addGoodsThirdBatch, delGoodsThirdBatch, getGoodsThirdPage } from '@/api/course'
export default {
  components: {
    AppDialog,
    AppIconClipboard
  },
  data() {
    return {
      type: 16, // 1：抖店 2：快手 3：其他 4:微店 7: 小鹅通 10：视频号小店 11：枫页小店
      loading: false,
      current: 1,
      size: 10,
      contentName: '',
      tableData: [],
      total: 0,
      // 新增对应弹框属性
      dialog: {
        visible: false,
        title: '新增对应',
        loading: false
      },
      dynamicValidateForm: {
        thirdShopName: '',
        thirdShopId: '',
        domains: [{
          value: ''
        }]
      },
      id: '',
      alert: {
        visible: false,
        title: '提示',
        data: [],
        text: ''
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters([
      'goodsType_obj',
      'thirdShopType'
    ])
  },
  created() {
    this.id = this.$route.params.id
    this.getList()
  },
  methods: {
    // 点击新增对应
    add() {
      this.dialog.visible = true
      this.resetForm()
    },
    handleSizeChange(val) {
      this.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },

    submitForm(formName) {
      this.$refs.dynamicValidateForm.validate((valid) => {
        if (valid) {
          const list = []
          this.dynamicValidateForm.domains.map(v => {
            list.push({
              shopId: this.dynamicValidateForm.thirdShopId,
              productId: v.value
            })
          })
          this.dialog.loading = true
          const params = {
            goodsId: this.id,
            list,
            type: this.type
          }
          addGoodsThirdBatch(params).then(res => {
            this.dialog.loading = false
            this.dialog.visible = false
            if (res.data && res.data.length > 0) {
              const text = []
              res.data.map(v => {
                text.push(v.productId)
              })
              this.alert = {
                visible: true,
                title: '提示',
                data: res.data,
                text: text.join(';')
              }
            }
            this.getList()
          }).catch(() => {
            this.dialog.loading = false
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs.dynamicValidateForm && this.$refs.dynamicValidateForm.resetFields()
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      const obj = {
        value: '',
        key: Date.now()
      }
      this.dynamicValidateForm.domains.push(obj)
      this.$nextTick(() => {
        document.getElementById('ss-dialog-content').scrollTop = document.getElementById(obj.key).offsetTop
        this.$refs[obj.key][0].focus()
      })
    },
    getList() {
      this.loading = true
      const { type, current, size } = this
      const params = {
        current,
        size,
        type,
        goodsId: this.$route.params.id
      }
      getGoodsThirdPage(params).then(res => {
        console.log(res, '获取的分页数据')
        this.tableData = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击删除
    _disassociateBatch(row) {
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          const param = {
            goodsId: this.id,
            list: [row.productId],
            type: this.type
          }
          this.loading = true
          delGoodsThirdBatch(param).then(res => {
            this.loading = false
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 关闭弹框之前的回调
    beforeClose() {
      this.dynamicValidateForm = {
        thirdShopName: '',
        thirdShopId: '',
        domains: [{
          value: ''
        }]
      }
      this.$refs.dynamicValidateForm.clearValidate()
    },

    selectThirdShop() {
      this.$Select({
        type: 'shop',
        visible: true,
        multiple: false,
        params: { type: 16 },
        success: (res) => {
          this.dynamicValidateForm.thirdShopName = res.shopName
          this.dynamicValidateForm.thirdShopId = res.shopId
        }
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .ss-dialog-content {
      height: auto;
      max-height: 465px;
      overflow: auto;
  }
  .demo-dynamic {
      margin-top: 20px;
  }
  .ss-dialog-footer {
      background-color: #fafbfc;
      padding: 10px;
      text-align: center;
  }
  .alertItem {
    padding: 10px 20px;
    border: 1px solid #dfe6ec;
  }
  .alertItem + .alertItem {
    border-top: none;
  }
  </style>

