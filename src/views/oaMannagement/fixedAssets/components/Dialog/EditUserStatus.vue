<template>
  <base-dialog
    v-bind="$attrs"
    :title="title"
    :append-to-body="true"
    :loading="loading"
    width="600px"
    v-on="$listeners"
    @cancel="cancelDialog"
    @confirm="confirmDialog"
  >
    <ul slot="content" v-loading="loading">
      <li
        v-for="item in userStatus"
        :key="item.color"
        class="status-item flex items-center"
      >
        <span class="line" :style="{ background: item.color }" />
        <p>
          <span
            v-for="_item in item.children"
            :key="_item.label"
            class="tag cursor-pointer"
            :class="{ active: form.state === _item.value }"
            @click="handleClickTag(_item)"
          >
            {{ _item.label }}</span
          >
        </p>
      </li>
    </ul>
  </base-dialog>
</template>
<script>
import BaseDialog from '@/components/BaseDialog.vue'
import { userStatus } from './constantsEditUserStatus'
import {
  assetUpdateState,
  assetBatchUpdateStateAjax
} from '../../../api/assets.js'
export default {
  components: {
    BaseDialog
  },
  props: {
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      userStatus,
      form: {
        assetId: '',
        state: -1,
        assetIds: []
      },
      type: 1, // 1 单个 2批量
      loading: false
    }
  },
  computed: {
    title() {
      return this.type === 2 ? '批量修改使用状态' : '修改使用状态'
    }
  },
  watch: {
    '$attrs.visible'(newVal) {
      if (newVal === true) {
        this.init()
        if (Object.keys(this.row).length === 0 && this.selectList.length > 0) {
          // 批量
          this.form.assetIds = this.selectList.map(v => v.assetId)
          this.form.state = this.selectList[0].state
          this.type = 2
        } else {
          // 单个
          this.form.state = this.row.state
          this.form.assetId = this.row.assetId
          this.type = 1
        }
      }
    }
  },
  methods: {
    init() {
      this.form = {
        assetId: '',
        state: -1,
        assetIds: []
      }
      this.loading = false
    },
    handleClickTag(data) {
      this.form.state = data.value
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    confirmDialog() {
      if (this.type === 1) {
        this.$uweb?.setAction('Event_oa_fixedAsset_updateState')
      } else if (this.type === 2) {
        this.$uweb?.setAction('Event_oa_fixedAsset_batchUpdateState')
      }
      const params = {
        ...(this.type === 1 && { assetId: this.form.assetId }),
        ...(this.type === 2 && { assetIds: this.form.assetIds }),
        state: this.form.state
      }
      const ajax =
        this.type === 1 ? assetUpdateState : assetBatchUpdateStateAjax
      this.loading = true
      ajax(params)
        .then(res => {
          if (res.code === 1) {
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.$emit('success')
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.status-item {
  margin-bottom: 24px;
  padding-left: 20px;
  .line {
    width: 4px;
    height: 20px;
    margin-right: 24px;
  }
  p {
    .tag {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      padding: 0 20px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      margin-right: 32px;
      font-size: 14px;
      &:hover {
        background: #f3f3f3;
      }
      &.active {
        border: 1px solid #0c6fff;
        color: #0c6fff;
      }
    }
  }
}
</style>
