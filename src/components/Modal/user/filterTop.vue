<template>
  <!-- 顶部筛选栏 -->
  <el-form ref="form" class="filter-module" :model="search" label-width="80px" size="small" :inline="true">
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

    <el-row v-if="open">
      <el-form-item label="创建时间">
        <div class="fl">
          <el-select v-model="search.time.label" placeholder="请选择" class="w-144">
            <el-option
              v-for="item in optionsTime"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-date-picker
            v-model="search.time.value"
            class="w-250 m-l-20"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :unlink-panels="true"
            @change="timeType = ''"
          />

          <div class="btn_ground">
            <div class="btn" :class="{active: timeType === 0}" @click="changeTime(0)">今</div>
            <div class="btn" :class="{active: timeType === 1}" @click="changeTime(1)">昨</div>
            <div class="btn" :class="{active: timeType === 7}" @click="changeTime(7)">近七天</div>
            <div class="btn" :class="{active: timeType === 30}" @click="changeTime(30)">近30天</div>
          </div>
        </div>
      </el-form-item>
    </el-row>

    <el-row v-if="open">
      <el-form-item label="渠道平台">
        <el-select v-model="search.channelSource" placeholder="请选择" class="w-250" @change="channelSourceChange()">
          <el-option
            v-for="item in channelSourceType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="search.channelSource === 1 || search.channelSource === 2 || search.channelSource === 4" label="渠道来源">
        <el-input v-model="search.thirdShopName" disabled class="w-200 m-r-10" />
        <el-button type="primary" @click="selectThirdShop()">选择</el-button>
      </el-form-item>

      <el-form-item v-if="search.channelSource === 3" label="渠道来源">
        <el-select v-model="search.userTerminal" placeholder="请选择" class="w-200">
          <el-option
            v-for="item in userSourceType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="用户状态">
        <el-select v-model="search.status" placeholder="请选择" class="w-250" clearable>
          <el-option label="删除" :value="-1" />
          <el-option label="禁用" :value="0" />
          <el-option label="正常" :value="1" />
          <el-option label="待激活" :value="2" />
        </el-select>
      </el-form-item>
    </el-row>

    <el-row v-if="open">
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
        <!-- <el-button type="text" @click="openAddGroup">新增</el-button> -->
      </el-form-item>
    </el-row>

    <el-row>
      <el-form-item>
        <el-button type="primary" :loading="search.loading" @click="sureSearch">筛选</el-button>
        <!-- <el-button>导入</el-button> -->
        <!-- <el-button>新增</el-button> -->
        <el-button type="text" @click="open = !open">{{ open ? '收起' : '展开' }}</el-button>
        <el-button type="text" @click="clear()">清空所有筛选项</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
import { DateFormat } from '@/utils/index'
import { Add, GetList } from '@/api/user/label'
import { userSourceType } from '@/utils/enum'
export default {
  name: 'FilterTop',
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          user: { label: 'name', value: '' }, // 订单搜索
          time: { label: 1, value: ['', ''] }, // 订单时间
          channelSource: '', // 商品名称
          userSource: '', // 订单状态
          thirdShopId: '', // 第三方店铺id
          thirdShopName: '', // 第三方店铺名称
          labelId: [],
          loading: false,
          status: ''
        }
      }
    }
  },
  data() {
    return {
      options: [
        { label: '昵称', value: 'name' },
        { label: '手机号', value: 'phone' },
        { label: '真实姓名', value: 'realName' },
        { label: '用户uid', value: 'uid' },
        { label: '微信号', value: 'wechatNumber' }
      ],
      optionsTime: [
        { label: '用户注册时间', value: 1 },
        { label: '用户消费时间', value: 2 }
      ],
      channelSourceType: [
        { label: '全部', value: '' },
        { label: '抖店', value: 1 },
        { label: '快手', value: 2 },
        { label: '获课', value: 3 },
        { label: '微店', value: 4 }
      ],
      userSourceType: [
        { label: '全部', value: '' },
        ...userSourceType
      ],
      use_collection: [
        { label: '全部', value: '' }
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
        time: { label: 1, value: ['', ''] }, // 订单时间
        channelSource: '', // 商品名称
        userSource: '', // 订单状态
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        labelId: [],
        loading: false,
        status: ''
      }
      this.$emit('search', res)
    },
    selectLabel() {

    },
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
.filter-module {
  padding: 16px;
  width: 100%;
  min-width: 1122px;
  background-color: #f5f7fa;
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
</style>
