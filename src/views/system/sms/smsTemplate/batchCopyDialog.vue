<template>
  <AppDialog
    v-model="config.visible"
    title="批量复制到渠道商"
    width="518px"
    :loading="loading"
    :footer-text="['提交', '取消']"
    height="auto"
    @success="sure"
  >
    <div v-loading="loading" class="batchCopyDialog overflowOuto">
      <div>
        {{ tips }} {{ selectTemArr | filterSelectTemArr }}
      </div>
      <div class="m-t-16">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="(item) in smsChannel" :key="item.id" :label="item.id">{{ item.name }}({{ item.smsTypeVos | filterSmsTypeVos }})</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import { getSmsChannelList, duplicateSmsChannelTemplate } from '@/api/system/sms.js'
import AppDialog from '@/components/AppDialog'
import { smsTypeOption } from '../channelProvider/columns'
export default {
  components: {
    AppDialog
  },
  filters: {
    filterSelectTemArr(val) {
      if (!val || val.length === 0) {
        return ''
      }
      const arr = val.reduce((pre, next) => {
        const obj = smsTypeOption.find(v => v.value === next)
        obj && pre.push(obj.label)
        return pre
      }, [])
      return arr.join('、')
    },
    filterSmsTypeVos(val) {
      if (!val || val.length === 0) {
        return ''
      }
      return val.reduce((pre, next, index) => {
        pre += `${index === 0 ? '' : '/'}${next.name}`
        return pre
      }, '')
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          smsChannel: '',
          arr: []
        }
      }
    }
  },
  data() {
    return {
      smsTypeOption,
      loading: false,
      tips: '将所选的模版复制到以下渠道商，如果所选的模版在目标渠道商名下已经存在则自动跳过；当前已选模版类型为：',
      selectTemArr: [], // 当前已选模板类型
      smsChannel: [], // 需要展示渠道商数据
      checkList: [] // 选择的数据
    }
  },
  watch: {
    'config.visible'(val) {
      if (val) {
        this.selectTemArr = this.config.arr.reduce((pre, next) => {
          if (!pre.includes(next.smsTypeId)) {
            (next.smsTypeId && !pre.includes(Number(next.smsTypeId))) && pre.push(Number(next.smsTypeId))
          }
          return pre
        }, [])
        this.getList()
      }
    }
  },
  mounted() {},
  methods: {
    sure() {
      if (this.checkList.length === 0) {
        return this.$message.error('请选择渠道商')
      }
      this.loading = true
      const standardTemplateList = this.config.arr.reduce((pre, next) => { pre.push(next.standardTemplateId); return pre }, [])
      const data = {
        channelIdList: this.checkList,
        standardTemplateList
      }
      duplicateSmsChannelTemplate(data).then(() => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.$emit('success')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取渠道商列表数据
    getList() {
      this.checkList = []
      this.smsChannel = []
      this.loading = true
      const params = {
        pageIndex: 1,
        pageSize: 99999,
        activeFlag: 2
      }
      getSmsChannelList(params).then(res => {
        this.smsChannel = res.data.items.reduce((pre, next) => {
          if (next.name === this.config.smsChannel) {
            return pre
          }
          let arr = []
          if (next.smsTypeVos) {
            arr = next.smsTypeVos.reduce((pre, next) => { pre.push(next.id); return pre }, [])
          }
          if (!this.isContained(arr, this.selectTemArr)) {
            return pre
          }
          pre.push(next)
          return pre
        }, [])
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 判断两个数组是否包含关系
    isContained (a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false
      if (a.length < b.length) return false
      var aStr = a.toString()
      for (var i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(b[i]) === -1) return false
      }
      return true
    }
  }
}
</script>

<style lang='scss' scoped>
.batchCopyDialog {
  width: 518px;
  height: 152px;
  padding: 16px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
}
</style>
