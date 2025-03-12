<template>
  <div>
    <template v-if="type === 1">
      <el-button v-if="!jumpArr[0].value && jumpArr[0].detail" class="btn_primary" size="mini" @click="selectGoods">选择课程</el-button>
      <goodsDetail v-else :detail="jumpArr[0].detail" :loading="loading" @againSelect="selectGoods" />
    </template>
    <template v-if="type === 2">
      <el-select v-model="jumpArr[1].value" class="w-200" placeholder="请选择" filterable @change="jumpChange">
        <el-option v-for="(item) in jumpArr[1].option" :key="item.catalogueId" :label="item.catalogueName" :value="item.catalogueId" />
      </el-select>
    </template>
    <template v-else-if="type === 3">
      <el-input v-model="jumpArr[2].value" style="width: 486px;" placeholder="请输入内容" class="input-with-select" @input="jumpInputChange">
        <el-select slot="prepend" v-model="jumpArr[2].optionValue" placeholder="请选择" style="width: 93px;">
          <el-option v-for="(item) in jumpArr[2].option" :key="item" :label="item" :value="item" />
        </el-select>
      </el-input>
    </template>
    <template v-else-if="type === 7">
      <el-select
        v-model="jumpArr[3].value"
        class="w-200"
        placeholder="请选择"
        filterable
        remote
        :remote-method="remoteMethod"
        :loading="loading"
        @change="jumpChange"
      >
        <el-option
          v-for="(item) in options"
          :key="item.id"
          :label="item.title"
          :value="item.id"
          :disabled="item.disabled"
        />
      </el-select>
    </template>
    <!-- 视频号主页 -->
    <template v-else-if="type === 9">
      <el-input
        v-model="jumpArr[7].value"
        class="w-200"
        maxlength="100"
        show-word-limit
        placeholder="请选择"
        @change="jumpChange"
      />
      <div class="tips">输入视频号ID，设置后在微信小程序中验证确保可跳转</div>
    </template>
  </div>
</template>

<script>
import goodsDetail from './goodsDetail.vue'
import { getGoodsDetail } from '@/api/course.js'
import {
  specialPage
  // specialDetail
} from '@/api/messageManagement/special'
export default {
  components: {
    goodsDetail
  },
  props: {
    type: {
      type: [Number, String],
      default: ''
    },
    jumpArr: {
      type: Array,
      default: () => {
        return [
          { value: '', detail: {} }, // 课程详情
          { value: '', option: [], optionValue: '' }, // 课程分类
          { value: '', option: ['https://', 'http://'], optionValue: 'https://' }, // 网页
          { value: '' }, // 微信小程序
          { value: '' }, // 抖音小程序
          { value: '' }, // 推广页面
          { value: '' },
          { value: '' } // 视频号主页
        ]
      }
    }
  },
  data() {
    return {
      loading: false,
      options: []
    }
  },
  watch: {
    // 'jumpArr[0].value': {
    //   handler(val) {
    //     if (this.type && this.type === 1 && this.jumpArr[0].value && this.jumpArr[0].detail.goodsType) {
    //       this.getGoodsDetail(this.jumpArr[0].value)
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {
    this.remoteMethod()
  },
  methods: {
    // 获取课程详情
    getGoodsDetail(id) {
      this.loading = true
      getGoodsDetail(id).then(res => {
        this.jumpArr[0].detail = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    async remoteMethod(query) {
      try {
        const { data } = await specialPage({ pageSize: 999, pageIndex: 1, title: query, status: 1 })
        this.options = data.items
        // const ids = data.items.map(i => i.id)
        // const id = this.jumpArr[3].value
        // if (!ids.includes(id) && id) {
        //   const { data } = await specialDetail({ id })
        //   if (data.status === 0) {
        //     this.options.unshift({ title: data.title, id, disabled: true })
        //   }
        //   console.log(data)
        // }
      } catch (e) {
        this.options = []
      }
    },
    // 选择课程
    selectGoods() {
      this.$SelectGoods({
        visible: true,
        multiple: false,
        currentId: '3',
        disabledFn: (res) => {
          if (res.onlineList && res.goodsType === 5 && res.onlineList && res.onlineList.length > 0) {
            const sum = res.onlineList.reduce((pre, next) => {
              return pre + (next.availableNum ? Number(next.availableNum) : 0)
            }, 0)
            console.log(sum, 'sum')
            return sum <= 0
          } else {
            return false
          }
        },
        tabList: [
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' },
          { id: '7', name: '套餐课', api: '' },
          { id: '10', name: '直播课', api: '' }
        ],
        success: (res) => {
          console.log(res, 'res')
          if (res.length > 0) {
            this.jumpArr[0].detail = res[0]
            this.jumpArr[0].value = res[0].goodsId
            this.$emit('change', { goodsType: res[0].goodsType, skipText: res[0].goodsId })
          }
        }
      })
    },
    jumpChange(res) {
      this.$emit('change', { skipText: res })
    },
    jumpInputChange(e) {
      if (e.length === 0) {
        this.$emit('change', { skipText: '' })
      } else {
        this.$emit('change', { skipText: this.jumpArr[2].optionValue + e })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.btn_primary {
  height: 32px;
}
.tips{
  color: #999;
  font-size: 14px;
}
</style>
