<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form ref="form" class="filter-module" :model="search" label-width="80px" size="small" :inline="true">
        <div>
          <el-row>
            <el-form-item label="用户搜索">
              <el-select v-model="search.user.label" placeholder="请选择" class="w-144">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input v-model.trim="search.user.value" class="w-250 m-l-20" />
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="用户标签" prop="labelId">
              <el-tag
                v-for="(item, index) in search.labelId"
                :key="item.labelId"
                class="m-r-10"
                closable
                @close="handleClose(index)"
              >{{ item.labelName }}</el-tag>
              <el-autocomplete
                v-model="state"
                class="m-r-10"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
              />
            </el-form-item>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="filterTopRight">
      <el-button type="primary" @click="sureSearch">筛选</el-button>
      <el-button style="margin-left: 0px" class="m-t-20" @click="clear()">清空</el-button>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '@/utils/index'
import { Add, GetList } from '@/api/user/label'
export default {
  name: 'FilterTop',
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          user: { label: 'name', value: '' }, // 订单搜索
          labelId: [],
          loading: false
        }
      }
    }
  },
  data() {
    return {
      options: [
        { label: '昵称', value: 'name' },
        { label: '真实姓名', value: 'realName' }
      ],
      timeType: '',
      open: true, // 收起/展开
      // 弹框属性
      modal: {
        title: '新增标签',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false
      },
      form: {
        labelName: '',
        labelType: 0
      },
      rules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      state: '' // 标签搜索的绑定值
    }
  },
  created() {
    // this.changeTime(30)
  },
  methods: {
    changeTime(number) {
      this.timeType = number
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * number)
      this.$set(this.search.time, 'value', [DateFormat(start, 'yyyy-MM-dd'), DateFormat(end, 'yyyy-MM-dd')])
    },
    sureSearch() {
      this.$emit('search', this.search)
    },
    clear() {
      // this.changeTime(30)
      this.timeType = ''
      const res = {
        user: { label: 'name', value: '' }, // 订单搜索
        labelId: [],
        loading: false
      }
      this.$emit('search', res)
    },
    selectLabel() {},
    // 打开新建标签
    openAddGroup() {
      this.modal = {
        title: '新建',
        type: 1,
        visible: true
      }
      this.form = {
        labelName: '',
        labelType: 0
      }
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    // 新增确定
    sendSuccess() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.form))
          let res = null
          if (this.modal.type === 1) {
            // 新增
            res = await Add(data)
          }
          if (res) {
            this.closeModal()
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success'
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭新增弹框
    closeModal() {
      // this.groupStore.clearForm()
      this.modal.visible = false
    },
    // 标签远程搜索
    querySearchAsync(queryString, cb) {
      const params = {
        size: 20,
        current: 1,
        labelName: queryString
      }
      GetList(params).then(res => {
        if (res.data && res.data.records) {
          // eslint-disable-next-line no-return-assign
          res.data.records && res.data.records.map(v => v.value = v.labelName || '')
          cb(res.data.records)
        } else {
          cb([])
        }
      })
    },
    // 标签选择触发
    handleSelect(item) {
      if (this.search.labelId.length === 20) {
        this.$message.warning('最多只能选择20个标签')
      }
      const arr = this.search.labelId.filter(v => v.labelId === item.labelId)
      if (arr.length === 0) {
        this.search.labelId.push(item)
        this.$emit('search', this.search)
      } else {
        this.$message.warning('该标签已选择')
      }
      this.state = ''
    },
    handleClose(i) {
      this.search.labelId.splice(i, 1)
      this.$emit('search', this.search)
    },
    selectThirdShop() {
      this.$Select({
        type: 'shop',
        visible: true,
        multiple: false,
        params: { type: this.search.channelSource },
        success: (res) => {
          const search = JSON.parse(JSON.stringify(this.search))
          search.thirdShopName = res.shopName
          search.thirdShopId = res.shopId
          this.$emit('search', search)
        }
      })
    },
    channelSourceChange() {
      const search = JSON.parse(JSON.stringify(this.search))
      search.thirdShopName = ''
      search.thirdShopId = ''
      this.$emit('search', search)
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  background-color: #f5f7fa;
  width: 100%;
  display: flex;
  position: relative;
  .filterTopLeft {
    flex: 1 0 0;
  }
  .filterTopRight {
    border-left: 1px solid  #E7E7E7;
    padding: 20px;
    width: 107px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .fiterTopTagger {
    position: absolute;
    bottom: 0;
    left: 50%;
  }
}
.filter-module {
  padding: 16px;
  width: 100%;
}

.btn_ground {
  display: flex;
  margin-left: 8px;
  .btn {
    padding: 0 16px;
    color: #333;
    margin-right: 8px;
    margin-bottom: 0;
    float: left;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background: #fff;
    cursor: pointer;
  }
  .active {
    border-color: #2A75ED;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
</style>
