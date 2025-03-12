<template>
  <div class="base-table-item">
    <!--普通文字,如有自定义render,优先以render渲染 -->
    <div
      v-if="item.type === 'text'"
      class="text_hidden"
      :title="item.render ? item.render(renderData) : renderData[item.prop]"
    >
      {{ item.render ? item.render(renderData) : renderData[item.prop] }}
    </div>

    <div
      v-if="item.type === 'multText'"
      :title="item.render ? item.render(renderData) : renderData[item.prop]"
    >
      {{ item.render ? item.render(renderData) : renderData[item.prop] }}
    </div>

    <el-tag v-if="item.type === 'tag'">{{ item.render ? item.render(renderData) : renderData[item.prop] }}</el-tag>

    <!--头像 -->
    <template v-if="item.type === 'avatar'">
      <div>
        <div class="avatar-inner">
          <img class="avatar" :src="renderData[item.prop]" />
        </div>
      </div>
    </template>

    <!--下拉框反显 -->
    <div v-if="item.type === 'select'" class="el-tag">{{ getSelectData(renderData[item.prop], item.options) }}</div>

    <!--popover -->
    <template v-if="item.type === 'popover'">
      <!-- <el-popover
                    :placement="item.placement || 'top-start'"
                    :width="item.width || 400"
                    trigger="hover"
                    :content="renderData[item.key]">
            </el-popover> -->
      <template v-if="renderData[item.prop] && renderData[item.prop].length > 10">
        <el-tooltip class="item" effect="dark" :content="renderData[item.prop]" placement="top" popper-class="mw_400">
          <div>
            {{
              renderData[item.prop].length > 10
                ? `${renderData[item.prop].slice(0, 10)}...`
                : renderData[item.prop].slice(0, 10)
            }}
          </div>
        </el-tooltip>
      </template>
      <span v-else>{{ renderData[item.prop] }}</span>
    </template>

    <!-- 多语言json popover -->
    <template v-if="item.type === 'popoverLang'">
      <el-popover
        :placement="item.placement || 'top-start'"
        :width="item.width || 400"
        trigger="hover"
        :content="langContent"
      >
        <div slot="reference">
          {{ langContent.length > 20 ? `${langContent.slice(0, 20)}...` : langContent.slice(0, 20) }}
        </div>
      </el-popover>
    </template>

    <template v-if="item.type === 'phone'">
      <watchPhoneNumber :default-value="renderData[item.prop]" :copy="item.copy" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import watchPhoneNumber from '@/components/watchPhoneNumber/index'
export default {
  name: 'BaseTableItem',
  components: {
    watchPhoneNumber
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    renderData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  watch: {},
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters(['get_lang']),
    // eslint-disable-next-line vue/return-in-computed-property
    langContent() {
      if (this.item.type === 'popoverLang') {
        let data = this.renderData[this.item.prop]
        let res
        if (!this.item.isJson) {
          data = JSON.parse(data)
        }
        // eslint-disable-next-line prefer-const
        res = data[this.get_lang.code]
        return res
      }
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    getSelectData(val, arr) {
      const item = arr.find((_) => _.value === val)
      if (item && item.label) {
        const data = item.label
        return data
      } else {
        return '--'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.el-tag {
  background-color: rgba(64, 158, 255, 0.1);
  padding: 0 10px;
  height: 32px;
  line-height: 30px;
  font-size: 12px;
  color: #409eff;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid rgba(64, 158, 255, 0.2);
  white-space: nowrap;
}
</style>
