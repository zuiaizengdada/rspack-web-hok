<template>
  <el-dialog
    width="550px"
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <div class="oneStamping-container">
      <div>
        确认对以下
        <span class="c_FF8D1A">{{ signFileList.length }}份</span>
        合同协议进行落章吗？
      </div>
      <div
        v-for="(item, index) in showFileList"
        :key="index"
        class="oneStamping-list"
      >
        <span class="f_w_600">{{ item[0].name }}&nbsp;</span>
        <span v-for="(i, j) in item" :key="j" class="fileName"
          >《{{ i.fileName }}》<span v-if="j < item.length - 1">、</span></span
        >
      </div>
    </div>
    <template slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" :loading="loading">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading"
        >确定落章</el-button
      >
    </template>
  </el-dialog>
</template>
<script>
import { autoSignAjax, fallingChapterAjax } from '../../../../api/staff.js'
export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    signFileList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {},
      rules: {},
      showFileList: [],
      uniqueIdArray: [],
      title: '',
      loading: false
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  created() {
    this.title =
      this.signFileList[0]?.oneStampingType === 'single' ? '落章' : '一键落章'
    console.log(this.signFileList, 666666)
    // 创建一个 Map 对象，用于存储分组后的结果
    const groupedMap = new Map()

    // 遍历原始数组
    this.signFileList.forEach(obj => {
      const id = obj.personnelBaseInfoId
      // 如果 Map 中不存在该 id，则创建一个新的数组
      if (!groupedMap.has(id)) {
        groupedMap.set(id, [])
      }
      // 将当前对象添加到对应的数组中
      groupedMap.get(id).push(obj)
    })
    // 将 Map 转换为嵌套数组
    this.showFileList = Array.from(groupedMap.values())
    // 创建去重后的 personnelBaseInfoId 数组
    this.uniqueIdArray = Array.from(groupedMap.keys())
    console.log(this.showFileList, this.uniqueIdArray)
  },
  methods: {
    submit() {
      //对单个合同 或者 对人
      const params =
        this.signFileList[0]?.oneStampingType === 'single'
          ? { contractRelationId: this.signFileList[0].contractRelationId }
          : [...this.uniqueIdArray]
      const ajax =
        this.signFileList[0]?.oneStampingType === 'single'
          ? fallingChapterAjax
          : autoSignAjax
      this.loading = true
      ajax(params)
        .then(res => {
          if (res.code === 1) {
            this.$emit('success')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 10px;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}
.f_w_600 {
  font-weight: 600;
}
.c_FF8D1A {
  color: #ff8d1a;
}
.oneStamping-container {
  height: 200px;
  overflow: auto;
}
.oneStamping-list {
  margin-top: 14px;
}
</style>
