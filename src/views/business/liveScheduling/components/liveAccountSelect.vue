<template>
  <AppSelect
    :get-api-fn="getPage"
    search-key="expertName"
    :live-time="liveTime"
    :value="defaultId"
    :label="value"
    :props="props"
    :placeholder="placeholder"
    v-bind="$attrs"
    :size="100"
    @selected="selected"
    v-on="$listeners"
  >
    <template slot-scope="{ row }">
      <div class="expertName">
        <img style="width: 18px; height: 16px; float: left; margin-right: 5px;border-radius: 100%;" :src="returnImgString(row)">
        <span>{{ row.expertName }}</span>
      </div>
    </template>
  </AppSelect>
</template>

<script>
import AppSelect from './AppSelect.vue'
import { getexpertManPage } from '@/api/order/performanceShare'
import { getOptionsValueByKey } from '@/filters/index.js'
export default {
  name: 'TeacherSelect',
  components: {
    AppSelect
  },
  props: {
    defaultId: {
      type: [String, Number],
      default: ''
    },
    liveTime: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    liveChannel: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      props: {
        label: 'expertName',
        value: 'id'
      }
    }
  },
  computed: {},
  methods: {
    returnImgString(row) {
      let returnString = ''
      this.liveChannel.some(item => {
        if (item.code === row.expertChannel) {
          returnString = item.imageUrl
        }
      })
      return returnString
    },
    getOptionsValueByKey,
    selected(e) {
      this.$emit('selected', e)
    },
    getPage(obj) {
      const data = {
        pageSize: 100,
        pageIndex: 1,
        expertName: obj.expertName,
        ...this.params
      }
      return getexpertManPage(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .tearchInput {
    width: 100%!important;
  }
}
.svg-icon {
  width: 22px;
  height: 22px;
}
.expertName {
  padding-left: 4px;
  width: 125px;
  display: inline-block;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  // display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 18px;
}
</style>
